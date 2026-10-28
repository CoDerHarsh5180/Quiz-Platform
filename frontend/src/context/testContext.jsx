import { Children, createContext, useContext, useEffect, useState } from "react";
import { getStructure } from "../Api/structureApi";
import { useAuth } from "./teacherContext";

const TestContext = createContext(null);

export const TestProvider = ({children})=>{
    const [testArray, setTestArray] = useState([])
    const {user} = useAuth()
    const [loading1, setLoading] = useState(true)
    const tests = user?.tests
    const [sectionEditing, setSectionEditing] = useState(false)
    const [TestId, setTestId]= useState('')
    const [AddQues, setAddQues] = useState(false)
    const [sec, setSec] = useState(0)

    const openQuesAdder = (id)=>{
        setTestId(id)
        setAddQues(true)
    }
    const openSectionEditor = (id, sec)=>{
        setSectionEditing(true)
        setTestId(id)
        setSec(sec)
    }
    useEffect(()=>{
        if(user){
            console.log(user.data.tests)
            user.data.tests.map((t)=>{
                getStructure(t)
                .then((res)=>setTestArray(prev=>[...prev, res]))
                .then(()=>setLoading(false))
                .catch(e=>console.log(e))
            })
        }
        else console.log("Error")
    }, [user])

    return(
        <TestContext.Provider value={{testArray, loading1, sectionEditing, setSectionEditing, openSectionEditor, TestId, sec, openQuesAdder, AddQues, setAddQues}}>
            {children}
        </TestContext.Provider>
    )
}

export const useTest = ()=>useContext(TestContext)