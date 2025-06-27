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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.STMP_USER,
                pass: process.env.STMP_PASS,
            },
        });
    }
    async sendResetEmail(to, token) {
        const baseUrl = process.env.ALLOWED_ORIGINS;
        const resetLink = `${baseUrl}/authentication/new-password?token=${token}`;
        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`,
            to,
            subject: 'Reset your Agila Bus Transport Corporation Password',
            html: `<p>Click the link below to reset your password. This will expire soon:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });
    }
    async sendWelcomeEmail(to, employeeId, password, firstName) {
        await this.transporter.sendMail({
            from: `"Agila Bus Transport Corporation" <${process.env.STMP_USER}>`,
            to,
            subject: 'Welcome to Agila Bus Transport Corporation',
            html: `<p>Welcome to Agila Bus Transport Corporation <strong>${firstName}</strong>!</p>
                   <p>Your Employee ID is: <strong>${employeeId}</strong></p>
                   <p>Your temporary password is: <strong>${password}</strong></p>
                   <p>Please change your password after logging in.</p>`,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map