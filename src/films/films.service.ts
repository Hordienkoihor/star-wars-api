import {BadRequestException, Inject, Injectable, UnprocessableEntityException} from '@nestjs/common';
import {Like, Repository} from "typeorm";
import {Film} from "./model/film.entity";
import {CreateFilmDto} from "./model/film.dto";

@Injectable()
export class FilmsService {
    constructor(
        @Inject('FILM_REPOSITORY') private readonly filmRepository: Repository<Film>) {
    }

    async add(filmDto: CreateFilmDto) {
        if (!filmDto) {
            throw new BadRequestException("empty film dto");
        }

        const film = this.filmRepository.create(this.unwrapDto(filmDto));
        return await this.filmRepository.save(film);
    }

    async findById(id: number) {
        return await this.filmRepository.findOne({
            where: {id},
            relations: {
                characters: true,
                species: true,
                vehicles: true,
                starships: true,
                planets: true,
            }
        })
    }

    async findByIdOrFail(id: number) {
        return await this.filmRepository.findOneOrFail({
            where: {id},
            relations: {
                characters: true,
                species: true,
                vehicles: true,
                starships: true,
                planets: true,
            }
        })
    }

    async search(title: string, offset?: number, limit?: number) {
        return await this.filmRepository.find({
            where: {title: Like(`%${title}%`)},
            skip: offset ? offset : undefined,
            take: limit ? limit : undefined,
        });
    }

    async getByTitle(title: string) {
        return await this.filmRepository.findOne({where: {title}})
    }


    async getByUrl(url: string) {
        return await this.filmRepository.findOne({where: {url}});
    }

    async getAll() {
        return await this.filmRepository.find();
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.filmRepository.find({
            skip: offset,
            take: limit,
            relations: {
                characters: true,
                species: true,
                vehicles: true,
                starships: true,
                planets: true,
            }
        })
    }

    async update(id: number, filmDto: CreateFilmDto) {
        if (!filmDto) {
            throw new BadRequestException("empty film dto");
        }

        const film = this.filmRepository.create({
            id: id,
            ...this.unwrapDto(filmDto)
        });

        return await this.filmRepository.save(film);
    }

    async delete(id: number) {
        return await this.filmRepository.delete(id);
    }

    mapFilmToDto(film: Film) {
        if (!film) {
            throw new UnprocessableEntityException("No film was passed")
        }

        return {
            ...film,
            characters: film.characters ? film.characters.map(c => c.id) : [],
            species: film.species ? film.species.map(s => s.id) : [],
            vehicles: film.vehicles ? film.vehicles.map(v => v.id) : [],
            starships: film.starships ? film.starships.map(s => s.id) : [],
            planets: film.planets ? film.planets.map(p => p.id) : [],
        }
    }

    private unwrapDto(dto: CreateFilmDto) {
        const {characters, species, vehicles, starships, planets, ...filmData} = dto;


        return {
            ...filmData,
            characters: characters ? characters.map((id) => ({id: Number(id)})) : [],
            species: species ? species.map((id) => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map((id) => ({id: Number(id)})) : [],
            planets: planets ? planets.map((id) => ({id: Number(id)})) : [],
            starships: starships ? starships.map((id) => ({id: Number(id)})) : [],
        }
    }

}
