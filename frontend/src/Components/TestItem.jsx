import React from 'react'
import { useTest } from '../context/testContext'
import EditSection from '../forms/EditSection'

function TestItem({name, totalMarks, timeDuration, isSection, createdBy, noOfSec, id}) {
  const {setSectionEditing, sectionEditing} = useTest()
  return (
    <div className='p-4 shadow-2xl bg-gray-900 rounded-xl '>
      <div className='flex p-4 justify-around shadow-2xl bg-gray-900 rounded-xl items-center'>
        <div className=''>
          <h1 className='md:text-3xl text-2xl'>{name}</h1>
          <h3 className='text-sm'>Total Marks: {totalMarks}</h3>
          <h4>Time Duration: {timeDuration}h</h4>
        </div>
        <div className=''>
          <select name="Section" id="Section" className='text-sm rounded-2xl border-white p-1'>
            {
              Array.from({length:noOfSec}, (_,i)=>(
                <option value={String.fromCharCode(65+i)} className='text-sm bg-gray-600'>Section {String.fromCharCode(65+i)}</option>
              ))
            }
          </select>
        </div>
      </div>
      <div className='flex justify-end gap-2'>
        <button
          className='p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50'
          onClick={()=>setSectionEditing(true)}
        >Edit Section</button>
        <button
          className='p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50'
          disabled = {!isSection}
        >Add Question</button>

      </div>
       {sectionEditing && 
      <div  className='fixed inset-0 w-full h-screen overflow-scroll bg-black/50 flex items-center justify-center z-50'>
        <EditSection id={id} noOfSec={noOfSec}/>
      </div>
       } 
    </div>
  )
}

export default TestItem

