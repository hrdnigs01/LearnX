import React, { useState, useMemo, useEffect } from 'react';
import {
  scienceClass24Data,
  ScienceChapter,
  ScienceQuizQuestion,
  ScienceFormulaOrEquation,
} from '../data/scienceClass24Material';
import {
  FlaskConical,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Timer,
  Zap,
  Layers,
  FileText,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Flame,
  Dna,
  Atom,
  Share2,
  Download,
} from 'lucide-react';
import { downloadStudyNotesPDF } from '../utils/pdfGenerator';
import { playChime } from '../utils/audio';

interface ScienceStudyMaterialViewProps {
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type ScienceTab = 'notes' | 'quiz' | 'equations';

export const ScienceStudyMaterialView: React.FC<ScienceStudyMaterialViewProps> = ({
  onOpenAiAssistant,
  onBackToNCERT,
}) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<ScienceTab>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  // Quiz Arena States
  const [quizChapterFilter, setQuizChapterFilter] = useState<number | 'all'>('all');
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [timedQuizActive, setTimedQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  const chapters = scienceClass24Data;

  // Filter chapters
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // All quiz questions
  const allQuestions = useMemo(() => {
    return chapters.flatMap((c) => c.mcqs);
  }, [chapters]);

  // Active quiz questions
  const activeQuizQuestions = useMemo(() => {
    if (quizChapterFilter === 'all') return allQuestions;
    return allQuestions.filter((q) => q.chapterNumber === quizChapterFilter);
  }, [allQuestions, quizChapterFilter]);

  const handleDownloadSciencePDF = () => {
    setIsDownloadingPdf(true);
    playChime('click');
    try {
      const activeCh = currentChapters[0] || chapters[0];
      const formulasList =
        activeCh.importantEquations?.map(
          (e) => `${e.name}: ${e.equation || ''} (${e.details || ''})`
        ) || [];
      const conceptsList =
        activeCh.coreConcepts?.map((t) => ({
          title: t.heading,
          explanation: t.points?.[0] || '',
          example: t.reactionsOrEquations?.[0] || t.points?.[1],
        })) || [];
      const questionsList =
        activeCh.mcqs?.slice(0, 8).map((q) => ({
          question: q.question,
          answer: q.options[q.correctIndex],
          explanation: q.explanation,
          marks: 1,
        })) || [];

      const success = downloadStudyNotesPDF({
        title: `Chapter ${activeCh.chapterNumber}: ${activeCh.title}`,
        subject: 'Science',
        classLevel: '10',
        overview: activeCh.summary,
        keyConcepts: conceptsList.slice(0, 6),
        formulas: formulasList.slice(0, 8),
        revisionNotes:
          activeCh.coreConcepts?.flatMap((t) => t.points || []).slice(0, 8) ||
          [],
        questions: questionsList,
        studentName: 'Class 10 Scholar',
      });

      if (success) {
        playChime('success');
        setPdfNotice(`Science Chapter ${activeCh.chapterNumber} Notes PDF downloaded successfully!`);
        setTimeout(() => setPdfNotice(null), 4500);
      }
    } catch (e) {
      console.error('Science PDF export error:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timedQuizActive && !quizSubmitted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setQuizSubmitted(true);
            setTimedQuizActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timedQuizActive, quizSubmitted, timeLeft]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const toggleExplanation = (questionId: string) => {
    setRevealedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setQuizSubmitted(false);
    setTimedQuizActive(false);
    setTimeLeft(900);
    setActiveQuestionIndex(0);
  };

  const startTimedExam = () => {
    handleResetQuiz();
    setQuizMode('timed');
    setTimedQuizActive(true);
  };

  const calculateScore = () => {
    let score = 0;
    activeQuizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Search filter
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold backdrop-blur-xs border border-emerald-400/20">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>CLASS24 Board Examination Revision Notes & Quiz Arena</span>
            </div>

            <button
              id="download-science-pdf-btn"
              onClick={handleDownloadSciencePDF}
              disabled={isDownloadingPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-98 disabled:opacity-50"
              title="Download Science Chapter Notes, Equations & MCQs as a PDF document"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>{isDownloadingPdf ? 'Generating...' : 'Download Notes PDF'}</span>
            </button>
          </div>

          {pdfNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{pdfNotice}</span>
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Class 10 Science Comprehensive Study Material</span>
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
                CBSE 2024-25
              </span>
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-3xl mt-1.5 leading-relaxed">
              Complete chapterwise revision notes, balanced chemical equations, ray diagram rules, laws of electricity and optics, and an interactive MCQ Quiz Arena from the uploaded Class24 repository.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-emerald-200">Chapters Covered</div>
              <div className="text-xl font-bold text-white mt-0.5">{chapters.length} Units</div>
              <div className="text-[11px] text-emerald-200/70">Chemical, Life & Physical Sciences</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-emerald-200">Curated MCQs</div>
              <div className="text-xl font-bold text-amber-300 mt-0.5">{allQuestions.length} Questions</div>
              <div className="text-[11px] text-emerald-200/70">With detailed step-by-step logic</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-emerald-200">Key Equations & Laws</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">30+ Formulas</div>
              <div className="text-[11px] text-emerald-200/70">Reactions, optics, electricity</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-emerald-200">Exam Formats</div>
              <div className="text-xl font-bold text-emerald-300 mt-0.5">Practice & Timed</div>
              <div className="text-[11px] text-emerald-200/70">Real board pattern simulation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Chapter Filter & Subtabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Chapter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
              Chapter:
            </span>
            <button
              onClick={() => setSelectedChapterNum('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedChapterNum === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All {chapters.length} Chapters
            </button>
            {chapters.map((chap) => (
              <button
                key={chap.chapterNumber}
                onClick={() => setSelectedChapterNum(chap.chapterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedChapterNum === chap.chapterNumber
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ch {chap.chapterNumber}: {chap.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* View Modes Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'notes'
                  ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Chapter Notes
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              MCQ Quiz Arena ({allQuestions.length} Qs)
            </button>
            <button
              onClick={() => setActiveTab('equations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'equations'
                  ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Equations & Laws Vault
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search chemical reactions, life processes, light laws, electricity equations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: CHAPTER STUDY NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {currentChapters.map((chap) => {
            const hasMatch =
              matchesSearch(chap.title) ||
              matchesSearch(chap.summary) ||
              chap.coreConcepts.some(
                (c) => matchesSearch(c.heading) || c.points.some((p) => matchesSearch(p))
              ) ||
              chap.importantEquations.some(
                (e) => matchesSearch(e.name) || matchesSearch(e.equation)
              );

            if (!hasMatch) return null;

            return (
              <div
                key={chap.chapterNumber}
                className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden space-y-0"
              >
                {/* Chapter Banner */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 sm:p-6 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5" /> Class 10 Science • Chapter {chap.chapterNumber}
                      <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded text-[10px] ml-2">
                        {chap.category}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {chap.title}
                    </h2>
                    <p className="text-xs text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                      {chap.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizChapterFilter(chap.chapterNumber);
                        setActiveTab('quiz');
                      }}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Take Quiz ({chap.mcqs.length} Qs)
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6">
                  {/* Core Concepts */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Key Principles & Concepts
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {chap.coreConcepts.map((concept, cIdx) => (
                        <div
                          key={cIdx}
                          className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5"
                        >
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                            {concept.heading}
                          </h4>
                          <ul className="space-y-1.5 pl-2">
                            {concept.points.map((pt, pIdx) => (
                              <li key={pIdx} className="text-xs sm:text-[13px] text-slate-700 leading-relaxed flex items-start gap-2">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                          {concept.reactionsOrEquations && concept.reactionsOrEquations.length > 0 && (
                            <div className="pt-2 space-y-1">
                              {concept.reactionsOrEquations.map((rxn, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="font-mono text-xs text-emerald-900 bg-white p-2 rounded-lg border border-slate-200"
                                >
                                  {rxn}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Equations & Formulas */}
                  {chap.importantEquations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-teal-600" />
                        Key Governing Reactions & Laws
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {chap.importantEquations.map((eq, eIdx) => (
                          <div
                            key={eIdx}
                            className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5 hover:border-emerald-300 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800">{eq.name}</span>
                              <button
                                onClick={() => copyText(`${eq.name}: ${eq.equation}`, `eq_${chap.chapterNumber}_${eIdx}`)}
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                                title="Copy"
                              >
                                {copiedId === `eq_${chap.chapterNumber}_${eIdx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="font-mono text-xs text-teal-800 bg-teal-50/60 p-2 rounded-lg border border-teal-100 font-semibold break-words">
                              {eq.equation}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">{eq.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MCQ QUIZ ARENA */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Arena Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  Class 10 Science MCQ Quiz Arena
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Chemical Equations, Acids/Bases, Metals, Life Processes, Control, Light, Eye, Electricity, Magnetism & Environment.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
                  <button
                    onClick={() => {
                      setQuizMode('practice');
                      setTimedQuizActive(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      quizMode === 'practice' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Practice Mode
                  </button>
                  <button
                    onClick={startTimedExam}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      quizMode === 'timed' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Timed Exam
                  </button>
                </div>

                {quizMode === 'timed' && timedQuizActive && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 animate-pulse">
                    <Timer className="w-3.5 h-3.5" />
                    {formatTime(timeLeft)}
                  </div>
                )}
              </div>
            </div>

            {/* Filter by Chapter in Quiz Arena */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Unit:</span>
              <button
                onClick={() => setQuizChapterFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  quizChapterFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Questions ({allQuestions.length})
              </button>
              {chapters.map((chap) => (
                <button
                  key={chap.chapterNumber}
                  onClick={() => setQuizChapterFilter(chap.chapterNumber)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    quizChapterFilter === chap.chapterNumber
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch {chap.chapterNumber}: {chap.title.split(' ')[0]} ({chap.mcqs.length})
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {activeQuizQuestions.map((q, idx) => {
                const userChoice = userAnswers[q.id];
                const isSelected = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;
                const isRevealed = revealedExplanations[q.id] || quizSubmitted;

                return (
                  <div
                    key={q.id}
                    className={`border rounded-2xl p-5 transition-all ${
                      quizSubmitted
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : isSelected
                          ? 'border-rose-300 bg-rose-50/40'
                          : 'border-slate-200 bg-white'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Ch {q.chapterNumber} • {q.topic}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                          <span className="text-emerald-700 mr-1.5">Q{idx + 1}.</span> {q.question}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">
                        1 Mark
                      </span>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isThisChosen = userChoice === optIdx;
                        let btnClass = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';

                        if (quizSubmitted || (quizMode === 'practice' && isSelected)) {
                          if (optIdx === q.correctIndex) {
                            btnClass = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold';
                          } else if (isThisChosen && !isCorrect) {
                            btnClass = 'border-rose-400 bg-rose-100 text-rose-900 font-bold';
                          }
                        } else if (isThisChosen) {
                          btnClass = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 rounded-xl text-xs text-left border transition-all flex items-center gap-2.5 ${btnClass}`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-white border border-current flex-shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation toggle / feedback */}
                    {(quizMode === 'practice' && isSelected) || isRevealed ? (
                      <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            Correct Answer: ({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                          </span>
                        </div>
                        <p className="text-emerald-900/90 leading-relaxed text-[11px] pt-1">
                          {q.explanation}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          View Explanation & Answer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Bar */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {quizSubmitted ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm font-black text-slate-900">
                    Final Score: <span className="text-emerald-700">{calculateScore()}</span> / {activeQuizQuestions.length}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    ({Math.round((calculateScore() / activeQuizQuestions.length) * 100)}% accuracy)
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  {Object.keys(userAnswers).length} of {activeQuizQuestions.length} questions answered
                </span>
              )}

              <div className="flex items-center gap-2">
                {quizSubmitted ? (
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
                  >
                    Retake Quiz Arena
                  </button>
                ) : (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-all disabled:opacity-50 shadow-sm"
                  >
                    Submit & View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EQUATIONS & LAWS VAULT */}
      {activeTab === 'equations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                Formula Bank & Reaction Equations
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">
                Class 10 Science Master Equation Vault
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Essential chemical equations, laws of optics, electricity equations, and ray tracing conventions with 1-click clipboard copying.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapters.flatMap((c) =>
                c.importantEquations.map((eq) => ({ ...eq, chapter: c.title, chNum: c.chapterNumber }))
              ).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-300 transition-colors shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                      Ch {item.chNum}: {item.chapter.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => copyText(`${item.name}: ${item.equation}`, `vault_eq_${idx}`)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="Copy Equation"
                    >
                      {copiedId === `vault_eq_${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <div className="p-3 bg-slate-900 text-teal-300 font-mono text-xs sm:text-sm rounded-xl overflow-x-auto shadow-inner">
                    {item.equation}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
