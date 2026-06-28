import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {CreateUserDto} from "../users/model/user.dto";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: CreateUserDto) {
        return this.authService.singIn(signInDto.username, signInDto.password);
    }
}
