/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useMemo } from 'react';
import { showSuccess, showConfirmation } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { FilterSection } from '@/components/ui/filterDropdown';

export const EmployeeLogic = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // --- New: Departments & Positions state ---
  const [departments, setDepartments] = useState<{ id: number, departmentName: string }[]>([]);
  const [positions, setPositions] = useState<{ id: number, positionName: string, departmentId: number }[]>([]);

  // --- API URL ---
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Fetch Employees on Mount ---
  // Fetch employees and normalize
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/employees`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        // Normalize so we always have strings for positionName and departmentName
        const mapped = data.map((emp: any) => ({
          ...emp,
          positionName: emp.position?.positionName || '',
          departmentName: emp.position?.department?.departmentName || '',
        }));
        setEmployees(mapped);
        setFilteredEmployees(mapped);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch employees');
        setLoading(false);
      });
  }, [API_URL]);

  // --- Fetch Departments and Positions on Mount ---
  useEffect(() => {
    // Departments
    fetch(`${API_URL}/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(() => setDepartments([]));
    // Positions
    fetch(`${API_URL}/positions`)
      .then(res => res.json())
      .then(data => setPositions(data))
      .catch(() => setPositions([]));
  }, [API_URL]);

  // --- Build Filter Options from Fetched Data ---
  const departmentOptions = departments.map(dept => ({
    id: String(dept.id), // or dept.departmentName.toLowerCase() if you want by name
    label: dept.departmentName,
  }));

  const positionOptions = positions.map(pos => ({
    id: String(pos.id), // or pos.positionName.toLowerCase() if you want by name
    label: pos.positionName,
  }));

  // Filters
  const uniqueDepartments = Array.from(
    new Set(employees.map(emp => emp.departmentName).filter((d): d is string => d && d.trim() !== ''))
  );
  const uniquePositions = Array.from(
    new Set(employees.map(emp => emp.positionName).filter((p): p is string => p && p.trim() !== ''))
  );

  const filterSections: FilterSection[] = [
    {
      id: "dateHiredRange",
      title: "Date Range",
      type: "dateRange",
      defaultValue: { from: "", to: "" }
    },
    {
      id: "department",
      title: "Department",
      type: "checkbox",
      options: uniqueDepartments.map(dept => ({ id: dept.toLowerCase(), label: dept }))
    },
    {
      id: "position",
      title: "Position",
      type: "checkbox",
      options: uniquePositions.map(pos => ({ id: pos.toLowerCase(), label: pos }))
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

    // Department
    if (filterValues.department && filterValues.department.length > 0) {
      newData = newData.filter(item => filterValues.department.includes(item.departmentName.toLowerCase()));
    }

    // Position
    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item => filterValues.position.includes(item.positionName.toLowerCase()));
    }

    // Date Hired Range
    const fromDate = filterValues.dateHiredRange?.from ? new Date(filterValues.dateHiredRange.from) : null;
    const toDate = filterValues.dateHiredRange?.to ? new Date(filterValues.dateHiredRange.to) : null;
    if (fromDate || toDate) {
      newData = newData.filter(item => {
        const hiredDate = new Date(item.dateHired);
        return (!fromDate || hiredDate >= fromDate) && (!toDate || hiredDate <= toDate);
      });
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`) * sortOrder);
    } else if (sortBy === 'date') {
      newData.sort((a, b) => (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * sortOrder);
    }

    setFilteredEmployees(newData);
  };

  const filteredByText = filteredEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.middleName || ''} ${emp.lastName}`.toLowerCase();
    return (
      (!statusFilter || emp.status === statusFilter) &&
      (!departmentFilter || emp.departmentName === departmentFilter) &&
      (!positionFilter || emp.positionName === positionFilter) &&
      (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
    );
  });

  // Pagination Implementation
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  // Add/Edit/Delete (same as your original)
  const handleAdd = (newEmployee: Employee) => {
    const updatedList = [...employees, newEmployee];
    setEmployees(updatedList);
    setFilteredEmployees(updatedList);
    showSuccess('Success', 'Employee added successfully.');
  };

  const handleEdit = (updatedEmployee: Employee) => {
    if (!selectedEmployee) return;
    const updatedList = employees.map(emp =>
      emp.firstName === selectedEmployee.firstName &&
      emp.middleName === selectedEmployee.middleName &&
      emp.lastName === selectedEmployee.lastName
        ? updatedEmployee
        : emp
    );
    setEmployees(updatedList);
    setFilteredEmployees(updatedList);
    showSuccess('Success', 'Employee updated successfully.');
  };

  const handleDeleteRequest = async (employee: Employee) => {
    const result = await showConfirmation('Are you sure you want to delete this employee?');
    if (result.isConfirmed) {
      const updatedList = employees.filter(
        emp => emp.firstName !== employee.firstName ||
          emp.middleName !== employee.middleName ||
          emp.lastName !== employee.lastName
      );
      setEmployees(updatedList);
      setFilteredEmployees(updatedList);
      showSuccess('Success', 'Employee deleted successfully.');
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setOpenActionDropdownIndex(null); // Close the dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionDropdownIndex]);

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
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    actionDropdownRef,
    paginatedEmployees,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    loading,
    error,
  };
};