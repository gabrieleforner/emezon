import {Response} from "express"
import {LoginRequestBody} from "@models/RequestBodyModels"
import sqlDataSource from "@utils/SQLConnection"
import {User} from "@models/UserModel"
import {AuthenticationAPIError} from "@models/ErrorModels"
import { createHash } from 'node:crypto'
import {createSession} from "@controllers/auth/SessionController"
import sqlConnection from "@utils/SQLConnection"

export default async function loginController(requestFields: LoginRequestBody, res: Response) {
    const matchingUser = await sqlConnection.getEntity(User, { email: requestFields.email }) as User
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

    const token = await createSession(requestFields)

    res
        .status(200)
        .json({
            sessionKey: token
        })
}