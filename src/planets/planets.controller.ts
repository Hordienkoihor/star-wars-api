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

@Controller('planets')
export class PlanetsController {
    private readonly baseImagePath = './uploads/planets'

    constructor(private readonly planetService: PlanetsService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.planetService.getSinglePage(offset, limit)
        }
        return await this.planetService.getSinglePage()
    }

    @Get('/all')
    async getAllPlanets() {
        return await this.planetService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.planetService.get(id)
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
    async create(@Body() planetDto: CreatePlanetDto, @UploadedFiles(
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

        planetDto.imgs = files?.map(file => file.filename) || [];
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

        const planet = await this.planetService.get(id)

        if (!planet) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such planet found');
        }

        const newImages = files?.map(file => file.filename) || [];

        planet.imgs = [...(planet.imgs || []), ...newImages];
        await this.planetService.update(id, planet)

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
        await this.planetService.update(id, planet)


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
        const fileStream = createReadStream(Path.join(this.baseImagePath, image))
        return new StreamableFile(fileStream)
    }
}
