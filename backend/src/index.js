import { app } from "./app.js";
import  connectDB  from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    if(process.env.NODE_ENV !== 'production'){
        app.listen(process.env.PORT || 3000, ()=>{
            console.log("Server started")
        }) 
    }
    
})
.catch(e=>{console.log("Database notconnected")})
 

export default app