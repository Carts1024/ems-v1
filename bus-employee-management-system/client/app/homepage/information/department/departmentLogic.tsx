/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { showSuccess, showError, showConfirmation } from '@/app/utils/swal';

export const DepartmentLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<{ id: number; name: string } | null>(null);
  const [modalDeptName, setModalDeptName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const [departments, setDepartments] = useState<
    { id: number; name: string; employees: number; createdAt: string; updatedAt: string }[]
  >([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Fetch departments from backend
  useEffect(() => {
    
    fetch(`${apiUrl}/departments`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((dept: any) => ({
          id: dept.id,
          name: dept.departmentName,
          employees: dept._count.employee,
          createdAt: dept.createdAt,
          updatedAt: dept.updatedAt,
        }));
        setDepartments(mapped);
      })
      .catch(() => showError('Error', 'Failed to load departments'));
  }, []);

  // --- Add ---
  const handleAdd = async (newName: string) => {
    try {
      const res = await fetch(`${apiUrl}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentName: newName }),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setDepartments((prev) => [
        ...prev,
        {
          id: added.id,
          name: added.departmentName,
          employees: 0,
          createdAt: added.createdAt,
          updatedAt: added.updatedAt,
        },
      ]);
      showSuccess('Success', 'Department added successfully.');
    } catch {
      showError('Error', 'Failed to add department.');
    }
  };

  // --- Edit ---
  const handleEdit = async (updatedName: string) => {
    if (!selectedDept) return;
    try {
      const res = await fetch(`${apiUrl}/departments/${selectedDept.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentName: updatedName }),
      });
      if (!res.ok) throw new Error();
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === selectedDept.id ? { ...dept, name: updatedName } : dept
        )
      );
      showSuccess('Success', 'Department updated successfully.');
    } catch {
      showError('Error', 'Failed to update department.');
    }
  };

  // --- Delete ---
  const handleDeleteRequest = async (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId);
    if (dept && dept.employees > 0) {
      return showError('Error', 'This department cannot be deleted because it still contains employees.');
    }
    const result = await showConfirmation('Are you sure you want to delete this department?');
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${apiUrl}/departments/${deptId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setDepartments((prev) => prev.filter((d) => d.id !== deptId));
        showSuccess('Success', 'Department deleted successfully.');
      } catch {
        showError('Error', 'Failed to delete department.');
      }
    }
  };

  // Filtering logic
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;

    if (employeeFilter) {
      const [min, max] = employeeFilter === '101+'
        ? [101, Infinity]
        : employeeFilter.split('-').map(Number);
      matchesFilter = dept.employees >= min && dept.employees <= max;
    }

    return matchesSearch && matchesFilter;
  });

  // Modal open/close helpers
  const openAddModal = () => {
    setModalDeptName('');
    setShowAddModal(true);
  };
  const openEditModal = (dept: { id: number; name: string }) => {
    setSelectedDept(dept);
    setModalDeptName(dept.name);
    setShowEditModal(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    employeeFilter,
    setEmployeeFilter,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDept,
    setSelectedDept,
    departments,
    filteredDepartments,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    modalDeptName,
    setModalDeptName,
    openAddModal,
    openEditModal,
  };
};