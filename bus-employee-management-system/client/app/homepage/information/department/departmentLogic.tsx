import { useState, useMemo } from 'react';
import { showSuccess, showWarning, showConfirmation, showError } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown'; // Import FilterSection

export interface Department {
  name: string;
  employees: number;
}

export const DepartmentLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<{ id: number; name: string } | null>(null);
  const [modalDeptName, setModalDeptName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  // State for action dropdown
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  const [departments, setDepartments] = useState<Department[]>([
    { name: 'Accounting', employees: 12 },
    { name: 'Human Resource', employees: 25 },
    { name: 'Inventory', employees: 48 },
    { name: 'Operations', employees: 67 },
  ]);

  // Use a separate state for filtered departments to apply all filters
  const [currentFilteredDepartments, setCurrentFilteredDepartments] = useState<Department[]>(departments);

  // Define filter sections for the Department page.
  // This is similar to candidateLogic, but with department-specific filters.
  const filterSections: FilterSection[] = [
    {
      id: "employeesRange",
      title: "No. of Employees",
      type: "numberRange", // Assuming a number range filter type in your FilterDropDown
      defaultValue: { from: "", to: "" }
    },
    // You might add more filters here, e.g., for 'Time Added' or 'Time Modified' if they become sortable/filterable properties
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Department Name" },
        { id: "employees", label: "No. of Employees" },
        // Add more sorting options as needed, e.g., by time added/modified
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
    let newData = [...departments]; // Start with the full list

    // Apply search term first (from the input field)
    const filteredBySearch = newData.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    newData = filteredBySearch;


    // Apply employee range filter from FilterDropDown, if it's there
    if (filterValues.employeesRange) {
      const min = parseFloat(filterValues.employeesRange.from);
      const max = parseFloat(filterValues.employeesRange.to);
      newData = newData.filter(dept => {
        const numEmployees = dept.employees;
        return (isNaN(min) || numEmployees >= min) && (isNaN(max) || numEmployees <= max);
      });
    }

    // Apply the dropdown filter (if you keep it separate from FilterDropDown)
    if (employeeFilter) {
      const [min, max] = employeeFilter === '101+'
        ? [101, Infinity]
        : employeeFilter.split('-').map(Number);
      newData = newData.filter(dept => dept.employees >= min && dept.employees <= max);
    }


    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => a.name.localeCompare(b.name) * sortOrder);
    } else if (sortBy === 'employees') {
      newData.sort((a, b) => (a.employees - b.employees) * sortOrder);
    }
    // Add more sorting logic for 'Time Added'/'Time Modified' if properties exist

    setCurrentFilteredDepartments(newData);
  };

  // Refined filteredDepartments to combine the search bar filter and the FilterDropDown filters
  const filteredDepartments = currentFilteredDepartments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    // The employeeFilter from the <select> element is still here.
    // If you plan to fully transition to FilterDropDown, remove this <select> and its logic.
    let matchesEmployeeSelectFilter = true;
    if (employeeFilter) {
      const [min, max] = employeeFilter === '101+'
        ? [101, Infinity]
        : employeeFilter.split('-').map(Number);
      matchesEmployeeSelectFilter = dept.employees >= min && dept.employees <= max;
    }
    return matchesSearch && matchesEmployeeSelectFilter;
  });

  // Pagination Implementation
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
    setCurrentFilteredDepartments(updatedList); // Update the filtered list too
    showSuccess('Success', 'Department added successfully.');
  };

  const handleEdit = (updatedName: string) => {
    const updatedList = departments.map((dept) =>
      dept.name === selectedDept ? { ...dept, name: updatedName } : dept
    );
    setDepartments(updatedList);
    setCurrentFilteredDepartments(updatedList); // Update the filtered list too
    showSuccess('Success', 'Department updated successfully.');
  };

  // --- Delete ---
  const handleDeleteRequest = async (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId);
    if (dept && dept.employees > 0) {
      return showError('Error', 'This department cannot be deleted because it still contains employees.');
    }
    const result = await showConfirmation('Are you sure you want to delete this department?');
    if (result.isConfirmed) {
      const updatedList = departments.filter((d) => d.name !== deptName);
      setDepartments(updatedList);
      setCurrentFilteredDepartments(updatedList); // Update the filtered list too
      showSuccess('Success', 'Department deleted successfully.');
    }
  };

  // Function to toggle action dropdown visibility
  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };


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
    filteredDepartments, // This is the final filtered list
    paginatedDepartments,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections, // Export filter sections
    handleApplyFilters, // Export filter application function
    openActionDropdownIndex, // Export new state
    toggleActionDropdown, // Export new function
  };
};
