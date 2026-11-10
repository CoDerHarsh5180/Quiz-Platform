import React from 'react';
import QuestionCard from '../QuestionCard';

export default function SectionPanel({ sec, secQuestions, subjects, onUpdated }) {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 space-y-4">
      {/* Section banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-orange-200 text-black font-extrabold text-sm px-3 py-1 rounded-lg">
            Section {sec.secName}
          </span>
          <span className="bg-blue-950 text-xs px-2.5 py-0.5 rounded-full font-medium">{sec.typeOfQues}</span>
          <span className="bg-emerald-950 text-xs px-2.5 py-0.5 rounded-full font-medium">
            +{sec.plusMarks} / -{sec.minusMarks}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Questions: <span className="font-bold text-gray-200">{secQuestions.length}</span> / {sec.numOfQues} configured
        </div>
      </div>

      {/* Instructions */}
      {sec.instructions && (
        <div className="text-xs text-gray-400 italic bg-black/20 p-2.5 rounded-lg border border-gray-800">
          <span className="font-semibold text-gray-300 not-italic">Instructions: </span>
          {sec.instructions}
        </div>
      )}

      {/* Question list */}
      {secQuestions.length === 0 ? (
        <div className="p-6 bg-gray-950/60 border border-dashed border-gray-800 rounded-xl text-center space-y-1">
          <p className="text-sm text-gray-400">No questions added to Section {sec.secName} yet.</p>
          <p className="text-xs text-gray-600">
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
