import {SignupRequestBody} from "@models/RequestBodyModels";
import {Response} from "express";
import sqlDataSource from "@utils/SQLConnection";
import {User} from "@models/UserModel";
import {AuthenticationAPIError} from "@models/ErrorModels";
import {createHash} from "node:crypto";

export default async function signupController(requestFields: SignupRequestBody, res: Response) {
    const matchingEmailQB = sqlDataSource.getRepository(User).createQueryBuilder("email");
    const matchingEmail = await matchingEmailQB.where("email = :email", { email: requestFields.email }).getOne();
    if (matchingEmail !== null) {
        throw new AuthenticationAPIError(409, "ERR_EMAIL_ALREADY_PRESENT", "This email is already in use");
    }

    const newUser = new User();
    newUser.email = requestFields.email;
    newUser.passwordHash = createHash('sha256')
        .update(requestFields.password)
        .digest('hex')
    newUser.name = requestFields.name ?? "";
    newUser.surname = requestFields.surname ?? "";
    newUser.username = requestFields.username ?? "";

    sqlDataSource.getRepository(User).save(newUser);
    res
        .status(200)
        .json({
            success: true
        })
}