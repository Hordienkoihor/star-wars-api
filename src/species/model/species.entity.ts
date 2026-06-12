import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";

@Entity()
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    classification: string;

    @Column()
    average_height: number;

    @Column()
    average_lifespan: number;

    @Column()
    eye_colors: string;

    @Column()
    hair_colors: string;

    @Column()
    skin_colors: string;

    @Column()
    language: string;

    @Column()
    homeworld: string;

    @ManyToMany(() => People, (people) => people.species)
    people: People[];

    @ManyToMany(() => Film, (film) => film.species)
    films: Film[]

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}