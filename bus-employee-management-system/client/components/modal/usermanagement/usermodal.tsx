'use client';

import React, { useState, useEffect } from 'react';
import styles from './usermodal.module.css'; 
import { useUserModalLogic, UserForm, UserRole } from './usermodallogic'; 
import { showConfirmation } from '@/app/utils/swal';

interface UserModalProps {
  isEdit: boolean;
  isView: boolean;
  defaultValue?: UserForm;
  onClose: () => void;
  onSubmit: (user: UserForm) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  isEdit,
  isView,
  defaultValue,
  onClose,
  onSubmit,
}) => {
  const {
    user,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  } = useUserModalLogic(
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

  // Effect to track changes for warning on close
  useEffect(() => {
    if (isView) {
      setHasChanges(false);
      return;
    }

    // Prepare comparable objects. Ensure all relevant fields are included and standardized.
    const defaultComparable = defaultValue ? {
      employeeNumber: defaultValue.employeeNumber || '',
      jobPosition: defaultValue.jobPosition || '',
      department: defaultValue.department || '',
      role: defaultValue.role || 'Employee',
      employeeName: defaultValue.employeeName || '',
      email: defaultValue.email || '',
    } : null;

    const currentComparable = {
      employeeNumber: user.employeeNumber || '',
      jobPosition: user.jobPosition || '',
      department: user.department || '',
      role: user.role || 'Employee',
      employeeName: user.employeeName || '',
      email: user.email || '',
    };

    const newHasChanges = JSON.stringify(currentComparable) !== JSON.stringify(defaultComparable);
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges);
    }
  }, [defaultValue, isEdit, isView, user, hasChanges]);

  // Wrapper for handleChange to track changes
  const handleChangeWrapper = (field: keyof UserForm, value: string | undefined) => {
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
          {/* User icon SVG - Replaced the info icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.headingIcon}
          >
            <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13Z"></path>
          </svg>
          {isView ? 'View User Details' : (isEdit ? 'Edit User Information' : 'Add New User')}
        </h1>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.formColumn}>
              <h4>Personal & Organizational Details</h4>
              <label htmlFor="employeeName" className={styles.label}>Employee Name</label>
              <input
                id="employeeName"
                className={`${styles.inputField} ${fieldErrors.employeeName ? styles.inputError : ''}`}
                value={user.employeeName}
                onChange={(e) => handleChangeWrapper('employeeName', e.target.value)}
                placeholder="Enter employee name"
                readOnly={isView}
              />
              {fieldErrors.employeeName && !isView && <p className={styles.errorText}>{fieldErrors.employeeName}</p>}

              <label htmlFor="employeeNumber" className={styles.label}>Employee Number</label>
              <input
                id="employeeNumber"
                className={`${styles.inputField} ${fieldErrors.employeeNumber ? styles.inputError : ''}`}
                value={user.employeeNumber}
                onChange={(e) => handleChangeWrapper('employeeNumber', e.target.value)}
                placeholder="e.g., EMP001"
                readOnly={isView}
              />
              {fieldErrors.employeeNumber && !isView && <p className={styles.errorText}>{fieldErrors.employeeNumber}</p>}

              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={`${styles.inputField} ${fieldErrors.email ? styles.inputError : ''}`}
                value={user.email}
                onChange={(e) => handleChangeWrapper('email', e.target.value)}
                placeholder="e.g., user@example.com"
                readOnly={isView}
              />
              {fieldErrors.email && !isView && <p className={styles.errorText}>{fieldErrors.email}</p>}

              <label htmlFor="jobPosition" className={styles.label}>Job Position</label>
              <input
                id="jobPosition"
                className={`${styles.inputField} ${fieldErrors.jobPosition ? styles.inputError : ''}`}
                value={user.jobPosition}
                onChange={(e) => handleChangeWrapper('jobPosition', e.target.value)}
                placeholder="Enter job position"
                readOnly={isView}
              />
              {fieldErrors.jobPosition && !isView && <p className={styles.errorText}>{fieldErrors.jobPosition}</p>}

              <label htmlFor="department" className={styles.label}>Department</label>
              <input
                id="department"
                className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
                value={user.department}
                onChange={(e) => handleChangeWrapper('department', e.target.value)}
                placeholder="Enter department"
                readOnly={isView}
              />
              {fieldErrors.department && !isView && <p className={styles.errorText}>{fieldErrors.department}</p>}
            </div>

            <div className={styles.formColumn}>
              <h4>Role & Access</h4>
              <label htmlFor="role" className={styles.label}>Role (Auth)</label>
              <select
                id="role"
                className={`${styles.inputField} ${fieldErrors.role ? styles.inputError : ''}`}
                value={user.role}
                onChange={(e) => handleChangeWrapper('role', e.target.value as UserRole)}
                disabled={isView}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
              </select>
              {fieldErrors.role && !isView && <p className={styles.errorText}>{fieldErrors.role}</p>}

              {/* Remarks/Notes for User */}
              <label htmlFor="remarks" className={styles.label}>Remarks/Notes (Optional)</label>
              <textarea
                id="remarks"
                className={styles.inputField}
                value={user.remarks || ''} // remarks isn't directly in UserForm, assuming it's an optional add-on
                onChange={(e) => handleChangeWrapper('remarks', e.target.value)}
                placeholder="Any additional information..."
                rows={4}
                readOnly={isView}
              ></textarea>
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
              {isEdit ? 'Update User' : 'Add User'}
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

export default UserModal;
