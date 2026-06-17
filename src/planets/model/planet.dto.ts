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
    @IsString()
    @IsOptional()
    diameter?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    rotation_period: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    orbital_period: string;

    @ApiProperty()
    @IsOptional()
    gravity: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    population: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    climate: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    terrain: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    surface_water: string;

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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}