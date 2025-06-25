// apps/gateway/src/attendance/attendance.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }

  @Get(':id')
  getAttendanceById(@Param('id') id: string) {
    return this.attendanceService.getAttendanceById(Number(id));
  }

  @Get('employee/:employeeId')
  getAttendancesByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getAttendancesByEmployee(employeeId);
  }

  @Post()
  createAttendance(@Body() payload: any) {
    return this.attendanceService.createAttendance(payload);
  }

  @Post('employee/:employeeId')
  createAttendanceForEmployee(
    @Param('employeeId') employeeId: string,
    @Body() payload: any,
  ) {
    return this.attendanceService.createAttendanceForEmployee(
      employeeId,
      payload,
    );
  }

  @Put(':id')
  updateAttendance(@Param('id') id: string, @Body() payload: any) {
    return this.attendanceService.updateAttendance(Number(id), payload);
  }

  @Delete(':id')
  deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(Number(id));
  }
}
