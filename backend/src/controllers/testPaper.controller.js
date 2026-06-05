import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Teacher } from '../models/Teacher.models.js'
import { Structure } from '../models/structure.models.js'
import { Section } from '../models/section.models.js'
import { Question } from '../models/questions.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'


const createStructure = asyncHandler(async (req, res) => {
    console.log("Creating Structure")
    const { name, totalMarks, timeDuration, noOfSub, subjects, noOfSec} = req.body
    const creator = await Teacher.findById(req.user._id)
    if(!creator){
        console.log("Teacher not found")
        throw new ApiError(404, "Teacher not found")
    }
    console.log("Creator Detected")
    const structure = await Structure.create({
        creator:creator._id,
        name,
        totalMarks,
        timeDuration,
        noOfSub,
        subjects,
        noOfSec
    })
    creator.tests.push(structure._id)
    await creator.save()
    res.status(201).json(new ApiResponse(201, structure, "Structure created successfully"))
})


const sectionCreate = asyncHandler(async(req, res)=>{
    console.log("Creating Section")
    const {testId, plusMarks, minusMarks, instructions, numOfQues, typeOfQues} = req.body
    const test = await Structure.findById(testId)
    if(!test){
        console.log("Test not found")
        throw new ApiError(404, "Test not found")
    }
    const length = test.sections.length
    console.log(length)
    const section = await Section.create({
        testId,
        secName: String.fromCharCode(65 + length), 
        plusMarks,
        minusMarks,
        instructions,
        numOfQues,
        typeOfQues
    })
    console.log("Section Created")
    test.sections.push(section._id)
    await test.save()
    res.status(201).json(new ApiResponse(201, section, "Section created successfully"))
})


const createQuestion = asyncHandler(async(req, res)=>{
    console.log("Creating Question")
    const { text, sectionId, options, correctAnswer, subject} = req.body
    const creator = await Teacher.findById(req.user._id)
    console.log("Creator Detected")
    if(!creator){
        console.log("Teacher not found")
        throw new ApiError(404, "Teacher not found")
    }
    console.log("Creator Detected")
    const image = req.files?.image[0]?.path
    console.log("Image Path: ", image)
    let img;
    if(image) img = await uploadOnCloudinary(image)
    const section = await Section.findById(sectionId)
    if(!section){
        console.log("Section not found")
        throw new ApiError(404, "Section not found")
    }
    const question = await Question.create({
        creator: creator._id,
        index: section.questions.length + 1,
        text,
        section: sectionId,
        options,
        correctAnswer,
        subject,
        image: img?.url
    })
    res.status(201).json(new ApiResponse(201, question, "Question created successfully"))
})

export {createStructure, sectionCreate as createSection, createQuestion}