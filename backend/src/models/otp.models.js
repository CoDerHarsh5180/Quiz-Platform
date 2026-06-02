import mongoose, {Schema} from "mongoose";

const otpSchema = new mongoose.Schema({
    otp:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        required:true
    }, createdAt:{
        type:Date,
        default:Date.now,
        expireAfterSeconds:30
    }
},)

export const Otp = mongoose.model("Otp", otpSchema)