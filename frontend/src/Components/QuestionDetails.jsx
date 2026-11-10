import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, X, BookOpen, FileText } from 'lucide-react';
import { getStructure, getSection } from '../Api/structureApi';
import { getQuestions } from '../Api/questionApi';
import TestStatsBadges from './details/TestStatsBadges';
import SectionPanel from './details/SectionPanel';

function QuestionDetails({ id, onClose, title = 'Test Overview & Questions' }) {
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [structure, setStructure]   = useState(null);
  const [sections, setSections]     = useState([]);
  const [questions, setQuestions]   = useState([]);
  const [selectedTab, setSelectedTab] = useState('ALL');

  const loadData = async (isManualRefresh = false) => {
    if (!id) return;
    isManualRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const structRes = await getStructure(id);
      const structData = structRes?.data;
      setStructure(structData);

      const questionsRes = await getQuestions(id);
      setQuestions(Array.isArray(questionsRes?.data) ? questionsRes.data : []);

      const secCount = structData?.noOfSec ||
        (Array.isArray(structData?.sections) ? structData.sections.length : 0);

      if (secCount > 0) {
        const promises = Array.from({ length: secCount }, (_, i) => {
          const c = String.fromCharCode(65 + i);
          return getSection(c, id).then((r) => r?.data?.[0] || null).catch(() => null);
        });
        setSections((await Promise.all(promises)).filter(Boolean));
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error('Error loading test details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleQuestionUpdated = (updatedQ) =>
    setQuestions((prev) => prev.map((q) => (q._id === updatedQ._id ? updatedQ : q)));

  const getQuestionsForSection = (secName, secId) =>
    questions.filter((q) =>
      (secId && String(q.section) === String(secId)) ||
      (q.sectionName && q.sectionName === secName)
    );

  const totalTargetQuestions = sections.reduce((acc, s) => acc + (Number(s.numOfQues) || 0), 0);

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

  const visibleSections = sections.filter(
    (sec) => selectedTab === 'ALL' || selectedTab === sec.secName
  );

  return (
    <div className="mt-4 p-5 sm:p-7 bg-gray-800 border border-gray-800 rounded-2xl shadow-2xl text-white space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={22} className="text-orange-200" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Viewing questions & configuration for{' '}
            <span className="text-orange-200 font-semibold">{structure.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => loadData(true)} disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg border border-gray-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition cursor-pointer">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <TestStatsBadges
        structure={structure}
        questionsCount={questions.length}
        totalTargetQuestions={totalTargetQuestions}
      />

      {/* Subjects pill bar */}
      {structure.subjects?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-sm bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
          <span className="text-gray-400 text-xs font-semibold flex items-center gap-1">
            <BookOpen size={14} className="text-orange-300" /> Subjects:
          </span>
          {structure.subjects.map((subj, idx) => (
            <span key={idx} className="bg-gray-800 text-gray-200 border border-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
              {subj}
            </span>
          ))}
        </div>
      )}

      {/* Section tab filters */}
      {sections.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-800">
          <button
            onClick={() => setSelectedTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedTab === 'ALL' ? 'bg-orange-200 text-black shadow' : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
            }`}
          >
            All Sections ({questions.length})
          </button>
          {sections.map((sec) => {
            const count = getQuestionsForSection(sec.secName, sec._id).length;
            return (
              <button
                key={sec._id || sec.secName}
                onClick={() => setSelectedTab(sec.secName)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  selectedTab === sec.secName ? 'bg-orange-200 text-black shadow' : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <span>Section {sec.secName}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${selectedTab === sec.secName ? 'bg-black text-orange-200' : 'bg-gray-800 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Section panels or empty state */}
      {sections.length === 0 ? (
        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-400 space-y-2">
          <p className="font-semibold text-gray-300">No sections configured yet</p>
          <p className="text-xs text-gray-500">Click "Edit Section" above to define Section marking scheme and question count.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleSections.map((sec) => (
            <SectionPanel
              key={sec._id || sec.secName}
              sec={sec}
              secQuestions={getQuestionsForSection(sec.secName, sec._id)}
              subjects={structure.subjects || []}
              onUpdated={handleQuestionUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionDetails;
