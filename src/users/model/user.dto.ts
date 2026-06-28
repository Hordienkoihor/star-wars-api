import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsStrongPassword} from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}