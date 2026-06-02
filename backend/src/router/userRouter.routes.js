import {Router} from "express"
const router = Router()

import {userRegister, verifyUser, Login, changePassword} from "../controllers/teacher.controller.js"

router.route("/register").post(userRegister)
router.route("/register/otp").post(verifyUser)
router.route("/login").post(Login)
router.route("/settings/changePassword").post(changePassword)


export default router