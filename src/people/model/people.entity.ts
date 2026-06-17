import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Film} from "../../films/model/film.entity";
import {Species} from "../../species/model/species.entity";
import {Vehicle} from "../../vehicles/model/vehicle.entity";
import {Starship} from "../../starships/model/starship.entity";
import {Planet} from "../../planets/model/planet.entity";

@Entity()
export class People {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    height: string;

    @Column({nullable: true})
    mass: string;

    @Column({nullable: true})
    hair_color: string;

    @Column({nullable: true})
    skin_color: string;

    @Column({nullable: true})
    eye_color: string;

    @Column({nullable: true})
    birth_year: string;

    @Column({nullable: true})
    gender: string;

    @ManyToOne(() => Planet, (planet) => planet.residents, {nullable: true})
    homeworld: Planet;

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