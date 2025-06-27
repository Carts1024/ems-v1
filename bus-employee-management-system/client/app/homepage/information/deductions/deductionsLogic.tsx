/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';

export interface Deductions {
  id: number;
  name: string;
  description: string;
}

export const DeductionsLogic = () => {
  const [deductions, setDeductions] = useState<Deductions[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState<Deductions | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/deduction/types';

  // API Functions
  const fetchDeductions = async (): Promise<Deductions[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching deductions:', error);
      showError('Error', 'Failed to fetch deductions. Please try again.');
      return [];
    }
  };

  const createDeduction = async (name: string, description: string): Promise<Deductions | null> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating deduction:', error);
      showError('Error', 'Failed to create deduction. Please try again.');
      return null;
    }
  };

  const updateDeduction = async (id: number, name: string, description: string): Promise<Deductions | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating deduction:', error);
      showError('Error', 'Failed to update deduction. Please try again.');
      return null;
    }
  };

  const deleteDeduction = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting deduction:', error);
      showError('Error', 'Failed to delete deduction. Please try again.');
      return false;
    }
  };

  // Load deductions on component mount
  useEffect(() => {
    const loadDeductions = async () => {
      setLoading(true);
      const fetchedDeductions = await fetchDeductions();
      setDeductions(fetchedDeductions);
      setLoading(false);
    };

    loadDeductions();
  }, []);

  const filteredDeductions = useMemo(() => {
    return deductions.filter(deduct => 
      deduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deduct.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deductions, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedDeductions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDeductions.slice(start, start + pageSize);
  }, [filteredDeductions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDeductions.length / pageSize);

  const handleAdd = async (name: string, description: string) => {
    setIsOperationLoading(true);
    const newDeduction = await createDeduction(name, description);
    
    if (newDeduction) {
      setDeductions(prev => [...prev, newDeduction]);
      showSuccess('Success', 'Deduction added successfully.');
    }
    setIsOperationLoading(false);
  };

  const handleEdit = async (updatedName: string, updatedDescription: string) => {
    if (!selectedDeduction) return;

    setIsOperationLoading(true);
    const updatedDeduction = await updateDeduction(selectedDeduction.id, updatedName, updatedDescription);
    
    if (updatedDeduction) {
      setDeductions(prev => prev.map(deduct => 
        deduct.id === selectedDeduction.id ? updatedDeduction : deduct
      ));
      showSuccess('Success', 'Deduction updated successfully.');
    }
    setIsOperationLoading(false);
  };

  const handleDeleteRequest = async (deduction: Deductions) => {
    const result = await showConfirmation('Are you sure you want to delete this deduction?');
    if (result.isConfirmed) {
      setIsOperationLoading(true);
      const success = await deleteDeduction(deduction.id);
      
      if (success) {
        setDeductions(prev => prev.filter(d => d.id !== deduction.id));
        showSuccess('Success', 'Deduction deleted successfully.');
      }
      setIsOperationLoading(false);
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    deductions,
    loading,
    isOperationLoading,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDeduction,
    setSelectedDeduction,
    filteredDeductions,
    paginatedDeductions,
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