import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {Species} from "../../species/model/species.entity";
import {Vehicle} from "../../vehicles/model/vehicle.entity";
import {Starship} from "../../starships/model/starship.entity";

@Entity()
export class People {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    height: number;

    @Column()
    mass: number;

    @Column()
    hair_color: string;

    @Column()
    skin_color: string;

    @Column()
    eye_color: string;

    @Column()
    birth_year: string;

    @Column()
    gender: string;

    @Column()
    homeworld: string;

    @ManyToMany(() => Film, (film) => film.characters)
    films: Film[];

    @ManyToMany(() => Species, (species) => species.people)
    @JoinTable({name: 'person_species'})
    species: Species[];

    @ManyToMany(() => Vehicle, (vehicle) => vehicle.pilots)
    @JoinTable({name: 'person_vehicle'})
    vehicles: Vehicle[];

    @ManyToMany(() => Starship, (starship) => starship.pilots)
    @JoinTable({name: 'person_starship'})
    starships: Starship[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}