import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = 'http://localhost:3000/api/v1'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
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
        return response.data;
    }catch(e){
        throw new Error('Failed to logout');
    }
}

export default axiosInstance;
export {loginUser, showData, logoutUser, registerUser, verifyOTP};