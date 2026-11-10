import React from 'react';

/**
 * Shared options grid for MCQ (radio) and MSQ (checkbox).
 *
 * Props:
 *  - type           : 'MCQ' | 'MSQ'
 *  - options        : string[]  (length 4)
 *  - correctAnswer  : string    (MCQ: single value; MSQ: comma-separated)
 *  - setCorrectAnswer: (val: string) => void
 *  - setOptions     : (opts: string[]) => void  — used when option text is editable
 *  - inputName      : string  — radio group name (defaults to 'correctAnswer')
 *  - gridCols       : string  — Tailwind grid class (defaults to 'grid-cols-1 md:grid-cols-2')
 *  - editable       : bool    — whether the option text inputs are shown (default true)
 *  - placeholder    : string[] — placeholder labels for each option (optional)
 */
export default function OptionsBlock({
  type,
  options,
  correctAnswer,
  setCorrectAnswer,
  setOptions,
  inputName = 'correctAnswer',
  gridCols = 'grid-cols-1 md:grid-cols-2',
  editable = true,
  placeholder = ['Option A', 'Option B', 'Option C', 'Option D'],
}) {
  const isMCQ = type === 'MCQ';
  const isMSQ = type === 'MSQ';

  const handleSelect = (opt) => {
    if (!opt) return;
    if (isMCQ) {
      setCorrectAnswer(opt);
    } else {
      let arr = correctAnswer ? correctAnswer.split(',') : [];
      const already = arr.includes(opt);
      if (already) arr = arr.filter((a) => a !== opt);
      else arr.push(opt);
      setCorrectAnswer(arr.filter(Boolean).join(','));
    }
  };

  const handleTextChange = (idx, newVal) => {
    const oldVal = options[idx] || '';
    const updated = [...options];
    updated[idx] = newVal;
    setOptions(updated);

    // Keep correctAnswer in sync when option text changes
    if (isMCQ && correctAnswer === oldVal) {
      setCorrectAnswer(newVal);
    } else if (isMSQ) {
      setCorrectAnswer((prev) => {
        const arr = prev ? prev.split(',') : [];
        const i = arr.indexOf(oldVal);
        if (i !== -1) arr[i] = newVal;
        return arr.filter(Boolean).join(',');
      });
    }
  };

  const selectedArr = isMSQ && correctAnswer ? correctAnswer.split(',') : [];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700">Options</label>
      </div>

      <div className={`grid ${gridCols} gap-3`}>
        {options.map((opt, idx) => {
          const isSelected = isMCQ ? correctAnswer === opt : (opt && selectedArr.includes(opt));
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 border rounded-lg px-2 py-1 transition-colors ${
                isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <input
                type={isMCQ ? 'radio' : 'checkbox'}
                name={inputName}
                value={opt}
                checked={!!isSelected}
                onChange={() => handleSelect(opt)}
                disabled={!opt}
                className={`w-4 h-4 shrink-0 text-blue-600 border-gray-300 focus:ring-blue-500 ${isMSQ ? 'rounded' : ''}`}
              />
              <span className="font-bold text-gray-500 text-xs w-4 shrink-0">
                {String.fromCharCode(65 + idx)}.
              </span>
              {editable ? (
                <input
                  type="text"
                  placeholder={placeholder[idx] || `Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm"
                />
              ) : (
                <span className="text-sm flex-1">{opt || <em className="text-gray-400">—</em>}</span>
              )}
            </div>
          );
        })}
      </div>

      {!correctAnswer && (
        <p className="text-xs text-red-500 mt-1.5">
          {isMCQ ? 'Please tick the correct answer.' : 'Please tick at least one correct answer.'}
        </p>
      )}
    </div>
  );
}
