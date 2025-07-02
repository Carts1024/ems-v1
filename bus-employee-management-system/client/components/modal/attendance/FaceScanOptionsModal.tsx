'use client';

import React from 'react';
import styles from './FacialRecognitionModal.module.css'; 
interface FaceScanOptionsModalProps {
  onClose: () => void;
  onRecordAttendanceClick: () => void;
  onRegisterFaceClick: () => void;
}

const FaceScanOptionsModal: React.FC<FaceScanOptionsModalProps> = ({
  onClose,
  onRecordAttendanceClick,
  onRegisterFaceClick,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.optionsModalContent}`}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>Choose Face Scan Option</h1>
            <p className={styles.subHeading}>Select an option to proceed with face scanning.</p>
        </div>

        <div className={styles.optionsContainer}>
          {/* Option 1: Record Attendance */}
          <div className={styles.optionCard}>
            <div className={styles.iconCircle}>
              <i className={`ri-user-follow-line ${styles.optionIcon}`} />
            </div>
            <h3 className={styles.optionTitle}>Record Attendance</h3>
            <p className={styles.optionDescription}>Log your daily attendance using facial recognition.</p>
            <button
              className={`${styles.submitButton} ${styles.optionButton}`}
              onClick={onRecordAttendanceClick}
            >
              <i className="ri-camera-line" /> Scan for Attendance
            </button>
          </div>

          {/* Option 2: Register Face */}
          <div className={styles.optionCard}>
            <div className={styles.iconCircle}>
              <i className={`ri-user-add-line ${styles.optionIcon}`} />
            </div>
            <h3 className={styles.optionTitle}>Register Face</h3>
            <p className={styles.optionDescription}>Enroll your face for future attendance tracking.</p>
            <button
              className={`${styles.cancelButton} ${styles.optionButton}`}
              onClick={onRegisterFaceClick}
            >
              <i className="ri-user-add-line" /> Register Your Face
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceScanOptionsModal;