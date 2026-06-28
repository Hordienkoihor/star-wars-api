import {BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "./model/user.entity";
import {CreateUserDto} from "./model/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    private readonly saltOrRounds = 10;

    constructor(@Inject('USER_REPOSITORY') private readonly userRepository: Repository<User>) {
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const hashedPassword =  await bcrypt.hash(createUserDto.password, this.saltOrRounds);

            const user = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            }

            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}
