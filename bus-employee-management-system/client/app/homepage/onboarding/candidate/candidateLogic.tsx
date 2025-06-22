/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

export interface Candidate {
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  email: string;
  contact: string;
  address: string;
  position: string;
  department: string;
  applicationDate: string;
  applicationStatus: string;
  interviewStatus: string;
  sourceOfHire: string;
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

    const [candidates, setCandidates] = useState<Candidate[]>([
    {
        firstName: 'Juan',
        middleName: '',
        lastName: 'Dela Cruz',
        birthdate:'22-11-1988',
        email: 'juan.delacruz@example.com',
        contact: '09171234567',
        address: '123 Main St, Manila',
        position: 'Driver',
        department: 'Operations',
        applicationDate: '2023-01-15',
        applicationStatus: 'Processing',
        interviewStatus: 'Scheduled',
        sourceOfHire: 'Referral',
    },
    {
        firstName: 'Mark',
        middleName: '',
        lastName: 'Reyes',
        birthdate:'15-04-1995',
        email: 'mark.reyes@example.com',
        contact: '09181234567',
        address: '456 Second St, Quezon City',
        position: 'Supervisor',
        department: 'Human Resource',
        applicationDate: '2023-03-10',
        applicationStatus: 'Pending',
        interviewStatus: 'Not Scheduled',
        sourceOfHire: 'Direct sourcing',
    },
    {
        firstName: 'Ana',
        middleName: '',
        lastName: 'Santos',
        birthdate:'03-07-2000',
        email: 'ana.santos@example.com',
        contact: '09221234567',
        address: '789 Third St, Makati',
        position: 'Warehouse Staff',
        department: 'Inventory',
        applicationDate: '2022-11-05',
        applicationStatus: 'Processing',
        interviewStatus: 'Not Scheduled',
        sourceOfHire: 'Job boards',
    }
    ]);

    // Filter sections
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(candidates);

    const uniqueDepartments = Array.from(new Set(candidates.map(emp => emp.department)));
    const uniquePositions = Array.from(new Set(candidates.map(emp => emp.position)));
    const uniqueSourceOfHire = Array.from(new Set(candidates.map(emp => emp.sourceOfHire)));

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
        let newData = [...candidates];

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
            const hiredDate = new Date(item.applicationDate);
            return (!fromDate || hiredDate >= fromDate) && (!toDate || hiredDate <= toDate);
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

        setFilteredCandidates(newData);
    };

    const filteredByText = filteredCandidates.filter(c => {
        const fullName = `${c.firstName} ${c.middleName} ${c.lastName}`.toLowerCase();
        return (
        (!applicationStatusFilter || c.applicationStatus === applicationStatusFilter) &&
        (!interviewStatusFilter || c.interviewStatus === interviewStatusFilter) &&
        (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
        );
    });


    const handleAdd = (newCandidate: Candidate) => {
    const updatedList = [...candidates, newCandidate];
    setCandidates(updatedList);
    setFilteredCandidates(updatedList);
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
    setFilteredCandidates(updatedList);
    showSuccess('Success', 'Candidate updated successfully.');
    };

    const handleDeleteRequest = async (candidate: Candidate) => {
    const result = await showConfirmation('Are you sure you want to delete this candidate?');
    if (result.isConfirmed) {
        const updatedList = candidates.filter(
        (c) => `${c.firstName}${c.middleName}${c.lastName}` !== `${candidate.firstName}${candidate.middleName}${candidate.lastName}`
        );
        setCandidates(updatedList);
        setFilteredCandidates(updatedList);
        showSuccess('Success', 'Candidate deleted successfully.');
    }
    };

    return {
    candidates,
    filteredCandidates: filteredByText,
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
    handleApplyFilters
    };
};