import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class createFilmDto {

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
    opening_claw: string;

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
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    species: string[];

    @ApiProperty({
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    vehicles: string[];

    @ApiProperty({
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    starships: string[];

    @ApiProperty({
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    characters: string[];

    @ApiProperty({
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    planets: string[];

    @ApiProperty()
    @IsISO8601()
    created: string;

    @ApiProperty()
    @IsISO8601()
    edited: string;

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    imgs: string[];
}