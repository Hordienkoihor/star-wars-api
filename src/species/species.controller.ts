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
import {SpeciesService} from "./species.service";
import {CreateSpeciesDto} from "./model/species.dto";

@Controller('species')
export class SpeciesController {
    private readonly baseImagePath = './uploads/species'

    constructor(private readonly speciesService: SpeciesService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.speciesService.getSinglePage(offset, limit)
        }
        return await this.speciesService.getSinglePage()
    }

    @Get('/all')
    async getAllPlanets() {
        return await this.speciesService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.speciesService.get(id)
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
    async create(@Body() speciesDto: CreateSpeciesDto, @UploadedFiles(
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

        speciesDto.imgs = files?.map(file => file.filename) || [];
        return await this.speciesService.add(speciesDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() speciesDto: CreateSpeciesDto) {
        return await this.speciesService.update(id, speciesDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.speciesService.delete(id)
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

        const species = await this.speciesService.get(id)

        if (!species) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such species found');
        }

        const newImages = files?.map(file => file.filename) || [];

        species.imgs = [...(species.imgs || []), ...newImages];

        const {people, films, ...speciesData} = species

        await this.speciesService.update(id, {
            ...speciesData,
            films: films ? films.map((f) => f.id) : [],
            people: people ? people.map((p) => p.id) : []
        })

        return species;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const species = await this.speciesService.get(id)

        if (!species) {
            throw new NotFoundException('No such species found');

        }


        if (!species.imgs) {
            throw new NotFoundException('species object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !species.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`Planet ${species.name} does not have all images passed`);
        }

        species.imgs = species.imgs.filter(name => !images.includes(name));

        const {people, films, ...speciesData} = species

        await this.speciesService.update(id, {
            ...speciesData,
            films: films ? films.map((f) => f.id) : [],
            people: people ? people.map((p) => p.id) : []
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
        const species = await this.speciesService.get(id)

        if (!species) {
            throw new NotFoundException('No such species found');
        }

        if (!species.imgs || !species.imgs.includes(image)) {
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
