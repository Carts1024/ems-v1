import React from 'react';
import styles from './InformationModal.module.css';

interface BenefitsModalProps {
  isEdit: boolean;
  isView?: boolean;
  name: string;
  setBenefitsName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

const BenefitsModal: React.FC<BenefitsModalProps> = ({
  isEdit,
  isView,
  name,
  setBenefitsName,
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
        <h1>{isEdit ? 'Edit Benefit' : isView ? 'Benefit Details' : 'Add Benefit'}</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Benefit</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setBenefitsName(e.target.value.trimStart())}
            className={styles.inputField}
            placeholder="Enter benefit name"
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

export default BenefitsModal;
