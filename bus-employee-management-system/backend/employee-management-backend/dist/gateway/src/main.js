"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const allowedOrigins = configService.get('app.allowedOrigins') || [];
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    const port = configService.get('app.port') || 3002;
    await app.listen(port);
}
bootstrap().catch(err => {
    console.error('Failed to start the app:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map