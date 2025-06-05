import { RowDataPacket } from "mysql2";

/**
 * Represents the login information required for a user to authenticate.
 *
 * @property email - The user's email address used for login.
 * @property password - The user's password used for login.
 */
export interface UserLoginInfos {
  email: string,
  password: string
}

/**
 * Represents the login information required for user authentication.
 *
 * @property email - The user's email address.
 * @property password - The user's password.
 */
export interface UserSignupInfos extends RowDataPacket {
    name: string,
    surname: string,
    email: string,
    password: string
}

/**
 * Represents a user entity, extending the user signup information with a unique identifier.
 *
 * @extends UserSignupInfos
 * @property uuid - The unique identifier for the user.
 */
export interface User extends UserSignupInfos {
    uuid: string
}

/**
 * Represents an error that occurs during the signup process.
 * Extends the built-in `Error` interface and includes an additional
 * HTTP status code to be sent to the client.
 *
 * @property clientHttpCode - The HTTP status code associated with the error, intended for client responses.
 */
export class AccountIdentityError extends Error {
  clientHttpCode: number;

  constructor(message: string, clientHttpCode: number) {
    super(message);
    this.clientHttpCode = clientHttpCode;
    this.name = 'AccountIdentityError';
  }
}

/**
 * Custom error class representing payment-related errors for an account.
 * (e.g. Card already added, card required not registered, etc. )
 * @extends Error
 * @property {number} clientHttpCode - The HTTP status code to be sent to the client.
*/