import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
import {Planet} from "./model/planet.entity";
import {CreatePlanetDto} from "./model/planet.dto";

@Injectable()
export class PlanetsService {
    constructor(@Inject('PLATEN_REPOSITORY') private readonly planetRepository: Repository<Planet>, private readonly httpService: HttpService) {
    }

    async add(planetDto: CreatePlanetDto) {
        if (!planetDto) {
            throw new BadRequestException("empty planet dto");
        }

        const planet = this.planetRepository.create(planetDto);
        return await this.planetRepository.save(planet);
    }

    async get(id: number) {
        return await this.planetRepository.findOneBy({
            id: id
        })
    }

    async getAll() {
        return await this.planetRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.planetRepository.find({
            skip: offset,
            take: limit,
        })
    }

    async update(id: number, planetDto: CreatePlanetDto) {
        if (!planetDto) {
            throw new BadRequestException("empty planet dto");
        }

        await this.planetRepository.update(id, planetDto);
        return await this.planetRepository.findOneBy({id: id})
    }

    async delete(id: number) {
        return await this.planetRepository.delete(id);
    }
}
