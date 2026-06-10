import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import {platensProviders} from "./platens.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [PlanetsService, ...platensProviders],
  controllers: [PlanetsController]
})
export class PlanetsModule {}
