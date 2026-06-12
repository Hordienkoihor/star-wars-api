import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";


@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    model: string;

    @Column()
    vehicle_class: string;

    @Column()
    manufacturer: string;

    @Column()
    length: number;

    @Column()
    cost_in_credits: number;

    @Column()
    crew: number;

    @Column()
    passengers: number;

    @Column()
    max_atmosphering_speed: number;

    @Column()
    cargo_capacity: number;

    @Column()
    consumables: string;

    @ManyToMany(() => Film, (film) => film.vehicles)
    films: Film[];

    @ManyToMany(() => People, (person) => person.vehicles)
    pilots: People[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}