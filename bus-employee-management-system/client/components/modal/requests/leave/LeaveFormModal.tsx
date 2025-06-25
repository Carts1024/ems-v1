'use client';

import React, { useState, useEffect } from 'react';
import styles from './LeaveFormModal.module.css';
import { useLeaveFormModal, LeaveForm, DurationType } from './LeaveFormModalLogic';
import { showConfirmation } from '@/app/utils/swal';

interface LeaveFormModalProps {
  isEdit: boolean;
  isView: boolean; // New prop to indicate view mode
  defaultValue?: LeaveForm;
  onClose: () => void;
  onSubmit: (leave: LeaveForm) => void;
  existingEmployees?: string[];
  approversList?: string[]; // New prop for approvers dropdown
}

const LeaveFormModal: React.FC<LeaveFormModalProps> = ({
  isEdit,
  isView, // Destructure new prop
  defaultValue,
  onClose,
  onSubmit,
  existingEmployees = [],
  approversList = ['John Doe (Manager)', 'Jane Smith (HR)'], // Default approvers for demonstration
}) => {
  const {
    leave,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
    // setLeave, // No longer directly used here after initial state setup in useLeaveFormModal
    calculateDuration,
  } = useLeaveFormModal(
    isEdit,
    defaultValue,
    onSubmit,
    onClose,
    existingEmployees,
    isView
  );

  const [hasChanges, setHasChanges] = useState(false);

  // Define handleExitClick within the component's scope
  const handleExitClick = async () => {
    // If in view mode, no unsaved changes, so just close
    if (isView) {
      onClose();
      return;
    }

    // For edit/add mode, check for unsaved changes
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

  // Helper to safely convert date strings to YYYY-MM-DD format for comparison
  const formatDateForComparison = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  // UseEffect to determine initial hasChanges state when modal opens or mode changes
  // This effect now correctly depends only on props and external `leave` state (from useLeaveFormModal)
  // that is not directly set within this effect, avoiding circular dependencies.
  useEffect(() => {
    // If in view mode, there are no changes to track
    if (isView) {
      setHasChanges(false);
      return;
    }

    // Prepare comparable objects
    const defaultComparable = defaultValue ? {
      ...defaultValue,
      startDate: formatDateForComparison(defaultValue.startDate),
      endDate: formatDateForComparison(defaultValue.endDate),
      specificPartialDate: formatDateForComparison(defaultValue.specificPartialDate),
      // Ensure all fields are included for a proper comparison
      employeeName: defaultValue.employeeName || '',
      department: defaultValue.department || '',
      dateHired: defaultValue.dateHired || '',
      jobPosition: defaultValue.jobPosition || '',
      leaveType: defaultValue.leaveType || '',
      customLeaveType: defaultValue.customLeaveType || '',
      reasonForLeave: defaultValue.reasonForLeave || '',
      contactInformation: defaultValue.contactInformation || '',
      supportingDocuments: defaultValue.supportingDocuments || '',
      approver: defaultValue.approver || '',
      remarks: defaultValue.remarks || '',
      status: defaultValue.status || 'Pending',
      numberOfHours: defaultValue.numberOfHours || undefined,
    } : null; // Use null if no defaultValue

    const currentComparable = {
      ...leave,
      startDate: formatDateForComparison(leave.startDate),
      endDate: formatDateForComparison(leave.endDate),
      specificPartialDate: formatDateForComparison(leave.specificPartialDate),
      // Ensure all fields are included for a proper comparison
      employeeName: leave.employeeName || '',
      department: leave.department || '',
      dateHired: leave.dateHired || '',
      jobPosition: leave.jobPosition || '',
      leaveType: leave.leaveType || '',
      customLeaveType: leave.customLeaveType || '',
      reasonForLeave: leave.reasonForLeave || '',
      contactInformation: leave.contactInformation || '',
      supportingDocuments: leave.supportingDocuments || '',
      approver: leave.approver || '',
      remarks: leave.remarks || '',
      status: leave.status || 'Pending',
      numberOfHours: leave.numberOfHours || undefined,
    };
    
    // Perform a deep comparison to detect actual changes, not just reference changes
    // Only update hasChanges if it truly differs to prevent unnecessary re-renders.
    const newHasChanges = JSON.stringify(currentComparable) !== JSON.stringify(defaultComparable);
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges);
    }
  }, [defaultValue, isEdit, isView, leave, hasChanges]); // Added hasChanges to deps to prevent infinite loops if newHasChanges is the same

  const handleChangeWrapper = (field: keyof LeaveForm, value: string | DurationType | number) => {
    // Prevent changes in view mode
    if (isView) return;
    setHasChanges(true); // Mark as changed on any user input
    handleChange(field, value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={handleExitClick} aria-label="Close modal">
          <i className='ri-close-line' aria-hidden="true" />
        </button>

        {/* Modal Heading */}
        <h1 className={styles.heading}>
          {/* SVG icon - Represents a person for employee details */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.headingIcon}
          >
            <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" />
          </svg>
          {isView ? 'View Leave Request Details' : (isEdit ? 'Edit Leave Request' : 'Submit Leave Request')}
        </h1>

        {/* Form Sections */}
        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            {/* Employee Details Column */}
            <div className={styles.formColumn}>
              <h4>Employee Details</h4>
              {/* Employee Name */}
              <label htmlFor="employeeName" className={styles.label}>Employee Name</label>
              <input
                id="employeeName"
                className={`${styles.inputField} ${fieldErrors.employeeName ? styles.inputError : ''}`}
                value={leave.employeeName}
                onChange={(e) => handleChangeWrapper('employeeName', e.target.value)}
                placeholder="Enter employee name"
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.employeeName && !isView && <p className={styles.errorText}>{fieldErrors.employeeName}</p>}

              {/* Department */}
              <label htmlFor="department" className={styles.label}>Department</label>
              <input
                id="department"
                className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
                value={leave.department}
                onChange={(e) => handleChangeWrapper('department', e.target.value)}
                placeholder="Enter department"
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.department && !isView && <p className={styles.errorText}>{fieldErrors.department}</p>}

              {/* Date Hired */}
              <label htmlFor="dateHired" className={styles.label}>Date Hired</label>
              <input
                id="dateHired"
                type="date"
                className={`${styles.inputField} ${fieldErrors.dateHired ? styles.inputError : ''}`}
                value={leave.dateHired}
                onChange={(e) => handleChangeWrapper('dateHired', e.target.value)}
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.dateHired && !isView && <p className={styles.errorText}>{fieldErrors.dateHired}</p>}

              {/* Employee Job Position */}
              <label htmlFor="jobPosition" className={styles.label}>Employee Job Position</label>
              <input
                id="jobPosition"
                className={`${styles.inputField} ${fieldErrors.jobPosition ? styles.inputError : ''}`}
                value={leave.jobPosition}
                onChange={(e) => handleChangeWrapper('jobPosition', e.target.value)}
                placeholder="Enter job position"
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.jobPosition && !isView && <p className={styles.errorText}>{fieldErrors.jobPosition}</p>}

              {/* Approver */}
              <label htmlFor="approver" className={styles.label}>Approver</label>
              <select
                id="approver"
                className={`${styles.inputField} ${fieldErrors.approver ? styles.inputError : ''}`}
                value={leave.approver}
                onChange={(e) => handleChangeWrapper('approver', e.target.value)}
                disabled={isView} // Use disabled for select
              >
                <option value="">Select Approver</option>
                {approversList.map((approver, index) => (
                  <option key={index} value={approver}>{approver}</option>
                ))}
              </select>
              {fieldErrors.approver && !isView && <p className={styles.errorText}>{fieldErrors.approver}</p>}
            </div>

            {/* Leave Details Column */}
            <div className={styles.formColumn}>
              <h4>Leave Details & Dates</h4>
              {/* Leave Type */}
              <label htmlFor="leaveType" className={styles.label}>Leave Type</label>
              <select
                id="leaveType"
                className={`${styles.inputField} ${fieldErrors.leaveType ? styles.inputError : ''}`}
                value={leave.leaveType}
                onChange={(e) => handleChangeWrapper('leaveType', e.target.value)}
                disabled={isView} // Use disabled for select
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Vacation Leave">Vacation Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Bereavement Leave">Bereavement Leave</option>
                <option value="Leave Without Pay">Leave Without Pay</option>
                <option value="Custom Leave">Custom Leave</option>
              </select>
              {fieldErrors.leaveType && !isView && <p className={styles.errorText}>{fieldErrors.leaveType}</p>}

              {/* Custom Leave Type input, if "Custom Leave" is selected */}
              {leave.leaveType === 'Custom Leave' && (
                <>
                  <label htmlFor="customLeaveType" className={styles.label}>Custom Leave Type Name</label>
                  <input
                    id="customLeaveType"
                    className={`${styles.inputField} ${fieldErrors.customLeaveType ? styles.inputError : ''}`}
                    value={leave.customLeaveType || ''} // Ensure it's not undefined
                    onChange={(e) => handleChangeWrapper('customLeaveType', e.target.value)}
                    placeholder="e.g., Sabbatical"
                    readOnly={isView} // Make read-only in view mode
                  />
                  {fieldErrors.customLeaveType && !isView && <p className={styles.errorText}>{fieldErrors.customLeaveType}</p>}
                </>
              )}


              {/* Start Date */}
              <label htmlFor="startDate" className={styles.label}>Start Date</label>
              <input
                id="startDate"
                type="date"
                className={`${styles.inputField} ${fieldErrors.startDate ? styles.inputError : ''}`}
                value={leave.startDate}
                onChange={(e) => handleChangeWrapper('startDate', e.target.value)}
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.startDate && !isView && <p className={styles.errorText}>{fieldErrors.startDate}</p>}

              {/* End Date */}
              <label htmlFor="endDate" className={styles.label}>End Date</label>
              <input
                id="endDate"
                type="date"
                className={`${styles.inputField} ${fieldErrors.endDate ? styles.inputError : ''}`}
                value={leave.endDate}
                onChange={(e) => handleChangeWrapper('endDate', e.target.value)}
                readOnly={isView} // Make read-only in view mode
              />
              {fieldErrors.endDate && !isView && <p className={styles.errorText}>{fieldErrors.endDate}</p>}
              
              {/* Display calculated duration if Full Days is selected and dates are valid */}
              {leave.durationType === 'Full Days' && leave.startDate && leave.endDate && (
                <p className={styles.durationInfo}>
                  Total days: {calculateDuration()} day(s)
                </p>
              )}


              {/* Duration Type Radio Buttons */}
              <label className={styles.label}>Duration</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="durationType"
                    value="Full Days"
                    checked={leave.durationType === 'Full Days'}
                    onChange={() => handleChangeWrapper('durationType', 'Full Days')}
                    disabled={isView} // Use disabled for radio buttons
                  />
                  Full Days
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="durationType"
                    value="Partial Day (Hours)"
                    checked={leave.durationType === 'Partial Day (Hours)'}
                    onChange={() => handleChangeWrapper('durationType', 'Partial Day (Hours)')}
                    disabled={isView} // Use disabled for radio buttons
                  />
                  Partial Day (Hours)
                </label>
              </div>
              {fieldErrors.durationType && !isView && <p className={styles.errorText}>{fieldErrors.durationType}</p>}


              {/* Conditional fields for Partial Day */}
              {leave.durationType === 'Partial Day (Hours)' && (
                <>
                  <label htmlFor="numberOfHours" className={styles.label}>Number of Hours</label>
                  <input
                    id="numberOfHours"
                    type="number"
                    className={`${styles.inputField} ${fieldErrors.numberOfHours ? styles.inputError : ''}`}
                    value={leave.numberOfHours || ''}
                    onChange={(e) => handleChangeWrapper('numberOfHours', parseFloat(e.target.value))}
                    placeholder="e.g., 4 or 8"
                    min="1"
                    max="24"
                    readOnly={isView} // Make read-only in view mode
                  />
                  {fieldErrors.numberOfHours && !isView && <p className={styles.errorText}>{fieldErrors.numberOfHours}</p>}

                  <label htmlFor="specificPartialDate" className={styles.label}>Specific Date for Partial Leave</label>
                  <input
                    id="specificPartialDate"
                    type="date"
                    className={`${styles.inputField} ${fieldErrors.specificPartialDate ? styles.inputError : ''}`}
                    value={leave.specificPartialDate || ''}
                    onChange={(e) => handleChangeWrapper('specificPartialDate', e.target.value)}
                    readOnly={isView} // Make read-only in view mode
                  />
                  {fieldErrors.specificPartialDate && !isView && <p className={styles.errorText}>{fieldErrors.specificPartialDate}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            {/* Other Information Column */}
            <div className={styles.formColumn}>
              <h4>Other Information</h4>
              {/* Reason for Leave */}
              <label htmlFor="reasonForLeave" className={styles.label}>Reason for Leave</label>
              <textarea
                id="reasonForLeave"
                className={`${styles.inputField} ${fieldErrors.reasonForLeave ? styles.inputError : ''}`}
                value={leave.reasonForLeave}
                onChange={(e) => handleChangeWrapper('reasonForLeave', e.target.value)}
                placeholder="Briefly explain the reason for your leave..."
                rows={4}
                readOnly={isView} // Make read-only in view mode
              ></textarea>
              {fieldErrors.reasonForLeave && !isView && <p className={styles.errorText}>{fieldErrors.reasonForLeave}</p>}

              {/* Contact Information During Leave */}
              <label htmlFor="contactInformation" className={styles.label}>Contact Information During Leave (Optional)</label>
              <input
                id="contactInformation"
                className={styles.inputField}
                value={leave.contactInformation}
                onChange={(e) => handleChangeWrapper('contactInformation', e.target.value)}
                placeholder="Phone number or email for urgent matters."
                readOnly={isView} // Make read-only in view mode
              />

              {/* Attach Supporting Documents */}
              <label htmlFor="supportingDocuments" className={styles.label}>Attach Supporting Documents (Optional)</label>
              {/* In view mode, just display the filename, don't allow file input */}
              {isView ? (
                leave.supportingDocuments ? (
                  <p className={styles.fileNameDisplay}>{leave.supportingDocuments}</p>
                ) : (
                  <p className={styles.fileNameDisplay}>No document attached.</p>
                )
              ) : (
                <input
                  id="supportingDocuments"
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => handleChangeWrapper('supportingDocuments', e.target.files ? e.target.files[0].name : '')}
                  accept=".pdf,.jpg,.png"
                  disabled={isView} // Disabled in view mode
                />
              )}
              {leave.supportingDocuments && !isView && ( // Only show selected file name in edit/add mode
                <p className={styles.fileNameDisplay}>File selected: {leave.supportingDocuments}</p>
              )}
              {fieldErrors.supportingDocuments && !isView && <p className={styles.errorText}>{fieldErrors.supportingDocuments}</p>}

              {/* Remarks/Notes */}
              <label htmlFor="remarks" className={styles.label}>Remarks/Notes (Optional)</label>
              <textarea
                id="remarks"
                className={styles.inputField}
                value={leave.remarks}
                onChange={(e) => handleChangeWrapper('remarks', e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                readOnly={isView} // Make read-only in view mode
              ></textarea>
            </div>
            {/* Status (only visible in edit mode) */}
            {(isEdit || isView) && ( // Show status in edit and view mode
              <div className={styles.formColumn}>
                <h4>Status</h4>
                <label htmlFor="status" className={styles.label}>Status</label>
                <select
                  id="status"
                  className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
                  value={leave.status}
                  onChange={(e) => handleChangeWrapper('status', e.target.value)}
                  disabled={isView} // Disabled in view mode
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {fieldErrors.status && !isView && <p className={styles.errorText}>{fieldErrors.status}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Hide if in view mode */}
        {!isView && (
          <div className={styles.buttonGroup}>
            <button onClick={handleExitClick} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              onClick={isEdit ? handleUpdateConfirm : handleSubmit}
              className={styles.submitButton}
            >
              {isEdit ? 'Update Leave' : 'Submit Leave'}
            </button>
          </div>
        )}
        {/* If in view mode, only show a close button */}
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

export default LeaveFormModal;