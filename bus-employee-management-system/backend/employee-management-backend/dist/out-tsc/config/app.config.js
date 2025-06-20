"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        port: parseInt(process.env.PORT || '3001', 10),
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
            : [],
    }
});
//# sourceMappingURL=app.config.js.map