import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Species {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    classification: string;

    @Column()
    average_height: number;

    @Column()
    average_lifespan: number;

    @Column()
    eye_colors: string;

    @Column()
    hair_colors: string;

    @Column()
    skin_colors: string;

    @Column()
    language: string;

    @Column()
    homeworld: string;

    @Column({type: 'json', nullable: true})
    people: number[]

    @Column({type: 'json', nullable: true})
    films: number[]

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column({type: 'json', nullable: true})
    imgs: string[];
}