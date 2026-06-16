import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Teacher } from '../models/Teacher.models.js'
import { Structure } from '../models/structure.models.js'
import { Section } from '../models/section.models.js'
import { Question } from '../models/questions.models.js'
import {uploadOnCloudinary, unlinkFile} from '../utils/cloudinary.js'
import { generateQues } from '../utils/AIQuestionDesigner.js'

const createStructure = asyncHandler(async (req, res) => {
    console.log("Creating Structure")
    const { name, totalMarks, timeDuration, noOfSub, subjects, noOfSec} = req.body
    const creator = await Teacher.findById(req.user._id)
    if(!creator){
        console.log("Teacher not found")
        throw new ApiError(404, "Teacher not found")
    }
    console.log(name, totalMarks, timeDuration, noOfSub, subjects, noOfSec)
    console.log("Creator Detected")
    console.log(creator)
    console.log(req.body)
    const structure = await Structure.create({
        creator:String(creator._id),
        name,
        totalMarks,
        timeDuration,
        noOfSub,
        subjects,
        noOfSec
    })
    console.log(structure)
    creator.tests.push(structure._id)
    await creator.save()
    res.status(201).json(new ApiResponse(201, structure, "Structure created successfully"))
})


const sectionCreate = asyncHandler(async(req, res)=>{
    console.log("Creating Section")
    const {testId, plusMarks, minusMarks, instructions, numOfQues, typeOfQues, UserSection} = req.body
    console.log(req.body)
    const test = await Structure.findById(testId)
    if(!test){
        console.log("Test not found")
        throw new ApiError(404, "Test not found")
    }
    console.log(test)
    if(!UserSection){
        const length = test.sections.length
        if(length>=test.noOfSec){
            console.log("This Section is Not Defined in the Structure")
            throw new ApiError(404, "This Section is Not Defined in the Structure")
        }
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
        console.log(test.sections)
        await test.save()
        res.status(201).json(new ApiResponse(201, section, "Section created successfully"))
    }
    else{
        const section = await Section.find({
            $and:[
                {secName:UserSection},
                {testId}
            ]
        }) 
        console.log(section)
        if(!section){
            if(test.sections.length<noOfSec){
                const length = test.sections.length
                console.log(length)
                const section1 = await Section.create({
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
            }
            else{
                console.log("This Section is Not Defined in the Structure")
                throw ApiError(404, "This Section is Not Defined in the Structure")
            }
        }
        console.log(section)
        section[0].plusMarks=plusMarks
        section[0].minusMarks=minusMarks
        section[0].instructions=instructions
        section[0].numOfQues=numOfQues
        section[0].typeOfQues=typeOfQues
        await section[0].save()
        res.status(200).json(new ApiResponse(200, section, "Section updated successfully"))

    }
    
})


const getSection = asyncHandler(async(req, res)=>{
    const {secName, id} = req.body
    console.log("Getting Section")
    console.log(req.body)
    const section = await Section.find({
        $and:[
            {secName},{testId:id}
        ]
    })
    console.log(section)
    if(!section){
        res.status(200).json(
            new ApiResponse(200, {}, "No Section of this name present")
        )
    }
    else {
        res.status(200).json(new ApiResponse(200, section, "Section Fetched Successfully" ))
    }
})

const createQuestion = asyncHandler(async(req, res)=>{
    console.log("Creating Question")
    const { text, sectionName, options, correctAnswer, subject, testId} = req.body
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
    const section = await Section.find({
        $and:[
            {testId:testId},
            {secName:sectionName}
        ]
    })
    if(!section){
        console.log("Section not found")
        throw new ApiError(404, "Section not found")
    }
    const question = await Question.create({
        creator: creator._id,
        index: section.questions.length + 1,
        text,
        section: section._id,
        options,
        correctAnswer,
        subject,
        image: img?.url
    })
    
    unlinkFile(image)
    console.log("Question Created")
    section.questions.push(question._id)
    await section.save()
    res.status(201).json(new ApiResponse(201, question, "Question created successfully"))
})



const getStructure = asyncHandler(async(req, res)=>{
    const {testId} = req.body
    console.log(req.body)
    const structure = await Structure.findById(String(testId))
    if(!structure){
        console.log("Structure not found")
        throw new ApiError(404, "Structure not found")
    }
    res.status(200).json(new ApiResponse(200, structure, "Structure fetched successfully"))
})


const generateQuesImg = asyncHandler(async(req, res)=>{
    console.log(req.body)
    const {subject, sectionName, testId} = req.body
    const user = await Teacher.findById(req.user._id)
    if(!user){
        console.log("User not found")
        throw new ApiError(404, "User Not Found")
    }
    console.log(user)
    const section = await Section.find({
        $and:[
            {testId:testId},
            {secName:sectionName}
        ]
    })
    if(!section){
        console.log("Section not found")
        throw new ApiError(404, "Section Not Found")
    }
    console.log(section[0])
    const type = section.typeOfQues
    const image = req.files?.prompt[0]?.path
    console.log("Image Path: ", image)
    let img;
    
    
    const refImg = req.files?.image[0]?.path
    console.log(refImg)
    let ref1;
    if(refImg) ref1 = await uploadOnCloudinary(refImg) 
        console.log("Done-1")
    if(image) img = await uploadOnCloudinary(image)   
    console.log("Done-2")
    const response = await generateQues(ref1.url, type)
    console.log(response)
    const ques = {
        creator:user._id,
        index: section[0].questions.length + 1,
        section:section[0]._id,
        text:response.question,
        subject,
        image:img?.url,
        options:response.options,
        correctAnswer:response.correctAnswer

    }
    console.log(ques)
    const question = await Question.create(ques)
    section[0].questions.push(question._id)
    await section[0].save()
    try{
        if(image) await unlinkFile(image)
    }
    catch(e){
        console.log("Image not found")
    }
    try{
        if(refImg)await unlinkFile(refImg)
    }catch(e){
        console.log("Image not found")
    }
    
    res.status(200).json(new ApiResponse(200, question, "Ques Fetched SuccessFully"))
})


export {createStructure, sectionCreate as createSection, createQuestion, getStructure, generateQuesImg, getSection}