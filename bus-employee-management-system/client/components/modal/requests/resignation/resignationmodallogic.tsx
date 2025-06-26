'use client';

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/utils/swal'; //

// Type Definitions for Resignation Modal
export type ResignationStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';

export interface ResignationForm {
  id?: string;
  employeeName: string;
  employeeJobPosition: string;
  department: string; 
  lastDayOfEmployment: string;
  noticePeriod: number; 
  status: ResignationStatus;
  reason?: string; // Optional field for reason of resignation
  remarks?: string; // Optional remarks
}

// Company policy: minimum notice period in days
const MIN_NOTICE_DAYS = 30;

// Helper function to check if a date is in the past
const isDateInPast = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Normalize input date to start of day
  return date < today;
};

// Helper function to check if a date meets the minimum notice period
const meetsNoticePeriod = (lastDay: string, noticeDays: number): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDayDate = new Date(lastDay);
  lastDayDate.setHours(0, 0, 0, 0);

  // Calculate the required submission date based on last day and notice period
  const requiredSubmissionDate = new Date(lastDayDate);
  requiredSubmissionDate.setDate(requiredSubmissionDate.getDate() - noticeDays);

  // If today is before or on the required submission date, the notice period is met
  return today <= requiredSubmissionDate;
};


export const useResignationModalLogic = (
  isEdit: boolean,
  defaultValue: ResignationForm | undefined,
  onSubmit: (resignation: ResignationForm) => void,
  onClose: () => void,
  isView: boolean
) => {

  const getBaseDefaultResignation = (): ResignationForm => ({
    employeeName: '',
    employeeJobPosition: '',
    department: '', 
    lastDayOfEmployment: '', // Will be validated to be in future with notice
    noticePeriod: MIN_NOTICE_DAYS, // Default to company policy
    status: 'Pending',
    reason: '',
    remarks: '',
  });

  const [resignation, setResignation] = useState<ResignationForm>(() => {
    if ((isEdit || isView) && defaultValue) {
      return {
        id: defaultValue.id,
        employeeName: defaultValue.employeeName || '',
        employeeJobPosition: defaultValue.employeeJobPosition || '',
        department: defaultValue.department || '',
        lastDayOfEmployment: defaultValue.lastDayOfEmployment || '',
        noticePeriod: defaultValue.noticePeriod || MIN_NOTICE_DAYS,
        status: defaultValue.status || 'Pending',
        reason: defaultValue.reason || '',
        remarks: defaultValue.remarks || '',
      };
    } else {
      return getBaseDefaultResignation();
    }
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof ResignationForm]?: string }>({});

  // Effect to reset form or load default values when modal type changes
  useEffect(() => {
    if ((isEdit || isView) && defaultValue) {
      const currentDefaultValue = JSON.stringify(resignation);
      const incomingDefaultValue = JSON.stringify({
        id: defaultValue.id,
        employeeName: defaultValue.employeeName || '',
        employeeJobPosition: defaultValue.employeeJobPosition || '',
        department: defaultValue.department || '', 
        lastDayOfEmployment: defaultValue.lastDayOfEmployment || '',
        noticePeriod: defaultValue.noticePeriod || MIN_NOTICE_DAYS,
        status: defaultValue.status || 'Pending',
        reason: defaultValue.reason || '',
        remarks: defaultValue.remarks || '',
      });

      if (currentDefaultValue !== incomingDefaultValue) {
        setResignation(JSON.parse(incomingDefaultValue));
      }
    } else if (!isEdit && !isView) {
      const baseDefault = getBaseDefaultResignation();
      if (JSON.stringify(resignation) !== JSON.stringify(baseDefault)) {
        setResignation(baseDefault);
      }
    }
    setFieldErrors({}); // Clear errors on modal open/type change
  }, [isEdit, isView, defaultValue]);

  const handleChange = (field: keyof ResignationForm, value: string | number | undefined) => {
    setResignation(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined })); // Clear error for the changed field
  };

  const validateInput = () => {
    const errors: typeof fieldErrors = {};

    if (isView) {
      return true; 
    }

    if (!resignation.employeeName.trim()) {
      errors.employeeName = 'Employee Name is required.';
    }

    if (!resignation.employeeJobPosition.trim()) {
      errors.employeeJobPosition = 'Job Position is required.';
    }
    if (!resignation.department.trim()) { 
      errors.department = 'Department is required.';
    }

    // Last Day of Employment validation
    if (!resignation.lastDayOfEmployment) {
      errors.lastDayOfEmployment = 'Last Day of Employment is required.';
    } else if (isDateInPast(resignation.lastDayOfEmployment)) {
      errors.lastDayOfEmployment = 'Last Day of Employment cannot be in the past.';
    }

    // Notice Period validation
    if (typeof resignation.noticePeriod === 'undefined' || resignation.noticePeriod <= 0) {
      errors.noticePeriod = 'Notice Period must be a positive number of days.';
    }

    // Combined Last Day and Notice Period validation
    if (resignation.lastDayOfEmployment && resignation.noticePeriod && !isDateInPast(resignation.lastDayOfEmployment)) {
      if (!meetsNoticePeriod(resignation.lastDayOfEmployment, resignation.noticePeriod)) {
        errors.lastDayOfEmployment = `Last day of employment does not meet the ${resignation.noticePeriod}-day notice period.`;
      }
    }

    // Status (only required in edit mode if it's an editable field)
    if (isEdit && !resignation.status) {
      errors.status = 'Status is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    onSubmit(resignation);
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    onSubmit(resignation);
  };

  return {
    resignation,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  };
};
