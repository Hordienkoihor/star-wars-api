import {
    Body,
    Controller,
    Delete,
    Get, HttpException, HttpStatus,
    Inject, NotFoundException,
    Param, ParseFilePipeBuilder, Patch,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {PeopleService} from "./people.service";
import {CreatePeopleDto} from "./model/people.model";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from 'path'

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
                fileType: /^image\/(png|jpeg)$/
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            })
    ) files: Array<Express.Multer.File>) {

        people.imgs = files?.map(file => file.filename) || [];
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

    @Patch(':id')
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
    async manageImages(@Param('id') id: number, @UploadedFiles(new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: /^image\/(png|jpeg)$/
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })) files: Array<Express.Multer.File>) {

        const person = await this.peopleService.get(id)

        if (!person) {
            throw new NotFoundException('No such person found');
        }

        const newImages = files?.map(file => file.filename) || [];

        person.imgs = [...(person.imgs || []), ...newImages];
        await this.peopleService.update(id, person)

        return person;
    }
}