import React from 'react'
import useAuth from '../context/teacherContext'

function LoginWarning() {
  const { setLoginForm, setLoginWarning } = useAuth()

  return (
    <div>
        <div className='fixed inset-0 w-full h-screen bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-[var(--color-modal-bg)] p-6 rounded-lg shadow-lg text-center'>
                <h2 className='text-xl font-semibold mb-4'>Login Required</h2>
                <p className='mb-4'>You need to be logged in to access this feature.</p>
                <button className='px-4 py-2 bg-[var(--color-blue)] text-white rounded-lg hover:bg-[var(--color-blue-hover)]' onClick={() => {
                    setLoginForm(true);
                    setLoginWarning(false)
                }}>
                    Go to Login
                </button>
            </div>
        </div>
    </div>
  )
}

export default LoginWarning