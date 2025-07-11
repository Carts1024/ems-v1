import { AuthService } from '../auth-ms.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly emailService;
    private readonly jwtService;
    constructor(authService: AuthService, emailService: EmailService, jwtService: JwtService);
    login(loginDto: LoginDto, res: Response, req: Request): Promise<{
        message: string;
        token: string;
        role: string;
    }>;
    verify(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    register(body: {
        employeeId: string;
        roleId: number;
        email: string;
        securityQuestionId: number;
        securityAnswer: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            employeeID: string;
            role: number;
            email: string;
            securityQuestion: number;
            securityAnswerHash: string;
            message: string;
        };
    }>;
    requestReset(body: {
        email: string;
    }): Promise<{
        securityQuestion: string;
    }>;
    validateSecurityAnswer(body: {
        email: string;
        answer: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    firstPasswordReset(body: {
        employeeId: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    logout(res: Response): {
        message: string;
    };
}
