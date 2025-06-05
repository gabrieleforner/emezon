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
import { AccountIdentityError, User, UserLoginInfos, UserSignupInfos } from "../util/DataModels";
import { Request, Response } from "express";
import { createHash, randomUUID } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

const sessionDurationMinutes: number = 60;

export async function loginService(req: Request, res: Response) {
    try {
        const loginInformations: UserLoginInfos = req.body as UserLoginInfos;
        if(loginInformations.email == null || loginInformations.password == null) {
            throw new AccountIdentityError("Missing mandatory informations", 400);
        }
        const matching = await ServiceContext.getInstance().query<UserLoginInfos>("SELECT * FROM users WHERE email = ?", [ loginInformations.email ]).catch((err) => { throw new Error(err) });
        if(matching.length < 1) {
            throw new AccountIdentityError("Account not found", 404)
        }
        matching.forEach((account) => {
            const inputPasswordHash = createHash('sha256').update(loginInformations.password).digest('hex');
            if(account.password != inputPasswordHash) {
                throw new AccountIdentityError("Invalid email or password", 401);
            }
            const session = jwt.sign({ email: loginInformations.email, randomizer: randomUUID() }, ServiceContext.getInstance().jwtKey, { algorithm: "HS256" });
            ServiceContext.getInstance().getRedisClient().set(`active_session@${loginInformations.email}`, session, 'EX', sessionDurationMinutes*60).catch((err) => { throw new Error(err) });
            res.status(200).json({ jwt: session });
        });
    } catch (error) {
        if(error instanceof AccountIdentityError) {
            res.status(error.clientHttpCode).json({ error: error.message});
        }
        else {
            console.error(error)
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

/**
 * Handles user signup by validating input, checking for existing users, and inserting a new user into the database.
 *
 * @param req - The Express request object containing user signup information in the body.
 * @param res - The Express response object used to send the response.
 * @throws {AccountIdentityError} If mandatory information is missing or the email is already registered.
 * @throws {Error} For other unexpected errors during database operations.
 *
 * Responds with:
 * - 200 and a success message if the account is created.
 * - 400 or 401 with an error message for known signup errors.
 * - 500 with a generic error message for unexpected errors.
 */
export async function signupService(req: Request, res: Response) {
    try {
        const signupInfos: UserSignupInfos = req.body as UserSignupInfos;
        if (signupInfos.email == null || signupInfos.password == null)
            throw new AccountIdentityError("Missing mandatory informations", 400);
        const existing = await ServiceContext.getInstance().query<User>("SELECT * FROM users WHERE email = ?", [signupInfos.email]).catch((err) => { throw new Error(err) });
        if (existing.length > 0)
            throw new AccountIdentityError("Email alreay registered", 401);
        ServiceContext.getInstance().query("INSERT INTO users (email, password, name, surname, uuid) VALUES (?, ?, ?, ?, ?)", [
            signupInfos.email,
            createHash('sha256').update(signupInfos.password).digest('hex'),
            signupInfos.name,
            signupInfos.surname,
            randomUUID()
        ]).catch((err) => { throw new Error(err) });
        res.status(200).json({ status: "Account created" });
    }
    catch (error) {
        if (error instanceof AccountIdentityError) {
            res.status(error.clientHttpCode).json({ error: error.message });
        }
        else {
            console.error(error)
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export async function validateService(req: Request, res: Response) {
    try {
        let token: string = "";
        const prefix: string = "Bearer ";
        if (req.headers.authorization == null)
            throw new AccountIdentityError("Missing session token", 400);
        if (!req.headers.authorization.startsWith(prefix))
            throw new AccountIdentityError("Invalid authorization header format", 400);
        token = req.headers.authorization.substring(prefix.length);
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, ServiceContext.getInstance().jwtKey) as JwtPayload;
        } catch (err) {
            throw new AccountIdentityError("Invalid or expired session token", 401);
        }
        // Check if the token matches the one stored in Redis
        const redisKey = `active_session@${decoded.email}`;
        const storedToken = await ServiceContext.getInstance().getRedisClient().get(redisKey);
        if (!storedToken || storedToken !== token) {
            throw new AccountIdentityError("Session token not valid or expired", 401);
        }
        res.status(200).json({ session: "valid", email: decoded.email });
    } catch (error) {
        if (error instanceof AccountIdentityError) {
            res.status(error.clientHttpCode).json({ error: error.message });
        }
        else {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export async function refreshService(req: Request, res: Response) {

}

export async function logoutService(req: Request, res: Response) {
    try {
        let token: string = "";
        const prefix: string = "Bearer ";
        if (req.headers.authorization == null)
            throw new AccountIdentityError("Missing session token", 400);
        if (!req.headers.authorization.startsWith(prefix))
            throw new AccountIdentityError("Invalid authorization header format", 400);
        token = req.headers.authorization.substring(prefix.length);
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, ServiceContext.getInstance().jwtKey) as JwtPayload;
        } catch (err) {
            throw new AccountIdentityError("Invalid or expired session token", 401);
        }
        const redisKey = `active_session@${decoded.email}`;
        await ServiceContext.getInstance().getRedisClient().del(redisKey);
        res.status(200).json({ status: "Logged out" });
    } catch (error) {
        if (error instanceof AccountIdentityError) {
            res.status(error.clientHttpCode).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}