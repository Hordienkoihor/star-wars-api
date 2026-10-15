import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Like, Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
import {Planet} from "./model/planet.entity";
import {CreatePlanetDto} from "./model/planet.dto";

@Injectable()
export class PlanetsService {
    constructor(@Inject('PLANET_REPOSITORY') private readonly planetRepository: Repository<Planet>, private readonly httpService: HttpService) {
    }

    async add(planetDto: CreatePlanetDto) {
        if (!planetDto) {
            throw new BadRequestException("empty planet dto");
        }

        const planet = this.planetRepository.create(this.unwrapDto(planetDto));

        return await this.planetRepository.save(planet);
    }

    async get(id: number) {
        return await this.planetRepository.findOne({
            where: {id},
            relations: {
                films: true,
            }
        })
    }

    async getByName(name: string, offset?: number, limit?: number) {
        return await this.planetRepository.find({
            where: {name: Like(`%${name}%`)},
            skip: offset ? offset : undefined,
            take: limit ? limit : undefined,
        })
    }

    async getByUrl(url: string) {
        return await this.planetRepository.findOne({where: {url}});
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

        const planet = this.planetRepository.create({
            id: id,
            ...this.unwrapDto(planetDto),
        });

        return await this.planetRepository.save(planet);
    }

    async delete(id: number) {
        return await this.planetRepository.delete(id);
    }

    unwrapDto(dto: CreatePlanetDto) {
        const {films, ...planetData} = dto;

        return {
            ...planetData,
            films: films ? films.map((id) => ({id: Number(id)})) : []
        }
    }

    mapPlanetToDto(planet: Planet) {
        const {films, ...planetData} = planet

        return {
        ...planetData,
            films: films ? films.map((f) => f.id) : []
        }
    }
}
