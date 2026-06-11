import {Module} from '@nestjs/common';
import {VehiclesService} from './vehicles.service';
import {VehiclesController} from './vehicles.controller';
import {vehiclesProviders} from "./vehicles.providers";
import {HttpModule} from "@nestjs/axios";
import {DatabaseModule} from "../database/database.module";

@Module({
    imports: [DatabaseModule, HttpModule],
    providers: [VehiclesService, ...vehiclesProviders],
    controllers: [VehiclesController]
})
export class VehiclesModule {
}
