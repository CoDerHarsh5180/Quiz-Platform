import { useState } from 'react'
import HomePage from './pages/HomePage'
import { useAuth } from './context/teacherContext.jsx'
import {Loader2} from 'lucide-react'
import { Routes, Route } from 'react-router'
import MyTests from './pages/MyTests'
import LoginPage from './forms/login.jsx'
import RegisterPage from './forms/Register.jsx'
import CreateTest from './forms/CreateTest.jsx'
import { TestProvider } from './context/testContext.jsx'
import {Toaster} from 'react-hot-toast'
function App() {
  const {loginForm, registerForm, createTestForm} = useAuth()
  return (
    
    <TestProvider>
      <div>
        <Toaster position='top-right'/>
        <Routes>
          <Route index path="/" element={<HomePage />}></Route>
          <Route path="/mytests" element={<MyTests />}></Route>
        </Routes>
        {loginForm && <div className='fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
            <LoginPage  />
          </div>}
          {registerForm && <div className='fixed inset-0 w-full h-screen overflow-scroll bg-black/50 flex items-center justify-center z-50'>
            <RegisterPage />
          </div>}
            {createTestForm && <div className='fixed inset-0 w-full h-screen bg-black/50 flex items-center justify-center z-50'>
              <CreateTest />
            </div>}
        
      </div>
      
    </TestProvider>
  )
}

export default App
