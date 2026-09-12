import React, { useState } from 'react';
import { samplePapersCollection, SamplePaper, SamplePaperMCQ } from '../data/samplePapersData';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  Award,
  Clock,
  Printer,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
} from 'lucide-react';

interface SamplePapersViewProps {
  onOpenAiAssistant?: (prompt: string) => void;
}

export const SamplePapersView: React.FC<SamplePapersViewProps> = ({ onOpenAiAssistant }) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>(samplePapersCollection[0].id);
  const [viewMode, setViewMode] = useState<'fullPaper' | 'interactiveMCQ'>('fullPaper');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userMCQAnswers, setUserMCQAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const availableSubjects = ['all', ...Array.from(new Set(samplePapersCollection.map((p) => p.subject)))];

  const filteredPapers = samplePapersCollection.filter(
    (p) => subjectFilter === 'all' || p.subject.toLowerCase() === subjectFilter.toLowerCase()
  );

  const activePaper: SamplePaper =
    samplePapersCollection.find((p) => p.id === selectedPaperId) || samplePapersCollection[0];

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectMCQ = (qId: string, optIdx: number) => {
    if (mcqSubmitted) return;
    setUserMCQAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleResetMCQ = () => {
    setUserMCQAnswers({});
    setMcqSubmitted(false);
  };

  const calculateScore = () => {
    let score = 0;
    activePaper.mcqQuestions.forEach((q) => {
      if (userMCQAnswers[q.id] === q.correctIndex) {
        score += q.marks;
      }
    });
    return score;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-blue-400/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Official Examination Practice Papers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Sample Question Papers & Practice Sets
          </h1>
          <p className="text-sm text-blue-100/80 leading-relaxed">
            Practice with authentic school and regional board examination papers. View complete section-wise question papers with model answers or attempt the objective MCQ section interactively.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setViewMode('fullPaper')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'fullPaper'
                  ? 'bg-white text-blue-950 shadow-md'
                  : 'bg-blue-800/40 text-blue-200 hover:bg-blue-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Full Question Paper & Model Answers
            </button>
            <button
              onClick={() => setViewMode('interactiveMCQ')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'interactiveMCQ'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-blue-800/40 text-blue-200 hover:bg-blue-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Interactive MCQ Practice Mode
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 ml-auto"
              title="Print Question Paper"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Paper
            </button>
          </div>
        </div>
      </div>

      {/* Subject Filter & Paper Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E4D9] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Subject:
            </span>
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  subjectFilter === sub
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {filteredPapers.length} Question Paper{filteredPapers.length > 1 ? 's' : ''} available
          </div>
        </div>

        {/* Paper Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {filteredPapers.map((paper) => {
            const isSelected = paper.id === activePaper.id;
            return (
              <div
                key={paper.id}
                onClick={() => {
                  setSelectedPaperId(paper.id);
                  setUserMCQAnswers({});
                  setMcqSubmitted(false);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50/70 ring-1 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {paper.subject} • {paper.grade}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">{paper.year}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                  {paper.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {paper.duration}
                  </span>
                  <span>Max Marks: {paper.totalMarks}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Paper Details Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                {activePaper.board}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {activePaper.grade} — {activePaper.subject}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{activePaper.title}</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px]">TIME</span>
              {activePaper.duration}
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL MARKS</span>
              {activePaper.totalMarks} Marks
            </div>
          </div>
        </div>

        {/* General Instructions */}
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3.5">
          <h4 className="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> General Instructions:
          </h4>
          <ul className="text-xs text-amber-900/80 space-y-1 list-disc list-inside">
            {activePaper.generalInstructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* VIEW MODE 1: FULL QUESTION PAPER WITH MODEL ANSWERS */}
      {viewMode === 'fullPaper' && (
        <div className="space-y-6">
          {/* SECTION A: MCQs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  SECTION A — Multiple Choice Questions (Objective Type)
                </h3>
                <p className="text-xs text-slate-500">
                  {activePaper.mcqQuestions.length} Questions • 1 Mark each
                </p>
              </div>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                [{activePaper.mcqQuestions.length} × 1 = {activePaper.mcqQuestions.length} Marks]
              </span>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {activePaper.mcqQuestions.map((q) => {
                const isRevealed = revealedAnswers[q.id];
                return (
                  <div key={q.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        <span className="text-blue-700 mr-1.5">Q{q.qNum}.</span> {q.question}
                      </p>
                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                        [1 Mark]
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg text-xs border ${
                              isRevealed && isCorrect
                                ? 'border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold'
                                : 'border-slate-200 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1.5">
                              {String.fromCharCode(97 + optIdx)})
                            </span>
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1 pl-4">
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        {isRevealed ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" /> Hide Model Answer & Reason
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" /> View Answer & Explanation
                          </>
                        )}
                      </button>
                      {q.category && (
                        <span className="text-[10px] text-slate-400 font-medium">{q.category}</span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="ml-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct Answer: ({String.fromCharCode(97 + q.correctIndex)}) {q.options[q.correctIndex]}
                        </div>
                        <p className="text-emerald-900/90 leading-relaxed text-[11px]">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESCRIPTIVE SECTIONS */}
          {activePaper.descriptiveQuestions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Descriptive Sections (Short, Long & Competency Questions)
                </h3>
                <p className="text-xs text-slate-500">
                  Official marking scheme and complete step-by-step model solutions
                </p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                {activePaper.descriptiveQuestions.map((dq) => {
                  const isRevealed = revealedAnswers[dq.id];
                  return (
                    <div key={dq.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-md mr-2">
                            {dq.section}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            Q{dq.qNum}. {dq.question}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          [{dq.marks} Mark{dq.marks > 1 ? 's' : ''}]
                        </span>
                      </div>

                      {dq.hasOrChoice && dq.orQuestion && (
                        <div className="ml-4 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                          <span className="font-bold text-[11px] uppercase tracking-wider text-amber-800">
                            OR Choice:
                          </span>
                          <p>{dq.orQuestion}</p>
                        </div>
                      )}

                      <div className="pt-1">
                        <button
                          onClick={() => toggleAnswer(dq.id)}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                        >
                          {isRevealed ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" /> Hide Model Solution
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" /> View Model Answer & Marking Scheme
                            </>
                          )}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1.5">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Model Answer / Solution:
                          </div>
                          <p className="leading-relaxed text-[11px] whitespace-pre-line text-slate-700">
                            {dq.modelAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE MCQ PRACTICE MODE */}
      {viewMode === 'interactiveMCQ' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Interactive MCQ Practice: {activePaper.subject} ({activePaper.year})
                </h3>
                <p className="text-xs text-slate-500">
                  Attempt all {activePaper.mcqQuestions.length} questions and evaluate your exam readiness
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                  Answered: {Object.keys(userMCQAnswers).length} / {activePaper.mcqQuestions.length}
                </span>
                <button
                  onClick={handleResetMCQ}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  title="Reset test"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {activePaper.mcqQuestions.map((q) => {
                const selectedOpt = userMCQAnswers[q.id];
                const hasAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      mcqSubmitted
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : 'border-rose-300 bg-rose-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        <span className="text-blue-700 mr-1.5">Q{q.qNum}.</span> {q.question}
                      </p>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {q.marks} Mark
                      </span>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        let btnStyle = 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700';

                        if (mcqSubmitted) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-100/90 text-emerald-900 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'border-rose-400 bg-rose-100 text-rose-900';
                          }
                        } else if (isChosen) {
                          btnStyle = 'border-blue-700 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-700';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={mcqSubmitted}
                            onClick={() => handleSelectMCQ(q.id, optIdx)}
                            className={`p-2.5 rounded-xl text-xs text-left border transition-all flex items-center gap-2 ${btnStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-white border border-current flex-shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation */}
                    {mcqSubmitted && (
                      <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          {isCorrect ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer (+1 Mark)
                            </span>
                          ) : (
                            <span className="text-rose-700">
                              Incorrect! Correct: ({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Bar */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {mcqSubmitted ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm font-black text-slate-900">
                    Your Score: <span className="text-blue-700">{calculateScore()}</span> / {activePaper.mcqQuestions.length}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({Math.round((calculateScore() / activePaper.mcqQuestions.length) * 100)}% accuracy)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Complete all questions then click submit below
                </span>
              )}

              <div className="flex items-center gap-2">
                {mcqSubmitted ? (
                  <button
                    onClick={handleResetMCQ}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition"
                  >
                    Retake Quiz
                  </button>
                ) : (
                  <button
                    onClick={() => setMcqSubmitted(true)}
                    disabled={Object.keys(userMCQAnswers).length === 0}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white transition-all disabled:opacity-50 shadow-sm"
                  >
                    Submit & View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
