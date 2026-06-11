import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Species} from "../species/model/species.entity";
import {HttpService} from "@nestjs/axios";
import {Starship} from "./model/starship.entity";
import {CreateStarshipDto} from "./model/starship.dto";

@Injectable()
export class StarshipsService {
    constructor(@Inject('STARSHIP_REPOSITORY') private readonly starshipRepository: Repository<Starship>, private readonly httpService: HttpService) {
    }

    async add(starshipDto: CreateStarshipDto) {
        if (!starshipDto) {
            throw new BadRequestException("empty starship dto");
        }

        const starship = this.starshipRepository.create(starshipDto);
        return await this.starshipRepository.save(starship);
    }

    async get(id: number) {
        return await this.starshipRepository.findOneBy({
            id: id
        })
    }

    async getAll() {
        return await this.starshipRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.starshipRepository.find({
            skip: offset,
            take: limit,
        })
    }

    async update(id: number, starshipDto: CreateStarshipDto) {
        if (!starshipDto) {
            throw new BadRequestException("empty starship dto");
        }

        await this.starshipRepository.update(id, starshipDto);
        return await this.starshipRepository.findOneBy({id: id})
    }

    async delete(id: number) {
        return await this.starshipRepository.delete(id);
    }
}
