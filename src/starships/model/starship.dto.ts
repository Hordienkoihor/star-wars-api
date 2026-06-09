import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreateStarshipDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    starship_class: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    cost_in_credits: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    length: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    crew: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    passengers: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    max_atmosphering_speed: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    hyperdrive_rating: string;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    mglt: number;

    @ApiProperty()
    @IsNumberString()
    @IsNotEmpty()
    @Type(() => Number)
    cargo_capacity: number;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    consumables: number;

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
    pilots: string[];

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