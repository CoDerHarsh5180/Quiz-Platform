import React from 'react';
import { Hash, FileText } from 'lucide-react';
import ImageUploadWithCrop from '../../Components/ImageUploadWithCrop';
import OptionsBlock from '../../Components/question/OptionsBlock';

/**
 * Manual entry form body for CreateQuestion.
 * Renders the type-specific fields based on `type`.
 */
export default function ManualEntryForm({
  type,
  text, setText,
  subject, setSubject, subjects,
  options, setOptions,
  correctAnswer, setCorrectAnswer,
  sectionBImg, setSectionBImg,
  optionImg, setOptionImg,
}) {
  const isNumerical  = type === 'NUMERICAL';
  const isDescriptive = type === 'DESCRIPTIVE';
  const isTrueFalse  = type === 'TRUE/FALSE';
  const isMCQorMSQ   = type === 'MCQ' || type === 'MSQ';

  return (
    <div className="space-y-4">
      {/* Question text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <textarea
          placeholder="Enter your question text (LaTeX supported: $E = mc^2$)..."
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        >
          <option value="">Select a Subject</option>
          {subjects.map((subj, idx) => {
            const name = typeof subj === 'object' ? subj?.name || subj?._id : subj;
            return <option key={idx} value={name}>{name}</option>;
          })}
        </select>
      </div>

      {/* NUMERICAL */}
      {isNumerical && (
        <div className="space-y-4">
          <ImageUploadWithCrop label="Upload Question Diagram / Image (optional)" onCropped={setSectionBImg} currentImage={sectionBImg} />
          <div>
            <label className="block text-sm font-semibold text-purple-800 mb-1 flex items-center gap-1.5">
              <Hash size={14} /> Numerical Answer (Exact Value)
            </label>
            <input
              type="text"
              placeholder="e.g. 42 or 3.14"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono font-bold text-gray-800 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Numerical sections do not have options. Students type the exact numerical answer.
            </p>
          </div>
        </div>
      )}

      {/* DESCRIPTIVE */}
      {isDescriptive && (
        <div className="space-y-4">
          <ImageUploadWithCrop label="Upload Question Image (optional)" onCropped={setSectionBImg} currentImage={sectionBImg} />
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
            <FileText size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span>Descriptive answers are verified by AI. No correct answer key is needed here.</span>
          </div>
        </div>
      )}

      {/* TRUE / FALSE */}
      {isTrueFalse && (
        <div className="space-y-4">
          <ImageUploadWithCrop label="Upload Question Image (optional)" onCropped={setSectionBImg} currentImage={sectionBImg} />
          <div>
            <label className="block text-sm font-semibold text-teal-800 mb-1">Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white font-medium"
              required
            >
              <option value="">Select True or False</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          </div>
        </div>
      )}

      {/* MCQ / MSQ */}
      {isMCQorMSQ && (
        <div className="space-y-4">
          <OptionsBlock
            type={type}
            options={options}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            setOptions={setOptions}
            inputName="correctAnswer"
            gridCols="grid-cols-1 md:grid-cols-2"
          />
          <ImageUploadWithCrop label="Upload Question / Diagram Image (optional)" onCropped={setOptionImg} currentImage={optionImg} />
        </div>
      )}
    </div>
  );
}
