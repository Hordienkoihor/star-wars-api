import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()

    @Column({unique:true})
    username: string;

    @Column()
    password: string;
}