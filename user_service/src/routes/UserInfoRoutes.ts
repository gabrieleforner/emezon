/*

 */
import checkSessionMiddleware from '@controllers/auth/SessionMiddleware'
import deleteAccountController from '@controllers/user/deleteAccount'
import editUserInfoController from '@controllers/user/editUserInfo'
import getInformationController from '@controllers/user/getUserInfo'
import { Router } from 'express'

const userInfoRoutes: Router = Router()

userInfoRoutes.get(`/`, checkSessionMiddleware, async (req, res) => { getInformationController(req.sessionPayload!, req.query.field as string, res) })
userInfoRoutes.patch(`/`, checkSessionMiddleware, async (req, res) => { editUserInfoController(req.sessionPayload!, req.query.field as string, req.body, res) })
userInfoRoutes.delete(`/`, checkSessionMiddleware, async (req, res) => { deleteAccountController(req.sessionPayload!, res) })

export default userInfoRoutes