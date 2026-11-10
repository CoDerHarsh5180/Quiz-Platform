import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/teacherContext'
import { createStructure } from '../Api/structureApi';

function CreateTest() {
    const { setCreateTestForm } = useAuth();
    const [name, setName] = useState('');
    const [totalMarks, setTotalMarks] = useState('');
    const [timeDuration, setTimeDuration] = useState('');
    const [noOfSub, setNoOfSub] = useState(1);
    const [subjects, setSubjects] = useState(['']);
    const [noOfSec, setNoOfSec] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleCreate = async () => {
        setSubmitting(true);
        try {
            await createStructure(name, totalMarks, timeDuration, noOfSec, noOfSub, subjects);
            setCreateTestForm(false);
        } catch {
            // toast already shown inside createStructure
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubjectCountChange = (val) => {
        const count = Math.max(1, Number(val));
        setNoOfSub(count);
        setSubjects(prev => {
            const updated = [...prev];
            // Grow: add empty strings
            while (updated.length < count) updated.push('');
            // Shrink: trim the end (preserving what user typed)
            return updated.slice(0, count);
        });
    };

    return (
        // Backdrop — click outside to close
        <div
            className='fixed inset-0 w-full h-screen bg-black/50 flex items-center justify-center z-50'
            onClick={() => setCreateTestForm(false)}
        >
            {/* Card */}
            <div
                className='bg-white rounded-xl relative w-full max-w-lg mx-4 max-h-[90vh] flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='p-6 pb-2 border-b'>
                    <h2 className="text-2xl font-semibold text-center">Create a new Test Structure</h2>
                    <span
                        className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => setCreateTestForm(false)}
                    >
                        <X />
                    </span>
                </div>

                {/* Scrollable body */}
                <div className='overflow-y-auto p-6 flex-1'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Title of the test"
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                            <input
                                type="number"
                                value={totalMarks}
                                onChange={(e) => setTotalMarks(e.target.value)}
                                placeholder="Total Marks"
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time Duration (hours)</label>
                            <input
                                type="number"
                                value={timeDuration}
                                onChange={(e) => setTimeDuration(e.target.value)}
                                placeholder="e.g. 3"
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Sections</label>
                            <input
                                type="number"
                                value={noOfSec}
                                onChange={(e) => setNoOfSec(e.target.value)}
                                placeholder="Number of Sections"
                                min={0}
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Number of Subjects</label>
                            <input
                                type="number"
                                value={noOfSub}
                                onChange={(e) => handleSubjectCountChange(e.target.value)}
                                placeholder="No of Subjects"
                                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                required
                                min={1}
                            />
                        </div>

                        {subjects.map((s, i) => (
                            <div key={i}>
                                <label className="block text-sm font-medium text-gray-700">
                                    Subject {i + 1}
                                </label>
                                <input
                                    type="text"
                                    value={s}
                                    onChange={(e) => {
                                        setSubjects(prev => {
                                            const arr = [...prev];
                                            arr[i] = e.target.value;
                                            return arr;
                                        });
                                    }}
                                    placeholder="Subject name"
                                    className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky footer button */}
                <div className='p-6 pt-3 border-t'>
                    <button
                        className='w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition disabled:opacity-50'
                        onClick={handleCreate}
                        disabled={submitting}
                    >
                        {submitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateTest
