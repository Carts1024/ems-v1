import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AttendanceService {
  constructor(private readonly httpService: HttpService) {}

  // Get all attendances
  async getAllAttendances() {
    const { data } = await this.httpService.get('/attendance').toPromise();
    return data;
  }

  // Get attendance by id
  async getAttendanceById(id: number) {
    try {
      const { data } = await this.httpService.get(`/attendance/${id}`).toPromise();
      return data;
    } catch (err) {
      throw new NotFoundException('Attendance not found');
    }
  }

  // Get attendances by employeeId
  async getAttendancesByEmployee(employeeId: string) {
    const { data } = await this.httpService.get(`/attendance/employee/${employeeId}`).toPromise();
    return data;
  }

  // Create attendance (global)
  async createAttendance(payload: any) {
    const { data } = await this.httpService.post('/attendance', payload).toPromise();
    return data;
  }

  // Create attendance for employee (employee-centric endpoint)
  async createAttendanceForEmployee(employeeId: string, payload: any) {
    const { data } = await this.httpService.post(`/attendance/employee/${employeeId}`, payload).toPromise();
    return data;
  }

  // Update attendance
  async updateAttendance(id: number, payload: any) {
    const { data } = await this.httpService.put(`/attendance/${id}`, payload).toPromise();
    return data;
  }

  // Delete attendance
  async deleteAttendance(id: number) {
    const { data } = await this.httpService.delete(`/attendance/${id}`).toPromise();
    return data;
  }
}