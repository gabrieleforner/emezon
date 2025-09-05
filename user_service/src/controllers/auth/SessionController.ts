import {LoginRequestBody} from "@models/RequestBodyModels";
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import redisClient from "@utils/RedisConnection";
import * as process from "node:process";

const TOKEN_EXPIRE: number = 10 *60 * 60;
const JWT_SECRET: string = String(process.env.JWT_SECRET) ?? "EuufMmHiFAn69ojfc46EXf2jI296iOV3A8otm8SOqG568z90wH";

export async function createSession(requestFields: LoginRequestBody): Promise<string> {
    const token = jwt.sign({
        email: requestFields.email,
        jti: randomUUID()
    }, JWT_SECRET, {
        expiresIn: "10m",
        audience: 'authenticated-users'
    });

    redisClient.set(`jwt:${requestFields.email}`, token, { EX: TOKEN_EXPIRE });

    return token;
}
export async function invalidateSession(bearerToken: string){


}