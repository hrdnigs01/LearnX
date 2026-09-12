import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  Send,
  ThumbsUp,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { FeedbackPageContext } from '../types';
import { playChime } from '../utils/audio';

interface PostModuleFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  chapterTitle?: string;
  score?: number;
  total?: number;
  context?: FeedbackPageContext;
  onFeedbackSaved?: () => void;
}

export const PostModuleFeedbackModal: React.FC<PostModuleFeedbackModalProps> = ({
  isOpen,
  onClose,
  moduleName,
  chapterTitle,
  score,
  total,
  context,
  onFeedbackSaved,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const reactionTags = [
    'Super Clear Notes',
    'Challenging MCQs',
    'Great Formulas',
    'Board Exam Relevant',
    'Needs More Numerical Practice',
    'Easy to Memorize',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('learnx_token');
    const title = `Post-Module Feedback: ${chapterTitle || moduleName} (${rating} Stars)`;
    const description = `${comments.trim() || 'Student submitted post-module rating.'}\nReaction tags: ${selectedTags.join(', ') || 'None'}\nModule Score: ${score !== undefined ? `${score}/${total}` : 'N/A'}`;

    try {
      await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: rating <= 2 ? 'bug' : 'general',
          rating,
          title,
          description,
          tags: ['Post-Module', moduleName, ...selectedTags],
          pageContext: {
            ...context,
            subjectName: moduleName,
            chapterTitle,
            path: window.location.pathname,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      setIsSubmitted(true);
      playChime('success');
      if (onFeedbackSaved) onFeedbackSaved();
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Post-module feedback error:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A]">
                How Was This Module?
              </h2>
              <p className="text-[11px] text-[#7A7468]">
                {chapterTitle ? `${moduleName} • ${chapterTitle}` : moduleName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A7468] hover:bg-[#F5F2ED] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#4A4A3A]">Feedback Recorded!</h3>
              <p className="text-xs text-[#7A7468]">
                Your rating helps fellow students discover the highest quality revisions.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Area */}
              <div className="text-center py-2 space-y-2">
                <span className="text-xs font-semibold text-[#6B665C]">
                  Rate the conceptual clarity & practice depth
                </span>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition"
                      >
                        <Star
                          className={`w-7 h-7 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-[#D5CFC5]'}`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-bold text-[#5A634E]">
                  {rating === 5 && '🌟 Masterclass! Exceptional clarity.'}
                  {rating === 4 && '👍 Great module, very helpful.'}
                  {rating === 3 && '👌 Good, but could be improved.'}
                  {rating === 2 && '⚠️ Needs more explanations/examples.'}
                  {rating === 1 && '❌ Found issues or confusing questions.'}
                </div>
              </div>

              {/* Reaction Tags */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A7468] uppercase tracking-wider mb-1.5">
                  Quick Impressions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {reactionTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                          isSelected
                            ? 'bg-[#5A634E] text-white border-[#5A634E] font-bold'
                            : 'bg-white text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comments or Feature Request */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A7468] uppercase tracking-wider mb-1">
                  Suggestions or Feature Request (Optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g., Would love step-by-step video animation or more past board MCQs..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#8A8274] hover:text-[#4A4A3A] font-medium"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-2xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Submit Rating'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
