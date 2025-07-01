/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { AttendanceResponse } from '@/types/attendance';
import { useAttendance } from '@/hooks/useAttendance';
import { FilterSection } from '@/components/ui/filterDropdown';

export const useDailyReportLogic = () => {
  const {
    attendances,
    employees,
    loading,
    selectedEmployeeId,
    filterByEmployee,
    deleteAttendance,
    refreshAttendances,
  } = useAttendance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

  // Convert attendance data for display
  const attendanceList = useMemo(() => {
    return attendances.map(attendance => ({
      id: attendance.id,
      status: attendance.status as '' | 'Present' | 'Absent' | 'Late',
      employeeName: attendance.employee 
        ? `${attendance.employee.firstName} ${attendance.employee.lastName}`
        : 'Unknown Employee',
      employeeId: attendance.employeeId,
      hiredate: attendance.employee?.hiredate || '',
      department: attendance.employee?.position?.department?.departmentName || 
                  attendance.employee?.department || '',
      position: attendance.employee?.position?.positionName || 
                attendance.employee?.positionName || '',
      date: new Date(attendance.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
      timeIn: attendance.timeIn ? new Date(attendance.timeIn).toTimeString().slice(0, 5) : '', // HH:MM
      timeOut: attendance.timeOut ? new Date(attendance.timeOut).toTimeString().slice(0, 5) : '', // HH:MM
      remarks: attendance.remarks || '',
      isHoliday: attendance.isHoliday || false,
    }));
  }, [attendances]);

  // Filter data based on search and filters
  const filteredAttendances = useMemo(() => {
    let filtered = attendanceList;

    if (searchTerm) {
      filtered = filtered.filter(attendance =>
        attendance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(attendance => attendance.status === statusFilter);
    }

    return filtered;
  }, [attendanceList, searchTerm, statusFilter]);

  // Get unique departments and positions for filters
  const departments = Array.from(new Set(attendanceList.map(a => a.department).filter(Boolean)));
  const positions = Array.from(new Set(attendanceList.map(a => a.position).filter(Boolean)));

  const filterSections: FilterSection[] = [
    {
      id: 'department',
      title: 'Department',
      type: 'checkbox',
      options: departments.map(d => ({ id: d.toLowerCase(), label: d }))
    },
    {
      id: 'position',
      title: 'Position',
      type: 'checkbox',
      options: positions.map(p => ({ id: p.toLowerCase(), label: p }))
    },
    {
      id: 'sortBy',
      title: 'Sort By',
      type: 'radio',
      options: [
        { id: 'name', label: 'Name' },
        { id: 'date', label: 'Date' }
      ],
      defaultValue: 'name'
    },
    {
      id: 'order',
      title: 'Order',
      type: 'radio',
      options: [
        { id: 'asc', label: 'Ascending' },
        { id: 'desc', label: 'Descending' }
      ],
      defaultValue: 'asc'
    }
  ];

  const handleApplyFilters = (filters: Record<string, any>) => {
    let data = [...filteredAttendances];

    if (filters.department?.length) {
      data = data.filter(d => filters.department.includes(d.department.toLowerCase()));
    }

    if (filters.position?.length) {
      data = data.filter(p => filters.position.includes(p.position.toLowerCase()));
    }

    const sortBy = filters.sortBy;
    const sortOrder = filters.order === 'desc' ? -1 : 1;

    if (sortBy === 'name') {
      data.sort((a, b) => a.employeeName.localeCompare(b.employeeName) * sortOrder);
    } else if (sortBy === 'date') {
      data.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()) * sortOrder);
    }

    return data;
  };

  // Modal handlers
  const handleAddAttendance = () => {
    setSelectedAttendance(null);
    setShowAddModal(true);
  };

  const handleEditAttendance = (attendance: any) => {
    const attendanceData = attendances.find(a => a.id === attendance.id);
    if (attendanceData) {
      setSelectedAttendance(attendanceData);
      setShowEditModal(true);
    }
  };

  const handleViewAttendance = (attendance: any) => {
    const attendanceData = attendances.find(a => a.id === attendance.id);
    if (attendanceData) {
      setSelectedAttendance(attendanceData);
      setShowViewModal(true);
    }
  };

  const handleDeleteAttendance = async (attendance: any) => {
    try {
      await deleteAttendance(attendance.employeeId, attendance.id);
    } catch (error) {
      console.error('Error deleting attendance:', error);
    }
  };

  const handleAttendanceSubmit = async () => {
    // Refresh data after successful submit
    await refreshAttendances();
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedAttendance(null);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setSelectedAttendance(null);
  };

  // Employee filter handler
  const handleEmployeeFilter = (employeeId: string) => {
    filterByEmployee(employeeId);
  };

  return {
    // Data
    attendanceList: filteredAttendances,
    employees,
    loading,
    selectedEmployeeId,
    
    // Modal state
    showAddModal,
    showEditModal,
    showViewModal,
    selectedAttendance,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filterSections,
    handleApplyFilters,
    
    // Actions
    openActionDropdownIndex,
    setOpenActionDropdownIndex,
    handleAddAttendance,
    handleEditAttendance,
    handleViewAttendance,
    handleDeleteAttendance,
    handleAttendanceSubmit,
    handleModalClose,
    handleEmployeeFilter,
    refreshAttendances,
  };
};
