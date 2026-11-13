import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json({limit:"32kb"})) //To take json file 
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


export {app}

import router        from "./router/userRouter.routes.js"
import testRouter    from "./router/createQuiz.routes.js"
import studentRouter from "./router/student-routes/student.routes.js"
import TestttemptRouter from "./router/student-routes/test.routes.js"
app.use("/api/v1/test/", testRouter)
app.use("/api/v1/", router)
app.use("/api/v1/student/", studentRouter)
app.use("/api/v1/student/test/", TestttemptRouter)
