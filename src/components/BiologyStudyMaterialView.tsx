import React, { useState, useMemo, useEffect } from 'react';
import {
  biologyStudyMaterialData,
  BioChapterMaterial,
  BioQuizQuestion,
} from '../data/biologyMaterial';
import {
  Dna,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Timer,
  Flame,
  ArrowRight,
  Layers,
  GraduationCap,
  Bookmark,
  Share2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';

interface BiologyStudyMaterialViewProps {
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type BioTab = 'notes' | 'quiz' | 'flowcharts' | 'mnemonics';

export const BiologyStudyMaterialView: React.FC<BiologyStudyMaterialViewProps> = ({
  onOpenAiAssistant,
  onBackToNCERT,
}) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<BioTab>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selfTestMode, setSelfTestMode] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quiz Engine State
  const [quizChapterFilter, setQuizChapterFilter] = useState<number | 'all'>('all');
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [timedQuizActive, setTimedQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins (900 seconds)
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentTimedQuestionIdx, setCurrentTimedQuestionIdx] = useState(0);

  const chapters = biologyStudyMaterialData;

  // Filtered chapters
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // All quiz questions
  const allQuestions = useMemo(() => {
    return chapters.flatMap((c) => c.quizQuestions);
  }, [chapters]);

  // Filtered quiz questions for the Quiz Arena
  const activeQuizQuestions = useMemo(() => {
    if (quizChapterFilter === 'all') return allQuestions;
    return allQuestions.filter((q) => q.chapterNumber === quizChapterFilter);
  }, [allQuestions, quizChapterFilter]);

  // Timed Quiz Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timedQuizActive && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
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
    return () => clearInterval(timer);
  }, [timedQuizActive, quizSubmitted, timeLeft]);

  // Start timed quiz
  const handleStartTimedQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setTimeLeft(activeQuizQuestions.length * 60); // 1 min per question
    setTimedQuizActive(true);
    setQuizSubmitted(false);
    setCurrentTimedQuestionIdx(0);
  };

  // Submit timed quiz
  const handleSubmitTimedQuiz = () => {
    setTimedQuizActive(false);
    setQuizSubmitted(true);
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setQuizSubmitted(false);
    setTimedQuizActive(false);
    setTimeLeft(900);
    setCurrentTimedQuestionIdx(0);
  };

  // Select Option in Practice / Timed mode
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted && quizMode === 'timed') return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Score Calculation
  const scoreStats = useMemo(() => {
    let score = 0;
    let attempted = 0;
    activeQuizQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        attempted += 1;
        if (ans === q.correctIndex) {
          score += 1;
        }
      }
    });
    const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
    const totalPercentage = Math.round((score / activeQuizQuestions.length) * 100);
    return { score, attempted, total: activeQuizQuestions.length, percentage, totalPercentage };
  }, [activeQuizQuestions, userAnswers]);

  // Search filter
  const matchesSearch = (text: string | string[]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (Array.isArray(text)) {
      return text.some((t) => t.toLowerCase().includes(q));
    }
    return text.toLowerCase().includes(q);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${isPrintMode ? 'bg-white p-4' : ''}`}>
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-rose-400/20 text-rose-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-rose-400/30 flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5" /> CBSE Quick Revision Notes
              </span>
              <span className="bg-white/10 text-rose-100 text-xs px-3 py-1 rounded-full border border-white/10">
                Class 11 Biology
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-400/20 font-mono">
                3 Core Chapters • 30 NCERT Quizzes
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onBackToNCERT && (
                <button
                  onClick={onBackToNCERT}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-white"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Back to NCERT
                </button>
              )}
              <button
                onClick={() => setIsPrintMode(!isPrintMode)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-white"
              >
                <Printer className="w-3.5 h-3.5" />
                {isPrintMode ? 'Normal View' : 'Print Mode'}
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Class 11 Biology Quick Revision Notes & Quiz</span>
              <span className="text-xs bg-rose-500 text-white font-semibold px-2.5 py-0.5 rounded-full uppercase">
                CBSE 2024-25
              </span>
            </h1>
            <p className="text-rose-100/90 text-sm max-w-3xl mt-1.5 leading-relaxed">
              Complete revision notes for <strong>Chapter 01 (The Living World)</strong>,{' '}
              <strong>Chapter 02 (Biological Classification)</strong>, and{' '}
              <strong>Chapter 10 (Cell Cycle and Cell Division)</strong> with interactive self-testing,
              diagrammatic charts, and 30 board exam MCQs.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-rose-200">Total Chapters</div>
              <div className="text-xl font-bold text-white mt-0.5">3 Chapters</div>
              <div className="text-[11px] text-rose-200/70">Ch 1, Ch 2 & Ch 10</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-rose-200">Interactive MCQs</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">30 Questions</div>
              <div className="text-[11px] text-rose-200/70">10 per chapter with solutions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-rose-200">Key Diagrams</div>
              <div className="text-xl font-bold text-amber-300 mt-0.5">6 Matrices</div>
              <div className="text-[11px] text-rose-200/70">Cell Cycle, 5 Kingdoms & Mitosis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-rose-200">Exam Mode</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">Timed / Practice</div>
              <div className="text-[11px] text-rose-200/70">Instant score & accuracy %</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
        {/* Top Controls: Chapter Filter + Main Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Chapter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
              Chapter:
            </span>
            <button
              onClick={() => setSelectedChapterNum('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedChapterNum === 'all'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 3 Chapters
            </button>
            {chapters.map((chap) => (
              <button
                key={chap.chapterNumber}
                onClick={() => setSelectedChapterNum(chap.chapterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedChapterNum === chap.chapterNumber
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ch {chap.chapterNumber}: {chap.title}
              </button>
            ))}
          </div>

          {/* View Modes Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Revision Notes
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-rose-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Quiz Arena (30 Qs)
            </button>
            <button
              onClick={() => setActiveTab('flowcharts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'flowcharts'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Charts & Comparison
            </button>
            <button
              onClick={() => setActiveTab('mnemonics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'mnemonics'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Mnemonics
            </button>
          </div>
        </div>

        {/* Search & Tool Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, terms (e.g. Diplotene, Viroid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelfTestMode(!selfTestMode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
                selfTestMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle answers to test your memory"
            >
              {selfTestMode ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
              Self-Test Mode: {selfTestMode ? 'ON (Answers Hidden)' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: REVISION NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {currentChapters.map((chapter) => {
            const hasMatchingContent =
              matchesSearch(chapter.title) ||
              matchesSearch(chapter.overview) ||
              chapter.concepts.some(
                (c) => matchesSearch(c.title) || matchesSearch(c.summary) || matchesSearch(c.keyPoints)
              );

            if (!hasMatchingContent) return null;

            return (
              <div
                key={chapter.chapterNumber}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Chapter Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-rose-950 p-5 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-rose-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> CBSE Quick Revision Notes • Chapter {chapter.chapterNumber}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-rose-100/80 mt-1 max-w-2xl">{chapter.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizChapterFilter(chapter.chapterNumber);
                        setActiveTab('quiz');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Take Chapter Quiz (10 Qs)
                    </button>
                  </div>
                </div>

                {/* Chapter Content Body */}
                <div className="p-6 space-y-6">
                  {/* Overview Section */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1.5">
                      Chapter Synopsis & Conceptual Core
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{chapter.overview}</p>
                  </div>

                  {/* Importance of Study Section (as specifically emphasized in CBSE PDF) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Significance & Key Pedagogical Importance
                    </h4>
                    <ul className="space-y-1.5">
                      {chapter.importancePoints.map((pt, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Concepts Breakdown */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Core Concept Breakdown & Explanations
                    </h3>
                    {chapter.concepts.map((concept) => (
                      <div
                        key={concept.id}
                        className="border border-slate-200 rounded-xl p-5 hover:border-rose-300 transition-colors bg-white space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              {concept.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{concept.summary}</p>
                          </div>
                          {onOpenAiAssistant && (
                            <button
                              onClick={() =>
                                onOpenAiAssistant(
                                  `Explain in detail for Class 11 Biology: "${concept.title}" from Chapter ${chapter.chapterNumber} with NCERT examples and exam tips.`
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 shrink-0"
                              title="Ask AI Doubt Mentor"
                            >
                              <Sparkles className="w-3 h-3" />
                              Ask AI Mentor
                            </button>
                          )}
                        </div>

                        {/* Bulleted Points */}
                        <div className="space-y-2 pt-1">
                          {concept.keyPoints.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5 pl-2"
                            >
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>

                        {/* Concept Embedded Table / Diagram */}
                        {concept.diagramOrTable && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-rose-600" />
                              {concept.diagramOrTable.title}
                            </div>

                            {concept.diagramOrTable.rows && (
                              <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                                      {concept.diagramOrTable.rows[0] && (
                                        <>
                                          <th className="p-2.5">{concept.diagramOrTable.rows[0].col1}</th>
                                          <th className="p-2.5">{concept.diagramOrTable.rows[0].col2}</th>
                                          {concept.diagramOrTable.rows[0].col3 && (
                                            <th className="p-2.5">{concept.diagramOrTable.rows[0].col3}</th>
                                          )}
                                        </>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {concept.diagramOrTable.rows.slice(1).map((row, rIdx) => (
                                      <tr key={rIdx} className="hover:bg-slate-50/80">
                                        <td className="p-2.5 font-medium text-slate-900">{row.col1}</td>
                                        <td className="p-2.5 text-slate-700">{row.col2}</td>
                                        {row.col3 && <td className="p-2.5 text-slate-600">{row.col3}</td>}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {concept.diagramOrTable.steps && (
                              <div className="space-y-2">
                                {concept.diagramOrTable.steps.map((step, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shrink-0">
                                      {sIdx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Fast Revision Bulletins */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      High-Yield Pre-Exam Bulletins
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chapter.quickRevisionBulletins.map((bulletin, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-white p-2.5 rounded-lg border border-emerald-100 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                        >
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{bulletin}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: INTERACTIVE QUIZ ARENA */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Arena Control Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-rose-600" />
                  CBSE Class 11 Biology Quiz Arena
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Master concepts with immediate explanatory feedback or test yourself against the countdown clock.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                  <button
                    onClick={() => {
                      setQuizMode('practice');
                      setTimedQuizActive(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      quizMode === 'practice'
                        ? 'bg-white text-rose-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Practice Mode (Instant Feedback)
                  </button>
                  <button
                    onClick={() => {
                      setQuizMode('timed');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      quizMode === 'timed'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Timed Exam Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Filter by Chapter in Quiz Arena */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Questions:</span>
                <button
                  onClick={() => setQuizChapterFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All 30 Questions (Full Mock)
                </button>
                <button
                  onClick={() => setQuizChapterFilter(1)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 1
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 1: Living World (10 Qs)
                </button>
                <button
                  onClick={() => setQuizChapterFilter(2)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 2
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 2: Biological Classification (10 Qs)
                </button>
                <button
                  onClick={() => setQuizChapterFilter(10)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 10
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 10: Cell Division (10 Qs)
                </button>
              </div>

              {/* Reset Quiz & Action Buttons */}
              <div className="flex items-center gap-2">
                {quizMode === 'timed' && !timedQuizActive && !quizSubmitted && (
                  <button
                    onClick={handleStartTimedQuiz}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Start {activeQuizQuestions.length}-Question Test
                  </button>
                )}
                {timedQuizActive && (
                  <button
                    onClick={handleSubmitTimedQuiz}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submit Test Now
                  </button>
                )}
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Live Timer Strip (if timed mode active) */}
            {quizMode === 'timed' && timedQuizActive && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="text-xs font-semibold text-rose-900">Time Remaining:</span>
                  <span className="text-base font-mono font-bold text-rose-700">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-xs text-rose-700">
                  Question {currentTimedQuestionIdx + 1} of {activeQuizQuestions.length}
                </div>
              </div>
            )}

            {/* Score Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500">Attempted</div>
                <div className="text-lg font-bold text-slate-900">
                  {scoreStats.attempted} / {scoreStats.total}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Correct Score</div>
                <div className="text-lg font-bold text-emerald-600">{scoreStats.score} Marks</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Accuracy Rate</div>
                <div className="text-lg font-bold text-blue-600">{scoreStats.percentage}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Total Completion</div>
                <div className="text-lg font-bold text-rose-600">{scoreStats.totalPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Timed Quiz Result Card */}
          {quizSubmitted && (
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Quiz Completed! Exam Performance Report</h3>
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-semibold rounded-lg"
                >
                  Take Again
                </button>
              </div>
              <p className="text-xs text-emerald-200">
                You scored <strong>{scoreStats.score}</strong> out of <strong>{scoreStats.total}</strong> marks (
                {scoreStats.totalPercentage}%). Review the questions below to see detailed NCERT textbook explanations.
              </p>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-4">
            {activeQuizQuestions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;
              const isRevealed = revealedExplanations[q.id] || (quizSubmitted && !selfTestMode);

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Ch {q.chapterNumber}: {q.chapterTitle}
                      </span>
                      <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {q.topic}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-700'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyText(`${q.question}\nOptions:\n${q.options.join('\n')}`, q.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title="Copy Question"
                      >
                        {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {onOpenAiAssistant && (
                        <button
                          onClick={() =>
                            onOpenAiAssistant(
                              `Explain this Class 11 Biology question from Chapter ${q.chapterNumber}: "${q.question}" with why the correct answer is "${q.options[q.correctIndex]}".`
                            )
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                          title="Ask AI to explain this question"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug mb-4">
                    {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isCorrectOption = optIdx === q.correctIndex;

                      let optClasses = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                      if (isAnswered || quizSubmitted) {
                        if (isCorrectOption) {
                          optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                        } else if (isOptionSelected) {
                          optClasses = 'border-rose-500 bg-rose-50 text-rose-950 font-medium ring-1 ring-rose-500';
                        } else {
                          optClasses = 'border-slate-200 bg-slate-50/50 text-slate-500 opacity-70';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optClasses}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isAnswered || quizSubmitted
                                ? isCorrectOption
                                  ? 'bg-emerald-600 text-white'
                                  : isOptionSelected
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {(isAnswered || quizSubmitted) && isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle & Content */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isRevealed ? 'Hide NCERT Explanation' : 'View NCERT Explanation & Concept'}
                      </button>

                      {isAnswered && (
                        <span
                          className={`text-xs font-semibold ${
                            isCorrect ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isCorrect ? '✓ Correct Answer' : '✗ Incorrect choice'}
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 animate-fadeIn">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs text-rose-800 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Correct Option: ({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                        </div>
                        <p className="leading-relaxed text-xs text-slate-700">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DIAGRAMS & COMPARISON MATRICES */}
      {activeTab === 'flowcharts' && (
        <div className="space-y-6">
          {/* Cell Cycle Circular Representation Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Chapter 10 • Essential Schematic
                </span>
                <h3 className="text-lg font-bold text-slate-900">Phases of the Eukaryotic Cell Cycle</h3>
                <p className="text-xs text-slate-500">
                  Human cell divides in ~24 hours (Interphase {'>'}95%, M Phase {'<'}5%). Yeast divides in 90 minutes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase">G1 Phase (Gap 1)</span>
                  <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">~10 hrs</span>
                </div>
                <p className="text-xs text-slate-700">
                  Interval between mitosis and initiation of DNA replication. Cell is metabolically active and continuously grows.
                </p>
                <div className="text-[11px] font-mono text-blue-800 bg-white/70 p-1.5 rounded-md">
                  DNA: 2C | Chromosome: 2n
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase">S Phase (Synthesis)</span>
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">~9 hrs</span>
                </div>
                <p className="text-xs text-slate-700">
                  DNA replication takes place. Amount of DNA doubles per cell. Centrioles duplicate in animal cytoplasm.
                </p>
                <div className="text-[11px] font-mono text-amber-800 bg-white/70 p-1.5 rounded-md">
                  DNA: 2C → 4C | Chromosome: 2n (same!)
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase">G2 Phase (Gap 2)</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold">~4 hrs</span>
                </div>
                <p className="text-xs text-slate-700">
                  Proteins (tubulin for spindle fibers) synthesized in preparation for mitosis while cell growth continues.
                </p>
                <div className="text-[11px] font-mono text-indigo-800 bg-white/70 p-1.5 rounded-md">
                  DNA: 4C | Chromosome: 2n
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 uppercase">M Phase (Mitosis)</span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">~1 hr</span>
                </div>
                <p className="text-xs text-slate-700">
                  Actual equational division: Karyokinesis (Prophase → Metaphase → Anaphase → Telophase) + Cytokinesis.
                </p>
                <div className="text-[11px] font-mono text-rose-800 bg-white/70 p-1.5 rounded-md">
                  Yields: 2 daughter cells (2n & 2C)
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase">G0 Quiescent Stage:</span>
              <span>
                Adult animal cells that do not divide (e.g., heart muscle cells, neurons) exit G1 and enter an inactive metabolic phase (G0) until needed for tissue repair.
              </span>
            </div>
          </div>

          {/* Prophase I Sub-stages Ladder */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Chapter 10 • Meiotic Prophase I Sequential Ladder
              </span>
              <h3 className="text-lg font-bold text-slate-900">5 Distinct Sub-stages of Prophase I</h3>
              <p className="text-xs text-slate-500">
                Longest and most genetically significant phase where crossing over creates novel genetic recombination.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                <div className="text-xs font-bold text-purple-900">1. Leptotene</div>
                <p className="text-xs text-slate-700">
                  Chromosomes become distinct and visible under the light microscope. Progressive compaction continues.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                <div className="text-xs font-bold text-purple-900">2. Zygotene</div>
                <p className="text-xs text-slate-700">
                  Chromosomes start pairing together (<strong>Synapsis</strong>). Synaptonemal complex forms a <strong>Bivalent or Tetrad</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1.5 ring-1 ring-rose-400">
                <div className="text-xs font-bold text-rose-900">3. Pachytene (Crucial)</div>
                <p className="text-xs text-slate-700">
                  <strong>Crossing over</strong> between non-sister chromatids of homologous pairs mediated by enzyme <strong>recombinase</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                <div className="text-xs font-bold text-purple-900">4. Diplotene</div>
                <p className="text-xs text-slate-700">
                  Dissolution of synaptonemal complex; homologous chromosomes separate except at crossover sites forming X-shaped <strong>Chiasmata</strong>.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
                <div className="text-xs font-bold text-purple-900">5. Diakinesis</div>
                <p className="text-xs text-slate-700">
                  <strong>Terminalisation of chiasmata</strong>. Nuclear membrane breaks and nucleolus completely disappears.
                </p>
              </div>
            </div>
          </div>

          {/* Mitosis vs Meiosis Comparative Matrix */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                High-Yield Board Question (5 Marks)
              </span>
              <h3 className="text-lg font-bold text-slate-900">Difference Between Mitosis and Meiosis</h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3 w-1/4">Key Criterion</th>
                    <th className="p-3 w-3/8 text-blue-900 bg-blue-50/50">Mitosis (Equational)</th>
                    <th className="p-3 w-3/8 text-rose-900 bg-rose-50/50">Meiosis (Reductional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">1. Site of Occurrence</td>
                    <td className="p-3 text-slate-700">Takes place in somatic (body) cells</td>
                    <td className="p-3 text-slate-700">Takes place in reproductive germ cells (meiocytes)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">2. Number of Divisions & Cells</td>
                    <td className="p-3 text-slate-700">Single division producing 2 diploid daughter cells</td>
                    <td className="p-3 text-slate-700">Double division (I & II) producing 4 haploid daughter cells</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">3. Ploidy of Starting Cells</td>
                    <td className="p-3 text-slate-700">Haploid (n) and diploid (2n) both kinds can divide</td>
                    <td className="p-3 text-slate-700">Only diploid (2n) cells undergo meiosis</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">4. Synapsis & Pairing</td>
                    <td className="p-3 text-slate-700">Pairing of homologous chromosomes does NOT occur</td>
                    <td className="p-3 text-slate-700">Pairing of homologous chromosomes occurs in Zygotene</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">5. Crossing Over</td>
                    <td className="p-3 text-slate-700">Completely absent; daughter cells are clones</td>
                    <td className="p-3 text-slate-700">Takes place in Pachytene; produces genetic variation</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">6. Centromere Splitting in Anaphase I</td>
                    <td className="p-3 text-slate-700">Centromeres split simultaneously in anaphase</td>
                    <td className="p-3 text-slate-700">Centromeres DO NOT split in Anaphase I (they split in Anaphase II)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Whittaker's 5 Kingdom Systems Matrix */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Chapter 02 • Taxonomic Framework
              </span>
              <h3 className="text-lg font-bold text-slate-900">R.H. Whittaker’s Five Kingdom Classification</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">1. Monera</div>
                <div className="text-slate-600 space-y-1">
                  <div>• Prokaryotic, unicellular</div>
                  <div>• Peptidoglycan cell wall</div>
                  <div>• Auto/heterotrophic</div>
                  <div>• Bacteria, BGA, Mycoplasma</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">2. Protista</div>
                <div className="text-slate-600 space-y-1">
                  <div>• Eukaryotic, unicellular</div>
                  <div>• Cell wall in diatoms (silica)</div>
                  <div>• Plankton, mixotrophic</div>
                  <div>• Amoeba, Euglena, Paramecium</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">3. Fungi</div>
                <div className="text-slate-600 space-y-1">
                  <div>• Eukaryotic, achlorophyllous</div>
                  <div>• Chitinous cell wall</div>
                  <div>• Saprophytic/parasitic</div>
                  <div>• Mucor, Yeast, Agaricus</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">4. Plantae</div>
                <div className="text-slate-600 space-y-1">
                  <div>• Eukaryotic, multicellular</div>
                  <div>• Cellulose cell wall</div>
                  <div>• Photosynthetic autotrophs</div>
                  <div>• Algae to Angiosperms</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1">5. Animalia</div>
                <div className="text-slate-600 space-y-1">
                  <div>• Eukaryotic, multicellular</div>
                  <div>• Cell wall ABSENT</div>
                  <div>• Holozoic ingestive</div>
                  <div>• Invertebrates to Chordates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MNEMONICS & TIPS */}
      {activeTab === 'mnemonics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">
              Taxonomic Hierarchy Mnemonic
            </span>
            <h4 className="text-base font-bold text-slate-900">“Keep Ponds Clean Or Frogs Get Sick”</h4>
            <div className="bg-purple-50 p-3 rounded-xl text-xs text-purple-900 space-y-1">
              <div><strong>K</strong>ingdom (Highest)</div>
              <div><strong>P</strong>hylum / Division</div>
              <div><strong>C</strong>lass</div>
              <div><strong>O</strong>rder</div>
              <div><strong>F</strong>amily</div>
              <div><strong>G</strong>enus</div>
              <div><strong>S</strong>pecies (Lowest basic unit)</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              Prophase-I Sub-stages Mnemonic
            </span>
            <h4 className="text-base font-bold text-slate-900">“Lazy Zebras Pack Delicious Donuts”</h4>
            <div className="bg-rose-50 p-3 rounded-xl text-xs text-rose-900 space-y-1">
              <div><strong>L</strong>eptotene (Chromatin compaction)</div>
              <div><strong>Z</strong>ygotene (Synapsis, Bivalent formation)</div>
              <div><strong>P</strong>achytene (Crossing over via Recombinase)</div>
              <div><strong>D</strong>iplotene (Chiasmata, Synaptonemal dissolution)</div>
              <div><strong>D</strong>iakinesis (Terminalisation of chiasmata)</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Bacterial Morphologies
            </span>
            <h4 className="text-base font-bold text-slate-900">C-B-S-V Shapes of Monera</h4>
            <div className="bg-amber-50 p-3 rounded-xl text-xs text-amber-900 space-y-1">
              <div><strong>Coccus</strong>: Spherical / Circular cells</div>
              <div><strong>Bacillus</strong>: Rod-shaped cells (most common)</div>
              <div><strong>Spirillum</strong>: Spiral or coiled cells</div>
              <div><strong>Vibrio</strong>: Comma-shaped (,) cells</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Diatoms & Silica Walls
            </span>
            <h4 className="text-base font-bold text-slate-900">“Soap-Box Armor of the Oceans”</h4>
            <div className="bg-emerald-50 p-3 rounded-xl text-xs text-emerald-900 space-y-1">
              <div>Diatom cell walls fit together like two halves of a soap box.</div>
              <div>Embedded with indestructible silica forming <strong>Diatomaceous Earth</strong>.</div>
              <div>Used for polishing, oil and syrup filtration. Chief ocean producers!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
