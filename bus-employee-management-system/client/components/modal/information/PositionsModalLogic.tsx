'use client';

import React, { useState, useEffect } from 'react';
import PositionsModalUI from './PositionsModal';
import { showError, showSuccess, showConfirmation } from '@/app/utils/swal';

interface PositionsModalLogicProps {
  isEdit: boolean;
  defaultValue?: string;
  defaultDepartment?: string;
  existingPositions: string[];
  onClose: () => void;
  onSubmit: (name: string, department: string) => void;
}

const departmentOptions = [
  'Accounting',
  'Human Resource',
  'Inventory',
  'Operational',
];

const PositionsModalLogic: React.FC<PositionsModalLogicProps> = ({
  isEdit,
  defaultValue = '',
  defaultDepartment = '',
  existingPositions,
  onClose,
  onSubmit,
}) => {
  const [positionName, setPositionName] = useState(defaultValue);
  const [department, setDepartment] = useState(defaultDepartment);
  const [error, setError] = useState('');

  useEffect(() => {
    setPositionName(defaultValue);
    setDepartment(defaultDepartment);
    setError('');
  }, [defaultValue, defaultDepartment]);

  const validateInput = () => {
    const trimmed = positionName.trim();
    if (!trimmed) {
      setError('Position name is required.');
      return false;
    }
    if (!department) {
      setError('Department is required.');
      return false;
    }
    const isDuplicate = existingPositions
      .filter((name) => name !== defaultValue)
      .some((name) => name.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
      showError('Error', 'Position name already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;
    onSubmit(positionName.trim(), department);
    showSuccess('Success', isEdit ? 'Position updated successfully.' : 'Position added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;
    const result = await showConfirmation('Are you sure you want to update this position?');
    if (result.isConfirmed) handleSubmit();
  };

  return (
    <PositionsModalUI
      isEdit={isEdit}
      positionName={positionName}
      setPositionName={setPositionName}
      department={department}
      setDepartment={setDepartment}
      error={error}
      onClose={onClose}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!positionName.trim() || !department}
      departmentOptions={departmentOptions}
    />
  );
};

export default PositionsModalLogic;