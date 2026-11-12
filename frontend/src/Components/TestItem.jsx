import React, { useState } from 'react'
import { useTest } from '../context/testContext'
import EditSection from '../forms/EditSection'
import CreateQuestion from '../forms/CreateQuestion'
import QuestionDetails from './QuestionDetails'

/* Dynamically shrink font based on name length */
function getNameFontClass(name = '') {
  if (name.length > 40) return 'text-base md:text-lg'
  if (name.length > 25) return 'text-lg md:text-xl'
  return 'text-xl md:text-2xl'
}

function TestItem({ name, totalMarks, timeDuration, isSection, noOfSec, id, subjects }) {
  const { setSectionEditing, sectionEditing, openSectionEditor, TestId, sec: sectionCount, openQuesAdder, AddQues, setAddQues } = useTest()
  const [details, setDetails] = useState(false)

  const nameFontClass = getNameFontClass(name)

  return (
    <div className='rounded-2xl bg-[var(--color-bg-page)] border border-[var(--color-border)] shadow-xl overflow-hidden'>

      {/* ── Top accent bar ── */}
      <div className='h-1 w-full bg-gradient-to-r from-[var(--color-primary-hover)] via-[var(--color-primary-text-alt)] to-[var(--color-gradient-to)]' />

      {/* ── Card body ── */}
      <div className='p-5 space-y-4'>

        {/* ── Header row: name + meta ── */}
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>

          {/* Name (wraps, font scales down for long names) */}
          <h1
            className={`${nameFontClass} font-bold uppercase tracking-wide text-[var(--color-text-primary)] break-words max-w-[66%] leading-snug`}
          >
            {name}
          </h1>

          {/* Right-side chips */}
          <div className='flex flex-wrap gap-2 shrink-0 justify-end'>
            <span className='px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]'>
              🎯 {totalMarks} Marks
            </span>
            <span className='px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]'>
              ⏱ {timeDuration} hr{timeDuration !== 1 ? 's' : ''}
            </span>
            {noOfSec > 0 && (
              <span className='px-3 py-1 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]'>
                📂 {noOfSec} Section{noOfSec !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* ── Subjects row ── */}
        {subjects && subjects.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {subjects.map((sub, index) => (
              <span
                key={index}
                className='px-2.5 py-0.5 rounded-md bg-[var(--color-primary-muted)]/40 border border-[var(--color-primary-border)]/40 text-[var(--color-primary-text-alt)] text-xs font-medium'
              >
                {sub}
              </span>
            ))}
          </div>
        )}

        {/* ── Divider ── */}
        <div className='border-t border-[var(--color-border)]' />

        {/* ── Action buttons ── */}
        <div className='flex flex-wrap justify-end gap-2'>
          <button
            className='px-3 py-1.5 text-sm bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-input)] text-[var(--color-text-primary)] font-medium rounded-lg transition-colors cursor-pointer'
            onClick={() => setDetails(prev => !prev)}
          >
            {details ? '▲ Hide Details' : '▼ Get Details'}
          </button>
          <button
            className='px-3 py-1.5 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-primary)] font-medium rounded-lg transition-colors cursor-pointer'
            onClick={() => { openSectionEditor(id, noOfSec); setAddQues(false) }}
          >
            ✏️ Edit Section
          </button>
          <button
            className='px-3 py-1.5 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-text-primary)] font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
            disabled={!isSection}
            onClick={() => { openQuesAdder(id); setSectionEditing(false) }}
          >
            ➕ Add Question
          </button>
        </div>
      </div>

      {/* ── Expandable panels ── */}
      {sectionEditing && id === TestId && (
        <div className='border-t border-[var(--color-border)] p-4'>
          <EditSection id={TestId} noOfSec={sectionCount} />
        </div>
      )}
      {AddQues && id === TestId && (
        <div className='border-t border-[var(--color-border)] p-4'>
          <CreateQuestion id={TestId} sec={noOfSec} />
        </div>
      )}
      {details && (
        <div className='border-t border-[var(--color-border)] p-4'>
          <QuestionDetails id={id} onClose={() => setDetails(false)} />
        </div>
      )}
    </div>
  )
}

export default TestItem
