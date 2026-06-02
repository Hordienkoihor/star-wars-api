import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreatePeopleDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumberString()
    // @Type(() => Number)
    height: string;

    @IsNumberString()
    // @Type(() => Number)
    mass: string;

    @IsString()
    hair_color: string;

    @IsString()
    skin_color: string;

    @IsString()
    eye_color: string;

    @IsString()
    birth_year: string;

    @IsString()
    gender: string;

    @IsString()
    homeworld: string;

    @IsArray()
    @IsString({each: true})
    films: string[];

    @IsArray()
    @IsString({each: true})
    species: string[];

    @IsArray()
    @IsString({each: true})
    vehicles: string[];

    @IsArray()
    @IsString({each: true})
    starships: string[];

    @IsISO8601()
    created: string;

    @IsISO8601()
    edited: string;

    @IsString()
    url: string

    @IsArray()
    @IsString({each: true})
    imgs: string[];
}