import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Bell,
  Trash2,
  Flame,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  AlarmClock,
  Check,
  AlertCircle,
  Repeat,
  BookOpen,
  Download,
  FileDown,
} from 'lucide-react';
import { PlannerTask, User, Subject, StudyAlarm, AlarmSoundType } from '../types';
import { downloadPlannerSummaryPDF } from '../utils/pdfGenerator';
import {
  playChime,
  playAlarmToneOnce,
  startAlarmLoop,
  stopAlarmLoop,
  requestBrowserNotificationPermission,
  sendAlarmBrowserNotification,
} from '../utils/audio';
import {
  loadSavedAlarms,
  saveAlarmsToStorage,
  formatTime12Hour,
  DEFAULT_STUDY_ALARMS,
} from '../utils/alarmStorage';

interface StudyPlannerViewProps {
  currentUser: User;
  classLevel: number;
  tasks: PlannerTask[];
  subjects: Subject[];
  studyAlarms?: StudyAlarm[];
  onUpdateAlarms?: (alarms: StudyAlarm[]) => void;
  onAddTask: (task: Partial<PlannerTask>) => Promise<void>;
  onToggleTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onRefreshUser: () => void;
  onTriggerTestAlarm?: (alarm: StudyAlarm) => void;
}

const DAYS_OF_WEEK = [
  { day: 0, label: 'S', name: 'Sun' },
  { day: 1, label: 'M', name: 'Mon' },
  { day: 2, label: 'T', name: 'Tue' },
  { day: 3, label: 'W', name: 'Wed' },
  { day: 4, label: 'T', name: 'Thu' },
  { day: 5, label: 'F', name: 'Fri' },
  { day: 6, label: 'S', name: 'Sat' },
];

const SOUND_OPTIONS: { type: AlarmSoundType; label: string; desc: string }[] = [
  { type: 'bell', label: 'Resonant Bell', desc: 'Harmonic school & study bell' },
  { type: 'chime', label: 'Melodic Chime', desc: 'Pleasant rising arpeggio' },
  { type: 'digital', label: 'Digital Beep', desc: 'Crisp watch alarm pulses' },
  { type: 'gentle', label: 'Gentle Tone', desc: 'Warm meditative chime' },
];

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  currentUser,
  classLevel,
  tasks,
  subjects,
  studyAlarms: propStudyAlarms,
  onUpdateAlarms: propOnUpdateAlarms,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRefreshUser,
  onTriggerTestAlarm,
}) => {
  // Local state fallback if not passed from parent
  const [localAlarms, setLocalAlarms] = useState<StudyAlarm[]>(loadSavedAlarms);
  const alarms = propStudyAlarms || localAlarms;

  const updateAlarms = (newAlarms: StudyAlarm[]) => {
    if (propOnUpdateAlarms) {
      propOnUpdateAlarms(newAlarms);
    } else {
      setLocalAlarms(newAlarms);
      saveAlarmsToStorage(newAlarms);
    }
  };

  // Active view filter
  const [plannerTab, setPlannerTab] = useState<'all' | 'alarms' | 'tasks' | 'pomodoro'>('all');

  // Modals state
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddAlarmModal, setShowAddAlarmModal] = useState(false);

  // Add Task Modal fields
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [syncWithAlarm, setSyncWithAlarm] = useState(true);

  // Add Alarm Modal fields
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmSubject, setAlarmSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [alarmTime, setAlarmTime] = useState('18:30');
  const [alarmRepeat, setAlarmRepeat] = useState<'daily' | 'weekdays' | 'custom' | 'once'>('daily');
  const [alarmDays, setAlarmDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [alarmSound, setAlarmSound] = useState<AlarmSoundType>('bell');
  const [alarmSnooze, setAlarmSnooze] = useState<number>(5);
  const [alarmNotes, setAlarmNotes] = useState('');

  // Notification Permission State
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Pomodoro Focus Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60); // 25 min default
  const [timerInitialMode, setTimerInitialMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timerAlert, setTimerAlert] = useState<string | null>(null);

  // Currently playing preview sound
  const [testingAlarmId, setTestingAlarmId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const handleDownloadPlannerPDF = () => {
    setIsGeneratingPdf(true);
    playChime('click');
    try {
      const success = downloadPlannerSummaryPDF({
        user: currentUser,
        classLevel,
        tasks,
        alarms,
      });
      if (success) {
        playChime('success');
        setPdfSuccessMessage('Study Planner timetable & goals summary successfully downloaded as PDF!');
        setTimeout(() => setPdfSuccessMessage(null), 5000);
      }
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      startAlarmLoop('chime');
      setTimeout(() => stopAlarmLoop(), 6000);
      setTimerAlert('⏰ Study Session Completed! Great job focusing. Take a 5-minute breather.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Request browser notifications handler
  const handleRequestNotification = async () => {
    const res = await requestBrowserNotificationPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      playChime('success');
      new Notification('🔔 LearnX Notifications Enabled!', {
        body: 'You will receive timely audio alerts and study reminders when your scheduled study time arrives.',
      });
    }
  };

  // Alarm toggle switch handler
  const handleToggleAlarm = (alarmId: string) => {
    const updated = alarms.map((a) => {
      if (a.id === alarmId) {
        const nextState = !a.isEnabled;
        playChime(nextState ? 'success' : 'click');
        return { ...a, isEnabled: nextState };
      }
      return a;
    });
    updateAlarms(updated);
  };

  // Alarm test ring handler
  const handleTestRing = (alarm: StudyAlarm) => {
    if (testingAlarmId === alarm.id) {
      stopAlarmLoop();
      setTestingAlarmId(null);
      return;
    }

    if (onTriggerTestAlarm) {
      onTriggerTestAlarm(alarm);
    } else {
      stopAlarmLoop();
      setTestingAlarmId(alarm.id);
      startAlarmLoop(alarm.soundType);
      // Auto-stop after 4 seconds
      setTimeout(() => {
        stopAlarmLoop();
        setTestingAlarmId(null);
      }, 4000);
    }
  };

  // Alarm delete handler
  const handleDeleteAlarm = (alarmId: string) => {
    playChime('click');
    const updated = alarms.filter((a) => a.id !== alarmId);
    updateAlarms(updated);
  };

  // Alarm Snooze handler
  const handleQuickSnooze = (alarm: StudyAlarm, minutes: number = 5) => {
    playChime('click');
    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const sHour = snoozeDate.getHours().toString().padStart(2, '0');
    const sMin = snoozeDate.getMinutes().toString().padStart(2, '0');
    const snoozeTimeStr = `${sHour}:${sMin}`;

    const snoozedAlarm: StudyAlarm = {
      ...alarm,
      id: `snooze_${Date.now()}`,
      title: `[Snoozed ${minutes}m] ${alarm.title}`,
      time: snoozeTimeStr,
      repeat: 'once',
      isEnabled: true,
      lastTriggeredKey: undefined,
    };

    updateAlarms([snoozedAlarm, ...alarms]);
  };

  // Create new alarm from modal
  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarmTitle.trim()) return;

    const newAlarm: StudyAlarm = {
      id: `alarm_${Date.now()}`,
      title: alarmTitle.trim(),
      subject: alarmSubject,
      time: alarmTime,
      isEnabled: true,
      repeat: alarmRepeat,
      days:
        alarmRepeat === 'daily'
          ? [0, 1, 2, 3, 4, 5, 6]
          : alarmRepeat === 'weekdays'
          ? [1, 2, 3, 4, 5]
          : alarmDays,
      soundType: alarmSound,
      snoozeMinutes: alarmSnooze,
      notes: alarmNotes.trim(),
    };

    updateAlarms([newAlarm, ...alarms]);
    playChime('success');
    setShowAddAlarmModal(false);

    // Reset fields
    setAlarmTitle('');
    setAlarmNotes('');
  };

  // Toggle custom repeat day
  const handleToggleDay = (day: number) => {
    if (alarmDays.includes(day)) {
      if (alarmDays.length > 1) {
        setAlarmDays(alarmDays.filter((d) => d !== day));
      }
    } else {
      setAlarmDays([...alarmDays, day].sort());
    }
  };

  // Create task and optionally sync alarm
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddTask({
      subject: selectedSubject,
      chapter: chapter || 'Self Revision',
      title,
      date,
      time,
      durationMinutes,
      priority,
      notes,
    });

    if (syncWithAlarm) {
      // Also automatically create an alarm for this task
      const taskAlarm: StudyAlarm = {
        id: `task_alarm_${Date.now()}`,
        title: `${selectedSubject}: ${title}`,
        subject: selectedSubject,
        time: time,
        isEnabled: true,
        repeat: 'once',
        days: [new Date(date).getDay()],
        soundType: 'bell',
        snoozeMinutes: 5,
        notes: `Target: ${chapter || 'Revision'}. Priority: ${priority.toUpperCase()}`,
      };
      updateAlarms([taskAlarm, ...alarms]);
    }

    setTitle('');
    setChapter('');
    setNotes('');
    setShowAddGoalModal(false);
    playChime('success');
    onRefreshUser();
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetPomodoroPreset = (mins: number, mode: 'focus' | 'shortBreak' | 'longBreak') => {
    playChime('click');
    setIsTimerRunning(false);
    setTimerInitialMode(mode);
    setTimerSecondsLeft(mins * 60);
  };

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDF0E9] border border-[#5A634E]/20 text-[#5A634E] text-xs font-semibold">
              <AlarmClock className="w-3.5 h-3.5" />
              <span>Smart Study Timetable</span>
            </span>
            <span className="text-xs text-[#8B8374]">
              {alarms.filter((a) => a.isEnabled).length} active alarms
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A] tracking-tight">
            Study Planner, Alarms & Focus Reminders
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8374] mt-0.5">
            Configure audible reminder alarms, schedule chapter targets, and maintain your {currentUser.streakDays}-day streak.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="set-study-alarm-btn"
            onClick={() => setShowAddAlarmModal(true)}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition active:scale-98"
          >
            <AlarmClock className="w-4 h-4" />
            <span>Set Study Alarm</span>
          </button>

          <button
            id="add-study-goal-btn"
            onClick={() => setShowAddGoalModal(true)}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-white hover:bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition active:scale-98"
          >
            <Plus className="w-4 h-4 text-[#5A634E]" />
            <span>Add Study Goal</span>
          </button>

          <button
            id="download-planner-pdf-btn"
            disabled={isGeneratingPdf}
            onClick={handleDownloadPlannerPDF}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-[#EDF0E9] hover:bg-[#DEE4D8] border border-[#5A634E]/30 text-[#5A634E] font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition active:scale-98 disabled:opacity-50"
            title="Download full timetable, alarms, and syllabus checklist as a PDF document"
          >
            <Download className="w-4 h-4 text-[#5A634E]" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Planner PDF'}</span>
          </button>
        </div>
      </div>

      {/* PDF Export Success Notification */}
      {pdfSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-[#EDF0E9] border border-[#5A634E]/30 flex items-center justify-between text-xs text-[#5A634E] font-semibold animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5A634E] flex-shrink-0" />
            <span>{pdfSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPdfSuccessMessage(null)}
            className="text-[#5A634E] hover:text-[#383C2F] text-xs underline underline-offset-2 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* View Filter Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E0D8] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setPlannerTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            plannerTab === 'all'
              ? 'bg-[#5A634E] text-white shadow-2xs'
              : 'text-[#7A7468] hover:bg-[#F5F2ED]'
          }`}
        >
          All Timetable & Alarms
        </button>
        <button
          onClick={() => setPlannerTab('alarms')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            plannerTab === 'alarms'
              ? 'bg-[#5A634E] text-white shadow-2xs'
              : 'text-[#7A7468] hover:bg-[#F5F2ED]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Study Alarms ({alarms.length})</span>
        </button>
        <button
          onClick={() => setPlannerTab('tasks')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            plannerTab === 'tasks'
              ? 'bg-[#5A634E] text-white shadow-2xs'
              : 'text-[#7A7468] hover:bg-[#F5F2ED]'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Tasks & Syllabus ({tasks.length})</span>
        </button>
        <button
          onClick={() => setPlannerTab('pomodoro')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            plannerTab === 'pomodoro'
              ? 'bg-[#5A634E] text-white shadow-2xs'
              : 'text-[#7A7468] hover:bg-[#F5F2ED]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Focus Pomodoro</span>
        </button>
      </div>

      {/* Browser Notification Permission Banner */}
      {notificationPermission !== 'granted' && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FDFBF7] to-amber-500/5 border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#4A4A3A]">
                Enable Browser Notification Alerts
              </h4>
              <p className="text-xs text-[#7A7468]">
                Allow notifications so LearnX can pop up reminder alerts even when this tab is minimized or in the background.
              </p>
            </div>
          </div>
          <button
            onClick={handleRequestNotification}
            className="px-4 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            Enable Audio & Browser Alerts
          </button>
        </div>
      )}

      {/* SECTION 1: STUDY ALARMS & REMINDERS */}
      {(plannerTab === 'all' || plannerTab === 'alarms') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A] flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#5A634E]" />
                <span>Configured Study Alarms & Audio Chimes</span>
              </h2>
              <p className="text-xs text-[#8B8374]">
                Alarms play continuous resonant bell chimes and trigger notifications at your set times.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  stopAlarmLoop();
                  playAlarmToneOnce('bell');
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5F2ED] border border-[#E5E0D8] text-xs font-semibold text-[#5A634E] flex items-center gap-1.5 shadow-2xs transition"
                title="Quick sample of alarm chime sound"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Bell Chime</span>
              </button>
            </div>
          </div>

          {alarms.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center mx-auto">
                <AlarmClock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">No Alarms Set</h3>
              <p className="text-xs text-[#8B8374] max-w-sm mx-auto">
                Never miss your daily NCERT revision. Click "+ Set Study Alarm" to create your first daily study reminder.
              </p>
              <button
                onClick={() => setShowAddAlarmModal(true)}
                className="px-5 py-2 rounded-full bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E] transition shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set First Alarm</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {alarms.map((alarm) => {
                const isTestingThis = testingAlarmId === alarm.id;
                const isEnabled = alarm.isEnabled;

                return (
                  <div
                    key={alarm.id}
                    className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between gap-4 shadow-xs ${
                      isEnabled
                        ? 'bg-white border-[#E5E0D8] hover:border-[#5A634E]/50'
                        : 'bg-[#F9F7F3] border-[#E5E0D8] opacity-75'
                    }`}
                  >
                    {/* Top Row: Time, Subject & Toggle Switch */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-serif font-bold tracking-tight ${isEnabled ? 'text-[#4A4A3A]' : 'text-[#8B8374]'}`}>
                            {formatTime12Hour(alarm.time)}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468]">
                            {alarm.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-[#5A634E] bg-[#EDF0E9] px-2.5 py-0.5 rounded-full">
                            {alarm.subject}
                          </span>
                          <span className="text-[11px] text-[#8B8374] capitalize font-medium">
                            • {alarm.repeat}
                          </span>
                        </div>
                      </div>

                      {/* Custom Accessible Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={() => handleToggleAlarm(alarm.id)}
                        className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none flex-shrink-0 cursor-pointer ${
                          isEnabled ? 'bg-[#5A634E]' : 'bg-[#D5D0C7]'
                        }`}
                        title={isEnabled ? 'Alarm is ON (Click to turn OFF)' : 'Alarm is OFF (Click to turn ON)'}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center text-[9px] ${
                            isEnabled ? 'translate-x-6 text-[#5A634E] font-bold' : 'translate-x-0 text-[#8B8374]'
                          }`}
                        >
                          {isEnabled ? <Check className="w-3 h-3" /> : ''}
                        </div>
                      </button>
                    </div>

                    {/* Middle: Title & Notes */}
                    <div className="space-y-1">
                      <h4 className={`text-sm font-serif font-bold ${isEnabled ? 'text-[#4A4A3A]' : 'text-[#8B8374]'}`}>
                        {alarm.title}
                      </h4>
                      {alarm.notes && (
                        <p className="text-xs text-[#7A7468] line-clamp-2 leading-relaxed bg-[#FDFBF7] p-2 rounded-xl border border-[#E5E0D8]/60">
                          {alarm.notes}
                        </p>
                      )}
                    </div>

                    {/* Repeat Days Strip */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#E5E0D8]/80">
                      <div className="flex items-center gap-1">
                        {DAYS_OF_WEEK.map(({ day, label }) => {
                          const isDayActive = alarm.days?.includes(day);
                          return (
                            <span
                              key={day}
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                isDayActive && isEnabled
                                  ? 'bg-[#5A634E] text-white'
                                  : isDayActive
                                  ? 'bg-[#A8A296] text-white'
                                  : 'bg-[#F5F2ED] text-[#A8A296]'
                              }`}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>

                      <span className="text-[10px] text-[#8B8374] font-medium capitalize flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#5A634E]" />
                        <span>{alarm.soundType}</span>
                      </span>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E5E0D8]/80 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTestRing(alarm)}
                          className={`px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition ${
                            isTestingThis
                              ? 'bg-[#922B21] text-white border-[#922B21] animate-pulse'
                              : 'bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#5A634E] border-[#E5E0D8]'
                          }`}
                          title="Ring alarm tone for 4 seconds"
                        >
                          {isTestingThis ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Stop Ring</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5" />
                              <span>Test Ring</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleQuickSnooze(alarm, alarm.snoozeMinutes || 5)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F5F2ED] border border-[#E5E0D8] text-[#7A7468] font-semibold hover:text-[#4A4A3A] transition"
                          title="Set a snooze alarm 5 mins from now"
                        >
                          +{alarm.snoozeMinutes || 5}m Snooze
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteAlarm(alarm.id)}
                        className="p-1.5 rounded-xl hover:bg-[#FADBD8] text-[#8B8374] hover:text-[#922B21] transition"
                        title="Delete Alarm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: POMODORO & DAILY TARGET COMPLETION */}
      {(plannerTab === 'all' || plannerTab === 'pomodoro') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Progress Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8B8374] uppercase tracking-wider">
                  Daily Target Completion
                </span>
                <span className="text-xs font-bold text-[#5A634E]">{completionPercentage}%</span>
              </div>
              <div className="text-3xl font-serif font-bold text-[#4A4A3A]">
                {completedCount} of {totalCount} Done
              </div>
              <div className="w-full h-2 rounded-full bg-[#E9E4DB] overflow-hidden my-3">
                <div
                  className="h-full rounded-full bg-[#5A634E] transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-[#8B8374] leading-relaxed">
              Completing scheduled tasks adds <span className="text-[#AF601A] font-bold">+15 XP</span> each to your leaderboard rank!
            </p>
          </div>

          {/* Pomodoro Focus Timer */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#F5F2ED] border border-[#E5E0D8] flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDF0E9] border border-[#D8DFD2] text-[#5A634E] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pomodoro Focus Timer</span>
                </div>
                <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                  {timerInitialMode === 'focus' ? 'Deep Work Session' : 'Restorative Break'}
                </h3>
                <p className="text-xs text-[#7A7468]">
                  Continuous concentration with chime alarm upon completion.
                </p>
              </div>

              {/* Presets */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleSetPomodoroPreset(25, 'focus')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    timerInitialMode === 'focus'
                      ? 'bg-[#5A634E] text-white'
                      : 'bg-white text-[#7A7468] hover:bg-[#EBE7DF]'
                  }`}
                >
                  25m Focus
                </button>
                <button
                  onClick={() => handleSetPomodoroPreset(50, 'focus')}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-white text-[#7A7468] hover:bg-[#EBE7DF] transition"
                >
                  50m Deep
                </button>
                <button
                  onClick={() => handleSetPomodoroPreset(5, 'shortBreak')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    timerInitialMode === 'shortBreak'
                      ? 'bg-[#5A634E] text-white'
                      : 'bg-white text-[#7A7468] hover:bg-[#EBE7DF]'
                  }`}
                >
                  5m Break
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E5E0D8]">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#5A634E] tracking-wider">
                {formatTimer(timerSecondsLeft)}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    playChime('click');
                    setIsTimerRunning(!isTimerRunning);
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition active:scale-98"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Focus</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    playChime('click');
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(25 * 60);
                  }}
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] flex items-center justify-center transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SCHEDULED TASKS & SYLLABUS GOALS */}
      {(plannerTab === 'all' || plannerTab === 'tasks') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-[#4A4A3A] flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#5A634E]" />
              <span>Scheduled Tasks & Daily Timetable</span>
            </h3>
            <span className="text-xs text-[#8B8374]">{tasks.length} total goals</span>
          </div>

          {tasks.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#8B8374] text-xs space-y-2">
              <p>No study tasks scheduled yet.</p>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="text-xs text-[#5A634E] font-bold hover:underline"
              >
                + Add your first study task
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {tasks.map((task) => {
                const isDone = task.isCompleted;

                return (
                  <div
                    key={task.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-2xs ${
                      isDone
                        ? 'bg-[#F5F2ED] border-[#E5E0D8] opacity-70'
                        : 'bg-white border-[#E5E0D8] hover:border-[#5A634E]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => {
                          playChime(isDone ? 'click' : 'success');
                          onToggleTask(task.id);
                          onRefreshUser();
                        }}
                        className="mt-0.5 text-[#5A634E] hover:text-[#484F3E] transition"
                        title={isDone ? 'Mark as pending' : 'Mark as completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 fill-[#5A634E] text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#8B8374]" />
                        )}
                      </button>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-serif font-bold leading-tight ${isDone ? 'line-through text-[#8B8374]' : 'text-[#4A4A3A]'}`}>
                            {task.title}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-[#FADBD8] text-[#922B21] border border-[#F5B7B1]'
                                : task.priority === 'medium'
                                ? 'bg-[#FDEBD0] text-[#AF601A] border border-[#FAD7A0]'
                                : 'bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#8B8374]">
                          <span className="text-[#5A634E] font-semibold">{task.subject}</span>
                          <span>•</span>
                          <span>{task.chapter}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.date} at {formatTime12Hour(task.time)} ({task.durationMinutes}m)
                          </span>
                        </div>

                        {task.notes && (
                          <p className="text-xs text-[#7A7468] pt-1 leading-snug">{task.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-xl bg-[#F5F2ED] hover:bg-[#FADBD8] border border-[#E5E0D8] text-[#8B8374] hover:text-[#922B21] transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: SET STUDY ALARM */}
      {showAddAlarmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#5A634E] text-white flex items-center justify-center">
                  <AlarmClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                    Set Study Alarm & Audio Reminder
                  </h3>
                  <p className="text-[11px] text-[#8B8374]">
                    Rings loud and clear at your chosen study hour
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAlarmModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#8B8374] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlarm} className="space-y-4 text-xs">
              {/* Title & Subject */}
              <div>
                <label className="block text-[#4A4A3A] font-bold mb-1">Alarm Title *</label>
                <input
                  type="text"
                  required
                  value={alarmTitle}
                  onChange={(e) => setAlarmTitle(e.target.value)}
                  placeholder="e.g. Mathematics NCERT Chapter 4 Board Revision"
                  className="w-full p-3 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#4A4A3A] font-bold mb-1">Subject</label>
                  <select
                    value={alarmSubject}
                    onChange={(e) => setAlarmSubject(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="General Revision">General Revision</option>
                    <option value="Formula Practice">Formula Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A4A3A] font-bold mb-1">Alarm Time (24h) *</label>
                  <input
                    type="time"
                    required
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] font-mono font-bold focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              {/* Repeat Frequency */}
              <div>
                <label className="block text-[#4A4A3A] font-bold mb-1.5">Repeat Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'daily', label: 'Every Day' },
                    { id: 'weekdays', label: 'Mon - Fri' },
                    { id: 'custom', label: 'Custom' },
                    { id: 'once', label: 'Once' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAlarmRepeat(item.id as any)}
                      className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition border ${
                        alarmRepeat === item.id
                          ? 'bg-[#5A634E] text-white border-[#5A634E]'
                          : 'bg-[#F5F2ED] text-[#7A7468] border-[#E5E0D8] hover:bg-[#EBE7DF]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Day selector for custom */}
                {alarmRepeat === 'custom' && (
                  <div className="flex items-center justify-between gap-1 mt-2.5 p-2 rounded-2xl bg-[#F5F2ED]">
                    {DAYS_OF_WEEK.map(({ day, label, name }) => {
                      const isSelected = alarmDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                            isSelected
                              ? 'bg-[#5A634E] text-white shadow-2xs'
                              : 'bg-white border border-[#E5E0D8] text-[#7A7468]'
                          }`}
                          title={name}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Alarm Sound Tone with Previews */}
              <div>
                <label className="block text-[#4A4A3A] font-bold mb-1.5">Alarm Chime Sound Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {SOUND_OPTIONS.map(({ type, label, desc }) => {
                    const isSelected = alarmSound === type;
                    return (
                      <div
                        key={type}
                        onClick={() => {
                          setAlarmSound(type);
                          playAlarmToneOnce(type);
                        }}
                        className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#EDF0E9] border-[#5A634E] text-[#5A634E]'
                            : 'bg-[#F5F2ED] border-[#E5E0D8] text-[#4A4A3A] hover:bg-[#EBE7DF]'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1">
                            <span>{label}</span>
                          </div>
                          <div className="text-[10px] text-[#8B8374]">{desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAlarmToneOnce(type);
                          }}
                          className="p-1 rounded-lg bg-white/80 hover:bg-white text-[#5A634E] transition"
                          title="Preview tone"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Snooze Minutes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#4A4A3A] font-bold mb-1">Snooze Duration</label>
                  <select
                    value={alarmSnooze}
                    onChange={(e) => setAlarmSnooze(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    <option value={3}>3 Minutes</option>
                    <option value={5}>5 Minutes (Standard)</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A4A3A] font-bold mb-1">Preview</label>
                  <button
                    type="button"
                    onClick={() => playAlarmToneOnce(alarmSound)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#5A634E] font-bold hover:bg-[#EBE7DF] transition flex items-center justify-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Sample Chime</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[#4A4A3A] font-bold mb-1">Target Goals / Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={alarmNotes}
                  onChange={(e) => setAlarmNotes(e.target.value)}
                  placeholder="e.g. Solve 10 questions on Quadratic Equations & review formulas"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddAlarmModal(false)}
                  className="px-4 py-2.5 rounded-full bg-[#F5F2ED] text-[#7A7468] font-semibold hover:bg-[#EBE7DF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <AlarmClock className="w-4 h-4" />
                  <span>Save & Set Alarm</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD STUDY GOAL TASK */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-[32px] shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="text-base font-serif font-bold text-[#4A4A3A] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#5A634E]" />
                <span>Add Study Task & Timetable Goal</span>
              </h3>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#8B8374] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  <option value="General Revision">General Revision</option>
                </select>
              </div>

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Topic / Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Practice 15 Light Reflection Ray Diagrams"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Chapter Name (Optional)</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Light: Reflection and Refraction"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  />
                </div>
                <div>
                  <label className="block text-[#4A4A3A] font-semibold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] focus:outline-none focus:border-[#5A634E]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Board Exam)</option>
                  </select>
                </div>
              </div>

              {/* Automatic Alarm Sync Checkbox */}
              <div className="p-3 rounded-2xl bg-[#EDF0E9] border border-[#5A634E]/20 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="sync-alarm-check"
                  checked={syncWithAlarm}
                  onChange={(e) => setSyncWithAlarm(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5A634E] focus:ring-[#5A634E]"
                />
                <label htmlFor="sync-alarm-check" className="text-xs font-semibold text-[#4A4A3A] cursor-pointer">
                  🔔 Set an audible study alarm at {time} for this goal
                </label>
              </div>

              <div>
                <label className="block text-[#4A4A3A] font-semibold mb-1">Key Notes / Goal Checklist</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on sign conventions and mirror formula derivations"
                  className="w-full p-2.5 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-full bg-[#F5F2ED] text-[#7A7468] font-semibold hover:bg-[#EBE7DF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold transition shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
