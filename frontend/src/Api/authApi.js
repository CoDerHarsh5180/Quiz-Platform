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
        });
        console.log(response.data);
        toast.success("OTP Sent Successfully! Check your email.");
        return response.data;
    }catch(e){
        console.log(e);
        toast.error("Some Error Occurred");
        throw new Error('Failed to register');
    }
}

const verifyOTP = async(name, email, username, experience, field, password, otp)=>{
    try {
        const response = await axiosInstance.post('/register/otp', {
            name, 
            email, 
            username, 
            experience, 
            field, 
            password, 
            otp
        });
        console.log(response.data);
        toast.success("Account created successfully! Please login.");
        return response.data;
    }catch(e){
        toast.error("Incorrect OTP");
        throw new Error('Failed to verify OTP');
    }
}

const loginUser = async(identifier, password)=>{
    console.log("Login API called with identifier:", identifier, "and password:", password);
    try {
        const response = await axiosInstance.post('/login', {
            username: identifier, 
            email: identifier, 
            password
        });
        console.log(response.data);
        toast.success("Logged In Successfully");
        setTimeout(() => window.location.reload(), 800);
        return response.data;
    }catch(e){
        toast.error("Failed to Login");
        console.log(`Error: ${e}`);

        throw new Error('Failed to login');
    }
}


const logoutUser = async()=>{
    try{
        const response = await axiosInstance.post('/logout', {});
        console.log(response.data);
        toast.success("Logged Out Successfully");
        setTimeout(() => window.location.reload(), 800);
        return response.data;
    }catch(e){
        toast.error("Request Failed");
        throw new Error('Failed to logout');
    }
}

const showData = async()=>{
    try{
        const response = await axiosInstance.get('/show');
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
