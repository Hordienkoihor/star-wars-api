import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumberString, IsString} from "class-validator";
import {Column} from "typeorm";

export class CreatePlanetDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    diameter: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    rotation_period: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    orbital_period: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    gravity: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    population: string;

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
    surface_water: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    residents: string;

    @Column({ type: 'json', nullable: true })
    films: string[];


    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}