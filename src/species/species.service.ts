import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Like, Repository} from "typeorm";
import {HttpService} from "@nestjs/axios";
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

        const species = this.speciesRepository.create(this.unwrapDto(speciesDto));
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

    async search(name: string, offset?: number, limit?: number) {
        return await this.speciesRepository.find({
            where: {name: Like(`%${name}%`)},
            skip: offset ? offset : 0,
            take: limit ? limit : 0,
        });
    }

    async getByName(name: string) {
        return await this.speciesRepository.findOne({where: {name}})
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

        const species = this.speciesRepository.create({
            id: id,
            ...this.unwrapDto(speciesDto),
        });

        return await this.speciesRepository.save(species);

    }

    async delete(id: number) {
        return await this.speciesRepository.delete(id);
    }

    mapSpeciesToDto(species: Species) {
        const {films, people, homeworld, ...speciesData} = species;

        return {
            ...speciesData,
            homeworld: homeworld ? homeworld.id : null,
            films: films ? films.map((f) => f.id) : [],
            people: people ? people.map((p) => p.id) : []
        }
    }

    unwrapDto(dto: CreateSpeciesDto) {
        const {films, people, homeworld, ...speciesData} = dto;

        return {
            ...speciesData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            people: people ? people.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        }
    }

}
