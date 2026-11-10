import React, { useState } from 'react'
import { useTest } from '../context/testContext'
import EditSection from '../forms/EditSection'
import CreateQuestion from '../forms/CreateQuestion'
import QuestionDetails from './QuestionDetails'

function TestItem({ name, totalMarks, timeDuration, isSection, createdBy, noOfSec, id, subjects }) {
  // ── 16. Rename context `sec` → `sectionCount` to avoid confusion with section char ──
  const { setSectionEditing, sectionEditing, openSectionEditor, TestId, sec: sectionCount, openQuesAdder, AddQues, setAddQues } = useTest()
  const [details, setDetails] = useState(false)

  return (
    <div className='p-4 shadow-2xl bg-gray-900 rounded-xl space-y-2'>
      <div className='flex p-4 justify-around shadow-2xl bg-gray-900 rounded-xl items-center'>
        <div>
          <h1 className='md:text-3xl text-2xl'>{name}</h1>
          <h3 className='text-sm'>Total Marks: {totalMarks}</h3>
          <h4>Time Duration: {timeDuration}h</h4>
        </div>
        <div>
          <div>
            {noOfSec > 0 && <h3 className='text-sm'>No of Sections: {noOfSec}</h3>}
          </div>
          <div>
            {subjects && subjects.length > 0 && (
              <h3 className='text-sm'>Subjects: {subjects.join(', ')}</h3>
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <button
          className='p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer'
          onClick={() => setDetails(prev => !prev)}
        >
          {details ? 'Hide Details' : 'Get Details'}
        </button>
        <button
          className='p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer'
          onClick={() => { openSectionEditor(id, noOfSec); setAddQues(false) }}
        >
          Edit Section
        </button>
        <button
          className='p-2 bg-orange-200 text-black font-bold rounded-md hover:bg-orange-50 cursor-pointer disabled:opacity-50'
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
