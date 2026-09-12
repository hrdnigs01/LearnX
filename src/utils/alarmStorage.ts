import { StudyAlarm, AlarmSoundType } from '../types';

const ALARMS_STORAGE_KEY = 'learnx_study_alarms';

export const DEFAULT_STUDY_ALARMS: StudyAlarm[] = [
  {
    id: 'alarm_1',
    title: 'Daily Evening Mathematics Practice',
    subject: 'Mathematics',
    time: '18:00',
    isEnabled: true,
    repeat: 'daily',
    days: [0, 1, 2, 3, 4, 5, 6],
    soundType: 'bell',
    snoozeMinutes: 5,
    notes: 'Solve 10 board exam NCERT questions and review theorem proofs.',
  },
  {
    id: 'alarm_2',
    title: 'Morning Science Theory & Concepts',
    subject: 'Science',
    time: '07:00',
    isEnabled: true,
    repeat: 'daily',
    days: [1, 2, 3, 4, 5, 6],
    soundType: 'chime',
    snoozeMinutes: 5,
    notes: 'Revise chemical equations and physics ray diagrams.',
  },
  {
    id: 'alarm_3',
    title: 'Night Summary & Weak Area Drill',
    subject: 'General Revision',
    time: '21:30',
    isEnabled: false,
    repeat: 'weekdays',
    days: [1, 2, 3, 4, 5],
    soundType: 'gentle',
    snoozeMinutes: 5,
    notes: 'Summarize today’s chapters and take a 10-question MCQ quiz.',
  },
];

/**
 * Load saved alarms from local storage or initialize with defaults
 */
export function loadSavedAlarms(): StudyAlarm[] {
  try {
    const raw = localStorage.getItem(ALARMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading alarms from localStorage:', e);
  }
  return DEFAULT_STUDY_ALARMS;
}

/**
 * Save alarms array to localStorage
 */
export function saveAlarmsToStorage(alarms: StudyAlarm[]): void {
  try {
    localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms));
  } catch (e) {
    console.warn('Error saving alarms to localStorage:', e);
  }
}

/**
 * Format a 24-hour time string ("18:30") to 12-hour format ("06:30 PM")
 */
export function formatTime12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
}

/**
 * Helper to check if an alarm should trigger right now
 */
export function shouldAlarmTrigger(alarm: StudyAlarm, now: Date): boolean {
  if (!alarm.isEnabled) return false;

  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;

  if (currentTime !== alarm.time) return false;

  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const dateKey = `${now.toISOString().split('T')[0]}_${currentTime}`;

  // Already triggered in this minute?
  if (alarm.lastTriggeredKey === dateKey) return false;

  if (alarm.repeat === 'daily') {
    return true;
  } else if (alarm.repeat === 'weekdays') {
    return currentDay >= 1 && currentDay <= 5;
  } else if (alarm.repeat === 'custom') {
    return alarm.days.includes(currentDay);
  } else if (alarm.repeat === 'once') {
    return true;
  }

  return false;
}
