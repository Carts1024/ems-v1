/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { showSuccess, showConfirmation, showError } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { FilterSection } from '@/components/ui/filterDropdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const EMPLOYEE_API = `${API_BASE_URL}/employees`;
const POSITIONS_API = `${API_BASE_URL}/positions`;

export const EmployeeLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<{ id: number; positionName: string }[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(EMPLOYEE_API);
      const data = await res.json();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (err) {
      showError('Error', 'Failed to fetch employees');
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await fetch(POSITIONS_API);
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      showError('Error', 'Failed to fetch positions');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const getPositionName = (positionId: number) =>
    positions.find(pos => pos.id === positionId)?.positionName || "";

  const filterSections: FilterSection[] = [
    {
      id: "position",
      title: "Position",
      type: "checkbox",
      options: positions.map(pos => ({
        id: String(pos.id),
        label: pos.positionName
      }))
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Name" },
        { id: "date", label: "Date Hired" }
      ],
      defaultValue: "name"
    },
    {
      id: "order",
      title: "Order",
      type: "radio",
      options: [
        { id: "asc", label: "Ascending" },
        { id: "desc", label: "Descending" }
      ],
      defaultValue: "asc"
    }
  ];

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    let newData = [...employees];

    if (statusFilter) {
      newData = newData.filter(item => item.status === statusFilter);
    }

    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item =>
        filterValues.position.includes(String(item.positionId))
      );
    }

    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) =>
        `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`) * sortOrder
      );
    } else if (sortBy === 'date') {
      newData.sort((a, b) =>
        (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * sortOrder
      );
    }

    setFilteredEmployees(newData);
  };

  const filteredByText = filteredEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.middleName ?? ""} ${emp.lastName}`.toLowerCase();
    return (
      (!statusFilter || emp.status === statusFilter) &&
      (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
    );
  });

  const handleAdd = async (newEmployee: Employee) => {
    try {
      const res = await fetch(EMPLOYEE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (!res.ok) throw new Error('Failed to add');
      showSuccess('Success', 'Employee added successfully.');
      fetchEmployees();
      setShowAddModal(false);
    } catch {
      showError('Error', 'Failed to add employee.');
    }
  };

  const handleEdit = async (updatedEmployee: Employee) => {
    try {
      if (!selectedEmployee?.id) throw new Error('No employee selected');
      const res = await fetch(`${EMPLOYEE_API}/${selectedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) throw new Error('Failed to update');
      showSuccess('Success', 'Employee updated successfully.');
      fetchEmployees();
      setShowEditModal(false);
    } catch {
      showError('Error', 'Failed to update employee.');
    }
  };

  const handleDeleteRequest = async (employee: Employee) => {
    const result = await showConfirmation('Are you sure you want to delete this employee?');
    if (result.isConfirmed && employee.id) {
      try {
        const res = await fetch(`${EMPLOYEE_API}/${employee.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        showSuccess('Success', 'Employee deleted successfully.');
        fetchEmployees();
      } catch {
        showError('Error', 'Failed to delete employee.');
      }
    }
  };

  return {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    filteredEmployees: filteredByText,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    filterSections,
    handleApplyFilters,
    positions,
    getPositionName,
  };
};
