import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { editQuestion } from '../../Api/questionApi';
import ImageUploadWithCrop from '../ImageUploadWithCrop';
import OptionsBlock from './OptionsBlock';

/**
 * Edit form for a single question.
 * Rendered by QuestionCard when isEditing=true.
 */
export default function QuestionEditForm({ question, sectionType, subjects, onUpdated, onCancel }) {
  const isNumerical  = sectionType === 'NUMERICAL';
  const isDescriptive = sectionType === 'DESCRIPTIVE';
  const isTrueFalse  = sectionType === 'TRUE/FALSE';
  const isMSQ        = sectionType === 'MSQ';
  const isMCQ        = !isNumerical && !isDescriptive && !isTrueFalse && !isMSQ;

  const [text, setText] = useState(question.text || '');
  const [options, setOptions] = useState(
    Array.isArray(question.options) && question.options.length > 0 && !isNumerical && !isDescriptive
      ? [...question.options]
      : ['', '', '', '']
  );
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer || '');
  const [subject, setSubject] = useState(question.subject || '');
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let submittedOptions = [];
      if (isMCQ || isMSQ)      submittedOptions = options;
      else if (isTrueFalse)    submittedOptions = ['True', 'False'];

      const res = await editQuestion(question._id, text, submittedOptions, correctAnswer, subject, croppedImage);
      if (res?.data) onUpdated(res.data);
      onCancel();
      setCroppedImage(null);
    } catch (err) {
      console.error('Failed to edit question:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-modal-bg)] text-[var(--color-text-dark)] rounded-xl p-5 shadow-lg border border-[var(--color-border-light)] space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-border-light)] pb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-lg text-[var(--color-text-dark)]">
            Editing Question {question.index ? `#${question.index}` : ''}
          </h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border-light)] text-[var(--color-text-on-light)] font-semibold border border-[var(--color-border-light)]">
            {sectionType}
          </span>
        </div>
        <button type="button" onClick={onCancel} className="text-[var(--color-modal-close)] hover:text-[var(--color-modal-close-hover)] cursor-pointer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Question text */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-on-light)] mb-1">
            Question Text (Supports LaTeX notation)
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none"
            placeholder="Enter question text..."
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-[var(--color-text-on-light)] mb-1">Subject</label>
          {subjects?.length > 0 ? (
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none bg-[var(--color-modal-bg)] text-[var(--color-text-dark)]"
            >
              <option value="">Select Subject</option>
              {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          ) : (
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject name"
              className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none text-[var(--color-text-dark)]"
            />
          )}
        </div>

        {/* MCQ / MSQ options with inline selector */}
        {(isMCQ || isMSQ) && (
          <OptionsBlock
            type={sectionType}
            options={options}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            setOptions={setOptions}
            inputName="correctAnswerEdit"
            gridCols="grid-cols-1 sm:grid-cols-2"
          />
        )}

        {/* Non-MCQ/MSQ answer inputs */}
        {(isTrueFalse || isNumerical || isDescriptive) && (
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-on-light)] mb-1">
              {isNumerical ? 'Numerical Value Answer'
                : isDescriptive ? 'Expected Key Points / Answer'
                : 'Correct Answer (True or False)'}
            </label>
            {isTrueFalse && (
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none bg-[var(--color-modal-bg)] text-[var(--color-text-dark)]"
                required
              >
                <option value="">Select True or False</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            )}
            {isNumerical && (
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="e.g. 42 or 3.14"
                className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none font-mono font-semibold text-[var(--color-text-dark)]"
                required
              />
            )}
            {isDescriptive && (
              <textarea
                rows={2}
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter expected answer or key evaluation points..."
                className="w-full px-3 py-2 border border-[var(--color-border-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue-focus)] focus:outline-none text-[var(--color-text-dark)]"
                required
              />
            )}
          </div>
        )}

        {/* Image upload */}
        <div className="space-y-2">
          {question.image && !croppedImage && (
            <div className="text-sm text-[var(--color-modal-hint)]">
              <span className="font-medium">Current Image:</span>
              <div className="mt-1">
                <img src={question.image} alt="Current" className="max-h-32 rounded-lg border border-[var(--color-border-light)] object-contain bg-[var(--color-border-light)] p-1" />
              </div>
            </div>
          )}
          <ImageUploadWithCrop
            label={question.image ? 'Replace Image (leave empty to keep current)' : 'Upload Image'}
            onCropped={setCroppedImage}
            currentImage={croppedImage}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-[var(--color-border-light)] rounded-lg text-sm font-medium text-[var(--color-text-on-light)] hover:bg-[var(--color-border-light)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--color-blue)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-blue-hover)] transition cursor-pointer disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
