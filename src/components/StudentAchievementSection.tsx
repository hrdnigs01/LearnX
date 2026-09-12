import React, { useState } from 'react';
import {
  Award,
  Flame,
  Zap,
  Sparkles,
  Trophy,
  Star,
  BookOpen,
  Target,
  Crown,
  ChevronRight,
  CheckCircle2,
  Lock,
  TrendingUp,
  Info,
  Shield,
  Medal,
} from 'lucide-react';
import { User, Badge, LeaderboardUser } from '../types';

interface StudentAchievementSectionProps {
  currentUser: User;
  classLevel: number;
  leaderboard: LeaderboardUser[];
  onNavigateTab: (tab: string) => void;
}

// Comprehensive list of available badges for gamification
const ALL_SYSTEM_BADGES = [
  {
    id: 'b1',
    title: 'First Step',
    description: 'Completed your first NCERT chapter quiz',
    icon: 'Award',
    category: 'Quiz',
    xpReward: 50,
  },
  {
    id: 'b2',
    title: 'Week Warrior',
    description: 'Maintained a consistent 7-day study streak',
    icon: 'Flame',
    category: 'Consistency',
    xpReward: 100,
  },
  {
    id: 'b3',
    title: 'Maths Wizard',
    description: 'Scored 100% on Class 10/11 Mathematics tests',
    icon: 'Zap',
    category: 'Mastery',
    xpReward: 150,
  },
  {
    id: 'b4',
    title: 'Quiz Ace',
    description: 'Scored a perfect 100% on any subject examination',
    icon: 'Sparkles',
    category: 'Excellence',
    xpReward: 100,
  },
  {
    id: 'b5',
    title: 'Science Pioneer',
    description: 'Mastered Class 10 Science / Class 11 Physics modules',
    icon: 'Target',
    category: 'Mastery',
    xpReward: 120,
  },
  {
    id: 'b6',
    title: 'Formula Master',
    description: 'Practiced 20+ equations, formulas and journal entries',
    icon: 'Star',
    category: 'Practice',
    xpReward: 80,
  },
  {
    id: 'b7',
    title: 'Top 10 Scholar',
    description: 'Ranked among the Top 10 students across the platform',
    icon: 'Trophy',
    category: 'Competitive',
    xpReward: 200,
  },
  {
    id: 'b8',
    title: 'Planner Champion',
    description: 'Completed 5 scheduled revision sessions in Study Planner',
    icon: 'BookOpen',
    category: 'Discipline',
    xpReward: 75,
  },
];

// Helper to render badge icon dynamically
const renderBadgeIcon = (iconName: string, className: string = 'w-5 h-5') => {
  switch (iconName.toLowerCase()) {
    case 'flame':
      return <Flame className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'bookopen':
    case 'book-open':
      return <BookOpen className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'crown':
      return <Crown className={className} />;
    default:
      return <Award className={className} />;
  }
};

export const StudentAchievementSection: React.FC<StudentAchievementSectionProps> = ({
  currentUser,
  classLevel,
  leaderboard,
  onNavigateTab,
}) => {
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'earned' | 'locked'>('earned');
  const [selectedBadge, setSelectedBadge] = useState<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    isUnlocked: boolean;
    xpReward?: number;
    category?: string;
  } | null>(null);

  // Level & XP Math (Each level is 400 XP)
  const currentXp = currentUser.xp || 0;
  const currentLevel = currentUser.level || Math.floor(currentXp / 400) + 1;
  const levelFloorXp = (currentLevel - 1) * 400;
  const nextLevelXp = currentLevel * 400;
  const xpIntoCurrentLevel = Math.max(0, currentXp - levelFloorXp);
  const xpNeededForNext = Math.max(0, nextLevelXp - currentXp);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpIntoCurrentLevel / 400) * 100)));

  // Earned badges map
  const userBadges = currentUser.badges || [];
  const earnedBadgeIds = new Set(userBadges.map((b) => b.id));

  // Merge system badges with user earned state
  const mergedBadges = ALL_SYSTEM_BADGES.map((sys) => {
    const earned = userBadges.find((b) => b.id === sys.id || b.title.toLowerCase() === sys.title.toLowerCase());
    return {
      ...sys,
      isUnlocked: !!earned,
      unlockedAt: earned ? earned.unlockedAt : undefined,
    };
  });

  // Also include any custom badges from user.badges that might not be in ALL_SYSTEM_BADGES
  userBadges.forEach((ub) => {
    if (!mergedBadges.some((mb) => mb.id === ub.id || mb.title.toLowerCase() === ub.title.toLowerCase())) {
      mergedBadges.unshift({
        id: ub.id,
        title: ub.title,
        description: ub.description,
        icon: ub.icon || 'Award',
        category: 'Achievement',
        xpReward: 100,
        isUnlocked: true,
        unlockedAt: ub.unlockedAt,
      });
    }
  });

  const earnedCount = mergedBadges.filter((b) => b.isUnlocked).length;
  const totalBadgesCount = mergedBadges.length;

  const displayedBadges = mergedBadges.filter((b) => {
    if (badgeFilter === 'earned') return b.isUnlocked;
    if (badgeFilter === 'locked') return !b.isUnlocked;
    return true;
  });

  // Top 10 Leaderboard resolution
  // If leaderboard from props has items, ensure it's sorted by XP descending and contains top 10
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);

  // Ensure current user is in the ranking comparison
  const currentUserRankIndex = sortedLeaderboard.findIndex((u) => u.id === currentUser.id);
  const currentUserRank = currentUserRankIndex !== -1 ? currentUserRankIndex + 1 : null;

  // Take exactly the top 10 students
  const top10Students = sortedLeaderboard.slice(0, 10).map((u, i) => ({
    ...u,
    rank: i + 1,
  }));

  const isUserInTop10 = currentUserRank !== null && currentUserRank <= 10;
  const top10ThresholdXp = top10Students[top10Students.length - 1]?.xp || 1000;
  const xpToCrackTop10 = Math.max(0, top10ThresholdXp - currentXp + 20);

  return (
    <section
      id="student-achievement-section"
      className="rounded-[32px] bg-white border border-[#E5E0D8] p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EBE7DF]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
              <Trophy className="w-4 h-4 text-[#5A634E]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A] tracking-tight">
              Student Achievement
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#5A634E]/20">
              Class {classLevel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#7A7468]">
            Track your XP progression towards scholar ranks, unlock academic badges, and climb the Top 10 Leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('learning')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] border border-[#E5E0D8] transition active:scale-98"
            title="Earn XP by taking chapter quizzes"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Earn XP in Quizzes</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Side (XP Bar & Badges) | Right Side (Top 10 Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: XP Progress & Badges (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. VISUAL PROGRESS BAR FOR STUDENT'S XP */}
          <div
            id="student-xp-progress-card"
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#F7F5F0] to-[#EFECE5] border border-[#E5E0D8] shadow-2xs space-y-4"
          >
            {/* Level & Rank Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5A634E] text-white flex flex-col items-center justify-center font-bold shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium">Lv.</span>
                  <span className="text-lg leading-tight font-serif">{currentLevel}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
                      {currentLevel >= 6
                        ? 'Grandmaster Scholar'
                        : currentLevel >= 4
                        ? 'Advanced Scholar'
                        : currentLevel >= 2
                        ? 'Active Learner'
                        : 'Novice Student'}
                    </h3>
                    <span className="text-[11px] font-bold text-[#5A634E] bg-[#EDF0E9] px-2 py-0.5 rounded-full border border-[#5A634E]/20">
                      Tier {Math.min(5, Math.ceil(currentLevel / 2))}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A7468]">
                    {xpNeededForNext > 0
                      ? `${xpNeededForNext} XP needed to reach Level ${currentLevel + 1}`
                      : `Max level reached for current tier!`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl sm:text-2xl font-black text-[#5A634E] tracking-tight">
                  {currentXp.toLocaleString()} <span className="text-xs font-bold text-[#7A7468]">XP</span>
                </div>
                <div className="text-[11px] text-[#8B8374]">
                  Target: {nextLevelXp.toLocaleString()} XP
                </div>
              </div>
            </div>

            {/* The Visual Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[#4A4A3A]">
                <span className="flex items-center gap-1.5 text-[#5A634E]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Level {currentLevel} Progress ({xpIntoCurrentLevel} / 400 XP)
                </span>
                <span className="font-bold text-[#5A634E] bg-white px-2 py-0.5 rounded-full border border-[#E5E0D8] shadow-2xs">
                  {progressPercent}% Complete
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="relative w-full h-4 rounded-full bg-[#E5E0D8] overflow-hidden p-0.5 shadow-inner">
                <div
                  id="xp-visual-progress-fill"
                  className="h-full rounded-full bg-gradient-to-r from-[#5A634E] via-[#707B63] to-[#A2AC93] transition-all duration-700 ease-out shadow-xs relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Subtle shine highlight */}
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse opacity-60" />
                </div>
              </div>

              {/* Milestone Ticks */}
              <div className="grid grid-cols-4 text-[10px] text-[#8B8374] font-medium pt-0.5 px-0.5">
                <div className="text-left">Lv.{currentLevel} Start</div>
                <div className="text-center">25% (100 XP)</div>
                <div className="text-center">50% (200 XP)</div>
                <div className="text-right">Lv.{currentLevel + 1} Target</div>
              </div>
            </div>

            {/* Secondary XP Boosters & Daily Streak Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#E5E0D8]/80 text-xs">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D8] text-center">
                <span className="text-[10px] text-[#8B8374] block font-medium">Daily Streak</span>
                <span className="font-bold text-[#AF601A] flex items-center justify-center gap-1 text-sm mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-[#AF601A]" />
                  {currentUser.streakDays} Days
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D8] text-center">
                <span className="text-[10px] text-[#8B8374] block font-medium">XP Multiplier</span>
                <span className="font-bold text-[#5A634E] flex items-center justify-center gap-1 text-sm mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  {currentUser.streakDays >= 7 ? '1.5x Boost' : '1.2x Boost'}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#E5E0D8] text-center">
                <span className="text-[10px] text-[#8B8374] block font-medium">Rank Standing</span>
                <span className="font-bold text-[#4A4A3A] flex items-center justify-center gap-1 text-sm mt-0.5">
                  <Medal className="w-3.5 h-3.5 text-amber-600" />
                  {currentUserRank ? `#${currentUserRank}` : 'Unranked'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. LIST OF EARNED BADGES */}
          <div id="student-badges-container" className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#AF601A]" />
                <h3 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A]">
                  Earned Badges & Honors
                </h3>
                <span className="text-xs font-bold text-[#5A634E] bg-[#EDF0E9] px-2 py-0.5 rounded-full">
                  {earnedCount} / {totalBadgesCount}
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center p-0.5 rounded-xl bg-[#F5F2ED] border border-[#E5E0D8] text-xs">
                <button
                  onClick={() => setBadgeFilter('earned')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    badgeFilter === 'earned'
                      ? 'bg-white text-[#4A4A3A] shadow-2xs'
                      : 'text-[#8B8374] hover:text-[#4A4A3A]'
                  }`}
                >
                  Earned ({earnedCount})
                </button>
                <button
                  onClick={() => setBadgeFilter('locked')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    badgeFilter === 'locked'
                      ? 'bg-white text-[#4A4A3A] shadow-2xs'
                      : 'text-[#8B8374] hover:text-[#4A4A3A]'
                  }`}
                >
                  Upcoming ({totalBadgesCount - earnedCount})
                </button>
                <button
                  onClick={() => setBadgeFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    badgeFilter === 'all'
                      ? 'bg-white text-[#4A4A3A] shadow-2xs'
                      : 'text-[#8B8374] hover:text-[#4A4A3A]'
                  }`}
                >
                  All ({totalBadgesCount})
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayedBadges.length === 0 ? (
                <div className="col-span-full py-8 text-center rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-xs text-[#8B8374]">
                  No badges found in this category. Complete quizzes to earn your next badge!
                </div>
              ) : (
                displayedBadges.map((badge) => {
                  const isUnlocked = badge.isUnlocked;
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`p-3.5 rounded-2xl border transition text-left cursor-pointer flex items-start gap-3 relative group ${
                        isUnlocked
                          ? 'bg-white border-[#E5E0D8] hover:border-[#5A634E]/60 hover:shadow-sm'
                          : 'bg-[#FAF8F5] border-[#E5E0D8]/60 opacity-70 hover:opacity-100 hover:border-[#E5E0D8]'
                      }`}
                    >
                      {/* Badge Icon Shield */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-[#FDEBD0] to-[#FAD7A0] text-[#AF601A] border border-[#FAD7A0]'
                            : 'bg-[#E5E0D8] text-[#8B8374] border border-[#D5D0C8]'
                        }`}
                      >
                        {isUnlocked ? (
                          renderBadgeIcon(badge.icon, 'w-5 h-5')
                        ) : (
                          <Lock className="w-4 h-4 text-[#8B8374]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-[#4A4A3A] truncate">
                            {badge.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-[#5A634E] bg-[#EDF0E9] px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-[#5A634E]" />
                              Earned
                            </span>
                          ) : (
                            <span className="flex-shrink-0 text-[10px] font-medium text-[#8B8374] bg-[#F0ECE4] px-1.5 py-0.5 rounded-full">
                              +{badge.xpReward} XP
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#7A7468] line-clamp-2 mt-0.5 leading-snug">
                          {badge.description}
                        </p>

                        {isUnlocked && badge.unlockedAt && (
                          <div className="text-[10px] text-[#8B8374] mt-1.5 flex items-center gap-1">
                            <span>Unlocked {badge.unlockedAt}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: TOP 10 STUDENTS MINI-LEADERBOARD WIDGET (5 cols on desktop) */}
        <div className="lg:col-span-5">
          <div
            id="top-10-students-widget"
            className="rounded-3xl bg-[#FAF8F5] border border-[#E5E0D8] p-5 sm:p-6 space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#FDEBD0] text-[#AF601A] flex items-center justify-center font-bold text-xs">
                  🏆
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#4A4A3A] flex items-center gap-1.5">
                    <span>Top 10 Students</span>
                  </h3>
                  <span className="text-[10px] text-[#8B8374] block">
                    Class {classLevel} Leaderboard • Weekly XP
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('learning')}
                className="text-xs text-[#5A634E] hover:underline font-bold flex items-center gap-0.5"
                title="View full rank standings"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 10 Students */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {top10Students.map((user) => {
                const isCurrent = user.id === currentUser.id;
                const isPodium = user.rank <= 3;

                return (
                  <div
                    key={user.id}
                    className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-2.5 transition border ${
                      isCurrent
                        ? 'bg-[#EDF0E9] border-[#5A634E] ring-1 ring-[#5A634E]/30 shadow-2xs'
                        : isPodium
                        ? 'bg-white border-[#E5E0D8] hover:border-[#D5D0C8]'
                        : 'bg-white/80 border-[#EFECE5] hover:bg-white'
                    }`}
                  >
                    {/* Left: Rank & Avatar & Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Rank Badge */}
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                          user.rank === 1
                            ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 shadow-2xs'
                            : user.rank === 2
                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 shadow-2xs'
                            : user.rank === 3
                            ? 'bg-gradient-to-br from-orange-200 to-amber-600 text-white shadow-2xs'
                            : 'bg-[#F0ECE4] text-[#7A7468] text-[11px]'
                        }`}
                      >
                        {user.rank === 1 ? '1' : user.rank === 2 ? '2' : user.rank === 3 ? '3' : user.rank}
                      </span>

                      {/* Avatar */}
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-8 h-8 rounded-full object-cover flex-shrink-0 border ${
                          isPodium ? 'border-amber-400/50' : 'border-[#E5E0D8]'
                        }`}
                        onError={(e) => {
                          // Fallback avatar initial
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=5A634E&color=fff`;
                        }}
                      />

                      {/* Name & Streak */}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#4A4A3A] truncate flex items-center gap-1.5">
                          <span className="truncate">{user.name}</span>
                          {isCurrent && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#5A634E] text-white flex-shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8B8374] flex items-center gap-2">
                          <span className="flex items-center gap-0.5 text-amber-700 font-medium">
                            <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />
                            {user.streakDays}d streak
                          </span>
                          <span>• Cl.{user.classLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: XP */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-[#5A634E]">
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-[#8B8374]">
                        XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout for Current User if outside top 10 */}
            {!isUserInTop10 && currentUserRank && (
              <div className="mt-3 p-3 rounded-2xl bg-[#EDF0E9] border border-[#5A634E]/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#5A634E] text-white flex items-center justify-center font-bold text-[10px]">
                    #{currentUserRank}
                  </span>
                  <div>
                    <span className="font-bold text-[#4A4A3A] block">Your Platform Standing</span>
                    <span className="text-[11px] text-[#7A7468]">
                      {xpToCrackTop10 > 0 ? `${xpToCrackTop10} XP to crack Top 10!` : 'Almost there!'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#5A634E] text-xs">{currentXp} XP</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white border border-[#E5E0D8] p-6 shadow-xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <div
                className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-sm ${
                  selectedBadge.isUnlocked
                    ? 'bg-gradient-to-br from-[#FDEBD0] to-[#FAD7A0] text-[#AF601A] border border-[#FAD7A0]'
                    : 'bg-[#F0ECE4] text-[#8B8374] border border-[#E5E0D8]'
                }`}
              >
                {selectedBadge.isUnlocked ? (
                  renderBadgeIcon(selectedBadge.icon, 'w-8 h-8')
                ) : (
                  <Lock className="w-7 h-7 text-[#8B8374]" />
                )}
              </div>

              <div>
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${
                    selectedBadge.isUnlocked
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedBadge.isUnlocked ? 'Honor Unlocked' : 'Upcoming Badge'}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-[#7A7468] mt-1 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs space-y-1">
                <div className="flex justify-between text-[#7A7468]">
                  <span>Category</span>
                  <span className="font-semibold text-[#4A4A3A]">{selectedBadge.category || 'Curriculum'}</span>
                </div>
                <div className="flex justify-between text-[#7A7468]">
                  <span>XP Reward</span>
                  <span className="font-bold text-[#5A634E]">+{selectedBadge.xpReward || 100} XP</span>
                </div>
                {selectedBadge.unlockedAt && (
                  <div className="flex justify-between text-[#7A7468]">
                    <span>Unlocked On</span>
                    <span className="font-medium text-[#4A4A3A]">{selectedBadge.unlockedAt}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-[#5A634E] hover:bg-[#4d5542] text-white font-bold text-xs transition active:scale-98 shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
