import React, { useState, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Brain,
  Calendar,
  Building2,
  ShoppingBag,
  CreditCard,
  Shield,
  Search,
  Sparkles,
  Award,
  Store,
  Briefcase,
  UserCheck,
  FileText,
  Grid,
  Menu,
  RefreshCw,
  MessageSquare,
  Bookmark,
  Swords,
  AlertTriangle,
  User as UserIcon,
} from 'lucide-react';
import {
  User,
  Subject,
  Chapter,
  PlannerTask,
  TuitionProfile,
  AdmissionRequest,
  MarketplaceItem,
  PaymentTransaction,
  NotificationItem,
  LeaderboardUser,
  UserRole,
  SubjectMaterialType,
  StudyAlarm,
} from './types';
import { Header } from './components/Header';
import { SearchModal } from './components/SearchModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AuthModal } from './components/AuthModal';
import { RoleOnboardingModal } from './components/RoleOnboardingModal';
import { HomeDashboard } from './components/HomeDashboard';
import { LearningView } from './components/LearningView';
import { StudyMaterialView } from './components/StudyMaterialView';
import { AiAssistantView } from './components/AiAssistantView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { TuitionFinderView } from './components/TuitionFinderView';
import { MarketplaceView } from './components/MarketplaceView';
import { PaymentsView } from './components/PaymentsView';
import { SellerDashboardView } from './components/SellerDashboardView';
import { ServiceProviderDashboardView } from './components/ServiceProviderDashboardView';
import { AdminPanelView } from './components/AdminPanelView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ActiveAlarmModal } from './components/ActiveAlarmModal';
import { MobileMoreSheet } from './components/MobileMoreSheet';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { FloatingFeedbackButton } from './components/FloatingFeedbackButton';
import { FeedbackModal } from './components/FeedbackModal';
import { BookmarksModal } from './components/BookmarksModal';
import { DiscussionForumSection } from './components/DiscussionForumSection';
import { BattleDuelView } from './components/BattleDuelView';
import { MistakeNotebookView } from './components/MistakeNotebookView';
import { ExamSimulatorView } from './components/ExamSimulatorView';
import { WalletModal } from './components/WalletModal';
import { DualLeaderboardModal } from './components/DualLeaderboardModal';
import { safeFetchJson } from './utils/api';
import { loadSavedAlarms, saveAlarmsToStorage, shouldAlarmTrigger } from './utils/alarmStorage';
import { startAlarmLoop, stopAlarmLoop, sendAlarmBrowserNotification } from './utils/audio';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');

  // Active User Profile with Local Storage Persistence
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const defaultUser: User = {
      id: 'user_student_1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@learnx.in',
      role: 'student',
      classLevel: 10,
      stream: 'Science',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
      schoolName: 'Delhi Public School, R.K. Puram',
      city: 'New Delhi',
      locality: 'Vasant Kunj',
      xp: 1420,
      streakDays: 7,
      level: 4,
      badges: [],
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: '2026-01-01',
      isRoleSelected: true,
    };
    try {
      const saved = localStorage.getItem('learnx_active_user_data') || localStorage.getItem('learnx_profile_user_student_1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return { ...defaultUser, ...parsed };
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return defaultUser;
  });

  const [classLevel, setClassLevel] = useState<number>(() => currentUser.classLevel || 10);
  const [stream, setStream] = useState<string>(() => currentUser.stream || 'Science');

  // App Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [tuitions, setTuitions] = useState<TuitionProfile[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Selection states for cross-view deep linking
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [pendingAdmissionForPayment, setPendingAdmissionForPayment] = useState<AdmissionRequest | null>(null);
  const [pendingMarketplaceItemForPayment, setPendingMarketplaceItemForPayment] = useState<MarketplaceItem | null>(null);
  const [materialInitialChapter, setMaterialInitialChapter] = useState<number | undefined>(undefined);
  const [materialInitialSubject, setMaterialInitialSubject] = useState<SubjectMaterialType | undefined>(undefined);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'account'>('login');
  const [isRoleOnboardingOpen, setIsRoleOnboardingOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isAndroidInstallModalOpen, setIsAndroidInstallModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalTab, setWalletModalTab] = useState<'deposit' | 'redeem' | 'history'>('deposit');
  const [isDualLeaderboardOpen, setIsDualLeaderboardOpen] = useState(false);
  const [leaderboardCategory, setLeaderboardCategory] = useState<'quiz' | 'xp'>('quiz');

  const handleOpenWallet = (tab: 'deposit' | 'redeem' | 'history' = 'deposit') => {
    setWalletModalTab(tab);
    setIsWalletModalOpen(true);
  };

  const handleOpenLeaderboard = (type: 'quiz' | 'xp' = 'quiz') => {
    setLeaderboardCategory(type);
    setIsDualLeaderboardOpen(true);
  };

  // Study Planner Alarms & Audio Reminders State (persisted in localStorage)
  const [studyAlarms, setStudyAlarms] = useState<StudyAlarm[]>(loadSavedAlarms);
  const [activeRingingAlarm, setActiveRingingAlarm] = useState<StudyAlarm | null>(null);

  // Background Alarm Monitoring: Runs every second to check if any scheduled alarm is due
  useEffect(() => {
    const checkAlarms = () => {
      if (activeRingingAlarm) return; // Don't interrupt if an alarm is already actively ringing
      const now = new Date();

      for (const alarm of studyAlarms) {
        if (shouldAlarmTrigger(alarm, now)) {
          const currentHour = now.getHours().toString().padStart(2, '0');
          const currentMinute = now.getMinutes().toString().padStart(2, '0');
          const dateKey = `${now.toISOString().split('T')[0]}_${currentHour}:${currentMinute}`;

          // Mark triggered for this minute so it doesn't fire multiple times in the same 60 seconds
          const updated = studyAlarms.map((a) => {
            if (a.id === alarm.id) {
              return {
                ...a,
                lastTriggeredKey: dateKey,
                isEnabled: a.repeat === 'once' ? false : a.isEnabled,
              };
            }
            return a;
          });
          setStudyAlarms(updated);
          saveAlarmsToStorage(updated);

          // Start continuous audio chime loop
          startAlarmLoop(alarm.soundType);

          // Send native browser notification
          sendAlarmBrowserNotification(alarm);

          // Display alarm modal
          setActiveRingingAlarm(alarm);
          break;
        }
      }
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [studyAlarms, activeRingingAlarm]);

  const handleStopAlarm = () => {
    stopAlarmLoop();
    setActiveRingingAlarm(null);
  };

  const handleSnoozeAlarm = (minutes: number = 5) => {
    stopAlarmLoop();
    if (!activeRingingAlarm) return;

    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const sHour = snoozeDate.getHours().toString().padStart(2, '0');
    const sMin = snoozeDate.getMinutes().toString().padStart(2, '0');
    const snoozeTimeStr = `${sHour}:${sMin}`;

    const snoozedAlarm: StudyAlarm = {
      ...activeRingingAlarm,
      id: `snooze_${Date.now()}`,
      title: `[Snoozed ${minutes}m] ${activeRingingAlarm.title}`,
      time: snoozeTimeStr,
      repeat: 'once',
      isEnabled: true,
      lastTriggeredKey: undefined,
    };

    const updated = [snoozedAlarm, ...studyAlarms];
    setStudyAlarms(updated);
    saveAlarmsToStorage(updated);
    setActiveRingingAlarm(null);
  };

  const handleUpdateAlarms = (newAlarms: StudyAlarm[]) => {
    setStudyAlarms(newAlarms);
    saveAlarmsToStorage(newAlarms);
  };

  const handleTriggerTestAlarm = (alarm: StudyAlarm) => {
    startAlarmLoop(alarm.soundType);
    sendAlarmBrowserNotification(alarm);
    setActiveRingingAlarm(alarm);
  };

  // Initial Data Fetch
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('learnx_token');
    const data = await safeFetchJson<{ success: boolean; user: User }>('/api/auth/current-user', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (data?.success && data.user) {
      let mergedUser = data.user;
      try {
        const saved = localStorage.getItem(`learnx_profile_${data.user.id}`) || localStorage.getItem('learnx_active_user_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.id === data.user.id || !parsed.id)) {
            mergedUser = { ...data.user, ...parsed };
          }
        }
      } catch (e) {}

      setCurrentUser(mergedUser);
      setClassLevel(mergedUser.classLevel || 10);
      if (mergedUser.stream) setStream(mergedUser.stream);
      if (mergedUser.isRoleSelected === false) {
        setIsRoleOnboardingOpen(true);
      }
    }
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (updatedUser.classLevel && updatedUser.classLevel !== classLevel) {
      setClassLevel(updatedUser.classLevel);
    }
    if (updatedUser.stream && updatedUser.stream !== stream) {
      setStream(updatedUser.stream);
    }
    try {
      localStorage.setItem('learnx_active_user_data', JSON.stringify(updatedUser));
      localStorage.setItem(`learnx_profile_${updatedUser.id}`, JSON.stringify(updatedUser));
    } catch (e) {}
  };

  const fetchCurriculum = async (lvl: number) => {
    const [sRes, cRes] = await Promise.all([
      safeFetchJson<{ success: boolean; subjects: Subject[] }>(`/api/curriculum/subjects?classLevel=${lvl}`),
      safeFetchJson<{ success: boolean; chapters: Chapter[] }>(`/api/curriculum/chapters?classLevel=${lvl}`),
    ]);
    if (sRes?.success && sRes.subjects) setSubjects(sRes.subjects);
    if (cRes?.success && cRes.chapters) setChapters(cRes.chapters);
  };

  const fetchSecondaryData = async () => {
    const token = localStorage.getItem('learnx_token');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const [tRes, lRes, tuRes, aRes, mRes, txRes, nRes] = await Promise.all([
      safeFetchJson<{ success: boolean; tasks: PlannerTask[] }>('/api/planner/tasks', { headers: authHeader }),
      safeFetchJson<{ success: boolean; leaderboard: LeaderboardUser[] }>('/api/learning/leaderboard'),
      safeFetchJson<{ success: boolean; tuitions: TuitionProfile[] }>('/api/tuition/all'),
      safeFetchJson<{ success: boolean; admissions: AdmissionRequest[] }>('/api/tuition/admissions/list', { headers: authHeader }),
      safeFetchJson<{ success: boolean; items: MarketplaceItem[] }>('/api/marketplace/items'),
      safeFetchJson<{ success: boolean; payments: PaymentTransaction[] }>('/api/payments/transactions', { headers: authHeader }),
      safeFetchJson<{ success: boolean; notifications: NotificationItem[] }>('/api/notifications', { headers: authHeader }),
    ]);

    if (tRes?.success && tRes.tasks) setTasks(tRes.tasks);
    if (lRes?.success && lRes.leaderboard) setLeaderboard(lRes.leaderboard);
    if (tuRes?.success && tuRes.tuitions) setTuitions(tuRes.tuitions);
    if (aRes?.success && aRes.admissions) setAdmissions(aRes.admissions);
    if (mRes?.success && mRes.items) setMarketplace(mRes.items);
    if (txRes?.success && txRes.payments) setTransactions(txRes.payments);
    if (nRes?.success && nRes.notifications) setNotifications(nRes.notifications);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchSecondaryData();
  }, []);

  const handleClassChange = (lvl: number) => {
    setClassLevel(lvl);
    setSelectedSubject(null);
    setSelectedChapter(null);
  };

  useEffect(() => {
    fetchCurriculum(classLevel);
    setSelectedSubject((prev) => (prev && prev.classLevel === classLevel ? prev : null));
    setSelectedChapter((prev) => (prev && prev.classLevel === classLevel ? prev : null));
  }, [classLevel]);

  // Auth Success Handler
  const handleAuthSuccess = (user: User, token?: string) => {
    if (token) {
      localStorage.setItem('learnx_token', token);
    }
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    if (user.isRoleSelected === false) {
      setIsRoleOnboardingOpen(true);
    } else {
      if (user.role === 'seller') {
        setActiveTab('seller');
      } else if (user.role === 'service_provider' || user.role === 'tutor' || user.role === 'centre') {
        setActiveTab('service_provider');
      } else if (user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    }
    fetchSecondaryData();
  };

  // Role Selected Handler after initial signup onboarding
  const handleRoleSelected = (newRole: UserRole) => {
    setIsRoleOnboardingOpen(false);
    setCurrentUser((prev) => ({ ...prev, role: newRole, isRoleSelected: true }));
    if (newRole === 'seller') setActiveTab('seller');
    else if (newRole === 'service_provider') setActiveTab('service_provider');
    else if (newRole === 'admin') setActiveTab('admin');
    else setActiveTab('home');
    fetchCurrentUser();
    fetchSecondaryData();
  };

  // Role switch handler
  const handleSwitchRole = async (role: UserRole) => {
    try {
      const token = localStorage.getItem('learnx_token');
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (data.token) {
          localStorage.setItem('learnx_token', data.token);
        }
        if (role === 'admin') {
          setActiveTab('admin');
        } else if (role === 'seller') {
          setActiveTab('seller');
        } else if (role === 'service_provider' || role === 'tutor' || role === 'centre') {
          setActiveTab('service_provider');
        } else {
          setActiveTab('home');
        }
        fetchSecondaryData();
      }
    } catch (err) {
      console.warn('Error switching role:', err);
    }
  };

  // Planner handlers
  const handleAddTask = async (task: Partial<PlannerTask>) => {
    const token = localStorage.getItem('learnx_token');
    const res = await fetch('/api/planner/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    if (data.success) {
      setTasks((prev) => [...prev, data.task]);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const res = await fetch(`/api/planner/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    const data = await res.json();
    if (data.success) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await fetch(`/api/planner/tasks/${taskId}`, { method: 'DELETE' });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Marketplace handlers
  const handleAddMarketplace = async (item: Partial<MarketplaceItem>) => {
    const res = await fetch('/api/marketplace/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (data.success) {
      setMarketplace((prev) => [data.item, ...prev]);
    }
  };

  const handleDeleteMarketplace = async (id: string) => {
    await fetch(`/api/marketplace/items/${id}`, { method: 'DELETE' });
    setMarketplace((prev) => prev.filter((i) => i.id !== id));
  };

  const handleMarkNotificationRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleOpenStudyMaterial = (chNum?: number, subject?: SubjectMaterialType) => {
    setMaterialInitialChapter(chNum);
    if (subject) {
      setMaterialInitialSubject(subject);
    }
    setActiveTab('materials');
  };

  // Student Navigation Items
  const studentNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learning', label: 'NCERT', icon: BookOpen },
    { id: 'materials', label: 'Study Material & Quiz', icon: FileText, badge: 'Physics + Math' },
    { id: 'discussions', label: 'Community Q&A', icon: MessageSquare, badge: 'Peer XP' },
    { id: 'ai-assistant', label: 'AI Doubt', icon: Brain, badge: 'Gemini' },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'tuition', label: 'Tuition', icon: Building2 },
    { id: 'marketplace', label: 'Books', icon: ShoppingBag },
    { id: 'payments', label: 'Pay UPI', icon: CreditCard },
  ];

  // Role checking
  const isSeller = currentUser.role === 'seller';
  const isServiceProvider =
    currentUser.role === 'service_provider' || currentUser.role === 'tutor' || currentUser.role === 'centre';
  const isAdmin = currentUser.role === 'admin';
  const isStudent = !isSeller && !isServiceProvider && !isAdmin;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A3A] flex flex-col font-sans selection:bg-[#5A634E]/20 selection:text-[#383C2F]">
      {/* Top App Header */}
      <Header
        currentUser={currentUser}
        classLevel={classLevel}
        onClassChange={handleClassChange}
        stream={stream}
        onStreamChange={(s) => setStream(s)}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenWallet={handleOpenWallet}
        onOpenLeaderboard={handleOpenLeaderboard}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'account');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Role-Specific Sub-navigation Headers */}
      {isStudent && (
        <div className="hidden md:block border-b border-[#E5E0D8] bg-[#F5F2ED]/90 sticky top-[57px] z-30 backdrop-blur-md">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-1.5">
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
                      isActive
                        ? 'bg-[#5A634E] text-white shadow-sm'
                        : 'text-[#7A7468] hover:text-[#4A4A3A] hover:bg-[#EBE7DF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#E9E4DB] text-[#5A634E]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-[#8B8374]">
              <span>Classes 6–12 • Full Screen Experience</span>
            </div>
          </div>
        </div>
      )}

      {isSeller && (
        <div className="border-b border-[#E5E0D8] bg-[#FDFBF7] sticky top-[57px] z-30 shadow-2xs">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FDEBD0] text-[#AF601A] flex items-center justify-center font-bold text-sm flex-shrink-0">
                🛍️
              </div>
              <div>
                <span className="text-xs font-serif font-bold text-[#4A4A3A]">
                  {currentUser.kycDetails?.businessName || currentUser.name} (Seller Dashboard)
                </span>
                <p className="text-[11px] text-[#7A7468]">
                  LearnX Bookstore & Depot • 15% Platform Commission Model
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setAuthModalMode('account');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-xs font-semibold text-[#4A4A3A] hover:bg-[#F5F2ED] transition shadow-xs"
              >
                Seller Account
              </button>
              <button
                onClick={() => setIsRoleSwitcherOpen(true)}
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-xl bg-[#5A634E] text-white text-xs font-semibold hover:bg-[#484F3E] transition shadow-xs"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>
      )}

      {isServiceProvider && (
        <div className="border-b border-[#E5E0D8] bg-[#FDFBF7] sticky top-[57px] z-30 shadow-2xs">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#D5F5E3] text-[#1D8348] flex items-center justify-center font-bold text-sm flex-shrink-0">
                🧑‍🏫
              </div>
              <div>
                <span className="text-xs font-serif font-bold text-[#4A4A3A]">
                  {currentUser.name} (Service Provider & Tutor Portal)
                </span>
                <p className="text-[11px] text-[#7A7468]">
                  Tutoring, PPT/Design & Project Guidance • 15% One-Time Admission Fee
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setAuthModalMode('account');
                  setIsAuthModalOpen(true);
                }}
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-xs font-semibold text-[#4A4A3A] hover:bg-[#F5F2ED] transition shadow-xs"
              >
                Provider Account
              </button>
              <button
                onClick={() => setIsRoleSwitcherOpen(true)}
                className="flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-xl bg-[#5A634E] text-white text-xs font-semibold hover:bg-[#484F3E] transition shadow-xs"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="border-b border-[#E5E0D8] bg-[#FDFBF7] sticky top-[57px] z-30 shadow-2xs">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EAECEE] text-[#2C3E50] flex items-center justify-center font-bold text-sm flex-shrink-0">
                🛡️
              </div>
              <div>
                <span className="text-xs font-serif font-bold text-[#4A4A3A]">
                  LearnX Central Administration & Finance Control
                </span>
                <p className="text-[11px] text-[#7A7468]">
                  15% Treasury Ledger, KYC Approvals, Gateway Settlements & Moderation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsRoleSwitcherOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#5A634E] text-white text-xs font-semibold hover:bg-[#484F3E] transition shadow-xs"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-none px-3 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 transition-all">
        {/* Strict Role Separation: Dedicated Dashboards */}
        {isSeller ? (
          <SellerDashboardView
            currentUser={currentUser}
            onRefreshUser={fetchCurrentUser}
            onOpenStorePreview={() => {
              setActiveTab('marketplace');
            }}
          />
        ) : isServiceProvider ? (
          <ServiceProviderDashboardView
            currentUser={currentUser}
            onRefreshUser={fetchCurrentUser}
          />
        ) : isAdmin ? (
          <AdminPanelView
            currentUser={currentUser}
            onRefreshAll={() => {
              fetchCurrentUser();
              fetchSecondaryData();
            }}
          />
        ) : (
          /* Student Views */
          <>
            {activeTab === 'home' && (
              <HomeDashboard
                currentUser={currentUser}
                classLevel={classLevel}
                onClassChange={handleClassChange}
                stream={stream}
                subjects={subjects}
                chapters={chapters}
                tasks={tasks}
                leaderboard={leaderboard}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectSubject={(sub) => {
                  setSelectedSubject(sub);
                  setActiveTab('learning');
                }}
                onSelectChapter={(ch) => {
                  setSelectedChapter(ch);
                  setActiveTab('learning');
                }}
                onOpenStudyMaterial={handleOpenStudyMaterial}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
              />
            )}

            {activeTab === 'learning' && (
              <LearningView
                currentUser={currentUser}
                classLevel={classLevel}
                onClassChange={handleClassChange}
                stream={stream}
                onStreamChange={setStream}
                subjects={subjects}
                chapters={chapters}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                selectedChapter={selectedChapter}
                onSelectChapter={setSelectedChapter}
                onRefreshUser={fetchCurrentUser}
                onOpenStudyMaterial={handleOpenStudyMaterial}
              />
            )}

            {activeTab === 'materials' && (
              <StudyMaterialView
                initialChapter={materialInitialChapter}
                initialSubject={materialInitialSubject || 'mathematics'}
                onBackToNCERT={() => setActiveTab('learning')}
                onOpenAiAssistant={(promptText) => {
                  setAiInitialPrompt(promptText);
                  setActiveTab('ai-assistant');
                }}
              />
            )}

            {(activeTab === 'discussions' || activeTab === 'community') && (
              <div className="space-y-6">
                <DiscussionForumSection
                  currentUser={currentUser}
                  classLevel={classLevel}
                  onRefreshUser={fetchCurrentUser}
                />
              </div>
            )}

            {activeTab === 'ai-assistant' && (
              <AiAssistantView
                currentUser={currentUser}
                classLevel={classLevel}
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt('')}
              />
            )}

            {activeTab === 'planner' && (
              <StudyPlannerView
                currentUser={currentUser}
                classLevel={classLevel}
                tasks={tasks}
                subjects={subjects}
                studyAlarms={studyAlarms}
                onUpdateAlarms={handleUpdateAlarms}
                onTriggerTestAlarm={handleTriggerTestAlarm}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onRefreshUser={fetchCurrentUser}
              />
            )}

            {activeTab === 'tuition' && (
              <TuitionFinderView
                currentUser={currentUser}
                classLevel={classLevel}
                tuitions={tuitions}
                admissions={admissions}
                onRefreshAdmissions={fetchSecondaryData}
                onInitiatePayment={(adm) => {
                  setPendingAdmissionForPayment(adm);
                  setActiveTab('payments');
                }}
              />
            )}

            {activeTab === 'marketplace' && (
              <MarketplaceView
                currentUser={currentUser}
                classLevel={classLevel}
                items={marketplace}
                onAddItem={handleAddMarketplace}
                onDeleteItem={handleDeleteMarketplace}
                onBuyItem={(item) => {
                  setPendingMarketplaceItemForPayment(item);
                  setActiveTab('payments');
                }}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsView
                currentUser={currentUser}
                transactions={transactions}
                pendingAdmission={pendingAdmissionForPayment}
                onClearPendingAdmission={() => setPendingAdmissionForPayment(null)}
                pendingMarketplaceItem={pendingMarketplaceItemForPayment}
                onClearPendingMarketplaceItem={() => setPendingMarketplaceItemForPayment(null)}
                onRefreshTransactions={fetchSecondaryData}
              />
            )}

            {activeTab === 'battles' && (
              <BattleDuelView
                currentUser={currentUser}
                classLevel={classLevel}
                onRefreshUser={fetchCurrentUser}
                onNavigateToMistakes={() => setActiveTab('mistakes')}
                onOpenAiAssistant={(prompt) => {
                  setAiInitialPrompt(prompt);
                  setActiveTab('ai-assistant');
                }}
                onOpenWallet={handleOpenWallet}
                onOpenLeaderboard={handleOpenLeaderboard}
              />
            )}

            {activeTab === 'mistakes' && (
              <MistakeNotebookView
                currentUser={currentUser}
                onOpenAiAssistant={(prompt) => {
                  setAiInitialPrompt(prompt);
                  setActiveTab('ai-assistant');
                }}
                onRefreshUser={fetchCurrentUser}
                onNavigateToBattle={() => setActiveTab('battles')}
                onNavigateToExam={() => setActiveTab('exam-sim')}
              />
            )}

            {activeTab === 'exam-sim' && (
              <ExamSimulatorView
                currentUser={currentUser}
                classLevel={classLevel}
                onRefreshUser={fetchCurrentUser}
                onNavigateToMistakes={() => setActiveTab('mistakes')}
                onNavigateToBattles={() => setActiveTab('battles')}
              />
            )}
          </>
        )}
      </main>

      {/* App Footer & Branding Credit */}
      <footer id="app-branding-footer" className="w-full text-xs text-slate-500 py-4 text-center font-medium opacity-80 mb-16 md:mb-0 border-t border-[#E5E0D8]/40">
        Made from ❤️ by Business Avengers
      </footer>

      {/* Mobile Bottom Navigation Bar - Student Core Controls */}
      {isStudent && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-lg border-t border-[#E5E0D8] px-2 py-1.5 shadow-lg safe-area-pb">
          <div className="flex items-center justify-around">
            {/* 1. Dashboard */}
            <button
              id="mobile-nav-dashboard"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                activeTab === 'home' || activeTab === 'learning'
                  ? 'text-[#5A634E] font-bold scale-105'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Dashboard</span>
            </button>

            {/* 2. Battles */}
            <button
              id="mobile-nav-battles"
              onClick={() => setActiveTab('battles')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                activeTab === 'battles'
                  ? 'text-amber-700 font-bold scale-105'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <div className="relative">
                <Swords className="w-5 h-5" />
                <span className="absolute -top-1 -right-2 text-[8px] bg-amber-500 text-white px-1 py-0.2 rounded-full font-bold leading-none shadow-2xs">
                  1v1
                </span>
              </div>
              <span className="text-[10px] mt-0.5 font-medium">Battles</span>
            </button>

            {/* 3. Mistakes Vault */}
            <button
              id="mobile-nav-mistakes"
              onClick={() => setActiveTab('mistakes')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                activeTab === 'mistakes'
                  ? 'text-rose-700 font-bold scale-105'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <div className="relative">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium">Mistakes</span>
            </button>

            {/* 4. CBT Exam Simulator */}
            <button
              id="mobile-nav-exam-sim"
              onClick={() => setActiveTab('exam-sim')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                activeTab === 'exam-sim'
                  ? 'text-blue-900 font-bold scale-105'
                  : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
            >
              <Award className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Mock CBT</span>
            </button>

            {/* 5. Profile & Slide-over Drawer */}
            <button
              id="mobile-nav-profile-drawer"
              onClick={() => setIsMobileMoreOpen(true)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition relative ${
                isMobileMoreOpen ? 'text-[#5A634E] font-bold scale-105' : 'text-[#7A7468] hover:text-[#4A4A3A]'
              }`}
              title="Profile & All Tools"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-[#E5E0D8]"
                />
              </div>
              <span className="text-[10px] mt-0.5 font-medium whitespace-nowrap">Profile</span>
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Navigation Bar - Seller, Tutor & Admin */}
      {!isStudent && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-lg border-t border-[#E5E0D8] px-4 py-2 flex items-center justify-around shadow-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
              activeTab === 'overview' ? 'text-[#5A634E] font-bold' : 'text-[#7A7468]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => {
              setAuthModalMode('account');
              setIsAuthModalOpen(true);
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl transition text-[#7A7468] hover:text-[#4A4A3A]"
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Account</span>
          </button>

          <button
            onClick={() => setIsRoleSwitcherOpen(true)}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl transition text-[#AF601A] font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Switch Role</span>
          </button>
        </nav>
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        subjects={subjects}
        chapters={chapters}
        tuitions={tuitions}
        marketplace={marketplace}
        onSelectChapter={(ch) => {
          setSelectedChapter(ch);
          setActiveTab('learning');
        }}
        onSelectTuition={(t) => {
          setActiveTab('tuition');
        }}
        onSelectMarketplace={(m) => {
          setActiveTab('marketplace');
        }}
      />

      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectRole={handleSwitchRole}
        onOpenAuth={(mode) => {
          setIsRoleSwitcherOpen(false);
          setAuthModalMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Authentication Modal: Mobile Number + OTP, Google, Email/Password, Password Reset, Account Management */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onRequestRoleChange={handleSwitchRole}
        initialMode={authModalMode}
      />

      {/* Role Selection Onboarding Modal: Immediately shown after first signup */}
      <RoleOnboardingModal
        isOpen={isRoleOnboardingOpen}
        onRoleSelected={handleRoleSelected}
        currentUser={currentUser}
      />

      {/* Student Profile Edit & Customization Modal */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Mobile Comprehensive Features Drawer / Bottom Sheet */}
      <MobileMoreSheet
        isOpen={isMobileMoreOpen}
        onClose={() => setIsMobileMoreOpen(false)}
        currentUser={currentUser}
        classLevel={classLevel}
        stream={stream}
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMoreOpen(false);
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'account');
          setIsAuthModalOpen(true);
        }}
        onOpenInstallModal={() => setIsAndroidInstallModalOpen(true)}
      />

      {/* Native Android APK / PWA Guide Modal */}
      <AndroidInstallModal
        isOpen={isAndroidInstallModalOpen}
        onClose={() => setIsAndroidInstallModalOpen(false)}
      />

      {/* Network / Offline Connectivity Status */}
      <OfflineIndicator />

      {/* Active Ringing Alarm Notification Modal with Sound & Controls */}
      <ActiveAlarmModal
        alarm={activeRingingAlarm}
        onStop={handleStopAlarm}
        onSnooze={handleSnoozeAlarm}
        onOpenStudyMaterial={() => {
          setActiveTab('learning');
        }}
      />

      {/* Floating Interactive In-App Feedback & Suggestion Button */}
      <FloatingFeedbackButton onOpen={() => setIsFeedbackModalOpen(true)} />

      {/* Dynamic In-App Feedback & Suggestion Engine Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        currentUser={currentUser}
        classLevel={classLevel}
        currentRoute={activeTab}
      />

      {/* Student Bookmarks, Formulas & Highlighted Revision Notes Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onNavigateChapter={(chapterNumber, subjectName) => {
          if (subjectName) {
            const sub = subjects.find(
              (s) => s.name.toLowerCase() === subjectName.toLowerCase() || s.name.toLowerCase().includes(subjectName.toLowerCase())
            );
            if (sub) setSelectedSubject(sub);
          }
          if (chapterNumber) {
            const ch = chapters.find((c) => c.chapterNumber === chapterNumber);
            if (ch) setSelectedChapter(ch);
          }
          setActiveTab('learning');
          setIsBookmarksOpen(false);
        }}
      />

      {/* Wallet Management Modal (Cash, Coins, Deposits, 1000 Coins = ₹5 Redemptions) */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        currentUser={currentUser}
        initialTab={walletModalTab}
        onUpdateUser={(updated) => {
          setCurrentUser((prev) => ({ ...prev, ...updated }));
          fetchCurrentUser();
        }}
      />

      {/* Dual Leaderboards Modal (Quiz Champions & XP Scholars) */}
      <DualLeaderboardModal
        isOpen={isDualLeaderboardOpen}
        onClose={() => setIsDualLeaderboardOpen(false)}
        currentUser={currentUser}
        initialType={leaderboardCategory}
        onStartBattle={() => {
          setIsDualLeaderboardOpen(false);
          setActiveTab('battles');
        }}
      />
    </div>
  );
}

