import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const teacherSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique:true
    },
    username:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    },
    name:{
        type:String,
        required: true
    },
    experience:{
        type:String
    },
    field:{
        type:String,
        enum:["JEE", "NEET", "OLYMPIAD", "SCHOOL", "GOVT-EXAMS PREP"]
    }
}, {timestamps:true})


teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,10)
    
}) //Dont use Arrow func

teacherSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

teacherSchema.methods.generateAccessToken =async function(){
    
    return await jwt.sign(
        {
            _id: this._id,
            name:this.name,
            username:this.username,
            email:this.email,
            role:this.role
            
        }, 
        process.env.JSON_ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
teacherSchema.methods.generateRefreshToken =async function(){
    try{
        return await jwt.sign(
            {
                _id: this._id, 
            },
            process.env.REFRESH_TOKEN,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY

            }
        )
    }catch(e){
        console.log(e)
    }
    
}

export const Teacher = mongoose.model("Teacher", teacherSchema)