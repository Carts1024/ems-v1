// src/app/cashAdvance/cashAdvanceLogic.ts
import { useState, useEffect, useMemo } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';
import { FilterSection } from '@/components/ui/filterDropdown';

// --- Type Definitions (Moved to CAModalLogic as well for clarity, but kept here for now for dependency) ---
export type AdvanceType = 'General Cash Advance' | 'Travel Advance' | 'Project Advance' | 'Emergency Advance' | 'Other';
export type PaymentMethod = 'Deduction from next payroll' | 'Deduction over periods' | 'Full repayment on specific date';
export type AdvanceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed' | 'Cancelled';

// Interface for form data (what the modal submits)
export interface CashAdvanceForm {
    employeeName: string;
    department: string;
    dateHired: string; // YYYY-MM-DD format
    jobPosition: string;
    advanceType: AdvanceType;
    amount: number;
    purpose: string;
    repaymentMethod: PaymentMethod;
    numberOfRepaymentPeriods?: number;
    fullRepaymentDate?: string; // YYYY-MM-DD
    dueDate: string;
    receiptsAttached: boolean;
    approver: string;
    remarks: string;
    status: AdvanceStatus;
    acknowledgment: boolean;
    supportingDocuments?: string;
}

// Interface for the full Cash Advance object (stored in the list)
// This extends CashAdvanceForm and adds unique ID and timestamps
export interface CashAdvance extends CashAdvanceForm {
    id: string;
    timeAdded: string;
    timeModified: string;
}

export const CashAdvanceLogic = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCashAdvance, setSelectedCashAdvance] = useState<CashAdvance | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [openActionDropdownIndex, setOpenActionDropdownIndex] = useState<number | null>(null);

    const [cashAdvances, setCashAdvances] = useState<CashAdvance[]>([
        {
            id: 'ca1',
            employeeName: 'Alice Johnson',
            department: 'Engineering',
            dateHired: '2023-01-15',
            jobPosition: 'Software Engineer',
            advanceType: 'Travel Advance',
            amount: 500.00,
            purpose: 'Business trip to New York for client meeting.',
            repaymentMethod: 'Deduction from next payroll',
            numberOfRepaymentPeriods: undefined,
            fullRepaymentDate: undefined,
            dueDate: '2024-07-30',
            receiptsAttached: false,
            approver: 'John Doe (Manager)',
            remarks: 'Requires reimbursement after trip.',
            status: 'Pending',
            acknowledgment: true,
            supportingDocuments: '',
            timeAdded: '2024-06-20T10:00:00Z',
            timeModified: '2024-06-20T10:00:00Z'
        },
        {
            id: 'ca2',
            employeeName: 'Bob Williams',
            department: 'Marketing',
            dateHired: '2022-05-20',
            jobPosition: 'Marketing Specialist',
            advanceType: 'General Cash Advance',
            amount: 150.00,
            purpose: 'Office supplies purchase for team event.',
            repaymentMethod: 'Deduction over periods',
            numberOfRepaymentPeriods: 3,
            fullRepaymentDate: undefined,
            dueDate: '2024-07-05',
            receiptsAttached: true,
            approver: 'Jane Smith (HR)',
            remarks: 'Receipt attached for verification.',
            status: 'Approved',
            acknowledgment: true,
            supportingDocuments: 'invoice_123.pdf',
            timeAdded: '2024-06-15T11:30:00Z',
            timeModified: '2024-06-16T09:00:00Z'
        },
        {
            id: 'ca3',
            employeeName: 'Charlie Brown',
            department: 'Human Resources',
            dateHired: '2023-10-01',
            jobPosition: 'HR Assistant',
            advanceType: 'Emergency Advance',
            amount: 300.00,
            purpose: 'Urgent medical expenses for family member.',
            repaymentMethod: 'Full repayment on specific date',
            numberOfRepaymentPeriods: undefined,
            fullRepaymentDate: '2024-08-10',
            dueDate: '2024-06-28',
            receiptsAttached: false,
            approver: 'John Doe (Manager)',
            remarks: 'Will provide medical certificate later.',
            status: 'Rejected',
            acknowledgment: true,
            supportingDocuments: '',
            timeAdded: '2024-06-24T14:00:00Z',
            timeModified: '2024-06-24T15:00:00Z'
        },
        {
            id: 'ca4',
            employeeName: 'Diana Prince',
            department: 'Sales',
            dateHired: '2021-11-01',
            jobPosition: 'Sales Manager',
            advanceType: 'Project Advance',
            amount: 1200.00,
            purpose: 'Funding for "Q3 Sales Boost" project.',
            repaymentMethod: 'Deduction from next payroll',
            numberOfRepaymentPeriods: undefined,
            fullRepaymentDate: undefined,
            dueDate: '2024-08-15',
            receiptsAttached: false,
            approver: 'Jane Smith (HR)',
            remarks: 'Detailed project budget to follow.',
            status: 'Pending',
            acknowledgment: true,
            supportingDocuments: 'project_proposal.pdf',
            timeAdded: '2024-06-10T09:00:00Z',
            timeModified: '2024-06-10T09:00:00Z'
        },
        {
            id: 'ca5',
            employeeName: 'Eve Adams',
            department: 'Finance',
            dateHired: '2020-03-10',
            jobPosition: 'Accountant',
            advanceType: 'General Cash Advance',
            amount: 75.00,
            purpose: 'Reimbursement for office snack purchases.',
            repaymentMethod: 'Deduction from next payroll',
            numberOfRepaymentPeriods: undefined,
            fullRepaymentDate: undefined,
            dueDate: '2024-06-25',
            receiptsAttached: true,
            approver: 'John Doe (Manager)',
            remarks: 'All receipts attached and verified.',
            status: 'Reimbursed',
            acknowledgment: true,
            supportingDocuments: 'snacks_receipt.jpg',
            timeAdded: '2024-06-05T13:00:00Z',
            timeModified: '2024-06-06T08:00:00Z'
        },
    ]);

    const [currentFilteredCashAdvances, setCurrentFilteredCashAdvances] = useState<CashAdvance[]>(cashAdvances);

    useEffect(() => {
        handleApplyFilters(activeFilters);
    }, [cashAdvances]);

    const filterSections: FilterSection[] = [
        {
            id: "advanceType",
            title: "Advance Type",
            type: "checkbox",
            options: [
                { id: "General Cash Advance", label: "General Cash Advance" },
                { id: "Travel Advance", label: "Travel Advance" },
                { id: "Project Advance", label: "Project Advance" },
                { id: "Emergency Advance", label: "Emergency Advance" },
                { id: "Other", label: "Other" },
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
                { id: "Reimbursed", label: "Reimbursed" },
                { id: "Cancelled", label: "Cancelled" },
            ],
            defaultValue: ""
        },
        {
            id: "repaymentMethod",
            title: "Repayment Method",
            type: "checkbox",
            options: [
                { id: "Deduction from next payroll", label: "Deduction from next payroll" },
                { id: "Deduction over periods", label: "Deduction over periods" },
                { id: "Full repayment on specific date", label: "Full repayment on specific date" },
            ],
            defaultValue: []
        },
        {
            id: "dueDateRange",
            title: "Due Date Range",
            type: "dateRange",
            defaultValue: { from: "", to: "" }
        },
        {
            id: "sortBy",
            title: "Sort By",
            type: "radio",
            options: [
                { id: "employeeName", label: "Employee Name" },
                { id: "amount", label: "Amount" },
                { id: "dueDate", label: "Due Date" },
                { id: "status", label: "Status" },
            ],
            defaultValue: "employeeName"
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

        let newData = [...cashAdvances];

        const filteredBySearch = newData.filter(ca =>
            ca.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ca.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ca.advanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ca.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ca.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        newData = filteredBySearch;

        if (filterValues.advanceType && filterValues.advanceType.length > 0) {
            newData = newData.filter(ca =>
                filterValues.advanceType.includes(ca.advanceType)
            );
        }

        if (filterValues.status) {
            newData = newData.filter(ca => ca.status === filterValues.status);
        }

        if (filterValues.repaymentMethod && filterValues.repaymentMethod.length > 0) {
            newData = newData.filter(ca =>
                filterValues.repaymentMethod.includes(ca.repaymentMethod)
            );
        }

        if (filterValues.dueDateRange) {
            const fromDate = filterValues.dueDateRange.from ? new Date(filterValues.dueDateRange.from) : null;
            const toDate = filterValues.dueDateRange.to ? new Date(filterValues.dueDateRange.to) : null;

            newData = newData.filter(ca => {
                const dateToCheck = ca.repaymentMethod === 'Full repayment on specific date' && ca.fullRepaymentDate
                                         ? new Date(ca.fullRepaymentDate)
                                         : new Date(ca.dueDate);

                return (
                    (!fromDate || dateToCheck >= fromDate) &&
                    (!toDate || dateToCheck <= toDate)
                );
            });
        }

        const sortBy = filterValues.sortBy;
        const sortOrder = filterValues.order === 'desc' ? -1 : 1;
        if (sortBy === 'employeeName') {
            newData.sort((a, b) => a.employeeName.localeCompare(b.employeeName) * sortOrder);
        }
        else if (sortBy === 'amount') {
            newData.sort((a, b) => (a.amount - b.amount) * sortOrder);
        } else if (sortBy === 'dueDate') {
            newData.sort((a, b) => {
                const dateA = a.repaymentMethod === 'Full repayment on specific date' && a.fullRepaymentDate
                                  ? new Date(a.fullRepaymentDate).getTime()
                                  : new Date(a.dueDate).getTime();
                const dateB = b.repaymentMethod === 'Full repayment on specific date' && b.fullRepaymentDate
                                  ? new Date(b.fullRepaymentDate).getTime()
                                  : new Date(b.dueDate).getTime();
                return (dateA - dateB) * sortOrder;
            });
        } else if (sortBy === 'status') {
            newData.sort((a, b) => a.status.localeCompare(b.status) * sortOrder);
        }

        setCurrentFilteredCashAdvances(newData);
        setCurrentPage(1);
    };

    const finalFilteredCashAdvances = useMemo(() => {
        return currentFilteredCashAdvances.filter((ca) => {
            const matchesSearch =
                ca.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.advanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ca.department.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [currentFilteredCashAdvances, searchTerm]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const paginatedCashAdvances = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return finalFilteredCashAdvances.slice(start, start + pageSize);
    }, [finalFilteredCashAdvances, currentPage, pageSize]);

    const totalPages = Math.ceil(finalFilteredCashAdvances.length / pageSize);

    const generateUniqueId = () => `ca${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const handleAdd = async (newCashAdvanceData: CashAdvanceForm): Promise<void> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const id = generateUniqueId();
            const now = new Date().toISOString();

            const fullCashAdvance: CashAdvance = {
                ...newCashAdvanceData,
                id: id,
                timeAdded: now,
                timeModified: now,
            };

            const updatedList = [...cashAdvances, fullCashAdvance];
            setCashAdvances(updatedList);
            await showSuccess('Success', 'Cash advance request added successfully!');
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to add cash advance:', error);
            showError('Error', 'Failed to add cash advance request.');
        }
    };

    const handleEdit = async (updatedCashAdvanceFormData: CashAdvanceForm): Promise<void> => {
        try {
            if (!selectedCashAdvance) {
                showError('Error', 'No cash advance selected for editing.');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const now = new Date().toISOString();

            const updatedFullCashAdvance: CashAdvance = {
                ...selectedCashAdvance,
                ...updatedCashAdvanceFormData,
                id: selectedCashAdvance.id,
                timeAdded: selectedCashAdvance.timeAdded,
                timeModified: now,
            };

            const updatedList = cashAdvances.map((ca) =>
                ca.id === updatedFullCashAdvance.id ? updatedFullCashAdvance : ca
            );
            setCashAdvances(updatedList);
            setShowEditModal(false);
            setSelectedCashAdvance(null);
            showSuccess('Success', 'Cash advance request updated successfully!');
        } catch (error) {
            console.error('Failed to update cash advance:', error);
            showError('Error', 'Failed to update cash advance request.');
        }
    };

    const handleDeleteRequest = async (cashAdvanceId: string) => {
        const cashAdvanceToDelete = cashAdvances.find((ca) => ca.id === cashAdvanceId);

        if (!cashAdvanceToDelete) {
            showError('Error', 'Cash advance not found.');
            return;
        }

        if (cashAdvanceToDelete.status === 'Approved' || cashAdvanceToDelete.status === 'Reimbursed') {
            return showError('Error', 'Approved or Reimbursed cash advance requests cannot be deleted.');
        }

        const result = await showConfirmation(`Are you sure you want to delete the cash advance request for ${cashAdvanceToDelete.employeeName} (Amount: PHP ${cashAdvanceToDelete.amount.toFixed(2)})?`);
        if (result.isConfirmed) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const updatedList = cashAdvances.filter((ca) => ca.id !== cashAdvanceId);
                setCashAdvances(updatedList);
                showSuccess('Success', 'Cash advance request deleted successfully.');
            } catch (error) {
                console.error('Failed to delete cash advance:', error);
                showError('Error', 'Failed to delete cash advance request.');
            }
        }
    };

    const toggleActionDropdown = (index: number | null) => {
        setOpenActionDropdownIndex(openActionDropdownIndex === index ? null : index);
    };

    const openAddModal = () => {
        setSelectedCashAdvance(null);
        setShowAddModal(true);
    };

    const openEditModal = (cashAdvance: CashAdvance) => {
        setSelectedCashAdvance(cashAdvance);
        setShowEditModal(true);
    };

    return {
        searchTerm,
        setSearchTerm,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        selectedCashAdvance,
        setSelectedCashAdvance,
        cashAdvances,
        filteredCashAdvances: finalFilteredCashAdvances,
        paginatedCashAdvances,
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