import React from 'react'
import {useAuth} from '../context/teacherContext.jsx'
import Navbar from '../Components/Navbar.jsx'
function MyTests() {
    const {user, loading, setLoginForm} = useAuth()
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
    if(!user.tests){
        return(
            <div className='bg-gray-900 text-white'>
                <Navbar />
                <div className='flex items-center justify-center h-screen flex-col'>
                    <h1 className='text-2xl font-bold'>NO TESTS FOUND</h1>
                    <h3>Create your first test now</h3>
                    <br />
                    <button 
                        onClick={()=>{}}
                        className='p-2 bg-orange-200 text-black font-bold rounded'
                    >Create New Test</button>
                </div>
            </div>
        )
    }

    const [tests, setTests] = useState('')
    setTests(user.tests)
  return (
    <div>

    </div>
  )
}

export default MyTests