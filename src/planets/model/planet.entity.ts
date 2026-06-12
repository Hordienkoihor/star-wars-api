import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";


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

    @ManyToMany(() => Film, (film) => film.planets)
    films: Film[];


    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}