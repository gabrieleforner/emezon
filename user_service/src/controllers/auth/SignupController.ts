import {SignupRequestBody} from "@models/RequestBodyModels"
import {Response} from "express"
import {User} from "@models/UserModel"
import {AuthenticationAPIError} from "@models/ErrorModels"
import {createHash} from "node:crypto"
import Services from "@utils/Services"
import { SELLER_ROLE, USER_ROLE } from "@utils/CommonStrings"

export default async function signupController(requestFields: SignupRequestBody, res: Response) {
    const matchingEmail = await Services.getInstance().getEntity(User, { email: requestFields.email })
    const matchingUsername = await  Services.getInstance().getEntity(User, { username: requestFields.username })

    if(requestFields.accountType != USER_ROLE && requestFields.accountType != SELLER_ROLE) {
        throw new AuthenticationAPIError(
            400,
            "ERR_UNAVAILABLE_TYPE",
            "Unable to sign you up with account type " + requestFields.accountType
        )
    }

    if (matchingEmail !== null) {
        throw new AuthenticationAPIError(409, "ERR_EMAIL_ALREADY_PRESENT", "This email is already in use")
    }
    if (matchingUsername !== null) {
        throw new AuthenticationAPIError(409, "ERR_USERNAME_ALREADY_PRESENT", "This username is already in use")
    }

    const newUser = new User()
    newUser.email = requestFields.email
    newUser.passwordHash = createHash('sha256')
        .update(requestFields.password)
        .digest('hex')
    newUser.name = requestFields.name ?? ""
    newUser.surname = requestFields.surname ?? ""
    newUser.username = requestFields.username ?? ""
    
    if(requestFields.accountType == USER_ROLE)
        newUser.roles = [ USER_ROLE ]
    else if(requestFields.accountType == SELLER_ROLE)
        newUser.roles = [ USER_ROLE, SELLER_ROLE]

    Services.getInstance().addNewEntity(User, newUser)
    res
        .status(200)
        .json({
            success: true
        })
}