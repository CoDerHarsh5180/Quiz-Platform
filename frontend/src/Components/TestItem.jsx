import React, { useState } from 'react'
import { useTest } from '../context/testContext'
import EditSection from '../forms/EditSection'
import CreateQuestion from '../forms/CreateQuestion'
import QuestionDetails from './QuestionDetails'

function TestItem({ name, totalMarks, timeDuration, isSection, noOfSec, id, subjects }) {
  const { setSectionEditing, sectionEditing, openSectionEditor, TestId, sec: sectionCount, openQuesAdder, AddQues, setAddQues } = useTest()
  const [details, setDetails] = useState(false)

  return (
    <div className='p-4 shadow-2xl bg-gray-900 rounded-xl space-y-2'>
      <div className='flex p-4 justify-between shadow-2xl bg-gray-900 rounded-xl items-center'>
        <div>
          <h1 className='md:text-3xl text-2xl p-1 uppercase font-semibold'>{name}</h1>
          <h3 className='text-xs md:text-sm font-light'>Total Marks: <span className='font-bold'>{totalMarks}</span></h3>
          <h4 className='text-xs md:text-sm font-light'>Time Duration: <span className='font-bold'>{timeDuration} hours</span></h4>
        </div>
        <div>
          <div>
            {noOfSec > 0 && <h3 className='text-sm'>Sections: {noOfSec}</h3>}
          </div>
          <div className='border-t-2 border-gray-800'>
            {subjects && subjects.length > 0 && (
              <h3 className='text-sm font-bold'>Subjects{
                subjects.map((sub, index) => (
                  <div key={index} className='font-light'> {sub}</div>
                ))
              }</h3>
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <button
          className='p-0.5 md:p-1 lg:p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer'
          onClick={() => setDetails(prev => !prev)}
        >
          {details ? 'Hide Details' : 'Get Details'}
        </button>
        <button
          className='p-0.5 md:p-1 lg:p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer'
          onClick={() => { openSectionEditor(id, noOfSec); setAddQues(false) }}
        >
          Edit Section
        </button>
        <button
          className='p-0.5 md:p-1 lg:p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer disabled:opacity-50'
          disabled={!isSection}
          onClick={() => { openQuesAdder(id); setSectionEditing(false) }}
        >
          Add Question
        </button>
      </div>

      {/* ── 16. Pass `sectionCount` (the actual count stored in context) to EditSection ── */}
      {sectionEditing && id === TestId && (
        <EditSection id={TestId} noOfSec={sectionCount} />
      )}
      {AddQues && id === TestId && (
        <CreateQuestion id={TestId} sec={noOfSec} />
      )}
      {details && (
        <QuestionDetails id={id} onClose={() => setDetails(false)} />
      )}
    </div>
  )
}

export default TestItem
