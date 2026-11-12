import React from 'react'
import heroImg from './hero.png'
import { useAuth } from '../context/teacherContext.jsx'
function HeroSection() {
  const {user, loading, setCreateTestForm, setRegisterForm} = useAuth();
  return (
    <div className='p-5 w-full flex md:flex-row-reverse  flex-col items-center justify-center'>
        <div className='p-4 md:w-1/2'>
            
            <img src={heroImg}  alt="IMG" className='rounded-xl'/>
        </div>
        <div className='p-5 md:text-left text-center '>
            <div className='text-3xl text-[var(--color-primary-text)] lg:text-5xl'>
              Hello, {!user?(''):(user?.data?.name)}
            </div>
            <div className='text-3xl font-bold lg:text-6xl'>Welcome to प्रश्णोत्तर,</div>
            <div className='text-[var(--color-hero-subtitle)] lg:text-xl'>A Platform dedicated to Teachers to evaluate their Students</div>
            <br /> 
              <button className='bg-[var(--color-sky)] p-2 px-3 rounded-md shadow-2xl shadow-pink-400 text-xl' 
                onClick={()=>{
                  user?setCreateTestForm(true):setRegisterForm(true)
                }}
              >{user?'Create new Test':'Register Now'}</button>
        </div>
        
    </div>
  )
}

export default HeroSection