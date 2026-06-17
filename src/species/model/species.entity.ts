import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";
import {Planet} from "../../planets/model/planet.entity";

@Entity()
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    classification: string;

    @Column()
    average_height: string;

    @Column()
    average_lifespan: string;

    @Column()
    eye_colors: string;

    @Column()
    hair_colors: string;

    @Column()
    skin_colors: string;

    @Column()
    language: string;

    @ManyToOne(() => Planet, (planet) => planet.species, {nullable: true})
    homeworld: Planet;

    @ManyToMany(() => People, (people) => people.species, {nullable: true})
    people: People[];

    @ManyToMany(() => Film, (film) => film.species, {nullable: true})
    films: Film[]

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}