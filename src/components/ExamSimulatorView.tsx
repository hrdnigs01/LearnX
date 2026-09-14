import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  BarChart3,
  TrendingUp,
  X,
  Menu,
  Sliders,
} from 'lucide-react';
import {
  User,
  ExamSimulatorPaper,
  ExamSimulatorQuestion,
  ExamQuestionPaletteStatus,
  ExamQuestionState,
  ExamResultBreakdown,
} from '../types';
import { mockExamPapersList } from '../data/competitiveExamData';
import { addMistakeToVault } from '../utils/mistakeVault';
import { playChime } from '../utils/audio';
import { CustomTestBuilder } from './CustomTestBuilder';

interface ExamSimulatorViewProps {
  currentUser: User;
  classLevel: number;
  onRefreshUser?: () => void;
  onNavigateToMistakes?: () => void;
  onNavigateToBattles?: () => void;
}

export const ExamSimulatorView: React.FC<ExamSimulatorViewProps> = ({
  currentUser,
  classLevel,
  onRefreshUser,
  onNavigateToMistakes,
  onNavigateToBattles,
}) => {
  // Simulator mode: Pre-built All-India Mock Papers vs Dynamic Custom Test Generator
  const [simulatorMode, setSimulatorMode] = useState<'presets' | 'custom'>('presets');
  const [activeCustomPaper, setActiveCustomPaper] = useState<ExamSimulatorPaper | null>(null);

  // Selected Paper
  const [selectedPaperIndex, setSelectedPaperIndex] = useState(0);
  const activePaper: ExamSimulatorPaper =
    activeCustomPaper || mockExamPapersList[selectedPaperIndex] || mockExamPapersList[0];

  // Exam Run State
  const [examStatus, setExamStatus] = useState<'intro' | 'testing' | 'submitted'>('intro');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);

  // Active Question and Section State
  const [currentSectionId, setCurrentSectionId] = useState<string>(
    activePaper.sections[0]?.id || ''
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers and Palette status map: questionId -> ExamQuestionState
  const [questionStates, setQuestionStates] = useState<Record<string, ExamQuestionState>>({});

  // Countdown timer in seconds
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    activePaper.totalTimeMinutes * 60
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Examination from custom test builder
  const handleStartCustomExam = (paper: ExamSimulatorPaper) => {
    setActiveCustomPaper(paper);
    setExamStatus('testing');
    setTimeRemainingSeconds(paper.totalTimeMinutes * 60);
    setCurrentSectionId(paper.sections[0]?.id || '');
    setCurrentQuestionIndex(0);
    setIsExportedToMistakes(false);

    const initialMap: Record<string, ExamQuestionState> = {};
    paper.questions.forEach((q, idx) => {
      initialMap[q.id] = {
        selectedOption: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });
    setQuestionStates(initialMap);
    playChime('click');
  };

  // Result Breakdown
  const [resultBreakdown, setResultBreakdown] = useState<ExamResultBreakdown | null>(null);
  const [isExportedToMistakes, setIsExportedToMistakes] = useState(false);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Timer interval
  useEffect(() => {
    if (examStatus === 'testing') {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStatus]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen request failed', e);
    }
  };

  // Start Examination
  const handleStartExam = () => {
    setExamStatus('testing');
    setTimeRemainingSeconds(activePaper.totalTimeMinutes * 60);
    setCurrentSectionId(activePaper.sections[0]?.id || '');
    setCurrentQuestionIndex(0);
    setIsExportedToMistakes(false);

    // Initialize all question states to not_visited
    const initialMap: Record<string, ExamQuestionState> = {};
    activePaper.questions.forEach((q, idx) => {
      initialMap[q.id] = {
        selectedOption: null,
        status: idx === 0 ? 'not_answered' : 'not_visited',
        timeSpentSeconds: 0,
      };
    });
    setQuestionStates(initialMap);
    playChime('click');
  };

  // Get current active question object
  const currentQ: ExamSimulatorQuestion =
    activePaper.questions[currentQuestionIndex] || activePaper.questions[0];

  // Navigate to specific question
  const handleJumpToQuestion = (qIndex: number) => {
    if (qIndex < 0 || qIndex >= activePaper.questions.length) return;
    const targetQ = activePaper.questions[qIndex];

    // Mark current question as not_answered if it was visited and unselected
    const currState = questionStates[currentQ.id];
    if (currState && currState.status === 'not_visited') {
      setQuestionStates((prev) => ({
        ...prev,
        [currentQ.id]: { ...currState, status: 'not_answered' },
      }));
    }

    // Set target question to not_answered if it was not_visited
    const targetState = questionStates[targetQ.id];
    if (targetState && targetState.status === 'not_visited') {
      setQuestionStates((prev) => ({
        ...prev,
        [targetQ.id]: { ...targetState, status: 'not_answered' },
      }));
    }

    setCurrentQuestionIndex(qIndex);
    setCurrentSectionId(targetQ.sectionId);
    setIsMobilePaletteOpen(false);
  };

  // Select Option
  const handleSelectOption = (optIdx: number) => {
    const curr = questionStates[currentQ.id] || {
      selectedOption: null,
      status: 'not_answered',
      timeSpentSeconds: 0,
    };

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...curr,
        selectedOption: optIdx,
        status: curr.status === 'marked_for_review' ? 'answered_and_marked_for_review' : 'answered',
      },
    }));
  };

  // Clear Response
  const handleClearResponse = () => {
    const curr = questionStates[currentQ.id] || {
      selectedOption: null,
      status: 'not_answered',
      timeSpentSeconds: 0,
    };

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...curr,
        selectedOption: null,
        status: 'not_answered',
      },
    }));
  };

  // Save & Next
  const handleSaveAndNext = () => {
    const curr = questionStates[currentQ.id];
    const hasSelection = curr && curr.selectedOption !== null;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...curr,
        status: hasSelection ? 'answered' : 'not_answered',
      },
    }));

    if (currentQuestionIndex + 1 < activePaper.questions.length) {
      handleJumpToQuestion(currentQuestionIndex + 1);
    }
  };

  // Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    const curr = questionStates[currentQ.id];
    const hasSelection = curr && curr.selectedOption !== null;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...curr,
        status: hasSelection ? 'answered_and_marked_for_review' : 'marked_for_review',
      },
    }));

    if (currentQuestionIndex + 1 < activePaper.questions.length) {
      handleJumpToQuestion(currentQuestionIndex + 1);
    }
  };

  // Submit and evaluate exam
  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let negativeMarksLost = 0;
    const failedQuestionsList: {
      question: ExamSimulatorQuestion;
      selectedOpt: number;
    }[] = [];

    const sectionStatsMap: Record<
      string,
      { correct: number; incorrect: number; unattempted: number; score: number; maxScore: number }
    > = {};

    activePaper.sections.forEach((sec) => {
      sectionStatsMap[sec.name] = {
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        maxScore: 0,
      };
    });

    activePaper.questions.forEach((q) => {
      const qState = questionStates[q.id];
      const selected = qState?.selectedOption ?? null;
      const secName =
        activePaper.sections.find((s) => s.id === q.sectionId)?.name || 'General';

      if (!sectionStatsMap[secName]) {
        sectionStatsMap[secName] = {
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          score: 0,
          maxScore: 0,
        };
      }
      sectionStatsMap[secName].maxScore += q.positiveMarks;

      if (selected === null) {
        unattemptedCount += 1;
        sectionStatsMap[secName].unattempted += 1;
      } else if (selected === q.correctIndex) {
        correctCount += 1;
        totalScore += q.positiveMarks;
        sectionStatsMap[secName].correct += 1;
        sectionStatsMap[secName].score += q.positiveMarks;
      } else {
        incorrectCount += 1;
        totalScore -= q.negativeMarks;
        negativeMarksLost += q.negativeMarks;
        sectionStatsMap[secName].incorrect += 1;
        sectionStatsMap[secName].score -= q.negativeMarks;

        failedQuestionsList.push({
          question: q,
          selectedOpt: selected,
        });
      }
    });

    const maxMarks = activePaper.questions.reduce((acc, q) => acc + q.positiveMarks, 0);
    const answeredCount = correctCount + incorrectCount;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const percentile = Math.min(
      99.8,
      Math.max(35, Math.round(50 + (totalScore / Math.max(1, maxMarks)) * 48))
    );

    const breakdown: ExamResultBreakdown = {
      totalQuestions: activePaper.questions.length,
      answeredCount,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalScore: Math.max(0, totalScore),
      maximumMarks: maxMarks,
      negativeMarksLost,
      accuracyPercentage: accuracy,
      percentileRankEstimate: percentile,
      timeTakenMinutes: Math.round(
        (activePaper.totalTimeMinutes * 60 - timeRemainingSeconds) / 60
      ),
      sectionWise: Object.entries(sectionStatsMap).map(([sectionName, stats]) => ({
        sectionName,
        ...stats,
      })),
    };

    setResultBreakdown(breakdown);
    setExamStatus('submitted');

    // Auto export failed questions to AI Mistake Notebook
    failedQuestionsList.forEach(({ question, selectedOpt }) => {
      addMistakeToVault({
        questionId: question.id,
        questionText: question.questionText,
        options: question.options,
        correctIndex: question.correctIndex,
        userWrongIndex: selectedOpt,
        explanation: question.explanation,
        subjectName: question.topic || 'Exam Simulator',
        chapterTitle: question.topic,
        classLevel: classLevel,
        pyqYearOrSource: activePaper.title,
        sourceContext: 'exam_simulator',
      });
    });
    setIsExportedToMistakes(true);

    // Award user XP & refresh
    try {
      const raw = localStorage.getItem('learnx_active_user_data');
      if (raw) {
        const u = JSON.parse(raw);
        u.xp = (u.xp || 0) + Math.max(50, totalScore * 5);
        localStorage.setItem('learnx_active_user_data', JSON.stringify(u));
      }
    } catch (e) {
      console.error(e);
    }
    if (onRefreshUser) onRefreshUser();
    playChime('badge');
  };

  // Count states for Question Palette
  const getPaletteCounts = () => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let marked = 0;
    let answeredAndMarked = 0;

    activePaper.questions.forEach((q) => {
      const st = questionStates[q.id]?.status || 'not_visited';
      if (st === 'answered') answered++;
      else if (st === 'not_answered') notAnswered++;
      else if (st === 'not_visited') notVisited++;
      else if (st === 'marked_for_review') marked++;
      else if (st === 'answered_and_marked_for_review') answeredAndMarked++;
    });

    return { answered, notAnswered, notVisited, marked, answeredAndMarked };
  };

  const counts = getPaletteCounts();

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. INTRO / PAPER SELECTION VIEW */}
      {examStatus === 'intro' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                    <Award className="w-3.5 h-3.5" />
                    Official CBT Mock Simulator
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold">
                    NTA JEE • NEET • CBSE Board
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                  Real Exam Simulator (CBT Portal)
                </h1>
                <p className="text-xs sm:text-sm text-blue-200/80 max-w-2xl leading-relaxed">
                  Experience exact National Testing Agency (NTA) Computer-Based Testing conditions.
                  Complete with timed countdowns, official negative marking (+4 / -1), section hopping,
                  color-coded question palettes, and auto-export of weak questions to your Mistake Vault.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFullscreen}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition flex items-center gap-1.5"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs: All-India Presets vs Custom Test Builder */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] max-w-md">
            <button
              onClick={() => setSimulatorMode('presets')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                simulatorMode === 'presets'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>All-India Mock Papers</span>
            </button>

            <button
              onClick={() => setSimulatorMode('custom')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                simulatorMode === 'custom'
                  ? 'bg-white text-[#5A634E] shadow-2xs'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Custom Test Builder</span>
            </button>
          </div>

          {/* Render Custom Test Builder if active */}
          {simulatorMode === 'custom' && (
            <CustomTestBuilder
              currentUser={currentUser}
              classLevel={classLevel}
              onStartCustomTest={handleStartCustomExam}
            />
          )}

          {/* Paper Selection Cards for Pre-built Papers */}
          {simulatorMode === 'presets' && (
            <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-xs space-y-4">
              <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                Choose Examination Simulator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockExamPapersList.map((paper, idx) => (
                  <div
                    key={paper.id}
                    onClick={() => {
                      setActiveCustomPaper(null);
                      setSelectedPaperIndex(idx);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                      selectedPaperIndex === idx && !activeCustomPaper
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/30'
                        : 'border-[#E5E0D8] bg-[#FDFBF7] hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          {paper.boardOrConductingBody} • {paper.grade}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#7A7468]">
                          {paper.totalTimeMinutes} Mins • {paper.totalMarks} Marks
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#2A2A22]">{paper.title}</h4>
                      <p className="text-xs text-[#7A7468]">{paper.instructions[0]}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D8]/60 text-xs font-semibold text-blue-700">
                      <span>{paper.sections.map((s) => s.name).join(' • ')}</span>
                      <span className="flex items-center gap-1">
                        {selectedPaperIndex === idx && !activeCustomPaper ? 'Selected ✓' : 'Select Paper'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Test Instructions & Start CTA */}
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] space-y-3">
                <h5 className="font-bold text-xs text-[#4A4A3A] uppercase tracking-wider">
                  Official Examination Rules & Marking Scheme:
                </h5>
                <ul className="text-xs text-[#6A6354] space-y-1.5 list-disc pl-5">
                  {activePaper.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#7A7468]">
                    Candidate: <strong className="text-[#4A4A3A]">{currentUser.name}</strong> • Roll No:{' '}
                    <span className="font-mono font-bold text-[#5A634E]">LX-{classLevel}026-NTA</span>
                  </div>

                  <button
                    id="start-mock-exam-btn"
                    onClick={handleStartExam}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-900 text-white font-bold text-sm shadow-md hover:bg-blue-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Begin CBT Examination</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ACTIVE CBT EXAM ENVIRONMENT */}
      {examStatus === 'testing' && (
        <div className="space-y-4">
          {/* Top NTA CBT Header Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-[60px] z-30">
            {/* Candidate & Paper info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                NTA
              </div>
              <div>
                <div className="text-xs font-bold text-[#4A4A3A] truncate max-w-[160px] sm:max-w-xs">
                  {activePaper.title}
                </div>
                <div className="text-[11px] text-[#7A7468]">
                  Candidate: {currentUser.name} (Class {classLevel})
                </div>
              </div>
            </div>

            {/* Countdown Clock & Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold ${
                  timeRemainingSeconds < 300
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-[#F5F2ED] border-[#E5E0D8] text-[#4A4A3A]'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>

              {/* Mobile Palette Drawer Trigger */}
              <button
                onClick={() => setIsMobilePaletteOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A]"
                title="Question Palette"
              >
                <Menu className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleFullscreen}
                className="hidden sm:flex p-2 rounded-xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] hover:bg-[#EBE7DF]"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleSubmitExam}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Section Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {activePaper.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setCurrentSectionId(sec.id);
                  const firstQInSec = activePaper.questions.findIndex(
                    (q) => q.sectionId === sec.id
                  );
                  if (firstQInSec >= 0) {
                    handleJumpToQuestion(firstQInSec);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  currentSectionId === sec.id
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-[#7A7468] hover:bg-[#F5F2ED] border border-[#E5E0D8]'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Main Workspace Grid (Question Area + Question Palette) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left/Main Question Area (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-6">
                {/* Question Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-lg text-[#2A2A22]">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#7A7468]">
                      of {activePaper.questions.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      +{currentQ.positiveMarks} Correct
                    </span>
                    <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      -{currentQ.negativeMarks} Negative
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-[#2A2A22] leading-relaxed select-none">
                  {currentQ.questionText}
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected =
                      questionStates[currentQ.id]?.selectedOption === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 text-[#1A2A3A] font-bold shadow-xs'
                            : 'border-[#E5E0D8] bg-[#FDFBF7] hover:bg-[#F5F2ED] text-[#4A4A3A]'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 transition ${
                            isSelected
                              ? 'bg-blue-900 text-white'
                              : 'border border-[#E5E0D8] bg-white text-[#7A7468]'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <div className="text-xs sm:text-sm flex-1 leading-relaxed">{opt}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleMarkForReviewAndNext}
                      className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold transition"
                    >
                      Mark for Review & Next
                    </button>

                    <button
                      onClick={handleClearResponse}
                      className="px-4 py-2.5 rounded-xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] border border-[#E5E0D8] text-xs font-semibold transition"
                    >
                      Clear Response
                    </button>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => handleJumpToQuestion(currentQuestionIndex - 1)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F5F2ED] hover:bg-[#EBE7DF] disabled:opacity-40 text-[#4A4A3A] text-xs font-semibold transition flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={handleSaveAndNext}
                      className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1"
                    >
                      <span>Save & Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Question Palette (Col 4) - Desktop & Slide-Over Drawer on Mobile */}
            <div
              className={`lg:col-span-4 ${
                isMobilePaletteOpen
                  ? 'fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center animate-in fade-in'
                  : 'hidden lg:block'
              }`}
            >
              <div className="bg-white rounded-3xl border border-[#E5E0D8] p-5 shadow-xs space-y-4 max-h-[85vh] overflow-y-auto w-full max-w-sm lg:max-w-none">
                {/* Palette Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
                  <h4 className="font-serif font-bold text-sm text-[#4A4A3A]">Question Palette</h4>
                  {isMobilePaletteOpen && (
                    <button
                      onClick={() => setIsMobilePaletteOpen(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 lg:hidden"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  )}
                </div>

                {/* Status Legend Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7A7468]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {counts.answered}
                    </span>
                    <span>Answered</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {counts.notAnswered}
                    </span>
                    <span>Not Answered</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {counts.marked}
                    </span>
                    <span>Review</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-purple-700 ring-2 ring-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
                      {counts.answeredAndMarked}
                    </span>
                    <span>Ans & Review</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {counts.notVisited}
                    </span>
                    <span>Not Visited</span>
                  </div>
                </div>

                {/* Question Numbers Grid (1..N) */}
                <div className="pt-2 border-t border-[#E5E0D8]">
                  <div className="text-xs font-bold text-[#4A4A3A] mb-2">
                    Section: {activePaper.sections.find((s) => s.id === currentSectionId)?.name}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {activePaper.questions.map((q, idx) => {
                      const st = questionStates[q.id]?.status || 'not_visited';
                      const isCurrent = idx === currentQuestionIndex;

                      let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                      if (st === 'answered') {
                        style = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                      } else if (st === 'not_answered') {
                        style = 'bg-rose-600 text-white border-rose-700 font-bold';
                      } else if (st === 'marked_for_review') {
                        style = 'bg-purple-600 text-white border-purple-700 font-bold';
                      } else if (st === 'answered_and_marked_for_review') {
                        style = 'bg-purple-700 ring-2 ring-emerald-400 text-white border-purple-800 font-bold';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => handleJumpToQuestion(idx)}
                          className={`h-9 rounded-xl border text-xs font-mono transition-all flex items-center justify-center relative ${style} ${
                            isCurrent ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : ''
                          }`}
                        >
                          <span>{idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Final Submit in Palette */}
                <div className="pt-3 border-t border-[#E5E0D8]">
                  <button
                    onClick={handleSubmitExam}
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition"
                  >
                    Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXAM SUBMISSION & RESULT BREAKDOWN VIEW */}
      {examStatus === 'submitted' && resultBreakdown && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-10 shadow-lg space-y-8 animate-in zoom-in-95">
          {/* Header Score Report */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full mx-auto bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center text-3xl shadow-sm">
              🎯
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#4A4A3A]">
              Official CBT Examination Scorecard
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7468]">
              {activePaper.title} • Completed in {resultBreakdown.timeTakenMinutes} minutes
            </p>
          </div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-blue-900">
                {resultBreakdown.totalScore}
                <span className="text-xs text-[#7A7468] font-normal"> / {resultBreakdown.maximumMarks}</span>
              </div>
              <div className="text-[11px] text-[#7A7468] uppercase font-bold tracking-wider mt-1">
                Total Score
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-700">
                {resultBreakdown.accuracyPercentage}%
              </div>
              <div className="text-[11px] text-[#7A7468] uppercase font-bold tracking-wider mt-1">
                Accuracy
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-rose-600">
                -{resultBreakdown.negativeMarksLost}
              </div>
              <div className="text-[11px] text-[#7A7468] uppercase font-bold tracking-wider mt-1">
                Negative Marks Lost
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-purple-700">
                {resultBreakdown.percentileRankEstimate}th
              </div>
              <div className="text-[11px] text-[#7A7468] uppercase font-bold tracking-wider mt-1">
                Est. Percentile Rank
              </div>
            </div>
          </div>

          {/* Section-Wise Breakdown Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#4A4A3A]">Section-Wise Performance Matrix</h4>
            <div className="overflow-x-auto border border-[#E5E0D8] rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F5F2ED] text-[#4A4A3A] font-bold">
                  <tr>
                    <th className="p-3">Section</th>
                    <th className="p-3 text-center">Correct</th>
                    <th className="p-3 text-center">Incorrect</th>
                    <th className="p-3 text-center">Unattempted</th>
                    <th className="p-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]">
                  {resultBreakdown.sectionWise.map((sec, i) => (
                    <tr key={i} className="hover:bg-[#FDFBF7]">
                      <td className="p-3 font-semibold text-[#2A2A22]">{sec.sectionName}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{sec.correct}</td>
                      <td className="p-3 text-center font-bold text-rose-600">{sec.incorrect}</td>
                      <td className="p-3 text-center text-[#7A7468]">{sec.unattempted}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#4A4A3A]">
                        {sec.score} / {sec.maxScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Auto-Export to AI Mistake Notebook Callout */}
          {isExportedToMistakes && resultBreakdown.incorrectCount > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>{resultBreakdown.incorrectCount} missed questions</strong> were automatically saved to
                  your <strong>AI Mistake Notebook (Weakness Vault)</strong> for mandatory re-testing!
                </span>
              </div>
              {onNavigateToMistakes && (
                <button
                  onClick={onNavigateToMistakes}
                  className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 font-bold text-amber-950 transition whitespace-nowrap"
                >
                  View in Vault →
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartExam}
              className="px-6 py-3 rounded-2xl bg-blue-900 text-white font-bold text-xs sm:text-sm hover:bg-blue-800 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake This Simulator</span>
            </button>

            {onNavigateToMistakes && (
              <button
                onClick={onNavigateToMistakes}
                className="px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Open Mistake Vault</span>
              </button>
            )}

            {onNavigateToBattles && (
              <button
                onClick={onNavigateToBattles}
                className="px-6 py-3 rounded-2xl bg-[#5A634E] text-white font-bold text-xs sm:text-sm hover:bg-[#484F3E] transition flex items-center gap-2"
              >
                <span>⚡ Challenge 1v1 Battle</span>
              </button>
            )}

            <button
              onClick={() => setExamStatus('intro')}
              className="px-6 py-3 rounded-2xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] border border-[#E5E0D8] font-bold text-xs sm:text-sm transition"
            >
              Select Another Paper
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
