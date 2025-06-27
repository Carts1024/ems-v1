/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';


@Controller('auth')
export class AuthController {
  private HR_SERVICE_URL = process.env.HR_SERVICE_URL || 'http://localhost:4002';
  private AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService
  ) {}

  @Post('login')
  async login(@Body() credentials: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(credentials);

    // Check if response and headers exist before accessing set-cookie
    if (response && response.headers && response.headers['set-cookie']) {
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }

    // Forward status and data
    res.status(response.status).json(response.data);
  }

  @Post('register')
  async register(@Body() body: any) {
    const {
      employeeNumber,
      firstName,
      lastName,
      birthdate,
      hiredate,
      phone,
      barangay,
      zipCode,
      positionId, // <- Use positionId instead of departmentId
      // ...user fields:
      email,
      roleId,
      securityQuestionId,
      securityAnswer,
    } = body;

    // 1. Check if employee exists by employeeNumber
    let employee;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`${this.HR_SERVICE_URL}/employees/by-number/${employeeNumber}`)
      );
      employee = res.data;
    } catch (e) {
      // 2. If not found, create the employee
      const res = await firstValueFrom(
        this.httpService.post(`${this.HR_SERVICE_URL}/employees`, {
          employeeNumber,
          firstName,
          lastName,
          birthdate,
          hiredate,
          phone,
          barangay,
          zipCode,
          positionId, // <-- Change here
        })
      );
      employee = res.data;
    }

    if (!employee?.id) throw new BadRequestException('Could not create or fetch employee');

    // 3. Register the user in Auth MS (linking by employee.id)
    const userRes = await firstValueFrom(
      this.httpService.post(`${this.AUTH_SERVICE_URL}/auth/register`, {
        employeeId: employee.id,
        email,
        roleId,
        securityQuestionId,
        securityAnswer,
        firstName, // For welcome email only
        employeeNumber, // For welcome email only
      })
    );

    return userRes.data;
  }


  @Post('first-password-reset')
  async firstResetPassword(@Body() body: { employeeNumber: string; newPassword: string }) {
    const { employeeNumber, newPassword } = body;
    if (!employeeNumber || !newPassword) {
      throw new Error('Employee Number and new password are required');
    }
    return this.authService.firstResetPassword(employeeNumber, newPassword);
  }

  @Post('verify')
  async verify(@Headers('authorization') authHeader: string) {
    // authHeader looks like "Bearer <token>"
    if (!authHeader) {
      throw new BadRequestException('Missing Authorization header');
    }
    const token = authHeader.split(' ')[1]; // Get the token part

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    return this.authService.verify(token);
  }

  @Post('request-security-question')
  async requestSecurityQuestion(@Body('email') email: string) {
    return this.authService.requestSecurityQuestion(email);
  }
  
  @Post('validate-security-answer')
  async validateSecurityAnswer(@Body() body: { email: string; answer: string }) {
    return this.authService.validateSecurityAnswer(body.email, body.answer);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    // Just clear the cookie right here!
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in prod, false in dev
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 0,
      // Do NOT set domain unless you set it when creating the cookie
    });
    res.status(200).json({ message: 'Logged out' });
  }
}
