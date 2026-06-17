import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";

@Entity()
export class Starship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    model: string;

    @Column({nullable: true})
    starship_class: string;

    @Column({nullable: true})
    manufacturer: string;

    @Column({nullable: true})
    cost_in_credits: string;

    @Column({nullable: true})
    length: string;

    @Column({nullable: true})
    crew: string;

    @Column({nullable: true})
    passengers: string;

    @Column({nullable: true})
    max_atmosphering_speed: string;

    @Column({nullable: true})
    hyperdrive_rating: string;

    @Column({nullable: true})
    mglt: string;

    @Column({nullable: true})
    cargo_capacity: string;


    @Column({nullable: true})
    consumables: string;

    @ManyToMany(() => Film, (film) => film.starships, {nullable: true})
    films: Film[];

    @ManyToMany(() => People, (person) => person.starships, {nullable: true})
    pilots: People[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}