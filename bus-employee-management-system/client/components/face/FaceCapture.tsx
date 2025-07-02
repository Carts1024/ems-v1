// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';

// const videoConstraints = {
//   width: 640,
//   height: 480,
//   facingMode: 'user',
// };

// export default function FaceCapture({ employeeId }: { employeeId: string }) {
//   const webcamRef = useRef<Webcam>(null);
//   const [status, setStatus] = useState('');

//   const captureFace = async () => {
//     const screenshot = webcamRef.current?.getScreenshot();
//     if (!screenshot) return;

//     setStatus('Uploading...');

//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/face/enroll`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ employeeId, imageBase64: screenshot }),
//     });

//     if (response.ok) {
//       setStatus('Face saved successfully.');
//     } else {
//       setStatus('Error saving face.');
//     }
//   };

//   return (
//     <div>
//       <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
//       <button onClick={captureFace} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
//         Capture & Enroll
//       </button>
//       <p>{status}</p>
//     </div>
//   );
// }


import Webcam from 'react-webcam';

export default function TestCam() {
  return <Webcam audio={false} style={{ width: 400, height: 300, border: '2px solid red' }} />;
}