import {Router} from "express"
const router = Router()
import { verifyJWT } from "../middleware/auth.middleware.js"
import {userRegister, verifyUser, Login, changePassword, getProfile, logout} from "../controllers/teacher.controller.js"

router.route("/register").post(userRegister)
router.route("/register/otp").post(verifyUser)
router.route("/login").post(Login)
router.route("/settings/changePassword").post(verifyJWT, changePassword)
router.route('/logout').post(verifyJWT, logout)
router.route("/show").get(verifyJWT, getProfile)

export default router