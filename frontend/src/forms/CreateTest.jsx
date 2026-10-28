import React, { useState } from 'react'
import {X} from 'lucide-react'
import { useAuth } from '../context/teacherContext'
import { createStructure } from '../Api/structureApi';
function CreateTest() {
    const { setCreateTestForm, user} = useAuth();
    const [name, setName] = useState('');
    const [totalMarks, setTotalMarks] = useState(0)
    const [timeDuration, setTimeDuration] = useState(0)
    const [noOfSub, setNoOfSub] = useState(1)
    const [subjects, setSubjects] = useState([''])
    const [noOfSec, setNoOfSec] = useState(0)
  return (
    <div className='bg-white p-10 rounded relative h-5/8'>
        <span className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={()=>{setCreateTestForm(false)}}>
            <X />
        </span>
        <h2 className="text-2xl font-semibold text-center mb-2">Create a new test Structure</h2>
        <div className="space-y-2 sm:grid grid-cols-2 gap-2 overflow-y-scroll p-20 border max-h-5/6">
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Title
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
                Total Marks
            </label>
            <input
                type="text"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="Total Marks"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Duration in hours
            </label>
            <input
                type="text"
                value={timeDuration}
                onChange={(e) => setTimeDuration(e.target.value)}
                placeholder="Time Duration of the test"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
            />
        </div>


        <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Sections
            </label>
            <input
                type="number"
                value={noOfSec}
                onChange={(e) => setNoOfSec(e.target.value)}
                placeholder="Add Number of Section"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
            />
        </div>


        <div>
            <label className="block text-sm font-medium text-gray-700">
                Number of Subjects
            </label>
            <input
                type="number"
                value={noOfSub}
                onChange={(e) =>{
                    setNoOfSub(e.target.value)
                    setSubjects(prev=>{
                        let arr = []
                        for(let i=0;i<e.target.value;i++){
                            arr.push('');
                        }
                        return arr
                    })
                }}
                placeholder="No of Subjects"
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                required
                min={1}
            />
        </div>
        {subjects.map((s, i)=>{
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Subjects {i+1}
                    </label>
                    <input 
                        type="text"
                        onChange={(e) =>{
                            setSubjects(prev=>{
                                const arr = [...prev]
                                arr[i] = e.target.value
                                return arr
                            })
                        }}
                        placeholder="Subject"
                        className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
                        required
                    />
                </div>
            )})    
        } 
        </div>

        <button 
        className='w-full bg-violet-500 text-white py-2 rounded-md'
        onClick={async()=>{
            console.log( name, totalMarks, timeDuration, noOfSub, subjects)
            await createStructure( name, totalMarks, timeDuration, noOfSec, noOfSub, subjects)
            setCreateTestForm(false)
     }}>Create</button>
    </div>
)}

export default CreateTest