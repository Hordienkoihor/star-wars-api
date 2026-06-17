import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreatePeopleDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    height: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mass: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    hair_color: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    skin_color: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    eye_color: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    birth_year: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    gender: string;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    homeworld: number | null;

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
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    imgs: string[];


}