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
} from 'lucide-react';
import { User, PYQBattleQuestion, BattleOpponent, BattleTier, BattleRoundResult } from '../types';
import {
  pyqBattleQuestionsPool,
  simulatedOpponentsPool,
  getEloTier,
} from '../data/competitiveExamData';
import { addMistakeToVault } from '../utils/mistakeVault';
import { playChime } from '../utils/audio';

interface BattleDuelViewProps {
  currentUser: User;
  classLevel: number;
  onRefreshUser?: () => void;
  onNavigateToMistakes?: () => void;
  onOpenAiAssistant?: (prompt: string) => void;
}

export const BattleDuelView: React.FC<BattleDuelViewProps> = ({
  currentUser,
  classLevel,
  onRefreshUser,
  onNavigateToMistakes,
  onOpenAiAssistant,
}) => {
  // Player ELO & Tier state
  const [playerElo, setPlayerElo] = useState<number>(() => {
    return currentUser.eloRating || 1350;
  });
  const [wins, setWins] = useState<number>(() => currentUser.battleWins || 12);
  const [losses, setLosses] = useState<number>(() => currentUser.battleLosses || 4);
  const currentTier: BattleTier = getEloTier(playerElo);

  // Matchmaking & Subject Selection
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [battleState, setBattleState] = useState<
    'lobby' | 'matching' | 'match_found' | 'countdown' | 'in_round' | 'round_feedback' | 'finished'
  >('lobby');

  const [activeOpponent, setActiveOpponent] = useState<BattleOpponent>(simulatedOpponentsPool[0]);
  const [currentQuestions, setCurrentQuestions] = useState<PYQBattleQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // In-Round state
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerSelectedOption, setPlayerSelectedOption] = useState<number | null>(null);
  const [opponentSelectedOption, setOpponentSelectedOption] = useState<number | null>(null);
  const [playerAnswerTime, setPlayerAnswerTime] = useState<number>(0);
  const [opponentAnswerTime, setOpponentAnswerTime] = useState<number>(0);
  const [roundResults, setRoundResults] = useState<BattleRoundResult[]>([]);
  const [countdownNum, setCountdownNum] = useState(3);
  const [eloDelta, setEloDelta] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const opponentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
    };
  }, []);

  // Filter questions based on selected subject
  const getQuestionsForBattle = (subject: string): PYQBattleQuestion[] => {
    let pool = pyqBattleQuestionsPool;
    if (subject !== 'All') {
      pool = pyqBattleQuestionsPool.filter(
        (q) => q.subject.toLowerCase() === subject.toLowerCase()
      );
    }
    // If pool is small, take all and duplicate or fallback
    if (pool.length < 5) {
      pool = [...pool, ...pyqBattleQuestionsPool];
    }
    // Shuffle and pick 5
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  // Start Matchmaking
  const handleStartMatchmaking = () => {
    setBattleState('matching');
    playChime('click');

    // Randomize an opponent from pool
    const randomOpp =
      simulatedOpponentsPool[Math.floor(Math.random() * simulatedOpponentsPool.length)];
    setActiveOpponent(randomOpp);

    // Prepare questions
    const qList = getQuestionsForBattle(selectedSubject);
    setCurrentQuestions(qList);
    setCurrentQIndex(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setRoundResults([]);
    setPlayerSelectedOption(null);
    setOpponentSelectedOption(null);

    // Simulate match found after 2.2 seconds
    setTimeout(() => {
      setBattleState('match_found');
      playChime('badge');

      // Transition to 3-2-1 countdown after 1.8s
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
    }, 2200);
  };

  // Start specific question round
  const startRound = (qIdx: number, questions = currentQuestions) => {
    setCurrentQIndex(qIdx);
    setBattleState('in_round');
    setPlayerSelectedOption(null);
    setOpponentSelectedOption(null);
    setPlayerAnswerTime(0);
    setOpponentAnswerTime(0);
    setTimerSeconds(15);

    const question = questions[qIdx];
    const startTime = Date.now();

    // Clear any previous intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);

    // 15s Countdown Timer
    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleRoundTimeout(qIdx, questions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate realistic opponent response (between 3.5s and 10s)
    const opponentDelay = 3500 + Math.random() * 6500;
    opponentTimeoutRef.current = setTimeout(() => {
      // 75% chance opponent is correct, 25% chance of realistic mistake
      const isOpponentCorrect = Math.random() < 0.78;
      const oppAnswer = isOpponentCorrect
        ? question.correctIndex
        : (question.correctIndex + 1) % question.options.length;

      const oppTime = Math.round((Date.now() - startTime) / 1000);
      setOpponentSelectedOption(oppAnswer);
      setOpponentAnswerTime(oppTime);
    }, opponentDelay);
  };

  // Player clicks an answer option
  const handleSelectOption = (optIndex: number) => {
    if (playerSelectedOption !== null || battleState !== 'in_round') return;

    const timeTaken = 15 - timerSeconds;
    setPlayerSelectedOption(optIndex);
    setPlayerAnswerTime(timeTaken);

    // Haptic / click feedback
    playChime('click');

    // If opponent hasn't answered yet, force opponent to answer within 1-2 seconds
    if (opponentSelectedOption === null) {
      if (opponentTimeoutRef.current) clearTimeout(opponentTimeoutRef.current);
      opponentTimeoutRef.current = setTimeout(() => {
        const question = currentQuestions[currentQIndex];
        const isOpponentCorrect = Math.random() < 0.75;
        const oppAnswer = isOpponentCorrect
          ? question.correctIndex
          : (question.correctIndex + 1) % question.options.length;

        setOpponentSelectedOption(oppAnswer);
        setOpponentAnswerTime(timeTaken + 1.2);
        resolveRound(optIndex, timeTaken, oppAnswer, timeTaken + 1.2, currentQIndex);
      }, 1000);
    } else {
      resolveRound(optIndex, timeTaken, opponentSelectedOption, opponentAnswerTime, currentQIndex);
    }
  };

  // Round Timeout Handler
  const handleRoundTimeout = (qIdx: number, questions: PYQBattleQuestion[]) => {
    const oppAnswer = opponentSelectedOption ?? questions[qIdx].correctIndex;
    resolveRound(playerSelectedOption, 15, oppAnswer, opponentAnswerTime || 14, qIdx);
  };

  // Resolve Round scoring and check if wrong to push to Mistake Vault
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

    // Calculate score points: base 100 pts + speed bonus (up to 50 pts)
    const pScoreGain = isPlayerCorrect ? Math.max(100, 150 - Math.round(pTime * 3.3)) : 0;
    const oScoreGain = isOpponentCorrect ? Math.max(100, 150 - Math.round(oTime * 3.3)) : 0;

    const updatedPScore = playerScore + pScoreGain;
    const updatedOScore = opponentScore + oScoreGain;
    setPlayerScore(updatedPScore);
    setOpponentScore(updatedOScore);

    // If player answered incorrectly or timed out, automatically log to AI Mistake Notebook!
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

    // Play feedback sound
    if (isPlayerCorrect) {
      playChime('success');
    } else {
      playChime('alarm');
    }

    // Advance to next round or finish battle after 2.5 seconds
    setTimeout(() => {
      if (qIdx + 1 < currentQuestions.length) {
        startRound(qIdx + 1, currentQuestions);
      } else {
        finishBattle(updatedPScore, updatedOScore);
      }
    }, 2500);
  };

  // Complete Battle and calculate ELO updates
  const finishBattle = (finalPScore: number, finalOScore: number) => {
    setBattleState('finished');
    const won = finalPScore > finalOScore;
    const tie = finalPScore === finalOScore;

    let delta = 0;
    if (won) {
      delta = 25;
      setWins((w) => w + 1);
      playChime('badge');
    } else if (tie) {
      delta = 0;
    } else {
      delta = -15;
      setLosses((l) => l + 1);
      playChime('alarm');
    }

    setEloDelta(delta);
    const newElo = Math.max(1000, playerElo + delta);
    setPlayerElo(newElo);

    // Persist new ELO to local storage user state
    try {
      const activeUserRaw = localStorage.getItem('learnx_active_user_data');
      if (activeUserRaw) {
        const u = JSON.parse(activeUserRaw);
        u.eloRating = newElo;
        u.battleWins = (u.battleWins || 0) + (won ? 1 : 0);
        u.battleLosses = (u.battleLosses || 0) + (won || tie ? 0 : 1);
        u.battleTier = getEloTier(newElo);
        localStorage.setItem('learnx_active_user_data', JSON.stringify(u));
      }
    } catch (e) {
      console.error(e);
    }

    if (onRefreshUser) {
      onRefreshUser();
    }
  };

  const currentQ = currentQuestions[currentQIndex];

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP ELO & BATTLE ARENA HEADER */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-stone-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Swords className="w-3.5 h-3.5" />
                Live 1v1 PYQ Battle Arena
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold">
                NCERT & Competitive PYQs
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              Real-Time Quiz Duels & ELO Ladder
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              Challenge fellow Class {classLevel} scholars in 15-second lightning rounds.
              Win duels to climb the national leaderboard. Failed questions automatically sync to your
              AI Mistake Notebook for re-testing.
            </p>
          </div>

          {/* ELO & Player Rank Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono font-black text-amber-300">{playerElo}</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400 text-stone-950">
                  {currentTier}
                </span>
              </div>
              <div className="text-xs text-stone-300 flex items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-bold">{wins}W</span>
                <span>-</span>
                <span className="text-rose-400 font-bold">{losses}L</span>
                <span>•</span>
                <span>{Math.round((wins / Math.max(1, wins + losses)) * 100)}% Win Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOBBY VIEW - SUBJECT SELECTION & QUICK DUEL LAUNCH */}
      {battleState === 'lobby' && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">Choose Your Battle Subject</h3>
            <p className="text-xs sm:text-sm text-[#7A7468] mt-1">
              Select a specialized domain or choose "All Subjects" for mixed NCERT board & entrance exam questions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                  selectedSubject === sub
                    ? 'border-[#5A634E] bg-[#5A634E]/10 ring-2 ring-[#5A634E]/30 text-[#4A4A3A] font-bold shadow-xs'
                    : 'border-[#E5E0D8] bg-[#FDFBF7] hover:bg-[#F5F2ED] text-[#7A7468]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center text-lg shadow-2xs">
                  {sub === 'All' && '🎯'}
                  {sub === 'Physics' && '⚡'}
                  {sub === 'Chemistry' && '🧪'}
                  {sub === 'Mathematics' && '📐'}
                  {sub === 'Biology' && '🧬'}
                </div>
                <span className="text-xs sm:text-sm">{sub === 'All' ? 'Mixed PYQs' : sub}</span>
              </button>
            ))}
          </div>

          {/* Quick Duel Features Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs space-y-1">
              <div className="font-bold text-[#4A4A3A] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>15s Lightning Speed</span>
              </div>
              <p className="text-[#7A7468]">
                Fast answers score up to +50 speed bonus points over the opponent.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs space-y-1">
              <div className="font-bold text-[#4A4A3A] flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>+25 ELO per Victory</span>
              </div>
              <p className="text-[#7A7468]">
                Win duels to advance from Bronze to Grandmaster scholar rank.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs space-y-1">
              <div className="font-bold text-[#4A4A3A] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>AI Mistake Vault</span>
              </div>
              <p className="text-[#7A7468]">
                Questions you fail are instantly filed for spaced repetition re-testing.
              </p>
            </div>
          </div>

          {/* Start Matching Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E0D8]">
            <div className="flex items-center gap-2 text-xs text-[#7A7468]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>
                <strong className="text-[#4A4A3A]">1,480+ Students Active</strong> looking for battles right now
              </span>
            </div>

            <button
              id="start-pyq-battle-btn"
              onClick={handleStartMatchmaking}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5A634E] text-white font-bold text-sm shadow-md hover:bg-[#484F3E] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Swords className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Find 1v1 Opponent Now</span>
            </button>
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
              Searching for an Opponent...
            </h3>
            <p className="text-xs text-[#7A7468] leading-relaxed">
              Scanning active students around <span className="font-semibold text-[#5A634E]">{playerElo} ELO</span> in
              Delhi, Kota, Mumbai, Bangalore, and Lucknow for {selectedSubject} PYQs...
            </p>
          </div>
        </div>
      )}

      {/* 4. MATCH FOUND & 3-2-1 COUNTDOWN */}
      {(battleState === 'match_found' || battleState === 'countdown') && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-8 text-center shadow-sm space-y-8 animate-in zoom-in-95">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>OPPONENT FOUND! GET READY</span>
          </div>

          {/* VS Card Display */}
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
              <span className="text-[10px] text-[#7A7468]">
                {currentUser.schoolName ? currentUser.schoolName.split(',')[0] : 'Class ' + classLevel}
              </span>
            </div>

            {/* VS Badge / Countdown */}
            <div className="flex flex-col items-center justify-center">
              {battleState === 'countdown' ? (
                <div className="w-16 h-16 rounded-full bg-amber-500 text-white font-mono font-black text-3xl flex items-center justify-center shadow-xl animate-bounce">
                  {countdownNum}
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#F5F2ED] border-2 border-[#E5E0D8] text-[#5A634E] font-black text-xl flex items-center justify-center shadow-inner">
                  VS
                </div>
              )}
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
            5 Questions • 15 Seconds per Round • Speed Bonus Points
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
                    timerSeconds <= 5 ? 'text-rose-600 animate-pulse' : 'text-[#4A4A3A]'
                  }`}
                >
                  {timerSeconds}s
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
                  timerSeconds <= 5 ? 'bg-rose-500' : timerSeconds <= 9 ? 'bg-amber-500' : 'bg-[#5A634E]'
                }`}
                style={{ width: `${(timerSeconds / 15) * 100}%` }}
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
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {currentQ.difficulty} PYQ
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-[#2A2A22] leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Option Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isPlayerChoice = playerSelectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const showFeedback = battleState === 'round_feedback';

                let btnStyles = 'border-[#E5E0D8] bg-[#FDFBF7] hover:bg-[#F5F2ED] text-[#4A4A3A]';

                if (showFeedback) {
                  if (isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 font-bold';
                  } else if (isPlayerChoice && !isCorrect) {
                    btnStyles = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400 font-bold';
                  } else {
                    btnStyles = 'border-[#E5E0D8] bg-[#FDFBF7] opacity-60 text-[#7A7468]';
                  }
                } else if (isPlayerChoice) {
                  btnStyles = 'border-[#5A634E] bg-[#5A634E]/10 ring-2 ring-[#5A634E] text-[#2A2A22] font-bold';
                }

                return (
                  <button
                    key={idx}
                    disabled={playerSelectedOption !== null || showFeedback}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${btnStyles}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm flex-1 leading-relaxed">{opt}</span>

                    {/* Status icons during feedback */}
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

            {/* Feedback explanation box if round ended */}
            {battleState === 'round_feedback' && (
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
            )}
          </div>
        </div>
      )}

      {/* 6. BATTLE FINISHED - RESULT & ELO REWARD SCREEN */}
      {battleState === 'finished' && (
        <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-10 shadow-lg text-center space-y-8 animate-in zoom-in-95">
          {/* Victory / Defeat Header */}
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

            {/* ELO Delta Banner */}
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

          {/* Final Head-to-Head Comparison */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto bg-[#FDFBF7] p-5 rounded-2xl border border-[#E5E0D8]">
            {/* Player */}
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

            {/* Opponent */}
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
              <span>Play Another 1v1 Match</span>
            </button>

            {onNavigateToMistakes && (
              <button
                onClick={onNavigateToMistakes}
                className="px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Open AI Mistake Notebook</span>
              </button>
            )}

            <button
              onClick={() => setBattleState('lobby')}
              className="px-6 py-3 rounded-2xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] border border-[#E5E0D8] font-bold text-xs sm:text-sm transition"
            >
              Back to Battle Arena Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
