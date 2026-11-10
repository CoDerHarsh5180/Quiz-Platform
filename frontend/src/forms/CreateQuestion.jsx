import React, { useState, useEffect } from 'react';
import { X, Hash, FileText, CheckCircle2 } from 'lucide-react';
import { useTest } from '../context/testContext';
import { createQuestion, createQuestionAI } from '../Api/questionApi';
import { getSection, getStructure } from '../Api/structureApi';
import ManualEntryForm from './question/ManualEntryForm';
import AIPromptForm from './question/AIPromptForm';

export default function CreateQuestion({ id }) {
  const { setAddQues } = useTest();

  // Shared state
  const [section, setSection]         = useState('A');
  const [mode, setMode]               = useState('manual');
  const [type, setType]               = useState('MCQ');
  const [sectionArray, setSectionArray] = useState([]);
  const [subjects, setSubjects]       = useState([]);
  const [loading, setLoading]         = useState(false);

  // Manual form state
  const [text, setText]               = useState('');
  const [options, setOptions]         = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [subject, setSubject]         = useState('');
  const [optionImg, setOptionImg]     = useState(null);
  const [sectionBImg, setSectionBImg] = useState(null);

  // AI prompt state
  const [promptImg, setPromptImg]       = useState(null);
  const [referenceImg, setReferenceImg] = useState(null);

  useEffect(() => {
    getStructure(id)
      .then((res) => {
        if (res?.data) {
          setSectionArray(res.data.sections || []);
          setSubjects(res.data.subjects || []);
        }
      })
      .catch(console.log);

    getSection(section, id)
      .then((data) => {
        if (data?.data?.[0] && String(data.data[0].testId) === id) {
          setType(data.data[0].typeOfQues || 'MCQ');
        }
      })
      .catch(console.log);
  }, [section, id]);

  // Reset correct answer on type / section change
  useEffect(() => { setCorrectAnswer(''); }, [type, section]);

  const isNumerical  = type === 'NUMERICAL';
  const isDescriptive = type === 'DESCRIPTIVE';
  const isTrueFalse  = type === 'TRUE/FALSE';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const isNoOption = isNumerical || isDescriptive;
    const submittedOptions = isNoOption ? [] : (isTrueFalse ? ['True', 'False'] : options);

    if (mode === 'manual') {
      createQuestion(text, section, submittedOptions, correctAnswer, subject, id,
        (type === 'MCQ' || type === 'MSQ') ? optionImg : sectionBImg, setLoading);
    } else {
      createQuestionAI(promptImg, referenceImg, subject, id, section, setLoading);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100 relative text-black">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Question</h2>
      <span
        className="absolute top-0 right-0 p-3 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
        onClick={() => setAddQues(false)}
      >
        <X />
      </span>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section selector + type badge */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">Select Section</label>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              isNumerical  ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : isDescriptive ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : isTrueFalse   ? 'bg-teal-100  text-teal-800  border border-teal-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {isNumerical  && <Hash size={12} />}
              {isDescriptive && <FileText size={12} />}
              {isTrueFalse   && <CheckCircle2 size={12} />}
              Section Type: {type || 'MCQ'}
            </span>
          </div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            {sectionArray.map((_, i) => {
              const c = String.fromCharCode(65 + i);
              return <option key={c} value={c}>Section {c}</option>;
            })}
          </select>
        </div>

        {/* Mode toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Input Mode</label>
          <div className="flex gap-6">
            {[{ val: 'manual', label: 'Manual Entry' }, { val: 'prompt', label: 'AI Prompt (OCR from Image)' }].map(({ val, label }) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio" name="mode" value={val}
                  checked={mode === val} onChange={() => setMode(val)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* Form body */}
        {mode === 'manual' ? (
          <ManualEntryForm
            type={type}
            text={text} setText={setText}
            subject={subject} setSubject={setSubject} subjects={subjects}
            options={options} setOptions={setOptions}
            correctAnswer={correctAnswer} setCorrectAnswer={setCorrectAnswer}
            sectionBImg={sectionBImg} setSectionBImg={setSectionBImg}
            optionImg={optionImg} setOptionImg={setOptionImg}
          />
        ) : (
          <AIPromptForm
            subject={subject} setSubject={setSubject} subjects={subjects}
            promptImg={promptImg} setPromptImg={setPromptImg}
            referenceImg={referenceImg} setReferenceImg={setReferenceImg}
          />
        )}

        {/* Submit */}
        <div className="pt-4 flex justify-between gap-3">
          <button
            type="submit" disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Question...' : 'Submit Question'}
          </button>
          {loading && (
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
              onClick={() => setLoading(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
