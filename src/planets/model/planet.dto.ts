import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumberString, IsOptional, IsString} from "class-validator";
import {Column} from "typeorm";
import {Type} from "class-transformer";

export class CreatePlanetDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    diameter?: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    rotation_period: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    orbital_period: number;

    @ApiProperty()
    @IsNotEmpty()
    gravity: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    population: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    climate: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    terrain: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    surface_water: number;

    // @ApiProperty()
    // @IsNumberString()
    // @IsNotEmpty()
    // @Type(() => Number)
    // residents: number;

    @ApiProperty({
        description: 'array of films planet was spotted in ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    films?: number[];


    @ApiProperty()
    @IsISO8601()
    created: string;

    @ApiProperty()
    @IsISO8601()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}