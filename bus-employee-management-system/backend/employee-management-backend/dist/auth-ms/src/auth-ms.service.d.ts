import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    validateUser(employeeId: string, password: string): Promise<any>;
    getRole(user: any): Promise<{
        name: string;
    } | null>;
    login(user: any): {
        access_token: string;
        role: any;
    };
}
