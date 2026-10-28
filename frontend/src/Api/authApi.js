import {axiosInstance} from "./apirequests";
import toast from "react-hot-toast";



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
        console.log(e)
        toast.error("Some Error Occured")
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
        toast.error("Incorrect OTP")
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
        toast.error("Failed to Login")
        throw new Error('Failed to login');
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
        toast.error("Request Failed")
        throw new Error('Failed to logout');
    }
}

const showData = async()=>{
    try{
        const response = await axiosInstance.get('/show', {withCredentials:true});
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to fetch data');
    }
}

export {
    registerUser,
    verifyOTP, 
    loginUser,
    logoutUser,
    showData
}