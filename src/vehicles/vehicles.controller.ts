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
import {StarshipsService} from "../starships/starships.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from "path";
import {CreateStarshipDto} from "../starships/model/starship.dto";
import {ImageValidationPipe} from "../pipes/ImageValidationPipe";
import fs from "node:fs";
import fsPromise from "fs/promises";
import Path from "node:path";
import type {Response} from "express";
import {createReadStream, existsSync} from "fs";
import {VehiclesService} from "./vehicles.service";
import {CreateVehicleDto} from "./model/vehicle.dto";

@Controller('vehicles')
export class VehiclesController {
    private readonly baseImagePath = './uploads/vehicle'

    constructor(private readonly vehiclesService: VehiclesService) {
    }

    @Get()
    async getForPage(@Query('offset') offset: number, @Query('limit') limit: number) {
        if (offset && limit) {
            return await this.vehiclesService.getSinglePage(offset, limit)
        }
        return await this.vehiclesService.getSinglePage()
    }

    @Get('/all')
    async getAllPlanets() {
        return await this.vehiclesService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.vehiclesService.get(id)
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
    async create(@Body() vehicleDto: CreateVehicleDto, @UploadedFiles(
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

        vehicleDto.imgs = files?.map(file => file.filename) || [];
        return await this.vehiclesService.add(vehicleDto)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() vehicleDto: CreateVehicleDto) {
        return await this.vehiclesService.update(id, vehicleDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return await this.vehiclesService.delete(id)
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

        const vehicle = await this.vehiclesService.get(id)

        if (!vehicle) {
            files?.forEach((file: Express.Multer.File) => {
                fs.unlinkSync(file.path);
            })

            throw new NotFoundException('No such vehicle found');
        }

        const newImages = files?.map(file => file.filename) || [];

        vehicle.imgs = [...(vehicle.imgs || []), ...newImages];
        const {pilots, films, ...vehicleData} = vehicle;

        await this.vehiclesService.update(id, {
            ...vehicleData,
            pilots: pilots ? pilots.map((p) => p.id) : [],
            films: films ? films.map((f) => f.id) : [],
        })

        return vehicle;
    }

    @Delete(':id/images')
    async removeImages(@Body() images: string[], @Param('id') id: number) {
        const vehicle = await this.vehiclesService.get(id)

        if (!vehicle) {
            throw new NotFoundException('No such vehicle found');

        }


        if (!vehicle.imgs) {
            throw new NotFoundException('vehicle object has not images property');
        }

        const containsInvalidImage = images.some(imageName => !vehicle.imgs.includes(imageName));

        if (containsInvalidImage) {
            throw new BadRequestException(`vehicle ${vehicle.name} does not have all images passed`);
        }

        vehicle.imgs = vehicle.imgs.filter(name => !images.includes(name));
        const {pilots, films, ...vehicleData} = vehicle;

        await this.vehiclesService.update(id, {
            ...vehicleData,
            pilots: pilots ? pilots.map((p) => p.id) : [],
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
        const vehicle = await this.vehiclesService.get(id)

        if (!vehicle) {
            throw new NotFoundException('No such vehicle found');
        }

        if (!vehicle.imgs || !vehicle.imgs.includes(image)) {
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
