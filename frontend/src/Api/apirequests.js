import axios from 'axios';
import {toast} from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api/v1'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});





const registerUser = async(name, email, username, experience, field, password)=>{
    try {
        const response = await axiosInstance.post('/register', {name, email, username, experience, field, password}, {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to register');
    }
}

const verifyOTP = async(name,email, username, experience, field, password, otp)=>{
    try {
        const response = await axiosInstance.post('/register/otp', {name, email, username, experience, field, password, otp}, {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to verify OTP');
    }
}

const loginUser = async(identifier, password)=>{
    try {
        const response = await axiosInstance.post('/login', {username: identifier, email: identifier, password}, {withCredentials:true});
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
        const res = await axiosInstance.post('/test/createStructure', { name, totalMarks, timeDuration, noOfSec, noOfSub, subjects}, {withCredentials:true})
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
        const res = await axiosInstance.post('/test/createSection', {testId, plusMarks, minusMarks, instructions, numOfQues, typeOfQues, UserSection}, {withCredentials:true})
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

const getSection = async(secName)=>{
    try{
        const res = await axiosInstance.post('/test/getSection', {secName}, {withCredentials:true})
        return res.data
    }
    catch(e){
        throw new Error(501, e)
    }
}

export default axiosInstance;
export {loginUser, showData, logoutUser, registerUser, verifyOTP, createStructure, getStructure, EditTheSection, getSection};