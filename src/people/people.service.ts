import {Inject, Injectable} from "@nestjs/common";
import {People} from "./model/people.entity";
import {Like, Repository} from "typeorm";
import {CreatePeopleDto} from "./model/people.dto";
import {HttpService} from "@nestjs/axios";


@Injectable()
export class PeopleService {
    constructor(@Inject('PEOPLE_REPOSITORY') private readonly peopleRepository: Repository<People>, private readonly httpService: HttpService) {
    }

    async add(peopleDto: CreatePeopleDto) {
        const person = this.peopleRepository.create(this.unwrapDto(peopleDto));

        return await this.peopleRepository.save(person)
    }

    async get(id: number) {
        return await this.peopleRepository.findOne({
            where: {id},
            relations: {
                films: true,
                species: true,
                vehicles: true,
                starships: true,
            }
        })
    }

    async search(name: string, offset?: number, limit?: number) {
        return await this.peopleRepository.find({
            where: {name: Like(`%${name}%`)},
            skip: offset ? offset : undefined,
            take: limit ? limit : undefined,

        })
    }

    async getByName(name: string) {
        return await this.peopleRepository.findOne({where: {name}})
    }

    async getByUrl(url: string) {
        return await this.peopleRepository.findOne({where: {url}});
    }

    async getAll() {
        return await this.peopleRepository.find()
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.peopleRepository.find({
            skip: offset,
            take: limit,
            relations: {
                films: true,
                species: true,
                vehicles: true,
                starships: true,
            }
        })
    }

    async update(id: number, people: CreatePeopleDto) {
        if (!people) {
            throw new TypeError("People dto is required");
        }

        const person = this.peopleRepository.create({
            id: id,
            ...this.unwrapDto(people),
        })

        return await this.peopleRepository.save(person)
    }

    async delete(id: number) {
        return await this.peopleRepository.delete({id})
    }


    mapPersonToDto(person: People) {
        const {films, species, vehicles, starships, homeworld, ...personData} = person;

        return {
            ...personData,
            homeworld: homeworld ? homeworld.id : null,
            species: species ? species.map((s) => s.id) : [],
            vehicles: vehicles ? vehicles.map((v) => v.id) : [],
            starships: starships ? starships.map((s) => s.id) : [],
            films: films ? films.map((f) => f.id) : [],
        }
    }

    private unwrapDto(person: CreatePeopleDto) {
        const {films, species, vehicles, starships, homeworld, ...personData} = person;

        return {
            ...personData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            films: films ? films.map(id => ({id: Number(id)})) : [],
            species: species ? species.map(id => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map(id => ({id: Number(id)})) : [],
            starships: starships ? starships.map(id => ({id: Number(id)})) : [],
        }
    }

}