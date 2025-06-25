'use client';

import React from 'react';
import styles from './AttendanceModal.module.css';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic';
import { useAttendanceModal } from './AttendanceModalLogic';

interface AttendanceModalProps {
  onClose: () => void;
  onSubmit: (attendance: Attendance) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ onClose, onSubmit }) => {
  const {
    attendance,
    fieldErrors,
    handleChangeWrapper,
    handleSubmitWrapper,
    handleExitClick,
    fullDateText,
    numericDateTime,
  } = useAttendanceModal(onSubmit, onClose);

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
          className={`${styles.inputField} ${fieldErrors.attendanceStatus ? styles.inputError : ''}`}
          value={attendance.attendanceStatus}
          onChange={(e) => handleChangeWrapper('attendanceStatus', e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
        {fieldErrors.attendanceStatus && <p className={styles.errorText}>{fieldErrors.attendanceStatus}</p>}

        <label className={styles.label}>Employee Name</label>
        <input
          className={`${styles.inputField} ${fieldErrors.employeeName ? styles.inputError : ''}`}
          value={attendance.employeeName}
          onChange={(e) => handleChangeWrapper('employeeName', e.target.value)}
          placeholder="Enter employee name"
        />
        {fieldErrors.employeeName && <p className={styles.errorText}>{fieldErrors.employeeName}</p>}

        <label className={styles.label}>Date Hired</label>
        <input
          type="date"
          className={`${styles.inputField} ${fieldErrors.dateHired ? styles.inputError : ''}`}
          value={attendance.dateHired}
          onChange={(e) => handleChangeWrapper('dateHired', e.target.value)}
        />
        {fieldErrors.dateHired && <p className={styles.errorText}>{fieldErrors.dateHired}</p>}

        <label className={styles.label}>Department</label>
        <select
          className={`${styles.inputField} ${fieldErrors.department ? styles.inputError : ''}`}
          value={attendance.department}
          onChange={(e) => handleChangeWrapper('department', e.target.value)}
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
        />
        {fieldErrors.position && <p className={styles.errorText}>{fieldErrors.position}</p>}

        <label className={styles.label}>Attendance Date</label>
        <input
          type="date"
          className={`${styles.inputField} ${fieldErrors.attendanceDate ? styles.inputError : ''}`}
          value={attendance.attendanceDate}
          onChange={(e) => handleChangeWrapper('attendanceDate', e.target.value)}
        />
        {fieldErrors.attendanceDate && <p className={styles.errorText}>{fieldErrors.attendanceDate}</p>}

        <div className={styles.buttonGroup}>
          <button onClick={handleExitClick} className={styles.cancelButton}>Cancel</button>
          <button onClick={handleSubmitWrapper} className={styles.submitButton}>Record</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;