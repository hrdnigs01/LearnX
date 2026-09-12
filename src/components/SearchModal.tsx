import React, { useState } from 'react';
import { Search, X, Globe, BookOpen, UserCheck, ShoppingBag, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { Subject, Chapter, TuitionProfile, MarketplaceItem, WebSearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  chapters: Chapter[];
  tuitions: TuitionProfile[];
  marketplace: MarketplaceItem[];
  onSelectChapter: (chapter: Chapter) => void;
  onSelectTuition: (tuition: TuitionProfile) => void;
  onSelectMarketplace: (item: MarketplaceItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  subjects,
  chapters,
  tuitions,
  marketplace,
  onSelectChapter,
  onSelectTuition,
  onSelectMarketplace,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'web'>('all');
  const [webResult, setWebResult] = useState<WebSearchResult | null>(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Local match
  const filteredChapters = q
    ? chapters.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : [];

  const filteredTuitions = q
    ? tuitions.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const filteredMarketplace = q
    ? marketplace.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const handleWebSearch = async () => {
    if (!query.trim()) return;
    setIsSearchingWeb(true);
    setActiveTab('web');
    try {
      const res = await fetch('/api/search/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setWebResult(data.result);
      }
    } catch (err) {
      console.error('Web search error:', err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FDFBF7] border border-[#E5E0D8] rounded-[28px] shadow-2xl overflow-hidden mt-6 sm:mt-12 animate-in fade-in zoom-in-95">
        {/* Input header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E0D8] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#5A634E]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleWebSearch();
            }}
            placeholder="Search NCERT chapters, tutors, used books, or press Enter for Google Search..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setWebResult(null);
              }}
              className="text-[#8B8374] hover:text-[#4A4A3A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#7A7468] text-xs font-semibold"
          >
            Esc
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E5E0D8] px-4 py-2 gap-2 bg-[#F5F2ED]/50">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'all'
                ? 'bg-[#5A634E] text-white shadow-xs'
                : 'text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            LearnX Platform Results
          </button>
          <button
            onClick={handleWebSearch}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'web'
                ? 'bg-[#5A634E] text-white shadow-xs'
                : 'text-[#7A7468] hover:text-[#4A4A3A]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Google Real-Time Web Search</span>
          </button>
        </div>

        {/* Body content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'web' ? (
            <div>
              {isSearchingWeb ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#8B8374] gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5A634E]" />
                  <p className="text-xs">Searching verified web sources with Google Search grounding...</p>
                </div>
              ) : webResult ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#5A634E] mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI-Generated Verified Summary</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A4A3A] leading-relaxed whitespace-pre-line">
                      {webResult.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B8374] mb-2">
                      Verified Web Sources ({webResult.sources.length})
                    </h4>
                    <div className="space-y-2">
                      {webResult.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-3.5 rounded-2xl bg-white hover:bg-[#F5F2ED] border border-[#E5E0D8] hover:border-[#5A634E]/40 transition group shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif font-bold text-[#4A4A3A] group-hover:text-[#5A634E]">
                              {src.title}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#8B8374] group-hover:text-[#5A634E]" />
                          </div>
                          <div className="text-[11px] text-[#8B8374] truncate mt-0.5">{src.uri}</div>
                          {src.snippet && (
                            <p className="text-[11px] text-[#7A7468] mt-1 line-clamp-2">{src.snippet}</p>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#8B8374] text-xs">
                  Type a topic (e.g. "CBSE Board date sheet 2026", "Newton's laws practical examples") and hit search.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!q ? (
                <div className="text-center py-8 text-[#8B8374] text-xs">
                  Start typing to find NCERT notes, quizzes, tutors, used books, or project services.
                </div>
              ) : (
                <>
                  {filteredChapters.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8B8374] mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#5A634E]" />
                        <span>NCERT Chapters ({filteredChapters.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {filteredChapters.map((ch) => (
                          <div
                            key={ch.id}
                            onClick={() => {
                              onSelectChapter(ch);
                              onClose();
                            }}
                            className="p-3 rounded-2xl bg-white hover:bg-[#F5F2ED] cursor-pointer border border-[#E5E0D8] transition shadow-xs"
                          >
                            <div className="text-xs font-serif font-bold text-[#4A4A3A]">
                              Ch {ch.chapterNumber}: {ch.title}
                            </div>
                            <div className="text-[11px] text-[#8B8374] line-clamp-1">{ch.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredTuitions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8B8374] mb-2">
                        <UserCheck className="w-3.5 h-3.5 text-[#5A634E]" />
                        <span>Tutors & Coaching ({filteredTuitions.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {filteredTuitions.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              onSelectTuition(t);
                              onClose();
                            }}
                            className="p-3 rounded-2xl bg-white hover:bg-[#F5F2ED] cursor-pointer border border-[#E5E0D8] transition flex items-center justify-between shadow-xs"
                          >
                            <div>
                              <div className="text-xs font-serif font-bold text-[#4A4A3A]">{t.name}</div>
                              <div className="text-[11px] text-[#8B8374]">{t.location} • ₹{t.fees}/mo</div>
                            </div>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] font-semibold uppercase border border-[#D8DFD2]">
                              {t.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredMarketplace.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8B8374] mb-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#5A634E]" />
                        <span>Marketplace Items ({filteredMarketplace.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {filteredMarketplace.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              onSelectMarketplace(item);
                              onClose();
                            }}
                            className="p-3 rounded-2xl bg-white hover:bg-[#F5F2ED] cursor-pointer border border-[#E5E0D8] transition flex items-center justify-between shadow-xs"
                          >
                            <div>
                              <div className="text-xs font-serif font-bold text-[#4A4A3A]">{item.title}</div>
                              <div className="text-[11px] text-[#8B8374]">{item.category} • {item.location}</div>
                            </div>
                            <span className="text-xs font-serif font-bold text-[#5A634E]">
                              {item.isExchange ? 'Exchange' : `₹${item.price}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredChapters.length === 0 &&
                    filteredTuitions.length === 0 &&
                    filteredMarketplace.length === 0 && (
                      <div className="text-center py-6 text-[#8B8374] text-xs">
                        No in-app items found for "{query}".
                        <button
                          onClick={handleWebSearch}
                          className="block mx-auto mt-2 text-[#5A634E] font-semibold hover:underline"
                        >
                          Search Google Real-Time Web for "{query}" →
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
