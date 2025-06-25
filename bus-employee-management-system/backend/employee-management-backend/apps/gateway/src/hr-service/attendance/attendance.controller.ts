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

  // GLOBAL ATTENDANCE ENDPOINTS

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(Number(id));
  }

  @Post()
  create(@Body() payload: any) {
    return this.attendanceService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: any) {
    return this.attendanceService.update(Number(id), payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(Number(id));
  }

  // EMPLOYEE-CENTRIC ATTENDANCE ENDPOINTS

  @Get('employee/:employeeId')
  getAttendancesByEmployee(@Param('employeeId') employeeId: string) {
    return this.attendanceService.getAttendancesByEmployee(employeeId);
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

  @Get('employee/:employeeId/:id')
  getAttendanceOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id') id: string,
  ) {
    return this.attendanceService.getAttendanceOfEmployee(
      employeeId,
      Number(id),
    );
  }

  @Put('employee/:employeeId/:id')
  updateAttendanceOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id') id: string,
    @Body() payload: any,
  ) {
    return this.attendanceService.updateAttendanceOfEmployee(
      employeeId,
      Number(id),
      payload,
    );
  }

  @Delete('employee/:employeeId/:id')
  deleteAttendanceOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id') id: string,
  ) {
    return this.attendanceService.deleteAttendanceOfEmployee(
      employeeId,
      Number(id),
    );
  }
}
