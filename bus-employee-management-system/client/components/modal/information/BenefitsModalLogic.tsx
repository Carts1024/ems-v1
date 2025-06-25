'use client';

import React, { useState, useEffect } from 'react';
import BenefitsModalUI from '@/components/modal/information/BenefitsModal';
import { showError, showConfirmation, showSuccess } from '@/app/utils/swal';

interface BenefitsModalLogicProps {
  isEdit: boolean;
  isView?: boolean;
  defaultValue?: string;
  defaultDescription?: string;
  existingBenefits: string[];
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
}

const BenefitsModalLogic: React.FC<BenefitsModalLogicProps> = ({
  isEdit,
  isView,
  defaultValue = '',
  defaultDescription = '',
  existingBenefits,
  onClose,
  onSubmit,
}) => {
  const [benefitsName, setBenefitsName] = useState(defaultValue);
  const [description, setDescription] = useState(defaultDescription);
  const [error, setError] = useState('');

  const trimmedName = benefitsName.trim();
  const trimmedDescription = description.trim();

  useEffect(() => {
    setBenefitsName(defaultValue);
    setDescription(defaultDescription);
    setError('');
  }, [defaultValue, defaultDescription]);

  const validateInput = () => {
    if (!trimmedName) {
      setError('Benefit name is required.');
      return false;
    }

    const isDuplicate = existingBenefits
      .filter((name) => name !== defaultValue)
      .some((name) => name.toLowerCase() === trimmedName.toLowerCase());

    if (isDuplicate) {
      showError('Error', 'Benefit name already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;

    onSubmit(trimmedName, trimmedDescription);
    showSuccess('Success', isEdit ? 'Benefit updated successfully.' : 'Benefit added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;

    const result = await showConfirmation('Are you sure you want to update this benefit?');
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
    <BenefitsModalUI
      isEdit={isEdit}
      isView={isView}
      benefitsName={benefitsName}
      setBenefitsName={setBenefitsName}
      description={description}
      setDescription={setDescription}
      error={error}
      onClose={handleCancel}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!trimmedName}
    />
  );
};

export default BenefitsModalLogic;