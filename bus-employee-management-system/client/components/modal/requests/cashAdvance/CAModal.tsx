/* eslint-disable @typescript-eslint/no-unused-vars */
// CAModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './CAModal.module.css';
import { useCAModalLogic, CashAdvanceForm, PaymentMethod, AdvanceStatus, AdvanceType } from './CAModalLogic';
import { showConfirmation } from '@/app/utils/swal';

interface CAModalProps {
  isEdit: boolean;
  isView: boolean;
  defaultValue?: CashAdvanceForm;
  onClose: () => void;
  onSubmit: (cashAdvance: CashAdvanceForm) => void;
  approversList?: string[]; // New prop for approvers dropdown
}

const CAModal: React.FC<CAModalProps> = ({
  isEdit,
  isView,
  defaultValue,
  onClose,
  onSubmit,
  approversList = ['John Doe (Manager)', 'Jane Smith (HR)'], // Default approvers for demonstration
}) => {
  const {
    cashAdvance,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm,
  } = useCAModalLogic(
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

  useEffect(() => {
    if (isView) {
      setHasChanges(false);
      return;
    }

    const defaultComparable = defaultValue ? {
      ...defaultValue,
      dateHired: formatDateForComparison(defaultValue.dateHired),
      dueDate: formatDateForComparison(defaultValue.dueDate),
      fullRepaymentDate: formatDateForComparison(defaultValue.fullRepaymentDate),
      employee: defaultValue.employee || '',
      department: defaultValue.department || '',
      jobPosition: defaultValue.jobPosition || '',
      advanceType: defaultValue.advanceType || 'General Cash Advance',
      amount: defaultValue.amount || 0,
      reason: defaultValue.reason || '',
      repaymentMethod: defaultValue.repaymentMethod || 'Deduction from next payroll',
      numberOfRepaymentPeriods: defaultValue.numberOfRepaymentPeriods || undefined,
      receiptsAttached: defaultValue.receiptsAttached || false,
      approver: defaultValue.approver || '',
      remarks: defaultValue.remarks || '',
      status: defaultValue.status || 'Pending',
      acknowledgment: defaultValue.acknowledgment || false,
      supportingDocuments: defaultValue.supportingDocuments || '',
    } : null;

    const currentComparable = {
      ...cashAdvance,
      dateHired: formatDateForComparison(cashAdvance.dateHired),
      dueDate: formatDateForComparison(cashAdvance.dueDate),
      fullRepaymentDate: formatDateForComparison(cashAdvance.fullRepaymentDate),
      employee: cashAdvance.employee || '',
      department: cashAdvance.department || '',
      jobPosition: cashAdvance.jobPosition || '',
      advanceType: cashAdvance.advanceType || 'General Cash Advance',
      amount: cashAdvance.amount || 0,
      reason: cashAdvance.reason || '',
      repaymentMethod: cashAdvance.repaymentMethod || 'Deduction from next payroll',
      numberOfRepaymentPeriods: cashAdvance.numberOfRepaymentPeriods || undefined,
      receiptsAttached: cashAdvance.receiptsAttached || false,
      approver: cashAdvance.approver || '',
      remarks: cashAdvance.remarks || '',
      status: cashAdvance.status || 'Pending',
      acknowledgment: cashAdvance.acknowledgment || false,
      supportingDocuments: cashAdvance.supportingDocuments || '',
    };

    const newHasChanges = JSON.stringify(currentComparable) !== JSON.stringify(defaultComparable);
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges);
    }
  }, [defaultValue, isEdit, isView, cashAdvance, hasChanges]);

  const handleChangeWrapper = (field: keyof CashAdvanceForm, value: string | number | boolean | undefined) => {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.headingIcon}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
          </svg>
          {isView ? 'View Cash Advance Details' : (isEdit ? 'Edit Cash Advance Request' : 'Submit Cash Advance Request')}
        </h1>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.formColumn}>
              <h4>Employee Details</h4>
              <label htmlFor="employee" className={styles.label}>Employee Name</label>
              <input
                id="employee"
                className={`${styles.inputField} ${fieldErrors.employee ? styles.inputError : ''}`}
                value={cashAdvance.employee}
                onChange={(e) => handleChangeWrapper('employee', e.target.value)}
                placeholder="Enter employee name"
                readOnly={isView}
              />
              {fieldErrors.employee && !isView && <p className={styles.errorText}>{fieldErrors.employee}</p>}

              <label htmlFor="department" className={styles.label}>Department</label>
              <input
                id="department"
                className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
                value={cashAdvance.department}
                onChange={(e) => handleChangeWrapper('department', e.target.value)}
                placeholder="Enter department"
                readOnly={isView}
              />
              {fieldErrors.department && !isView && <p className={styles.errorText}>{fieldErrors.department}</p>}

              <label htmlFor="dateHired" className={styles.label}>Date Hired</label>
              <input
                id="dateHired"
                type="date"
                className={`${styles.inputField} ${fieldErrors.dateHired ? styles.inputError : ''}`}
                value={cashAdvance.dateHired}
                onChange={(e) => handleChangeWrapper('dateHired', e.target.value)}
                readOnly={isView}
              />
              {fieldErrors.dateHired && !isView && <p className={styles.errorText}>{fieldErrors.dateHired}</p>}

              <label htmlFor="jobPosition" className={styles.label}>Job Position</label>
              <input
                id="jobPosition"
                className={`${styles.inputField} ${fieldErrors.jobPosition ? styles.inputError : ''}`}
                value={cashAdvance.jobPosition}
                onChange={(e) => handleChangeWrapper('jobPosition', e.target.value)}
                placeholder="Enter job position"
                readOnly={isView}
              />
              {fieldErrors.jobPosition && !isView && <p className={styles.errorText}>{fieldErrors.jobPosition}</p>}

              <label htmlFor="approver" className={styles.label}>Approver</label>
              <select
                id="approver"
                className={`${styles.inputField} ${fieldErrors.approver ? styles.inputError : ''}`}
                value={cashAdvance.approver}
                onChange={(e) => handleChangeWrapper('approver', e.target.value)}
                disabled={isView}
              >
                <option value="">Select Approver</option>
                {approversList.map((approver, index) => (
                  <option key={index} value={approver}>{approver}</option>
                ))}
              </select>
              {fieldErrors.approver && !isView && <p className={styles.errorText}>{fieldErrors.approver}</p>}
            </div>

            <div className={styles.formColumn}>
              <h4>Advance Details & Repayment</h4>
              <label htmlFor="advanceType" className={styles.label}>Advance Type</label>
              <select
                id="advanceType"
                className={`${styles.inputField} ${fieldErrors.advanceType ? styles.inputError : ''}`}
                value={cashAdvance.advanceType}
                onChange={(e) => handleChangeWrapper('advanceType', e.target.value)}
                disabled={isView}
              >
                <option value="General Cash Advance">General Cash Advance</option>
                <option value="Travel Advance">Travel Advance</option>
                <option value="Project Advance">Project Advance</option>
                <option value="Emergency Advance">Emergency Advance</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.advanceType && !isView && <p className={styles.errorText}>{fieldErrors.advanceType}</p>}

              <label htmlFor="amount" className={styles.label}>Amount (PHP)</label>
              <input
                id="amount"
                type="number"
                className={`${styles.inputField} ${fieldErrors.amount ? styles.inputError : ''}`}
                value={cashAdvance.amount || ''}
                onChange={(e) => handleChangeWrapper('amount', parseFloat(e.target.value))}
                placeholder="e.g., 500.00"
                min="0"
                readOnly={isView}
              />
              {fieldErrors.amount && !isView && <p className={styles.errorText}>{fieldErrors.amount}</p>}

              <label htmlFor="reason" className={styles.label}>Purpose</label>
              <textarea
                id="reason"
                className={`${styles.inputField} ${fieldErrors.reason ? styles.inputError : ''}`}
                value={cashAdvance.reason}
                onChange={(e) => handleChangeWrapper('reason', e.target.value)}
                placeholder="Briefly explain the purpose of the cash advance..."
                rows={4}
                readOnly={isView}
              ></textarea>
              {fieldErrors.reason && !isView && <p className={styles.errorText}>{fieldErrors.reason}</p>}

              <label htmlFor="repaymentMethod" className={styles.label}>Repayment Method</label>
              <select
                id="repaymentMethod"
                className={`${styles.inputField} ${fieldErrors.repaymentMethod ? styles.inputError : ''}`}
                value={cashAdvance.repaymentMethod}
                onChange={(e) => handleChangeWrapper('repaymentMethod', e.target.value as PaymentMethod)}
                disabled={isView}
              >
                <option value="Deduction from next payroll">Deduction from next payroll</option>
                <option value="Deduction over periods">Deduction over periods</option>
                <option value="Full repayment on specific date">Full repayment on specific date</option>
              </select>
              {fieldErrors.repaymentMethod && !isView && <p className={styles.errorText}>{fieldErrors.repaymentMethod}</p>}

              {cashAdvance.repaymentMethod === 'Deduction over periods' && (
                <>
                  <label htmlFor="numberOfRepaymentPeriods" className={styles.label}>Number of Repayment Periods</label>
                  <input
                    id="numberOfRepaymentPeriods"
                    type="number"
                    className={`${styles.inputField} ${fieldErrors.numberOfRepaymentPeriods ? styles.inputError : ''}`}
                    value={cashAdvance.numberOfRepaymentPeriods || ''}
                    onChange={(e) => handleChangeWrapper('numberOfRepaymentPeriods', parseInt(e.target.value, 10) || undefined)}
                    placeholder="e.g., 3"
                    min="1"
                    readOnly={isView}
                  />
                  {fieldErrors.numberOfRepaymentPeriods && !isView && <p className={styles.errorText}>{fieldErrors.numberOfRepaymentPeriods}</p>}
                </>
              )}

              {cashAdvance.repaymentMethod === 'Full repayment on specific date' && (
                <>
                  <label htmlFor="fullRepaymentDate" className={styles.label}>Full Repayment Date</label>
                  <input
                    id="fullRepaymentDate"
                    type="date"
                    className={`${styles.inputField} ${fieldErrors.fullRepaymentDate ? styles.inputError : ''}`}
                    value={cashAdvance.fullRepaymentDate || ''}
                    onChange={(e) => handleChangeWrapper('fullRepaymentDate', e.target.value)}
                    readOnly={isView}
                  />
                  {fieldErrors.fullRepaymentDate && !isView && <p className={styles.errorText}>{fieldErrors.fullRepaymentDate}</p>}
                </>
              )}

              {/* Due Date (always present for general tracking) */}
              <label htmlFor="dueDate" className={styles.label}>General Due Date</label>
              <input
                id="dueDate"
                type="date"
                className={`${styles.inputField} ${fieldErrors.dueDate ? styles.inputError : ''}`}
                value={cashAdvance.dueDate}
                onChange={(e) => handleChangeWrapper('dueDate', e.target.value)}
                readOnly={isView}
              />
              {fieldErrors.dueDate && !isView && <p className={styles.errorText}>{fieldErrors.dueDate}</p>}
            </div>
          </div>
        </div>

        <div className={styles.sectionGroup}>
          <div className={styles.formSections}>
            <div className={styles.formColumn}>
              <h4>Additional Information</h4>
              <label htmlFor="supportingDocuments" className={styles.label}>Attach Supporting Documents (Optional)</label>
              {isView ? (
                cashAdvance.supportingDocuments ? (
                  <p className={styles.fileNameDisplay}>{cashAdvance.supportingDocuments}</p>
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
                  disabled={isView}
                />
              )}
              {cashAdvance.supportingDocuments && !isView && (
                <p className={styles.fileNameDisplay}>File selected: {cashAdvance.supportingDocuments}</p>
              )}
              {fieldErrors.supportingDocuments && !isView && <p className={styles.errorText}>{fieldErrors.supportingDocuments}</p>}

              <label htmlFor="remarks" className={styles.label}>Remarks/Notes (Optional)</label>
              <textarea
                id="remarks"
                className={styles.inputField}
                value={cashAdvance.remarks}
                onChange={(e) => handleChangeWrapper('remarks', e.target.value)}
                placeholder="Any additional information..."
                rows={3}
                readOnly={isView}
              ></textarea>
              {fieldErrors.remarks && !isView && <p className={styles.errorText}>{fieldErrors.remarks}</p>}

              {!isView && ( // Only show acknowledgment checkbox in add/edit mode
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={cashAdvance.acknowledgment}
                      onChange={(e) => handleChangeWrapper('acknowledgment', e.target.checked)}
                      disabled={isView}
                    />
                    I acknowledge that this cash advance is subject to company policy.
                  </label>
                  {fieldErrors.acknowledgment && <p className={styles.errorText}>{fieldErrors.acknowledgment}</p>}
                </div>
              )}
              {isView && ( // Show acknowledgment status in view mode
                <p className={styles.acknowledgmentStatus}>
                  Acknowledgment: {cashAdvance.acknowledgment ? 'Acknowledged' : 'Not Acknowledged'}
                </p>
              )}
            </div>

            {(isEdit || isView) && (
              <div className={styles.formColumn}>
                <h4>Status</h4>
                <label htmlFor="status" className={styles.label}>Status</label>
                <select
                  id="status"
                  className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
                  value={cashAdvance.status}
                  onChange={(e) => handleChangeWrapper('status', e.target.value as AdvanceStatus)}
                  disabled={isView}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Reimbursed">Reimbursed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {fieldErrors.status && !isView && <p className={styles.errorText}>{fieldErrors.status}</p>}
              </div>
            )}
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

export default CAModal;