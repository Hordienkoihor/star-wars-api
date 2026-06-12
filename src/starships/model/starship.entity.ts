
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";

@Entity()
export class Starship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    model: string;

    @Column()
    starship_class: string;

    @Column()
    manufacturer: string;

    @Column()
    cost_in_credits: number;

    @Column()
    length: number;

    @Column()
    crew: number;

    @Column()
    passengers: number;

    @Column()
    max_atmosphering_speed: number;

    @Column()
    hyperdrive_rating: string;

    @Column()
    mglt: number;

    @Column()
    cargo_capacity: number;


    @Column()
    consumables: number;

    @ManyToMany(() => Film, (film) => film.starships)
    films: Film[];

    @ManyToMany(() => People, (person) => person.starships)
    pilots: People[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}