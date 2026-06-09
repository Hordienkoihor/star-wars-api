import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Planet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    diameter: number;

    @Column()
    rotation_period: number;

    @Column()
    orbital_period: number;

    @Column()
    gravity: number;

    @Column()
    population: number;

    @Column()
    climate: string;

    @Column()
    terrain: string;

    @Column()
    surface_water: number;

    @Column()
    residents: number;

    @Column({ type: 'json', nullable: true })
    films: string[];


    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}