import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Query} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {CreatePeopleDto} from "./model/people.model";

@Controller('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) {
    }

    @Get()
    async getForPageDef() {
        return await this.peopleService.getSinglePage()
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        return await this.peopleService.getSinglePage(offset, limit)
    }

    @Get('/all')
    async getAllPeople() {
        return await this.peopleService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        await this.peopleService.get(id)
    }

    @Post()
    async create(@Body() people: CreatePeopleDto) {
        await this.peopleService.add(people)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() people: CreatePeopleDto) {
        await this.peopleService.update(id, people)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
       await this.peopleService.delete(id)
    }
}