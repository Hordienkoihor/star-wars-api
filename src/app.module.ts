import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PeopleModule} from "./people/people.module";
import {FilmsModule} from './films/films.module';
import {PlanetsModule} from './planets/planets.module';
import {SpeciesModule} from './species/species.module';
import {StarshipsModule} from './starships/starships.module';
import {VehiclesModule} from './vehicles/vehicles.module';
import {SeedModule} from "./seeder/seeder.module";
import {FilesModule} from './files/files.module';
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        PeopleModule,
        FilmsModule,
        PlanetsModule,
        SpeciesModule,
        StarshipsModule,
        VehiclesModule,
        SeedModule,
        FilesModule,
        ConfigModule.forRoot({
            envFilePath: '.development.env'
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
