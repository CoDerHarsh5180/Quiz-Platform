import { useState } from 'react'
import HomePage from './pages/HomePage'
import FeaturesPart from './Components/FeaturesPart'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <HomePage />
      <FeaturesPart />
    </div>
  )
}

export default App
