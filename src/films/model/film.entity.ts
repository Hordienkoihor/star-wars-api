import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsString} from "class-validator";

@Entity()
export class Film {

    @PrimaryGeneratedColumn()
    filmId: number;

    @Column()
    title: string;

    @Column()
    episode_id: number;

    @Column()
    opening_claw: string;

    @Column()
    director: string;

    @Column()
    producer: string;

    @Column()
    release_date: string;

    @Column({type: 'json', nullable: true})
    species: string[];

    @Column({type: 'json', nullable: true})
    vehicles: string[];

    @Column({type: 'json', nullable: true})

    starships: string[];

    @Column({type: 'json', nullable: true})
    characters: string[];

    @Column({type: 'json', nullable: true})
    planets: string[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    imgs: string[];
}