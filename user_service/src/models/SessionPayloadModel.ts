export interface SessionPayload {
    email: string,
    username: string,
    roles: string[],
    jti: string
}