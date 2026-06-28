import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) {}

    async singIn(username: string, userPassword: string) {
        const user = await this.usersService.findOne(username);

        if (!bcrypt.compareSync(userPassword, user?.password)) {
            throw new UnauthorizedException();
        }

        const payload = {sub: user.id, username: user.username};


        return {
            accessToken: this.jwtService.signAsync(payload),
        };
    }
}
