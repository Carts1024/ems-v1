export interface Attendance {
  id?: number;
  status: '' | 'Present' | 'Absent' | 'Late';
  employeeName: string;
  employeeId?: string;
  hiredate: string;
  department: string;
  position: string;
  date: string;
  timeIn: string;
  timeOut: string;
  remarks: string;
  isHoliday?: boolean;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string; // YYYY-MM-DD format
  status: 'Present' | 'Absent' | 'Late';
  timeIn: string; // HH:MM format
  timeOut: string; // HH:MM format
  remarks: string;
  isHoliday: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  hiredate: string;
  position?: {
    positionName: string;
    department?: {
      departmentName: string;
    };
  };
  department?: string;
  positionName?: string;
}

export interface AttendancePayload {
  date: string; // ISO string
  status: string;
  timeIn: string; // ISO string
  timeOut: string; // ISO string
  remarks: string;
  isHoliday: boolean;
}

export interface AttendanceResponse {
  id: number;
  date: string;
  status: string;
  timeIn: string;
  timeOut: string;
  remarks: string;
  isHoliday: boolean;
  employeeId: string;
  employee?: Employee;
}
