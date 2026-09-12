import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Flame,
  Swords,
  Zap,
  Clock,
  Search,
  X,
  ChevronUp,
  Award,
  IndianRupee,
  Sparkles,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  User,
  QuizLeaderboardEntry,
  XPLeaderboardEntry,
  LeaderboardTimeframe,
  DualLeaderboardResponse,
} from '../types';

interface DualLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  initialType?: 'quiz' | 'xp';
  onStartBattle?: () => void;
}

export const DualLeaderboardModal: React.FC<DualLeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialType = 'quiz',
  onStartBattle,
}) => {
  const [category, setCategory] = useState<'quiz' | 'xp'>('quiz');
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizLeaderboardEntry[]>([]);
  const [xpData, setXpData] = useState<XPLeaderboardEntry[]>([]);
  const [userQuizRank, setUserQuizRank] = useState<number>(1);
  const [userXpRank, setUserXpRank] = useState<number>(1);

  useEffect(() => {
    if (initialType) {
      setCategory(initialType);
    }
  }, [initialType]);

  const fetchDualLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/learning/dual-leaderboard?timeframe=${timeframe}`);
      const data: DualLeaderboardResponse & { success?: boolean } = await res.json();
      if (data.quizLeaderboard) {
        setQuizData(data.quizLeaderboard);
      }
      if (data.xpLeaderboard) {
        setXpData(data.xpLeaderboard);
      }
      if (data.userQuizRank) setUserQuizRank(data.userQuizRank);
      if (data.userXpRank) setUserXpRank(data.userXpRank);
    } catch (err) {
      console.error('Failed to load dual leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDualLeaderboard();
    }
  }, [isOpen, timeframe]);

  // Filter list by search query
  const filteredQuiz = useMemo(() => {
    if (!searchQuery.trim()) return quizData;
    const q = searchQuery.toLowerCase();
    return quizData.filter(
      (s) => s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q)
    );
  }, [quizData, searchQuery]);

  const filteredXP = useMemo(() => {
    if (!searchQuery.trim()) return xpData;
    const q = searchQuery.toLowerCase();
    return xpData.filter(
      (s) => s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q)
    );
  }, [xpData, searchQuery]);

  if (!isOpen) return null;

  const currentList = category === 'quiz' ? filteredQuiz : filteredXP;
  const top3 = currentList.slice(0, 3);
  const restList = currentList.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div
        id="dual-leaderboard-modal"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden flex flex-col my-auto max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3325] via-[#3E4733] to-[#5A634E] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  LearnX Dual Leaderboard
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Live Rankings
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Compete on Battle Arena Winnings or XP Scholarship Progression across India.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-center p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar: Category Switch + Timeframe Filter + Search */}
        <div className="p-4 sm:p-5 bg-[#FDFBF7] border-b border-[#E5E0D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Toggle Tabs */}
          <div className="flex bg-[#EFECE5] p-1 rounded-2xl border border-[#E5E0D8] self-start md:self-auto">
            <button
              onClick={() => setCategory('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                category === 'quiz'
                  ? 'bg-white text-[#2C3325] shadow-xs'
                  : 'text-[#7A7468] hover:text-[#2C3325]'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-600" />
              <span>⚡ Quiz Champions (Battles & INR)</span>
            </button>
            <button
              onClick={() => setCategory('xp')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                category === 'xp'
                  ? 'bg-white text-[#2C3325] shadow-xs'
                  : 'text-[#7A7468] hover:text-[#2C3325]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>🔥 XP Scholars (Study & Streaks)</span>
            </button>
          </div>

          {/* Timeframe Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex bg-[#EFECE5] p-0.5 rounded-xl border border-[#E5E0D8] text-xs font-semibold">
              {(['daily', 'weekly', 'all_time'] as LeaderboardTimeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[#5A634E] text-white shadow-2xs font-bold'
                      : 'text-[#7A7468] hover:text-[#2C3325]'
                  }`}
                >
                  {tf.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative flex-1 sm:w-44">
              <Search className="w-3.5 h-3.5 text-[#7A7468] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-[#E5E0D8] text-xs text-[#4A4A3A] focus:outline-hidden focus:ring-1 focus:ring-[#5A634E]"
              />
            </div>
          </div>
        </div>

        {/* Current User Standing Banner */}
        <div className="px-5 py-3 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#7A7468]">Your Current Standing:</span>
            <span className="font-bold text-[#2C3325] flex items-center gap-1">
              <span>{category === 'quiz' ? `Rank #${userQuizRank}` : `Rank #${userXpRank}`}</span>
              <span className="text-[#8B8374] font-normal">
                ({category === 'quiz' ? 'Quiz Battles' : 'Scholar XP'})
              </span>
            </span>
          </div>

          {category === 'quiz' && onStartBattle && (
            <button
              onClick={() => {
                onClose();
                onStartBattle();
              }}
              className="inline-flex items-center gap-1 text-[#5A634E] hover:text-[#484F3E] font-bold text-xs hover:underline cursor-pointer"
            >
              <span>Duel Now to Climb</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scrollable Leaderboard Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TOP 3 PODIUM (if no search active and top 3 available) */}
          {!searchQuery && top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 pb-2 items-end">
              {/* Rank 2 (Silver - Left) */}
              <div className="flex flex-col items-center order-1">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-slate-300 to-slate-100 shadow-md">
                    <img
                      src={top3[1].avatar}
                      alt={top3[1].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                    2
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs sm:text-sm text-[#4A4A3A] truncate max-w-[100px] sm:max-w-[130px]">
                    {top3[1].name}
                  </div>
                  {category === 'quiz' ? (
                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      ₹{(top3[1] as QuizLeaderboardEntry).totalEarningsCash} Won
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                      {(top3[1] as XPLeaderboardEntry).xp.toLocaleString()} XP
                    </div>
                  )}
                  <span className="text-[10px] text-[#8B8374]">
                    {category === 'quiz'
                      ? `${(top3[1] as QuizLeaderboardEntry).battlesWon} Wins`
                      : `${(top3[1] as XPLeaderboardEntry).streakDays}d Streak`}
                  </span>
                </div>
                <div className="w-full h-14 sm:h-18 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl mt-2 border-t border-slate-300 flex items-center justify-center font-bold text-slate-600 text-xs shadow-inner">
                  🥈 Silver
                </div>
              </div>

              {/* Rank 1 (Gold - Center) */}
              <div className="flex flex-col items-center order-2 -mt-4">
                <div className="relative mb-2">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl">👑</div>
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg ring-2 ring-amber-300/60">
                    <img
                      src={top3[0].avatar}
                      alt={top3[0].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                    1
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs sm:text-base text-[#2C3325] truncate max-w-[110px] sm:max-w-[150px]">
                    {top3[0].name}
                  </div>
                  {category === 'quiz' ? (
                    <div className="text-xs sm:text-sm text-emerald-700 font-extrabold mt-0.5">
                      ₹{(top3[0] as QuizLeaderboardEntry).totalEarningsCash} Won
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-amber-700 font-extrabold mt-0.5">
                      {(top3[0] as XPLeaderboardEntry).xp.toLocaleString()} XP
                    </div>
                  )}
                  <span className="text-[11px] text-[#7A7468] font-medium">
                    {category === 'quiz'
                      ? `${(top3[0] as QuizLeaderboardEntry).battlesWon} Wins (${(top3[0] as QuizLeaderboardEntry).winPercentage}%)`
                      : `${(top3[0] as XPLeaderboardEntry).streakDays}d Streak • Lv.${(top3[0] as XPLeaderboardEntry).level}`}
                  </span>
                </div>
                <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-300/80 to-amber-200/90 rounded-t-2xl mt-2 border-t-2 border-amber-400 flex items-center justify-center font-black text-amber-950 text-xs sm:text-sm shadow-inner">
                  🥇 Champion
                </div>
              </div>

              {/* Rank 3 (Bronze - Right) */}
              <div className="flex flex-col items-center order-3">
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-tr from-amber-600 to-orange-300 shadow-md">
                    <img
                      src={top3[2].avatar}
                      alt={top3[2].name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center border-2 border-white shadow-xs">
                    3
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xs sm:text-sm text-[#4A4A3A] truncate max-w-[100px] sm:max-w-[130px]">
                    {top3[2].name}
                  </div>
                  {category === 'quiz' ? (
                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      ₹{(top3[2] as QuizLeaderboardEntry).totalEarningsCash} Won
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                      {(top3[2] as XPLeaderboardEntry).xp.toLocaleString()} XP
                    </div>
                  )}
                  <span className="text-[10px] text-[#8B8374]">
                    {category === 'quiz'
                      ? `${(top3[2] as QuizLeaderboardEntry).battlesWon} Wins`
                      : `${(top3[2] as XPLeaderboardEntry).streakDays}d Streak`}
                  </span>
                </div>
                <div className="w-full h-12 sm:h-16 bg-gradient-to-t from-amber-700/20 to-amber-600/10 rounded-t-2xl mt-2 border-t border-amber-600/30 flex items-center justify-center font-bold text-amber-900 text-xs shadow-inner">
                  🥉 Bronze
                </div>
              </div>
            </div>
          )}

          {/* FULL RANK TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#7A7468] uppercase tracking-wider">
              {searchQuery ? 'Search Results' : 'Full Standings (Ranks 1–50)'}
            </h3>

            <div className="space-y-2">
              {currentList.map((entry) => {
                const isCurrentUser = entry.id === currentUser.id;
                const isQuiz = category === 'quiz';
                const qEntry = entry as QuizLeaderboardEntry;
                const xpEntry = entry as XPLeaderboardEntry;

                return (
                  <div
                    key={entry.id}
                    className={`p-3 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isCurrentUser
                        ? 'bg-[#EDF0E9] border-[#5A634E] ring-1 ring-[#5A634E]/30 shadow-xs'
                        : 'bg-white border-[#E5E0D8] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    {/* Left: Rank & Student Profile */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          entry.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-slate-900 shadow-xs'
                            : entry.rank === 3
                            ? 'bg-amber-700 text-white shadow-xs'
                            : 'bg-[#F0ECE4] text-[#7A7468]'
                        }`}
                      >
                        {entry.rank}
                      </span>

                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#E5E0D8] flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            entry.name
                          )}&background=5A634E&color=fff`;
                        }}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-[#4A4A3A] truncate">
                            {entry.name}
                          </span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded-md bg-[#5A634E] text-white text-[9px] font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A7468] flex items-center gap-2 mt-0.5">
                          <span>Class {entry.classLevel}</span>
                          {entry.city && (
                            <span className="flex items-center gap-0.5 text-[10px] text-[#8B8374]">
                              <MapPin className="w-2.5 h-2.5" />
                              {entry.city}
                            </span>
                          )}
                          {isQuiz ? (
                            <span className="px-1.5 py-0.2 rounded-sm bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                              {qEntry.tier || 'Ranked'} ({qEntry.eloRating} ELO)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-sm bg-orange-50 text-orange-800 text-[10px] font-semibold border border-orange-200">
                              Lv.{xpEntry.level} Scholar
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Category-Specific Performance Stats */}
                    <div className="text-right flex-shrink-0">
                      {isQuiz ? (
                        <div>
                          <div className="text-xs sm:text-sm font-bold font-serif text-emerald-700 flex items-center justify-end gap-1">
                            <IndianRupee className="w-3 h-3" />
                            <span>{qEntry.totalEarningsCash.toLocaleString('en-IN')} Won</span>
                          </div>
                          <div className="text-[11px] text-[#7A7468] mt-0.5">
                            <strong className="text-[#4A4A3A]">{qEntry.battlesWon}</strong> / {qEntry.totalBattles} won ({qEntry.winPercentage}%)
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs sm:text-sm font-bold font-serif text-[#AF601A] flex items-center justify-end gap-1">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>{xpEntry.xp.toLocaleString()} XP</span>
                          </div>
                          <div className="text-[11px] text-[#7A7468] flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                              <Flame className="w-3 h-3" />
                              {xpEntry.streakDays}d
                            </span>
                            <span>•</span>
                            <span>{xpEntry.lessonsCompleted} lessons</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F5F2ED] border-t border-[#E5E0D8] flex items-center justify-between text-xs text-[#7A7468]">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#5A634E]" />
            <span>Rankings recalculate instantly after every completed 1v1 battle duel and lesson.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5A634E] text-white font-bold hover:bg-[#484F3E] transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
