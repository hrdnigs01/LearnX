import React from 'react';
import { MessageSquarePlus, Star } from 'lucide-react';

interface FloatingFeedbackButtonProps {
  onClick?: () => void;
  onOpen?: () => void;
  unreadAdminNotices?: number;
}

export const FloatingFeedbackButton: React.FC<FloatingFeedbackButtonProps> = ({
  onClick,
  onOpen,
  unreadAdminNotices = 0,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    else if (onOpen) onOpen();
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group">
      <button
        id="floating-feedback-btn"
        onClick={handleClick}
        className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all transform hover:scale-105 active:scale-95"
        title="Share In-App Feedback or Report Content Issue"
      >
        <div className="relative">
          <MessageSquarePlus className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <span className="text-xs font-bold tracking-tight hidden sm:inline">
          Feedback & Ideas
        </span>
        <span className="text-xs font-bold tracking-tight sm:hidden">
          Feedback
        </span>
      </button>
    </div>
  );
};
