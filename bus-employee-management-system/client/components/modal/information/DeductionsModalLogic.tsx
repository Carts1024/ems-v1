'use client';

import React, { useState, useEffect } from 'react';
import DeductionsModalUI from '@/components/modal/information/DeductionsModal';
import { showError, showConfirmation } from '@/app/utils/swal';

interface DeductionsModalLogicProps {
  isEdit: boolean;
  isView?: boolean;
  defaultValue?: string;
  defaultDescription?: string;
  existingDeductions: string[];
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const DeductionsModalLogic: React.FC<DeductionsModalLogicProps> = ({
  isEdit,
  isView,
  defaultValue = '',
  defaultDescription = '',
  existingDeductions,
  onClose,
  onSubmit,
}) => {
  const [name, setDeductionsName] = useState(defaultValue);
  const [description, setDescription] = useState(defaultDescription);
  const [error, setError] = useState('');

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();

  useEffect(() => {
    setDeductionsName(defaultValue);
    setDescription(defaultDescription);
    setError('');
  }, [defaultValue, defaultDescription]);

  const validateInput = () => {
    if (!trimmedName) {
      setError('Deduction name is required.');
      return false;
    }

    const isDuplicate = existingDeductions
      .filter((name) => name !== defaultValue)
      .some((name) => name.toLowerCase() === trimmedName.toLowerCase());

    if (isDuplicate) {
      showError('Error', 'Deduction name already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;

    onSubmit(trimmedName, trimmedDescription);
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;

    const result = await showConfirmation('Are you sure you want to update this deduction?');
    if (result.isConfirmed) {
      handleSubmit();
    }
  };

  const handleCancel = async () => {
    const hasChanges =
      trimmedName !== defaultValue.trim() || trimmedDescription !== defaultDescription.trim();

    if (hasChanges) {
      const result = await showConfirmation('Are you sure you want to close? Unsaved changes will be lost.');
      if (result.isConfirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <DeductionsModalUI
      isEdit={isEdit}
      isView={isView}
      name={name}
      setDeductionsName={setDeductionsName}
      description={description}
      setDescription={setDescription}
      error={error}
      onClose={handleCancel}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!trimmedName}
    />
  );
};

export default DeductionsModalLogic;