/*
    @author Gabriele Forner <gabriele.forner@icloud.com>
    @brief This file define TypeORM model for users.
 */

import {Column, Entity, Index, PrimaryColumn} from "typeorm"

@Entity()
export class User {
    @Index()
    @PrimaryColumn({ unique: true, nullable:false })
    email!: string

    @Column({nullable:false})
    passwordHash!: string

    @Column()
    name?: string

    @Column()
    surname?: string

    @Column()
    username?: string
}