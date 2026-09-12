import React, { useState } from 'react';
import {
  X,
  Star,
  MessageSquare,
  Bug,
  Sparkles,
  AlertTriangle,
  Send,
  CheckCircle2,
  HelpCircle,
  Laptop,
  Check,
} from 'lucide-react';
import { FeedbackCategory, IssueType, FeedbackPageContext, User } from '../types';
import { playChime } from '../utils/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  classLevel?: number;
  currentRoute?: string;
  initialContext?: FeedbackPageContext;
  initialCategory?: FeedbackCategory;
  onFeedbackSubmitted?: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  classLevel,
  currentRoute,
  initialContext,
  initialCategory = 'general',
  onFeedbackSubmitted,
}) => {
  const [category, setCategory] = useState<FeedbackCategory>(initialCategory);
  const [issueType, setIssueType] = useState<IssueType>('wrong_answer');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickTags = [
    'UI & Navigation',
    'NCERT Content',
    'MCQ Solutions',
    'Speed & Performance',
    'AI Doubt Solver',
    'Study Planner',
    'Mobile Experience',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please provide both a title and a description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const token = localStorage.getItem('learnx_token');
    const pageContext: FeedbackPageContext = {
      path: window.location.pathname,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...initialContext,
    };

    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category,
          issueType: category === 'content_issue' || category === 'bug' ? issueType : undefined,
          rating,
          title,
          description,
          tags: selectedTags,
          pageContext,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        playChime('success');
        if (onFeedbackSubmitted) onFeedbackSubmitted();
        setTimeout(() => {
          setIsSuccess(false);
          setTitle('');
          setDescription('');
          setSelectedTags([]);
          onClose();
        }, 2200);
      } else {
        setErrorMessage(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#4A4A3A]">
                Share Feedback & Suggestions
              </h2>
              <p className="text-[11px] text-[#7A7468]">
                Help us craft the premier NCERT learning platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7468] hover:bg-[#F5F2ED] hover:text-[#4A4A3A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4.5 flex-1">
          {isSuccess ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#4A4A3A]">Thank You for Your Feedback!</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto">
                Your submission has been securely logged. Our academic and engineering team reviews every note to continuously polish LearnX.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'general', label: 'Feedback', icon: MessageSquare },
                    { id: 'feature_request', label: 'Feature Idea', icon: Sparkles },
                    { id: 'bug', label: 'Bug / Glitch', icon: Bug },
                    { id: 'content_issue', label: 'Content Issue', icon: AlertTriangle },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as FeedbackCategory)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                            : 'bg-[#FDFBF7] text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Issue Selector if Bug or Content Issue */}
              {(category === 'content_issue' || category === 'bug') && (
                <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#FAD7A0] space-y-2">
                  <span className="text-[11px] font-bold text-[#AF601A] uppercase tracking-wider block">
                    Issue Specifics
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'wrong_answer', label: 'Wrong Answer in Key' },
                      { id: 'typo', label: 'Typo / Formatting' },
                      { id: 'technical_glitch', label: 'Technical Glitch' },
                      { id: 'missing_diagram', label: 'Missing Diagram' },
                      { id: 'other', label: 'Other' },
                    ].map((iss) => (
                      <button
                        key={iss.id}
                        type="button"
                        onClick={() => setIssueType(iss.id as IssueType)}
                        className={`text-left p-2 rounded-xl text-[11px] font-medium border transition ${
                          issueType === iss.id
                            ? 'bg-[#AF601A] text-white border-[#AF601A] font-bold shadow-2xs'
                            : 'bg-white text-[#7A7468] border-[#E5E0D8] hover:bg-[#FDFBF7]'
                        }`}
                      >
                        {iss.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Star Rating */}
              <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#4A4A3A] block">Overall Experience Rating</span>
                  <span className="text-[11px] text-[#7A7468]">How satisfied are you with this module?</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-115 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-[#D0C9BE]'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Summary / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Add quick formula cheat sheet for Chapter 4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs sm:text-sm text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Detailed Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Please describe what you observed, suggested improvement, or steps to reproduce..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs sm:text-sm text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white resize-none"
                  required
                />
              </div>

              {/* Quick Tags */}
              <div>
                <label className="block text-[11px] font-bold text-[#7A7468] mb-1.5 uppercase tracking-wider">
                  Relevant Topics
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#5A634E] text-white border-[#5A634E] font-semibold'
                            : 'bg-white text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto-Captured Page Context Pill */}
              {initialContext && (initialContext.chapterTitle || initialContext.subjectName) && (
                <div className="p-3 rounded-xl bg-[#EDF0E9]/60 border border-[#D8DFD2] text-[11px] text-[#5A634E] flex items-start gap-2">
                  <Laptop className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Auto-captured module context: </span>
                    <span>
                      {initialContext.subjectName} • {initialContext.chapterTitle || `Ch ${initialContext.chapterNumber}`}
                      {initialContext.tab ? ` (${initialContext.tab})` : ''}
                    </span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#6B665C] hover:bg-[#F5F2ED] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
