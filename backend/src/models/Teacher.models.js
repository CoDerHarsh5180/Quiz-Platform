import mongoose, { Schema } from "mongoose";

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

export const Teacher = mongoose.model("Teacher", teacherSchema)