import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get, HttpStatus, NotFoundException,
    Param,
    ParseFilePipeBuilder, ParseIntPipe, Patch,
    Post, Put,
    Query, Res, StreamableFile,
    UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FilmsService} from "./films.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {ImageValidationPipe} from "../pipes/ImageValidationPipe";
import {CreateFilmDto} from "./model/film.dto";
import type {Response} from "express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FilesService} from "../files/files.service";

@Controller('films')
export class FilmsController {
    constructor(private readonly filmService: FilmsService, private readonly fileService: FilesService) {
    }

    @Get()
    async getForPage(
        @Query('search') search: string,
        @Query('offset') offset: number,
        @Query('limit') limit: number
    ) {
        const parsedOffset = offset ? +offset : undefined;
        const parsedLimit = limit ? +limit : undefined;

        if (search) {
            return await this.filmService.search(search, parsedOffset, parsedLimit);
        }


        if (parsedOffset !== undefined && parsedLimit !== undefined) {
            return await this.filmService.getSinglePage(offset, limit)
        }

        return await this.filmService.getSinglePage()
    }

    @Get('/all')
    async getAll() {
        return await this.filmService.getAll()
    }

    @Get('/:id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.filmService.findById(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 10))
    async create(@Body() filmDto: CreateFilmDto, @UploadedFiles(
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
            filmDto.imgs = await Promise.all(
                files.map(file => this.fileService.upload(file.originalname, file.buffer))
            );
        } else {
            filmDto.imgs = [];
        }

        return await this.filmService.add(filmDto);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() filmDto: CreateFilmDto) {
        return await this.filmService.update(id, filmDto)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.filmService.delete(id)
    }

    @Patch(':id/images')
    @UseInterceptors(FilesInterceptor('files', 10))
    async appendImages(@Param('id', ParseIntPipe) id: number, @UploadedFiles(new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /^image\/(png|jpeg)$/,
            skipMagicNumbersValidation: true
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }), ImageValidationPipe
    ) files: Array<Express.Multer.File>) {
        const film = await this.filmService.findByIdOrFail(id)

        let newImages: string[] = [];
        if (files && files.length > 0) {
            newImages = await Promise.all(
                files.map(file => this.fileService.upload(file.originalname, file.buffer))
            );
        }

        film.imgs = [...(film.imgs || []), ...newImages];

        await this.filmService.update(id, this.filmService.mapFilmToDto(film))

        return film;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id', ParseIntPipe) id: number) {
        const film = await this.filmService.findByIdOrFail(id)

        if (!film.imgs) {
            throw new NotFoundException('film object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !film.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`film ${film.title} does not have all images passed`);
        }

        film.imgs = film.imgs.filter(name => !images.includes(name));
        await this.filmService.update(id, this.filmService.mapFilmToDto(film))


        await Promise.all(images.map(async (image) => {
                await this.fileService.remove(image)
            })
        )
    }


    @Get(':id/images/:name')
    async getImage(@Param('id', ParseIntPipe) id: number, @Param('name') image: string, @Res({passthrough: true}) res: Response) {
        const film = await this.filmService.findByIdOrFail(id)

        if (!film.imgs || !film.imgs.includes(image)) {
            throw new NotFoundException('No such film found');
        }

        res.set('Content-Type', 'image/jpeg');
        const fileStream = await this.fileService.getStream(image);
        return new StreamableFile(fileStream)
    }

}
