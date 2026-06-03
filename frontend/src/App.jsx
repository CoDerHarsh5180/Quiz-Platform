import { useState } from 'react'
import HomePage from './pages/HomePage'
import FeaturesPart from './Components/FeaturesPart'
import {TeacherProvider} from './context/teacherContext.jsx'
import { useAuth } from './context/teacherContext.jsx'
import {Loader2} from 'lucide-react'
function App() {
  return (
    
   
      <div>
        <HomePage />
        <FeaturesPart />
      </div>

  )
}

export default App
