import { User } from "@models/UserModel";
import sqlConnection from "@utils/SQLConnection";
import { Request } from "express";

interface PersonalInformationsBody {
    name?: string
    surname?: string
    email?: string
    password?: string
    username?: string
};

export async function editPersonalInformationController(req: Request, res: Response) {
    let newUserInformations: PersonalInformationsBody = req.body as PersonalInformationsBody;
    let userInformations: User = await sqlConnection.getEntity(User, { email: req.sessionPayload?.email }) as User;

    // Check and change email
    if(newUserInformations.email != undefined && userInformations.email != newUserInformations.email) {
        userInformations.email = newUserInformations.email!;
    }
    // Check and change name
    if(newUserInformations.name != undefined && userInformations.name != newUserInformations.name) {
        userInformations.name = newUserInformations.name!;
    }
    // Check and change surname
    if(newUserInformations.surname != undefined && userInformations.surname != newUserInformations.surname) {
        userInformations.surname = newUserInformations.surname!;
    }
    // Check and change username
    if(newUserInformations.username != undefined && userInformations.username != newUserInformations.username) {
        userInformations.username = newUserInformations.username!;
    }

    // TODO: Check password hashes (SHA256) in case of mismatch, set new one provided (if not undefined)
}