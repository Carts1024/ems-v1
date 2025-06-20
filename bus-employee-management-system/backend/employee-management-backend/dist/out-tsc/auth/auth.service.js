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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async login(credentials) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/login`, credentials, {
                withCredentials: true,
            }));
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verify(token) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async firstResetPassword(employeeId, newPassword) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/first-password-reset`, {
                employeeId,
                newPassword,
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async requestSecurityQuestion(email) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/request-security-question`, { email }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateSecurityAnswer(email, answer) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/validate-security-answer`, { email, answer }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/reset-password`, {
                token,
                newPassword,
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async logout() {
        try {
            const authServiceUrl = this.configService.get('auth.authServiceUrl');
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${authServiceUrl}/auth/logout`, {}, {
                withCredentials: true,
            }));
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(error?.response?.data || 'Auth Service Error', error?.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService, config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map