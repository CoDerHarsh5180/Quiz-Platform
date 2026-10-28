import {axiosInstance} from "./apirequests";
import { axiosAI } from "./apirequests";
import {toast} from 'react-hot-toast';
import dataURLtoFile from '../utils/URLtoFile';


const createQuestion = async (text, sectionName, options, correctAnswer, subject, testId, img, setLoading) => {
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
        setLoading(false)
        toast.success("Question Added Successfully")
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to create question";
        toast.error("Request Failed")
        throw new Error(errorMessage);
    }
};


const createQuestionAI = async (promptImg, referenceImg, subject, testId, secName, setLoading) => {
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
        setLoading(false)
        toast.success("Question Added Successfully")
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to create AI question";
        toast.error("Request Failed")
        throw new Error(errorMessage);
    }
};


const getQuestions = async (testId) => {
    try {
        const res = await axiosInstance.post('/test/getQuestions', { testId }, { withCredentials: true });
        console.log(res.data);
        return res.data;
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to fetch questions";
        toast.error("Request Failed")
        throw new Error(errorMessage);
    }   
}


const editQuestion = async (questionId, text, options, correctAnswer, subject, img) => {
    try {
        const formData = new FormData()
        formData.append('questionId', questionId)
        if (text)          formData.append('text', text)
        if (options)       formData.append('options', JSON.stringify(options))
        if (correctAnswer) formData.append('correctAnswer', correctAnswer)
        if (subject)       formData.append('subject', subject)
        if (img) {
            const imageFile = dataURLtoFile(img, 'question-image.jpg')
            formData.append('image', imageFile)
        }
        const res = await axiosInstance.put('/test/editQuestion', formData, { withCredentials: true })
        console.log(res.data)
        toast.success("Question updated successfully")
        return res.data
    } catch (e) {
        const errorMessage = e.response?.data?.message || e.message || "Failed to update question"
        toast.error("Request Failed")
        throw new Error(errorMessage)
    }
}


export{
    createQuestion,
    createQuestionAI,
    getQuestions,
    editQuestion
}