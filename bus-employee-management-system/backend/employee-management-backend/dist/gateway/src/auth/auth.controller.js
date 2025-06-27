"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthController = class AuthController {
    authService;
    httpService;
    HR_SERVICE_URL = process.env.HR_SERVICE_URL || 'http://localhost:4002';
    AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
    constructor(authService, httpService) {
        this.authService = authService;
        this.httpService = httpService;
    }
    async login(credentials, res) {
        const response = await this.authService.login(credentials);
        if (response && response.headers && response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
        }
        res.status(response.status).json(response.data);
    }
    async register(body) {
        const { employeeNumber, firstName, lastName, birthdate, hiredate, phone, barangay, zipCode, positionId, email, roleId, securityQuestionId, securityAnswer, } = body;
        let employee;
        try {
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.HR_SERVICE_URL}/employees/by-number/${employeeNumber}`));
            employee = res.data;
        }
        catch (e) {
            const res = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.HR_SERVICE_URL}/employees`, {
                employeeNumber,
                firstName,
                lastName,
                birthdate,
                hiredate,
                phone,
                barangay,
                zipCode,
                positionId,
            }));
            employee = res.data;
        }
        if (!employee?.id)
            throw new common_1.BadRequestException('Could not create or fetch employee');
        const userRes = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.AUTH_SERVICE_URL}/auth/register`, {
            employeeId: employee.id,
            email,
            roleId,
            securityQuestionId,
            securityAnswer,
            firstName,
            employeeNumber,
        }));
        return userRes.data;
    }
    async firstResetPassword(body) {
        const { employeeNumber, newPassword } = body;
        if (!employeeNumber || !newPassword) {
            throw new Error('Employee Number and new password are required');
        }
        return this.authService.firstResetPassword(employeeNumber, newPassword);
    }
    async verify(authHeader) {
        if (!authHeader) {
            throw new common_1.BadRequestException('Missing Authorization header');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new common_1.BadRequestException('No token provided');
        }
        return this.authService.verify(token);
    }
    async requestSecurityQuestion(email) {
        return this.authService.requestSecurityQuestion(email);
    }
    async validateSecurityAnswer(body) {
        return this.authService.validateSecurityAnswer(body.email, body.answer);
    }
    async resetPassword(body) {
        const { token, newPassword } = body;
        if (!token || !newPassword) {
            throw new Error('Token and new password are required');
        }
        return this.authService.resetPassword(token, newPassword);
    }
    logout(res) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 0,
        });
        res.status(200).json({ message: 'Logged out' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('first-password-reset'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "firstResetPassword", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('request-security-question'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestSecurityQuestion", null);
__decorate([
    (0, common_1.Post)('validate-security-answer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validateSecurityAnswer", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        axios_1.HttpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map