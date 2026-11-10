import React from 'react';
import { Hash, FileText, CheckCircle2 } from 'lucide-react';

/** Colored pill badge showing the question type. */
export default function TypeBadge({ type }) {
  const map = {
    NUMERICAL:   { cls: 'bg-orange-950 border-orange-700 text-orange-300', icon: <Hash size={11} />,         label: 'NUMERICAL' },
    DESCRIPTIVE: { cls: 'bg-amber-950  border-amber-700  text-amber-300',  icon: <FileText size={11} />,     label: 'DESCRIPTIVE' },
    'TRUE/FALSE': { cls: 'bg-teal-950  border-teal-700   text-teal-300',   icon: <CheckCircle2 size={11} />, label: 'TRUE/FALSE' },
    MSQ:         { cls: 'bg-cyan-950   border-cyan-700   text-cyan-300',   icon: null,                       label: 'MSQ' },
  };

  const { cls, icon, label } = map[type] ?? {
    cls: 'bg-blue-950 border-blue-700 text-blue-300',
    icon: null,
    label: 'MCQ',
  };

  return (
    <span className={`border text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${cls}`}>
      {icon} {label}
    </span>
  );
}
