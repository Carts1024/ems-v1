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
const argon2 = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async validateUser(employeeId, password) {
        const user = await prisma.user.findUnique({
            where: { employeeId }
        });
        if (!user)
            return null;
        const passwordMatch = await argon2.verify(user.password, password);
        if (!passwordMatch)
            return null;
        if (user.mustChangePassword) {
            throw new common_1.ForbiddenException('Password must be changed');
        }
        const { password: pwd, ...result } = user;
        return result;
    }
    async getRole(user) {
        try {
            const role = await prisma.role.findUnique({
                where: { id: user.roleId },
                select: { name: true },
            });
            return role;
        }
        catch (error) {
            console.error('Error fetching roles:', error);
            throw new Error('Failed to fetch roles');
        }
    }
    login(user) {
        const payload = { employeeId: user.employeeId, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            role: user.roleId
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth-ms.service.js.map