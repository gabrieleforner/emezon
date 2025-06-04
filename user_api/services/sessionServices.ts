/**
 * Business logic for managing user sessions.
 * 
 * @remarks
 * This file contains the core service functions used by controllers to handle session-related operations,
 * such as authentication, registration, token refresh, validation, and logout.
 * 
 * @see Controllers for HTTP endpoint handlers:
 *   - POST /login: Authenticate user and issue session JWT and refresh token.
 *   - POST /signup: Register a new user and create a session.
 *   - GET /refresh: Issue a new session JWT using a refresh token.
 *   - GET /validate: Validate a session JWT.
 *   - DELETE /logout: Invalidate session and refresh tokens.
 */

import ServiceContext from "../util/serviceContext";
import { LoginInfos, UserGeneralInfos } from "../util/DataModels";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import { createHash } from "crypto";
import { makeRandomString } from "../util/StringUtils";

const sessionDurationMinutes: number = 60;

export async function loginService(req: Request, res: Response) {
    const loginInformations: LoginInfos = req.body as LoginInfos;
    const accounts: UserGeneralInfos[] = await ServiceContext.getInstance().query<UserGeneralInfos>(`SELECT * FROM users WHERE email = "${loginInformations.email}"`);
    let authenticated = false;
    accounts.forEach((account) => {
        const hashed = createHash('sha256').update(loginInformations.password).digest('hex');
        if(account.password == hashed) {
            const jwtSessionToken = jwt.sign({ email: loginInformations.email, random: makeRandomString(100) }, String(process.env.JWT_SIGN_KEY), { algorithm: 'HS256'});
            ServiceContext
                .getInstance()
                .getRedisClient()
                .set(`session:${jwtSessionToken}`, JSON.stringify(account), 'EX', sessionDurationMinutes*60);
            res.status(200).json({session: jwtSessionToken});
            authenticated = true;
        }
    });
    if (!authenticated) {
        res.status(401).json({ error: "Invalid email or password" });
    }
}

export async function logoutService(req: Request, res: Response) {
    
}