import { useState, useEffect, useCallback } from 'react';
import { AttendanceResponse, Employee, AttendancePayload } from '@/types/attendance';
import { attendanceService, employeeService } from '@/services/attendanceService';
import { showSuccess, showError, showConfirmation } from '@/app/utils/swal';

export const useAttendance = () => {
  const [attendances, setAttendances] = useState<AttendanceResponse[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  // Load all employees for dropdown
  const loadEmployees = useCallback(async () => {
    try {
      const employeeList = await employeeService.getAllEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error('Failed to load employees:', error);
      showError('Error', 'Failed to load employees');
    }
  }, []);

  // Load attendance records
  const loadAttendances = useCallback(async (employeeId?: string) => {
    setLoading(true);
    try {
      let attendanceList: AttendanceResponse[];
      
      if (employeeId) {
        attendanceList = await attendanceService.getAttendancesByEmployee(employeeId);
      } else {
        attendanceList = await attendanceService.getAllAttendances();
      }
      
      setAttendances(attendanceList);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
      showError('Error', 'Failed to load attendance records');
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create attendance record
  const createAttendance = async (employeeId: string, attendanceData: AttendancePayload) => {
    try {
      const newAttendance = await attendanceService.createAttendance(employeeId, attendanceData);
      
      // Refresh the list
      if (selectedEmployeeId === employeeId || !selectedEmployeeId) {
        await loadAttendances(selectedEmployeeId || undefined);
      }
      
      showSuccess('Success', 'Attendance record created successfully');
      return newAttendance;
    } catch (error) {
      console.error('Failed to create attendance:', error);
      showError('Error', 'Failed to create attendance record');
      throw error;
    }
  };

  // Update attendance record
  const updateAttendance = async (employeeId: string, attendanceId: number, attendanceData: AttendancePayload) => {
    try {
      const updatedAttendance = await attendanceService.updateAttendance(
        employeeId,
        attendanceId,
        attendanceData
      );
      
      // Refresh the list
      await loadAttendances(selectedEmployeeId || undefined);
      
      showSuccess('Success', 'Attendance record updated successfully');
      return updatedAttendance;
    } catch (error) {
      console.error('Failed to update attendance:', error);
      showError('Error', 'Failed to update attendance record');
      throw error;
    }
  };

  // Delete attendance record
  const deleteAttendance = async (employeeId: string, attendanceId: number) => {
    try {
      const result = await showConfirmation(
        'Are you sure you want to delete this attendance record?'
      );
      
      if (result.isConfirmed) {
        await attendanceService.deleteAttendance(employeeId, attendanceId);
        
        // Refresh the list
        await loadAttendances(selectedEmployeeId || undefined);
        
        showSuccess('Success', 'Attendance record deleted successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      showError('Error', 'Failed to delete attendance record');
      throw error;
    }
  };

  // Filter attendances by employee
  const filterByEmployee = async (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    await loadAttendances(employeeId || undefined);
  };

  // Load initial data
  useEffect(() => {
    loadEmployees();
    loadAttendances();
  }, [loadEmployees, loadAttendances]);

  return {
    attendances,
    employees,
    loading,
    selectedEmployeeId,
    loadAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    filterByEmployee,
    refreshAttendances: () => loadAttendances(selectedEmployeeId || undefined),
  };
};
