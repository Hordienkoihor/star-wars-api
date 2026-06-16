import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";


@Entity()
export class Planet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'int', nullable: true })
    diameter: number;

    @Column({nullable: true})
    rotation_period: number;

    @Column({ nullable: true })
    orbital_period: number;

    @Column({ nullable: true })
    gravity: string;

    @Column({ type: 'bigint', nullable: true })
    population: number;

    @Column()
    climate: string;

    @Column()
    terrain: string;

    @Column({ nullable: true })
    surface_water: number;

    @OneToMany(() => People, (people) => people.homeworld)
    residents: People[];

    @ManyToMany(() => Film, (film) => film.planets)
    films: Film[];


    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}