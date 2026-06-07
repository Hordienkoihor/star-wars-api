import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';

@Module({
  providers: [StarshipsService],
  controllers: [StarshipsController]
})
export class StarshipsModule {}
