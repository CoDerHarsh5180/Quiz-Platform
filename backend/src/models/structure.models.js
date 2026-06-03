import mongoose from "mongoose";
const Schema = mongoose.Schema;

const structureSchema = new mongoose.Schema({
    creator:{
        type:Schema.Types.ObjectId,
        ref:"Teacher"
    },
    name:{  
        type:String,
        required:true
    },
    totalMarks:{
        type:Number,
        required:true
    },
    timeDuration:{
        type:Number,
        required:true
    },
    noOfSub:{type:Number, required:true},
    subjects:[{
        type: String,
        required: true
    }],
    noOfSec:{type:Number, required:true}, 
    sections:[{
        type:Schema.Types.ObjectId,
        ref:"Section"
    }]
},{timestamps:true})

export const Structure = mongoose.model("Structure", structureSchema)