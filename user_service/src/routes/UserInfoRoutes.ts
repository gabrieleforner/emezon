/*

 */
import checkSessionMiddleware from '@controllers/auth/SessionMiddleware';
import { deleteAccountController } from '@controllers/user_info/deleteAccount';
import { Router } from 'express';

const userInfoRoutes: Router = Router();

userInfoRoutes.patch(`/me`, checkSessionMiddleware, async (req, res) => { editPersonalInformationController(req, res); });
userInfoRoutes.delete(`/me`, checkSessionMiddleware, async (req, res) => { deleteAccountController(req.sessionPayload!, res); })

export default userInfoRoutes;