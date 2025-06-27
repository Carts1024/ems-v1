'use client';

import React from 'react';
import styles from './AttendanceModal.module.css';
import { Attendance } from '@/types/attendance';
import { useAttendanceModal } from './AttendanceModalLogic';
import { SearchableDropdown, DropdownOption } from '@/components/ui/SearchableDropdown';

interface AttendanceModalProps {
  onClose: () => void;
  onSubmit: (attendance: Attendance) => void;
  defaultValue?: Attendance;
  isView?: boolean;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  onClose,
  onSubmit,
  isView = false,
  defaultValue,
}) => {
  const {
    attendance,
    fieldErrors,
    employees,
    loadingEmployees,
    selectedEmployeeId,
    handleChangeWrapper,
    handleEmployeeChange,
    handleSubmitWrapper,
    handleExitClick,
    fullDateText,
    numericDateTime,
  } = useAttendanceModal(onSubmit, onClose, isView, defaultValue);

  // Convert employees to dropdown options
  const employeeOptions: DropdownOption[] = employees.map(employee => ({
    id: employee.id,
    label: `${employee.firstName} ${employee.lastName}`,
    subtitle: `${employee.employeeNumber} • ${employee.position?.positionName || 'N/A'} • ${employee.position?.department?.departmentName || employee.department || 'N/A'}`,
    data: employee,
  }));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>
              {isView
                ? "Attendance Details"
                : defaultValue?.id 
                  ? "Edit Attendance"
                  : "Record Attendance"}
            </h1>
            <h4 className={styles.date}>
                {fullDateText} <br />
                {numericDateTime}
            </h4>
        </div>

        <label className={styles.label}>Status</label>
        <select
          className={`${styles.inputField} ${fieldErrors.status ? styles.inputError : ''}`}
          value={attendance.status}
          onChange={(e) => handleChangeWrapper('status', e.target.value)}
          disabled={isView}
        >
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
        {fieldErrors.status && <p className={styles.errorText}>{fieldErrors.status}</p>}

        <label className={styles.label}>Employee</label>
        <SearchableDropdown
          options={employeeOptions}
          value={selectedEmployeeId}
          onChange={handleEmployeeChange}
          placeholder="Search and select employee..."
          disabled={isView}
          loading={loadingEmployees}
          error={fieldErrors.employeeId}
        />
        {fieldErrors.employeeId && <p className={styles.errorText}>{fieldErrors.employeeId}</p>}

        {/* Display employee details (read-only) */}
        {attendance.employeeName && (
          <>
            <label className={styles.label}>Employee Name</label>
            <input
              className={styles.inputField}
              value={attendance.employeeName}
              disabled
              style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
            />

            <label className={styles.label}>Date Hired</label>
            <input
              type="date"
              className={styles.inputField}
              value={attendance.hiredate}
              disabled
              style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
            />

            <label className={styles.label}>Department</label>
            <input
              className={styles.inputField}
              value={attendance.department}
              disabled
              style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
            />

            <label className={styles.label}>Position</label>
            <input
              className={styles.inputField}
              value={attendance.position}
              disabled
              style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
            />
          </>
        )}

        <label className={styles.label}>Attendance Date</label>
        <input
          type="date"
          className={`${styles.inputField} ${fieldErrors.date ? styles.inputError : ''}`}
          value={attendance.date}
          onChange={(e) => handleChangeWrapper('date', e.target.value)}
          disabled={isView}
        />
        {fieldErrors.date && <p className={styles.errorText}>{fieldErrors.date}</p>}

        <div className={styles.timeRow}>
          <div className={styles.timeColumn}>
            <label className={styles.label}>Time In</label>
            <input
              type="time"
              className={`${styles.inputField} ${fieldErrors.timeIn ? styles.inputError : ''}`}
              value={attendance.timeIn}
              onChange={(e) => handleChangeWrapper('timeIn', e.target.value)}
              disabled={isView}
            />
            {fieldErrors.timeIn && <p className={styles.errorText}>{fieldErrors.timeIn}</p>}
          </div>
          <div className={styles.timeColumn}>
            <label className={styles.label}>Time Out</label>
            <input
              type="time"
              className={`${styles.inputField} ${fieldErrors.timeOut ? styles.inputError : ''}`}
              value={attendance.timeOut}
              onChange={(e) => handleChangeWrapper('timeOut', e.target.value)}
              disabled={isView}
            />
            {fieldErrors.timeOut && <p className={styles.errorText}>{fieldErrors.timeOut}</p>}
          </div>
        </div>

        <label className={styles.label}>Is Holiday</label>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isHoliday"
            checked={attendance.isHoliday || false}
            onChange={(e) => handleChangeWrapper('isHoliday', e.target.checked)}
            disabled={isView}
            className={styles.checkbox}
          />
          <label htmlFor="isHoliday" className={styles.checkboxLabel}>
            Mark as holiday
          </label>
        </div>

        <label className={styles.label}>Remarks</label>
          <textarea
            value={attendance.remarks}
            onChange={(e) => handleChangeWrapper('remarks', e.target.value)}
            className={styles.inputField}
            placeholder="Write remarks"
            rows={3}
            disabled={isView}
          />

          {!isView && (
            <div className={styles.buttonGroup}>
              <button onClick={handleExitClick} className={styles.cancelButton}>Cancel</button>
              <button onClick={handleSubmitWrapper} className={styles.submitButton}>
                {defaultValue?.id ? 'Update' : 'Record'}
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default AttendanceModal;