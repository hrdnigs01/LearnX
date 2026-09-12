import React from 'react';
import { Bell, Volume2, Clock, CheckCircle, RotateCcw, BookOpen } from 'lucide-react';
import { StudyAlarm } from '../types';

interface ActiveAlarmModalProps {
  alarm: StudyAlarm | null;
  onStop: () => void;
  onSnooze: (minutes?: number) => void;
  onOpenStudyMaterial?: () => void;
}

export const ActiveAlarmModal: React.FC<ActiveAlarmModalProps> = ({
  alarm,
  onStop,
  onSnooze,
  onOpenStudyMaterial,
}) => {
  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-2 border-[#5A634E] rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 relative overflow-hidden">
        {/* Pulsing ring background decoration */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#5A634E]/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#AF601A]/10 rounded-full blur-xl pointer-events-none" />

        {/* Ringing Bell Icon with Animated Waves */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#5A634E]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#5A634E]/30 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#5A634E] text-white flex items-center justify-center shadow-lg">
            <Bell className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Alarm Time & Subject Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDF0E9] border border-[#5A634E]/25 text-[#5A634E] text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled for {alarm.time}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4A3A] tracking-tight">
            {alarm.title}
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="px-3 py-0.5 rounded-full bg-[#F5F2ED] border border-[#E5E0D8] text-xs font-bold text-[#5A634E]">
              {alarm.subject}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#7A7468]">
              <Volume2 className="w-3.5 h-3.5 text-[#5A634E] animate-pulse" />
              <span>Alarm Ringing ({alarm.soundType})</span>
            </span>
          </div>

          {alarm.notes && (
            <p className="text-xs sm:text-sm text-[#7A7468] max-w-sm mx-auto bg-[#FDFBF7] p-3 rounded-2xl border border-[#E5E0D8] mt-2 leading-relaxed">
              "{alarm.notes}"
            </p>
          )}
        </div>

        {/* Action Buttons: Stop & Snooze */}
        <div className="space-y-2.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              id="stop-alarm-btn"
              onClick={onStop}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#922B21] hover:bg-[#78231B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Stop Alarm</span>
            </button>

            <button
              id="snooze-alarm-btn"
              onClick={() => onSnooze(alarm.snoozeMinutes || 5)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#F5F2ED] hover:bg-[#EBE7DF] border border-[#E5E0D8] text-[#4A4A3A] font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-[#AF601A]" />
              <span>Snooze {alarm.snoozeMinutes || 5}m</span>
            </button>
          </div>

          {onOpenStudyMaterial && (
            <button
              onClick={() => {
                onStop();
                onOpenStudyMaterial();
              }}
              className="w-full py-2.5 px-4 rounded-2xl text-xs font-semibold text-[#5A634E] hover:bg-[#EDF0E9] transition flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Start Studying NCERT Notes Now →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
