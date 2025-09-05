import { Request, Response, NextFunction } from 'express';
import { AuthenticationAPIError } from '@models/ErrorModels';
import process from "node:process";

const JWT_HEADER_PREFIX = 'Bearer ';
const JWT_SECRET: string = String(process.env.JWT_SECRET) ?? "EuufMmHiFAn69ojfc46EXf2jI296iOV3A8otm8SOqG568z90wH";

function checkSession(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        throw new AuthenticationAPIError(401, 'ERR_MISSING_TOKEN', 'Missing token in headers');
    }

    if (!authHeader.startsWith(JWT_HEADER_PREFIX)) {
        throw new AuthenticationAPIError(401, 'ERR_INVALID_TOKEN_FORMAT', 'Invalid token format');
    }

    // TODO: Check su Redis

    next();
}

export default checkSession;
