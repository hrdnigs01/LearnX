import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Zap,
  HelpCircle,
  FileText,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  Check,
  Search,
  Layers,
  Calculator,
  Briefcase,
  TrendingUp,
  Atom,
  FlaskConical,
  Dna,
  Download,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { Subject, Chapter, User, SubjectMaterialType, FeedbackPageContext } from '../types';
import { playChime } from '../utils/audio';
import { downloadChapterNotesPDF } from '../utils/pdfGenerator';
import { ReportIssueModal } from './ReportIssueModal';
import { PostModuleFeedbackModal } from './PostModuleFeedbackModal';
import { DiscussionForumSection } from './DiscussionForumSection';

interface LearningViewProps {
  currentUser: User;
  classLevel: number;
  onClassChange?: (level: number) => void;
  stream?: string;
  onStreamChange?: (stream: string) => void;
  subjects: Subject[];
  chapters: Chapter[];
  selectedSubject: Subject | null;
  onSelectSubject: (sub: Subject | null) => void;
  selectedChapter: Chapter | null;
  onSelectChapter: (ch: Chapter | null) => void;
  onRefreshUser: () => void;
  onOpenStudyMaterial?: (chapterNumber?: number, subject?: SubjectMaterialType) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  currentUser,
  classLevel,
  onClassChange,
  stream = 'All',
  onStreamChange,
  subjects,
  chapters,
  selectedSubject,
  onSelectSubject,
  selectedChapter,
  onSelectChapter,
  onRefreshUser,
  onOpenStudyMaterial,
}) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'formulas' | 'notes' | 'mcq' | 'test' | 'discussion'>('concepts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState<string>(stream || 'All');

  // Bookmarking & Issue Reporting State
  const [savedBookmarkKeys, setSavedBookmarkKeys] = useState<Set<string>>(new Set());
  const [reportModalContext, setReportModalContext] = useState<FeedbackPageContext | null>(null);
  const [isPostFeedbackOpen, setIsPostFeedbackOpen] = useState(false);

  const handleSaveBookmark = async (
    type: 'concept' | 'formula' | 'question' | 'note_highlight',
    title: string,
    content: string,
    highlightColor: string = 'amber'
  ) => {
    const key = `${type}_${title}`;
    playChime('click');

    // Optimistic UI toggle
    setSavedBookmarkKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          content,
          highlightColor,
          subjectId: selectedChapter?.subjectId,
          subjectName: selectedSubject?.name,
          chapterId: selectedChapter?.id,
          chapterNumber: selectedChapter?.chapterNumber,
          chapterTitle: selectedChapter?.title,
          classLevel,
          tags: [selectedSubject?.name || 'Academic', `Ch ${selectedChapter?.chapterNumber || 1}`],
        }),
      });
      playChime('badge');
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleOpenReportIssue = (context: Partial<FeedbackPageContext>) => {
    playChime('click');
    setReportModalContext({
      subjectName: selectedSubject?.name,
      chapterTitle: selectedChapter?.title,
      chapterNumber: selectedChapter?.chapterNumber,
      tab: activeTab,
      ...context,
    });
  };

  // MCQ Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    xpEarned: number;
    results: any[];
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timed Test State
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testAnswers, setTestAnswers] = useState<{ [index: number]: number }>({});
  const [showLessonPicker, setShowLessonPicker] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfDownloadNotice, setPdfDownloadNotice] = useState<string | null>(null);

  const handleDownloadChapterPDF = () => {
    if (!selectedChapter) return;
    setIsDownloadingPdf(true);
    playChime('click');
    try {
      const subName = selectedSubject?.name || 'Science';
      const success = downloadChapterNotesPDF(selectedChapter, subName, currentUser?.name);
      if (success) {
        playChime('success');
        setPdfDownloadNotice(`Chapter ${selectedChapter.chapterNumber} Notes PDF downloaded successfully!`);
        setTimeout(() => setPdfDownloadNotice(null), 4500);
      }
    } catch (e) {
      console.error('Failed to generate chapter PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Filter subjects by stream when in Class 11 or 12
  const filteredSubjects = subjects.filter((s) => {
    if (classLevel < 11 || selectedStream === 'All') return true;
    return !s.stream || s.stream === 'All' || s.stream === selectedStream;
  });

  // Filter chapters by subject, class, stream and search query
  const relevantChapters = chapters.filter((c) => {
    const matchesClass = c.classLevel === classLevel;
    const matchesSubject = selectedSubject ? c.subjectId === selectedSubject.id : true;
    const matchesSearch = searchQuery.trim() === '' || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  // Find all chapters belonging to the currently selected subject (for previous/next lesson navigation)
  const currentSubjectChapters = selectedChapter
    ? chapters.filter((c) => c.subjectId === selectedChapter.subjectId && c.classLevel === selectedChapter.classLevel)
    : [];

  const currentLessonIndex = selectedChapter
    ? currentSubjectChapters.findIndex((c) => c.id === selectedChapter.id)
    : -1;

  const previousChapter = currentLessonIndex > 0 ? currentSubjectChapters[currentLessonIndex - 1] : null;
  const nextChapter =
    currentLessonIndex >= 0 && currentLessonIndex < currentSubjectChapters.length - 1
      ? currentSubjectChapters[currentLessonIndex + 1]
      : null;

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    playChime('click');
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitQuiz = async (type: 'mcq' | 'test') => {
    if (!selectedChapter) return;
    setIsSubmitting(true);

    const currentQuestions = type === 'test' ? selectedChapter.practiceTest.questions : selectedChapter.mcqs;
    const answersArray = currentQuestions.map((_, i) =>
      type === 'test' ? (testAnswers[i] !== undefined ? testAnswers[i] : -1) : (selectedAnswers[i] !== undefined ? selectedAnswers[i] : -1)
    );

    try {
      const res = await fetch('/api/curriculum/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: selectedChapter.id,
          answers: answersArray,
          type,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQuizResult(data);
        setQuizSubmitted(true);
        if (data.percentage >= 80) {
          playChime('badge');
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          playChime('success');
        }
        onRefreshUser();
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setTestAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setIsTakingTest(false);
  };

  const handleSwitchChapter = (targetChapter: Chapter) => {
    onSelectChapter(targetChapter);
    handleResetQuiz();
    setShowLessonPicker(false);
    // Also sync selected subject
    const parentSub = subjects.find((s) => s.id === targetChapter.subjectId);
    if (parentSub) {
      onSelectSubject(parentSub);
    }
  };

  const getSubjectIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('account')) return <Calculator className="w-4 h-4" />;
    if (lower.includes('business')) return <Briefcase className="w-4 h-4" />;
    if (lower.includes('econ')) return <TrendingUp className="w-4 h-4" />;
    if (lower.includes('phys')) return <Atom className="w-4 h-4" />;
    if (lower.includes('chem')) return <FlaskConical className="w-4 h-4" />;
    if (lower.includes('bio')) return <Dna className="w-4 h-4" />;
    if (lower.includes('math')) return <Calculator className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  // =========================================================================
  // VIEW 1: ACTIVE CHAPTER / LESSON STUDY VIEW
  // =========================================================================
  if (selectedChapter) {
    const parentSubject = subjects.find((s) => s.id === selectedChapter.subjectId);

    return (
      <div className="space-y-5 pb-12">
        {/* Top chapter navigation & quick lesson switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-[#E5E0D8] shadow-xs">
          <div className="flex items-center gap-2">
            <button
              id="back-to-lessons-btn"
              onClick={() => {
                onSelectChapter(null);
                handleResetQuiz();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] text-xs font-semibold border border-[#E5E0D8] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Lessons</span>
            </button>

            {/* Quick Lesson Selector Dropdown */}
            <div className="relative">
              <button
                id="lesson-selector-dropdown-btn"
                onClick={() => setShowLessonPicker(!showLessonPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF0E9] hover:bg-[#E1E7DB] text-[#5A634E] text-xs font-bold border border-[#D8DFD2] transition"
              >
                <span>
                  Lesson {selectedChapter.chapterNumber}
                  {currentSubjectChapters.length > 0 ? ` of ${currentSubjectChapters.length}` : ''}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showLessonPicker && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 p-2.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl z-50 animate-in fade-in">
                  <div className="text-[11px] font-bold text-[#8B8374] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>{parentSubject?.name || 'Lessons'} Curriculum</span>
                    <span className="text-[10px] text-[#5A634E] font-medium">Class {selectedChapter.classLevel}</span>
                  </div>
                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto pr-1">
                    {currentSubjectChapters.map((ch) => {
                      const isCurrent = ch.id === selectedChapter.id;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => handleSwitchChapter(ch)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-start justify-between gap-2 ${
                            isCurrent
                              ? 'bg-[#5A634E] text-white font-bold shadow-xs'
                              : 'hover:bg-[#F5F2ED] text-[#4A4A3A]'
                          }`}
                        >
                          <div>
                            <div className="text-[10px] opacity-75">Chapter {ch.chapterNumber}</div>
                            <div className="font-semibold line-clamp-1">{ch.title}</div>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 flex-shrink-0 mt-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Buttons: Previous / Next Lesson */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="prev-lesson-btn"
              disabled={!previousChapter}
              onClick={() => previousChapter && handleSwitchChapter(previousChapter)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                previousChapter
                  ? 'bg-white hover:bg-[#F5F2ED] text-[#4A4A3A] border-[#E5E0D8]'
                  : 'bg-[#F5F2ED] text-[#C4BEB4] border-transparent cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev Lesson</span>
            </button>

            <button
              id="next-lesson-btn"
              disabled={!nextChapter}
              onClick={() => nextChapter && handleSwitchChapter(nextChapter)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                nextChapter
                  ? 'bg-[#5A634E] hover:bg-[#484F3E] text-white border-[#5A634E] shadow-xs'
                  : 'bg-[#F5F2ED] text-[#C4BEB4] border-transparent cursor-not-allowed opacity-60'
              }`}
            >
              <span className="hidden sm:inline">Next Lesson</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chapter Header Card */}
        <div className="p-6 sm:p-7 rounded-[32px] bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]">
                {parentSubject?.name || 'Curriculum'}
              </span>
              <span className="text-[11px] font-semibold text-[#8B8374]">
                Class {selectedChapter.classLevel} NCERT • Chapter {selectedChapter.chapterNumber}
              </span>
            </div>

            {classLevel === 11 && onOpenStudyMaterial && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => onOpenStudyMaterial(selectedChapter.chapterNumber, 'mathematics')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200 transition shadow-2xs"
                >
                  <Calculator className="w-3 h-3 text-emerald-700" />
                  <span>Math 14 Ch & Upload Quiz</span>
                </button>
                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'business-studies')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 transition shadow-2xs"
                >
                  <Briefcase className="w-3 h-3 text-amber-700" />
                  <span>Business Studies Notes & 30 MCQs</span>
                </button>
                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'physics')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-[11px] font-bold border border-cyan-200 transition shadow-2xs"
                >
                  <Atom className="w-3 h-3 text-cyan-700" />
                  <span>Physics Notes & 40 MCQs</span>
                </button>
                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'biology')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 text-[11px] font-bold border border-rose-200 transition shadow-2xs"
                >
                  <Dna className="w-3 h-3 text-rose-700" />
                  <span>Biology Notes & 30 MCQs</span>
                </button>
                <button
                  onClick={() => onOpenStudyMaterial(selectedChapter.chapterNumber, 'accountancy')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition shadow-2xs"
                >
                  <Calculator className="w-3 h-3 text-indigo-600" />
                  <span>Accountancy Full Material</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
                {selectedChapter.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#7A7468] max-w-3xl leading-relaxed">
                {selectedChapter.overview}
              </p>
            </div>
            <button
              id="download-chapter-pdf-btn"
              onClick={handleDownloadChapterPDF}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EDF0E9] hover:bg-[#DEE4D8] border border-[#5A634E]/30 text-[#5A634E] font-bold text-xs shadow-2xs transition active:scale-98 flex-shrink-0 self-start disabled:opacity-50"
              title="Download full revision notes, key concepts, and practice questions as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF Notes'}</span>
            </button>
          </div>

          {pdfDownloadNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{pdfDownloadNotice}</span>
            </div>
          )}

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-[#E5E0D8]">
            {[
              { id: 'concepts', label: `Key Concepts (${selectedChapter.keyConcepts.length})`, icon: BookOpen },
              { id: 'formulas', label: `Formulas & Rules (${selectedChapter.formulas.length})`, icon: Zap },
              { id: 'notes', label: `Revision Notes (${selectedChapter.revisionNotes.length})`, icon: FileText },
              { id: 'mcq', label: `MCQ Quiz (${selectedChapter.mcqs.length})`, icon: HelpCircle },
              { id: 'test', label: 'Timed Board Mock', icon: Clock },
              { id: 'discussion', label: 'Peer Q&A Forum', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    handleResetQuiz();
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#5A634E] text-white shadow-xs'
                      : 'bg-[#F5F2ED] text-[#7A7468] hover:text-[#4A4A3A] hover:bg-[#EBE7DF] border border-[#E5E0D8]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Key Concepts */}
        {activeTab === 'concepts' && (
          <div className="space-y-4">
            {selectedChapter.keyConcepts.map((concept, idx) => {
              const isSaved = savedBookmarkKeys.has(`concept_${concept.title}`);
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-[#EDF0E9] text-[#5A634E] text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#4A4A3A] font-serif">{concept.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSaveBookmark('concept', concept.title, concept.explanation, 'amber')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                          isSaved
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-[#FDFBF7] text-[#6B665C] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                        }`}
                        title="Save to your bookmarks & notes"
                      >
                        <Bookmark className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
                        <span>{isSaved ? 'Saved' : 'Save Note'}</span>
                      </button>

                      <button
                        onClick={() =>
                          handleOpenReportIssue({
                            questionText: concept.title,
                          })
                        }
                        className="p-1.5 rounded-full text-[#8C8476] hover:text-amber-700 hover:bg-amber-50 transition"
                        title="Report typo or error in this concept"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6B665C] leading-relaxed whitespace-pre-line pl-9">
                    {concept.explanation}
                  </p>
                  {concept.example && (
                    <div className="ml-9 p-3 rounded-2xl bg-[#F5F2ED] border border-[#E5E0D8] text-xs text-[#5A634E] font-medium">
                      <span className="font-bold">Real-world NCERT Illustration: </span>
                      {concept.example}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Formulas & Rules */}
        {activeTab === 'formulas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {selectedChapter.formulas.map((formula, idx) => {
              const isSaved = savedBookmarkKeys.has(`formula_${formula}`);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#E5E0D8] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FDF2E9] text-[#AF601A] flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-medium text-[#4A4A3A]">
                      {formula}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveBookmark('formula', `Formula #${idx + 1}`, formula, 'emerald')}
                    className={`p-2 rounded-xl border transition flex-shrink-0 ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-[#FDFBF7] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                    }`}
                    title="Bookmark formula"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Revision Notes */}
        {activeTab === 'notes' && (
          <div className="p-6 sm:p-7 rounded-[32px] bg-white border border-[#E5E0D8] space-y-4 shadow-xs">
            <h3 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5A634E]" />
              <span>NCERT Quick Revision Bullet Points</span>
            </h3>
            <ul className="space-y-2.5">
              {selectedChapter.revisionNotes.map((note, idx) => {
                const isSaved = savedBookmarkKeys.has(`note_highlight_Revision Note ${idx + 1}`);
                return (
                  <li key={idx} className="flex items-start justify-between gap-2.5 text-xs sm:text-sm text-[#6B665C] leading-relaxed group">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A634E] mt-2 flex-shrink-0" />
                      <span>{note}</span>
                    </div>
                    <button
                      onClick={() => handleSaveBookmark('note_highlight', `Revision Note ${idx + 1}`, note, 'sky')}
                      className={`opacity-60 group-hover:opacity-100 transition p-1 rounded-md text-[11px] ${
                        isSaved ? 'text-sky-700 opacity-100' : 'text-[#8C8476] hover:text-[#4A4A3A]'
                      }`}
                      title="Save note to bookmarks"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Tab 4: MCQ Quiz */}
        {activeTab === 'mcq' && (
          <div className="space-y-4">
            {/* Quiz Results Summary banner if submitted */}
            {quizSubmitted && quizResult && (
              <div className="p-6 rounded-3xl bg-[#EDF0E9] border border-[#D8DFD2] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#5A634E]" />
                    <h3 className="text-base font-bold text-[#5A634E]">Quiz Assessment Report</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#5A634E] text-white text-xs font-bold">
                    Score: {quizResult.score} / {quizResult.total} ({quizResult.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-[#5A634E]/90">
                  Great effort! You earned <span className="font-bold text-[#AF601A]">+{quizResult.xpEarned} XP</span> towards your streak & leaderboard rank.
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-xs font-bold text-[#5A634E] border border-[#D8DFD2] hover:bg-[#F5F2ED] transition shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                  <button
                    onClick={() => setIsPostFeedbackOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5A634E] text-white text-xs font-bold hover:bg-[#484F3E] transition shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rate Module / Suggestion</span>
                  </button>
                </div>
              </div>
            )}

            {/* Questions List */}
            {selectedChapter.mcqs.map((q, idx) => {
              const selectedOpt = selectedAnswers[idx];
              const isCorrect = selectedOpt === q.correctIndex;
              return (
                <div key={q.id} className="p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#8B8374]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#4A4A3A]">Question {idx + 1}</span>
                      <button
                        onClick={() =>
                          handleOpenReportIssue({
                            questionId: q.id,
                            questionText: q.question,
                            selectedAnswer: selectedOpt !== undefined ? q.options[selectedOpt] : undefined,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-[#8C8476] hover:text-amber-700 hover:underline px-1.5 py-0.5 rounded transition"
                        title="Report typo, wrong answer, or glitch in this question"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Report Issue</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-semibold text-[#AF601A]">+20 XP</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#4A4A3A]">{q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let btnStyle = 'bg-[#F5F2ED] hover:bg-[#EBE7DF] border-[#E5E0D8] text-[#4A4A3A]';
                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-[#D5F5E3] border-[#27AE60] text-[#1E8449] font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-[#FADBD8] border-[#E74C3C] text-[#922B21]';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#EDF0E9] border-[#5A634E] text-[#5A634E] font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(idx, optIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-[#27AE60]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-2xl bg-[#F5F2ED] text-xs text-[#6B665C] border border-[#E5E0D8]">
                      <span className="font-bold text-[#4A4A3A]">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted && (
              <button
                disabled={isSubmitting || Object.keys(selectedAnswers).length === 0}
                onClick={() => handleSubmitQuiz('mcq')}
                className="w-full py-3.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] disabled:opacity-50 text-white font-bold text-sm shadow-xs transition"
              >
                {isSubmitting ? 'Evaluating Answers...' : 'Submit Answers & Earn XP'}
              </button>
            )}
          </div>
        )}

        {/* Tab 5: Timed Board Mock */}
        {activeTab === 'test' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-[#AF601A] uppercase tracking-wider">
                  CBSE / NCERT Pattern Exam
                </span>
                <h3 className="text-base font-serif font-bold text-[#4A4A3A]">
                  {selectedChapter.practiceTest.title}
                </h3>
                <p className="text-xs text-[#8B8374]">
                  Duration: {selectedChapter.practiceTest.durationMinutes} mins • Total Marks: {selectedChapter.practiceTest.totalMarks}
                </p>
              </div>
            </div>

            {/* Questions list for practice test */}
            <div className="space-y-4">
              {selectedChapter.practiceTest.questions.map((q, idx) => (
                <div key={q.id} className="p-6 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-[#8B8374]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#4A4A3A]">Question {idx + 1}</span>
                      <button
                        onClick={() =>
                          handleOpenReportIssue({
                            questionId: q.id,
                            questionText: q.question,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-[#8C8476] hover:text-amber-700 hover:underline px-1.5 py-0.5 rounded transition"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Report</span>
                      </button>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E9E4DB] text-[#5A634E] font-medium">
                      {q.marks} Marks
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#4A4A3A]">{q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => {
                          playChime('click');
                          setTestAnswers((prev) => ({ ...prev, [idx]: optIdx }));
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition ${
                          testAnswers[idx] === optIdx
                            ? 'bg-[#EDF0E9] border-[#5A634E] text-[#5A634E] font-semibold'
                            : 'bg-[#F5F2ED] hover:bg-[#EBE7DF] border-[#E5E0D8] text-[#4A4A3A]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleSubmitQuiz('test')}
                className="w-full py-3.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white font-bold text-sm shadow-xs transition"
              >
                Submit Practice Test & Get Detailed Marks Report
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: Peer Q&A Forum */}
        {activeTab === 'discussion' && (
          <DiscussionForumSection
            currentUser={currentUser}
            currentSubjectId={selectedChapter.subjectId}
            currentSubjectName={parentSubject?.name}
            currentChapterId={selectedChapter.id}
            currentChapterNumber={selectedChapter.chapterNumber}
            currentChapterTitle={selectedChapter.title}
            classLevel={classLevel}
            onRefreshUser={onRefreshUser}
          />
        )}

        {/* Report Issue Modal */}
        {reportModalContext && (
          <ReportIssueModal
            isOpen={!!reportModalContext}
            onClose={() => setReportModalContext(null)}
            context={reportModalContext}
          />
        )}

        {/* Post Module Feedback Modal */}
        {isPostFeedbackOpen && (
          <PostModuleFeedbackModal
            isOpen={isPostFeedbackOpen}
            onClose={() => setIsPostFeedbackOpen(false)}
            moduleName={parentSubject?.name || 'Academic Subject'}
            chapterTitle={`Ch ${selectedChapter.chapterNumber}: ${selectedChapter.title}`}
            score={quizResult?.score}
            total={quizResult?.total}
          />
        )}

        {/* Bottom Next Chapter Recommender */}
        {nextChapter && (
          <div className="mt-8 p-6 rounded-3xl bg-[#F5F2ED] border border-[#E5E0D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A634E]">
                Next in Syllabus
              </span>
              <h4 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A]">
                Chapter {nextChapter.chapterNumber}: {nextChapter.title}
              </h4>
              <p className="text-xs text-[#7A7468] line-clamp-1">{nextChapter.description}</p>
            </div>
            <button
              onClick={() => handleSwitchChapter(nextChapter)}
              className="px-5 py-2.5 rounded-full bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition flex-shrink-0"
            >
              <span>Continue to Next Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: SUBJECTS & CHAPTERS BROWSING / SELECTION OVERVIEW
  // =========================================================================
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Grade / Class Selector Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#4A4A3A]">Choose Grade / Class</h3>
              <p className="text-[11px] text-[#8B8374]">Select your standard to explore complete NCERT subjects & chapters</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#5A634E] bg-[#EDF0E9] px-3 py-1 rounded-full border border-[#D8DFD2] self-start sm:self-auto">
            Active: Class {classLevel}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {[6, 7, 8, 9, 10, 11, 12].map((lvl) => {
            const isSelected = classLevel === lvl;
            return (
              <button
                key={lvl}
                id={`choose-class-btn-${lvl}`}
                onClick={() => {
                  if (onClassChange) onClassChange(lvl);
                  onSelectSubject(null);
                  onSelectChapter(null);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#5A634E] text-white shadow-xs'
                    : 'bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#6B665C] border border-[#E5E0D8]'
                }`}
              >
                <span>Class {lvl}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Stream Selector Strip for Senior Secondary (Class 11 & 12) */}
      {classLevel >= 11 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#F5F2ED] border border-[#E5E0D8] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-white text-[#AF601A] flex items-center justify-center font-bold text-xs">
                🎓
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#4A4A3A]">Class {classLevel} Academic Stream</h3>
                <p className="text-[11px] text-[#7A7468]">
                  Commerce includes Accountancy, Business Studies & Economics
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'All', label: 'All Streams', desc: 'All subjects' },
              { id: 'Commerce', label: 'Commerce 📈', desc: 'Accountancy, BST, Econ' },
              { id: 'Science', label: 'Science 🔬', desc: 'Physics, Chem, Math, Bio' },
              { id: 'Arts', label: 'Humanities / Arts 🎨', desc: 'English Core & Electives' },
            ].map((st) => {
              const isSelected = selectedStream === st.id;
              return (
                <button
                  key={st.id}
                  id={`choose-stream-${st.id}`}
                  onClick={() => {
                    setSelectedStream(st.id);
                    if (onStreamChange) onStreamChange(st.id);
                    onSelectSubject(null);
                  }}
                  className={`p-3 rounded-2xl text-left border transition ${
                    isSelected
                      ? 'bg-white border-[#5A634E] shadow-xs text-[#5A634E]'
                      : 'bg-white/60 hover:bg-white border-[#E5E0D8] text-[#6B665C]'
                  }`}
                >
                  <div className="text-xs font-bold">{st.label}</div>
                  <div className="text-[10px] text-[#8B8374] mt-0.5">{st.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Class 11 Multi-Subject Study Material Banner */}
          {onOpenStudyMaterial && (
            <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col gap-3 shadow-sm border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase">
                      New 2024-25 Editions
                    </span>
                    <span className="text-amber-200 text-xs font-semibold">
                      Class 11 Study Material & Quiz Arena
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    4 Master Subjects: Business Studies, Physics, Biology & Accountancy
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Over 280+ CBSE MCQs, chapter notes, numerical formula vaults, and HOTS case studies.
                  </p>
                </div>

                <button
                  onClick={() => onOpenStudyMaterial()}
                  className="self-start sm:self-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View All Subjects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subject Direct Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'business-studies')}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Business Studies</div>
                    <div className="text-[10px] text-amber-200/70">Ch 3, 5, 6 • 30 Qs</div>
                  </div>
                </button>

                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'physics')}
                  className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left transition flex items-center gap-2"
                >
                  <Atom className="w-4 h-4 text-cyan-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Physics</div>
                    <div className="text-[10px] text-cyan-200/70">Ch 1-4 • 40 Qs</div>
                  </div>
                </button>

                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'biology')}
                  className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition flex items-center gap-2"
                >
                  <Dna className="w-4 h-4 text-rose-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Biology</div>
                    <div className="text-[10px] text-rose-200/70">Ch 1-3 • 30 Qs</div>
                  </div>
                </button>

                <button
                  onClick={() => onOpenStudyMaterial(undefined, 'accountancy')}
                  className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-left transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-indigo-300 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">Accountancy</div>
                    <div className="text-[10px] text-indigo-200/70">14 Chs • 180+ Qs</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Search & Subject Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#4A4A3A] tracking-tight">
              Class {classLevel} {selectedStream !== 'All' ? selectedStream : ''} Curriculum
            </h2>
            <p className="text-xs text-[#8B8374]">
              Select a subject or choose any chapter below to start studying
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-[#8B8374] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapters or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-full bg-white border border-[#E5E0D8] text-xs text-[#4A4A3A] placeholder-[#8B8374] focus:outline-none focus:border-[#5A634E] shadow-2xs"
            />
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => onSelectSubject(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition ${
              selectedSubject === null
                ? 'bg-[#5A634E] text-white shadow-xs'
                : 'bg-white border border-[#E5E0D8] text-[#7A7468] hover:bg-[#F5F2ED]'
            }`}
          >
            All Subjects ({filteredSubjects.length})
          </button>
          {filteredSubjects.map((sub) => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#5A634E] text-white shadow-xs'
                    : 'bg-white border border-[#E5E0D8] text-[#7A7468] hover:bg-[#F5F2ED]'
                }`}
              >
                {getSubjectIcon(sub.name)}
                <span>{sub.name}</span>
                {sub.stream && sub.stream !== 'All' && (
                  <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-white/20' : 'bg-[#F5F2ED] text-[#8B8374]'}`}>
                    {sub.stream}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Subject Cards Grid (when no subject is currently filtered) */}
      {!selectedSubject && searchQuery === '' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubject(sub)}
              className="p-5 rounded-3xl bg-white border border-[#E5E0D8] hover:border-[#5A634E]/50 hover:shadow-md cursor-pointer transition flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#EDF0E9] text-[#5A634E] flex items-center justify-center group-hover:scale-105 transition">
                    {getSubjectIcon(sub.name)}
                  </div>
                  <div className="flex items-center gap-1">
                    {sub.stream && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#7A7468] border border-[#E5E0D8]">
                        {sub.stream}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#8B8374]">{sub.code}</span>
                  </div>
                </div>

                <h3 className="text-base font-serif font-bold text-[#4A4A3A] group-hover:text-[#5A634E] transition">
                  {sub.name}
                </h3>
                <p className="text-xs text-[#7A7468] line-clamp-2 leading-relaxed">
                  {sub.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs text-[#5A634E] font-semibold">
                <span>{sub.chaptersCount} Chapters</span>
                <span className="group-hover:translate-x-1 transition flex items-center gap-1">
                  <span>Browse Lessons</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Chapter Cards / Lessons List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#4A4A3A]">
            {selectedSubject ? `${selectedSubject.name} Lessons` : 'Available NCERT Chapters'}
          </h3>
          <span className="text-xs text-[#8B8374]">{relevantChapters.length} lessons available</span>
        </div>

        {relevantChapters.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] text-center text-[#8B8374] text-xs space-y-2">
            <p>No specific chapters found matching your filter.</p>
            <p className="text-[11px] text-[#5A634E]">Try selecting another subject or clearing your search.</p>
            <button
              onClick={() => {
                onSelectSubject(null);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-1.5 rounded-full bg-[#EDF0E9] text-[#5A634E] text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          relevantChapters.map((chapter) => {
            const sub = subjects.find((s) => s.id === chapter.subjectId);
            return (
              <div
                key={chapter.id}
                id={`lesson-card-${chapter.id}`}
                onClick={() => onSelectChapter(chapter)}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E0D8] hover:border-[#5A634E]/50 hover:shadow-md cursor-pointer transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF0E9] text-[#5A634E] border border-[#D8DFD2]">
                      Chapter {chapter.chapterNumber}
                    </span>
                    {sub && (
                      <span className="text-xs font-semibold text-[#4A4A3A] flex items-center gap-1">
                        {getSubjectIcon(sub.name)}
                        <span>{sub.name}</span>
                      </span>
                    )}
                    <span className="text-xs text-[#8B8374]">• Class {chapter.classLevel}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#4A4A3A] group-hover:text-[#5A634E] transition">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-[#7A7468] line-clamp-2 leading-relaxed">
                    {chapter.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#8B8374]">
                    <span>{chapter.keyConcepts.length} Key Concepts</span>
                    <span>•</span>
                    <span>{chapter.formulas.length} Formulas</span>
                    <span>•</span>
                    <span className="text-[#AF601A] font-semibold">
                      {chapter.mcqs.length} MCQs (+{chapter.mcqs.length * 20} XP)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <span className="text-xs font-semibold text-[#5A634E] group-hover:underline flex items-center gap-1">
                    <span>Study Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
