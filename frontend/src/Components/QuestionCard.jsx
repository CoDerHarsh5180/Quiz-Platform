import React, { useState } from 'react';
import { Pencil, Check, X, Loader2, Hash, FileText, CheckCircle2 } from 'lucide-react';
import { editQuestion } from '../Api/questionApi';
import ImageUploadWithCrop from './ImageUploadWithCrop';

function QuestionCard({ question, sectionType = 'MCQ', sectionName = '', subjects = [], onUpdated }) {
    const isNumerical = sectionType === 'NUMERICAL';
    const isDescriptive = sectionType === 'DESCRIPTIVE';
    const isTrueFalse = sectionType === 'TRUE/FALSE';
    const isMSQ = sectionType === 'MSQ';
    const isMCQ = sectionType === 'MCQ' || (!isNumerical && !isDescriptive && !isTrueFalse && !isMSQ);

    const [isEditing, setIsEditing] = useState(false);
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
            // Sanitize options based on question type
            let submittedOptions = [];
            if (isMCQ || isMSQ) {
                submittedOptions = options;
            } else if (isTrueFalse) {
                submittedOptions = ['True', 'False'];
            } else {
                // NUMERICAL or DESCRIPTIVE: NO options!
                submittedOptions = [];
            }

            const res = await editQuestion(
                question._id,
                text,
                submittedOptions,
                correctAnswer,
                subject,
                croppedImage
            );
            if (res?.data) {
                onUpdated(res.data);
            }
            setIsEditing(false);
            setCroppedImage(null);
        } catch (error) {
            console.error("Failed to edit question:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setText(question.text || '');
        setOptions(
            Array.isArray(question.options) && question.options.length > 0 && !isNumerical && !isDescriptive
                ? [...question.options]
                : ['', '', '', '']
        );
        setCorrectAnswer(question.correctAnswer || '');
        setSubject(question.subject || '');
        setCroppedImage(null);
        setIsEditing(false);
    };

    // Check if question has non-empty options for display
    const hasNonEmptyOptions =
        Array.isArray(question.options) &&
        question.options.some((opt) => opt && String(opt).trim() !== '');

    const getTypeBadge = () => {
        if (isNumerical) {
            return (
                <span className="bg-orange-950 border border-orange-700 text-orange-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Hash size={11} /> NUMERICAL
                </span>
            );
        }
        if (isDescriptive) {
            return (
                <span className="bg-amber-950 border border-amber-700 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <FileText size={11} /> DESCRIPTIVE
                </span>
            );
        }
        if (isTrueFalse) {
            return (
                <span className="bg-teal-950 border border-teal-700 text-teal-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 size={11} /> TRUE/FALSE
                </span>
            );
        }
        if (isMSQ) {
            return (
                <span className="bg-cyan-950 border border-cyan-700 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    MSQ
                </span>
            );
        }
        return (
            <span className="bg-blue-950 border border-blue-700 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                MCQ
            </span>
        );
    };

    if (isEditing) {
        return (
            <div className="bg-gray-300 text-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-gray-800">
                            Editing Question {question.index ? `#${question.index}` : ''}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold border">
                            {sectionType}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Question Text (Supports LaTeX notation)
                        </label>
                        <textarea
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter question text..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Subject
                            </label>
                            {subjects && subjects.length > 0 ? (
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((s, idx) => (
                                        <option key={idx} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Subject name"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            )}
                        </div>

                        {/* Answer Input based on type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {isNumerical
                                    ? 'Numerical Value Answer'
                                    : isDescriptive
                                    ? 'Expected Key Points / Answer'
                                    : isTrueFalse
                                    ? 'Correct Answer (True or False)'
                                    : 'Correct Answer'}
                            </label>

                            {isTrueFalse ? (
                                <select
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                    required
                                >
                                    <option value="">Select True or False</option>
                                    <option value="True">True</option>
                                    <option value="False">False</option>
                                </select>
                            ) : isNumerical ? (
                                <input
                                    type="text"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    placeholder="e.g. 42 or 3.14"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-semibold"
                                    required
                                />
                            ) : isDescriptive ? (
                                <textarea
                                    rows={2}
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    placeholder="Enter expected answer or key evaluation points..."
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    placeholder="Exact correct answer"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {/* Options list: ONLY for MCQ and MSQ. NEVER for NUMERICAL or DESCRIPTIVE */}
                    {(isMCQ || isMSQ) && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Options
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-500 w-5">
                                            {String.fromCharCode(65 + idx)}.
                                        </span>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => {
                                                const updated = [...options];
                                                updated[idx] = e.target.value;
                                                setOptions(updated);
                                            }}
                                            placeholder={`Option ${idx + 1}`}
                                            className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image section: show current and option to replace */}
                    <div className="space-y-2">
                        {question.image && !croppedImage && (
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Current Image:</span>
                                <div className="mt-1">
                                    <img
                                        src={question.image}
                                        alt="Current Question"
                                        className="max-h-32 rounded-lg border object-contain bg-gray-50 p-1"
                                    />
                                </div>
                            </div>
                        )}
                        <ImageUploadWithCrop
                            label={question.image ? "Replace Image (leave empty to keep current)" : "Upload Image"}
                            onCropped={setCroppedImage}
                            currentImage={croppedImage}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 text-white rounded-xl p-5 shadow-lg border border-gray-700 space-y-4 hover:border-gray-600 transition">
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-orange-200 text-black font-bold text-xs px-2.5 py-1 rounded-full">
                        Q{question.index || 1}
                    </span>
                    {getTypeBadge()}
                    {question.subject && (
                        <span className="bg-blue-900/60 text-blue-300 border border-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {question.subject}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-orange-200 text-black font-semibold text-xs rounded hover:bg-orange-100 transition cursor-pointer"
                >
                    <Pencil size={13} />
                    Edit
                </button>
            </div>

            {/* Question Text */}
            <div className="text-gray-100 text-base leading-relaxed whitespace-pre-wrap">
                {question.text}
            </div>

            {/* Attached Image if any */}
            {question.image && (
                <div className="mt-2">
                    <img
                        src={question.image}
                        alt={`Question ${question.index}`}
                        className="max-h-56 rounded-lg border border-gray-700 object-contain bg-black/30 p-1"
                    />
                </div>
            )}

            {/* TYPE-SPECIFIC DISPLAY: NUMERICAL */}
            {isNumerical && (
                <div className="p-3 bg-orange-950/40 border border-orange-600/50 rounded-xl text-sm flex items-center justify-between">
                    <span className="font-semibold text-orange-300 flex items-center gap-1.5">
                        <Hash size={14} /> Numerical Value Answer:
                    </span>
                    <span className="font-mono font-bold text-base bg-orange-900/70 px-3.5 py-1 rounded-lg border border-orange-400/40 text-orange-100 shadow-sm">
                        {question.correctAnswer || 'Not set'}
                    </span>
                </div>
            )}

            {/* TYPE-SPECIFIC DISPLAY: DESCRIPTIVE */}
            {isDescriptive && (
                <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-sm space-y-1.5">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <FileText size={14} /> Expected Answer / Key Points:
                    </span>
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {question.correctAnswer || 'Not set'}
                    </div>
                </div>
            )}

            {/* TYPE-SPECIFIC DISPLAY: TRUE / FALSE */}
            {isTrueFalse && (
                <div className="flex gap-3 pt-1">
                    {['True', 'False'].map((val) => {
                        const isCorrect = String(val).toLowerCase() === String(question.correctAnswer).toLowerCase();
                        return (
                            <div
                                key={val}
                                className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold ${
                                    isCorrect
                                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                                        : 'bg-gray-900/60 border-gray-700 text-gray-400'
                                }`}
                            >
                                <span>{val}</span>
                                {isCorrect && <Check size={16} className="text-emerald-400" />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TYPE-SPECIFIC DISPLAY: MCQ and MSQ */}
            {(isMCQ || isMSQ) && !isNumerical && !isDescriptive && hasNonEmptyOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {question.options
                        .filter((opt) => opt && String(opt).trim() !== '')
                        .map((opt, idx) => {
                            const isCorrect = String(opt).trim() === String(question.correctAnswer).trim();
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                                        isCorrect
                                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium'
                                            : 'bg-gray-900/60 border-gray-700 text-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                                            isCorrect ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-300'
                                        }`}
                                    >
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="flex-1 break-words">{opt}</span>
                                    {isCorrect && <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />}
                                </div>
                            );
                        })}
                </div>
            )}

            {/* Correct Answer line for MCQ/MSQ */}
            {(isMCQ || isMSQ) && question.correctAnswer && (
                <div className="text-xs text-gray-400 flex items-center gap-1.5 pt-1 border-t border-gray-700/60">
                    <span className="font-semibold text-gray-300">Correct Answer:</span>
                    <span className="text-emerald-300 font-medium">{question.correctAnswer}</span>
                </div>
            )}
        </div>
    );
}

export default QuestionCard;
