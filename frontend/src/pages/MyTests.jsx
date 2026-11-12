import React from 'react'
import { useAuth } from '../context/teacherContext.jsx'
import Navbar from '../Components/Navbar.jsx'
import { useTest } from '../context/testContext.jsx'
import TestItem from '../Components/TestItem.jsx'
import { Loader2 } from 'lucide-react'

function MyTests() {
    const { testArray, loading1 } = useTest()
    const { user, loading, setLoginForm, setCreateTestForm } = useAuth()

    if (loading) {
        return (
            <div className='bg-[var(--color-bg-page)] text-[var(--color-text-primary)] min-h-screen flex items-center justify-center'>
                <Loader2 className='animate-spin text-[var(--color-primary-text)]' size={40} />
            </div>
        )
    }

    if (!user) {
        return (
            <div className='bg-[var(--color-bg-page)] text-[var(--color-text-primary)]'>
                <Navbar />
                <div className='flex items-center justify-center h-screen flex-col gap-4'>
                    <h1 className='text-2xl font-bold'>Please Login to view your tests</h1>
                    <button
                        onClick={() => setLoginForm(true)}
                        className='p-2 px-5 bg-[var(--color-primary-light)] text-[var(--color-text-dark)] font-bold rounded hover:bg-[var(--color-primary-light-hover)] transition'
                    >
                        Login Now
                    </button>
                </div>
            </div>
        )
    }

    if (!user?.tests?.length) {
        return (
            <div className='bg-[var(--color-bg-page)] text-[var(--color-text-primary)]'>
                <Navbar />
                <div className='flex items-center justify-center h-screen flex-col gap-4'>
                    <h1 className='text-2xl font-bold'>NO TESTS FOUND</h1>
                    <h3 className='text-[var(--color-text-muted)]'>Create your first test now</h3>
                    <button
                        onClick={() => setCreateTestForm(true)}
                        className='p-2 px-5 bg-[var(--color-primary-light)] text-[var(--color-text-dark)] font-bold rounded hover:bg-[var(--color-primary-light-hover)] transition'
                    >
                        Create New Test
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-[var(--color-bg-page)] text-[var(--color-text-primary)]'>
            <Navbar />
            <div className='px-10 py-4 space-y-4 bg-[var(--color-bg-card)] rounded min-h-screen w-full flex flex-col items-center'>
                {loading1 ? (
                    <div className='flex items-center justify-center h-64'>
                        <Loader2 className='animate-spin text-[var(--color-primary-text)]' size={36} />
                    </div>
                ) : (
                    testArray.map((t, index) => (
                        <div key={t?.data?._id ?? index} className='lg:w-2/3 md:w-4/5 w-full'>
                            <TestItem
                                id={t.data._id}
                                name={t.data.name}
                                totalMarks={t.data.totalMarks}
                                timeDuration={t.data.timeDuration}
                                noOfSec={t.data.noOfSec}
                                isSection={(t.data.sections.length > 0)}
                                createdBy={t.data.createdBy}
                                subjects={t.data.subjects}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default MyTests
