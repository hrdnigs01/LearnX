import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Brain,
  RotateCcw,
  Sparkles,
  BookOpen,
  Filter,
  Trash2,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronRight,
  Zap,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { User, MistakeNotebookItem, MistakeCategory } from '../types';
import {
  getMistakeVault,
  updateMistakeMastery,
  removeMistakeFromVault,
} from '../utils/mistakeVault';
import { playChime } from '../utils/audio';

interface MistakeNotebookViewProps {
  currentUser: User;
  onOpenAiAssistant?: (prompt: string) => void;
  onRefreshUser?: () => void;
  onNavigateToBattle?: () => void;
  onNavigateToExam?: () => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({
  currentUser,
  onOpenAiAssistant,
  onRefreshUser,
  onNavigateToBattle,
  onNavigateToExam,
}) => {
  const [mistakes, setMistakes] = useState<MistakeNotebookItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'mastered'>('pending');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Re-test interactive state: mistakeId -> selected option index
  const [retestActiveId, setRetestActiveId] = useState<string | null>(null);
  const [retestSelectedOption, setRetestSelectedOption] = useState<number | null>(null);
  const [retestFeedback, setRetestFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  const loadVault = () => {
    const data = getMistakeVault();
    setMistakes(data);
  };

  useEffect(() => {
    loadVault();
    const handleVaultUpdated = () => {
      loadVault();
    };
    window.addEventListener('learnx_mistakes_updated', handleVaultUpdated);
    return () => window.removeEventListener('learnx_mistakes_updated', handleVaultUpdated);
  }, []);

  // Filter items
  const filteredMistakes = mistakes.filter((item) => {
    const matchesTab =
      activeTab === 'pending'
        ? item.status === 'needs_retest' || item.status === 'in_progress'
        : item.status === 'mastered';

    const matchesSubject =
      selectedSubject === 'All' ||
      item.subjectName.toLowerCase() === selectedSubject.toLowerCase();

    const matchesCategory =
      selectedCategory === 'All' || item.mistakeCategory === selectedCategory;

    return matchesTab && matchesSubject && matchesCategory;
  });

  const pendingCount = mistakes.filter(
    (m) => m.status === 'needs_retest' || m.status === 'in_progress'
  ).length;
  const masteredCount = mistakes.filter((m) => m.status === 'mastered').length;
  const avgMastery = mistakes.length
    ? Math.round(mistakes.reduce((acc, m) => acc + m.masteryScore, 0) / mistakes.length)
    : 0;

  // Handle re-test submission
  const handleAnswerRetest = (item: MistakeNotebookItem, optionIdx: number) => {
    setRetestSelectedOption(optionIdx);
    const isCorrect = optionIdx === item.correctIndex;

    setRetestFeedback({
      correct: isCorrect,
      explanation: item.explanation,
    });

    if (isCorrect) {
      playChime('success');
      // Award XP
      try {
        const raw = localStorage.getItem('learnx_active_user_data');
        if (raw) {
          const u = JSON.parse(raw);
          u.xp = (u.xp || 0) + 20;
          localStorage.setItem('learnx_active_user_data', JSON.stringify(u));
        }
      } catch (e) {
        console.error(e);
      }
      if (onRefreshUser) onRefreshUser();
    } else {
      playChime('alarm');
    }

    // Persist mastery update
    updateMistakeMastery(item.id, isCorrect);
  };

  const handleCloseRetest = () => {
    setRetestActiveId(null);
    setRetestSelectedOption(null);
    setRetestFeedback(null);
    loadVault();
  };

  const categoryColors: Record<MistakeCategory, { bg: string; text: string; border: string }> = {
    'Conceptual Error': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    'Calculation Slip': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Formula Gap': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Misread Question': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                AI Mistake Notebook
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold">
                Spaced Repetition Weakness Vault
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Your Weakness & Mistake Vault
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Every question missed in 1v1 Battles, Exam Simulators, and NCERT Quizzes is automatically collected here.
              Re-test until you achieve 100% mastery to permanently eliminate test gaps.
            </p>
          </div>

          {/* Metrics Card */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-lg sm:text-2xl font-mono font-bold text-rose-400">{pendingCount}</div>
              <div className="text-[10px] text-stone-300 uppercase font-bold tracking-wider">Pending</div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-lg sm:text-2xl font-mono font-bold text-emerald-400">{masteredCount}</div>
              <div className="text-[10px] text-stone-300 uppercase font-bold tracking-wider">Mastered</div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-lg sm:text-2xl font-mono font-bold text-amber-300">{avgMastery}%</div>
              <div className="text-[10px] text-stone-300 uppercase font-bold tracking-wider">Mastery</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS, TABS & FILTERS */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Status Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Needs Re-Test ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('mastered')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'mastered'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mastered Vault ({masteredCount})</span>
            </button>
          </div>

          {/* Quick Deep Link Launchers */}
          <div className="flex items-center gap-2">
            {onNavigateToBattle && (
              <button
                onClick={onNavigateToBattle}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>⚡ 1v1 Battle Arena</span>
              </button>
            )}
            {onNavigateToExam && (
              <button
                onClick={onNavigateToExam}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>📝 NTA CBT Mock</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Bar: Subject & Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5E0D8]/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            <span className="text-xs font-bold text-[#7A7468] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Subject:
            </span>
            {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-[#5A634E] text-white font-bold shadow-xs'
                    : 'bg-[#F5F2ED] text-[#7A7468] hover:bg-[#EBE7DF]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            <span className="text-xs font-bold text-[#7A7468]">Category:</span>
            {['All', 'Conceptual Error', 'Calculation Slip', 'Formula Gap', 'Misread Question'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-stone-800 text-white font-bold'
                    : 'bg-[#F5F2ED] text-[#7A7468] hover:bg-[#EBE7DF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MISTAKE CARDS LIST */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
            ✨
          </div>
          <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">
            {activeTab === 'pending'
              ? 'No Pending Weaknesses in this Filter!'
              : 'No Mastered Questions yet!'}
          </h3>
          <p className="text-xs sm:text-sm text-[#7A7468] max-w-md mx-auto">
            {activeTab === 'pending'
              ? 'Excellent performance! Play 1v1 Battles or NTA Mock Tests. Any question you answer incorrectly will automatically appear here.'
              : 'Complete re-tests on your pending questions to graduate them to the Mastered Vault.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMistakes.map((item) => {
            const catStyle =
              categoryColors[item.mistakeCategory] || categoryColors['Conceptual Error'];
            const isRetesting = retestActiveId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all p-5 sm:p-7 shadow-xs space-y-4 ${
                  item.status === 'mastered'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-[#E5E0D8]'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F5F2ED] text-[#5A634E] text-xs font-bold border border-[#E5E0D8]">
                      {item.subjectName} {item.chapterTitle ? `• ${item.chapterTitle}` : ''}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {item.mistakeCategory}
                    </span>

                    <span className="text-[11px] font-mono text-[#7A7468] bg-[#F5F2ED] px-2 py-0.5 rounded-md">
                      {item.pyqYearOrSource || 'PYQ'}
                    </span>
                  </div>

                  {/* Right side Mastery Meter & Delete */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#7A7468]">Mastery:</span>
                      <div className="w-20 bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.masteryScore >= 100
                              ? 'bg-emerald-500'
                              : item.masteryScore > 0
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.masteryScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#4A4A3A]">
                        {item.masteryScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => removeMistakeFromVault(item.id)}
                      className="p-1.5 rounded-lg text-[#8B8374] hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-sm sm:text-base font-bold text-[#2A2A22] leading-relaxed">
                  {item.questionText}
                </h4>

                {/* Inactive Card Summary (Options & Erroneous Answer) */}
                {!isRetesting && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
                      <div className="font-bold mb-0.5 flex items-center gap-1 text-rose-700">
                        <span>❌ Your Past Wrong Answer:</span>
                      </div>
                      <div>
                        Option {String.fromCharCode(65 + item.userWrongIndex)}:{' '}
                        {item.options[item.userWrongIndex]}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <div className="font-bold mb-0.5 flex items-center gap-1 text-emerald-700">
                        <span>✅ Correct Solution:</span>
                      </div>
                      <div>
                        Option {String.fromCharCode(65 + item.correctIndex)}:{' '}
                        {item.options[item.correctIndex]}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Remedy Diagnostic Box */}
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] space-y-2 text-xs text-[#6A6354]">
                  <div className="font-bold text-[#5A634E] flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-[#5A634E]" />
                    <span>AI Diagnostic Remedy & Mental Model:</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{item.aiRemedyNote}</p>
                  {item.mnemonicOrFormulaTip && (
                    <div className="mt-2 pt-2 border-t border-[#E5E0D8] text-[#AF601A] font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Memory Tip: {item.mnemonicOrFormulaTip}</span>
                    </div>
                  )}
                </div>

                {/* Interactive Re-Test Panel */}
                {isRetesting ? (
                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-amber-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-600" />
                        <span>Re-Test Challenge (Answer correctly to earn +20 XP)</span>
                      </div>
                      <button
                        onClick={handleCloseRetest}
                        className="text-xs font-semibold text-amber-800 underline"
                      >
                        Cancel Re-test
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {item.options.map((opt, optIdx) => {
                        const isChosen = retestSelectedOption === optIdx;
                        const isCorrectOption = optIdx === item.correctIndex;
                        let btnStyle = 'border-amber-200 bg-white hover:bg-amber-50 text-[#4A4A3A]';

                        if (retestFeedback) {
                          if (isCorrectOption) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400';
                          } else if (isChosen && !isCorrectOption) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-400';
                          } else {
                            btnStyle = 'border-[#E5E0D8] bg-white opacity-50';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={retestFeedback !== null}
                            onClick={() => handleAnswerRetest(item, optIdx)}
                            className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#F5F2ED] border border-[#E5E0D8] flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-relaxed flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {retestFeedback && (
                      <div className="p-3.5 rounded-xl bg-white border border-[#E5E0D8] space-y-2 animate-in zoom-in-95">
                        <div
                          className={`text-xs font-bold flex items-center gap-1.5 ${
                            retestFeedback.correct ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {retestFeedback.correct ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Mastered! +20 XP awarded! Question cleared in your vault.</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Still incorrect. Review the AI diagnosis above and try again!</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-[#7A7468] leading-relaxed">
                          {retestFeedback.explanation}
                        </p>
                        <button
                          onClick={handleCloseRetest}
                          className="mt-1 px-4 py-1.5 rounded-xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E] transition"
                        >
                          Finish Re-test
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Action Buttons */
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        setRetestActiveId(item.id);
                        setRetestSelectedOption(null);
                        setRetestFeedback(null);
                      }}
                      className="px-5 py-2.5 rounded-2xl bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E] transition shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Test Now</span>
                    </button>

                    {onOpenAiAssistant && (
                      <button
                        onClick={() =>
                          onOpenAiAssistant(
                            `Help me understand this NCERT concept and solve step-by-step: "${item.questionText}". The correct answer is option ${String.fromCharCode(65 + item.correctIndex)}: ${item.options[item.correctIndex]}.`
                          )
                        }
                        className="px-4 py-2 rounded-2xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] border border-[#E5E0D8] text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Brain className="w-3.5 h-3.5 text-[#5A634E]" />
                        <span>Ask AI Doubt Solver</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
