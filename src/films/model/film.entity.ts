import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsString} from "class-validator";
import {Species} from "../../species/model/species.entity";
import {Vehicle} from "../../vehicles/model/vehicle.entity";
import {Starship} from "../../starships/model/starship.entity";
import {People} from "../../people/model/people.entity";
import {Planet} from "../../planets/model/planet.entity";

@Entity()
export class Film {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    episode_id: number;

    @Column()
    opening_claw: string;

    @Column()
    director: string;

    @Column()
    producer: string;

    @Column()
    release_date: string;

    @ManyToMany(() => Species, (species) => species.films)
    @JoinTable({name: 'film_species'})
    species: Species[];

    @ManyToMany(() => Vehicle, (vehicle) => vehicle.films)
    @JoinTable({name: 'film_vehicles'})
    vehicles: Vehicle[];

    @ManyToMany(() => Starship, (starship) => starship.films)
    @JoinTable({name: 'film_starships'})
    starships: Starship[];

    @ManyToMany(() => People, (person) => person.films)
    @JoinTable({name: 'film_people'})
    characters: People[];

    @ManyToMany(() => Planet, (planet) => planet.films)
    @JoinTable({name: 'film_planets'})
    planets: Planet[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({ type: 'json', nullable: true })
    imgs: string[];
}