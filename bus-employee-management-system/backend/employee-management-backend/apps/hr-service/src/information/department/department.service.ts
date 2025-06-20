/* eslint-disable prettier/prettier */
// hr-service/src/information/department/department.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DepartmentService {
  async getAllDepartmentsWithCount() {
    return prisma.department.findMany({
      include: {
        _count: { select: { employee: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createDepartment(departmentName: string) {
    return prisma.department.create({
      data: { departmentName },
    });
  }

  async updateDepartment(id: number, departmentName: string) {
    const updated = await prisma.department.update({
      where: { id },
      data: { departmentName },
    });
    if (!updated) throw new NotFoundException('Department not found');
    return updated;
  }

  async deleteDepartment(id: number) {
    // Optional: Prevent deletion if employees exist
    const dept = await prisma.department.findUnique({ where: { id }, include: { employee: true } });
    if (dept && dept.employee.length > 0) {
      throw new Error('Cannot delete a department that has employees.');
    }
    return prisma.department.delete({ where: { id } });
  }
}
