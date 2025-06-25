import { useState, useEffect, useMemo } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';
import { LeaveForm, SpecificLeaveType, DurationType, LeaveStatus } from '@/components/modal/requests/leave/LeaveFormModalLogic';

export interface Leave {
    id: string;
    employeeName: string;
    department: string; 
    dateHired: string; 
    jobPosition: string; 
    leaveType: SpecificLeaveType; 
    customLeaveType?: string; 
    startDate: string;
    endDate: string; 
    durationType: DurationType; 
    numberOfHours?: number; 
    specificPartialDate?: string; 
    reasonForLeave: string; 
    contactInformation: string; 
    supportingDocuments: string;
    approver: string; 
    remarks: string; 
    status: LeaveStatus; 
    timeAdded: string;
    timeModified: string;
}

export const LeaveLogic = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    //  single state for active filters from FilterDropdown
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

    const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

    // dummy data
    const [leaves, setLeaves] = useState<Leave[]>([
        {
            id: 'l1',
            employeeName: 'Alice Johnson',
            department: 'Engineering',
            dateHired: '2023-01-15',
            jobPosition: 'Software Engineer',
            leaveType: 'Sick Leave',
            customLeaveType: '',
            startDate: '2024-07-01',
            endDate: '2024-07-02',
            durationType: 'Full Days',
            numberOfHours: undefined,
            specificPartialDate: '',
            reasonForLeave: 'Fever and cold symptoms.',
            contactInformation: 'alice.j@example.com',
            supportingDocuments: '',
            approver: 'John Doe (Manager)',
            remarks: 'Will check emails periodically.',
            status: 'Pending',
            timeAdded: '2024-06-20T10:00:00Z',
            timeModified: '2024-06-20T10:00:00Z'
        },
        {
            id: 'l2',
            employeeName: 'Bob Williams',
            department: 'Marketing',
            dateHired: '2022-05-20',
            jobPosition: 'Marketing Specialist',
            leaveType: 'Vacation Leave',
            customLeaveType: '',
            startDate: '2024-07-10',
            endDate: '2024-07-15',
            durationType: 'Full Days',
            numberOfHours: undefined,
            specificPartialDate: '',
            reasonForLeave: 'Family trip to the beach.',
            contactInformation: 'bob.w@example.com',
            supportingDocuments: 'flight_details.pdf',
            approver: 'Jane Smith (HR)',
            remarks: 'Will have limited access to email.',
            status: 'Approved',
            timeAdded: '2024-06-15T11:30:00Z',
            timeModified: '2024-06-16T09:00:00Z'
        },
        {
            id: 'l3',
            employeeName: 'Charlie Brown',
            department: 'Human Resources',
            dateHired: '2023-10-01',
            jobPosition: 'HR Assistant',
            leaveType: 'Emergency Leave',
            customLeaveType: '',
            startDate: '2024-06-25',
            endDate: '2024-06-25',
            durationType: 'Partial Day (Hours)',
            numberOfHours: 4,
            specificPartialDate: '2024-06-25',
            reasonForLeave: 'Urgent family matter.',
            contactInformation: 'charlie.b@example.com',
            supportingDocuments: '',
            approver: 'John Doe (Manager)',
            remarks: 'Will be back in the afternoon.',
            status: 'Rejected',
            timeAdded: '2024-06-24T14:00:00Z',
            timeModified: '2024-06-24T15:00:00Z'
        },
        {
            id: 'l4',
            employeeName: 'Diana Prince',
            department: 'Sales',
            dateHired: '2021-11-01',
            jobPosition: 'Sales Manager',
            leaveType: 'Vacation Leave',
            customLeaveType: '',
            startDate: '2024-08-01',
            endDate: '2024-08-07',
            durationType: 'Full Days',
            numberOfHours: undefined,
            specificPartialDate: '',
            reasonForLeave: 'Summer vacation.',
            contactInformation: 'diana.p@example.com',
            supportingDocuments: 'hotel_booking.png',
            approver: 'Jane Smith (HR)',
            remarks: 'Please contact my assistant for urgent matters.',
            status: 'Pending',
            timeAdded: '2024-06-10T09:00:00Z',
            timeModified: '2024-06-10T09:00:00Z'
        },
        {
            id: 'l5',
            employeeName: 'Eve Adams',
            department: 'Finance',
            dateHired: '2020-03-10',
            jobPosition: 'Accountant',
            leaveType: 'Maternity Leave',
            customLeaveType: '',
            startDate: '2024-09-01',
            endDate: '2024-12-01',
            durationType: 'Full Days',
            numberOfHours: undefined,
            specificPartialDate: '',
            reasonForLeave: 'Maternity leave.',
            contactInformation: 'eve.a@example.com',
            supportingDocuments: 'medical_certificate.pdf',
            approver: 'John Doe (Manager)',
            remarks: 'Will be out of office.',
            status: 'Approved',
            timeAdded: '2024-05-01T13:00:00Z',
            timeModified: '2024-05-02T08:00:00Z'
        },
    ]);

    // a separate state for current filtered leaves
    const [currentFilteredLeaves, setCurrentFilteredLeaves] = useState<Leave[]>(leaves);

    useEffect(() => {
        handleApplyFilters(activeFilters); 
    }, [leaves]); 

    const filterSections: FilterSection[] = [
        {
            id: "leaveType",
            title: "Leave Type",
            type: "checkbox",
            options: [
                { id: "Sick Leave", label: "Sick Leave" }, // Updated ID to match SpecificLeaveType
                { id: "Vacation Leave", label: "Vacation Leave" }, // Updated ID
                { id: "Emergency Leave", label: "Emergency Leave" }, // Updated ID
                { id: "Maternity Leave", label: "Maternity Leave" }, // Updated ID
                { id: "Paternity Leave", label: "Paternity Leave" }, // Updated ID
                { id: "Bereavement Leave", label: "Bereavement Leave" }, // New option
                { id: "Leave Without Pay", label: "Leave Without Pay" }, // New option
                { id: "Custom Leave", label: "Custom Leave" }, // New option
            ],
            defaultValue: []
        },
        {
            id: "status",
            title: "Status",
            type: "radio",
            options: [
                { id: "Pending", label: "Pending" },
                { id: "Approved", label: "Approved" },
                { id: "Rejected", label: "Rejected" },
            ],
            defaultValue: ""
        },
        {
            id: "startDateRange",
            title: "Start Date Range",
            type: "dateRange",
            defaultValue: { from: "", to: "" }
        },
        {
            id: "sortBy",
            title: "Sort By",
            type: "radio",
            options: [
                { id: "employeeName", label: "Employee Name" },
                { id: "startDate", label: "Start Date" },
                { id: "status", label: "Status" },
                { id: "timeAdded", label: "Time Added" },
            ],
            defaultValue: "timeAdded"
        },
        {
            id: "order",
            title: "Order",
            type: "radio",
            options: [
                { id: "asc", label: "Ascending" },
                { id: "desc", label: "Descending" }
            ],
            defaultValue: "desc"
        }
    ];

    const handleApplyFilters = (filterValues: Record<string, any>) => {
        setActiveFilters(filterValues);

        let newData = [...leaves];

        // Apply search term first (from the input field)
        const filteredBySearch = newData.filter(leave =>
            leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.department.toLowerCase().includes(searchTerm.toLowerCase()) || // Added department to search
            leave.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) // Added jobPosition to search
        );
        newData = filteredBySearch;

        // Apply filters from filterValues
        if (filterValues.leaveType && filterValues.leaveType.length > 0) {
            newData = newData.filter(leave =>
                filterValues.leaveType.includes(leave.leaveType)
            );
        }

        if (filterValues.status) {
            newData = newData.filter(leave => leave.status === filterValues.status);
        }

        // Apply start date range filter
        if (filterValues.startDateRange) {
            const fromDate = filterValues.startDateRange.from ? new Date(filterValues.startDateRange.from) : null;
            const toDate = filterValues.startDateRange.to ? new Date(filterValues.startDateRange.to) : null;

            newData = newData.filter(leave => {
                const leaveStartDate = new Date(leave.startDate);
                return (
                    (!fromDate || leaveStartDate >= fromDate) &&
                    (!toDate || leaveStartDate <= toDate)
                );
            });
        }

        // Sorting
        const sortBy = filterValues.sortBy;
        const sortOrder = filterValues.order === 'desc' ? -1 : 1;
        if (sortBy === 'employeeName') {
            newData.sort((a, b) => a.employeeName.localeCompare(b.employeeName) * sortOrder);
        } else if (sortBy === 'startDate') {
            newData.sort((a, b) => (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * sortOrder);
        } else if (sortBy === 'status') {
            newData.sort((a, b) => a.status.localeCompare(b.status) * sortOrder);
        } else if (sortBy === 'timeAdded') {
            newData.sort((a, b) => (new Date(a.timeAdded).getTime() - new Date(b.timeAdded).getTime()) * sortOrder);
        }

        setCurrentFilteredLeaves(newData);
        setCurrentPage(1);
    };

    const finalFilteredLeaves = useMemo(() => {
        return currentFilteredLeaves.filter((leave) => {
            const matchesSearch =
                leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                leave.department.toLowerCase().includes(searchTerm.toLowerCase()) || 
                leave.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()); 
            return matchesSearch;
        });
    }, [currentFilteredLeaves, searchTerm]);


    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const paginatedLeaves = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return finalFilteredLeaves.slice(start, start + pageSize);
    }, [finalFilteredLeaves, currentPage, pageSize]);

    const totalPages = Math.ceil(finalFilteredLeaves.length / pageSize);

    const generateUniqueId = () => `l${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const handleAdd = async (newLeaveData: LeaveForm): Promise<void> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const id = generateUniqueId();
            const now = new Date().toISOString();

            // Create a full Leave object from newLeaveData
            const fullLeave: Leave = {
                id: id,
                employeeName: newLeaveData.employeeName,
                department: newLeaveData.department,
                dateHired: newLeaveData.dateHired,
                jobPosition: newLeaveData.jobPosition,
                leaveType: newLeaveData.leaveType, 
                customLeaveType: newLeaveData.customLeaveType,
                startDate: newLeaveData.startDate,
                endDate: newLeaveData.endDate,
                durationType: newLeaveData.durationType,
                numberOfHours: newLeaveData.numberOfHours,
                specificPartialDate: newLeaveData.specificPartialDate,
                reasonForLeave: newLeaveData.reasonForLeave,
                contactInformation: newLeaveData.contactInformation,
                supportingDocuments: newLeaveData.supportingDocuments,
                approver: newLeaveData.approver,
                remarks: newLeaveData.remarks,
                status: newLeaveData.status, 
                timeAdded: now,
                timeModified: now,
            };

            const updatedList = [...leaves, fullLeave];
            setLeaves(updatedList);
            await showSuccess('Success', 'Leave request added successfully!');
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add leave:', error);
            showError('Error', 'Failed to add leave request.');
        }
    };

    const handleEdit = async (updatedLeaveFormData: LeaveForm): Promise<void> => {
        try {
            if (!selectedLeave) {
                showError('Error', 'No leave selected for editing.');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const now = new Date().toISOString();
            
            // Merge updated form data into the existing selected leave, preserving ID and original timeAdded
            const updatedFullLeave: Leave = {
                ...selectedLeave, // Keep existing properties not directly in form
                ...updatedLeaveFormData, // Apply form updates
                id: selectedLeave.id, // Ensure ID is preserved
                timeAdded: selectedLeave.timeAdded, // Ensure original timeAdded is preserved
                timeModified: now, // Update timeModified
                leaveType: updatedLeaveFormData.leaveType, // No cast needed
                status: updatedLeaveFormData.status, // No cast needed
            };

            const updatedList = leaves.map((leave) =>
                leave.id === updatedFullLeave.id ? updatedFullLeave : leave
            );
            setLeaves(updatedList);
            setShowEditModal(false);
            setSelectedLeave(null);
            showSuccess('Success', 'Leave request updated successfully!');
        } catch (error) {
            console.error('Failed to update leave:', error);
            showError('Error', 'Failed to update leave request.');
        }
    };

    const handleDeleteRequest = async (leaveId: string) => {
        const leaveToDelete = leaves.find((l) => l.id === leaveId);

        if (!leaveToDelete) {
            showError('Error', 'Leave not found.');
            return;
        }

        if (leaveToDelete.status === 'Approved') {
            return showError('Error', 'Approved leave requests cannot be deleted.');
        }

        const result = await showConfirmation(`Are you sure you want to delete the leave request for ${leaveToDelete.employeeName}?`);
        if (result.isConfirmed) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const updatedList = leaves.filter((l) => l.id !== leaveId);
                setLeaves(updatedList);
                showSuccess('Success', 'Leave request deleted successfully.');
            } catch (error) {
                console.error('Failed to delete leave:', error);
                showError('Error', 'Failed to delete leave request.');
            }
        }
    };

    const toggleActionDropdown = (index: number | null) => {
        setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
    };

    const openAddModal = () => {
        setSelectedLeave(null);
        setShowAddModal(true);
    };

    const openEditModal = (leave: Leave) => {
        setSelectedLeave(leave);
        setShowEditModal(true);
    };

    return {
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        selectedLeave,
        setSelectedLeave,
        leaves,
        filteredLeaves: finalFilteredLeaves,
        paginatedLeaves,
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