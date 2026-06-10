import {Planet} from "./model/planet.entity";

export const platensProviders = [{
    provide: 'PLANET_REPOSITORY',
    useFactory: (dataSource) => dataSource.getRepository(Planet),
    inject: ['DATA_SOURCE'],
}]