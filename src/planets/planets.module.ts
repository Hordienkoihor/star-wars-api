import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';

@Module({
  providers: [PlanetsService],
  controllers: [PlanetsController]
})
export class PlanetsModule {}
