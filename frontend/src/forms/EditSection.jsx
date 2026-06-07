import React from 'react'
import { useTest } from '../context/testContext';
import { useState } from 'react';
import { EditTheSection } from '../Api/apirequests';
import {X} from 'lucide-react'
function EditSection({id, noOfSec}) {
    const {testArray, loading1, setSectionEditing} = useTest()
    const [section, setSection] = useState("")
    const [positiveMarks, setPositiveMarks] = useState(0)
    const [negativeMarks, setNegativeMarks] = useState(0)
    const [instructions, setInstructions] = useState("")
    const [noOfQues, setNoOfQues]=useState(0)
    const [typeOfQues, setTypeOfQues] = useState('MCQ')
  return (
    <div>
        <div className="flex items-center justify-center  ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative">
        <span className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={()=>{setSectionEditing(false)}}>
          <X />
        </span>
        <h2 className="text-2xl font-semibold text-center mb-2">EDIT YOUR SECTION FROM HERE</h2>
            <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Section
            </label>
            <select name="Section" id=""
                value={section}
                onChange={(e) => setSection((e.target.value=="None")?(null):(e.target.value))}
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"    
            >
                <option value="None">None</option>
                {
              Array.from({length:noOfSec}, (_,i)=>(
                <option value={String.fromCharCode(65+i)} className='text-sm bg-gray-600'>Section {String.fromCharCode(65+i)}</option>
              ))
            }
            </select>
          </div>

          <div className=''>
            <label className="block text-sm font-medium text-gray-700">
              +ve Marks
            </label>
            <input
              type="number"
              value={positiveMarks}
              onChange={(e) => setPositiveMarks(e.target.value)}
              placeholder="Positive Marks"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          

          <label className="block text-sm font-medium text-gray-700">
              -ve Marks
            </label>
            <input
              type="number"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(e.target.value)}
              placeholder="Negative Marks"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instruction
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="instructions"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">
              Number of Questions
            </label>
            <input
              type="number"
              value={noOfQues}
              onChange={(e) => setNoOfQues(e.target.value)}
              placeholder="Add Number of Questions"
              className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              required
            />
          </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Type of Question
              </label>
              <select
                value={typeOfQues}
                onChange={(e) => setTypeOfQues(e.target.value)}
                className="text-black mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
              >
                
                <option value="MCQ">MCQ</option>
                <option value="MSQ">MSQ</option>
                <option value="NUMERICAL">NUMERICAL</option>
                <option value="TRUE/FALSE">TRUE/FALSE</option>
                <option value="DESCRIPTIVE">DESCRIPTIVE</option>
              </select>
            </div>

         
            <button
              onClick={(e) => {
                e.preventDefault();
                EditTheSection(id, section, positiveMarks, negativeMarks, instructions, noOfQues, typeOfQues)
              }}
              className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-600 transition"
            >
                SAVE
            </button>
          
       


       
      </div>
    </div>
    </div>
  )
}

export default EditSection