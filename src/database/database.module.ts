import {Module} from "@nestjs/common";
import {databaseProviders} from "./database.providers";
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [ConfigModule],
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}