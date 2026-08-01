import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request} from '@nestjs/common';
import {CreateUserDto} from "../users/model/user.dto";
import {AuthService} from "./auth.service";
import {AuthGuard} from "./guard/auth.guard";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: CreateUserDto) {
        return this.authService.login(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('register')
    register(@Body() signInDto: CreateUserDto) {
        return this.userService.create(signInDto)
    }
}
