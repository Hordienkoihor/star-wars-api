import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import {speciesProviders} from "./species.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [SpeciesService, ...speciesProviders],
  controllers: [SpeciesController]
})
export class SpeciesModule {}
