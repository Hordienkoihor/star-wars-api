import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Planet} from "../planets/model/planet.entity";
import {HttpService} from "@nestjs/axios";
import {CreatePlanetDto} from "../planets/model/planet.dto";
import {Species} from "./model/species.entity";
import {CreateStarshipDto} from "./model/species.dto";

@Injectable()
export class SpeciesService {
    constructor(@Inject('SPECIES_REPOSITORY') private readonly speciesRepository: Repository<Species>, private readonly httpService: HttpService) {
    }

    async add(speciesDto: CreateStarshipDto) {
        if (!speciesDto) {
            throw new BadRequestException("empty species dto");
        }

        const {films, people, ...speciesData} = speciesDto;

        const species = this.speciesRepository.create({
            ...speciesData,
            people: people ? people.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });
        return await this.speciesRepository.save(species);
    }

    async get(id: number) {
        return await this.speciesRepository.findOneBy({
            id: id
        })
    }

    async getAll() {
        return await this.speciesRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.speciesRepository.find({
            skip: offset,
            take: limit,
        })
    }

    async update(id: number, speciesDto: CreateStarshipDto) {
        if (!speciesDto) {
            throw new BadRequestException("empty species dto");
        }

        const {films, people, ...speciesData} = speciesDto;

        const species = this.speciesRepository.create({
            id: id,
            ...speciesData,
            people: people ? people.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });

        await this.speciesRepository.update(id, species);
        return await this.speciesRepository.findOneBy({id: id})
    }

    async delete(id: number) {
        return await this.speciesRepository.delete(id);
    }
}
