import {Inject, Injectable} from "@nestjs/common";
import {PeopleRepository} from "./people.repository";
import {People} from "./model/people.model";

@Injectable()
export class PeopleService {
    constructor(private readonly peopleRepository: PeopleRepository) {
    }

    add(people: People) {
        this.peopleRepository.add(people);
    }

    get(id: number) {
        this.peopleRepository.get(id)
    }

    getAll() {
        return this.peopleRepository.getAll()
    }

    getSinglePage(offset: number = 0, limit: number = 10) {
        return this.peopleRepository.getInRange(offset, limit)
    }

    update(id: number, people: People) {
        this.peopleRepository.update(id, people);
    }

    delete(id: number) {
        this.peopleRepository.delete(id)
    }



}