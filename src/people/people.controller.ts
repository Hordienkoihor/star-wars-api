import {Body, Controller, Delete, Get, Inject, Param, Post, Put} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {CreatePeopleDto} from "./model/people.model";

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) {
    }

    @Get()
    getForPageDef() {
        return this.peopleService.getSinglePage()
    }

    @Get()
    getForPage(@Param('offset') offset: number, @Param('limit') limit: number) {
        return this.peopleService.getSinglePage(offset, limit)
    }

    @Get('/all')
    getAllPeople() {
        return this.peopleService.getAll()
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        this.peopleService.get(id)
    }

    @Post()
    create(@Body() people: CreatePeopleDto) {
        this.peopleService.add(people)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() people: CreatePeopleDto) {
        this.peopleService.update(id, people)
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        this.peopleService.delete(id)
    }
}