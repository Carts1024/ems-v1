import { useState, useMemo, useEffect, useCallback } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';

export interface Position {
  id: number;
  positionName: string;
  department: string;
  departmentId?: number;
}

export const PositionsLogic = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<{ id: number; departmentName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // ---- API URL ----
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ---- Fetch Positions Function ----
  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/positions`);
      if (!res.ok) throw new Error('Failed to fetch positions');
      
      const data = await res.json();
      const mapped = data.map((pos: {
        id: number;
        positionName: string;
        department?: { id: number; departmentName: string };
        departmentId?: number;
      }) => ({
        id: pos.id,
        positionName: pos.positionName,
        department: pos.department?.departmentName || '',
        departmentId: pos.departmentId || pos.department?.id
      }));
      
      setPositions(mapped);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching positions:', err);
      showError('Error', 'Failed to fetch positions');
      setLoading(false);
    }
  }, [API_URL]);

  // ---- Fetch Departments Function ----
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/departments`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]);
    }
  }, [API_URL]);

  // ---- Fetch data on mount ----
  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, [fetchPositions, fetchDepartments]);

  const filteredPositions = useMemo(() => {
    return positions.filter(p => 
      p.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positions, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedPositions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPositions.slice(start, start + pageSize);
  }, [filteredPositions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPositions.length / pageSize);

  const handleAdd = async (positionName: string, departmentId: string) => {
    if (operationLoading) return;
    
    try {
      setOperationLoading(true);

      // Find department name from ID
      const department = departments.find(d => d.id === parseInt(departmentId));
      if (!department) {
        showError('Error', 'Invalid department selected');
        return;
      }

      const newPositionData = {
        positionName: positionName.trim(),
        departmentId: parseInt(departmentId)
      };

      const res = await fetch(`${API_URL}/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPositionData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create position');
      }

      await res.json(); // Consume response
      showSuccess('Success', 'Position added successfully.');
      
      // Refresh positions list
      await fetchPositions();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating position:', error);
      showError('Error', (error as Error).message || 'Failed to create position');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = async (updatedName: string, departmentId: string) => {
    if (!selectedPosition || operationLoading) return;
    
    try {
      setOperationLoading(true);

      // Find department name from ID
      const department = departments.find(d => d.id === parseInt(departmentId));
      if (!department) {
        showError('Error', 'Invalid department selected');
        return;
      }

      const updateData = {
        positionName: updatedName.trim(),
        departmentId: parseInt(departmentId)
      };

      const res = await fetch(`${API_URL}/positions/${selectedPosition.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update position');
      }

      showSuccess('Success', 'Position updated successfully.');
      
      // Refresh positions list
      await fetchPositions();
      setShowEditModal(false);
      setSelectedPosition(null);
    } catch (error) {
      console.error('Error updating position:', error);
      showError('Error', (error as Error).message || 'Failed to update position');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteRequest = async (position: Position) => {
    if (operationLoading) return;
    
    const result = await showConfirmation(
      `Are you sure you want to delete the position "${position.positionName}"?<br/><small>This action cannot be undone.</small>`
    );
    
    if (result.isConfirmed) {
      try {
        setOperationLoading(true);

        const res = await fetch(`${API_URL}/positions/${position.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete position');
        }

        showSuccess('Success', 'Position deleted successfully.');
        
        // Refresh positions list
        await fetchPositions();
        
        // Close any open modals
        if (selectedPosition?.id === position.id) {
          setShowEditModal(false);
          setSelectedPosition(null);
        }
      } catch (error) {
        console.error('Error deleting position:', error);
        showError('Error', (error as Error).message || 'Failed to delete position');
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  // Convert departments to options format for modal
  const departmentOptions = departments.map(dept => ({
    id: dept.id.toString(),
    label: dept.departmentName,
  }));

  return {
    positions,
    departments,
    departmentOptions,
    loading,
    operationLoading,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedPosition,
    setSelectedPosition,
    filteredPositions,
    paginatedPositions,
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