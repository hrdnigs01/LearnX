import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bug,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Star,
  ExternalLink,
  ChevronDown,
  Send,
  User as UserIcon,
  Tag,
  Check,
  RefreshCw,
} from 'lucide-react';
import { UserFeedback, FeedbackCategory } from '../types';
import { safeFetchJson } from '../utils/api';
import { playChime } from '../utils/audio';

export const AdminFeedbackDashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      let url = '/api/feedback/list?';
      if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

      const data = await safeFetchJson<{ success: boolean; feedbacks: UserFeedback[] }>(url);
      if (data?.success) {
        setFeedbacks(data.feedbacks);
        if (data.feedbacks.length > 0 && !selectedFeedback) {
          setSelectedFeedback(data.feedbacks[0]);
          setAdminResponseText(data.feedbacks[0].adminResponse || '');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [categoryFilter, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    setIsUpdatingStatus(true);
    playChime('click');
    try {
      const res = await fetch(`/api/feedback/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: adminResponseText.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        playChime('badge');
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === id ? data.feedback : f))
        );
        setSelectedFeedback(data.feedback);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const categoryIcons: Record<string, any> = {
    general: MessageSquare,
    feature_request: Sparkles,
    bug: Bug,
    content_issue: AlertTriangle,
  };

  const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    open: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    closed: { bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' },
  };

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#4A4A3A]">
                User Feedback & Content Issue Dispatcher
              </h2>
              <p className="text-xs text-[#7A7468]">
                Real-time queue of bug reports, feature suggestions, and verified student doubt submissions
              </p>
            </div>
          </div>

          <button
            onClick={fetchFeedbacks}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] hover:bg-[#F5F2ED] text-xs font-semibold text-[#6B665C] transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-[#E5E0D8]">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-[#8C8476] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFeedbacks()}
              placeholder="Search title, student, or chapter..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E]"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'content_issue', label: 'Content Issues' },
              { id: 'bug', label: 'Bugs' },
              { id: 'feature_request', label: 'Features' },
              { id: 'general', label: 'General' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition border ${
                  categoryFilter === cat.id
                    ? 'bg-[#5A634E] text-white border-[#5A634E]'
                    : 'bg-white text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 justify-end">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'open', label: 'Open' },
              { id: 'resolved', label: 'Resolved' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold transition border ${
                  statusFilter === st.id
                    ? 'bg-[#4A4A3A] text-white border-[#4A4A3A]'
                    : 'bg-white text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split View: Left List (5 cols), Right Detail (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Submissions List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#8A8274] bg-white rounded-3xl border border-[#E5E0D8]">
              Loading feedback stream...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8A8274] bg-white rounded-3xl border border-[#E5E0D8]">
              No submissions match the current filter.
            </div>
          ) : (
            feedbacks.map((item) => {
              const Icon = categoryIcons[item.category] || MessageSquare;
              const isSelected = selectedFeedback?.id === item.id;
              const statusInfo = statusStyles[item.status] || statusStyles.open;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedFeedback(item);
                    setAdminResponseText(item.adminResponse || '');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#5A634E] shadow-sm ring-1 ring-[#5A634E]'
                      : 'bg-[#FAF8F5] border-[#E5E0D8] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{item.category.replace('_', ' ')}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            (item.rating || 5) >= s ? 'fill-amber-400 text-amber-400' : 'text-[#D0C9BE]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#4A4A3A] font-serif line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-[#6B665C] line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#8C8476] pt-1 border-t border-[#EBE6DC]">
                    <span>By {item.userName || 'Anonymous'}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Submission Details & Resolution Management */}
        <div className="lg:col-span-7">
          {selectedFeedback ? (
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#E5E0D8] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] uppercase">
                      ID: {selectedFeedback.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 uppercase">
                      Category: {selectedFeedback.category}
                    </span>
                    {selectedFeedback.issueType && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                        {selectedFeedback.issueType.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                    {selectedFeedback.title}
                  </h3>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-[#FDFBF7] px-2.5 py-1 rounded-xl border border-[#E5E0D8]">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-[#4A4A3A]">{selectedFeedback.rating || 5}/5</span>
                </div>
              </div>

              {/* Student and Context Meta */}
              <div className="p-3.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E3DA] grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C8476] block">Submitted By</span>
                  <span className="font-semibold text-[#4A4A3A]">{selectedFeedback.userName}</span>
                  <div className="text-[10px] text-[#7A7468]">{selectedFeedback.userEmail}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C8476] block">Module Context</span>
                  <span className="font-semibold text-[#4A4A3A]">
                    {selectedFeedback.pageContext?.subjectName || 'Study Suite'}
                  </span>
                  <div className="text-[10px] text-[#7A7468]">
                    {selectedFeedback.pageContext?.chapterTitle || 'Chapter Module'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C8476] block">Date Logged</span>
                  <span className="font-semibold text-[#4A4A3A]">
                    {new Date(selectedFeedback.createdAt).toLocaleDateString()}
                  </span>
                  <div className="text-[10px] text-[#7A7468]">
                    {new Date(selectedFeedback.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div>
                <label className="text-xs font-bold text-[#4A4A3A] uppercase tracking-wider block mb-1">
                  Submission Notes
                </label>
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs text-[#555046] leading-relaxed whitespace-pre-line">
                  {selectedFeedback.description}
                </div>
              </div>

              {/* Auto-Captured Details if present */}
              {selectedFeedback.pageContext?.questionText && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Captured Question Context
                  </span>
                  <p className="italic text-[#7A5515]">
                    "{selectedFeedback.pageContext.questionText}"
                  </p>
                  {selectedFeedback.pageContext.selectedAnswer && (
                    <div className="text-[11px] text-[#7A5515]">
                      Student Choice: <strong>{selectedFeedback.pageContext.selectedAnswer}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {selectedFeedback.tags && selectedFeedback.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedFeedback.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Admin Action & Status Update */}
              <div className="p-4 rounded-2xl bg-[#F4F6F2] border border-[#D5DDD0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4A4A3A] uppercase tracking-wider">
                    Administrative Action & Status
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      statusStyles[selectedFeedback.status]?.bg
                    } ${statusStyles[selectedFeedback.status]?.text}`}
                  >
                    Current: {selectedFeedback.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#6B665C] block mb-1">
                    Student Resolution Note (Auto-sent to student's inbox):
                  </label>
                  <textarea
                    value={adminResponseText}
                    onChange={(e) => setAdminResponseText(e.target.value)}
                    placeholder="e.g., Thank you! The solution key for Question 3 has been corrected in the latest NCERT release."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-[#D5DDD0] bg-white text-xs text-[#4A4A3A] focus:outline-hidden focus:border-[#5A634E] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 flex-wrap pt-1">
                  <button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'in_progress')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200"
                  >
                    Mark In Progress
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'resolved')}
                    disabled={isUpdatingStatus}
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve & Notify Student</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'closed')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#8A8274] bg-white rounded-3xl border border-[#E5E0D8]">
              Select a feedback or issue report from the left queue to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
