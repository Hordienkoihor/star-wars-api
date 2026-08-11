import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import {platensProviders} from "./platens.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";
import {FilesModule} from "../files/files.module";

@Module({
  imports: [DatabaseModule, HttpModule, FilesModule],
  providers: [PlanetsService, ...platensProviders],
  controllers: [PlanetsController],
  exports: [PlanetsService],
})
export class PlanetsModule {}
