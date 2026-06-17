import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumberString, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {Planet} from "../../planets/model/planet.entity";
import {ManyToOne} from "typeorm";
import {People} from "../../people/model/people.entity";

export class CreateSpeciesDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    classification: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    average_height: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    average_lifespan: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    eye_colors: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    hair_colors: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    skin_colors: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    language: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    homeworld: number | null;

    @ApiProperty({
        description: 'array of people related to species ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    people?: number[]

    @ApiProperty({
        description: 'array of films species was spotted in ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    films?: number[]

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