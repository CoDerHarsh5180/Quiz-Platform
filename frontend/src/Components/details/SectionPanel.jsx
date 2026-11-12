import React from 'react';
import QuestionCard from '../QuestionCard';

export default function SectionPanel({ sec, secQuestions, subjects, onUpdated }) {
  return (
    <div className="bg-[var(--color-bg-page)]/80 border border-[var(--color-border-subtle)] rounded-2xl p-5 space-y-4">
      {/* Section banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-[var(--color-primary-light)] text-[var(--color-text-dark)] font-extrabold text-sm px-3 py-1 rounded-lg">
            Section {sec.secName}
          </span>
          <span className="bg-[var(--color-blue-bg-dark)] text-[var(--color-blue-text)] text-xs px-2.5 py-0.5 rounded-full font-medium">{sec.typeOfQues}</span>
          <span className="bg-[var(--color-success-muted)] text-[var(--color-success)] text-xs px-2.5 py-0.5 rounded-full font-medium">
            +{sec.plusMarks} / -{sec.minusMarks}
          </span>
        </div>
        <div className="text-xs text-[var(--color-text-muted)]">
          Questions: <span className="font-bold text-[var(--color-text-secondary)]">{secQuestions.length}</span> / {sec.numOfQues} configured
        </div>
      </div>

      {/* Instructions */}
      {sec.instructions && (
        <div className="text-xs text-[var(--color-text-muted)] italic bg-black/20 p-2.5 rounded-lg border border-[var(--color-border-subtle)]">
          <span className="font-semibold text-[var(--color-text-secondary)] not-italic">Instructions: </span>
          {sec.instructions}
        </div>
      )}

      {/* Question list */}
      {secQuestions.length === 0 ? (
        <div className="p-6 bg-[var(--color-bg-deepest)]/60 border border-dashed border-[var(--color-border-subtle)] rounded-xl text-center space-y-1">
          <p className="text-sm text-[var(--color-text-muted)]">No questions added to Section {sec.secName} yet.</p>
          <p className="text-xs text-[var(--color-text-faint)]">
            Click "Add Question" above and choose Section {sec.secName} to add questions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {secQuestions.map((q, idx) => (
            <QuestionCard
              key={q._id || idx}
              question={q}
              sectionType={sec.typeOfQues}
              sectionName={sec.secName}
              subjects={subjects}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
