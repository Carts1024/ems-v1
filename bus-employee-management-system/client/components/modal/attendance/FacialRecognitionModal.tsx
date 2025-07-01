'use client';

import React from 'react';
import styles from './FacialRecognitionModal.module.css';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic'; 

interface FacialRecognitionModalProps {
  onClose: () => void;
  onScanSuccess: (attendance: Attendance) => void; 
}

const FacialRecognitionModal: React.FC<FacialRecognitionModalProps> = ({
  onClose,
  onScanSuccess,
}) => {

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>
        <div className={styles.cameraPlaceholderContainer}>
          <i className={`ri-camera-fill ${styles.cameraIcon}`} />
          <p>Camera Placeholder</p>
        </div>

        <p className={styles.cameraInstructionText}>
          Please look at the camera to record your attendance. <br/>
          (Mangyaring tumingin sa kamera upang maitala ang iyong pagdalo.)
        </p>
      </div>
    </div>
  );
};

export default FacialRecognitionModal;