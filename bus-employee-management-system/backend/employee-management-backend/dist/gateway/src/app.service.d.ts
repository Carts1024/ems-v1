import { ClientProxy } from '@nestjs/microservices';
export declare class AppService {
    private readonly authClient;
    constructor(authClient: ClientProxy);
    pingAuth(): Promise<string>;
}
