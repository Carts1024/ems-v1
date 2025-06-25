'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { showConfirmation, showSuccess } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

export interface Attendance {
  attendanceStatus: '' | 'Present' | 'Absent' | 'Late';
  employeeName: string;
  dateHired: string;
  department: string;
  position: string;
  attendanceDate: string;
}

export const DailyReportLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([{
    attendanceStatus: 'Present',
    employeeName: 'Juan Dela Cruz',
    dateHired: '2023-01-15',
    department: 'Operations',
    position: 'Driver',
    attendanceDate: '2025-06-25'
  }, {
    attendanceStatus: 'Absent',
    employeeName: 'Mark Antonio Reyes',
    dateHired: '2023-03-10',
    department: 'Human Resource',
    position: 'Supervisor',
    attendanceDate: '2025-06-25'
  }, {
    attendanceStatus: 'Late',
    employeeName: 'Ana Liza Santos',
    dateHired: '2022-11-05',
    department: 'Inventory',
    position: 'Warehouse Staff',
    attendanceDate: '2025-06-25'
  }]);

  const departments = Array.from(new Set(attendanceList.map(a => a.department)));
  const positions = Array.from(new Set(attendanceList.map(a => a.position)));

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
        { id: 'date', label: 'Date Hired' }
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
    let data = [...attendanceList];

    if (filters.department?.length)
      data = data.filter(d => filters.department.includes(d.department.toLowerCase()));

    if (filters.position?.length)
      data = data.filter(p => filters.position.includes(p.position.toLowerCase()));

    const sortBy = filters.sortBy;
    const sortOrder = filters.order === 'desc' ? -1 : 1;

    if (sortBy === 'name') {
      data.sort((a, b) => a.employeeName.localeCompare(b.employeeName) * sortOrder);
    } else if (sortBy === 'date') {
      data.sort((a, b) => (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * sortOrder);
    }

    setFilteredEmployees(data);
  };

  const [filteredEmployees, setFilteredEmployees] = useState<Attendance[]>(attendanceList);

  const filteredByText = useMemo(() =>
    filteredEmployees.filter(emp =>
      (!statusFilter || emp.attendanceStatus === statusFilter) &&
      (!searchTerm || emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [filteredEmployees, searchTerm, statusFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredByText.slice(start, start + pageSize);
  }, [filteredByText, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredByText.length / pageSize);

  const handleAdd = (newAttendance: Attendance) => {
    const updated = [...attendanceList, newAttendance];
    setAttendanceList(updated);
    setFilteredEmployees(updated);
    showSuccess('Success', 'Attendance recorded successfully.');
  };

  const handleDeleteRequest = async (record: Attendance) => {
    const result = await showConfirmation('Are you sure you want to delete this record?');
    if (!result.isConfirmed) return;
    const updated = attendanceList.filter(a => a !== record);
    setAttendanceList(updated);
    setFilteredEmployees(updated);
    showSuccess('Success', 'Attendance record deleted.');
  };

  return {
    showAddModal,
    setShowAddModal,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    handleAdd,
    handleDeleteRequest,
    filterSections,
    handleApplyFilters,
    paginatedEmployees,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages
  };
};