import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { IssueType, FeedbackPageContext } from '../types';
import { playChime } from '../utils/audio';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: FeedbackPageContext;
  onSubmitted?: () => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  context,
  onSubmitted,
}) => {
  const [issueType, setIssueType] = useState<IssueType>('wrong_answer');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const issueOptions: { id: IssueType; label: string; desc: string }[] = [
    { id: 'wrong_answer', label: 'Wrong Answer in Solution Key', desc: 'The marked correct option seems mathematically or factually incorrect.' },
    { id: 'typo', label: 'Typo or Formatting Glitch', desc: 'Spelling error, LaTeX rendering issue, or corrupted symbols.' },
    { id: 'technical_glitch', label: 'Technical Glitch', desc: 'Option button unclickable, timer jump, or page lag.' },
    { id: 'missing_diagram', label: 'Missing Diagram / Figure', desc: 'Question refers to a diagram that is missing or not visible.' },
    { id: 'other', label: 'Other Issue', desc: 'Ambiguous wording or out-of-syllabus CBSE content.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem('learnx_token');
    const title = `Issue in ${context.subjectName || 'Study Module'}: ${issueOptions.find(o => o.id === issueType)?.label || 'Content Error'}`;
    const description = `Reported: ${issueOptions.find(o => o.id === issueType)?.label}.\nStudent remarks: ${notes.trim() || 'No additional note.'}\nQuestion context: ${context.questionText || context.chapterTitle || 'N/A'}`;

    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: 'content_issue',
          issueType,
          rating: 3,
          title,
          description,
          tags: ['Content Issue', context.subjectName || 'Module', issueType],
          pageContext: {
            ...context,
            path: window.location.pathname,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        playChime('success');
        if (onSubmitted) onSubmitted();
        setTimeout(() => {
          setIsSuccess(false);
          setNotes('');
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit report');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FFFBF5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A]">
                Report Question / Content Issue
              </h2>
              <p className="text-[11px] text-[#7A7468]">
                Auto-captured context ensures fast teacher verification
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

        {/* Body */}
        <div className="p-5 space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-2.5 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#4A4A3A]">Report Dispatched!</h3>
              <p className="text-xs text-[#7A7468] max-w-xs mx-auto">
                Our subject matter editors will review this item immediately. Thank you for making LearnX better!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Captured Context Card */}
              <div className="p-3 rounded-2xl bg-[#F9F7F2] border border-[#E8E3DA] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8A8274]">
                  <span>Module Details</span>
                  <span className="text-[#5A634E]">{context.subjectName || 'Academic Subject'}</span>
                </div>
                {context.chapterTitle && (
                  <div className="font-semibold text-[#4A4A3A] line-clamp-1">
                    Ch {context.chapterNumber}: {context.chapterTitle}
                  </div>
                )}
                {context.questionText && (
                  <div className="text-[11px] text-[#6B665C] bg-white p-2 rounded-xl border border-[#E5E0D8] line-clamp-2 italic">
                    "{context.questionText}"
                  </div>
                )}
                {context.selectedAnswer && (
                  <div className="text-[10px] text-[#7A7468]">
                    Selected option: <span className="font-semibold text-[#4A4A3A]">{context.selectedAnswer}</span>
                  </div>
                )}
              </div>

              {/* Issue Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1.5 uppercase tracking-wider">
                  Select Issue Type
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {issueOptions.map((opt) => {
                    const isSelected = issueType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIssueType(opt.id)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs font-semibold'
                            : 'bg-[#FDFBF7] text-[#4A4A3A] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{opt.label}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#7A7468]'}`}>
                            {opt.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain why this seems wrong, or what the correct calculation should be..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white resize-none"
                />
              </div>

              {error && (
                <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#6B665C] hover:bg-[#F5F2ED] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-2xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
