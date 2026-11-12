import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import FeaturesPart from '../Components/FeaturesPart'

function HomePage() {
 
  return (
    <div>
        <div className='bg-[var(--color-bg-page)] text-[var(--color-text-primary)] w-full max-h-full'>
            <Navbar />
            <HeroSection />
        </div>
        <FeaturesPart />
    </div>
  )
}

export default HomePage