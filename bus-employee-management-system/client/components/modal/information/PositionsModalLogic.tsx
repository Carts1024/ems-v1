'use client';

'use client';

import React, { useState, useEffect } from 'react';
import PositionsModalUI from './PositionsModal';
import { showError, showSuccess, showConfirmation } from '@/app/utils/swal';

interface PositionsModalLogicProps {
  isEdit: boolean;
  defaultValue?: string;
  defaultDepartmentId?: string;
  existingPositions: string[];
  departmentOptions: { id: string; label: string }[];
  onClose: () => void;
  onSubmit: (name: string, departmentId: string) => void;
}

const PositionsModalLogic: React.FC<PositionsModalLogicProps> = ({
  isEdit,
  defaultValue = '',
  defaultDepartmentId = '',
  existingPositions,
  departmentOptions,
  onClose,
  onSubmit,
}) => {
  const [positionName, setPositionName] = useState(defaultValue);
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId);
  const [error, setError] = useState('');

  useEffect(() => {
    setPositionName(defaultValue);
    setDepartmentId(defaultDepartmentId);
    setError('');
  }, [defaultValue, defaultDepartmentId]);

  const validateInput = () => {
    const trimmed = positionName.trim();
    if (!trimmed) {
      setError('Position name is required.');
      return false;
    }
    if (!departmentId) {
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
    onSubmit(positionName.trim(), departmentId);
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
      departmentId={departmentId}
      setDepartmentId={setDepartmentId}
      error={error}
      onClose={onClose}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!positionName.trim() || !departmentId}
      departmentOptions={departmentOptions}
    />
  );
};

export default PositionsModalLogic;