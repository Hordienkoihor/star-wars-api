import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Planet} from "../planets/model/planet.entity";
import {HttpService} from "@nestjs/axios";
import {CreatePlanetDto} from "../planets/model/planet.dto";
import {Species} from "./model/species.entity";
import {CreateSpeciesDto} from "./model/species.dto";

@Injectable()
export class SpeciesService {
    constructor(@Inject('SPECIES_REPOSITORY') private readonly speciesRepository: Repository<Species>, private readonly httpService: HttpService) {
    }

    async add(speciesDto: CreateSpeciesDto) {
        if (!speciesDto) {
            throw new BadRequestException("empty species dto");
        }

        const {films, people, homeworld, ...speciesData} = speciesDto;

        const species = this.speciesRepository.create({
            ...speciesData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            people: people ? people.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });
        return await this.speciesRepository.save(species);
    }

    async get(id: number) {
        return await this.speciesRepository.findOne({
            where: {id},
            relations: {
                people: true,
                films: true,
            }
        })
    }

    async getByName(name: string) {
        return await this.speciesRepository.findOne({where: {name}});
    }

    async getByUrl(url: string) {
        return await this.speciesRepository.findOne({where: {url}});
    }

    async getAll() {
        return await this.speciesRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.speciesRepository.find({
            skip: offset,
            take: limit,
            relations: {
                people: true,
                films: true,
            }
        })
    }

    async update(id: number, speciesDto: CreateSpeciesDto) {
        if (!speciesDto) {
            throw new BadRequestException("empty species dto");
        }

        const {films, people, homeworld, ...speciesData} = speciesDto;

        const species = this.speciesRepository.create({
            id: id,
            ...speciesData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            people: people ? people.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });

        return await this.speciesRepository.save(species);

    }

    async delete(id: number) {
        return await this.speciesRepository.delete(id);
    }
}
