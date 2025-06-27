import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
export declare class AuthController {
    private readonly authService;
    private readonly httpService;
    private HR_SERVICE_URL;
    private AUTH_SERVICE_URL;
    constructor(authService: AuthService, httpService: HttpService);
    login(credentials: LoginDto, res: Response): Promise<void>;
    register(body: any): Promise<any>;
    firstResetPassword(body: {
        employeeNumber: string;
        newPassword: string;
    }): Promise<any>;
    verify(authHeader: string): Promise<any>;
    requestSecurityQuestion(email: string): Promise<any>;
    validateSecurityAnswer(body: {
        email: string;
        answer: string;
    }): Promise<any>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<any>;
    logout(res: Response): void;
}
