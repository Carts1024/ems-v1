/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/utils/swal'; 

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
  | '';

export interface LeaveForm {
  id?: string; 
  employee: string;
  department: string; 
  dateHired: string; 
  jobPosition: string; 
  leaveType: SpecificLeaveType;
  customLeaveType?: string; 
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  durationType: DurationType; 
  numberOfHours?: number; 
  specificPartialDate?: string; 
  reason: string; 
  contactInformation: string; 
  supportingDocuments: string; 
  approver: string; 
  remarks: string;
  status: LeaveStatus; 
  // createdAt and updatedAt are handled by the main LeaveLogic when adding/editing
  // so they are not part of the form's direct input.
}

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
    employee: '',
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
    reason: '',
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

    if ((isEdit || isView) && defaultValue) {
      return {
        id: defaultValue.id,
        employee: defaultValue.employee || '',
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
        reason: defaultValue.reason || '',
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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if ((isEdit || isView) && defaultValue) {

      if (leave.id !== defaultValue.id) { 
        setLeave({
          id: defaultValue.id,
          employee: defaultValue.employee || '',
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
          reason: defaultValue.reason || '',
          contactInformation: defaultValue.contactInformation || '',
          supportingDocuments: defaultValue.supportingDocuments || '',
          approver: defaultValue.approver || '',
          remarks: defaultValue.remarks || '',
          status: defaultValue.status || 'Pending',
        });
      }
    } else if (!isEdit && !isView) { 
      const baseDefault = getBaseDefaultLeave(today);

      if (JSON.stringify(leave) !== JSON.stringify(baseDefault)) {
         setLeave(baseDefault);
      }
    }
    setFieldErrors({}); 
  }, [isEdit, isView, defaultValue]);


  // Handle input changes
  const handleChange = (field: keyof LeaveForm, value: string | DurationType | number) => {
    setLeave(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined })); 
  };

  // Calculate duration in days
  const calculateDuration = () => {
    if (!leave.startDate || !leave.endDate) return 0;
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; 
  };

  // Validate form inputs
  const validateInput = () => {
    const errors: typeof fieldErrors = {};

    // Skip validation if in view mode
    if (isView) {
      return true;
    }

    // Employee Details Validation
    if (!leave.employee.trim()) {
      errors.employee = 'Employee Name is required.';
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
          const partialDate = new Date(leave.specificPartialDate);
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);

          if (partialDate < startDate || partialDate > endDate) {
              errors.specificPartialDate = 'Specific Date for Partial Leave must be between Start Date and End Date.';
          }
      }
    }


    // Other Info Validation
    if (!leave.reason.trim()) {
      errors.reason = 'Reason for Leave is required.';
    }

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

    onSubmit(leave);

  };

  // Handle form update (for editing existing leave)
  const handleUpdateConfirm = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }


    onSubmit(leave);

  };

  return {
    leave,
    setLeave, 
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
    calculateDuration,
  };
};