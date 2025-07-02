/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import styles from './FacialRecognitionModal.module.css';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic'; 

interface FacialRecognitionModalProps {
  onClose: () => void;
  onScanSuccess: (attendance: Attendance) => void; 
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

const MODEL_URL = '/models'; // Put your face-api.js models in public/models

const FacialRecognitionModal: React.FC<FacialRecognitionModalProps> = ({
  onClose,
  onScanSuccess,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [detected, setDetected] = useState(false);
  const [status, setStatus] = useState('');

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
            // handleCapture();
            if (interval) clearInterval(interval); // prevent further captures for now
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

 // 4. Capture frame and send for recognition
const handleCapture = async () => {
  const imageSrc = webcamRef.current?.getScreenshot();
  if (!imageSrc) return;

  setStatus('Sending for recognition...');
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/recognize`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageSrc }),
      }
    );
    const data = await res.json();

    if (data && data.employeeId) {
      setStatus(`Recognized: ${data.employeeName}`);

      // Call the callback
      const attendance: Attendance = {
        employeeName: data.employeeName,
        time: new Date().toISOString(),
        type: data.type || 'Time In',
        // add other Attendance fields as needed
      };
      setTimeout(() => {
        onScanSuccess(attendance);
      }, 1000); // Give user a second to read status
    } else {
      setStatus('Face not recognized.');
      setTimeout(() => setDetected(false), 2000);
    }
  } catch (e) {
    setStatus('Recognition failed. Try again.');
    setTimeout(() => setDetected(false), 2000);
  }
};


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="ri-close-line" />
        </button>
        {/* Camera Placeholder replaced with actual webcam and canvas */}
        <div className={styles.cameraPlaceholderContainer} style={{ position: 'relative', width: '100%', maxWidth: 720, aspectRatio: '16/9', margin: '0 auto' }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className={styles.webcam}
            style={{ borderRadius: 8, width: '100%', height: 'auto', maxHeight: 480, background: '#000' }}
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className={styles.canvas}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
            }}
          />
        </div>
        <p className={styles.cameraInstructionText}>
          Please look at the camera to record your attendance. <br />
          (Mangyaring tumingin sa kamera upang maitala ang iyong pagdalo.)
        </p>
        <p style={{ color: '#1976d2', marginTop: 8 }}>{loading ? 'Loading...' : status}</p>
        {detected && (
          <p style={{ color: '#27ae60', fontWeight: 500 }}>
            Face detected! Processing...
          </p>
        )}
      </div>
    </div>
  );
}

export default FacialRecognitionModal;


// 'use client';
// import Webcam from 'react-webcam';

// export default function TestWebcam() {
//   return (
//     <div>
//       <Webcam
//         audio={false}
//         style={{ width: 400, height: 300, border: '2px solid red' }}
//       />
//     </div>
//   );
// }