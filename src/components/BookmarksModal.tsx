import React, { useState, useEffect } from 'react';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  BookOpen,
  Zap,
  HelpCircle,
  FileText,
  Copy,
  Check,
  Tag,
  Plus,
  Share2,
} from 'lucide-react';
import { SavedBookmark, BookmarkContentType } from '../types';
import { safeFetchJson } from '../utils/api';
import { playChime } from '../utils/audio';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateChapter?: (chapterNumber: number, subjectName?: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  onNavigateChapter,
}) => {
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const data = await safeFetchJson<{ success: boolean; bookmarks: SavedBookmark[] }>('/api/bookmarks');
      if (data?.success) {
        setBookmarks(data.bookmarks);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookmarks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: string) => {
    playChime('click');
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Delete bookmark error:', e);
    }
  };

  const handleSaveNotes = async (b: SavedBookmark) => {
    playChime('click');
    setBookmarks((prev) =>
      prev.map((item) => (item.id === b.id ? { ...item, userNotes: editedNotes } : item))
    );
    setEditingId(null);
    try {
      // Re-save with updated notes
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, userNotes: editedNotes }),
      });
    } catch (e) {
      console.error('Update notes error:', e);
    }
  };

  const handleCopyText = (b: SavedBookmark) => {
    navigator.clipboard.writeText(`${b.title}\n\n${b.content}${b.userNotes ? `\n\nPersonal Note: ${b.userNotes}` : ''}`);
    setCopiedId(b.id);
    playChime('click');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = bookmarks.filter((b) => {
    if (activeFilter !== 'all' && b.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.title.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        b.userNotes?.toLowerCase().includes(q) ||
        b.subjectName?.toLowerCase().includes(q) ||
        b.tags?.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const colorStyles: Record<string, string> = {
    amber: 'border-l-4 border-amber-400 bg-amber-50/40',
    emerald: 'border-l-4 border-emerald-400 bg-emerald-50/40',
    sky: 'border-l-4 border-sky-400 bg-sky-50/40',
    rose: 'border-l-4 border-rose-400 bg-rose-50/40',
    purple: 'border-l-4 border-purple-400 bg-purple-50/40',
  };

  const typeIcons: Record<string, any> = {
    concept: BookOpen,
    formula: Zap,
    question: HelpCircle,
    note_highlight: FileText,
    revision_point: BookmarkCheck,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#4A4A3A]">
                Saved Notes & Highlights
              </h2>
              <p className="text-[11px] text-[#7A7468]">
                {bookmarks.length} high-yield concepts, formulas & annotations saved to your profile
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

        {/* Filter Bar & Search */}
        <div className="px-6 py-3 border-b border-[#E5E0D8] bg-white space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8476] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved formulas, concepts, or your personal annotations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#4A4A3A] placeholder-[#A0988A] focus:outline-hidden focus:border-[#5A634E] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'concept', label: 'Concepts' },
              { id: 'formula', label: 'Formulas & Rules' },
              { id: 'note_highlight', label: 'Highlighted Notes' },
              { id: 'question', label: 'Questions' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                  activeFilter === f.id
                    ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                    : 'bg-[#FDFBF7] text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-[#FBF9F5]">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#8A8274]">Loading saved study notes...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#4A4A3A] font-serif">No Bookmarks in This Category</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto">
                While studying any chapter concepts, formulas, or notes, click the <strong>Bookmark / Save Note</strong> icon to curate your personal board exam revision notebook.
              </p>
            </div>
          ) : (
            filtered.map((b) => {
              const Icon = typeIcons[b.type] || Bookmark;
              const colorClass = colorStyles[b.highlightColor || 'amber'];
              const isEditingThis = editingId === b.id;

              return (
                <div
                  key={b.id}
                  className={`p-4.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs space-y-2.5 transition ${colorClass}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] uppercase">
                          <Icon className="w-3 h-3" />
                          <span>{b.type.replace('_', ' ')}</span>
                        </span>
                        {b.subjectName && (
                          <span className="text-[11px] font-semibold text-[#8C8476]">
                            {b.subjectName} {b.chapterNumber ? `• Ch ${b.chapterNumber}` : ''}
                          </span>
                        )}
                        {b.chapterTitle && (
                          <span className="text-[11px] text-[#6B665C] truncate max-w-[200px]">
                            {b.chapterTitle}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#4A4A3A] font-serif">{b.title}</h3>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleCopyText(b)}
                        className="p-1.5 rounded-lg text-[#7A7468] hover:text-[#4A4A3A] hover:bg-[#F5F2ED] transition"
                        title="Copy note text"
                      >
                        {copiedId === b.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {b.chapterNumber && onNavigateChapter && (
                        <button
                          onClick={() => {
                            onNavigateChapter(b.chapterNumber!, b.subjectName);
                            onClose();
                          }}
                          className="p-1.5 rounded-lg text-[#5A634E] hover:bg-[#EDF0E9] transition"
                          title="Open chapter in NCERT"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg text-[#8C8476] hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Core Content */}
                  <div className="text-xs text-[#555046] leading-relaxed whitespace-pre-line bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE7DE]">
                    {b.content}
                  </div>

                  {/* Personal Annotations */}
                  <div className="pt-1">
                    {isEditingThis ? (
                      <div className="space-y-2">
                        <textarea
                          value={editedNotes}
                          onChange={(e) => setEditedNotes(e.target.value)}
                          placeholder="Add your personal memory hook, exam tip, or mentor remarks..."
                          rows={2}
                          className="w-full p-2 rounded-xl border border-[#5A634E] bg-white text-xs text-[#4A4A3A] focus:outline-hidden resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px] text-[#7A7468] hover:bg-[#EAE5DC]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(b)}
                            className="px-3 py-1 rounded-lg bg-[#5A634E] text-white text-[11px] font-bold"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : b.userNotes ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-[#7A5515] flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            My Personal Note
                          </span>
                          <p className="italic">{b.userNotes}</p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingId(b.id);
                            setEditedNotes(b.userNotes || '');
                          }}
                          className="text-[10px] font-bold text-amber-800 hover:underline flex-shrink-0"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(b.id);
                          setEditedNotes('');
                        }}
                        className="text-[11px] text-[#5A634E] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add personal study note / memory trick</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between text-xs text-[#7A7468]">
          <span>Synced locally & securely with your LearnX account</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#5A634E] text-white font-bold hover:bg-[#484F3E] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
