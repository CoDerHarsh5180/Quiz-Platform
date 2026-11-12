import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.jsx'
import {TeacherProvider} from './context/teacherContext.jsx'
import { BrowserRouter } from 'react-router'
createRoot(document.getElementById('root')).render(
<BrowserRouter>
  
    
    <TeacherProvider>
      <App />
    </TeacherProvider>
    
  
  </BrowserRouter>
)
