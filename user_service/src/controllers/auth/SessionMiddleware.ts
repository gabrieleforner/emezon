import { Request, Response, NextFunction } from 'express'
import { AuthenticationAPIError } from '@models/ErrorModels'
import process from "node:process"
import jwt from 'jsonwebtoken'
import { SessionPayload } from '@models/SessionPayloadModel'
import Services from '@utils/Services'

const JWT_HEADER_PREFIX = 'Bearer '
const JWT_SECRET: string = String(process.env.JWT_SECRET) ?? "EuufMmHiFAn69ojfc46EXf2jI296iOV3A8otm8SOqG568z90wH"

// Extension to Express.js "Request" to put session payload
declare module "express-serve-static-core" {
    interface Request {
        isSessionValid?: boolean
        sessionPayload?: SessionPayload
    }
}

async function checkSessionMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            throw new AuthenticationAPIError(401, 'ERR_MISSING_TOKEN', 'Missing token in headers')
        }
        if (!authHeader.startsWith(JWT_HEADER_PREFIX)) {
            throw new AuthenticationAPIError(401, 'ERR_INVALID_TOKEN_FORMAT', 'Invalid token format')
        }

        let payload: SessionPayload = {} as SessionPayload
        try {
            // validate token and extract payload
            payload = jwt.verify(
                authHeader.substring(JWT_HEADER_PREFIX.length, authHeader.length),
                JWT_SECRET,
                {
                    issuer: 'emezon-user-service',
                    audience: 'authenticated-users'
                }
            ) as SessionPayload
        } catch (error) {
            throw new AuthenticationAPIError(
                400,
                "ERR_INVALID_TOKEN",
                "Bad token format, see OpenAPI spec"
            )
        }
        // TODO: Check su Redis
        const onRedisToken = await Services.getInstance().readRedisValue(`jwt:session:${payload.email}`)
        if (onRedisToken == null) {
            throw new AuthenticationAPIError(
                404,
                "ERR_SESSION_EXPIRED",
                "This token refers to an expired session"
            )
        }
        req.isSessionValid = true
        req.sessionPayload = payload
        next()
    } catch (error) {
        if(error instanceof AuthenticationAPIError) {
            res
                .status(error.httpCode)
                .json({
                    errorString: error.errorString,
                    errorMessage: error.message
                })
        }
    }
}

export default checkSessionMiddleware
