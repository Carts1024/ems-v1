// src/components/modal/leave/leaveFormModalLogic.tsx
'use client';

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/utils/swal'; // Re-using swal utilities

// Define DurationType for radio button selection
export type DurationType = 'Full Days' | 'Partial Day (Hours)';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type SpecificLeaveType =
  | 'Sick Leave'
  | 'Vacation Leave'
  | 'Emergency Leave'
  | 'Maternity Leave'
  | 'Paternity Leave'
  | 'Bereavement Leave'
  | 'Leave Without Pay'
  | 'Custom Leave'
  | ''; // Allow empty for initial state

// This will represent the data state of the form
export interface LeaveForm {
  id?: string; // Optional ID for existing leaves (when editing)
  employeeName: string;
  department: string; // New field
  dateHired: string; // New field (YYYY-MM-DD format)
  jobPosition: string; // New field
  leaveType: SpecificLeaveType;
  customLeaveType?: string; // New field for custom leave
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  durationType: DurationType; // New field
  numberOfHours?: number; // New field, optional
  specificPartialDate?: string; // New field, optional (YYYY-MM-DD format)
  reasonForLeave: string; // New field
  contactInformation: string; // New field, optional
  supportingDocuments: string; // New field, optional (just filename for now)
  approver: string; // New field
  remarks: string; // New field, optional
  status: LeaveStatus; // Status will be managed here
  // timeAdded and timeModified are handled by the main LeaveLogic when adding/editing
  // so they are not part of the form's direct input.
}

// Helper function to check if a date is in the past
const isDateInPast = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Normalize input date to start of day
  return date < today;
};

// Helper function to validate if date hired is 3 months ago or more
const isHiredDateValid = (dateHiredString: string) => {
  const hiredDate = new Date(dateHiredString);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  threeMonthsAgo.setHours(0, 0, 0, 0);
  return hiredDate <= threeMonthsAgo;
};

// Custom hook for Leave Form Modal logic
export const useLeaveFormModal = (
  isEdit: boolean,
  defaultValue: LeaveForm | undefined,
  onSubmit: (leave: LeaveForm) => void,
  onClose: () => void,
  existingEmployees: string[],
  isView: boolean // Added isView as a parameter to the hook
) => {

  // Define a base default state for all fields
  const getBaseDefaultLeave = (todayDate: string): LeaveForm => ({
    employeeName: '',
    department: '',
    dateHired: '',
    jobPosition: '',
    leaveType: '',
    customLeaveType: '',
    startDate: todayDate,
    endDate: todayDate,
    durationType: 'Full Days',
    numberOfHours: undefined,
    specificPartialDate: '',
    reasonForLeave: '',
    contactInformation: '',
    supportingDocuments: '',
    approver: '',
    remarks: '',
    status: 'Pending',
  });

  // Initialize form state using a functional update
  const [leave, setLeave] = useState<LeaveForm>(() => {
    const today = new Date().toISOString().split('T')[0];
    const baseDefault = getBaseDefaultLeave(today);

    // If it's a view mode, or edit mode with a defaultValue, use it directly for initial state
    if ((isEdit || isView) && defaultValue) {
      return {
        id: defaultValue.id,
        employeeName: defaultValue.employeeName || '',
        department: defaultValue.department || '',
        dateHired: defaultValue.dateHired || '',
        jobPosition: defaultValue.jobPosition || '',
        leaveType: defaultValue.leaveType || '',
        customLeaveType: defaultValue.customLeaveType || '',
        startDate: defaultValue.startDate || today,
        endDate: defaultValue.endDate || today,
        durationType: defaultValue.durationType || 'Full Days',
        numberOfHours: defaultValue.numberOfHours || undefined,
        specificPartialDate: defaultValue.specificPartialDate || '',
        reasonForLeave: defaultValue.reasonForLeave || '',
        contactInformation: defaultValue.contactInformation || '',
        supportingDocuments: defaultValue.supportingDocuments || '',
        approver: defaultValue.approver || '',
        remarks: defaultValue.remarks || '',
        status: defaultValue.status || 'Pending',
      };
    } else {
      return baseDefault;
    }
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof LeaveForm]?: string }>({});

  // UseEffect to update leave state when defaultValue changes for edit/view modes
  // This effect should NOT have 'leave' as a dependency to avoid circular updates.
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if ((isEdit || isView) && defaultValue) {
      // Check if the incoming defaultValue is different from the current leave state
      // This prevents unnecessary updates when the defaultValue object reference changes
      // but the actual data (based on ID) is the same.
      if (leave.id !== defaultValue.id) { // Use ID for stable comparison
        setLeave({
          id: defaultValue.id,
          employeeName: defaultValue.employeeName || '',
          department: defaultValue.department || '',
          dateHired: defaultValue.dateHired || '',
          jobPosition: defaultValue.jobPosition || '',
          leaveType: defaultValue.leaveType || '',
          customLeaveType: defaultValue.customLeaveType || '',
          startDate: defaultValue.startDate || today,
          endDate: defaultValue.endDate || today,
          durationType: defaultValue.durationType || 'Full Days',
          numberOfHours: defaultValue.numberOfHours || undefined,
          specificPartialDate: defaultValue.specificPartialDate || '',
          reasonForLeave: defaultValue.reasonForLeave || '',
          contactInformation: defaultValue.contactInformation || '',
          supportingDocuments: defaultValue.supportingDocuments || '',
          approver: defaultValue.approver || '',
          remarks: defaultValue.remarks || '',
          status: defaultValue.status || 'Pending',
        });
      }
    } else if (!isEdit && !isView) { // Logic for when the modal is in Add mode
      const baseDefault = getBaseDefaultLeave(today);
      // Only reset to base default if the current leave state is not already the default one.
      // This prevents infinite loops when opening the Add modal repeatedly.
      // A more robust comparison is used here.
      if (JSON.stringify(leave) !== JSON.stringify(baseDefault)) {
         setLeave(baseDefault);
      }
    }
    setFieldErrors({}); // Always clear errors when default value changes or modal mode changes
  }, [isEdit, isView, defaultValue]); // 'leave' is explicitly removed from dependencies here.


  // Handle input changes
  const handleChange = (field: keyof LeaveForm, value: string | DurationType | number) => {
    setLeave(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined })); // Clear error on change
  };

  // Calculate duration in days
  const calculateDuration = () => {
    if (!leave.startDate || !leave.endDate) return 0;
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end day
  };

  // Validate form inputs
  const validateInput = () => {
    const errors: typeof fieldErrors = {};

    // Skip validation if in view mode
    if (isView) {
      return true;
    }

    // Employee Details Validation
    if (!leave.employeeName.trim()) {
      errors.employeeName = 'Employee Name is required.';
    }
    if (!leave.department.trim()) {
      errors.department = 'Department is required.';
    }
    if (!leave.dateHired) {
      errors.dateHired = 'Date Hired is required.';
    } else if (!isHiredDateValid(leave.dateHired)) {
      errors.dateHired = 'Leave is allowed only if hired 3 months ago or more.';
    }
    if (!leave.jobPosition.trim()) {
      errors.jobPosition = 'Job Position is required.';
    }
    if (!leave.approver) {
      errors.approver = 'Approver is required.';
    }


    // Leave Type Validation
    if (!leave.leaveType) {
      errors.leaveType = 'Leave Type is required.';
    }
    if (leave.leaveType === 'Custom Leave' && (!leave.customLeaveType || !leave.customLeaveType.trim())) {
      errors.customLeaveType = 'Custom Leave Type name is required.';
    }

    // Date Validation
    if (!leave.startDate) {
      errors.startDate = 'Start Date is required.';
    } else if (isDateInPast(leave.startDate) && leave.leaveType !== 'Emergency Leave' && !isEdit) {
      errors.startDate = 'Start Date cannot be in the past (except for Emergency Leave).';
    }
    if (!leave.endDate) {
      errors.endDate = 'End Date is required.';
    } else if (new Date(leave.startDate) > new Date(leave.endDate)) {
      errors.endDate = 'End Date cannot be before Start Date.';
    }

    // Duration Type Specific Validation
    if (leave.durationType === 'Partial Day (Hours)') {
      if (typeof leave.numberOfHours === 'undefined' || leave.numberOfHours <= 0 || leave.numberOfHours > 24) {
        errors.numberOfHours = 'Number of Hours must be between 1 and 24.';
      }
      if (!leave.specificPartialDate) {
        errors.specificPartialDate = 'Specific Date for Partial Leave is required.';
      } else if (new Date(leave.specificPartialDate).toDateString() !== new Date(leave.startDate).toDateString() && new Date(leave.specificPartialDate).toDateString() !== new Date(leave.endDate).toDateString()) {
          // Validate if specificPartialDate is within the start and end date range for partial leave
          const partialDate = new Date(leave.specificPartialDate);
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);

          if (partialDate < startDate || partialDate > endDate) {
              errors.specificPartialDate = 'Specific Date for Partial Leave must be between Start Date and End Date.';
          }
      }
    }


    // Other Info Validation
    if (!leave.reasonForLeave.trim()) {
      errors.reasonForLeave = 'Reason for Leave is required.';
    }

    // Additional validation for status if in edit mode (as it's user-editable)
    if (isEdit && !leave.status) {
      errors.status = 'Status is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (for adding new leave)
  const handleSubmit = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    // Call the onSubmit prop from the parent (LeavePage)
    // The parent will handle adding the new leave to its state/database
    onSubmit(leave);
    // Success message is handled by the parent's handleAdd/handleEdit
    // onClose(); // Parent will close the modal
  };

  // Handle form update (for editing existing leave)
  const handleUpdateConfirm = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }

    // Call the onSubmit prop from the parent (LeavePage)
    // The parent will handle updating the existing leave
    onSubmit(leave);
    // Success message is handled by the parent's handleAdd/handleEdit
    // onClose(); // Parent will close the modal
  };

  return {
    leave,
    setLeave, // Expose setLeave for parent to reset if needed
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
    calculateDuration, // Expose calculateDuration for component to use
  };
};
