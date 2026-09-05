import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { Teacher } from "../models/Teacher.models.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async(req,_, next)=>{
    try {
        console.log("Verifying JWT")
       
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log("Token:", token)
        if(!token){
            console.log("Token Not Found")
            throw new ApiError(404, "Unauthorized Request")
        }
        console.log("Token Found, Verifying...")
        const decodedToken = jwt.verify(token, process.env.JSON_ACCESS_TOKEN)
        
        const user = await Teacher.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access token")
        } 
    
        req.user=user;
        next()
    } catch (error) {
        console.log(error)
        throw new ApiError(401,error?.message || "Invalid Access Token")
    }
})