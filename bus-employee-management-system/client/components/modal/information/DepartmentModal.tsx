import React from 'react';
import styles from './InformationModal.module.css';

interface DepartmentModalProps {
  isEdit: boolean;
  departmentName: string;
  description: string;
  setDepartmentName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  isLoading?: boolean;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isEdit,
  departmentName,
  description,
  setDepartmentName,
  setDescription,
  onClose,
  onSubmit,
  isSubmitDisabled,
  isLoading = false,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1>{isEdit ? 'Edit Department' : 'Add Department'}</h1>
        <div className={styles.formGroup}>
          <label htmlFor="departmentName">Department Name *</label>
          <input
            id="departmentName"
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className={styles.inputField}
            placeholder="Enter department name"
            disabled={isLoading}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textareaField}
            placeholder="Enter department description (optional)"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button 
            onClick={onClose} 
            className={styles.cancelButton}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={styles.submitButton}
            disabled={isSubmitDisabled || isLoading}
          >
            {isLoading ? 'Processing...' : (isEdit ? 'Update' : 'Add')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;