import React from 'react';
import {
  X,
  Calendar,
  Building2,
  ShoppingBag,
  CreditCard,
  Edit3,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Flame,
  Zap,
  BookOpen,
  FileText,
  Brain,
  Download,
  CheckCircle2,
  MessageSquare,
  Bookmark,
  Swords,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { User, UserRole } from '../types';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  classLevel: number;
  stream?: string;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenEditProfile: () => void;
  onOpenRoleSwitcher: () => void;
  onOpenAuth: (mode?: 'login' | 'signup' | 'account') => void;
  onOpenInstallModal: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  currentUser,
  classLevel,
  stream,
  activeTab,
  onNavigateTab,
  onOpenEditProfile,
  onOpenRoleSwitcher,
  onOpenAuth,
  onOpenInstallModal,
}) => {
  if (!isOpen) return null;

  const handleSelectTab = (tab: string) => {
    onNavigateTab(tab);
    onClose();
  };

  const studentFeatures = [
    {
      id: 'battles',
      title: 'Live 1v1 PYQ Battles',
      desc: 'Real-time quiz duels, 15s timers & ELO rating',
      icon: Swords,
      color: 'bg-amber-50 text-amber-800 border-amber-300',
      badge: 'Live 1v1',
    },
    {
      id: 'mistakes',
      title: 'AI Mistake Notebook',
      desc: 'Weakness vault & spaced repetition re-testing',
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      badge: 'Vault',
    },
    {
      id: 'exam-sim',
      title: 'NTA CBT Exam Simulator',
      desc: 'Full-screen mock test, question palette & -1 marking',
      icon: Award,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badge: 'CBT Mock',
    },
    {
      id: 'planner',
      title: 'Study Planner & Alarms',
      desc: 'Audio chimes, timetable & Pomodoro',
      icon: Calendar,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: 'Alarms',
    },
    {
      id: 'tuition',
      title: 'Tuition & Coaching Finder',
      desc: 'Local tutors, online batches & verified centers',
      icon: Building2,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'Nearby',
    },
    {
      id: 'marketplace',
      title: 'Used Books & Topper Notes',
      desc: 'Buy, sell & peer tutoring marketplace',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: '15% Fee',
    },
    {
      id: 'payments',
      title: 'UPI & Fee Gateway',
      desc: 'Instant QR payments, settlements & fee receipts',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: '0% UPI',
    },
    {
      id: 'materials',
      title: 'Study Notes & Quiz Arena',
      desc: 'Class 6–12 board test banks & formulas',
      icon: FileText,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      badge: '4 Subs',
    },
    {
      id: 'ai-assistant',
      title: 'AI Doubt Solver',
      desc: 'Instant step-by-step NCERT explanations',
      icon: Brain,
      color: 'bg-emerald-50 text-[#5A634E] border-[#D8DFD2]',
      badge: '24/7 AI',
    },
    {
      id: 'discussions',
      title: 'Peer Q&A Community',
      desc: 'Ask doubts, solve questions, earn XP',
      icon: MessageSquare,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: '+30 XP',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-up sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#FDFBF7] border-t border-[#E5E0D8] rounded-t-[32px] shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200">
        {/* Pull handle & header */}
        <div className="p-4 pb-2 border-b border-[#E5E0D8] relative">
          <div className="w-12 h-1.5 bg-[#D8D2C6] rounded-full mx-auto mb-3" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-2xl object-cover border border-[#E5E0D8]"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">
                    {currentUser.name}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] uppercase">
                    Class {classLevel}
                  </span>
                </div>
                <div className="text-[11px] text-[#7A7468] flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[#AF601A] font-bold">
                    <Flame className="w-3 h-3 fill-[#AF601A]" />
                    {currentUser.streakDays}d Streak
                  </span>
                  <span>•</span>
                  <span className="text-[#1D8348] font-bold">
                    {currentUser.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable sheet body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-10">
          {/* Quick Shortcuts Grid */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#8B8374] px-1 mb-2">
              All Learning & Community Modules
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {studentFeatures.map((feat) => {
                const Icon = feat.icon;
                const isCurrent = activeTab === feat.id;
                return (
                  <button
                    key={feat.id}
                    onClick={() => handleSelectTab(feat.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#EDF0E9] border-[#5A634E] shadow-xs'
                        : 'bg-white border-[#E5E0D8] hover:bg-[#F5F2ED]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${feat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#4A4A3A] flex items-center gap-1.5">
                          <span>{feat.title}</span>
                          {feat.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                              {feat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#8B8374] leading-snug">{feat.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8B8374] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account, Profile & App Settings */}
          <div className="pt-2 border-t border-[#E5E0D8]/80">
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#8B8374] px-1 mb-2">
              Profile & App Settings
            </div>

            <div className="space-y-1.5">
              {/* Edit Profile */}
              <button
                onClick={() => {
                  onClose();
                  onOpenEditProfile();
                }}
                className="w-full p-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#F5F2ED] text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2] flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#4A4A3A]">Customize Student Profile</div>
                    <div className="text-[10px] text-[#8B8374]">Change Avatar, Grade, School & City</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8374]" />
              </button>

              {/* Switch Role */}
              <button
                onClick={() => {
                  onClose();
                  onOpenRoleSwitcher();
                }}
                className="w-full p-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#F5F2ED] text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FDEBD0] text-[#AF601A] border border-[#FAD7A0] flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#4A4A3A]">Switch App Role</div>
                    <div className="text-[10px] text-[#8B8374]">Student, Bookstore Seller, Tutor, Admin</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468]">
                  Current: {currentUser.role}
                </span>
              </button>

              {/* Install Android App / APK */}
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#5A634E]/10 to-[#5A634E]/5 border border-[#5A634E]/30 hover:bg-[#5A634E]/15 text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5A634E] text-white flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5A634E] flex items-center gap-1.5">
                      <span>Install Android App (APK / PWA)</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
                        Fast
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7A7468]">Full-screen mode & offline study access</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-[#5A634E]" />
              </button>

              {/* Account Security */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth('account');
                }}
                className="w-full p-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#F5F2ED] text-left transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#4A4A3A]">Account & Security</div>
                    <div className="text-[10px] text-[#8B8374]">Passwords, Passkeys & Session info</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B8374]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
