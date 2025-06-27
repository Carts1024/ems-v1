// CAModalLogic.tsx
'use client';

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/utils/swal';

// Type Definitions
export type AdvanceType = 'General Cash Advance' | 'Travel Advance' | 'Project Advance' | 'Emergency Advance' | 'Other';
export type PaymentMethod = 'Deduction from next payroll' | 'Deduction over periods' | 'Full repayment on specific date';
export type AdvanceStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed' | 'Cancelled';

export interface CashAdvanceForm {
  id?: string;
  employee: string;
  department: string;
  dateHired: string; // YYYY-MM-DD format
  jobPosition: string;
  advanceType: AdvanceType;
  amount: number;
  reason: string;
  repaymentMethod: PaymentMethod;
  numberOfRepaymentPeriods?: number;
  fullRepaymentDate?: string; // YYYY-MM-DD format
  dueDate: string; // General due date
  receiptsAttached: boolean; // Boolean to indicate if documents were conceptually "attached"
  approver: string;
  remarks: string;
  status: AdvanceStatus;
  acknowledgment: boolean;
  supportingDocuments?: string; // To store file name or path (optional)
}

// Helper function to check if a date is in the past
const isDateInPast = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Normalize input date to start of day
  return date < today;
};

export const useCAModalLogic = (
  isEdit: boolean,
  defaultValue: CashAdvanceForm | undefined,
  onSubmit: (cashAdvance: CashAdvanceForm) => void,
  onClose: () => void,
  isView: boolean
) => {

  const getBaseDefaultCashAdvance = (todayDate: string): CashAdvanceForm => ({
    employee: '',
    department: '',
    dateHired: '',
    jobPosition: '',
    advanceType: 'General Cash Advance',
    amount: 0,
    reason: '',
    repaymentMethod: 'Deduction from next payroll',
    numberOfRepaymentPeriods: undefined,
    fullRepaymentDate: undefined,
    dueDate: todayDate,
    receiptsAttached: false,
    approver: '',
    remarks: '',
    status: 'Pending',
    acknowledgment: false,
    supportingDocuments: '',
  });

  const [cashAdvance, setCashAdvance] = useState<CashAdvanceForm>(() => {
    const today = new Date().toISOString().split('T')[0];
    const baseDefault = getBaseDefaultCashAdvance(today);

    if ((isEdit || isView) && defaultValue) {
      return {
        id: defaultValue.id,
        employee: defaultValue.employee || '',
        department: defaultValue.department || '',
        dateHired: defaultValue.dateHired || '',
        jobPosition: defaultValue.jobPosition || '',
        advanceType: defaultValue.advanceType || 'General Cash Advance',
        amount: defaultValue.amount || 0,
        reason: defaultValue.reason || '',
        repaymentMethod: defaultValue.repaymentMethod || 'Deduction from next payroll',
        numberOfRepaymentPeriods: defaultValue.numberOfRepaymentPeriods || undefined,
        fullRepaymentDate: defaultValue.fullRepaymentDate || undefined,
        dueDate: defaultValue.dueDate || today,
        receiptsAttached: defaultValue.receiptsAttached || false,
        approver: defaultValue.approver || '',
        remarks: defaultValue.remarks || '',
        status: defaultValue.status || 'Pending',
        acknowledgment: defaultValue.acknowledgment || false,
        supportingDocuments: defaultValue.supportingDocuments || '',
      };
    } else {
      return baseDefault;
    }
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof CashAdvanceForm]?: string }>({});

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if ((isEdit || isView) && defaultValue) {
      // Use ID for stable comparison to prevent unnecessary updates
      if (cashAdvance.id !== defaultValue.id) {
        setCashAdvance({
          id: defaultValue.id,
          employee: defaultValue.employee || '',
          department: defaultValue.department || '',
          dateHired: defaultValue.dateHired || '',
          jobPosition: defaultValue.jobPosition || '',
          advanceType: defaultValue.advanceType || 'General Cash Advance',
          amount: defaultValue.amount || 0,
          reason: defaultValue.reason || '',
          repaymentMethod: defaultValue.repaymentMethod || 'Deduction from next payroll',
          numberOfRepaymentPeriods: defaultValue.numberOfRepaymentPeriods || undefined,
          fullRepaymentDate: defaultValue.fullRepaymentDate || undefined,
          dueDate: defaultValue.dueDate || today,
          receiptsAttached: defaultValue.receiptsAttached || false,
          approver: defaultValue.approver || '',
          remarks: defaultValue.remarks || '',
          status: defaultValue.status || 'Pending',
          acknowledgment: defaultValue.acknowledgment || false,
          supportingDocuments: defaultValue.supportingDocuments || '',
        });
      }
    } else if (!isEdit && !isView) {
      const baseDefault = getBaseDefaultCashAdvance(today);
      if (JSON.stringify(cashAdvance) !== JSON.stringify(baseDefault)) {
        setCashAdvance(baseDefault);
      }
    }
    setFieldErrors({});
  }, [isEdit, isView, defaultValue]);

  const handleChange = (field: keyof CashAdvanceForm, value: string | number | boolean | undefined) => {
    setCashAdvance(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateInput = () => {
    const errors: typeof fieldErrors = {};

    if (isView) {
      return true;
    }

    // Employee Details Validation
    if (!cashAdvance.employee.trim()) {
      errors.employee = 'Employee Name is required.';
    }
    if (!cashAdvance.department.trim()) {
      errors.department = 'Department is required.';
    }
    if (!cashAdvance.dateHired) {
      errors.dateHired = 'Date Hired is required.';
    }
    if (!cashAdvance.jobPosition.trim()) {
      errors.jobPosition = 'Job Position is required.';
    }
    if (!cashAdvance.approver) {
      errors.approver = 'Approver is required.';
    }

    // Advance Details Validation
    if (!cashAdvance.advanceType) {
      errors.advanceType = 'Advance Type is required.';
    }
    if (typeof cashAdvance.amount === 'undefined' || cashAdvance.amount <= 0) {
      errors.amount = 'Amount must be a positive number.';
    }
    if (!cashAdvance.reason.trim()) {
      errors.reason = 'reason is required.';
    }
    if (!cashAdvance.repaymentMethod) {
      errors.repaymentMethod = 'Repayment Method is required.';
    }

    if (cashAdvance.repaymentMethod === 'Deduction over periods') {
      if (typeof cashAdvance.numberOfRepaymentPeriods === 'undefined' || cashAdvance.numberOfRepaymentPeriods <= 0) {
        errors.numberOfRepaymentPeriods = 'Number of repayment periods must be a positive number.';
      }
    }

    if (cashAdvance.repaymentMethod === 'Full repayment on specific date') {
      if (!cashAdvance.fullRepaymentDate) {
        errors.fullRepaymentDate = 'Full Repayment Date is required.';
      } else if (isDateInPast(cashAdvance.fullRepaymentDate)) {
        errors.fullRepaymentDate = 'Full Repayment Date cannot be in the past.';
      }
    }

    // General Due Date Validation
    if (!cashAdvance.dueDate) {
      errors.dueDate = 'Due Date is required.';
    } else if (isDateInPast(cashAdvance.dueDate)) {
      errors.dueDate = 'Due Date cannot be in the past.';
    }

    // Acknowledgment
    if (!cashAdvance.acknowledgment && !isView) { // Only validate if not in view mode
      errors.acknowledgment = 'Acknowledgment is required.';
    }

    // Status (only required in edit mode if it's an editable field)
    if (isEdit && !cashAdvance.status) {
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
    onSubmit(cashAdvance);
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    onSubmit(cashAdvance);
  };

  return {
    cashAdvance,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  };
};