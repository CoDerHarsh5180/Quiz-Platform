import React from 'react';
import { Hash, FileText, CheckCircle2 } from 'lucide-react';

/** Colored pill badge showing the question type. */
export default function TypeBadge({ type }) {
  const map = {
    NUMERICAL:   { cls: 'bg-[var(--color-numerical-bg)] border-[var(--color-numerical-border)] text-[var(--color-numerical-text)]', icon: <Hash size={11} />,         label: 'NUMERICAL' },
    DESCRIPTIVE: { cls: 'bg-[var(--color-descriptive-bg)] border-[var(--color-descriptive-border)] text-[var(--color-descriptive-text)]',  icon: <FileText size={11} />,     label: 'DESCRIPTIVE' },
    'TRUE/FALSE': { cls: 'bg-[var(--color-trueFalse-bg)] border-[var(--color-trueFalse-border)] text-[var(--color-trueFalse-text)]',   icon: <CheckCircle2 size={11} />, label: 'TRUE/FALSE' },
    MSQ:         { cls: 'bg-[var(--color-msq-bg)] border-[var(--color-msq-border)] text-[var(--color-msq-text)]',   icon: null,                       label: 'MSQ' },
  };

  const { cls, icon, label } = map[type] ?? {
    cls: 'bg-[var(--color-blue-bg-dark)] border-[var(--color-blue-border-dark)] text-[var(--color-blue-text)]',
    icon: null,
    label: 'MCQ',
  };

  return (
    <span className={`border text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${cls}`}>
      {icon} {label}
    </span>
  );
}
