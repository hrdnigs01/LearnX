import { AlarmSoundType, StudyAlarm } from '../types';

/**
 * Web Audio API synthesize pleasant chimes for timer alarms, quiz victories, and payments
 */
export function playChime(type: 'success' | 'alarm' | 'click' | 'badge') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Pleasant rising triad (C5 - E5 - G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    } else if (type === 'badge') {
      // Fanfare (G4 - C5 - E5 - G5)
      const notes = [392.0, 523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.45);
      });
    } else if (type === 'alarm') {
      // Two-tone bell chime
      [880, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.25);
        osc.stop(ctx.currentTime + i * 0.25 + 0.55);
      });
    } else {
      // Gentle click feedback
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch (err) {
    // AudioContext blocked or not supported
  }
}

// Global active loop tracker for continuous study alarm ringing
let activeAlarmInterval: any = null;
let activeAlarmContext: AudioContext | null = null;

/**
 * Play a single cycle of the specified alarm tone
 */
export function playAlarmToneOnce(soundType: AlarmSoundType = 'bell', ctx?: AudioContext) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = ctx || new AudioContextClass();
    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }

    const t = context.currentTime;

    if (soundType === 'digital') {
      // Classic digital clock alarm: 4 rapid beeps
      [0, 0.12, 0.24, 0.36].forEach((offset) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1046.5, t + offset); // C6
        gain.gain.setValueAtTime(0.12, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(t + offset);
        osc.stop(t + offset + 0.09);
      });
    } else if (soundType === 'chime') {
      // Upbeat melodic study bell arpeggio (C5 - E5 - G5 - C6)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.14);
        gain.gain.setValueAtTime(0.2, t + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.14 + 0.45);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(t + idx * 0.14);
        osc.stop(t + idx * 0.14 + 0.5);
      });
    } else if (soundType === 'gentle') {
      // Gentle meditation chime for deep focus sessions
      const freqs = [349.23, 440.0, 523.25, 698.46]; // F4, A4, C5, F5
      freqs.forEach((freq, idx) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.18);
        gain.gain.setValueAtTime(0.18, t + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.18 + 0.6);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(t + idx * 0.18);
        osc.stop(t + idx * 0.18 + 0.65);
      });
    } else {
      // 'bell': Resonant school/study bell with dual harmonics (880Hz + 1320Hz)
      const bells = [
        { f: 880, delay: 0 },
        { f: 784, delay: 0.22 },
        { f: 880, delay: 0.44 },
      ];
      bells.forEach(({ f, delay }) => {
        const osc = context.createOscillator();
        const osc2 = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + delay);
        osc2.frequency.setValueAtTime(f * 1.5, t + delay);

        gain.gain.setValueAtTime(0.22, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.4);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(context.destination);

        osc.start(t + delay);
        osc2.start(t + delay);
        osc.stop(t + delay + 0.42);
        osc2.stop(t + delay + 0.42);
      });
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

/**
 * Start a continuous repeating alarm loop until stopped
 */
export function startAlarmLoop(soundType: AlarmSoundType = 'bell') {
  stopAlarmLoop(); // Ensure any running alarm is stopped first

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      activeAlarmContext = new AudioContextClass();
      if (activeAlarmContext.state === 'suspended') {
        activeAlarmContext.resume().catch(() => {});
      }
    }
  } catch (e) {}

  // Play immediately
  playAlarmToneOnce(soundType, activeAlarmContext || undefined);

  // Loop every 1.5 - 2 seconds
  const intervalDuration = soundType === 'digital' ? 1200 : soundType === 'gentle' ? 2200 : 1800;
  activeAlarmInterval = setInterval(() => {
    playAlarmToneOnce(soundType, activeAlarmContext || undefined);
  }, intervalDuration);

  return stopAlarmLoop;
}

/**
 * Stop any ringing alarm loop smoothly
 */
export function stopAlarmLoop() {
  if (activeAlarmInterval) {
    clearInterval(activeAlarmInterval);
    activeAlarmInterval = null;
  }
  if (activeAlarmContext) {
    try {
      activeAlarmContext.close().catch(() => {});
    } catch (e) {}
    activeAlarmContext = null;
  }
}

/**
 * Check if alarm loop is currently ringing
 */
export function isAlarmLoopRunning(): boolean {
  return activeAlarmInterval !== null;
}

/**
 * Request native browser notification permission
 */
export async function requestBrowserNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    return 'default';
  }
}

/**
 * Send a native browser notification for an alarm
 */
export function sendAlarmBrowserNotification(alarm: StudyAlarm) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    const title = `⏰ Study Alarm: ${alarm.title}`;
    const body = `${alarm.subject} • Scheduled for ${alarm.time}${alarm.notes ? `\nNote: ${alarm.notes}` : ''}`;
    new Notification(title, {
      body,
      tag: `learnx-alarm-${alarm.id}`,
      requireInteraction: true,
    });
  } catch (e) {
    console.warn('Notification trigger error:', e);
  }
}
