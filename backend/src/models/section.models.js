import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sectionSchema = new mongoose.Schema({
    testId:{
        type:Schema.Types.ObjectId,
        ref:"Structure"
    },
    secName:{
        type:String,
        enum:["A", "B", "C", "D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    },
    plusMarks:{type:Number, required:true},
    minusMarks:{type:Number, required:true},    
    instructions:{type:String, required:true},
    numOfQues:{type:Number, required:true},
    typeOfQues:{type:String, required:true, enum:["MCQ", "NUMERICAL","MSQ", "TRUE/FALSE", "DESCRIPTIVE"]}, 
    questions:[{
        id:Schema.Types.ObjectId,
        ref:"Question"
    }] 
})