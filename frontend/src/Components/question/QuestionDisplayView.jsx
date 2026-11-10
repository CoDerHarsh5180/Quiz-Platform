import React from 'react';
import { Check, Hash, FileText } from 'lucide-react';
import TypeBadge from './TypeBadge';

/** Read-only display of a single question card. */
export default function QuestionDisplayView({ question, sectionType, onEdit }) {
  const isNumerical  = sectionType === 'NUMERICAL';
  const isDescriptive = sectionType === 'DESCRIPTIVE';
  const isTrueFalse  = sectionType === 'TRUE/FALSE';
  const isMSQ        = sectionType === 'MSQ';
  const isMCQ        = !isNumerical && !isDescriptive && !isTrueFalse && !isMSQ;

  const hasNonEmptyOptions =
    Array.isArray(question.options) &&
    question.options.some((o) => o && String(o).trim() !== '');

  return (
    <div className="bg-gray-800 text-white rounded-xl p-5 shadow-lg border border-gray-700 space-y-4 hover:border-gray-600 transition">
      {/* Header row */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-orange-200 text-black font-bold text-xs px-2.5 py-1 rounded-full">
            Q{question.index || 1}
          </span>
          <TypeBadge type={sectionType} />
          {question.subject && (
            <span className="bg-blue-900/60 text-blue-300 border border-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
              {question.subject}
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1 bg-orange-200 text-black font-semibold text-xs rounded hover:bg-orange-100 transition cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Question text */}
      <div className="text-gray-100 text-base leading-relaxed whitespace-pre-wrap">{question.text}</div>

      {/* Attached image */}
      {question.image && (
        <div className="mt-2">
          <img
            src={question.image}
            alt={`Question ${question.index}`}
            className="max-h-56 rounded-lg border border-gray-700 object-contain bg-black/30 p-1"
          />
        </div>
      )}

      {/* NUMERICAL */}
      {isNumerical && (
        <div className="p-3 bg-orange-950/40 border border-orange-600/50 rounded-xl text-sm flex items-center justify-between">
          <span className="font-semibold text-orange-300 flex items-center gap-1.5">
            <Hash size={14} /> Numerical Value Answer:
          </span>
          <span className="font-mono font-bold text-base bg-orange-900/70 px-3.5 py-1 rounded-lg border border-orange-400/40 text-orange-100 shadow-sm">
            {question.correctAnswer || 'Not set'}
          </span>
        </div>
      )}

      {/* DESCRIPTIVE */}
      {isDescriptive && (
        <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-sm">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <FileText size={14} /> AI-Verified — no answer key shown
          </span>
        </div>
      )}

      {/* TRUE / FALSE */}
      {isTrueFalse && (
        <div className="flex gap-3 pt-1">
          {['True', 'False'].map((val) => {
            const isCorrect = String(val).toLowerCase() === String(question.correctAnswer).toLowerCase();
            return (
              <div
                key={val}
                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold ${
                  isCorrect
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                    : 'bg-gray-900/60 border-gray-700 text-gray-400'
                }`}
              >
                <span>{val}</span>
                {isCorrect && <Check size={16} className="text-emerald-400" />}
              </div>
            );
          })}
        </div>
      )}

      {/* MCQ / MSQ options */}
      {(isMCQ || isMSQ) && hasNonEmptyOptions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {question.options
            .filter((o) => o && String(o).trim() !== '')
            .map((opt, idx) => {
              const correctArr = question.correctAnswer
                ? question.correctAnswer.split(',').map((s) => s.trim())
                : [];
              const isCorrect = isMSQ
                ? correctArr.includes(String(opt).trim())
                : String(opt).trim() === String(question.correctAnswer).trim();
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium'
                      : 'bg-gray-900/60 border-gray-700 text-gray-300'
                  }`}
                >
                  <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${isCorrect ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 break-words">{opt}</span>
                  {isCorrect && <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />}
                </div>
              );
            })}
        </div>
      )}

      {/* Correct answer footer */}
      {(isMCQ || isMSQ) && question.correctAnswer && (
        <div className="text-xs text-gray-400 flex items-center gap-1.5 pt-1 border-t border-gray-700/60">
          <span className="font-semibold text-gray-300">{isMSQ ? 'Correct Answers:' : 'Correct Answer:'}</span>
          <span className="text-emerald-300 font-medium">{question.correctAnswer}</span>
        </div>
      )}
    </div>
  );
}
