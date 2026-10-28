import React, { useState, useEffect } from 'react';
import { X, Hash, FileText, CheckCircle2 } from 'lucide-react';
import { useTest } from '../context/testContext';
import { createQuestion, createQuestionAI } from '../Api/questionApi';
import { getSection, getStructure } from '../Api/structureApi';
import ImageUploadWithCrop from '../Components/ImageUploadWithCrop';

export default function CreateQuestion({ id, sec }) {
  const { setAddQues } = useTest();
  const [section, setSection] = useState('A');
  const [mode, setMode] = useState('manual');

  const [optionImg, setOptionImg] = useState(null);
  const [sectionBImg, setSectionBImg] = useState(null);
  const [promptImg, setPromptImg] = useState(null);
  const [referenceImg, setReferenceImg] = useState(null);

  const [text, setText] = useState('');
  const [options, setOption] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('MCQ');
  const [sectionArray, setSetionArray] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStructure(id)
      .then((res) => {
        if (res?.data) {
          setSetionArray(res.data.sections || []);
          setSubjects(res.data.subjects || []);
        }
      })
      .catch((e) => console.log(e));

    getSection(section, id)
      .then((data) => {
        if (data?.data?.[0] && String(data.data[0].testId) === id) {
          setType(data.data[0].typeOfQues || 'MCQ');
        }
      })
      .catch((e) => console.log(e));
  }, [section, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const isNoOption = type === 'NUMERICAL' || type === 'DESCRIPTIVE';
    const isTF = type === 'TRUE/FALSE';
    const submittedOptions = isNoOption ? [] : (isTF ? ['True', 'False'] : options);

    if (mode === 'manual') {
      createQuestion(
        text,
        section,
        submittedOptions,
        correctAnswer,
        subject,
        id,
        type === 'MCQ' || type === 'MSQ' ? optionImg : sectionBImg,
        setLoading
      );
    } else {
      createQuestionAI(
        promptImg,
        referenceImg,
        subject,
        id,
        section,
        setLoading
      );
    }
  };

  const isNumerical = type === 'NUMERICAL';
  const isDescriptive = type === 'DESCRIPTIVE';
  const isTrueFalse = type === 'TRUE/FALSE';
  const isMCQorMSQ = type === 'MCQ' || type === 'MSQ';

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100 relative text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Question</h2>
      <span
        className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
        onClick={() => {
          setAddQues(false);
        }}
      >
        <X />
      </span>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Section Dropdown with Type indicator */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">Select Section</label>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isNumerical
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : isDescriptive
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : isTrueFalse
                  ? 'bg-teal-100 text-teal-800 border border-teal-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {isNumerical && <Hash size={12} />}
              {isDescriptive && <FileText size={12} />}
              {isTrueFalse && <CheckCircle2 size={12} />}
              Section Type: {type || 'MCQ'}
            </span>
          </div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {sectionArray.map((_, index) => {
              const secChar = String.fromCharCode(65 + index);
              return (
                <option key={secChar} value={secChar}>
                  Section {secChar}
                </option>
              );
            })}
          </select>
        </div>

        {/* 2. Mode Radio Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Input Mode</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="mode"
                value="manual"
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                Manual Entry
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="mode"
                value="prompt"
                checked={mode === 'prompt'}
                onChange={() => setMode('prompt')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                AI Prompt (OCR from Image)
              </span>
            </label>
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* 3. Conditional Layouts */}
        {mode === 'manual' ? (
          <div key="manual-mode-wrapper" className="space-y-4">
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
                  const subjectName = typeof subj === 'object' ? subj?.name || subj?._id : subj;
                  return (
                    <option key={idx} value={subjectName}>
                      {subjectName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* A. NUMERICAL TYPE: Image + Numerical Value only. NO OPTIONS */}
            {isNumerical && (
              <div key="manual-numerical" className="space-y-4">
                <ImageUploadWithCrop
                  label="Upload Question Diagram / Image (optional)"
                  onCropped={setSectionBImg}
                  currentImage={sectionBImg}
                />
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

            {/* B. DESCRIPTIVE TYPE: Image + Expected Answer Textarea */}
            {isDescriptive && (
              <div key="manual-descriptive" className="space-y-4">
                <ImageUploadWithCrop
                  label="Upload Question Image (optional)"
                  onCropped={setSectionBImg}
                  currentImage={sectionBImg}
                />
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-1">
                    Expected Answer / Key Evaluation Points
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter the expected answer, rubric, or solution..."
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* C. TRUE / FALSE TYPE: Select True or False */}
            {isTrueFalse && (
              <div key="manual-true-false" className="space-y-4">
                <ImageUploadWithCrop
                  label="Upload Question Image (optional)"
                  onCropped={setSectionBImg}
                  currentImage={sectionBImg}
                />
                <div>
                  <label className="block text-sm font-semibold text-teal-800 mb-1">
                    Correct Answer
                  </label>
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

            {/* D. MCQ & MSQ TYPE: 4 Options + Correct Answer */}
            {isMCQorMSQ && (
              <div key="manual-mcq-msq" className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Options</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Option A', 'Option B', 'Option C', 'Option D'].map((optLabel, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-bold text-gray-500 text-xs w-4">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <input
                          type="text"
                          placeholder={optLabel}
                          value={options[idx] || ''}
                          onChange={(e) =>
                            setOption((prev) => {
                              const updated = [...prev];
                              updated[idx] = e.target.value;
                              return updated;
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <ImageUploadWithCrop
                  label="Upload Question / Diagram Image (optional)"
                  onCropped={setOptionImg}
                  currentImage={optionImg}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    placeholder="Must match the exact text of the correct option"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div key="prompt-mode-wrapper" className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Select a Subject</option>
                {subjects.map((subj, idx) => {
                  const subjectName = typeof subj === 'object' ? subj?.name || subj?._id : subj;
                  return (
                    <option key={idx} value={subjectName}>
                      {subjectName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <ImageUploadWithCrop
                label="Prompt Image (Question snippet)"
                onCropped={setPromptImg}
                currentImage={promptImg}
              />
            </div>

            <div>
              <ImageUploadWithCrop
                label="Reference Image (Optional diagram / reference)"
                onCropped={setReferenceImg}
                currentImage={referenceImg}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 flex justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Question...' : 'Submit Question'}
          </button>
          {loading && (
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
              onClick={() => {
                setLoading(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}