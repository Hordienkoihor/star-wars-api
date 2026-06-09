import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


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

    @Column({type: 'json', nullable: true})
    films: string[];

    @Column({type: 'json', nullable: true})
    pilots: string[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}