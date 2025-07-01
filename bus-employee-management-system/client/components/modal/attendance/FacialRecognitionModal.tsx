'use client';

import React from 'react';
import styles from './AttendanceModal.module.css';
import { useFacialRecognitionModalLogic } from './FacialRecognitionModalLogic'; 
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic'; 

interface FacialRecognitionModalProps {
  onClose: () => void;
  onScanSuccess: (attendance: Attendance) => void;
}

const FacialRecognitionModal: React.FC<FacialRecognitionModalProps> = ({
  onClose,
  onScanSuccess,
}) => {
  const { handleSimulateScan } = useFacialRecognitionModalLogic(onScanSuccess);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <div className={`${styles.sectionHeader} ${styles.centeredHeader}`}>
          <h1 className={styles.heading}>Facial Recognition Attendance</h1>
        </div>

        <div className={styles.cameraPlaceholderContainer}> 
           <i className={`ri-camera-fill ${styles.cameraIcon}`} />
          <p>Camera Placeholder</p>
        </div>

        <p className={styles.cameraInstructionText}> 
          Please look at the camera to record your attendance.
        </p>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>Close</button>
          <button onClick={handleSimulateScan} className={styles.submitButton}>
            Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacialRecognitionModal;