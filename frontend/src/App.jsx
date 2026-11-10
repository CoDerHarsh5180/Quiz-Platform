import HomePage from './pages/HomePage'
import { useAuth } from './context/teacherContext.jsx'
import { Routes, Route } from 'react-router'
import MyTests from './pages/MyTests'
import LoginPage from './forms/login.jsx'
import RegisterPage from './forms/Register.jsx'
import CreateTest from './forms/CreateTest.jsx'
import { TestProvider } from './context/testContext.jsx'
import { Toaster } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

function App() {
  const { loginForm, registerForm, createTestForm, loading } = useAuth()

  // ── 19. Global auth loading guard ──
  // Show a full-screen spinner while the initial /show request resolves,
  // so no page flashes the wrong state before auth is known.
  if (loading) {
    return (
      <div className='fixed inset-0 bg-gray-900 flex items-center justify-center'>
        <Loader2 size={48} className='animate-spin text-orange-200' />
      </div>
    )
  }

  return (
    <TestProvider>
      <div>
        <Toaster position='top-right' />
        <Routes>
          <Route index path="/" element={<HomePage />} />
          <Route path="/mytests" element={<MyTests />} />
        </Routes>

        {/* LoginPage owns its own backdrop */}
        {loginForm && <LoginPage />}

        {/* RegisterPage owns its own backdrop */}
        {registerForm && <RegisterPage />}

        {/* CreateTest owns its own backdrop */}
        {createTestForm && <CreateTest />}
      </div>
    </TestProvider>
  )
}

export default App
