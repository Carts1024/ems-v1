'use client';

import React, { useState, useEffect } from 'react';
import styles from './resignationmodal.module.css'; 
import { useResignationModalLogic, ResignationForm, ResignationStatus } from './resignationmodallogic';
import { showConfirmation } from '@/app/utils/swal';
interface ResignationModalProps {
  isEdit: boolean;
  isView: boolean;
  defaultValue?: ResignationForm;
  onClose: () => void;
  onSubmit: (resignation: ResignationForm) => void;
}

const ResignationModal: React.FC<ResignationModalProps> = ({
  isEdit,
  isView,
  defaultValue,
  onClose,
  onSubmit,
}) => {
  const {
    resignation,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  } = useResignationModalLogic(
    isEdit,
    defaultValue,
    onSubmit,
    onClose,
    isView
  );

  const [hasChanges, setHasChanges] = useState(false);

  const handleExitClick = async () => {
    if (isView) {
      onClose();
      return;
    }

    if (hasChanges) {
      const result = await showConfirmation("Are you sure you want to close? Unsaved changes will be lost.");
      if (result.isConfirmed) {
        onClose();
        setHasChanges(false);
      }
    } else {
      onClose();
    }
  };

  const formatDateForComparison = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  // Effect to track changes for warning on close
  useEffect(() => {
    if (isView) {
      setHasChanges(false);
      return;
    }

    const defaultComparable = defaultValue ? {
      employeeName: defaultValue.employeeName || '',
      employeeJobPosition: defaultValue.employeeJobPosition || '',
      department: defaultValue.department || '', 
      lastDayOfEmployment: formatDateForComparison(defaultValue.lastDayOfEmployment),
      noticePeriod: defaultValue.noticePeriod || 0,
      status: defaultValue.status || 'Pending',
      reason: defaultValue.reason || '',
      remarks: defaultValue.remarks || '',
    } : null;

    const currentComparable = {
      employeeName: resignation.employeeName || '',
      employeeJobPosition: resignation.employeeJobPosition || '',
      department: resignation.department || '', 
      lastDayOfEmployment: formatDateForComparison(resignation.lastDayOfEmployment),
      noticePeriod: resignation.noticePeriod || 0,
      status: resignation.status || 'Pending',
      reason: resignation.reason || '',
      remarks: resignation.remarks || '',
    };

    const newHasChanges = JSON.stringify(currentComparable) !== JSON.stringify(defaultComparable);
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges);
    }
  }, [defaultValue, isEdit, isView, resignation, hasChanges]);

  // Wrapper for handleChange to track changes
  const handleChangeWrapper = (field: keyof ResignationForm, value: string | number | undefined) => {
    if (isView) return;
    setHasChanges(true);
    handleChange(field, value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleExitClick} aria-label="Close modal">
          <i className='ri-close-line' aria-hidden="true" />
        </button>

        <h1 className={styles.heading}>
          {/* File icon SVG for resignation */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.headingIcon}
          >
            <path d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H12L19 10V20C19 20.5523 18.5523 21 18 21H19ZM11 7H7V9H11V7ZM15 11H7V13H15V11ZM15 15H7V17H15V15ZM13 3V9H19L13 3Z" />
          </svg>
          {isView ? 'View Resignation Details' : (isEdit ? 'Edit Resignation Request' : 'Submit Resignation Request')}
        </h1>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.formColumn}>
              <h4>Employee Information</h4>
              <label htmlFor="employeeName" className={styles.label}>Employee Name</label>
              <input
                id="employeeName"
                className={`${styles.inputField} ${fieldErrors.employeeName ? styles.inputError : ''}`}
                value={resignation.employeeName}
                onChange={(e) => handleChangeWrapper('employeeName', e.target.value)}
                placeholder="Enter employee name"
                readOnly={isView}
              />
              {fieldErrors.employeeName && !isView && <p className={styles.errorText}>{fieldErrors.employeeName}</p>}

              <label htmlFor="employeeJobPosition" className={styles.label}>Job Position</label>
              <input
                id="employeeJobPosition"
                className={`${styles.inputField} ${fieldErrors.employeeJobPosition ? styles.inputError : ''}`}
                value={resignation.employeeJobPosition}
                onChange={(e) => handleChangeWrapper('employeeJobPosition', e.target.value)}
                placeholder="Enter job position"
                readOnly={isView}
              />
              {fieldErrors.employeeJobPosition && !isView && <p className={styles.errorText}>{fieldErrors.employeeJobPosition}</p>}

              <label htmlFor="department" className={styles.label}>Department</label> {/* Added Department Field */}
              <input
                id="department"
                className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
                value={resignation.department || ''}
                onChange={(e) => handleChangeWrapper('department', e.target.value)}
                placeholder="Enter department"
                readOnly={isView}
              />
              {fieldErrors.department && !isView && <p className={styles.errorText}>{fieldErrors.department}</p>}
            </div>

            <div className={styles.formColumn}>
              <h4>Resignation Details</h4>
              <label htmlFor="lastDayOfEmployment" className={styles.label}>Last Day of Employment</label>
              <input
                id="lastDayOfEmployment"
                type="date"
                className={`${styles.inputField} ${fieldErrors.lastDayOfEmployment ? styles.inputError : ''}`}
                value={resignation.lastDayOfEmployment}
                onChange={(e) => handleChangeWrapper('lastDayOfEmployment', e.target.value)}
                readOnly={isView}
              />
              {fieldErrors.lastDayOfEmployment && !isView && <p className={styles.errorText}>{fieldErrors.lastDayOfEmployment}</p>}

              <label htmlFor="noticePeriod" className={styles.label}>Notice Period (Days)</label>
              <input
                id="noticePeriod"
                type="number"
                className={`${styles.inputField} ${fieldErrors.noticePeriod ? styles.inputError : ''}`}
                value={resignation.noticePeriod || ''}
                onChange={(e) => handleChangeWrapper('noticePeriod', parseInt(e.target.value, 10) || undefined)}
                placeholder="e.g., 30"
                min="0"
                readOnly={isView}
              />
              {fieldErrors.noticePeriod && !isView && <p className={styles.errorText}>{fieldErrors.noticePeriod}</p>}

              <label htmlFor="reason" className={styles.label}>Reason for Resignation (Optional)</label>
              <textarea
                id="reason"
                className={styles.inputField}
                value={resignation.reason || ''}
                onChange={(e) => handleChangeWrapper('reason', e.target.value)}
                placeholder="Briefly state the reason for resignation..."
                rows={3}
                readOnly={isView}
              ></textarea>
              {fieldErrors.reason && !isView && <p className={styles.errorText}>{fieldErrors.reason}</p>}

              {/* Status (only editable in edit mode, shown in view mode) */}
              {(isEdit || isView) && (
                <>
                  <label htmlFor="status" className={styles.label}>Status</label>
                  <select
                    id="status"
                    className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
                    value={resignation.status}
                    onChange={(e) => handleChangeWrapper('status', e.target.value as ResignationStatus)}
                    disabled={isView}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                  {fieldErrors.status && !isView && <p className={styles.errorText}>{fieldErrors.status}</p>}
                </>
              )}
               <label htmlFor="remarks" className={styles.label}>Remarks/Notes (Optional)</label>
              <textarea
                id="remarks"
                className={styles.inputField}
                value={resignation.remarks || ''}
                onChange={(e) => handleChangeWrapper('remarks', e.target.value)}
                placeholder="Any additional information..."
                rows={2}
                readOnly={isView}
              ></textarea>
              {fieldErrors.remarks && !isView && <p className={styles.errorText}>{fieldErrors.remarks}</p>}
            </div>
          </div>
        </div>

        {!isView && (
          <div className={styles.buttonGroup}>
            <button onClick={handleExitClick} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              onClick={isEdit ? handleUpdateConfirm : handleSubmit}
              className={styles.submitButton}
            >
              {isEdit ? 'Update Request' : 'Submit Request'}
            </button>
          </div>
        )}
        {isView && (
          <div className={styles.buttonGroup}>
            <button onClick={handleExitClick} className={styles.cancelButton}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResignationModal;
