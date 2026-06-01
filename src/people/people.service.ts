import {Inject, Injectable} from "@nestjs/common";
import {People} from "./model/people.entity";
import {Repository} from "typeorm";
import {CreatePeopleDto} from "./model/people.model";

@Injectable()
export class PeopleService {
    constructor(@Inject('PEOPLE_REPOSITORY') private readonly peopleRepository: Repository<People>) {
    }

    async add(peopleDto: CreatePeopleDto) {
        const person = this.peopleRepository.create(peopleDto)
        return await this.peopleRepository.save(person)
    }

    async get(id: number) {
        return await this.peopleRepository.findOneBy({
            id: id
        })
    }

    async getAll() {
        return await this.peopleRepository.find()
    }

    async getSinglePage(offset: number = 0, limit: number = 10) {
        return await this.peopleRepository.find({
            skip: offset,
            take: limit,
        })
    }

    async update(id: number, people: CreatePeopleDto) {
        await this.peopleRepository.update(id, people)
        return this.get(id);
    }

    async delete(id: number) {
        await this.peopleRepository.delete({id})
    }


}