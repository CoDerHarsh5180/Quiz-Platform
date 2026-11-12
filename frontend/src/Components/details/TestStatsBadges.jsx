import React from 'react';
import { Award, Clock, Layers, HelpCircle } from 'lucide-react';

/** 4-card stats grid shown at the top of QuestionDetails. */
export default function TestStatsBadges({ structure, questionsCount, totalTargetQuestions }) {
  const stats = [
    { icon: <Award size={20} />, color: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]', label: 'Total Marks',      value: structure.totalMarks },
    { icon: <Clock size={20} />,  color: 'bg-[var(--color-blue)]/10 text-[var(--color-blue)]',   label: 'Time Duration',    value: `${structure.timeDuration}h` },
    { icon: <Layers size={20} />, color: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]', label: 'Sections',         value: structure.noOfSec },
    {
      icon: <HelpCircle size={20} />,
      color: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
      label: 'Questions Added',
      value: (
        <>
          {questionsCount}
          {totalTargetQuestions > 0 && (
            <span className="text-xs font-normal text-[var(--color-text-muted)] ml-1">/ {totalTargetQuestions} target</span>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ icon, color, label, value }) => (
        <div key={label} className="bg-[var(--color-bg-page)] border border-[var(--color-border-subtle)] p-3.5 rounded-xl flex items-center gap-3">
          <div className={`p-2.5 ${color} rounded-lg shrink-0`}>{icon}</div>
          <div>
            <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
            <div className="text-lg font-bold text-[var(--color-text-primary)]">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
