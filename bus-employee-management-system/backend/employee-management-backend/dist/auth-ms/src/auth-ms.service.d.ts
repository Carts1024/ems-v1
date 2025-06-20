import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    validateUser(roleId: number, employeeId: string, password: string): Promise<any>;
    login(user: any): {
        access_token: string;
    };
}
