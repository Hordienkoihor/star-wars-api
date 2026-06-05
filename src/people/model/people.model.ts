import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePeopleDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumberString()
    // @Type(() => Number)
    height: string;

    @ApiProperty()
    @IsNumberString()
    // @Type(() => Number)
    mass: string;

    @ApiProperty()
    @IsString()
    hair_color: string;

    @ApiProperty()
    @IsString()
    skin_color: string;

    @ApiProperty()
    @IsString()
    eye_color: string;

    @ApiProperty()
    @IsString()
    birth_year: string;

    @ApiProperty()
    @IsString()
    gender: string;

    @ApiProperty()
    @IsString()
    homeworld: string;

    @ApiProperty({
        description: 'in future will be changed to id array',
        type: [String],
    })
    @IsArray()
    @IsString({each: true})
    films: string[];

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

    @ApiProperty()
    @IsISO8601()
    created: string;

    @ApiProperty()
    @IsISO8601()
    edited: string;

    @ApiProperty()
    @IsString()
    url: string

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    imgs: string[];
}