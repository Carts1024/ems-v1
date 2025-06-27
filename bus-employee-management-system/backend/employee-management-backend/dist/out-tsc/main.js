"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    await app.listen(3001);
}
bootstrap().catch(err => {
    console.error('Failed to start the app:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map