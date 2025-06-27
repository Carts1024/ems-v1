import React from 'react';
import styles from './InformationModal.module.css';

interface PositionsModalProps {
  isEdit: boolean;
  positionName: string;
  setPositionName: React.Dispatch<React.SetStateAction<string>>;
  departmentId: string;
  setDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  departmentOptions: { id: string; label: string }[];
}

const PositionsModal: React.FC<PositionsModalProps> = ({
  isEdit,
  positionName,
  setPositionName,
  departmentId,
  setDepartmentId,
  error,
  onClose,
  onSubmit,
  isSubmitDisabled,
  departmentOptions,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>
        <h1>{isEdit ? 'Edit Position' : 'Add Position'}</h1>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Position</label>
          <input
            type="text"
            value={positionName}
            onChange={(e) => setPositionName(e.target.value.trimStart())}
            className={styles.inputField}
            placeholder="Enter position name"
          />
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className={styles.inputField}
          >
            <option value="">Select department</option>
            {departmentOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={styles.submitButton}
            disabled={isSubmitDisabled}
          >
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionsModal;