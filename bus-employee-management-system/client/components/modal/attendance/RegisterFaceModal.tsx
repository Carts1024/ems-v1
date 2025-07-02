'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import styles from './FacialRecognitionModal.module.css';

interface RegisterFaceModalProps {
  onClose: () => void;
  onRegisterSuccess: (employeeId: string, employeeName: string, imageSrc: string) => void;
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

const MODEL_URL = '/models'; 

const RegisterFaceModal: React.FC<RegisterFaceModalProps> = ({
  onClose,
  onRegisterSuccess,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [detected, setDetected] = useState(false);
  const [status, setStatus] = useState('');
  const [employeeNameInput, setEmployeeNameInput] = useState(''); 

  // 1. Load face-api.js models once
  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setLoading(false);
    };
    loadModels();
  }, []);

  // 2. Live face detection
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!loading) {
      interval = setInterval(async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          faceapi.nets.tinyFaceDetector.params
        ) {
          const video = webcamRef.current.video as HTMLVideoElement;
          const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
          );
          if (detections.length > 0) {
            setDetected(true);
            drawBox(detections);
          } else {
            setDetected(false); // Clear detection if no face
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear canvas
          }
        }
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  // 3. Draw detection box
  const drawBox = (detections: faceapi.FaceDetection[]) => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video as HTMLVideoElement;
    if (canvas && video) {
      faceapi.matchDimensions(canvas, video);
      const resized = faceapi.resizeResults(detections, {
        width: video.videoWidth,
        height: video.videoHeight,
      });
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resized);
    }
  };

  // 4. Handle face registration
  const handleRegister = async () => {
    if (!employeeNameInput.trim()) {
      setStatus('Please enter employee name.');
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setStatus('No image captured.');
      return;
    }

    setStatus('Registering face...');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/register`, // Assuming a /register endpoint
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: imageSrc,
            employeeName: employeeNameInput.trim(),
          }),
        }
      );
      const data = await res.json();

      if (data && data.employeeId) {
        setStatus(`Registration successful for ${data.employeeName}!`);
        setTimeout(() => {
          onRegisterSuccess(data.employeeId, data.employeeName, imageSrc);
          onClose(); 
        }, 1500);
      } else {
        setStatus(`Registration failed: ${data.message || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("Registration error:", e);
      setStatus('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>

        <div className={styles.sectionHeader}>
            <h1 className={styles.heading}>Register Face</h1>
        </div>

        <div className={styles.cameraContainer}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className={styles.webcam}
          />
          <canvas
            ref={canvasRef}
            width={videoConstraints.width}
            height={videoConstraints.height}
            className={styles.canvas}
          />
          {!webcamRef.current?.video?.readyState || loading ? (
             <div className={styles.cameraLoadingPlaceholder}>
               <i className={`ri-camera-fill ${styles.cameraIcon}`} />
               <p>Camera</p>
             </div>
           ) : null}
        </div>

        <p className={styles.cameraInstructionText}>
          Please look at the camera to record your attendance. <br />
          (Mangyaring tumingin sa kamera upang maitala ang iyong pagdalo.)
        </p>

        <div className={styles.statusSection}>
          <p className={styles.statusText}>{loading ? 'Loading models...' : status}</p>
          {detected && (
            <p className={styles.detectedText}>
              Face detected! Ready to register.
            </p>
          )}
        </div>

        <div className={styles.buttonGroup}>
            <button onClick={onClose} className={styles.cancelButton}>Close</button>
            <button
                onClick={handleRegister}
                className={styles.submitButton}
                disabled={loading || !detected || !employeeNameInput.trim()}
            >
                <i className="ri-user-add-line" /> Register Face
            </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterFaceModal;