'use client';

import { useState, useMemo } from 'react'; // Import useMemo
import { showSuccess, showConfirmation } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

export interface InterviewSchedule {
  candidateName: string;
  position: string;
  interviewDate: string;
  interviewTime: string;
  interviewer: string;
  interviewStatus: 'Not Scheduled' | 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export const InterviewLogic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [interviewStatusFilter, setInterviewStatusFilter] = useState('');
  const [selectedInterview, setSelectedInterview] = useState<InterviewSchedule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);

  // State for managing the open action dropdown index
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size

  const [interviewSchedules, setInterviewSchedules] = useState<InterviewSchedule[]>([
    {
      candidateName: 'Juan Dela Cruz',
      position: 'Driver',
      interviewDate: '2023-01-20',
      interviewTime: '10:00 AM',
      interviewer: 'Maria Santos',
      interviewStatus: 'Scheduled',
      notes: 'Initial interview for driving skills.'
    },
    {
      candidateName: 'Mark Reyes',
      position: 'Supervisor',
      interviewDate: '2023-03-15',
      interviewTime: '02:00 PM',
      interviewer: 'Ricardo Lim',
      interviewStatus: 'Not Scheduled',
      notes: 'Follow-up interview for management experience.'
    },
    {
      candidateName: 'Ana Santos',
      position: 'Warehouse Staff',
      interviewDate: '2022-11-10',
      interviewTime: '09:00 AM',
      interviewer: 'Jose Rizal',
      interviewStatus: 'Completed',
      notes: 'Final interview, awaiting feedback.'
    },
    {
      candidateName: 'Roberto Chua',
      position: 'Dispatcher',
      interviewDate: '2023-05-25',
      interviewTime: '11:00 AM',
      interviewer: 'Maria Santos',
      interviewStatus: 'Scheduled',
      notes: 'Interview for logistics coordination.'
    },
  ]);

  // This state will be updated by handleApplyFilters and acts as the base for text filtering and pagination
  const [filteredSchedulesAfterAdvancedFilters, setFilteredSchedulesAfterAdvancedFilters] = useState<InterviewSchedule[]>(interviewSchedules);

  // Derived unique options for filters (using useMemo for efficiency)
  const uniquePositions = useMemo(() => Array.from(new Set(interviewSchedules.map(schedule => schedule.position))), [interviewSchedules]);
  const uniqueInterviewers = useMemo(() => Array.from(new Set(interviewSchedules.map(schedule => schedule.interviewer))), [interviewSchedules]);

  const filterSections: FilterSection[] = [
    {
      id: "interviewDateRange",
      title: "Date Range",
      type: "dateRange",
      defaultValue: { from: "", to: "" }
    },
    {
      id: "position",
      title: "Position",
      type: "checkbox",
      options: uniquePositions.map(pos => ({ id: pos.toLowerCase(), label: pos }))
    },
    {
      id: "interviewer",
      title: "Interviewer",
      type: "checkbox",
      options: uniqueInterviewers.map(interviewer => ({ id: interviewer.toLowerCase(), label: interviewer }))
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Candidate Name" },
        { id: "date", label: "Interview Date" }
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
    let newData = [...interviewSchedules]; // Start with the full list

    // Position
    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item => filterValues.position.includes(item.position.toLowerCase()));
    }

    // Interviewer
    if (filterValues.interviewer && filterValues.interviewer.length > 0) {
      newData = newData.filter(item => filterValues.interviewer.includes(item.interviewer.toLowerCase()));
    }

    // Interview Date Range
    const fromDate = filterValues.interviewDateRange?.from ? new Date(filterValues.interviewDateRange.from) : null;
    const toDate = filterValues.interviewDateRange?.to ? new Date(filterValues.interviewDateRange.to) : null;
    if (fromDate || toDate) {
      newData = newData.filter(item => {
        const scheduleDate = new Date(item.interviewDate);
        return (!fromDate || scheduleDate >= fromDate) && (!toDate || scheduleDate <= toDate);
      });
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => a.candidateName.localeCompare(b.candidateName) * sortOrder);
    } else if (sortBy === 'date') {
      newData.sort((a, b) => (new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime()) * sortOrder);
    }

    setFilteredSchedulesAfterAdvancedFilters(newData); // Update the state after applying advanced filters
    setCurrentPage(1); // Reset to first page after applying new filters
  };

  // This `filteredByText` now applies search term and status filters on top of advanced filters
  const filteredByText = useMemo(() => {
    return filteredSchedulesAfterAdvancedFilters.filter(schedule => {
      const candidateFullName = schedule.candidateName.toLowerCase();
      return (
        (!interviewStatusFilter || schedule.interviewStatus === interviewStatusFilter) &&
        (!searchTerm || candidateFullName.includes(searchTerm.toLowerCase()))
      );
    });
  }, [filteredSchedulesAfterAdvancedFilters, interviewStatusFilter, searchTerm]);

  // Pagination logic applied to the `filteredByText` result
  const paginatedInterviewSchedules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredByText.slice(start, start + pageSize);
  }, [filteredByText, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredByText.length / pageSize);


  const handleAdd = (newSchedule: InterviewSchedule) => {
    const updatedList = [...interviewSchedules, newSchedule];
    setInterviewSchedules(updatedList);
    setFilteredSchedulesAfterAdvancedFilters(updatedList); // Update the base for filtering
    showSuccess('Success', 'Interview scheduled successfully.');
  };

  const handleEdit = (updatedSchedule: InterviewSchedule) => {
    if (!selectedInterview) return;
    const updatedList = interviewSchedules.map((schedule) =>
      schedule.candidateName === selectedInterview.candidateName &&
      schedule.interviewDate === selectedInterview.interviewDate &&
      schedule.interviewTime === selectedInterview.interviewTime
        ? updatedSchedule
        : schedule
    );
    setInterviewSchedules(updatedList);
    setFilteredSchedulesAfterAdvancedFilters(updatedList); // Update the base for filtering
    showSuccess('Success', 'Interview updated successfully.');
  };

  const handleDeleteRequest = async (scheduleToDelete: InterviewSchedule) => {
    const result = await showConfirmation('Are you sure you want to delete this interview schedule?');
    if (result.isConfirmed) {
      const updatedList = interviewSchedules.filter(
        (schedule) =>
          schedule.candidateName !== scheduleToDelete.candidateName ||
          schedule.interviewDate !== scheduleToDelete.interviewDate ||
          schedule.interviewTime !== scheduleToDelete.interviewTime
      );
      setInterviewSchedules(updatedList);
      setFilteredSchedulesAfterAdvancedFilters(updatedList); // Update the base for filtering
      showSuccess('Success', 'Interview schedule deleted successfully.');
    }
  };

  // Function to toggle action dropdown visibility
  const toggleActionDropdown = (index: number | null) => {
    setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
  };

  return {
    interviewSchedules, // Keep raw data for mutation operations
    paginatedInterviewSchedules, // The final paginated and filtered data for rendering
    searchTerm,
    setSearchTerm,
    interviewStatusFilter,
    setInterviewStatusFilter,
    selectedInterview,
    setSelectedInterview,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    isReadOnlyView,
    setIsReadOnlyView,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    openActionDropdownIndex,
    toggleActionDropdown,
    // Pagination exports
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  };
};