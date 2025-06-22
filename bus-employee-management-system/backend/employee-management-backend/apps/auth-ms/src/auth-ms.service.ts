/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();
@Injectable()
export class AuthService{

  constructor(private readonly jwtService: JwtService) {}

  async validateUser( employeeId: string, password: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { employeeId }
    });
    if (!user) return null;

    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) return null;

    if (user.mustChangePassword) {
      throw new ForbiddenException('Password must be changed');
    }

    const { password: pwd, ...result } = user;
    return result;

  }

  async getRole(user:any) {
    try {
      const role = await prisma.role.findUnique({
        where: { id: user.roleId },
        select: { name: true },

      });
      return role;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }

  login(user: any) {

    const payload = { employeeId: user.employeeId, sub: user.id};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}