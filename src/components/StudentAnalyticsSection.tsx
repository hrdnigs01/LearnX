import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Zap,
  HelpCircle,
  BarChart3,
  Award,
  Sparkles,
  Flame,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { StudentPerformanceAnalytics, RecommendedRevisionItem, User } from '../types';
import { safeFetchJson } from '../utils/api';
import { playChime } from '../utils/audio';

interface StudentAnalyticsSectionProps {
  currentUser: User;
  onNavigateChapter?: (chapterNumber: number, subjectName?: string, tab?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudentAnalyticsSection: React.FC<StudentAnalyticsSectionProps> = ({
  currentUser,
  onNavigateChapter,
  onNavigateTab,
}) => {
  const [analytics, setAnalytics] = useState<StudentPerformanceAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await safeFetchJson<{ success: boolean; analytics: StudentPerformanceAnalytics }>(
        '/api/student/analytics'
      );
      if (data?.success) {
        setAnalytics(data.analytics);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleAction = (item: RecommendedRevisionItem) => {
    playChime('click');
    if (onNavigateChapter) {
      const tab = item.recommendedAction === 'take_quiz' ? 'mcq' : item.recommendedAction === 'review_notes' ? 'notes' : 'concepts';
      onNavigateChapter(item.chapterNumber, item.subjectName, tab);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] text-center text-xs text-[#8A8274] shadow-xs">
        Analyzing test performance and generating revision insights...
      </div>
    );
  }

  if (!analytics) return null;

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    Excellent: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Good: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Needs Attention': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Weak Area & Performance Insights
            </h2>
            <p className="text-xs text-[#7A7468]">
              Automated diagnostic analytics & high-yield revision recommendations
            </p>
          </div>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F5F2ED] text-xs font-semibold text-[#6B665C] transition self-start sm:self-auto"
          title="Refresh analytics data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Insights</span>
        </button>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#7A7468]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Accuracy</span>
            <Target className="w-4 h-4 text-[#5A634E]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#4A4A3A]">
            {analytics.overallAccuracy}%
          </div>
          <div className="w-full bg-[#E5E0D8] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analytics.overallAccuracy >= 75 ? 'bg-emerald-600' : analytics.overallAccuracy >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${analytics.overallAccuracy}%` }}
            />
          </div>
        </div>

        {/* Quizzes Taken */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#7A7468]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Tests Attempted</span>
            <HelpCircle className="w-4 h-4 text-[#5A634E]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#4A4A3A]">
            {analytics.totalQuizzesTaken}
          </div>
          <div className="text-[11px] text-[#8C8476]">
            {analytics.totalCorrect} correct of {analytics.totalQuestionsAnswered} MCQs
          </div>
        </div>

        {/* Study Discipline */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#7A7468]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#4A4A3A]">
            {analytics.streakDays} Days 🔥
          </div>
          <div className="text-[11px] text-[#8C8476]">
            Level {analytics.level} Scholar
          </div>
        </div>

        {/* Earned XP */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-[#7A7468]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Academic XP</span>
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#4A4A3A]">
            {analytics.xp} XP
          </div>
          <div className="text-[11px] text-[#8C8476]">
            Top 10% on weekly board
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Breakdown & Recommended Revisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Subject-wise Accuracy (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">
              Subject-Wise Accuracy
            </h3>
            <span className="text-[10px] font-semibold text-[#8C8476] uppercase">Diagnostic</span>
          </div>

          <div className="space-y-3.5">
            {analytics.subjectMetrics.map((sm) => {
              const tierInfo = tierColors[sm.tier] || tierColors.Good;
              return (
                <div key={sm.subjectId} className="space-y-1.5 p-3 rounded-2xl bg-[#FDFBF7] border border-[#EBE6DC]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A4A3A]">{sm.subjectName}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`}>
                        {sm.tier}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#4A4A3A]">
                        {sm.accuracyPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#E5E0D8] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sm.accuracyPercentage >= 80 ? 'bg-emerald-600' : sm.accuracyPercentage >= 60 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${sm.accuracyPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#8C8476] pt-0.5">
                    <span>{sm.correctCount} correct • {sm.incorrectCount} reviewable</span>
                    <span>{sm.totalQuestionsAttempted} questions</span>
                  </div>

                  {sm.weakSubtopics.length > 0 && (
                    <div className="text-[10px] text-[#AF601A] bg-amber-50/70 px-2 py-1 rounded-lg border border-amber-200/50 mt-1">
                      <span className="font-bold">Key Focus: </span>
                      <span>{sm.weakSubtopics.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Recommended Revision Topics based on test history (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">
                Recommended Revision Topics
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#5A634E] uppercase tracking-wider">
              High-Yield Target
            </span>
          </div>

          <div className="space-y-2.5">
            {analytics.recommendedRevisions.map((rec) => {
              const isHigh = rec.urgency === 'high';
              const isMed = rec.urgency === 'medium';

              return (
                <div
                  key={rec.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isHigh
                      ? 'bg-[#FFF8F5] border-[#F8D7DA]'
                      : isMed
                      ? 'bg-[#FFFDF5] border-[#FCEECB]'
                      : 'bg-[#F9FBF8] border-[#DCE8D5]'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isHigh
                            ? 'bg-red-100 text-red-700'
                            : isMed
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rec.urgency} Urgency
                      </span>
                      <span className="text-[11px] font-bold text-[#5A634E]">
                        {rec.subjectName} • Ch {rec.chapterNumber}
                      </span>
                      <span className="text-[11px] text-[#8C8476]">
                        {rec.accuracy}% past score
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#4A4A3A] font-serif">
                      {rec.subtopic}
                    </h4>
                    <p className="text-[11px] text-[#7A7468] italic">
                      {rec.reason}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAction(rec)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-2xs flex-shrink-0 self-start sm:self-auto"
                  >
                    <span>
                      {rec.recommendedAction === 'take_quiz'
                        ? 'Practice MCQs'
                        : rec.recommendedAction === 'review_notes'
                        ? 'Review Notes'
                        : 'Study Formulas'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
