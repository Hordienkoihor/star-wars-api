import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SeederService } from './seeder.service';
import { FilmsModule } from '../films/films.module';
import { PeopleModule } from '../people/people.module';
import { PlanetsModule } from '../planets/planets.module';
import { SpeciesModule } from '../species/species.module';
import { StarshipsModule } from '../starships/starships.module';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
    imports: [
        HttpModule,
        FilmsModule,
        PeopleModule,
        PlanetsModule,
        SpeciesModule,
        StarshipsModule,
        VehiclesModule,
    ],
    providers: [SeederService],
})
export class SeedModule {}