'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess } from '@/app/utils/swal';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic';

export const useAttendanceModal = (
  onSubmit: (attendance: Attendance) => void,
  onClose: () => void,
  isView?: boolean,
  defaultValue?: Attendance,
) => {
  const [attendance, setAttendance] = useState<Attendance>(
    defaultValue ?? {
      status: '',
      employeeName: '',
      hiredate: '',
      department: '',
      position: '',
      date: '',
      timeIn: '',
      timeOut: '',
      remarks: '',
    }
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChangeWrapper = (field: keyof Attendance, value: string) => {
    setAttendance((prev) => ({ ...prev, [field]: value }));

    // Clear error for the field being updated
    setFieldErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
    });
    };


  const validateFields = () => {
    const errors: Record<string, string> = {};

    const normalizeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0); // strip time
    return date;
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!attendance.status) {
      errors.status = 'Status is required';
    }

    if (!attendance.employeeName.trim()) {
      errors.employeeName = 'Employee name is required';
    }

    if (!attendance.hiredate) {
    errors.hiredate = 'Date hired is required';
    } else if (normalizeDate(attendance.hiredate) > today) {
    errors.hiredate = 'Date hired cannot be in the future';
    }

    if (!attendance.department) {
      errors.department = 'Department is required';
    }

    if (!attendance.position) {
      errors.position = 'Position is required';
    }

    if (!attendance.date) {
    errors.date = 'Attendance date is required';
    } else if (normalizeDate(attendance.date) > today) {
    errors.attendanceDate = 'Date cannot be in the future';
    }

    if (attendance.timeIn && attendance.timeOut) {
      const [inHour, inMinute] = attendance.timeIn.split(':').map(Number);
      const [outHour, outMinute] = attendance.timeOut.split(':').map(Number);

      const timeInDate = new Date();
      timeInDate.setHours(inHour, inMinute, 0, 0);

      const timeOutDate = new Date();
      timeOutDate.setHours(outHour, outMinute, 0, 0);

      if (timeInDate.getTime() === timeOutDate.getTime()) {
        errors.timeIn = 'Time In and Time Out cannot be the same';
        errors.timeOut = 'Time In and Time Out cannot be the same';
      } else if (timeInDate.getTime() > timeOutDate.getTime()) {
        errors.timeIn = 'Time In cannot be later than Time Out';
        errors.timeOut = 'Time Out cannot be earlier than Time In';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitWrapper = () => {
    if (!validateFields()) return;
    onSubmit(attendance);
    onClose();
    showSuccess('Success', 'Attendance recorded successfully.');
  };

  const handleExitClick = async () => {
    const result = await showConfirmation(
      'Are you sure you want to close? Unsaved data will be lost.'
    );
    if (result.isConfirmed) onClose();
  };

  const now = new Date();
  const fullDateText = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
  const numericDateTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return {
    attendance,
    fieldErrors,
    handleChangeWrapper,
    handleSubmitWrapper,
    handleExitClick,
    fullDateText,
    numericDateTime,
    isView, defaultValue
  };
};