import axios from 'axios';
import {toast} from 'react-hot-toast';
import dataURLtoFile from '../utils/URLtoFile';
const API_BASE_URL = 'http://localhost:3000/api/v1'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const axiosAI = axios.create({
    baseURL: API_BASE_URL
})




const registerUser = async(name, email, username, experience, field, password)=>{
    try {
        const response = await axiosInstance.post('/register', {
            name, 
            email, 
            username, 
            experience, 
            field, 
            password
        }, {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to register');
    }
}

const verifyOTP = async(name,email, username, experience, field, password, otp)=>{
    try {
        const response = await axiosInstance.post('/register/otp', {
            name, 
            email, 
            username, 
            experience, 
            field, 
            password, 
            otp
        }, {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to verify OTP');
    }
}

const loginUser = async(identifier, password)=>{
    try {
        const response = await axiosInstance.post('/login', {
            username: identifier, 
            email: identifier, 
            password
        }, {withCredentials:true});
        console.log(response.data);
        window.location.reload();
        toast.success("Logged In Successfully")
        return response.data;
    }catch(e){
        throw new Error('Failed to login');
    }
}


const showData = async()=>{
    try{const cookie = document.cookie.includes("accessToken")}catch(e){return null}
    try{
        
        const response = await axiosInstance.get('/show', {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        return null;
        throw new Error('Failed to fetch data');
    }
}

const logoutUser = async()=>{
    try{
        const response = await axiosInstance.post('/logout', {}, {withCredentials:true});
        window.location.reload();
        console.log(response.data);
        toast.success("Logged Out Successfully")
        return response.data;
    }catch(e){
        throw new Error('Failed to logout');
    }
}

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
        throw new Error('Failed to create')
    }    

}

const getSection = async(secName, id)=>{
    try{
        const res = await axiosInstance.post('/test/getSection', {secName, id}, {withCredentials:true})
        return res.data
    }
    catch(e){
        throw new Error(501, e)
    }
}

const createQuestion = async (text, sectionName, options, correctAnswer, subject, testId, img) => {
    try {
        const formData = new FormData();
        
        formData.append('text', text);
        formData.append('sectionName', sectionName);
        formData.append('correctAnswer', correctAnswer);
        formData.append('subject', subject);
        formData.append('testId', testId);
        formData.append('options', JSON.stringify(options)); 

        // If an image exists, convert it and append it as a file
        if (img) {
            const imageFile = dataURLtoFile(img, 'question-image.jpg');
            formData.append('image', imageFile); 
        }

        const res = await axiosInstance.post('/test/createQuestion', formData, {withCredentials: true,});
        console.log(res.data)
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to create question";
        throw new Error(errorMessage);
    }
};

const createQuestionAI = async (promptImg, referenceImg, subject, testId, secName) => {
    try {
        const formData = new FormData();
        formData.append('subject', subject);
        if (promptImg) {
            const promptFile = dataURLtoFile(promptImg, 'prompt-image.jpg');
            formData.append('prompt', promptFile); 
        }

        if (referenceImg) {
            const refFile = dataURLtoFile(referenceImg, 'reference-image.jpg');
            formData.append('image', refFile); 
        }
        formData.append('testId', testId)
        formData.append('sectionName', secName)
        const res = await axiosAI.post('/test/createQuesUsingAI', formData, {withCredentials: true});
    console.log("Question Created")
        
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to create AI question";
        throw new Error(errorMessage);
    }
};


export default axiosInstance;
export {
    loginUser, 
    showData, 
    logoutUser, 
    registerUser, 
    verifyOTP, 
    createStructure, 
    getStructure, 
    EditTheSection, 
    getSection, 
    createQuestion, 
    createQuestionAI
};