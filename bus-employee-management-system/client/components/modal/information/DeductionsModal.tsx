import React from 'react';
import styles from './InformationModal.module.css';

interface DeductionsModalProps {
  isEdit: boolean;
  isView?: boolean;
  name: string;
  setDeductionsName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

const DeductionsModal: React.FC<DeductionsModalProps> = ({
  isEdit,
  isView,
  name,
  setDeductionsName,
  description,
  setDescription,
  error,
  onClose,
  onSubmit,
  isSubmitDisabled,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>
        <h1>{isEdit ? 'Edit Deduction' : 'Add Deduction'}</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Deduction</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setDeductionsName(e.target.value.trimStart())}
            className={styles.inputField}
            placeholder="Enter deduction name"
            readOnly={isView}
          />
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.inputField}
            placeholder="Enter description"
            rows={3}
            readOnly={isView}
          />
        </div>

        <div className={styles.buttonGroup}>
          {!isView && (
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          )}
          {!isView && (
            <button
              onClick={onSubmit}
              className={styles.submitButton}
              disabled={isSubmitDisabled}
            >
              {isEdit ? 'Update' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeductionsModal;
