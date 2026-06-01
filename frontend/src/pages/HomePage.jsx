import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
function HomePage() {
  return (
    <div>
        <div className='bg-gray-900 text-white w-full'>
            <Navbar />
            <HeroSection />
        </div>
    </div>
  )
}

export default HomePage