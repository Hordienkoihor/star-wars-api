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
    @IsNotEmpty()
    classification: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    average_height: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    average_lifespan: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    eye_colors: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    hair_colors: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    skin_colors: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    language: string;

    @ApiProperty()
    @IsString()
    homeworld: string;

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
    @IsArray()
    @IsString({each: true})
    imgs: string[];

}