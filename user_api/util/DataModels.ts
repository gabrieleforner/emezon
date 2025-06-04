import { RowDataPacket } from "mysql2";

export interface LoginInfos {
    email: string,
    password: string
}

export interface UserGeneralInfos extends RowDataPacket {
    name: string,
    surname: string,
    email: string,
    password: string
    uuid: string
}