import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsString, IsStrongPassword} from "class-validator";
import {Role} from "./role.enum";
import {Type, TypeHelpOptions} from "class-transformer";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    // @IsStrongPassword()
    password: string;

    @ApiProperty({enum: Role})
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}