import React from 'react'
import {Menu} from 'lucide-react'
import { useState } from 'react'
import { loginUser } from '../Api/apirequests'
import LoginPage from '../forms/login'
import { useAuth } from '../context/teacherContext.jsx'
import {logoutUser} from '../Api/apirequests'
function Navbar() {
  const {user, loading} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginForm, setLoginForm] = useState(false)
  const handleLoginClick = ()=>{
    setLoginForm(true)
  }
  const cancelLogin = ()=>{
    setLoginForm(false)
  }
  return (
    <div className='flex justify-between p-5 lg:p-10 items-center bg-black/20 z-40'>
        <div className='text-4xl font-bold p-2'>प्रश्णोत्तर</div>
        <div className='text-white hidden gap-2 p-5 md:flex'>
            <button>Home</button>
            <div>|</div>
            <button>Create new test</button>
            <div>|</div>
            <button>My Tests</button>
            <div>|</div>
            {!user && <button>Register</button>}
            {!loading && user && <div>{user.data.email}</div>}
            <div>|</div>
              {!user &&
            <button onClick={handleLoginClick}>Login</button>}
            {user&& <button onClick={logoutUser}>Logout</button>}
            
        </div>
        <button className='md:hidden border p-1 rounded z-50' onClick={()=>{setMenuOpen(prev=>!prev)}}><Menu /></button>
        {menuOpen && <div className='w-full bg-gray-700/30 flex flex-col gap-2 md:hidden absolute top-24 p-5 left-0  rounded backdrop-blur-2xl'>
        
            <button>Home</button>
            <hr />
            <button>Create New Test</button>
            <hr />
            <button>My Tests</button>
            <hr />
            {user && <div className='text-center'>{user.data.email}</div>}
            {!user &&<button>Register</button>}
            <hr />
            {!user &&<button onClick={handleLoginClick}>Login</button>}
            {user&& <button onClick={logoutUser}>Logout</button>}
          </div>}


          {loginForm && <div className='fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
            <LoginPage cancel={cancelLogin} />
          </div>}
    </div>
    
  )
}

export default Navbar