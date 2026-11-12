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
    <div className="bg-[var(--color-bg-card)] text-[var(--color-text-primary)] rounded-xl p-5 shadow-lg border border-[var(--color-border)] space-y-4 hover:border-[var(--color-bg-input)] transition">
      {/* Header row */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[var(--color-primary-light)] text-[var(--color-text-dark)] font-bold text-xs px-2.5 py-1 rounded-full">
            Q{question.index || 1}
          </span>
          <TypeBadge type={sectionType} />
          {question.subject && (
            <span className="bg-[var(--color-blue-bg-dark)]/60 text-[var(--color-blue-text)] border border-[var(--color-blue-border-dark)] text-xs px-2.5 py-1 rounded-full font-medium">
              {question.subject}
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-text-dark)] font-semibold text-xs rounded hover:bg-[var(--color-primary-light-hover)] transition cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Question text */}
      <div className="text-[var(--color-text-primary)] text-base leading-relaxed whitespace-pre-wrap">{question.text}</div>

      {/* Attached image */}
      {question.image && (
        <div className="mt-2">
          <img
            src={question.image}
            alt={`Question ${question.index}`}
            className="max-h-56 rounded-lg border border-[var(--color-border)] object-contain bg-black/30 p-1"
          />
        </div>
      )}

      {/* NUMERICAL */}
      {isNumerical && (
        <div className="p-3 bg-[var(--color-numerical-bg)]/40 border border-[var(--color-numerical-border)]/50 rounded-xl text-sm flex items-center justify-between">
          <span className="font-semibold text-[var(--color-numerical-text)] flex items-center gap-1.5">
            <Hash size={14} /> Numerical Value Answer:
          </span>
          <span className="font-mono font-bold text-base bg-[var(--color-primary-muted)]/70 px-3.5 py-1 rounded-lg border border-[var(--color-primary-hover)]/40 text-[var(--color-primary-light)] shadow-sm">
            {question.correctAnswer || 'Not set'}
          </span>
        </div>
      )}

      {/* DESCRIPTIVE */}
      {isDescriptive && (
        <div className="p-3 bg-[var(--color-descriptive-bg)]/40 border border-[var(--color-descriptive-border)]/50 rounded-xl text-sm">
          <span className="font-semibold text-[var(--color-descriptive-text)] flex items-center gap-1.5">
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
                    ? 'bg-[var(--color-success-muted)]/50 border-[var(--color-success)] text-[var(--color-text-primary)]'
                    : 'bg-[var(--color-bg-page)]/60 border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
              >
                <span>{val}</span>
                {isCorrect && <Check size={16} className="text-[var(--color-success)]" />}
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
                      ? 'bg-[var(--color-success-muted)]/40 border-[var(--color-success)] text-[var(--color-text-primary)] font-medium'
                      : 'bg-[var(--color-bg-page)]/60 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${isCorrect ? 'bg-[var(--color-success)] text-[var(--color-text-dark)]' : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 break-words">{opt}</span>
                  {isCorrect && <Check size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />}
                </div>
              );
            })}
        </div>
      )}

      {/* Correct answer footer */}
      {(isMCQ || isMSQ) && question.correctAnswer && (
        <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5 pt-1 border-t border-[var(--color-border)]/60">
          <span className="font-semibold text-[var(--color-text-secondary)]">{isMSQ ? 'Correct Answers:' : 'Correct Answer:'}</span>
          <span className="text-[var(--color-success)] font-medium">{question.correctAnswer}</span>
        </div>
      )}
    </div>
  );
}
