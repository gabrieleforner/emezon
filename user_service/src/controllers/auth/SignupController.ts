import {SignupRequestBody} from "@models/RequestBodyModels"
import {Response} from "express"
import sqlDataSource from "@utils/SQLConnection"
import {User} from "@models/UserModel"
import {AuthenticationAPIError} from "@models/ErrorModels"
import {createHash} from "node:crypto"
import sqlConnection from "@utils/SQLConnection"

export default async function signupController(requestFields: SignupRequestBody, res: Response) {
    const matchingEmail = await sqlConnection.getEntity(User, { email: requestFields.email })
    if (matchingEmail !== null) {
        throw new AuthenticationAPIError(409, "ERR_EMAIL_ALREADY_PRESENT", "This email is already in use")
    }

    const newUser = new User()
    newUser.email = requestFields.email
    newUser.passwordHash = createHash('sha256')
        .update(requestFields.password)
        .digest('hex')
    newUser.name = requestFields.name ?? ""
    newUser.surname = requestFields.surname ?? ""
    newUser.username = requestFields.username ?? ""

    sqlConnection.addNewEntity(User, newUser)
    res
        .status(200)
        .json({
            success: true
        })
}