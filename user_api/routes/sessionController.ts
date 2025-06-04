/**
 * Controllers for managing user sessions via HTTP endpoints.
 * 
 * @remarks
 * This module provides handlers for session creation, validation and deletion.
 * @endpoint POST /login - Authenticates a user and return the session JWT plus a refresh token.
 * @endpoint POST /signup - Registers a user account and register the session.
 * @endpoint GET  /refresh - Get a new session JWT from a refresh token.
 * @endpoint GET  /validate - Validate the provided session JWT key.
 * @endpoint DELETE /logout - Log out the user and delete the session code and refresh code.
*/

import { Router } from "express";
import { loginService, logoutService } from "../services/sessionServices";

let sessionHandlingRouter: Router = Router();

sessionHandlingRouter.post('/login', (req, res) => loginService(req, res));
sessionHandlingRouter.post('/signup', (req, res) => { });
sessionHandlingRouter.get('/refresh', (req, res) => { });
sessionHandlingRouter.get('/validate', (req, res) => { });
sessionHandlingRouter.delete('/logout', (req, res) => logoutService(req, res));

export default sessionHandlingRouter;