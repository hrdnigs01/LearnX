import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Plus,
  Send,
  HelpCircle,
  Sparkles,
  Search,
  Tag,
  Clock,
  User as UserIcon,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DiscussionQuestion, DiscussionAnswer, User } from '../types';
import { safeFetchJson } from '../utils/api';
import { playChime } from '../utils/audio';

interface DiscussionForumSectionProps {
  currentUser: User;
  currentSubjectId?: string;
  currentSubjectName?: string;
  currentChapterId?: string;
  currentChapterNumber?: number;
  currentChapterTitle?: string;
  classLevel?: number;
  onRefreshUser?: () => void;
}

export const DiscussionForumSection: React.FC<DiscussionForumSectionProps> = ({
  currentUser,
  currentSubjectId,
  currentSubjectName,
  currentChapterId,
  currentChapterNumber,
  currentChapterTitle,
  classLevel = 10,
  onRefreshUser,
}) => {
  const [discussions, setDiscussions] = useState<DiscussionQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // New Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // Answer state
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<string>>(new Set());

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      let url = `/api/discussions?classLevel=${classLevel}`;
      if (currentSubjectId) url += `&subjectId=${currentSubjectId}`;
      if (currentChapterId) url += `&chapterId=${currentChapterId}`;

      const data = await safeFetchJson<{ success: boolean; discussions: DiscussionQuestion[] }>(url);
      if (data?.success) {
        setDiscussions(data.discussions);
        // Expand first question by default
        if (data.discussions.length > 0) {
          setExpandedQuestionIds(new Set([data.discussions[0].id]));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [currentSubjectId, currentChapterId, classLevel]);

  const toggleExpand = (id: string) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpvoteQuestion = async (id: string) => {
    playChime('click');
    // Optimistic toggle
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const hasUpvoted = d.upvotedBy.includes(currentUser.id);
        return {
          ...d,
          upvotes: hasUpvoted ? Math.max(0, d.upvotes - 1) : d.upvotes + 1,
          upvotedBy: hasUpvoted
            ? d.upvotedBy.filter((u) => u !== currentUser.id)
            : [...d.upvotedBy, currentUser.id],
        };
      })
    );

    try {
      await fetch(`/api/discussions/${id}/upvote`, { method: 'POST' });
    } catch (err) {
      console.error('Upvote error:', err);
    }
  };

  const handleUpvoteAnswer = async (questionId: string, answerId: string) => {
    playChime('click');
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== questionId) return d;
        return {
          ...d,
          answers: d.answers.map((a) => {
            if (a.id !== answerId) return a;
            const hasUpvoted = a.upvotedBy?.includes(currentUser.id);
            return {
              ...a,
              upvotes: hasUpvoted ? Math.max(0, a.upvotes - 1) : a.upvotes + 1,
              upvotedBy: hasUpvoted
                ? a.upvotedBy.filter((u) => u !== currentUser.id)
                : [...(a.upvotedBy || []), currentUser.id],
            };
          }),
        };
      })
    );

    try {
      await fetch(`/api/discussions/${questionId}/answers/${answerId}/upvote`, { method: 'POST' });
    } catch (err) {
      console.error('Answer upvote error:', err);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmittingQuestion(true);
    const tags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: currentSubjectId || 'sub_m_10',
          subjectName: currentSubjectName || 'Mathematics',
          chapterId: currentChapterId,
          chapterNumber: currentChapterNumber,
          chapterTitle: currentChapterTitle,
          classLevel,
          title: newTitle,
          content: newContent,
          tags: tags.length > 0 ? tags : ['NCERT', 'Doubt'],
        }),
      });

      const data = await res.json();
      if (data.success) {
        playChime('success');
        setDiscussions((prev) => [data.discussion, ...prev]);
        setExpandedQuestionIds((prev) => new Set([...prev, data.discussion.id]));
        setNewTitle('');
        setNewContent('');
        setNewTags('');
        setIsAskModalOpen(false);
        if (onRefreshUser) onRefreshUser();
      }
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handlePostAnswer = async (questionId: string) => {
    if (!answerContent.trim()) return;
    setIsSubmittingAnswer(true);

    try {
      const res = await fetch(`/api/discussions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent }),
      });

      const data = await res.json();
      if (data.success) {
        playChime('success');
        setDiscussions((prev) =>
          prev.map((d) => (d.id === questionId ? data.discussion : d))
        );
        setAnswerContent('');
        setAnsweringQuestionId(null);
        if (onRefreshUser) onRefreshUser();
      }
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const filtered = discussions.filter((d) => {
    if (filter === 'resolved' && !d.isResolved) return false;
    if (filter === 'unresolved' && d.isResolved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags?.some((t) => t.toLowerCase().includes(q)) ||
        d.answers?.some((a) => a.content.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#4A4A3A]">
              Peer Discussion Forum & Q&A
            </h2>
          </div>
          <p className="text-xs text-[#7A7468] mt-1 pl-10">
            Ask doubts, share problem-solving tricks, and upvote helpful student and mentor answers.
          </p>
        </div>

        <button
          onClick={() => setIsAskModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-xs self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question (+25 XP)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C8476] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussion threads, questions, or solutions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Doubts' },
            { id: 'unresolved', label: 'Needs Answer' },
            { id: 'resolved', label: 'Solved' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                filter === f.id
                  ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                  : 'bg-white text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#8A8274] bg-white rounded-3xl border border-[#E5E0D8]">
            Loading discussion threads...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-white rounded-3xl border border-[#E5E0D8]">
            <HelpCircle className="w-8 h-8 text-[#5A634E] mx-auto" />
            <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">No Questions Found</h3>
            <p className="text-xs text-[#7A7468] max-w-sm mx-auto">
              Be the first student to post a question for this topic! Earn +25 XP upon posting.
            </p>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A634E] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask First Doubt</span>
            </button>
          </div>
        ) : (
          filtered.map((q) => {
            const isExpanded = expandedQuestionIds.has(q.id);
            const hasUpvotedQ = q.upvotedBy.includes(currentUser.id);

            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-3.5 shadow-2xs"
              >
                {/* Question Header & Voting */}
                <div className="flex items-start gap-3">
                  {/* Upvote Box */}
                  <button
                    onClick={() => handleUpvoteQuestion(q.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition min-w-[48px] ${
                      hasUpvotedQ
                        ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                        : 'bg-[#FDFBF7] text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                    }`}
                    title="Upvote helpful question"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-bold mt-1">{q.upvotes}</span>
                  </button>

                  {/* Question Main */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {q.isResolved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Solved</span>
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-[#5A634E]">
                          {q.subjectName} {q.chapterNumber ? `• Ch ${q.chapterNumber}` : ''}
                        </span>
                        {q.chapterTitle && (
                          <span className="text-[11px] text-[#8C8476] truncate max-w-[220px]">
                            {q.chapterTitle}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#8C8476]">
                        <span>Asked by {q.authorName}</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#4A4A3A] font-serif leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B665C] leading-relaxed whitespace-pre-line">
                      {q.content}
                    </p>

                    {/* Tags */}
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {q.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F2ED] text-[#7A7468]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Answers Toggle & Reply Bar */}
                <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A634E] hover:underline"
                  >
                    <span>
                      {q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      setAnsweringQuestionId(answeringQuestionId === q.id ? null : q.id);
                      if (!isExpanded) toggleExpand(q.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5A634E] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Answer this (+30 XP)</span>
                  </button>
                </div>

                {/* Expanded Answers Thread */}
                {isExpanded && (
                  <div className="pt-2 space-y-3 pl-2 sm:pl-4 border-l-2 border-[#E5E0D8]">
                    {/* Inline Answer Input Box */}
                    {answeringQuestionId === q.id && (
                      <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] space-y-2 animate-in fade-in">
                        <span className="text-xs font-bold text-[#4A4A3A] block">
                          Write your explanation:
                        </span>
                        <textarea
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          placeholder="Provide the step-by-step formula, reasoning, or derivation..."
                          rows={3}
                          className="w-full p-2.5 rounded-xl border border-[#E5E0D8] bg-white text-xs text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E] resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setAnsweringQuestionId(null);
                              setAnswerContent('');
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs text-[#7A7468] hover:bg-[#F5F2ED]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handlePostAnswer(q.id)}
                            disabled={isSubmittingAnswer || !answerContent.trim()}
                            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isSubmittingAnswer ? 'Posting...' : 'Post Answer'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {q.answers.length === 0 ? (
                      <div className="text-xs text-[#8C8476] italic py-2">
                        No answers posted yet. Be the first to share your steps!
                      </div>
                    ) : (
                      q.answers.map((ans) => {
                        const hasUpvotedAns = ans.upvotedBy?.includes(currentUser.id);
                        return (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-2xl border transition space-y-2 ${
                              ans.isAccepted
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-[#FAF8F5] border-[#E8E3DA]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#4A4A3A]">
                                  {ans.authorName}
                                </span>
                                {ans.authorRole === 'tutor' && (
                                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#D5F5E3] text-[#1D8348]">
                                    Verified Mentor
                                  </span>
                                )}
                                {ans.isAccepted && (
                                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Accepted Solution
                                  </span>
                                )}
                              </div>

                              {/* Answer Upvote */}
                              <button
                                onClick={() => handleUpvoteAnswer(q.id, ans.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                                  hasUpvotedAns
                                    ? 'bg-[#5A634E] text-white border-[#5A634E]'
                                    : 'bg-white text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                                }`}
                                title="Upvote helpful explanation"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{ans.upvotes}</span>
                              </button>
                            </div>

                            <p className="text-xs text-[#555046] leading-relaxed whitespace-pre-line">
                              {ans.content}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4.5 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                    Ask Academic Doubt (+25 XP)
                  </h3>
                  <p className="text-[11px] text-[#7A7468]">
                    Shared with fellow Class {classLevel} students and expert mentors
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7468] hover:bg-[#F5F2ED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., How to solve Q3 in Exercise 4.2 when b² - 4ac < 0?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Problem Description & What You Tried <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Write the full problem statement, where you got stuck, or the specific step you want clarification on..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A4A3A] mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Quadratic, Factorization, Board 2026"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#6B665C] hover:bg-[#F5F2ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingQuestion ? 'Posting...' : 'Post Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
