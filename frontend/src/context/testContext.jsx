import { Children, createContext, useContext, useEffect, useState } from "react";
import { getStructure } from "../Api/apirequests";
import { useAuth } from "./teacherContext";

const TestContext = createContext(null);

export const TestProvider = ({children})=>{
    const [testArray, setTestArray] = useState([])
    const {user} = useAuth()
    const [loading1, setLoading] = useState(true)
    const tests = user?.tests
    const [sectionEditing, setSectionEditing] = useState(false)
    
    useEffect(()=>{
        if(user){
            console.log(user.data.tests)
            user.data.tests.map((t)=>{
                getStructure(t)
                .then((res)=>setTestArray(prev=>[...prev, res]))
                .then(()=>setLoading(false))
                //.then(()=>console.log(testArray))
                .catch(e=>console.log(e))
            })
        }
        else console.log("Error")
    }, [user])

    return(
        <TestContext.Provider value={{testArray, loading1, sectionEditing, setSectionEditing}}>
            {children}
        </TestContext.Provider>
    )
}

export const useTest = ()=>useContext(TestContext)