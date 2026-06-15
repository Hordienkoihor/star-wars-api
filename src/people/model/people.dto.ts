import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePeopleDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumberString()
    @Type(() => Number)
    height: number;

    @ApiProperty()
    @IsNumberString()
    @Type(() => Number)
    mass: number;

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
        description: 'array of films person was spotted in ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    films?: number[];

    @ApiProperty({
        description: 'array of  species person is related to ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    species?: number[];

    @ApiProperty({
        description: 'array of vehicles person was spotted piloting ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    vehicles?: number[];

    @ApiProperty({
        description: 'array of starships person was spotted piloting ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    starships?: number[];

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