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

        const {pilots, films, ...starshipData} = starshipDto;

        const starship = this.starshipRepository.create({
            ...starshipData,
            pilots: pilots ? pilots.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });
        return await this.starshipRepository.save(starship);
    }

    async get(id: number) {
        return await this.starshipRepository.findOne({
            where: {id},
            relations: {
                pilots: true,
                films: true,
            }
        })
    }

    async getByUrl(url: string) {
        return await this.starshipRepository.findOne({where: {url}});
    }

    async getAll() {
        return await this.starshipRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.starshipRepository.find({
            skip: offset,
            take: limit,
            relations: {
                pilots: true,
                films: true,
            }
        })
    }

    async update(id: number, starshipDto: CreateStarshipDto) {
        if (!starshipDto) {
            throw new BadRequestException("empty starship dto");
        }

        const {pilots, films, ...starshipData} = starshipDto;

        const starship = this.starshipRepository.create({
            id: id,
            ...starshipData,
            pilots: pilots ? pilots.map((id) => ({id: Number(id)})) : [],
            films: films ? films.map((id) => ({id: Number(id)})) : [],
        });


        return await this.starshipRepository.save(starship);
    }

    async delete(id: number) {
        return await this.starshipRepository.delete(id);
    }
}
