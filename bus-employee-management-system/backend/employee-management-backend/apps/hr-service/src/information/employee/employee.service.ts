/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EmployeeService {
  async findByEmployeeNumber(employeeNumber: string) {
    return prisma.employee.findUnique({
      where: { employeeNumber },
    });
  }

  async create(data: any) {
    const exists = await prisma.employee.findUnique({
      where: { employeeNumber: data.employeeNumber },
    });
    if (exists) {
      throw new Error('Employee with this employeeNumber already exists.');
    }
    return prisma.employee.create({ data });
  }

  async findById(id: string) {
    return prisma.employee.findUnique({ where: { id } });
  // or if using a local prisma, just:
  // return prisma.employee.findUnique({ where: { id } });
  }
}
