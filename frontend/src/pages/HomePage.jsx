import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import { showData } from '../Api/apirequests'
import { useEffect } from 'react'
import FeaturesPart from '../Components/FeaturesPart'

function HomePage() {
 
  return (
    <div>
        <div className='bg-gray-900 text-white w-full'>
            <Navbar />
            <HeroSection />
        </div>
        <FeaturesPart />
    </div>
  )
}

export default HomePage