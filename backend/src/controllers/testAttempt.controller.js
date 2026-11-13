import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {getTestJson} from '../utils/getTestJson.js'
import {TestAttempt} from '../models/student-models/testAttempt.models.js'
import {Structure} from '../models/structure.models.js'
import {Student} from '../models/student-models/student.models.js'

const getTestAttempt = asyncHandler(async(req, res)=>{
    const user = req.user
    const {testId} = req.body
    if(!user){
        throw new ApiError(401, "Unauthorized Request")
    }

    const test = await Structure.findById(testId)
    if(!test){
        throw new ApiError(404, "No such test present")
    }
   const userBusy = await TestAttempt.findOne({studentId: user._id, status: 'in_progress'})
   if(userBusy){
    throw new ApiError(400, "You are already attempting a test.")
   }
   const testAttempt = await TestAttempt.create({
        studentId: user._id,
        testId: test._id, 
        status: 'in_progress',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + test.timeDuration * 60 * 60 * 1000), // Assuming timeDuration is in hours
    })
   const testJson = await getTestJson(testId)
   if(!testJson || testJson.length===0){
    throw new ApiError(404, "Unable to create Test for user")
   }
   res.status(200).json(new ApiResponse(200, testJson, "Test Attempt Created Successfully"))
})
// const getTestAttempt = asyncHandler(async(req, res)=>{
//     const {testId} = req.body
//     const testJson = await getTestJson(testId)
//     console.log("Test Json:", testJson)
//     if(!testJson || testJson.length===0){
//         throw new ApiError(404, "Unable to create Test for user")
//     }
//     res.status(200).json(new ApiResponse(200, testJson, "Test Attempt Created Successfully"))
// })


export {getTestAttempt}