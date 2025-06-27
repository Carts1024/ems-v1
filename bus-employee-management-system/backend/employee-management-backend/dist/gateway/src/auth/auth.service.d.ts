import { HttpService } from '@nestjs/axios';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    login(credentials: LoginDto): Promise<import("axios").AxiosResponse<any, LoginDto>>;
    verify(token: string): Promise<any>;
    firstResetPassword(employeeNumber: string, newPassword: string): Promise<any>;
    requestSecurityQuestion(email: string): Promise<any>;
    validateSecurityAnswer(email: string, answer: string): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<any>;
    logout(): Promise<any>;
}
