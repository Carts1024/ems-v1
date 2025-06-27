/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import DepartmentModalUI from '@/components/modal/information/DepartmentModal';
import { showError, showConfirmation, showSuccess } from '@/app/utils/swal';
import { Department } from '@/app/homepage/information/department/departmentLogic';

interface DepartmentModalLogicProps {
  isEdit: boolean;
  defaultDepartment?: Department | null;
  existingDepartments: Department[];
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  isLoading?: boolean;
}

const DepartmentModalLogic: React.FC<DepartmentModalLogicProps> = ({
  isEdit,
  defaultDepartment = null,
  existingDepartments,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [departmentName, setDepartmentName] = useState(defaultDepartment?.departmentName || '');
  const [description, setDescription] = useState(defaultDepartment?.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setDepartmentName(defaultDepartment?.departmentName || '');
    setDescription(defaultDepartment?.description || '');
    setError('');
  }, [defaultDepartment]);

  const validateInput = () => {
    const trimmed = departmentName.trim();

    if (!trimmed) {
      setError('Department name is required.');
      showError('Validation Error', 'Department name is required.');
      return false;
    }

    // Check for duplicates, excluding current department if editing
    const isDuplicate = existingDepartments
      .filter((dept) => isEdit ? dept.id !== defaultDepartment?.id : true)
      .some((dept) => dept.departmentName.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
      showError('Error', 'Department name already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;
    onSubmit(departmentName.trim(), description.trim());
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;

    const result = await showConfirmation('Are you sure you want to update this department?');
    if (result.isConfirmed) {
      onSubmit(departmentName.trim(), description.trim());
    }
  };

  return (
    <DepartmentModalUI
      isEdit={isEdit}
      departmentName={departmentName}
      description={description}
      setDepartmentName={setDepartmentName}
      setDescription={setDescription}
      onClose={onClose}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!departmentName.trim()}
      isLoading={isLoading}
    />
  );
};

export default DepartmentModalLogic;