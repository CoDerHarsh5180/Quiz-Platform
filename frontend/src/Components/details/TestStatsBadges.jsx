import React from 'react';
import { Award, Clock, Layers, HelpCircle } from 'lucide-react';

/** 4-card stats grid shown at the top of QuestionDetails. */
export default function TestStatsBadges({ structure, questionsCount, totalTargetQuestions }) {
  const stats = [
    { icon: <Award size={20} />, color: 'bg-yellow-500/10', label: 'Total Marks',      value: structure.totalMarks },
    { icon: <Clock size={20} />,  color: 'bg-blue-500/10',   label: 'Time Duration',    value: `${structure.timeDuration}h` },
    { icon: <Layers size={20} />, color: 'bg-purple-500/10', label: 'Sections',         value: structure.noOfSec },
    {
      icon: <HelpCircle size={20} />,
      color: 'bg-emerald-500/10',
      label: 'Questions Added',
      value: (
        <>
          {questionsCount}
          {totalTargetQuestions > 0 && (
            <span className="text-xs font-normal text-gray-400 ml-1">/ {totalTargetQuestions} target</span>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ icon, color, label, value }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex items-center gap-3">
          <div className={`p-2.5 ${color} rounded-lg shrink-0`}>{icon}</div>
          <div>
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-lg font-bold text-gray-100">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
