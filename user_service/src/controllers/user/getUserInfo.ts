import { UserAPIError } from "@models/ErrorModels"
import { SessionPayload } from "@models/SessionPayloadModel"
import { User } from "@models/UserModel"
import Services from "@utils/Services"
import { Response } from "express"

export default async function getInformationController(sessionPayload: SessionPayload, field: string, res: Response) {
    const userInfo: User = await Services.getInstance().getEntity(User, { email: sessionPayload.email }) as User
    if (field == undefined) {
        // Return ALL user informations
        res
            .status(200)
            .json({
                email: userInfo.email,
                name: userInfo.name,
                surname: userInfo.surname,
                username: userInfo.username
            })
    }
    else {
        let fieldValue: string = ""
        switch (field) {
            case "email":
                fieldValue = userInfo.email as string
                break
            case "name":
                fieldValue = userInfo.name as string
                break
            case "surname":
                fieldValue = userInfo.surname as string
                break
            case "username":
                fieldValue = userInfo.username as string
            default:
                break
        }
        res
            .status(200)
            .json({
                [field] : fieldValue
            })
    }
}