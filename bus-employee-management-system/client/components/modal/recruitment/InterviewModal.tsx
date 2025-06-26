/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import styles from './RecruitmentModal.module.css';
import { InterviewModalLogic } from './InterviewModalLogic';

interface InterviewModalProps {
  isEdit: boolean;
  defaultValue?: any;
  existingSchedules: any[];
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  isEdit,
  defaultValue,
  existingSchedules,
  onClose,
  onSubmit,
}) => {
  const {
    schedule,
    fieldErrors,
    handleChange,
    validate,
  } = InterviewModalLogic(defaultValue);

  const convertTo12Hour = (time24: string): string => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const formattedSchedule = {
      ...schedule,
      interviewTime: convertTo12Hour(schedule.interviewTime),
    };

    onSubmit(formattedSchedule);
    onClose();
  };

  const handleChangeWrapper = (field: keyof typeof schedule, value: string) => {
    handleChange(field, value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <h1>{isEdit ? 'Edit Interview Schedule' : 'Schedule Interview'}</h1>

        <form onSubmit={handleFormSubmit}>
          <label className={styles.label}>Status</label>
          <select
            className={`${styles.inputField} ${fieldErrors.interviewStatus ? styles.inputError : ''}`}
            value={schedule.interviewStatus}
            onChange={(e) => handleChangeWrapper('interviewStatus', e.target.value)}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {fieldErrors.interviewStatus && <p className={styles.errorText}>{fieldErrors.interviewStatus}</p>}

          <label className={styles.label}>Name</label>
          <input
            className={`${styles.inputField} ${fieldErrors.candidateName ? styles.inputError : ''}`}
            value={schedule.candidateName}
            onChange={(e) => handleChangeWrapper('candidateName', e.target.value)}
            placeholder="Enter candidate name"
          />
          {fieldErrors.candidateName && <p className={styles.errorText}>{fieldErrors.candidateName}</p>}

          <div className={styles.scheduleRow}>
            <div className={styles.scheduleColumn}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.inputField}
                value={schedule.interviewDate}
                onChange={(e) => handleChangeWrapper('interviewDate', e.target.value)}
              />
              {fieldErrors.interviewDate && <p className={styles.errorText}>{fieldErrors.interviewDate}</p>}
            </div>

            <div className={styles.scheduleColumn}>
              <label className={styles.label}>Time</label>
              <input
                type="time"
                className={styles.inputField}
                value={schedule.interviewTime}
                onChange={(e) => handleChangeWrapper('interviewTime', e.target.value)}
              />
              {fieldErrors.interviewTime && <p className={styles.errorText}>{fieldErrors.interviewTime}</p>}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {isEdit ? 'Save Changes' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;