/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react'; // <--- Ensure useMemo is imported here
import { showConfirmation, showSuccess } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

export interface Candidate {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthdate: string;
  email: string;
  contact: string;
  streetAddress: string;
  barangay: string;
  city: string;
  province: string;
  country: string;
  applicationStatus: string;
  applicationDate: string;
  sourceOfHire: string;
  department: string;
  position: string;
  interviewStatus: string;
  interviewDate: string;
}

export const useCandidateLogic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('');
  const [interviewStatusFilter, setInterviewStatusFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);

  // State for managing the open action dropdown index
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      firstName: 'Juan',
      middleName: '',
      lastName: 'Dela Cruz',
      suffix: '',
      birthdate: '22-11-1988',
      email: 'juan.delacruz@example.com',
      contact: '09171234567',
      streetAddress: '',
      barangay: '',
      city: '',
      province: '',
      country: '',
      position: 'Driver',
      department: 'Operations',
      applicationDate: '2023-01-15',
      applicationStatus: 'Processing',
      interviewStatus: 'Scheduled',
      interviewDate: '',
      sourceOfHire: 'Referral',
    }
  ]);

  // This state will be updated by handleApplyFilters and acts as the base for text filtering and pagination
  const [filteredCandidatesAfterAdvancedFilters, setFilteredCandidatesAfterAdvancedFilters] = useState<Candidate[]>(candidates);

  // Derived unique options for filters (using useMemo for efficiency)
  const uniqueDepartments = useMemo(() => Array.from(new Set(candidates.map(emp => emp.department))), [candidates]);
  const uniquePositions = useMemo(() => Array.from(new Set(candidates.map(emp => emp.position))), [candidates]);
  const uniqueSourceOfHire = useMemo(() => Array.from(new Set(candidates.map(emp => emp.sourceOfHire))), [candidates]);

  const filterSections: FilterSection[] = [
    {
      id: "applicationDateRange",
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
      id: "source",
      title: "Source of Hire",
      type: "checkbox",
      options: uniqueSourceOfHire.map(sourceOfHire => ({ id: sourceOfHire.toLowerCase(), label: sourceOfHire }))
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Name" },
        { id: "date", label: "Application Date" }
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
    let newData = [...candidates]; // Start with the full list

    // Department
    if (filterValues.department && filterValues.department.length > 0) {
      newData = newData.filter(item => filterValues.department.includes(item.department.toLowerCase()));
    }

    // Position
    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item => filterValues.position.includes(item.position.toLowerCase()));
    }

    // Source of Hire
    if (filterValues.source && filterValues.source.length > 0) {
      newData = newData.filter(item => filterValues.source.includes(item.sourceOfHire.toLowerCase()));
    }

    // Application Date Range
    const fromDate = filterValues.applicationDateRange?.from ? new Date(filterValues.applicationDateRange.from) : null;
    const toDate = filterValues.applicationDateRange?.to ? new Date(filterValues.applicationDateRange.to) : null;
    if (fromDate || toDate) {
      newData = newData.filter(item => {
        const applicationDate = new Date(item.applicationDate);
        return (!fromDate || applicationDate >= fromDate) && (!toDate || applicationDate <= toDate);
      });
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`) * sortOrder);
    } else if (sortBy === 'date') {
      newData.sort((a, b) => (new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()) * sortOrder);
    }

    setFilteredCandidatesAfterAdvancedFilters(newData);
    setCurrentPage(1);
  };

  const filteredByText = useMemo(() => {
    return filteredCandidatesAfterAdvancedFilters.filter(c => {
      const fullName = `${c.firstName} ${c.middleName} ${c.lastName}`.toLowerCase();
      return (
        (!applicationStatusFilter || c.applicationStatus === applicationStatusFilter) &&
        (!interviewStatusFilter || c.interviewStatus === interviewStatusFilter) &&
        (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
      );
    });
  }, [filteredCandidatesAfterAdvancedFilters, applicationStatusFilter, interviewStatusFilter, searchTerm]);

  // Pagination logic
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredByText.slice(start, start + pageSize);
  }, [filteredByText, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredByText.length / pageSize);

  const handleAdd = (newCandidate: Candidate) => {
    const updatedList = [...candidates, newCandidate];
    setCandidates(updatedList);
    setFilteredCandidatesAfterAdvancedFilters(updatedList); // Update the base for filtering
    showSuccess('Success', 'Candidate added successfully.');
  };

  const handleEdit = (updatedCandidate: Candidate) => {
    if (!selectedCandidate) return;
    const updatedList = candidates.map((c) =>
      `${c.firstName}${c.middleName}${c.lastName}` === `${selectedCandidate.firstName}${selectedCandidate.middleName}${selectedCandidate.lastName}`
        ? updatedCandidate
        : c
    );
    setCandidates(updatedList);
    setFilteredCandidatesAfterAdvancedFilters(updatedList); // Update the base for filtering
    showSuccess('Success', 'Candidate updated successfully.');
  };

  const handleDeleteRequest = async (candidate: Candidate) => {
    const result = await showConfirmation('Are you sure you want to delete this candidate?');
    if (result.isConfirmed) {
      const updatedList = candidates.filter(
        (c) => `${c.firstName}${c.middleName}${c.lastName}` !== `${candidate.firstName}${candidate.middleName}${candidate.lastName}`
      );
      setCandidates(updatedList);
      setFilteredCandidatesAfterAdvancedFilters(updatedList); // Update the base for filtering
      showSuccess('Success', 'Candidate deleted successfully.');
    }
  };

  // Function to toggle action dropdown visibility
  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    candidates,
    // filteredCandidates: filteredByText, // Renamed to paginatedCandidates for clarity in the return
    searchTerm,
    setSearchTerm,
    applicationStatusFilter,
    setApplicationStatusFilter,
    interviewStatusFilter,
    setInterviewStatusFilter,
    selectedCandidate,
    setSelectedCandidate,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    showFeedbackModal,
    setShowFeedbackModal,
    isReadOnlyView,
    setIsReadOnlyView,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    // Export the new state and function for the action dropdown
    openActionDropdownIndex,
    toggleActionDropdown,

    //pagination
    paginatedCandidates, // This is the final list to render in the table
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  };
};