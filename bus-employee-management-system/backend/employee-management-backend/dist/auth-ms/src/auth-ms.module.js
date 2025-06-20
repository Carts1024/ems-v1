"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_ms_service_1 = require("./auth-ms.service");
const auth_controller_1 = require("./auth/auth.controller");
const jwt_strategy_1 = require("./auth/jwt.strategy");
const email_module_1 = require("./email/email.module");
const roles_controller_1 = require("./roles/roles.controller");
let AuthMsModule = class AuthMsModule {
};
exports.AuthMsModule = AuthMsModule;
exports.AuthMsModule = AuthMsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            email_module_1.EmailModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/auth-ms/.env' }),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => {
                    const secret = config.get('JWT_SECRET');
                    const expiresIn = config.get('JWT_EXPIRATION');
                    if (!secret) {
                        throw new Error('JWT_SECRET is not defined in .env');
                    }
                    return {
                        secret,
                        signOptions: { expiresIn: expiresIn || '1h' },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController, roles_controller_1.RolesController],
        providers: [auth_ms_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    })
], AuthMsModule);
//# sourceMappingURL=auth-ms.module.js.map