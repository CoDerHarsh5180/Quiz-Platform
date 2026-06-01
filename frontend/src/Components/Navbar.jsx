import React from 'react'
import {Menu} from 'lucide-react'
import { useState } from 'react'
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className='flex justify-between p-5 lg:p-10 items-center bg-black/20 z-40'>
        <div className='text-4xl font-bold p-2'>प्रश्णोत्तर</div>
        <div className='text-white hidden gap-5 p-5 md:flex'>
            <button>Home</button>
            <div>|</div>
            <button>Create new test</button>
            <div>|</div>
            <button>My Tests</button>
            <div>|</div>
            <button>Register</button>
            <div>|</div>
            <button>Login</button>
        </div>
        <button className='md:hidden border p-1 rounded z-50' onClick={()=>{setMenuOpen(prev=>!prev)}}><Menu /></button>
        {menuOpen && <div className='w-full bg-gray-700/30 flex flex-col gap-2 md:hidden absolute top-24 p-5 left-0  rounded backdrop-blur-2xl'>
        
            <button>Home</button>
            <hr />
            <button>Create New Test</button>
            <hr />
            <button>My Tests</button>
            <hr />
            <button>Register</button>
            <hr />
            <button>Login</button>
          </div>}
    </div>
    
  )
}

export default Navbar