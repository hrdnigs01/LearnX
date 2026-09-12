import React, { useState, useMemo, useEffect } from 'react';
import {
  businessStudiesMaterialData,
  BStChapterMaterial,
  BStQuizQuestion,
} from '../data/businessStudiesMaterial';
import {
  Briefcase,
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Timer,
  Zap,
  Scale,
  ShieldCheck,
  Layers,
  FileText,
  Eye,
  EyeOff,
  Globe,
  Building2,
  HelpCircle as QuestionIcon,
} from 'lucide-react';

interface BusinessStudiesStudyMaterialViewProps {
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type BStTab = 'notes' | 'quiz' | 'hots' | 'comparisons' | 'terms';

export const BusinessStudiesStudyMaterialView: React.FC<
  BusinessStudiesStudyMaterialViewProps
> = ({ onOpenAiAssistant, onBackToNCERT }) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<BStTab>('notes');
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
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins default
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [revealedHots, setRevealedHots] = useState<Record<string, boolean>>({});

  const chapters = businessStudiesMaterialData;

  // Filtered chapters
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // All quiz questions
  const allQuestions = useMemo(() => {
    return chapters.flatMap((c) => c.quizQuestions);
  }, [chapters]);

  // Filtered quiz questions for Quiz Arena
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
  };

  // Select Option
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted && quizMode === 'timed') return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleHotsAnswer = (id: string) => {
    setRevealedHots((prev) => ({ ...prev, [id]: !prev[id] }));
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
      <div className="bg-gradient-to-br from-amber-900 via-orange-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400/20 text-amber-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-amber-400/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> CBSE Quick Revision Notes
              </span>
              <span className="bg-white/10 text-amber-100 text-xs px-3 py-1 rounded-full border border-white/10">
                Class 11 Business Studies
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-400/20 font-mono">
                3 Key Chapters • 30 NCERT MCQs
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
              <span>Class 11 Business Studies Notes & Quiz Arena</span>
              <span className="text-xs bg-amber-500 text-slate-900 font-bold px-2.5 py-0.5 rounded-full uppercase">
                CBSE 2024-25
              </span>
            </h1>
            <p className="text-amber-100/90 text-sm max-w-3xl mt-1.5 leading-relaxed">
              Complete revision handbook covering <strong>Chapter 03 (Public, Private and Global Enterprises)</strong>,{' '}
              <strong>Chapter 05 (Emerging Modes of Business)</strong>, and{' '}
              <strong>Chapter 06 (Social Responsibilities of Business & Business Ethics)</strong> with real-world case studies,
              HOTS, distinction tables, and 30 board exam MCQs.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-amber-200">Total Chapters</div>
              <div className="text-xl font-bold text-white mt-0.5">3 Chapters</div>
              <div className="text-[11px] text-amber-200/70">Ch 3, Ch 5 & Ch 6</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-amber-200">Curated MCQs</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">30 Questions</div>
              <div className="text-[11px] text-amber-200/70">With NCERT explanations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-amber-200">HOTS Case Studies</div>
              <div className="text-xl font-bold text-amber-300 mt-0.5">6 Cases</div>
              <div className="text-[11px] text-amber-200/70">Real-world corporate dilemmas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-amber-200">Exam Test Arena</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">Practice / Timed</div>
              <div className="text-[11px] text-amber-200/70">Live score & percentage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
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
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-200'
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
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ch {chap.chapterNumber}: {chap.title}
              </button>
            ))}
          </div>

          {/* View Modes Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar flex-nowrap w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'notes'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Chapter Notes
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'quiz'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Quiz Arena (30 Qs)
            </button>
            <button
              onClick={() => setActiveTab('hots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'hots'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              HOTS Cases
            </button>
            <button
              onClick={() => setActiveTab('comparisons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'comparisons'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Distinction Tables
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'terms'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Key Terms Glossary
            </button>
          </div>
        </div>

        {/* Search & Tool Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts (e.g. Disinvestment, SSL, BPO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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

      {/* TAB 1: CHAPTER NOTES */}
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
                <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-5 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> CBSE Class 11 Business Studies • Chapter {chapter.chapterNumber}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-amber-100/80 mt-1 max-w-2xl">{chapter.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizChapterFilter(chapter.chapterNumber);
                        setActiveTab('quiz');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Take Chapter Quiz (10 Qs)
                    </button>
                  </div>
                </div>

                {/* Chapter Content Body */}
                <div className="p-6 space-y-6">
                  {/* Overview */}
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                      Chapter Synopsis & Conceptual Core
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{chapter.overview}</p>
                  </div>

                  {/* Detailed Concepts Breakdown */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Core Concept Explanations
                    </h3>
                    {chapter.concepts.map((concept) => (
                      <div
                        key={concept.id}
                        className="border border-slate-200 rounded-xl p-5 hover:border-amber-300 transition-colors bg-white space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {concept.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{concept.summary}</p>
                          </div>
                          {onOpenAiAssistant && (
                            <button
                              onClick={() =>
                                onOpenAiAssistant(
                                  `Explain in detail for Class 11 Business Studies: "${concept.title}" from Chapter ${chapter.chapterNumber} with CBSE exam tips and examples.`
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-1 shrink-0"
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
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gist of Lesson Strip */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Gist of the Lesson (Quick Pre-Exam Review)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chapter.gistOfLesson.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
                        >
                          <span className="text-amber-500 font-bold">✓</span>
                          <span>{bullet}</span>
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

      {/* TAB 2: QUIZ ARENA */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Arena Control Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  CBSE Class 11 Business Studies Quiz Arena
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Test your grasp of public sector enterprises, emerging digital business models, and business ethics.
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
                        ? 'bg-white text-amber-800 shadow-xs'
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
                        ? 'bg-amber-600 text-white shadow-xs'
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
                  onClick={() => setQuizChapterFilter(3)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 3: Public/Private (10 Qs)
                </button>
                <button
                  onClick={() => setQuizChapterFilter(5)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 5
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 5: e-Business & BPO (10 Qs)
                </button>
                <button
                  onClick={() => setQuizChapterFilter(6)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    quizChapterFilter === 6
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ch 6: Ethics & Pollution (10 Qs)
                </button>
              </div>

              {/* Reset Quiz & Action Buttons */}
              <div className="flex items-center gap-2">
                {quizMode === 'timed' && !timedQuizActive && !quizSubmitted && (
                  <button
                    onClick={handleStartTimedQuiz}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
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
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-900">Time Remaining:</span>
                  <span className="text-base font-mono font-bold text-amber-700">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-xs text-amber-700 font-medium">
                  {scoreStats.attempted} / {activeQuizQuestions.length} Answered
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
                <div className="text-lg font-bold text-amber-600">{scoreStats.totalPercentage}%</div>
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
                      <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
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
                              `Explain this Class 11 Business Studies question from Chapter ${q.chapterNumber}: "${q.question}" with why the correct answer is "${q.options[q.correctIndex]}".`
                            )
                          }
                          className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-50"
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
                        className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
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
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs text-amber-800 uppercase">
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

      {/* TAB 3: HOTS CASE STUDIES */}
      {activeTab === 'hots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              High Order Thinking Skills (HOTS) Real-World Case Studies
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-world scenario-based questions assessing core business application, managerial problem solving, and CBSE board examination competency.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.flatMap((c) => c.hotsCases).map((hots, hIdx) => {
              const isRevealed = revealedHots[hots.id] || !selfTestMode;
              return (
                <div
                  key={hots.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Case Study {hIdx + 1}: {hots.conceptApplied}
                    </span>
                    {onOpenAiAssistant && (
                      <button
                        onClick={() =>
                          onOpenAiAssistant(
                            `Analyze this Business Studies case study: "${hots.scenario}". Question: "${hots.question}". Explain how to write a perfect 5-mark answer for CBSE.`
                          )
                        }
                        className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Analysis
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Scenario:</span>
                    {hots.scenario}
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    <span className="text-amber-600 font-bold">Q: </span>
                    {hots.question}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleHotsAnswer(hots.id)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <QuestionIcon className="w-3.5 h-3.5" />
                      {isRevealed ? 'Hide Model Answer' : 'Reveal Model Answer & Analysis'}
                    </button>

                    {isRevealed && (
                      <div className="mt-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-1.5 animate-fadeIn">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Comprehensive Solution:
                        </div>
                        <p className="leading-relaxed whitespace-pre-line text-slate-700">{hots.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DISTINCTION TABLES */}
      {activeTab === 'comparisons' && (
        <div className="space-y-6">
          {chapters
            .filter((c) => c.comparisons && c.comparisons.length > 0)
            .flatMap((c) => c.comparisons || [])
            .map((table, tIdx) => (
              <div
                key={tIdx}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    {table.title}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        {table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900 bg-slate-50/50 w-1/4">
                            {row[0]}
                          </td>
                          <td className="p-3 text-slate-700">{row[1]}</td>
                          {row[2] && <td className="p-3 text-slate-700">{row[2]}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 5: KEY TERMS GLOSSARY */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Comprehensive Business Studies Key Terms & Acronyms
            </h3>
            <p className="text-xs text-slate-500">
              Precise 1-mark and 2-mark definitions as formulated in CBSE curriculum materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chapters.flatMap((c) => c.keyTerms).map((termItem, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-300 transition-colors shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {termItem.term}
                  </h4>
                  <button
                    onClick={() => copyText(`${termItem.term}: ${termItem.definition}`, `term_${idx}`)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Copy Definition"
                  >
                    {copiedId === `term_${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{termItem.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
