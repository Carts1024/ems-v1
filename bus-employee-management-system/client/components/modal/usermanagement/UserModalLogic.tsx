'use client';

import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/utils/swal'; 

export type UserRole = 'Admin' | 'Employee' | 'HR' | 'Manager';

export interface UserForm {
  id?: string; // Optional for new users, present for existing
  employeeNumber: string;
  jobPosition: string;
  department: string;
  role: UserRole;
  employeeName: string; // Added for modal input
  email: string; // Added for modal input
  remarks?: string; // Optional for notes/remarks
}

export const useUserModalLogic = (
  isEdit: boolean,
  defaultValue: UserForm | undefined,
  onSubmit: (user: UserForm) => void,
  onClose: () => void,
  isView: boolean
) => {

  const getBaseDefaultUser = (): UserForm => ({
    employeeNumber: '',
    jobPosition: '',
    department: '',
    role: 'Employee', // Default role for new users
    employeeName: '',
    email: '',
    remarks: '', // Initialize remarks
  });

  const [user, setUser] = useState<UserForm>(() => {
    if ((isEdit || isView) && defaultValue) {
      return {
        id: defaultValue.id,
        employeeNumber: defaultValue.employeeNumber || '',
        jobPosition: defaultValue.jobPosition || '',
        department: defaultValue.department || '',
        role: defaultValue.role || 'Employee',
        employeeName: defaultValue.employeeName || '',
        email: defaultValue.email || '',
        remarks: defaultValue.remarks || '',
      };
    } else {
      return getBaseDefaultUser();
    }
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof UserForm]?: string }>({});

  // Effect to reset form or load default values when modal type changes
  useEffect(() => {
    if ((isEdit || isView) && defaultValue) {
      // Deep comparison to avoid unnecessary state updates if defaultValue itself is stable
      const currentDefaultValue = JSON.stringify(user);
      const incomingDefaultValue = JSON.stringify({
        id: defaultValue.id,
        employeeNumber: defaultValue.employeeNumber || '',
        jobPosition: defaultValue.jobPosition || '',
        department: defaultValue.department || '',
        role: defaultValue.role || 'Employee',
        employeeName: defaultValue.employeeName || '',
        email: defaultValue.email || '',
        remarks: defaultValue.remarks || '',
      });

      if (currentDefaultValue !== incomingDefaultValue) {
        setUser(JSON.parse(incomingDefaultValue));
      }
    } else if (!isEdit && !isView) {
      const baseDefault = getBaseDefaultUser();
      if (JSON.stringify(user) !== JSON.stringify(baseDefault)) {
        setUser(baseDefault);
      }
    }
    setFieldErrors({}); // Clear errors on modal open/type change
  }, [isEdit, isView, defaultValue]);


  const handleChange = (field: keyof UserForm, value: string | undefined) => {
    setUser(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined })); // Clear error for the changed field
  };

  const validateInput = () => {
    const errors: typeof fieldErrors = {};

    if (isView) {
      return true; // No validation needed in view mode
    }

    if (!user.employeeName.trim()) {
      errors.employeeName = 'Employee Name is required.';
    }
    if (!user.employeeNumber.trim()) {
      errors.employeeNumber = 'Employee Number is required.';
    }
    if (!user.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!user.jobPosition.trim()) {
      errors.jobPosition = 'Job Position is required.';
    }
    if (!user.department.trim()) {
      errors.department = 'Department is required.';
    }
    if (!user.role) {
      errors.role = 'Role is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    onSubmit(user);
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) {
      showError('Validation Error', 'Please correct the errors in the form.');
      return;
    }
    onSubmit(user);
  };

  return {
    user,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  };
};