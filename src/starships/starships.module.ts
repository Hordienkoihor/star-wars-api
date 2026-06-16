import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import {starshipProviders} from "./starship.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [StarshipsService, ...starshipProviders],
  controllers: [StarshipsController],
  exports: [StarshipsService],
})
export class StarshipsModule {}
