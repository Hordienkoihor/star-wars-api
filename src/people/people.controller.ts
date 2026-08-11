import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get, HttpStatus, NotFoundException,
    Param, ParseFilePipeBuilder, Patch,
    Post,
    Put,
    Query, Res, StreamableFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {CreatePeopleDto} from "./model/people.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from 'path'
import * as fsPromise from 'fs/promises'
import type {Response} from "express";
import * as Path from "node:path";
import {createReadStream, existsSync} from 'fs'
import {ImageValidationPipe} from "../pipes/ImageValidationPipe";
import * as fs from "node:fs";
import {multerConfig} from "../multer/multer-config.helper";
import {FilesService} from "../files/files.service";

@Controller('people')
export class PeopleController {
    private readonly baseImagePath = './uploads'

    constructor(private readonly peopleService: PeopleService, private readonly fileService: FilesService) {
    }

    @Get()
    async getForPage(
        @Query('search') name: string,
        @Query('offset') offset: string,
        @Query('limit') limit: string
    ) {
        const parsedOffset = offset ? +offset : undefined;
        const parsedLimit = limit ? +limit : undefined;

        if (name) {
            return await this.peopleService.search(name, parsedOffset, parsedLimit);
        }

        if (parsedOffset !== undefined && parsedLimit !== undefined) {
            return await this.peopleService.getSinglePage(parsedOffset, parsedLimit);
        }

        return await this.peopleService.getSinglePage();
    }

    // @Get()
    // async search(
    //     @Query('search') name: string,
    //     @Query('offset') offset: string,
    //     @Query('limit') limit: string
    // ) {
    //     const parsedOffset = offset ? +offset : undefined;
    //     const parsedLimit = limit ? +limit : undefined;
    //
    //     return await this.peopleService.search(name, parsedOffset, parsedLimit)
    // }

    @Get('/all')
    async getAllPeople() {
        return await this.peopleService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.peopleService.get(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10))
    async create(@Body() people: CreatePeopleDto, @UploadedFiles(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^image\/(png|jpeg)$/,
                skipMagicNumbersValidation: true
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                fileIsRequired: false,
            }),
        ImageValidationPipe
    ) files: Array<Express.Multer.File>) {

        if (files && files.length > 0) {
            people.imgs = await Promise.all(
                files.map(file => this.fileService.upload(file.originalname, file.buffer))
            );
        } else {
            people.imgs = [];
        }

        return await this.peopleService.add(people)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() people: CreatePeopleDto) {
        return await this.peopleService.update(id, people)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.peopleService.delete(id)
    }

    @Patch(':id/images')
    @UseInterceptors(FilesInterceptor('files', 10))
    async appendImages(@Param('id') id: number, @UploadedFiles(new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /^image\/(png|jpeg)$/,
            skipMagicNumbersValidation: true
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }), ImageValidationPipe
    ) files: Array<Express.Multer.File>) {

        const person = await this.peopleService.get(id)

        if (!person) {
            throw new NotFoundException('No such person found');
        }

        let newImages: string[] = [];
        if (files && files.length > 0) {
            newImages = await Promise.all(
                files.map(file => this.fileService.upload(file.originalname, file.buffer))
            );
        }


        person.imgs = [...(person.imgs || []), ...newImages];

        const {films, species, vehicles, starships, homeworld, ...personData} = person;

        await this.peopleService.update(id, {
            ...personData,
            homeworld: homeworld ? homeworld.id : null,
            species: species ? species.map((s) => s.id) : [],
            vehicles: vehicles ? vehicles.map((v) => v.id) : [],
            starships: starships ? starships.map((s) => s.id) : [],
            films: films ? films.map((f) => f.id) : [],
        })

        return person;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const person = await this.peopleService.get(id)

        if (!person) {
            throw new NotFoundException('No such person found');

        }

        if (!person.imgs) {
            throw new NotFoundException('Person object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !person.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`Person ${person.name} does not have all images passed`);
        }

        person.imgs = person.imgs.filter(name => !images.includes(name));

        const {films, species, vehicles, starships, homeworld, ...personData} = person;

        await this.peopleService.update(id, {
            ...personData,
            homeworld: homeworld ? homeworld.id : null,
            species: species ? species.map((s) => s.id) : [],
            vehicles: vehicles ? vehicles.map((v) => v.id) : [],
            starships: starships ? starships.map((s) => s.id) : [],
            films: films ? films.map((f) => f.id) : [],
        })

        await Promise.all(images.map((image) => {
                try {
                    this.fileService.remove(image);
                } catch (e) {
                    console.error(e)
                }
            })
        )
    }


    @Get(':id/images/:name')
    async getImage(@Param('id') id: number, @Param('name') image: string, @Res({passthrough: true}) res: Response) {
        const person = await this.peopleService.get(id)

        if (!person) {
            throw new NotFoundException('No such person found');
        }

        if (!person.imgs || !person.imgs.includes(image)) {
            throw new NotFoundException('No such image found');
        }


        if (!existsSync(Path.join(this.baseImagePath, image))) {
            throw new NotFoundException('Image file is missing on server');
        }

        res.set('Content-Type', 'image/jpeg');
        const fileStream = await this.fileService.getStream(image)
        return new StreamableFile(fileStream)
    }
}