import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Film} from "./model/film.entity";
import {HttpService} from "@nestjs/axios";
import {CreateFilmDto} from "./model/film.dto";

@Injectable()
export class FilmsService {
    constructor(@Inject('FILM_REPOSITORY') private readonly filmRepository: Repository<Film>, private readonly httpService: HttpService) {
    }

    async add(filmDto: CreateFilmDto) {
        if (!filmDto) {
            throw new BadRequestException("empty film dto");
        }

        const {characters, species, vehicles, starships, planets, ...filmData} = filmDto;

        const film = this.filmRepository.create({
            ...filmData,
            characters: characters ? characters.map((id) => ({id: Number(id)})) : [],
            species: species ? species.map((id) => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map((id) => ({id: Number(id)})) : [],
            planets: planets ? planets.map((id) => ({id: Number(id)})) : [],
        });
        return await this.filmRepository.save(film);
    }

    async get(id: number) {
        return await this.filmRepository.findOneBy({
            id: id
        })
    }

    async getAll() {
        return await this.filmRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.filmRepository.find({
            skip: offset,
            take: limit,
        })
    }

    async update(id: number, filmDto: CreateFilmDto) {
        if (!filmDto) {
            throw new BadRequestException("empty film dto");
        }

        const {characters, species, vehicles, starships, planets, ...filmData} = filmDto;

        const film = this.filmRepository.create({
            id: id,
            ...filmData,
            characters: characters ? characters.map((id) => ({id: Number(id)})) : [],
            species: species ? species.map((id) => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map((id) => ({id: Number(id)})) : [],
            planets: planets ? planets.map((id) => ({id: Number(id)})) : [],
        });

        await this.filmRepository.update(id, film);
        return await this.filmRepository.findOneBy({id: id})
    }

    async delete(id: number) {
        return await this.filmRepository.delete(id);
    }
}
