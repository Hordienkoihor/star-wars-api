import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, ConfigModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('SECRET'),
    })

  })],

})
export class AuthModule {}
