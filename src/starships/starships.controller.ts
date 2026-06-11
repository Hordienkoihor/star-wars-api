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
import {StarshipsService} from "./starships.service";
import {CreateStarshipDto} from "./model/starship.dto";

@Controller('starships')
export class StarshipsController {
    private readonly baseImagePath = './uploads/starship'

    constructor(private readonly starshipService: StarshipsService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.starshipService.getSinglePage(offset, limit)
        }
        return await this.starshipService.getSinglePage()
    }

    @Get('/all')
    async getAllPlanets() {
        return await this.starshipService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.starshipService.get(id)
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
    async create(@Body() starshipDto: CreateStarshipDto, @UploadedFiles(
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

        starshipDto.imgs = files?.map(file => file.filename) || [];
        return await this.starshipService.add(starshipDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() starshipDto: CreateStarshipDto) {
        return await this.starshipService.update(id, starshipDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.starshipService.delete(id)
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

        const starship = await this.starshipService.get(id)

        if (!starship) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such starship found');
        }

        const newImages = files?.map(file => file.filename) || [];

        starship.imgs = [...(starship.imgs || []), ...newImages];
        await this.starshipService.update(id, starship)

        return starship;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const starship = await this.starshipService.get(id)

        if (!starship) {
            throw new NotFoundException('No such starship found');

        }


        if (!starship.imgs) {
            throw new NotFoundException('starship object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !starship.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`starship ${starship.name} does not have all images passed`);
        }

        starship.imgs = starship.imgs.filter(name => !images.includes(name));
        await this.starshipService.update(id, starship)


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
        const starship = await this.starshipService.get(id)

        if (!starship) {
            throw new NotFoundException('No such starship found');
        }

        if (!starship.imgs || !starship.imgs.includes(image)) {
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
