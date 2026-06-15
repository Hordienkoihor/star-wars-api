import {Planet} from "./model/planet.entity";
import {DataSource} from "typeorm";

export const platensProviders = [{
    provide: 'PLANET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Planet),
    inject: ['DATA_SOURCE'],
}]