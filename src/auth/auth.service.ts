import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../users/model/user.dto";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && pass && bcrypt.compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: CreateUserDto) {
        const validatedUser = this.validateUser(user.username, user.password);

        if (!validatedUser) {
            throw new UnauthorizedException("Invalid Credentials");
        }

        const payload = {username: user.username, password: user.password};
        return {
            accessToken: this.jwtService.sign(payload, {expiresIn: '6h'}),
        }
    }
}
