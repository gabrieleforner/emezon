/* */
export class UserAPIError extends Error {
    public httpCode: number;
    public errorString: string;

    constructor(httpCode: number, errorString: string, errorMessage: string) {
        super();
        this.name = 'UserAPIError';
        this.httpCode = httpCode;
        this.errorString = errorString;
        this.message = errorMessage;
    }
}
export class AuthenticationAPIError extends UserAPIError {
    constructor(httpCode: number, errorString: string, errorMessage: string) {
        super(httpCode, errorString, errorMessage);
        this.name = 'AuthenticationAPIError';
    }
}