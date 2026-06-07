import {Router} from "express"
const testRouter = Router()
import { createStructure, createSection, createQuestion, getStructure } from "../controllers/testPaper.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"    
testRouter.route("/createStructure").post(verifyJWT, createStructure)
testRouter.route("/createSection").post(verifyJWT, createSection)
testRouter.route("/createQuestion").post(verifyJWT, createQuestion)


testRouter.route("/getStructure").post(verifyJWT, getStructure)

export default testRouter