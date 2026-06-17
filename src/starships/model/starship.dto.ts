import {IsArray, IsInt, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreateStarshipDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    model: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    starship_class: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    manufacturer: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    cost_in_credits: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    length: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    crew: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    passengers: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    max_atmosphering_speed: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    hyperdrive_rating: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mglt: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    cargo_capacity: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    consumables: string;

    @ApiProperty({
        description: 'array of films starship was spotted in ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    films?: number[];

    @ApiProperty({
        description: 'array of people who piloted the starship ids',
        type: [Number],
        required: false,
    })
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    pilots?: number[];

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