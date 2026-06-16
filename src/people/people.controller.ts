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

@Controller('people')
export class PeopleController {
    private readonly baseImagePath = './uploads'

    constructor(private readonly peopleService: PeopleService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.peopleService.getSinglePage(offset, limit)
        }
        return await this.peopleService.getSinglePage()
    }

    @Get('/all')
    async getAllPeople() {
        return await this.peopleService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
       return await this.peopleService.get(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage(
            {
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                }
            }
        )
    }))
    async create(@Body() people: CreatePeopleDto, @UploadedFiles(
        new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /^image\/(png|jpeg)$/,
                skipMagicNumbersValidation: true
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
        ImageValidationPipe
    ) files: Array<Express.Multer.File>) {

        people.imgs = files?.map(file => file.filename) || [];
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
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage(
            {
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                }
            }
        )
    }))
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
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such person found');
        }

        const newImages = files?.map(file => file.filename) || [];

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

        await Promise.all(images.map(async (image) => {
                try {
                    await fsPromise.unlink(Path.join(this.baseImagePath, image));
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
        const fileStream = createReadStream(Path.join(this.baseImagePath, image))
        return new StreamableFile(fileStream)
    }
}