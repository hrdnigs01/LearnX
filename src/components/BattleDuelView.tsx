import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Trophy,
  Flame,
  Zap,
  Clock,
  Shield,
  Award,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Coins,
  IndianRupee,
  Lock,
  Wallet,
} from 'lucide-react';
import { User, PYQBattleQuestion, BattleOpponent, BattleTier, BattleRoundResult } from '../types';
import {
  pyqBattleQuestionsPool,
  simulatedOpponentsPool,
  getEloTier,
} from '../data/competitiveExamData';
import { addMistakeToVault } from '../utils/mistakeVault';
import { playChime } from '../utils/audio';
import {
  shuffleQuestionOptions,
  filterUniqueQuestions,
  getRecommendedTimerSeconds,
} from '../utils/questionEngine';

export interface MatchTierConfig {
  id: string;
  name: string;
  entryFeeCash: number;
  entryFeeCoins: number;
  prizeCash: number;
  prizeCoins: number;
  isFree: boolean;
  tag: string;
  color: string;
}

export const BATTLE_MATCH_TIERS: MatchTierConfig[] = [
  {
    id: 'tier_free',
    name: 'Free Practice Arena',
    entryFeeCash: 0,
    entryFeeCoins: 0,
    prizeCash: 0,
    prizeCoins: 5,
    isFree: true,
    tag: 'Free Entry',
    color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
  },
  {
    id: 'tier_20',
    name: 'Rookie Duel',
    entryFeeCash: 20,
    entryFeeCoins: 0,
    prizeCash: 30,
    prizeCoins: 0,
    isFree: false,
    tag: 'Entry ₹20 ➔ Win ₹30',
    color: 'border-amber-300 bg-amber-50/50 text-amber-900',
  },
  {
    id: 'tier_40',
    name: 'Challenger Duel',
    entryFeeCash: 40,
    entryFeeCoins: 0,
    prizeCash: 50,
    prizeCoins: 0,
    isFree: false,
    tag: 'Entry ₹40 ➔ Win ₹50',
    color: 'border-blue-300 bg-blue-50/50 text-blue-900',
  },
  {
    id: 'tier_60',
    name: 'Master Duel',
    entryFeeCash: 60,
    entryFeeCoins: 0,
    prizeCash: 70,
    prizeCoins: 0,
    isFree: false,
    tag: 'Entry ₹60 ➔ Win ₹70',
    color: 'border-purple-300 bg-purple-50/50 text-purple-900',
  },
  {
    id: 'tier_80',
    name: 'Grandmaster Duel',
    entryFeeCash: 80,
    entryFeeCoins: 0,
    prizeCash: 90,
    prizeCoins: 0,
    isFree: false,
    tag: 'Entry ₹80 ➔ Win ₹90',
    color: 'border-rose-300 bg-rose-50/50 text-rose-900',
  },
];

interface BattleDuelViewProps {
  currentUser: User;
  classLevel: number;
  onRefreshUser?: () => void;
  onNavigateToMistakes?: () => void;
  onOpenAiAssistant?: (prompt: string) => void;
  onOpenWallet?: (tab?: 'deposit' | 'redeem' | 'history') => void;
  onOpenLeaderboard?: (type?: 'quiz' | 'xp') => void;
}

export const BattleDuelView: React.FC<BattleDuelViewProps> = ({
  currentUser,
  classLevel,
  onRefreshUser,
  onNavigateToMistakes,
  onOpenAiAssistant,
  onOpenWallet,
  onOpenLeaderboard,
}) => {
  // Player ELO & Tier state
  const [playerElo, setPlayerElo] = useState<number>(() => {
    return currentUser.eloRating || 1350;
  });
  const [wins, setWins] = useState<number>(() => currentUser.battleWins || 18);
  const [losses, setLosses] = useState<number>(() => currentUser.battleLosses || 4);
  const currentTier: BattleTier = getEloTier(playerElo);

  // Match Tier Selection
  const [selectedTier, setSelectedTier] = useState<MatchTierConfig>(BATTLE_MATCH_TIERS[0]);
  const [walletCash, setWalletCash] = useState<number>(() => currentUser.walletCash ?? 120);
  const [walletCoins, setWalletCoins] = useState<number>(() => currentUser.walletCoins ?? 1450);

  // Matchmaking & Subject Selection
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [battleState, setBattleState] = useState<
    'lobby' | 'matching' | 'match_found' | 'countdown' | 'in_round' | 'round_feedback' | 'finished'
  >('lobby');

  const [activeOpponent, setActiveOpponent] = useState<BattleOpponent>(simulatedOpponentsPool[0]);
  const [currentQuestions, setCurrentQuestions] = useState<PYQBattleQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // In-Round Extended Timer and Manual Navigation state
  const [timerSeconds, setTimerSeconds] = useState(75);
  const [totalRoundSeconds, setTotalRoundSeconds] = useState(75);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerSelectedOption, setPlayerSelectedOption] = useState<number | null>(null);
  const [opponentSelectedOption, setOpponentSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [playerAnswerTime, setPlayerAnswerTime] = useState<number>(0);
  const [opponentAnswerTime, setOpponentAnswerTime] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<BattleRoundResult[]>([]);
  const [countdownNum, setCountdownNum] = useState(3);
  const [eloDelta, setEloDelta] = useState(0);
  const [payoutMessage, setPayoutMessage] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const opponentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Update wallet balances when currentUser updates
  useEffect(() => {
    if (currentUser.walletCash !== undefined) setWalletCash(currentUser.walletCash);
    if (currentUser.walletCoins !== undefined) setWalletCoins(currentUser.walletCoins);
  }, [currentUser]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
    };
  }, []);

  // Fetch or filter unique non-repeating questions
  const loadUniqueQuestionsForBattle = async (subject: string): Promise<PYQBattleQuestion[]> => {
    try {
      const res = await fetch(
        `/api/quiz/questions?subject=${encodeURIComponent(subject)}&classLevel=${classLevel}&count=5`
      );
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        return data.questions;
      }
    } catch (err) {
      console.warn('Failed to load questions via API, using client engine:', err);
    }

    // Fallback: use client-side unique question engine
    const historySet = new Set<string>();
    return filterUniqueQuestions(pyqBattleQuestionsPool, historySet, {
      subject,
      classLevel,
      count: 5,
    });
  };

  // Start Matchmaking with Entry Fee validation
  const handleStartMatchmaking = async () => {
    // Check wallet balance if cash tier
    if (!selectedTier.isFree && walletCash < selectedTier.entryFeeCash) {
      playChime('alarm');
      alert(
        `Insufficient cash balance! You need ₹${selectedTier.entryFeeCash}, but your balance is ₹${walletCash}. Please top up your wallet or select the Free Practice Tier.`
      );
      if (onOpenWallet) onOpenWallet('deposit');
      return;
    }

    // Deduct entry fee if cash tier
    if (!selectedTier.isFree) {
      setWalletCash((prev) => Math.max(0, prev - selectedTier.entryFeeCash));
    }

    setBattleState('matching');
    playChime('click');

    // Pick opponent
    const randomOpp =
      simulatedOpponentsPool[Math.floor(Math.random() * simulatedOpponentsPool.length)];
    setActiveOpponent(randomOpp);

    // Fetch unique questions
    const qList = await loadUniqueQuestionsForBattle(selectedSubject);
    setCurrentQuestions(qList);
    setCurrentQIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setRoundResults([]);
    setPlayerSelectedOption(null);
    setOpponentSelectedOption(null);
    setIsAnswerLocked(false);
    setPayoutMessage('');

    // Simulate match found after 2 seconds
    setTimeout(() => {
      setBattleState('match_found');
      playChime('badge');

      setTimeout(() => {
        setBattleState('countdown');
        setCountdownNum(3);

        const countInterval = setInterval(() => {
          setCountdownNum((prev) => {
            if (prev <= 1) {
              clearInterval(countInterval);
              startRound(0, qList);
              return 0;
            }
            playChime('click');
            return prev - 1;
          });
        }, 1000);
      }, 1800);
    }, 2000);
  };

  // Start specific question round with extended timer
  const startRound = (qIdx: number, questions = currentQuestions) => {
    const question = questions[qIdx];
    if (!question) return;

    setCurrentQIndex(qIdx);
    setBattleState('in_round');
    setPlayerSelectedOption(null);
    setOpponentSelectedOption(null);
    setIsAnswerLocked(false);
    setPlayerAnswerTime(0);
    setOpponentAnswerTime(0);

    // Extended per-question timer: 60-120s for standard MCQ, 180-300s for numericals
    const recommendedSeconds = getRecommendedTimerSeconds(question);
    setTotalRoundSeconds(recommendedSeconds);
    setTimerSeconds(recommendedSeconds);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);

    // Countdown Timer
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleRoundTimeout(qIdx, questions, recommendedSeconds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Realistic opponent thinking delay (between 8s and 25s depending on question length)
    const opponentDelay = Math.min(
      recommendedSeconds * 800,
      8000 + Math.random() * 15000
    );

    opponentTimeoutRef.current = setTimeout(() => {
      const isOpponentCorrect = Math.random() < 0.75;
      const oppAnswer = isOpponentCorrect
        ? question.correctIndex
        : (question.correctIndex + 1) % question.options.length;

      const oppTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      setOpponentSelectedOption(oppAnswer);
      setOpponentAnswerTime(oppTime);
    }, opponentDelay);
  };

  // Step 1: User selects an option (does NOT auto-advance; user can still switch)
  const handleSelectOption = (optIndex: number) => {
    if (isAnswerLocked || battleState !== 'in_round') return;
    setPlayerSelectedOption(optIndex);
    playChime('click');
  };

  // Step 2: User explicitly clicks "Lock & Submit Answer"
  const handleConfirmSubmitAnswer = () => {
    if (playerSelectedOption === null || isAnswerLocked || battleState !== 'in_round') return;

    setIsAnswerLocked(true);
    const timeTaken = Math.max(1, totalRoundSeconds - timerSeconds);
    setPlayerAnswerTime(timeTaken);
    playChime('click');

    // If opponent hasn't answered yet, trigger opponent answer quickly
    if (opponentSelectedOption === null) {
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
      opponentTimeoutRef.current = setTimeout(() => {
        const question = currentQuestions[currentQIndex];
        const isOpponentCorrect = Math.random() < 0.72;
        const oppAnswer = isOpponentCorrect
          ? question.correctIndex
          : (question.correctIndex + 1) % question.options.length;

        const oppTime = Math.min(totalRoundSeconds, timeTaken + 2);
        setOpponentSelectedOption(oppAnswer);
        setOpponentAnswerTime(oppTime);
        resolveRound(playerSelectedOption, timeTaken, oppAnswer, oppTime, currentQIndex);
      }, 1200);
    } else {
      resolveRound(playerSelectedOption, timeTaken, opponentSelectedOption, opponentAnswerTime, currentQIndex);
    }
  };

  // Timeout handler
  const handleRoundTimeout = (
    qIdx: number,
    questions: PYQBattleQuestion[],
    maxSeconds: number
  ) => {
    setIsAnswerLocked(true);
    const oppAnswer = opponentSelectedOption ?? questions[qIdx].correctIndex;
    resolveRound(playerSelectedOption, maxSeconds, oppAnswer, opponentAnswerTime || maxSeconds - 2, qIdx);
  };

  // Resolve Round scoring and record into user history
  const resolveRound = (
    pAns: number | null,
    pTime: number,
    oAns: number | null,
    oTime: number,
    qIdx: number
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);

    const question = currentQuestions[qIdx];
    const isPlayerCorrect = pAns === question.correctIndex;
    const isOpponentCorrect = oAns === question.correctIndex;

    // Base 100 points + speed bonus (up to 50 pts based on % of time remaining)
    const timeRatio = Math.max(0, 1 - pTime / totalRoundSeconds);
    const pScoreGain = isPlayerCorrect ? Math.round(100 + timeRatio * 50) : 0;
    const oScoreGain = isOpponentCorrect ? Math.round(100 + (1 - oTime / totalRoundSeconds) * 50) : 0;

    const updatedPScore = playerScore + pScoreGain;
    const updatedOScore = opponentScore + oScoreGain;
    setPlayerScore(updatedPScore);
    setOpponentScore(updatedOScore);

    // Save attempt to unique question history on backend
    try {
      fetch('/api/quiz/record-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          subject: question.subject,
          chapterTopic: question.topic,
          classLevel: classLevel,
          selectedOptionIndex: pAns,
          isCorrect: isPlayerCorrect,
          context: 'battle',
        }),
      }).catch((e) => console.warn('History record sync error', e));
    } catch (e) {
      // benign
    }

    // If student was incorrect, log to AI Mistake Notebook!
    if (!isPlayerCorrect && pAns !== null) {
      addMistakeToVault({
        questionId: question.id,
        questionText: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        userWrongIndex: pAns,
        explanation: question.explanation,
        subjectName: question.subject,
        chapterTitle: question.topic,
        classLevel: classLevel,
        pyqYearOrSource: question.pyqSource,
        sourceContext: '1v1_battle',
      });
    }

    const roundRes: BattleRoundResult = {
      questionIndex: qIdx,
      playerAnswer: pAns,
      playerTimeSeconds: pTime,
      playerScoreGain: pScoreGain,
      opponentAnswer: oAns,
      opponentTimeSeconds: oTime,
      opponentScoreGain: oScoreGain,
      correctIndex: question.correctIndex,
    };

    setRoundResults((prev) => [...prev, roundRes]);
    setBattleState('round_feedback');

    if (isPlayerCorrect) {
      playChime('success');
    } else {
      playChime('alarm');
    }
  };

  // Step 3: Explicit Manual "Next Question" Navigation
  const handleAdvanceNextRound = () => {
    playChime('click');
    if (currentQIndex + 1 < currentQuestions.length) {
      startRound(currentQIndex + 1, currentQuestions);
    } else {
      finishBattle(playerScore, opponentScore);
    }
  };

  // Complete Battle & Process Payouts / ELO
  const finishBattle = (finalPScore: number, finalOScore: number) => {
    setBattleState('finished');
    const won = finalPScore > finalOScore;
    const tie = finalPScore === finalOScore;

    let delta = 0;
    let payoutText = '';

    if (won) {
      delta = 25;
      setWins((w) => w + 1);
      playChime('badge');

      if (selectedTier.isFree) {
        // Free tier prize: 5 Coins
        setWalletCoins((c) => c + selectedTier.prizeCoins);
        payoutText = `+${selectedTier.prizeCoins} Virtual Coins awarded to your wallet!`;
      } else {
        // Cash tier prize
        setWalletCash((c) => c + selectedTier.prizeCash);
        payoutText = `₹${selectedTier.prizeCash} Real Cash credited directly to your Wallet!`;
      }
    } else if (tie) {
      delta = 0;
      if (!selectedTier.isFree) {
        // Refund on tie
        setWalletCash((c) => c + selectedTier.entryFeeCash);
        payoutText = `Match tied! ₹${selectedTier.entryFeeCash} entry fee refunded to your wallet.`;
      } else {
        payoutText = 'Match tied! GG.';
      }
    } else {
      delta = -15;
      setLosses((l) => l + 1);
      playChime('alarm');
      payoutText = selectedTier.isFree
        ? 'Practice match completed. Review explanations below!'
        : `Defeat in ${selectedTier.name}. Keep practicing to master concepts!`;
    }

    setEloDelta(delta);
    setPlayerElo((e) => Math.max(1000, e + delta));
    setPayoutMessage(payoutText);

    if (onRefreshUser) onRefreshUser();
  };

  const currentQ = currentQuestions[currentQIndex];

  return (
    <div className="w-full space-y-6">
      {/* 1. HERO ARENA HEADER */}
      <div className="bg-gradient-to-r from-stone-900 via-[#383C2F] to-[#25281F] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Swords className="w-3.5 h-3.5" />
                Live 1v1 Battle Arena
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold">
                Class {classLevel} PYQs • Extended Timers
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              NCERT & PYQ Duel Engine
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Real-time competitive battles with extended timers (60–120s for standard MCQs, 3–5 min for
              numerical problems). Manual answer locking, zero repeated questions, and dual cash/coin prize tiers!
            </p>
          </div>

          {/* Right Wallet & ELO Summary */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Wallet Balance Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-stone-300 tracking-wider block">
                  Your Balance
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="text-emerald-400 flex items-center font-mono">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {walletCash}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-amber-300 flex items-center gap-1 font-mono">
                    <Coins className="w-3.5 h-3.5" />
                    {walletCoins}
                  </span>
                </div>
              </div>

              {onOpenWallet && (
                <button
                  onClick={() => onOpenWallet('redeem')}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-[11px] transition shadow-xs flex items-center gap-1"
                  title="Convert Coins to Cash (1000 Coins = ₹5)"
                >
                  <Coins className="w-3 h-3" />
                  <span>Redeem</span>
                </button>
              )}
            </div>

            {/* ELO Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-black text-amber-300">{playerElo}</span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-400 text-stone-950">
                    {currentTier}
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">{wins}W</span>
                  <span>-</span>
                  <span className="text-rose-400 font-bold">{losses}L</span>
                  <span>({Math.round((wins / Math.max(1, wins + losses)) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOBBY VIEW - TIER & SUBJECT SELECTION */}
      {battleState === 'lobby' && (
        <div className="space-y-6">
          {/* Match Tiers Selector */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EBE7DF]">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
                  Select Battle Match Tier
                </h3>
                <p className="text-xs text-[#7A7468]">
                  Play in the Free Arena for Coins, or duel in Cash Tiers to win Real Money.
                </p>
              </div>

              {onOpenLeaderboard && (
                <button
                  onClick={() => onOpenLeaderboard('quiz')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF0E9] hover:bg-[#E0E5D8] text-[#5A634E] text-xs font-bold transition border border-[#5A634E]/20"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Dual Leaderboards</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {BATTLE_MATCH_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-3 ${
                      isSelected
                        ? `${tier.color} ring-2 ring-[#5A634E] shadow-sm font-bold scale-[1.02]`
                        : 'border-[#E5E0D8] bg-[#FAF8F5] hover:bg-white text-[#4A4A3A]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7A7468]">
                          {tier.name}
                        </span>
                        {tier.isFree ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Free
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            Cash Tier
                          </span>
                        )}
                      </div>

                      <div className="text-base font-black flex items-center gap-1 text-[#2A2A22]">
                        {tier.isFree ? (
                          <span>₹0 Entry</span>
                        ) : (
                          <span>Entry ₹{tier.entryFeeCash}</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E5E0D8]/60 text-xs">
                      <span className="text-[#5A634E] font-bold block">
                        Winner Gets:{' '}
                        {tier.isFree ? `${tier.prizeCoins} Coins 🪙` : `₹${tier.prizeCash} Cash 💰`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Coin Conversion Rate Banner */}
            <div className="p-3 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[#4A4A3A]">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>
                  <strong>Coin Economy Rate:</strong> 1000 Coins = ₹5 Real Cash. Convert your virtual battle winnings anytime!
                </span>
              </div>
              {onOpenWallet && (
                <button
                  onClick={() => onOpenWallet('redeem')}
                  className="text-xs font-bold text-[#5A634E] hover:underline flex items-center gap-1"
                >
                  <span>Redeem Coins</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Subject Selection Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
                Choose Battle Subject
              </h3>
              <p className="text-xs text-[#7A7468]">
                Select a specific subject or choose "All Subjects" for mixed board & entrance PYQs.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    selectedSubject === sub
                      ? 'border-[#5A634E] bg-[#5A634E]/10 ring-2 ring-[#5A634E]/30 text-[#4A4A3A] font-bold shadow-2xs'
                      : 'border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#F5F2ED] text-[#7A7468]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center text-base shadow-2xs">
                    {sub === 'All' && '🎯'}
                    {sub === 'Physics' && '⚡'}
                    {sub === 'Chemistry' && '🧪'}
                    {sub === 'Mathematics' && '📐'}
                    {sub === 'Biology' && '🧬'}
                  </div>
                  <span className="text-xs">{sub === 'All' ? 'Mixed PYQs' : sub}</span>
                </button>
              ))}
            </div>

            {/* Match Launch Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E0D8]">
              <div className="flex items-center gap-2 text-xs text-[#7A7468]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  Selected:{' '}
                  <strong className="text-[#4A4A3A]">{selectedTier.name}</strong> •{' '}
                  <strong className="text-[#4A4A3A]">{selectedSubject} PYQs</strong>
                </span>
              </div>

              <button
                id="start-pyq-battle-btn"
                onClick={handleStartMatchmaking}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Swords className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>
                  {selectedTier.isFree
                    ? 'Start Free 1v1 Battle'
                    : `Enter Duel (₹${selectedTier.entryFeeCash})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MATCHMAKING RADAR STATE */}
      {battleState === 'matching' && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-12 text-center shadow-sm space-y-6">
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#5A634E]/10 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-[#5A634E]/20 animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-[#5A634E] text-white flex items-center justify-center shadow-lg text-2xl">
              <Swords className="w-8 h-8 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-serif font-bold text-[#4A4A3A]">
              Matching with Live Student...
            </h3>
            <p className="text-xs text-[#7A7468] leading-relaxed">
              Searching for an opponent in {selectedTier.name} around{' '}
              <span className="font-semibold text-[#5A634E]">{playerElo} ELO</span> for {selectedSubject} PYQs...
            </p>
          </div>
        </div>
      )}

      {/* 4. MATCH FOUND & COUNTDOWN */}
      {(battleState === 'match_found' || battleState === 'countdown') && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 text-center shadow-sm space-y-8 animate-in zoom-in-95">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>OPPONENT FOUND • {selectedTier.name.toUpperCase()}</span>
          </div>

          {/* VS Card */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {/* Player */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-[#5A634E] shadow-md"
              />
              <div className="font-bold text-sm text-[#4A4A3A]">{currentUser.name}</div>
              <div className="text-xs font-mono font-bold text-[#5A634E]">{playerElo} ELO</div>
              <span className="text-[10px] text-[#7A7468]">Class {classLevel} Scholar</span>
            </div>

            {/* Countdown Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-amber-500 text-white font-mono font-black text-2xl flex items-center justify-center shadow-lg animate-pulse">
                {countdownNum}
              </div>
              <span className="text-[10px] font-extrabold uppercase text-[#7A7468] mt-1 tracking-wider">
                GET READY
              </span>
            </div>

            {/* Opponent */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={activeOpponent.avatar}
                alt={activeOpponent.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-600 shadow-md"
              />
              <div className="font-bold text-sm text-[#4A4A3A]">{activeOpponent.name}</div>
              <div className="text-xs font-mono font-bold text-amber-700">{activeOpponent.eloRating} ELO</div>
              <span className="text-[10px] text-[#7A7468]">{activeOpponent.school}</span>
            </div>
          </div>

          <div className="text-xs text-[#7A7468]">
            5 Questions • Extended Timers • Manual Next Question Navigation
          </div>
        </div>
      )}

      {/* 5. IN-ROUND ACTIVE DUEL QUESTION */}
      {(battleState === 'in_round' || battleState === 'round_feedback') && currentQ && (
        <div className="space-y-4">
          {/* Header Scoreboard & Timer */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              {/* Player Score */}
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-[#5A634E]"
                />
                <div>
                  <div className="text-xs font-bold text-[#4A4A3A] truncate max-w-[100px] sm:max-w-none">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-lg font-mono font-black text-[#5A634E]">{playerScore} pts</div>
                </div>
              </div>

              {/* Central Round & Timer */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-[#7A7468] uppercase tracking-wider">
                  Round {currentQIndex + 1} of {currentQuestions.length}
                </span>
                <div
                  className={`text-2xl font-mono font-black mt-0.5 ${
                    timerSeconds <= 15 ? 'text-rose-600 animate-pulse' : 'text-[#4A4A3A]'
                  }`}
                >
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Opponent Score */}
              <div className="flex items-center gap-2.5 text-right">
                <div>
                  <div className="text-xs font-bold text-[#4A4A3A] truncate max-w-[100px] sm:max-w-none">
                    {activeOpponent.name.split(' ')[0]}
                  </div>
                  <div className="text-lg font-mono font-black text-amber-700">{opponentScore} pts</div>
                </div>
                <img
                  src={activeOpponent.avatar}
                  alt={activeOpponent.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-amber-600"
                />
              </div>
            </div>

            {/* Timer visual progress bar */}
            <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-1000 ${
                  timerSeconds <= 15
                    ? 'bg-rose-500'
                    : timerSeconds <= 30
                    ? 'bg-amber-500'
                    : 'bg-[#5A634E]'
                }`}
                style={{ width: `${(timerSeconds / totalRoundSeconds) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#5A634E] text-xs font-bold border border-[#E5E0D8]">
                  {currentQ.subject} • {currentQ.topic}
                </span>
                <span className="text-xs font-mono text-[#7A7468]">{currentQ.pyqSource}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {currentQ.difficulty} PYQ
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  ⏱️ {totalRoundSeconds}s Time Limit
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-[#2A2A22] leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Option Buttons (Manual Click Selection) */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isPlayerChoice = playerSelectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showFeedback = battleState === 'round_feedback';

                let btnStyles = 'border-[#E5E0D8] bg-[#FAF8F5] hover:bg-[#F5F2ED] text-[#4A4A3A]';

                if (showFeedback) {
                  if (isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 font-bold';
                  } else if (isPlayerChoice && !isCorrect) {
                    btnStyles = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400 font-bold';
                  } else {
                    btnStyles = 'border-[#E5E0D8] bg-[#FAF8F5] opacity-50 text-[#7A7468]';
                  }
                } else if (isPlayerChoice) {
                  btnStyles = 'border-[#5A634E] bg-[#5A634E]/10 ring-2 ring-[#5A634E] text-[#2A2A22] font-bold shadow-2xs';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerLocked || showFeedback}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative cursor-pointer ${btnStyles}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                        isPlayerChoice && !showFeedback
                          ? 'bg-[#5A634E] text-white border-[#5A634E]'
                          : 'bg-white text-[#4A4A3A] border-[#E5E0D8]'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm flex-1 leading-relaxed">{opt}</span>

                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {showFeedback && isPlayerChoice && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Bar: Lock & Submit Answer OR Next Question Navigation */}
            <div className="pt-4 border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
              {battleState === 'in_round' && !isAnswerLocked && (
                <>
                  <div className="text-xs text-[#7A7468]">
                    {playerSelectedOption === null
                      ? 'Select your answer above, then click "Lock & Submit Answer"'
                      : `Option ${String.fromCharCode(65 + playerSelectedOption)} selected. Ready to lock?`}
                  </div>

                  <button
                    onClick={handleConfirmSubmitAnswer}
                    disabled={playerSelectedOption === null}
                    className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                      playerSelectedOption !== null
                        ? 'bg-[#5A634E] hover:bg-[#484F3E] text-white shadow-md'
                        : 'bg-[#E5E0D8] text-[#8B8374] cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {playerSelectedOption !== null
                        ? `Lock & Submit Option ${String.fromCharCode(65 + playerSelectedOption)}`
                        : 'Select an Option to Submit'}
                    </span>
                  </button>
                </>
              )}

              {/* Round Feedback & Explicit "Next Question" button */}
              {battleState === 'round_feedback' && (
                <div className="w-full space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#5A634E] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Correct Answer: Option {String.fromCharCode(65 + currentQ.correctIndex)}
                      </span>
                      {playerSelectedOption !== currentQ.correctIndex && (
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                          Logged to Mistake Vault 📓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6A6354] leading-relaxed">{currentQ.explanation}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-[#7A7468]">
                      Take your time reading the concept explanation before moving on.
                    </div>

                    <button
                      onClick={handleAdvanceNextRound}
                      className="px-6 py-3 rounded-2xl bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {currentQIndex + 1 < currentQuestions.length
                          ? 'Next Question ➔'
                          : 'View Duel Results ➔'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. BATTLE FINISHED - RESULTS SCREEN */}
      {battleState === 'finished' && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-10 shadow-lg text-center space-y-8 animate-in zoom-in-95">
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl shadow-xl border-4 border-white bg-amber-50">
              {playerScore > opponentScore ? '🏆' : playerScore === opponentScore ? '🤝' : '⚔️'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#4A4A3A]">
              {playerScore > opponentScore
                ? 'VICTORY! YOU WON THE DUEL!'
                : playerScore === opponentScore
                ? 'TIED MATCH!'
                : 'DEFEAT! BETTER LUCK NEXT DUEL'}
            </h2>

            {/* Payout & Prize Notification */}
            {payoutMessage && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{payoutMessage}</span>
              </div>
            )}

            {/* ELO Delta Banner */}
            <div className="block">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-sm font-mono font-bold">
                <span>Your Rating:</span>
                <span className="text-base text-[#4A4A3A]">{playerElo} ELO</span>
                <span
                  className={`text-base font-black ${
                    eloDelta > 0 ? 'text-emerald-600' : eloDelta < 0 ? 'text-rose-600' : 'text-slate-600'
                  }`}
                >
                  ({eloDelta > 0 ? `+${eloDelta}` : eloDelta} ELO)
                </span>
              </div>
            </div>
          </div>

          {/* Head-to-Head Comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto bg-[#FDFBF7] p-5 rounded-2xl border border-[#E5E0D8]">
            <div className="text-center space-y-1">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-[#5A634E]"
              />
              <div className="font-bold text-xs text-[#4A4A3A] truncate">{currentUser.name}</div>
              <div className="text-xl font-mono font-black text-[#5A634E]">{playerScore} pts</div>
              <div className="text-[10px] text-emerald-700 font-bold">
                {roundResults.filter((r) => r.playerAnswer === r.correctIndex).length} / 5 Correct
              </div>
            </div>

            <div className="text-center space-y-1">
              <img
                src={activeOpponent.avatar}
                alt={activeOpponent.name}
                className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-amber-600"
              />
              <div className="font-bold text-xs text-[#4A4A3A] truncate">{activeOpponent.name}</div>
              <div className="text-xl font-mono font-black text-amber-700">{opponentScore} pts</div>
              <div className="text-[10px] text-stone-600 font-bold">
                {roundResults.filter((r) => r.opponentAnswer === r.correctIndex).length} / 5 Correct
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartMatchmaking}
              className="px-6 py-3 rounded-2xl bg-[#5A634E] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#484F3E] transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Duel</span>
            </button>

            {onOpenLeaderboard && (
              <button
                onClick={() => onOpenLeaderboard('quiz')}
                className="px-6 py-3 rounded-2xl bg-[#EDF0E9] hover:bg-[#E0E5D8] text-[#5A634E] border border-[#5A634E]/30 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>View Dual Leaderboards</span>
              </button>
            )}

            {onNavigateToMistakes && (
              <button
                onClick={onNavigateToMistakes}
                className="px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Open AI Mistake Vault</span>
              </button>
            )}

            <button
              onClick={() => setBattleState('lobby')}
              className="px-6 py-3 rounded-2xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] border border-[#E5E0D8] font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Back to Battle Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
