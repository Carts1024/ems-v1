import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class RolesController {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getRoles(): Promise<any>;
}
