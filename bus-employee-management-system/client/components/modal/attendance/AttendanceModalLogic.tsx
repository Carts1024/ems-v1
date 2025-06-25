'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess } from '@/app/utils/swal';
import { Attendance } from '@/app/homepage/attendance/daily-report/dailyReportLogic';

export const useAttendanceModal = (
  onSubmit: (attendance: Attendance) => void,
  onClose: () => void
) => {
  const [attendance, setAttendance] = useState<Attendance>({
    attendanceStatus: '',
    employeeName: '',
    dateHired: '',
    department: '',
    position: '',
    attendanceDate: '',
  });

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

    if (!attendance.attendanceStatus) {
      errors.attendanceStatus = 'Status is required';
    }

    if (!attendance.employeeName.trim()) {
      errors.employeeName = 'Employee name is required';
    }

    if (!attendance.dateHired) {
    errors.dateHired = 'Date hired is required';
    } else if (normalizeDate(attendance.dateHired) > today) {
    errors.dateHired = 'Date hired cannot be in the future';
    }

    if (!attendance.department) {
      errors.department = 'Department is required';
    }

    if (!attendance.position) {
      errors.position = 'Position is required';
    }

    if (!attendance.attendanceDate) {
    errors.attendanceDate = 'Attendance date is required';
    } else if (normalizeDate(attendance.attendanceDate) > today) {
    errors.attendanceDate = 'Date cannot be in the future';
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
  };
};