'use client';

import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic';

export const useFacialRecognitionModalLogic = (
  onScanSuccess: (attendance: Attendance) => void
) => {
  const handleSimulateScan = () => {
    // dummy kunware na kuha na ng facial recog yung data
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeIn = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    const dummyAttendance: Attendance = {
      status: 'Present', //placeholder lahat
      employeeName: 'John Doe',
      hiredate: '2022-03-01',
      department: 'Marketing',
      position: 'Manager',
      date: date,
      timeIn: timeIn,
      timeOut: '',
      remarks: 'Recorded via facial recognition',
    };
    onScanSuccess(dummyAttendance);
  };

  return {
    handleSimulateScan,
  };
};