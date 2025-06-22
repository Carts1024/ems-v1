/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  // Schema-aligned department type
  type DepartmentShape = {
    id: number;
    departmentName: string;
    positions: {
      id: number;
      positionName: string;
      _count?: { employees: number }; // If using Prisma's count
      employees?: any[]; // fallback, if not using _count
    }[];
    createdAt: string;
    updatedAt: string;
  };

  // Store mapped departments for the table
  const [departments, setDepartments] = useState<{
    id: number;
    name: string;
    employees: number;
    createdAt: string;
    updatedAt: string;
  }[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch departments and map to expected table data
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${apiUrl}/departments`);
      if (!res.ok) throw new Error();
      const data: DepartmentShape[] = await res.json();

      // Sum up all employees in all positions for each department
      const mapped = data.map(dept => {
        let totalEmployees = 0;
        dept.positions.forEach(pos => {
          if (pos._count && typeof pos._count.employees === 'number') {
            totalEmployees += pos._count.employees;
          } else if (pos.employees) {
            totalEmployees += pos.employees.length;
          }
        });
        return {
          id: dept.id,
          name: dept.departmentName,
          employees: totalEmployees,
          createdAt: dept.createdAt,
          updatedAt: dept.updatedAt,
        };
      });

      setDepartments(mapped);
    } catch (e) {
      showError('Error', 'Failed to load departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
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
      await fetchDepartments();
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
      await fetchDepartments();
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
        await fetchDepartments();
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
    fetchDepartments,
  };
};
