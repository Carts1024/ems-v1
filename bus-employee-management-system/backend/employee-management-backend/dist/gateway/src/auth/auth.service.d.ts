import { HttpService } from '@nestjs/axios';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    login(credentials: LoginDto): Promise<import("axios").AxiosResponse<any, LoginDto>>;
    verify(token: string): Promise<any>;
    firstResetPassword(employeeId: string, newPassword: string): Promise<any>;
    requestSecurityQuestion(email: string): Promise<any>;
    validateSecurityAnswer(email: string, answer: string): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<any>;
    logout(): Promise<any>;
}
