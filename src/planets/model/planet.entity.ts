import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {People} from "../../people/model/people.entity";
import {Species} from "../../species/model/species.entity";


@Entity()
export class Planet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true })
    diameter: string;

    @Column({nullable: true})
    rotation_period: string;

    @Column({ nullable: true })
    orbital_period: string;

    @Column({ nullable: true })
    gravity: string;

    @Column({nullable: true })
    population: string;

    @Column({ nullable: true })
    climate: string;

    @Column({ nullable: true })
    terrain: string;

    @Column({ nullable: true })
    surface_water: string;

    @OneToMany(() => People, (people) => people.homeworld, {nullable: true})
    residents: People[];

    @ManyToMany(() => Film, (film) => film.planets, {nullable: true})
    films: Film[];

    @OneToMany(() => Species, (species) => species.homeworld, {nullable: true})
    species: Species[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}