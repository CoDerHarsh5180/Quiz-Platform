import {Router} from "express"
const testRouter = Router()
import { createStructure, createSection, createQuestion } from "../controllers/testPaper.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"    
testRouter.post("/createStructure", verifyJWT, createStructure)
testRouter.post("/createSection", verifyJWT, createSection)
testRouter.post("/createQuestion", verifyJWT, createQuestion)

export default testRouter