import axios from 'axios';
import Cookies from 'js-cookie';
const API_BASE_URL = 'http://localhost:3000/api/v1'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

const loginUser = async(identifier, password)=>{
    try {
        const response = await axiosInstance.post('/login', {username: identifier, email: identifier, password}, {withCredentials:true});
        console.log(response.data);
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
        console.log(response.data);
        return response.data;
    }catch(e){
        throw new Error('Failed to logout');
    }
}

export default axiosInstance;
export {loginUser, showData, logoutUser};