import React from 'react'
import {useAuth} from '../context/teacherContext.jsx'
import Navbar from '../Components/Navbar.jsx'
import { useTest } from '../context/testContext.jsx'
import TestItem from '../Components/TestItem.jsx'
import EditSection from '../forms/EditSection.jsx'
function MyTests() {
    const {testArray, loading1} = useTest()
   
    if(!loading1) console.log(testArray)
    const {user, loading, setLoginForm, setCreateTestForm} = useAuth()
    if(!user){
        return(
            <div className='bg-gray-900 text-white'>
                <Navbar />
                <div className='flex items-center justify-center h-screen flex-col'>
                    <h1 className='text-2xl font-bold'>Please Login to view your tests</h1>
                    <br />
                    <button 
                        onClick={()=>{setLoginForm(true)}}
                        className='p-2 bg-orange-200 text-black font-bold rounded'
                    >Login Now</button>
                </div>
            </div>
            
        )
    }
    if(!user.data.tests){
        return(
            <div className='bg-gray-900 text-white'>
                <Navbar />
                <div className='flex items-center justify-center h-screen flex-col'>
                    <h1 className='text-2xl font-bold'>NO TESTS FOUND</h1>
                    <h3>Create your first test now</h3>
                    <br />
                    <button 
                        onClick={()=>{setCreateTestForm(true)}}
                        className='p-2 bg-orange-200 text-black font-bold rounded'
                    >Create New Test</button>
                </div>
            </div>
        )
    }

    
  return (
    
    <div className='bg-gray-900 text-white '>
       <Navbar />
       <div className='px-10 py-4 space-y-4  bg-gray-800 rounded min-h-screen w-full flex flex-col items-center'>
        {!loading1 &&
           testArray.map((t)=>{
            console.log(t)
                return( 
                    <div className=' lg:w-2/3 md:w-4/5 w-full'>
                        <TestItem id={t.data._id} name={t.data.name} totalMarks={t.data.totalMarks} timeDuration={t.data.timeDuration} noOfSec={t.data.noOfSec} isSection={(t.data.sections.length>0)}/>
                    </div>
            )
               
           })
        }
        </div>

    </div>
    
  )
}

export default MyTests