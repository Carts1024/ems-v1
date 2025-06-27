 
 
import { useState, useMemo, useEffect, useCallback } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';

export interface Benefits {
  id: number;
  name: string;
  description: string;
}

export const BenefitsLogic = () => {
  const [benefits, setBenefits] = useState<Benefits[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefits | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // ---- API URL ----
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---- Fetch Benefits Function ----
  const fetchBenefits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/benefit/types`);
      if (!res.ok) throw new Error('Failed to fetch benefit types');
      
      const data = await res.json();
      setBenefits(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching benefit types:', err);
      showError('Error', 'Failed to fetch benefit types');
      setLoading(false);
    }
  }, [API_URL]);

  // ---- Fetch data on mount ----
  useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  const filteredBenefits = useMemo(() => {
    return benefits.filter(b => 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [benefits, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedBenefits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBenefits.slice(start, start + pageSize);
  }, [filteredBenefits, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBenefits.length / pageSize);

  const handleAdd = async (name: string, description: string) => {
    if (operationLoading) return;
    
    try {
      setOperationLoading(true);

      const newBenefitData = {
        name: name.trim(),
        description: description.trim() || 'No description'
      };

      const res = await fetch(`${API_URL}/benefit/types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenefitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create benefit type');
      }

      await res.json(); // Consume response
      showSuccess('Success', 'Benefit type added successfully.');
      
      // Refresh benefits list
      await fetchBenefits();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating benefit type:', error);
      showError('Error', (error as Error).message || 'Failed to create benefit type');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = async (updatedName: string, updatedDescription: string) => {
    if (!selectedBenefit || operationLoading) return;
    
    try {
      setOperationLoading(true);

      const updateData = {
        name: updatedName.trim(),
        description: updatedDescription.trim() || 'No description'
      };

      const res = await fetch(`${API_URL}/benefit/types/${selectedBenefit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update benefit type');
      }

      showSuccess('Success', 'Benefit type updated successfully.');
      
      // Refresh benefits list
      await fetchBenefits();
      setShowEditModal(false);
      setSelectedBenefit(null);
    } catch (error) {
      console.error('Error updating benefit type:', error);
      showError('Error', (error as Error).message || 'Failed to update benefit type');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteRequest = async (benefit: Benefits) => {
    if (operationLoading) return;
    
    const result = await showConfirmation(
      `Are you sure you want to delete the benefit type "${benefit.name}"?<br/><small>This action cannot be undone.</small>`
    );
    
    if (result.isConfirmed) {
      try {
        setOperationLoading(true);

        const res = await fetch(`${API_URL}/benefit/types/${benefit.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete benefit type');
        }

        showSuccess('Success', 'Benefit type deleted successfully.');
        
        // Refresh benefits list
        await fetchBenefits();
        
        // Close any open modals
        if (selectedBenefit?.id === benefit.id) {
          setShowEditModal(false);
          setSelectedBenefit(null);
        }
      } catch (error) {
        console.error('Error deleting benefit type:', error);
        showError('Error', (error as Error).message || 'Failed to delete benefit type');
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    benefits,
    loading,
    operationLoading,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedBenefit,
    setSelectedBenefit,
    filteredBenefits,
    paginatedBenefits,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    openActionDropdownIndex,
    toggleActionDropdown,
  };
};