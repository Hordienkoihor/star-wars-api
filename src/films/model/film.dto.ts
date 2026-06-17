import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateFilmDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    episode_id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    opening_crawl: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    director: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    producer: string;

    @ApiProperty()
    @IsISO8601()
    @IsNotEmpty()
    release_date: string;

    @ApiProperty({
        description: 'array of species used in film ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    species?: number[];

    @ApiProperty({
        description: 'array of vehicles used in film ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    vehicles?: number[];

    @ApiProperty({
        description: 'array of starships used in film ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    starships?: number[];

    @ApiProperty({
        description: 'array of characters used in film ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    characters?: number[];

    @ApiProperty({
        description: 'array of planets used in film ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    planets?: number[];

    @ApiProperty()
    @IsISO8601()
    created: string;

    @ApiProperty()
    @IsISO8601()
    edited: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    imgs: string[];
}