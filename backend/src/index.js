import { app } from "./app.js";
import  connectDB  from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000, '0.0.0.0',()=>{
        console.log("Server started on port", process.env.PORT || 5000)
    }) 
})
.catch(e=>{console.log("Database not connected")})
 

export default app