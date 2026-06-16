import {Router} from "express"
const testRouter = Router()
import { upload } from "../middleware/multer.middleware.js"
import { createStructure, createSection, createQuestion, getStructure , generateQuesImg, getSection} from "../controllers/testPaper.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"    
testRouter.route("/createStructure").post(verifyJWT, createStructure)
testRouter.route("/createSection").post(verifyJWT, createSection)
testRouter.route("/createQuestion").post(verifyJWT, upload.fields([
    {
        name:"image",
        maxCount:1
    }
]), createQuestion)
testRouter.route("/getSection").post(verifyJWT, getSection)

testRouter.route("/getStructure").post(verifyJWT, getStructure)
testRouter.route("/createQuesUsingAI").post(verifyJWT,  upload.fields([
    {
        name:"image",
        maxCount:1
    },
    {
        name:"prompt",
        maxCount:1
    }
]), generateQuesImg)
export default testRouter