
import { Otp } from "../models/otp.models.js"

import sendMail from "../utils/sendEmail.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Teacher } from "../models/Teacher.models.js"

import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        console.log("Generating Tokens")
        const user = await Teacher.findById(userId)
        if(!user){
            console.log("User Not Found")
            throw ApiError(501, "User not found")
        }
        console.log(user)
        // console.log(user)
        const refreshToken = await user.generateRefreshToken()
        const AccessToken = await user.generateAccessToken()
        user.RefreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {AccessToken, refreshToken}
    }
    catch{
        throw new ApiError(400, "Error while creating tokens")
    }
}

const userRegister = asyncHandler(async(req, res)=>{
    console.log("Running")
    const {name, username, email, password, experience, field} = req.body
    console.log(req.body)
    if(!name || !username || !email || !password){
        throw new ApiError(500, "All fields are compulsory")
    }
    const existedUser = await Teacher.findOne({
        $or:[{username, email}]
    })
    if(existedUser) {
        throw new ApiError(404, "User Already Registered")
    }
    const otp = otpGenerator()
    console.log(otp) 
    sendMail(email, otp)
    const otp1=await Otp.create({
        otp:otp,
        email:email
    })    
    return res.status(200).json(new ApiResponse(200, otp1, "User Created Successfully"))
    
})

const otpGenerator=()=>{
    const otp = Math.ceil(Math.random()*1000000)
    const otpStr = String(otp)
    let temp =""
    for(let i=0;i<6-otpStr.length;i++){
        temp+="0"
    }
    temp+=otpStr
    return temp
}

const verifyUser = asyncHandler(async(req, res)=>{
    const {name, username, email, password, experience, field, otp} = req.body
    const user1 =await Otp.find({   
        email:email
    })
    if(!email){
        throw new ApiError(501, "User not found")
    }
    console.log(password)
    console.log((otp))
    console.log((user1[0].otp))
    if((user1[0].otp).trim() === otp.trim()){
        console.log("Otp Verified")
        const user = await Teacher.create({
            name:name,
            username:username,
            email:email,
            password:password,
            experience:experience,
            field:field
        })
        
        res.status(200).json(
            new ApiResponse(200, user, "Registered Successfully")
        )
    }
    else{
        console.log("Wrong Otp")
        throw new ApiError(404, "Wrong Otp")
    }
})

const Login = asyncHandler(async(req, res)=>{
    console.log("Login Route")
    const {username, email, password} = req.body
    console.log(req.body)
    if(!username && !email){
        console.log("Use either username or email to login")
        throw new ApiError(401, "Use either username or Email to Login")
    }
    const user = await Teacher.findOne({
        $or:[{email}, {username}]
    })
    if(!user){
        console.log("User Doesn't Exist")
        throw new ApiError(404, "User Doesn't Exist")
    }
    
    const IsPasswordValid = await user.isPasswordCorrect(password)
    console.log(IsPasswordValid)
    if(!IsPasswordValid){
        console.log("Incorrect Password")
        throw  new ApiError("404", "Invalid Credentials")
    }
    console.log("Login Successfull")
    const {AccessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const option={
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", AccessToken, option)
    .json(
        new ApiResponse(200, user, "Logged In Successfully")
    )
})


const changePassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await Teacher.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "Error Not found")
    }
    const IsPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!IsPasswordValid){
        throw new ApiError(501, "Incorrect Password")
    }
    user.password = newPassword
    await user.save()
    res.status(200)
    .json(
        new ApiResponse(200, "Password Changed Successfully")
    )
})


const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || refreshAccessToken.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN
        )
        const user = await Teacher.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Unauthorized Request")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw ApiError(401, "Refresh Token is Expired or Unused")
        }
        const option = {
            httpOnly:true,
            secure:true
        }
    
        const {AccessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookies("AccessToken", AccessToken,option)
        .cookies("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {AccessToken, refreshToken:refreshToken},
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw ApiError(400, error?.message || "Invalid Refresh Token")
    }
})  


const getProfile = asyncHandler(async(req, res)=>{
    if(!req.cookies.accessToken){
        throw new ApiError(401, "Unauthorized Request")
    }
    if(!req.user){
        throw new ApiError(401, "Unauthorized Request")
    }
    const user = await Teacher.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "User Not Found")
    }
    res.status(200).json(
        new ApiResponse(200, user, "User Profile Fetched Successfully")
    )
})

const logout = asyncHandler(async(req, res)=>{
    const user = await Teacher.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "User Not Found")
    }
    user.refreshToken = null
    await user.save({validateBeforeSave:false})

    const option = {
        httpOnly:true,
        secure:true
    }
    res.status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("accessToken", option)
    .json(
        new ApiResponse(200, "Logged Out Successfully")
    )
})

export {userRegister, verifyUser, Login, changePassword, refreshAccessToken, getProfile, logout}