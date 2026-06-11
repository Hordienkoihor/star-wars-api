import {DataSource} from "typeorm";
import {Vehicle} from "./model/vehicle.entity";

export const vehiclesProviders = [{
    provide: 'VEHICLES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehicle),
    inject: ['DATA_SOURCE'],
}]