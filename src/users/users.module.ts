import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {usersProviders} from "./users.providers";
import {DatabaseModule} from "../database/database.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService]

})
export class UsersModule {}
