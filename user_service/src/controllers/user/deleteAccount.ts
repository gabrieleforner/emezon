import { invalidateSession } from "@controllers/auth/SessionController"
import { SessionPayload } from "@models/SessionPayloadModel"
import { User } from "@models/UserModel"
import Services from "@utils/Services"
import { Response } from "express"

export default async function deleteAccountController(sessionPayload: SessionPayload, res: Response) {
    // TODO: Produce on RabbitMQ event for account deletion by using the email as user identifier
    Services.getInstance().deleteEntity(User, { email: sessionPayload.email })
    res
        .status(200)
        .json({
            success: true
        })
}