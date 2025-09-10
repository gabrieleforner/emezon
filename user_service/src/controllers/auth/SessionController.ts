import {LoginRequestBody} from "@models/RequestBodyModels"
import { randomUUID } from 'node:crypto'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import * as process from "node:process"
import {AuthenticationAPIError} from "@models/ErrorModels"
import {SessionPayload} from "@models/SessionPayloadModel"
import Services from "@utils/Services"

const TOKEN_TTL: number = 10 *60 * 60
const TOKEN_PREFIX: string = "Bearer "
const JWT_SECRET: string = String(process.env.JWT_SECRET) ?? "EuufMmHiFAn69ojfc46EXf2jI296iOV3A8otm8SOqG568z90wH"

export async function createSession(requestFields: LoginRequestBody, userRoles: string[], username: string): Promise<string> {
    const tokenPayload: SessionPayload = {} as SessionPayload
    tokenPayload.email = requestFields.email!
    tokenPayload.username = username
    tokenPayload.jti = randomUUID()
    tokenPayload.roles = userRoles

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
        algorithm: "HS256",
        issuer: "emezon-user-service",
        expiresIn: "10m",
        audience: 'authenticated-users'
    })

    Services.getInstance().addRedisValueWithTTL(`jwt:session:${requestFields.email}`, token, TOKEN_TTL)
    return token
}

export async function invalidateSession(bearerToken: string | undefined, payload: SessionPayload, res: Response) {
    Services.getInstance().deleteRedisValue(`jwt:session:${payload.email}`)
    res
        .status(200)
        .json({
        success: true
    })
}