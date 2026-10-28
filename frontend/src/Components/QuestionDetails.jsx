import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, X, BookOpen, Layers, Award, Clock, HelpCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { getStructure, getSection } from '../Api/structureApi';
import { getQuestions } from '../Api/questionApi';
import QuestionCard from './QuestionCard';

function QuestionDetails({ id, onClose, title = "Test Overview & Questions" }) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [structure, setStructure] = useState(null);
    const [sections, setSections] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedTab, setSelectedTab] = useState('ALL');

    const loadData = async (isManualRefresh = false) => {
        if (!id) return;
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            // 1. Fetch test structure
            const structRes = await getStructure(id);
            const structData = structRes?.data;
            setStructure(structData);

            // 2. Fetch all questions for this test
            const questionsRes = await getQuestions(id);
            const allQuestions = Array.isArray(questionsRes?.data) ? questionsRes.data : [];
            setQuestions(allQuestions);

            // 3. Fetch each defined section
            const secCount = structData?.noOfSec || (Array.isArray(structData?.sections) ? structData.sections.length : 0);
            if (secCount > 0) {
                const secPromises = [];
                for (let i = 0; i < secCount; i++) {
                    const secChar = String.fromCharCode(65 + i);
                    secPromises.push(
                        getSection(secChar, id)
                            .then(res => res?.data?.[0] || null)
                            .catch(() => null)
                    );
                }
                const fetchedSections = await Promise.all(secPromises);
                setSections(fetchedSections.filter(Boolean));
            } else {
                setSections([]);
            }
        } catch (err) {
            console.error("Error loading test details:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleQuestionUpdated = (updatedQ) => {
        setQuestions(prev => prev.map(q => (q._id === updatedQ._id ? updatedQ : q)));
    };

    if (loading) {
        return (
            <div className="mt-4 p-8 bg-gray-900/90 border border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-white">
                <Loader2 size={32} className="animate-spin text-orange-300" />
                <p className="text-sm text-gray-300">Loading test structure and questions...</p>
            </div>
        );
    }

    if (!structure) {
        return (
            <div className="mt-4 p-6 bg-gray-900 border border-gray-800 rounded-2xl text-center text-gray-400">
                <p>Could not load test details.</p>
                <button
                    onClick={() => loadData(true)}
                    className="mt-3 px-4 py-1.5 bg-orange-200 text-black text-sm font-semibold rounded hover:bg-orange-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Filter questions per section
    const getQuestionsForSection = (secName, secId) => {
        return questions.filter(q => {
            if (secId && String(q.section) === String(secId)) return true;
            // Also check if question section matches by index/name if populated
            if (q.sectionName && q.sectionName === secName) return true;
            return false;
        });
    };

    // Calculate total expected questions across all configured sections
    const totalTargetQuestions = sections.reduce((acc, s) => acc + (Number(s.numOfQues) || 0), 0);

    return (
        <div className="mt-4 p-5 sm:p-7 bg-gray-800 border border-gray-800 rounded-2xl shadow-2xl text-white space-y-6 animate-in fade-in duration-300">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <FileText size={22} className="text-orange-200" />
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            {title}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Viewing questions & configuration for <span className="text-orange-200 font-semibold">{structure.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        title="Refresh data"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-700 transition cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Test Metadata Badges & Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/10  rounded-lg shrink-0">
                        <Award size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Total Marks</div>
                        <div className="text-lg font-bold text-gray-100">{structure.totalMarks}</div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10  rounded-lg shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Time Duration</div>
                        <div className="text-lg font-bold text-gray-100">{structure.timeDuration}h</div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10  rounded-lg shrink-0">
                        <Layers size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Sections</div>
                        <div className="text-lg font-bold text-gray-100">{structure.noOfSec}</div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-3.5 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-lg shrink-0">
                        <HelpCircle size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Questions Added</div>
                        <div className="text-lg font-bold text-gray-100">
                            {questions.length}
                            {totalTargetQuestions > 0 && (
                                <span className="text-xs font-normal text-gray-400 ml-1">
                                    / {totalTargetQuestions} target
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Pill Bar */}
            {structure.subjects && structure.subjects.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap text-sm bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
                    <span className="text-gray-400 text-xs font-semibold flex items-center gap-1">
                        <BookOpen size={14} className="text-orange-300" />
                        Subjects:
                    </span>
                    {structure.subjects.map((subj, idx) => (
                        <span
                            key={idx}
                            className="bg-gray-800 text-gray-200 border border-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                            {subj}
                        </span>
                    ))}
                </div>
            )}

            {/* Section Tab Filters */}
            {sections.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800">
                    <button
                        onClick={() => setSelectedTab('ALL')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            selectedTab === 'ALL'
                                ? 'bg-orange-200 text-black shadow'
                                : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                        }`}
                    >
                        All Sections ({questions.length})
                    </button>
                    {sections.map(sec => {
                        const count = getQuestionsForSection(sec.secName, sec._id).length;
                        return (
                            <button
                                key={sec._id || sec.secName}
                                onClick={() => setSelectedTab(sec.secName)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                    selectedTab === sec.secName
                                        ? 'bg-orange-200 text-black shadow'
                                        : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                                }`}
                            >
                                <span>Section {sec.secName}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    selectedTab === sec.secName
                                        ? 'bg-black text-orange-200'
                                        : 'bg-gray-800 text-gray-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Sections & Questions List */}
            {sections.length === 0 ? (
                <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-400 space-y-2">
                    <p className="font-semibold text-gray-300">No sections configured yet</p>
                    <p className="text-xs text-gray-500">
                        Click "Edit Section" above to define Section marking scheme and question count.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections
                        .filter(sec => selectedTab === 'ALL' || selectedTab === sec.secName)
                        .map(sec => {
                            const secQuestions = getQuestionsForSection(sec.secName, sec._id);
                            return (
                                <div
                                    key={sec._id || sec.secName}
                                    className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 space-y-4"
                                >
                                    {/* Section Banner */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-800 pb-3">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="bg-orange-200 text-black font-extrabold text-sm px-3 py-1 rounded-lg">
                                                Section {sec.secName}
                                            </span>
                                            <span className="bg-blue-950  text-xs px-2.5 py-0.5 rounded-full font-medium">
                                                {sec.typeOfQues}
                                            </span>
                                            <span className="bg-emerald-950 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                                +{sec.plusMarks} / -{sec.minusMarks}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Questions: <span className="font-bold text-gray-200">{secQuestions.length}</span> / {sec.numOfQues} configured
                                        </div>
                                    </div>

                                    {/* Section Instructions if available */}
                                    {sec.instructions && (
                                        <div className="text-xs text-gray-400 italic bg-black/20 p-2.5 rounded-lg border border-gray-800">
                                            <span className="font-semibold text-gray-300 not-italic">Instructions: </span>
                                            {sec.instructions}
                                        </div>
                                    )}

                                    {/* Questions in this Section */}
                                    {secQuestions.length === 0 ? (
                                        <div className="p-6 bg-gray-950/60 border border-dashed border-gray-800 rounded-xl text-center space-y-1">
                                            <p className="text-sm text-gray-400">
                                                No questions added to Section {sec.secName} yet.
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Click "Add Question" above and choose Section {sec.secName} to add questions.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {secQuestions.map((q, idx) => (
                                                <QuestionCard
                                                    key={q._id || idx}
                                                    question={q}
                                                    sectionType={sec.typeOfQues}
                                                    sectionName={sec.secName}
                                                    subjects={structure.subjects || []}
                                                    onUpdated={handleQuestionUpdated}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default QuestionDetails;