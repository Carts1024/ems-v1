"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const enums_1 = require("@nestjs/microservices/enums");
const auth_ms_module_1 = require("./auth-ms.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_ms_module_1.AuthMsModule);
    app.connectMicroservice({
        transport: enums_1.Transport.TCP,
        options: {
            host: '127.0.0.1',
            port: 4003,
        },
    });
    await app.startAllMicroservices();
    const port = process.env.PORT ? Number(process.env.PORT) : 4000;
    await app.listen(port);
}
bootstrap().catch(err => {
    console.error('Microservice failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map