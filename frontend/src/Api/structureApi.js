import {axiosInstance} from "./apirequests";

const createStructure = async(name, totalMarks,timeDuration, noOfSec, noOfSub, subjects)=>{
    try{
        const res = await axiosInstance.post('/test/createStructure', { 
            name, 
            totalMarks, 
            timeDuration, 
            noOfSec, 
            noOfSub, 
            subjects
        }, {withCredentials:true})
        console.log(res.data);
        toast.success("Structure Created Successfully")
        return res.data;
    }
    catch(e){
        toast.error("Request Failed")
        console.log(e);
    }
    
}

const getStructure = async(testId)=>{
    try{
        const res = await axiosInstance.post('/test/getStructure',{testId}, {withCredentials:true})
        console.log(res.data);
        return res.data;
    }
    catch(e){
        toast.error("Request Failed")
        console.log(e);
    }
}

const EditTheSection = async(testId,UserSection, plusMarks, minusMarks, instructions, numOfQues, typeOfQues)=>{
    try{
        const res = await axiosInstance.post('/test/createSection', {
            testId, 
            plusMarks, 
            minusMarks, 
            instructions, 
            numOfQues, 
            typeOfQues, 
            UserSection
        }, 
        {withCredentials:true})
        console.log(res.data);
        if(UserSection){
            toast.success("Section Edited Successfully")
        }
        else{
            toast.success("Section Added Successfully")
        }
        return res.data;
    }
    catch(e){
        toast.error("Request Failed")
        throw new Error('Failed to create')
    }    

}

const getSection = async(secName, id)=>{
    try{
        const res = await axiosInstance.post('/test/getSection', {secName, id}, {withCredentials:true})
        return res.data
    }
    catch(e){
        toast.error("Request Failed")
        throw new Error(501, e)
    }
}

export {
    createStructure,
    getStructure,
    getSection,
    EditTheSection
}