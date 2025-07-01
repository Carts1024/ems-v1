/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { showSuccess, showWarning, showConfirmation, showError } from '@/app/utils/swal';

export interface Department {
  id: number;
  departmentName: string;
  description?: string;
  isActive?: boolean;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const DepartmentLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentFilteredDepartments, setCurrentFilteredDepartments] = useState<Department[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch departments from backend
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/departments`);
      if (!res.ok) throw new Error('Failed to fetch departments');
      const data = await res.json();
      setDepartments(data);
      setCurrentFilteredDepartments(data);
    } catch (error) {
      showError('Error', 'Failed to load departments');
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Load departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    let newData = [...departments];

    // Search
    if (searchTerm) {
      newData = newData.filter(dept =>
        dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => a.departmentName.localeCompare(b.departmentName) * sortOrder);
    } else if (sortBy === 'employees') {
      newData.sort((a, b) => ((a.employeeCount || 0) - (b.employeeCount || 0)) * sortOrder);
    }

    setCurrentFilteredDepartments(newData);
  };

  const filteredDepartments = currentFilteredDepartments.filter(dept =>
    dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedDepartments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDepartments.slice(start, start + pageSize);
  }, [filteredDepartments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);

  // Add new department
  const handleAdd = async (newName: string, description?: string) => {
    try {
      setOperationLoading(true);
      const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: newName,
          description: description || '',
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create department');
      }

      const newDepartment = await response.json();
      const updatedDepartments = [...departments, newDepartment];
      setDepartments(updatedDepartments);
      setCurrentFilteredDepartments(updatedDepartments);
      showSuccess('Success', 'Department added successfully.');
      setShowAddModal(false);
    } catch (error) {
      showError('Error', 'Failed to add department');
      console.error('Error adding department:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  // Edit existing department
  const handleEdit = async (updatedName: string, description?: string) => {
    if (!selectedDept) return;

    try {
      setOperationLoading(true);
      const response = await fetch(`${API_URL}/departments/${selectedDept.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: updatedName,
          description: description || selectedDept.description || '',
          isActive: selectedDept.isActive !== undefined ? selectedDept.isActive : true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update department');
      }

      const updatedDepartment = await response.json();
      const updatedDepartments = departments.map((dept) =>
        dept.id === selectedDept.id ? updatedDepartment : dept
      );
      setDepartments(updatedDepartments);
      setCurrentFilteredDepartments(updatedDepartments);
      showSuccess('Success', 'Department updated successfully.');
      setShowEditModal(false);
      setSelectedDept(null);
    } catch (error) {
      showError('Error', 'Failed to update department');
      console.error('Error updating department:', error);
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete department
  const handleDeleteRequest = async (department: Department) => {
    const result = await showConfirmation('Are you sure you want to delete this department?');
    if (result.isConfirmed) {
      try {
        setOperationLoading(true);
        const response = await fetch(`${API_URL}/departments/${department.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete department');
        }

        const updatedDepartments = departments.filter((d) => d.id !== department.id);
        setDepartments(updatedDepartments);
        setCurrentFilteredDepartments(updatedDepartments);
        showSuccess('Success', 'Department deleted successfully.');
      } catch (error) {
        showError('Error', 'Failed to delete department');
        console.error('Error deleting department:', error);
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  // Utility function to format dates
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDept,
    setSelectedDept,
    departments,
    filteredDepartments,
    paginatedDepartments,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    loading,
    operationLoading,
    fetchDepartments,
    formatDateTime,
  };
};