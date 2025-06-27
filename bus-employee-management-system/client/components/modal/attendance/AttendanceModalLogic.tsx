'use client';

import { useState, useEffect } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';
import { Attendance, Employee, AttendancePayload } from '@/types/attendance';
import { attendanceService, employeeService } from '@/services/attendanceService';

export const useAttendanceModal = (
  onSubmit: (attendance: Attendance) => void,
  onClose: () => void,
  isView?: boolean,
  defaultValue?: Attendance,
) => {
  // Employee dropdown state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  const [attendance, setAttendance] = useState<Attendance>(
    defaultValue ?? {
      status: '',
      employeeName: '',
      employeeId: '',
      hiredate: '',
      department: '',
      position: '',
      date: '',
      timeIn: '',
      timeOut: '',
      remarks: '',
      isHoliday: false,
    }
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const employeeList = await employeeService.getAllEmployees();
        setEmployees(employeeList);
        
        // If editing, set the selected employee
        if (defaultValue?.employeeId) {
          setSelectedEmployeeId(defaultValue.employeeId);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
        showError('Error', 'Failed to load employees');
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [defaultValue?.employeeId]);

  // Update attendance when employee selection changes
  useEffect(() => {
    if (selectedEmployeeId) {
      const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
      if (selectedEmployee) {
        setAttendance(prev => ({
          ...prev,
          employeeId: selectedEmployee.id,
          employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
          hiredate: selectedEmployee.hiredate,
          department: selectedEmployee.position?.department?.departmentName || selectedEmployee.department || '',
          position: selectedEmployee.position?.positionName || selectedEmployee.positionName || '',
        }));
      }
    }
  }, [selectedEmployeeId, employees]);

  const handleChangeWrapper = (field: keyof Attendance, value: string | boolean) => {
    setAttendance((prev) => ({ ...prev, [field]: value }));

    // Clear error for the field being updated
    setFieldErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    // Clear employee-related errors
    setFieldErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.employeeName;
      delete newErrors.employeeId;
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

    if (!selectedEmployeeId) {
      errors.employeeId = 'Employee is required';
    }

    if (!attendance.date) {
      errors.date = 'Attendance date is required';
    } else if (normalizeDate(attendance.date) > today) {
      errors.date = 'Date cannot be in the future';
    }

    // Time validation only if both times are provided
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

  const convertToAttendancePayload = (attendance: Attendance): AttendancePayload => {
    // Convert date and times to ISO strings
    const attendanceDate = new Date(attendance.date);
    
    // For timeIn and timeOut, combine with the attendance date
    const timeInISO = attendance.timeIn 
      ? new Date(`${attendance.date}T${attendance.timeIn}:00.000Z`).toISOString()
      : new Date(attendanceDate.setHours(0, 0, 0, 0)).toISOString();
    
    const timeOutISO = attendance.timeOut 
      ? new Date(`${attendance.date}T${attendance.timeOut}:00.000Z`).toISOString()
      : new Date(attendanceDate.setHours(23, 59, 59, 999)).toISOString();

    return {
      date: new Date(attendance.date).toISOString(),
      status: attendance.status,
      timeIn: timeInISO,
      timeOut: timeOutISO,
      remarks: attendance.remarks || '',
      isHoliday: attendance.isHoliday || false,
    };
  };

  const handleSubmitWrapper = async () => {
    if (!validateFields()) return;

    try {
      const payload = convertToAttendancePayload(attendance);
      
      if (defaultValue?.id) {
        // Update existing attendance
        await attendanceService.updateAttendance(
          selectedEmployeeId,
          defaultValue.id,
          payload
        );
        showSuccess('Success', 'Attendance updated successfully.');
      } else {
        // Create new attendance
        await attendanceService.createAttendance(selectedEmployeeId, payload);
        showSuccess('Success', 'Attendance recorded successfully.');
      }
      
      onSubmit(attendance);
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      showError('Error', 'Failed to save attendance record');
    }
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
    employees,
    loadingEmployees,
    selectedEmployeeId,
    handleChangeWrapper,
    handleEmployeeChange,
    handleSubmitWrapper,
    handleExitClick,
    fullDateText,
    numericDateTime,
    isView,
    defaultValue,
  };
};