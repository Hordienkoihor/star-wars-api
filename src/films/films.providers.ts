import {DataSource} from "typeorm";
import {Film} from "./model/film.entity";

export const filmsProviders = [{
    provide: 'FILM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Film),
    inject: ['DATA_SOURCE'],
}]
