import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get, HttpStatus, NotFoundException,
    Param,
    ParseFilePipeBuilder, Patch,
    Post, Put,
    Query, Res, StreamableFile,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {FilmsService} from "./films.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import {CreatePeopleDto} from "../people/model/people.dto";
import {ImageValidationPipe} from "../pipes/ImageValidationPipe";
import {CreateFilmDto} from "./model/film.dto";
import fs from "node:fs";
import fsPromise from "fs/promises";
import Path from "node:path";
import type {Response} from "express";
import {createReadStream, existsSync} from "fs";
import {multerConfig} from "../multer/multer-config.helper";

@Controller('films')
export class FilmsController {
    private readonly baseImagePath = './uploads/film'

    constructor(private readonly filmService: FilmsService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.filmService.getSinglePage(offset, limit)
        }

        return await this.filmService.getSinglePage()
    }

    @Get('/all')
    async getAll() {
        return await this.filmService.getAll()
    }

    @Get('/:id')
    async getOne(@Param('id') id: number) {
        return await this.filmService.get(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    async create(@Body() film: CreateFilmDto, @UploadedFiles(
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

        film.imgs = files?.map(file => file.filename) || [];
        return await this.filmService.add(film)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() film: CreateFilmDto) {
        return await this.filmService.update(id, film)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.filmService.delete(id)
    }

    @Patch(':id/images')
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    async appendImages(@Param('id') id: number, @UploadedFiles(new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /^image\/(png|jpeg)$/,
            skipMagicNumbersValidation: true
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }), ImageValidationPipe
    ) files: Array<Express.Multer.File>) {

        const film = await this.filmService.get(id)

        if (!film) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such film found');
        }

        const newImages = files?.map(file => file.filename) || [];

        film.imgs = [...(film.imgs || []), ...newImages];
        await this.filmService.update(id, {
            ...film,
            characters: film.characters ? film.characters.map(c => c.id) : [],
            species: film.species ? film.species.map(s => s.id) : [],
            vehicles: film.vehicles ? film.vehicles.map(v => v.id) : [],
            starships: film.starships ? film.starships.map(s => s.id) : [],
            planets: film.planets ? film.planets.map(p => p.id) : [],
        })

        return film;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const film = await this.filmService.get(id)

        if (!film) {
            throw new NotFoundException('No such film found');

        }


        if (!film.imgs) {
            throw new NotFoundException('film object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !film.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`film ${film.title} does not have all images passed`);
        }

        film.imgs = film.imgs.filter(name => !images.includes(name));
        await this.filmService.update(id, {
            ...film,
            characters: film.characters ? film.characters.map(c => c.id) : [],
            species: film.species ? film.species.map(s => s.id) : [],
            vehicles: film.vehicles ? film.vehicles.map(v => v.id) : [],
            starships: film.starships ? film.starships.map(s => s.id) : [],
            planets: film.planets ? film.planets.map(p => p.id) : [],
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
        const film = await this.filmService.get(id)

        if (!film) {
            throw new NotFoundException('No such film found');
        }

        if (!film.imgs || !film.imgs.includes(image)) {
            throw new NotFoundException('No such film found');
        }


        if (!existsSync(Path.join(this.baseImagePath, image))) {
            throw new NotFoundException('Image file is missing on server');
        }

        res.set('Content-Type', 'image/jpeg');
        const fileStream = createReadStream(Path.join(this.baseImagePath, image))
        return new StreamableFile(fileStream)
    }

}
