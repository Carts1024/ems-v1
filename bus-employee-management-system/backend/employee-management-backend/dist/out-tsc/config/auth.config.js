"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        authServiceUrl: process.env.AUTH_SERVICE_URL,
    }
});
//# sourceMappingURL=auth.config.js.map