/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal'; 
import { FilterSection } from '@/components/ui/filterDropdown';

export type ResignationStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';

export interface ResignationForm {
  employee: string;

  employeeJobPosition: string;
  department: string; 
  lastDayOfEmployment: string; 
  noticePeriod: number; 
  status: ResignationStatus;
  reason?: string; 
  remarks?: string; 
}


export interface Resignation extends ResignationForm {
  id: string;
  submissionDate: string; 
  lastModifiedDate: string; 
}

export const ResignationLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState<Resignation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // Dummy Data for Resignation Management
  const [resignations, setResignations] = useState<Resignation[]>([
    {
      id: 'res1',
      employee: 'Alice Johnson',
      employeeJobPosition: 'Software Engineer',
      department: 'Engineering',
      lastDayOfEmployment: '2024-07-30',
      noticePeriod: 30,
      status: 'Pending',
      reason: 'Pursuing new opportunities.',
      submissionDate: '2024-06-30T10:00:00Z',
      lastModifiedDate: '2024-06-30T10:00:00Z'
    },
    {
      id: 'res2',
      employee: 'Bob Williams',
      employeeJobPosition: 'Marketing Specialist',
      department: 'Marketing', 
      lastDayOfEmployment: '2024-08-15',
      noticePeriod: 45,
      status: 'Accepted',
      reason: 'Relocating to a different city.',
      submissionDate: '2024-06-01T11:30:00Z',
      lastModifiedDate: '2024-06-05T09:00:00Z'
    },
    {
      id: 'res3',
      employee: 'Charlie Brown',
      employeeJobPosition: 'HR Assistant',
      department: 'Human Resources', 
      lastDayOfEmployment: '2024-07-10',
      noticePeriod: 14,
      status: 'Rejected',
      reason: 'Personal reasons.',
      submissionDate: '2024-06-20T14:00:00Z',
      lastModifiedDate: '2024-06-21T15:00:00Z'
    },
    {
      id: 'res4',
      employee: 'Diana Prince',
      employeeJobPosition: 'Sales Manager',
      department: 'Sales', 
      lastDayOfEmployment: '2024-09-01',
      noticePeriod: 60,
      status: 'Pending',
      reason: 'Starting own business.',
      submissionDate: '2024-07-01T09:00:00Z',
      lastModifiedDate: '2024-07-01T09:00:00Z'
    },
    {
      id: 'res5',
      employee: 'Eve Adams',
      employeeJobPosition: 'Accountant',
      department: 'Finance', 
      lastDayOfEmployment: '2024-07-20',
      noticePeriod: 30,
      status: 'Withdrawn', 
      reason: 'Decided to stay with the company.',
      submissionDate: '2024-06-15T13:00:00Z',
      lastModifiedDate: '2024-06-18T08:00:00Z'
    },
  ]);

  const [currentFilteredResignations, setCurrentFilteredResignations] = useState<Resignation[]>(resignations);

  useEffect(() => {
    handleApplyFilters(activeFilters);
  }, [resignations, searchTerm]); 

  const filterSections: FilterSection[] = [
    {
      id: "status",
      title: "Status",
      type: "checkbox",
      options: [
        { id: "Pending", label: "Pending" },
        { id: "Accepted", label: "Accepted" },
        { id: "Rejected", label: "Rejected" },
        { id: "Withdrawn", label: "Withdrawn" },
      ],
      defaultValue: []
    },
    {
      id: "department", 
      title: "Department",
      type: "checkbox",
      options: [
        { id: "Engineering", label: "Engineering" },
        { id: "Marketing", label: "Marketing" },
        { id: "Human Resources", label: "Human Resources" },
        { id: "Sales", label: "Sales" },
        { id: "Finance", label: "Finance" },
      ],
      defaultValue: []
    },
    {
      id: "noticePeriodRange",
      title: "Notice Period (Days)",
      type: "numberRange", 
      defaultValue: { min: "", max: "" }
    },
    {
      id: "lastDayOfEmploymentRange",
      title: "Last Day of Employment Range",
      type: "dateRange",
      defaultValue: { from: "", to: "" }
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "employee", label: "Employee Name" },
        { id: "lastDayOfEmployment", label: "Last Day of Employment" },
        { id: "noticePeriod", label: "Notice Period" },
        { id: "status", label: "Status" },
        { id: "department", label: "Department" }, 
      ],
      defaultValue: "employee"
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
    setActiveFilters(filterValues);

    let newData = [...resignations];

    // Apply search term filtering
    const filteredBySearch = newData.filter(res =>
      res.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.employeeJobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.department.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    newData = filteredBySearch;

    if (filterValues.status && filterValues.status.length > 0) {
      newData = newData.filter(res =>
        filterValues.status.includes(res.status)
      );
    }

    if (filterValues.department && filterValues.department.length > 0) { 
      newData = newData.filter(res =>
        filterValues.department.includes(res.department)
      );
    }

    if (filterValues.noticePeriodRange) {
      const min = parseFloat(filterValues.noticePeriodRange.min);
      const max = parseFloat(filterValues.noticePeriodRange.max);

      newData = newData.filter(res => {
        const matchesMin = isNaN(min) || res.noticePeriod >= min;
        const matchesMax = isNaN(max) || res.noticePeriod <= max;
        return matchesMin && matchesMax;
      });
    }

    if (filterValues.lastDayOfEmploymentRange) {
      const fromDate = filterValues.lastDayOfEmploymentRange.from ? new Date(filterValues.lastDayOfEmploymentRange.from) : null;
      const toDate = filterValues.lastDayOfEmploymentRange.to ? new Date(filterValues.lastDayOfEmploymentRange.to) : null; // Fixed typo: dueDateRange to lastDayOfEmploymentRange

      newData = newData.filter(res => {
        const dateToCheck = new Date(res.lastDayOfEmployment);
        return (
          (!fromDate || dateToCheck >= fromDate) &&
          (!toDate || dateToCheck <= toDate)
        );
      });
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'employee') {
      newData.sort((a, b) => a.employee.localeCompare(b.employee) * sortOrder);
    } else if (sortBy === 'lastDayOfEmployment') {
      newData.sort((a, b) => {
        const dateA = new Date(a.lastDayOfEmployment).getTime();
        const dateB = new Date(b.lastDayOfEmployment).getTime();
        return (dateA - dateB) * sortOrder;
      });
    } else if (sortBy === 'noticePeriod') {
      newData.sort((a, b) => (a.noticePeriod - b.noticePeriod) * sortOrder);
    } else if (sortBy === 'status') {
      newData.sort((a, b) => a.status.localeCompare(b.status) * sortOrder);
    } else if (sortBy === 'department') { // Added department sort
      newData.sort((a, b) => a.department.localeCompare(b.department) * sortOrder);
    }

    setCurrentFilteredResignations(newData);
    setCurrentPage(1); 
  };

  const finalFilteredResignations = useMemo(() => {

    return currentFilteredResignations.filter((res) => {
      const matchesSearch =
        res.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.employeeJobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.department.toLowerCase().includes(searchTerm.toLowerCase()) || 
        res.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [currentFilteredResignations, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedResignations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return finalFilteredResignations.slice(start, start + pageSize);
  }, [finalFilteredResignations, currentPage, pageSize]);

  const totalPages = Math.ceil(finalFilteredResignations.length / pageSize);

  const generateUniqueId = () => `res${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const handleAdd = async (newResignationData: ResignationForm): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const id = generateUniqueId();
      const now = new Date().toISOString();

      const fullResignation: Resignation = {
        ...newResignationData,
        id: id,
        submissionDate: now,
        lastModifiedDate: now,
      };

      const updatedList = [...resignations, fullResignation];
      setResignations(updatedList);
      await showSuccess('Success', 'Resignation request added successfully!');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add resignation:', error);
      showError('Error', 'Failed to add resignation request.');
    }
  };

  const handleEdit = async (updatedResignationFormData: ResignationForm): Promise<void> => {
    try {
      if (!selectedResignation) {
        showError('Error', 'No resignation selected for editing.');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const now = new Date().toISOString();

      const updatedFullResignation: Resignation = {
        ...selectedResignation,
        ...updatedResignationFormData,
        id: selectedResignation.id,
        submissionDate: selectedResignation.submissionDate,
        lastModifiedDate: now,
      };

      const updatedList = resignations.map((res) =>
        res.id === updatedFullResignation.id ? updatedFullResignation : res
      );
      setResignations(updatedList);
      setShowEditModal(false);
      setSelectedResignation(null);
      showSuccess('Success', 'Resignation request updated successfully!');
    } catch (error) {
      console.error('Failed to update resignation:', error);
      showError('Error', 'Failed to update resignation request.');
    }
  };

  const handleDeleteRequest = async (resignationId: string) => {
    const resignationToDelete = resignations.find((res) => res.id === resignationId);

    if (!resignationToDelete) {
      showError('Error', 'Resignation not found.');
      return;
    }

    // Only allow deletion if status is Pending or Rejected, similar to Cash Advance
    if (resignationToDelete.status === 'Accepted' || resignationToDelete.status === 'Withdrawn') {
      return showError('Error', 'Accepted or Withdrawn resignation requests cannot be deleted.');
    }

    const result = await showConfirmation(`Are you sure you want to delete the resignation request for ${resignationToDelete.employee}?`);
    if (result.isConfirmed) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        const updatedList = resignations.filter((res) => res.id !== resignationId);
        setResignations(updatedList);
        showSuccess('Success', 'Resignation request deleted successfully.');
      } catch (error) {
        console.error('Failed to delete resignation:', error);
        showError('Error', 'Failed to delete resignation request.');
      }
    }
  };

  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  const openAddModal = () => {
    setSelectedResignation(null);
    setShowAddModal(true);
  };

  const openEditModal = (resignation: Resignation) => {
    setSelectedResignation(resignation);
    setShowEditModal(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedResignation,
    setSelectedResignation,
    resignations,
    filteredResignations: finalFilteredResignations,
    paginatedResignations,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    openAddModal,
    openEditModal,
  };
};