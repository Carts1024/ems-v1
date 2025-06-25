'use client';

import React from 'react';
import styles from './AttendanceModal.module.css';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic';
import { useAttendanceModal } from './AttendanceModalLogic';

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
    handleChangeWrapper,
    handleSubmitWrapper,
    handleExitClick,
    fullDateText,
    numericDateTime,
  } = useAttendanceModal(onSubmit, onClose, isView, defaultValue);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>Record Attendance</h1>
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

        <label className={styles.label}>Employee Name</label>
        <input
          className={`${styles.inputField} ${fieldErrors.employeeName ? styles.inputError : ''}`}
          value={attendance.employeeName}
          onChange={(e) => handleChangeWrapper('employeeName', e.target.value)}
          placeholder="Enter employee name"
          disabled={isView}
        />
        {fieldErrors.employeeName && <p className={styles.errorText}>{fieldErrors.employeeName}</p>}

        <label className={styles.label}>Date Hired</label>
        <input
          type="date"
          className={`${styles.inputField} ${fieldErrors.hiredate ? styles.inputError : ''}`}
          value={attendance.hiredate}
          onChange={(e) => handleChangeWrapper('hiredate', e.target.value)}
          disabled={isView}
        />
        {fieldErrors.hiredate && <p className={styles.errorText}>{fieldErrors.hiredate}</p>}

        <label className={styles.label}>Department</label>
        <select
          className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
          value={attendance.department}
          onChange={(e) => handleChangeWrapper('department', e.target.value)}
          disabled={isView}
        >
          <option value="">Departments</option>
          <option value="Accounting">Accounting</option>
          <option value="Human Resource">Human Resource</option>
          <option value="Inventory">Inventory</option>
          <option value="Operations">Operations</option>
        </select>
        {fieldErrors.department && <p className={styles.errorText}>{fieldErrors.department}</p>}

        <label className={styles.label}>Position</label>
        <input
          className={`${styles.inputField} ${fieldErrors.position ? styles.inputError : ''}`}
          value={attendance.position}
          onChange={(e) => handleChangeWrapper('position', e.target.value)}
          placeholder="Enter position"
          disabled={isView}
        />
        {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

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
              className={styles.inputField}
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
              className={styles.inputField}
              value={attendance.timeOut}
              onChange={(e) => handleChangeWrapper('timeOut', e.target.value)}
              disabled={isView}
            />
            {fieldErrors.timeOut && <p className={styles.errorText}>{fieldErrors.timeOut}</p>}
          </div>
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
              <button onClick={handleSubmitWrapper} className={styles.submitButton}>Record</button>
            </div>
          )}
      </div>
    </div>
  );
};

export default AttendanceModal;