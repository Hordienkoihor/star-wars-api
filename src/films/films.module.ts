import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";
import {peopleProviders} from "../people/people.providers";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [FilmsService, ...peopleProviders],
  controllers: [FilmsController]
})
export class FilmsModule {}
