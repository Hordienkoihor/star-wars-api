import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Role} from "./role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role: string;
}