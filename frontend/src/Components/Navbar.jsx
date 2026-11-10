import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { useAuth } from '../context/teacherContext.jsx'
import { logoutUser } from '../Api/authApi.js'
import { useNavigate } from 'react-router'

function Navbar() {
    const navigate = useNavigate()

    const { user, loading, setLoginForm, setRegisterForm, setCreateTestForm } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLoginClick = () => {
        setMenuOpen(false)
        setLoginForm(true)
    }


    const handleLogout = async () => {
        setMenuOpen(false)
        await logoutUser()
    }

    function handleTestFormForRegisteredUser() {
        setMenuOpen(false)
        if (!user) setLoginForm(true)
        else setCreateTestForm(true)
    }

 
    const goTo = (path) => {
        setMenuOpen(false)
        navigate(path)
    }

    return (
        <div className='flex justify-between p-5 lg:p-10 items-center bg-black/20 z-40 w-full relative'>
            <div className='text-4xl font-bold p-2'>प्रश्णोत्तर</div>

            {/* ── Desktop nav ── */}
            <div className='text-white hidden gap-2 p-5 md:flex items-center'>
                <button onClick={() => goTo('/')}>Home</button>
                <div>|</div>
                <button onClick={handleTestFormForRegisteredUser}>Create new test</button>
                <div>|</div>
                <button onClick={() => goTo('/mytests')}>My Tests</button>
                {!user && <div>|</div>}
                {!user && (
                    <button onClick={() => { setMenuOpen(false); setRegisterForm(true) }}>
                        Register
                    </button>
                )}
                <div>|</div>
                {!user && !loading && (
                    <button onClick={handleLoginClick}>Login</button>
                )}
                {!loading && user && (
                    <>
                        <span>{user?.email}</span>
                        <div>|</div>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
                className='md:hidden border p-1 rounded z-50'
                onClick={() => setMenuOpen(prev => !prev)}
            >
                <Menu />
            </button>

            {/* ── Mobile dropdown menu ── */}
            {menuOpen && (
                <div className='w-full bg-gray-700/30 flex flex-col gap-2 md:hidden absolute top-24 p-5 left-0 rounded backdrop-blur-2xl z-40'>
                    <button onClick={() => goTo('/')}>Home</button>
                    <hr />
                    <button onClick={handleTestFormForRegisteredUser}>Create New Test</button>
                    <hr />
                    <button onClick={() => goTo('/mytests')}>My Tests</button>
                    <hr />
                    {user && <div className='text-center'>{user?.email}</div>}
                    {!user && (
                        <button onClick={() => { setMenuOpen(false); setRegisterForm(true) }}>
                            Register
                        </button>
                    )}
                    <hr />
                    {!user && <button onClick={handleLoginClick}>Login</button>}
                    {user && <button onClick={handleLogout}>Logout</button>}
                </div>
            )}
        </div>
    )
}

export default Navbar
