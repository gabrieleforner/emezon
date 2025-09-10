import {Response} from "express"
import {LoginRequestBody} from "@models/RequestBodyModels"
import {User} from "@models/UserModel"
import {AuthenticationAPIError} from "@models/ErrorModels"
import { createHash } from 'node:crypto'
import {createSession} from "@controllers/auth/SessionController"
import Services from "@utils/Services"

export default async function loginController(requestFields: LoginRequestBody, res: Response) {
    const matchingUser = await Services.getInstance().getEntity(User, { email: requestFields.email }) as User
    if(matchingUser == null) {
        throw new AuthenticationAPIError(
            404,
            "ERR_EMAIL_NOT_FOUND",
            "There is no account with this email"
        )
    }
    const requestPasswordHashed = createHash('sha256')
        .update(requestFields.password)
        .digest('hex')
    if(matchingUser.passwordHash != requestPasswordHashed) {
        throw new AuthenticationAPIError(
            409,
            "ERR_WRONG_PASSWORD",
            "Wrong password for this email"
        )
    }

    const token = await createSession(requestFields, matchingUser.roles, matchingUser.username)

    res
        .status(200)
        .json({
            sessionKey: token
        })
}