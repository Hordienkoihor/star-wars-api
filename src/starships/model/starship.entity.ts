
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

    @Column({type: 'json', nullable: true})
    films: string[];

    @Column({type: 'json', nullable: true})
    pilots: string[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string

    @Column()
    imgs: string[];
}