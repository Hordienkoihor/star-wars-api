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
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import {ImageValidationPipe} from "../pipes/ImageValidationPipe";
import fs from "node:fs";
import fsPromise from "fs/promises";
import Path from "node:path";
import type {Response} from "express";
import {createReadStream, existsSync} from "fs";
import {PlanetsService} from "./planets.service";
import {CreatePlanetDto} from "./model/planet.dto";
import {multerConfig} from "../multer/multer-config.helper";
import {FilesService} from "../files/files.service";

@Controller('planets')
export class PlanetsController {
    private readonly baseImagePath = './uploads/planets'

    constructor(private readonly planetService: PlanetsService, private readonly filesService: FilesService) {
    }

    @Get()
    async getForPage(
        @Query('search') name?: string,
        @Query('offset') offset?: number,
        @Query('limit') limit?: number
    ) {
        const parsedOffset = offset ? +offset : undefined;
        const parsedLimit = limit ? +limit : undefined;

        if (name) {
            return await this.planetService.getByName(name, parsedOffset, parsedLimit);
        }

        if (parsedOffset !== undefined && parsedLimit !== undefined) {
            return await this.planetService.getSinglePage(parsedOffset, parsedLimit)
        }
        return await this.planetService.getSinglePage()
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
    //     return await this.planetService.getByName(name, parsedOffset, parsedLimit)
    // }

    @Get('/all')
    async getAllPlanets() {
        return await this.planetService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.planetService.get(id)
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10))
    async create(@Body() planetDto: CreatePlanetDto, @UploadedFiles(
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
            planetDto.imgs = await Promise.all(files?.map(file => this.filesService.upload(file.originalname, file.buffer)))

        } else {
            planetDto.imgs = []
        }
        return await this.planetService.add(planetDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() planetDto: CreatePlanetDto) {
        return await this.planetService.update(id, planetDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.planetService.delete(id)
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

        const planet = await this.planetService.get(id)

        if (!planet) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such planet found');
        }

        let newImages: string[] = []
        if (files && files.length > 0) {
            newImages = await Promise.all(
                files.map(file => this.filesService.upload(file.originalname, file.buffer))
            );
        }
        planet.imgs = [...(planet.imgs || []), ...newImages];

        const {films, ...planetData} = planet
        await this.planetService.update(id, {
            ...planetData,
            films: films ? films.map((f) => f.id) : []
        })

        return planet;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const planet = await this.planetService.get(id)

        if (!planet) {
            throw new NotFoundException('No such planet found');

        }


        if (!planet.imgs) {
            throw new NotFoundException('Planet object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !planet.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`Planet ${planet.name} does not have all images passed`);
        }

        planet.imgs = planet.imgs.filter(name => !images.includes(name));
        const {films, ...planetData} = planet
        await this.planetService.update(id, {
            ...planetData,
            films: films ? films.map((f) => f.id) : []
        })


        await Promise.all(images.map((image) => {
                try {
                    this.filesService.remove(image);
                } catch (e) {
                    console.error(e)
                }
            })
        )
    }


    @Get(':id/images/:name')
    async getImage(@Param('id') id: number, @Param('name') image: string, @Res({passthrough: true}) res: Response) {
        const planet = await this.planetService.get(id)

        if (!planet) {
            throw new NotFoundException('No such planet found');
        }

        if (!planet.imgs || !planet.imgs.includes(image)) {
            throw new NotFoundException('No such image found');
        }


        if (!existsSync(Path.join(this.baseImagePath, image))) {
            throw new NotFoundException('Image file is missing on server');
        }

        res.set('Content-Type', 'image/jpeg');
        const fileStream = await this.filesService.getStream(image)
        return new StreamableFile(fileStream)
    }
}
