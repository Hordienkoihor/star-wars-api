import {Inject, Injectable} from "@nestjs/common";
import {People} from "./model/people.entity";
import {Repository} from "typeorm";
import {CreatePeopleDto} from "./model/people.dto";
import {HttpService} from "@nestjs/axios";
import {firstValueFrom} from "rxjs";
import * as https from "node:https";

@Injectable()
export class PeopleService {
    constructor(@Inject('PEOPLE_REPOSITORY') private readonly peopleRepository: Repository<People>, private readonly httpService: HttpService) {
    }

    // async onApplicationBootstrap() {
    //     const count = await this.peopleRepository.count();
    //
    //     if (count > 0) {
    //         console.log('peoples are not empty')
    //         console.log(count);
    //         return;
    //     }
    //
    //     await this.seedPeopleData()
    // }
    //
    // async seedPeopleData() {
    //     let link = 'https://swapi.dev/api/people/'
    //
    //     const agent = new https.Agent({
    //         rejectUnauthorized: false
    //     });
    //
    //     while (link) {
    //         try {
    //             console.log(1)
    //             const res = await firstValueFrom(this.httpService.get(link, {httpsAgent: agent}));
    //             const data = res.data
    //
    //             const results = data.results
    //
    //             for (const person of results) {
    //                 const exists = await this.peopleRepository.findOneBy({name: person.name});
    //                 if (!exists) {
    //                     const dto: CreatePeopleDto = {
    //                         name: person.name,
    //                         height: person.height,
    //                         mass: person.mass,
    //                         hair_color: person.hair_color,
    //                         skin_color: person.skin_color,
    //                         eye_color: person.eye_color,
    //                         birth_year: person.birth_year,
    //                         gender: person.gender,
    //                         homeworld: person.homeworld,
    //                         films: person.films,
    //                         species: person.species,
    //                         vehicles: person.vehicles,
    //                         starships: person.starships,
    //                         created: person.created,
    //                         edited: person.edited,
    //                         url: person.url,
    //                         imgs: person.imgs || [],
    //                     }
    //
    //                     await this.add(dto);
    //                 }
    //             }
    //
    //             if (data.next) {
    //                 link = data.next.replace('http://', 'https://');
    //                 console.log(link);
    //             } else {
    //                 link = '';
    //             }
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // }

    async add(peopleDto: CreatePeopleDto) {
        const {films, species, vehicles, starships, homeworld, ...personData} = peopleDto;


        const person = this.peopleRepository.create({
            ...personData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            films: films ? films.map(id => ({id: Number(id)})) : [],
            species: species ? species.map(id => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map(id => ({id: Number(id)})) : [],
            starships: starships ? starships.map(id => ({id: Number(id)})) : [],
        })

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

    async getByName(name: string) {
        return await this.peopleRepository.findOne({
            where: {name}
        })
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
        const {films, species, vehicles, starships, homeworld, ...personData} = people;

        const person = this.peopleRepository.create({
            id: id,
            ...personData,
            homeworld: homeworld ? {id: Number(homeworld)} : undefined,
            films: films ? films.map(id => ({id: Number(id)})) : [],
            species: species ? species.map(id => ({id: Number(id)})) : [],
            vehicles: vehicles ? vehicles.map(id => ({id: Number(id)})) : [],
            starships: starships ? starships.map(id => ({id: Number(id)})) : [],
        })

        return await this.peopleRepository.save(person)
    }

    async delete(id: number) {
        return await this.peopleRepository.delete({id})
    }


}