import {IsArray, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsString} from "class-validator";
import {Type} from "class-transformer";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class People {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    height: string;

    @Column()
    mass: string;

    @Column()
    hair_color: string;

    @Column()
    skin_color: string;

    @Column()
    eye_color: string;

    @Column()
    birth_year: string;

    @Column()
    gender: string;

    @Column()
    homeworld: string;

    @Column({ type: 'json', nullable: true })
    films: string[];

    @Column({ type: 'json', nullable: true })
    species: string[];

    @Column({ type: 'json', nullable: true })
    vehicles: string[];

    @Column({ type: 'json', nullable: true })
    starships: string[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}