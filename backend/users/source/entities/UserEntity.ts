/**
 * @author Gabriele Forner <gabriele.forner@icloud.com>
 * @brief This class define the scheme containing user
 * identity-related information as name, surname, email
 * and password hash (Algorithm is SHA256)
 * */

import {Column, Entity, Index, PrimaryColumn} from "typeorm";

@Entity()
class UserEntity {
    @PrimaryColumn({nullable: false, unique: true })  userEmail?: string
    @Column({nullable: true }) userPassword?: string
    @Column({nullable: true }) userName?: string
    @Column({nullable: true}) userSurname?: string
    @Column({ nullable: false }) userRole?: boolean
}
export default UserEntity;