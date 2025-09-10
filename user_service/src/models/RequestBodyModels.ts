export interface LoginRequestBody {
    email: string
    password: string
}
export interface SignupRequestBody {
    email: string
    username: string
    password: string
    surname: string
    name?: string
    accountType: string
}