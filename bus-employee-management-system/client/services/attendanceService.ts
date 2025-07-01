const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  employee?: {
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
  };
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
}

// Attendance CRUD operations
export const attendanceService = {
  // Get all attendance records for a specific employee
  async getAttendancesByEmployee(employeeId: string): Promise<AttendanceResponse[]> {
    const response = await fetch(`${API_URL}/attendance/employee/${employeeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch attendance records');
    return response.json();
  },

  // Get all attendance records (admin view)
  async getAllAttendances(): Promise<AttendanceResponse[]> {
    const response = await fetch(`${API_URL}/attendance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch all attendance records');
    return response.json();
  },

  // Create attendance record for an employee
  async createAttendance(employeeId: string, payload: AttendancePayload): Promise<AttendanceResponse> {
    const response = await fetch(`${API_URL}/attendance/employee/${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to create attendance record');
    return response.json();
  },

  // Update attendance record
  async updateAttendance(
    employeeId: string,
    attendanceId: number,
    payload: AttendancePayload
  ): Promise<AttendanceResponse> {
    const response = await fetch(`${API_URL}/attendance/employee/${employeeId}/${attendanceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update attendance record');
    return response.json();
  },

  // Delete attendance record
  async deleteAttendance(employeeId: string, attendanceId: number): Promise<void> {
    const response = await fetch(`${API_URL}/attendance/employee/${employeeId}/${attendanceId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete attendance record');
  },

  // Get single attendance record
  async getAttendance(employeeId: string, attendanceId: number): Promise<AttendanceResponse> {
    const response = await fetch(`${API_URL}/attendance/employee/${employeeId}/${attendanceId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch attendance record');
    return response.json();
  },
};

// Employee service for dropdown
export const employeeService = {
  // Get all employees for dropdown
  async getAllEmployees(): Promise<Employee[]> {
    const response = await fetch(`${API_URL}/employees`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  // Get employee by ID
  async getEmployeeById(employeeId: string): Promise<Employee> {
    const response = await fetch(`${API_URL}/employees/${employeeId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },
};
