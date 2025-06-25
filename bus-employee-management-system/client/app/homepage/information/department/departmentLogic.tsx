import { useState, useMemo } from 'react';
import { showSuccess, showWarning, showConfirmation, showError } from '@/app/utils/swal';

export interface Department {
  name: string;
  employees: number;
}

export const DepartmentLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const [departments, setDepartments] = useState<Department[]>([
    { name: 'Accounting', employees: 12 },
    { name: 'Human Resource', employees: 25 },
    { name: 'Inventory', employees: 48 },
    { name: 'Operations', employees: 67 },
  ]);

  const [currentFilteredDepartments, setCurrentFilteredDepartments] = useState<Department[]>(departments);

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    let newData = [...departments];

    // Search
    if (searchTerm) {
      newData = newData.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'employees') {
      newData.sort((a, b) => (a.employees - b.employees) * sortOrder);
    }

    setCurrentFilteredDepartments(newData);
  };

  const filteredDepartments = currentFilteredDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedDepartments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDepartments.slice(start, start + pageSize);
  }, [filteredDepartments, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);

  const handleAdd = (newName: string) => {
    const newDepartment = { name: newName, employees: 0 };
    const updatedList = [...departments, newDepartment];
    setDepartments(updatedList);
    setCurrentFilteredDepartments(updatedList);
    showSuccess('Success', 'Department added successfully.');
  };

  const handleEdit = (updatedName: string) => {
    const updatedList = departments.map((dept) =>
      dept.name === selectedDept ? { ...dept, name: updatedName } : dept
    );
    setDepartments(updatedList);
    setCurrentFilteredDepartments(updatedList);
    showSuccess('Success', 'Department updated successfully.');
  };

  const handleDeleteRequest = async (deptName: string) => {
    const dept = departments.find((d) => d.name === deptName);
    if (dept && dept.employees > 0) {
      return showError('Error', 'This department cannot be deleted because it still contains employees.');
    }

    const result = await showConfirmation('Are you sure you want to delete this department?');
    if (result.isConfirmed) {
      const updatedList = departments.filter((d) => d.name !== deptName);
      setDepartments(updatedList);
      setCurrentFilteredDepartments(updatedList);
      showSuccess('Success', 'Department deleted successfully.');
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
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
  };
};