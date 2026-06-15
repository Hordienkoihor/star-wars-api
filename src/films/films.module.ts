import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";
import {filmsProviders} from "./films.providers";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [FilmsService, ...filmsProviders],
  controllers: [FilmsController]
})
export class FilmsModule {}
