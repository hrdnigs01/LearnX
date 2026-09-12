import React, { useState, useMemo, useEffect } from 'react';
import {
  accountancyMaterialData,
  ChapterMaterial,
  MCQItem,
  QAItem,
} from '../data/accountancyMaterial';
import { BiologyStudyMaterialView } from './BiologyStudyMaterialView';
import { BusinessStudiesStudyMaterialView } from './BusinessStudiesStudyMaterialView';
import { PhysicsStudyMaterialView } from './PhysicsStudyMaterialView';
import { MathematicsStudyMaterialView } from './MathematicsStudyMaterialView';
import { ScienceStudyMaterialView } from './ScienceStudyMaterialView';
import {
  BookOpen,
  Search,
  CheckCircle2,
  HelpCircle,
  FileText,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Calculator,
  Layers,
  ArrowRight,
  GraduationCap,
  Bookmark,
  Share2,
  Dna,
  Briefcase,
  Atom,
  FlaskConical,
  Download,
  FileDown,
} from 'lucide-react';
import { downloadStudyNotesPDF } from '../utils/pdfGenerator';
import { playChime } from '../utils/audio';

export type SubjectMaterialType = 'science' | 'mathematics' | 'business-studies' | 'physics' | 'biology' | 'accountancy';

interface StudyMaterialViewProps {
  initialChapter?: number;
  initialSubject?: SubjectMaterialType;
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type TabCategory =
  | 'all'
  | 'mcq'
  | '2marks'
  | '3marks'
  | '5marks'
  | 'formats'
  | 'cases'
  | 'blueprint';

export const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({
  initialChapter,
  initialSubject = 'biology',
  onOpenAiAssistant,
  onBackToNCERT,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectMaterialType>(
    initialSubject
  );
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>(
    initialChapter || 'all'
  );

  useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  useEffect(() => {
    if (initialChapter !== undefined) {
      setSelectedChapterNum(initialChapter);
    }
  }, [initialChapter]);
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selfTestMode, setSelfTestMode] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  const chapters = accountancyMaterialData.chapters;

  const handleDownloadAccountancyPDF = () => {
    setIsDownloadingPdf(true);
    playChime('click');
    try {
      const activeCh =
        selectedChapterNum === 'all'
          ? chapters[0]
          : chapters.find((c) => c.chapterNumber === selectedChapterNum) || chapters[0];

      const questionsList = [
        ...activeCh.mcqs.slice(0, 6).map((m) => ({
          question: m.question,
          answer: m.options[m.correctIndex],
          explanation: m.explanation,
          marks: 1,
        })),
        ...activeCh.veryShortQuestions.slice(0, 3).map((q) => ({
          question: q.question,
          answer: Array.isArray(q.answer) ? q.answer.join('; ') : q.answer,
          marks: 2,
        })),
        ...activeCh.shortQuestions.slice(0, 2).map((q) => ({
          question: q.question,
          answer: Array.isArray(q.answer) ? q.answer.join('; ') : q.answer,
          marks: 3,
        })),
      ];

      const success = downloadStudyNotesPDF({
        title: `Chapter ${activeCh.chapterNumber}: ${activeCh.title}`,
        subject: 'Accountancy',
        classLevel: '11',
        overview: activeCh.tagline,
        revisionNotes: activeCh.veryShortQuestions.slice(0, 6).map(
          (q) => `${q.question}: ${Array.isArray(q.answer) ? q.answer.join(' ') : q.answer}`
        ),
        questions: questionsList,
        studentName: 'Class 11 Scholar',
      });

      if (success) {
        playChime('success');
        setPdfNotice(`Accountancy Chapter ${activeCh.chapterNumber} Notes PDF downloaded successfully!`);
        setTimeout(() => setPdfNotice(null), 4500);
      }
    } catch (err) {
      console.error('Accountancy PDF export error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Filtered chapters based on selection
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // Handle MCQ selection
  const handleSelectOption = (mcqId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
  };

  const handleToggleExplanation = (mcqId: string) => {
    setRevealedExplanations((prev) => ({
      ...prev,
      [mcqId]: !prev[mcqId],
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Search filtering logic
  const matchesSearch = (text: string | string[]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (Array.isArray(text)) {
      return text.some((t) => t.toLowerCase().includes(q));
    }
    return text.toLowerCase().includes(q);
  };

  const totalMcqCount = useMemo(
    () => chapters.reduce((acc, c) => acc + c.mcqs.length, 0),
    [chapters]
  );
  const total2MarkCount = useMemo(
    () => chapters.reduce((acc, c) => acc + c.veryShortQuestions.length, 0),
    [chapters]
  );
  const total3MarkCount = useMemo(
    () => chapters.reduce((acc, c) => acc + c.shortQuestions.length, 0),
    [chapters]
  );
  const total5MarkCount = useMemo(
    () => chapters.reduce((acc, c) => acc + c.longQuestions.length, 0),
    [chapters]
  );

  return (
    <div className={`min-h-screen ${isPrintMode ? 'bg-white p-4' : 'bg-slate-50 py-4 sm:py-8 px-2.5 sm:px-6 lg:px-8'}`}>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Top Global Subject Switcher Bar */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 overflow-hidden w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1 whitespace-nowrap hidden sm:inline">
              Subject:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto flex-nowrap">
              <button
                onClick={() => setSelectedSubject('science')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'science'
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Science</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'science' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Class24 • 8 Ch
                </span>
              </button>

              <button
                onClick={() => setSelectedSubject('mathematics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'mathematics'
                    ? 'bg-[#5A634E] text-white shadow-sm shadow-[#5A634E]/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Mathematics</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'mathematics' ? 'bg-white/20 text-white' : 'bg-[#5A634E]/10 text-[#5A634E]'
                }`}>
                  14 Ch • MCQs
                </span>
              </button>

              <button
                onClick={() => setSelectedSubject('business-studies')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'business-studies'
                    ? 'bg-amber-700 text-white shadow-sm shadow-amber-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Business Studies</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'business-studies' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  30 MCQs
                </span>
              </button>

              <button
                onClick={() => setSelectedSubject('physics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'physics'
                    ? 'bg-cyan-700 text-white shadow-sm shadow-cyan-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                <span>Physics</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'physics' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
                }`}>
                  40 MCQs
                </span>
              </button>

              <button
                onClick={() => setSelectedSubject('biology')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'biology'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Dna className="w-3.5 h-3.5" />
                <span>Biology</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'biology' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  30 MCQs
                </span>
              </button>

              <button
                onClick={() => setSelectedSubject('accountancy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedSubject === 'accountancy'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Accountancy</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedSubject === 'accountancy' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  180+ Qs
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 pr-1">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] sm:text-xs">Class 11 CBSE Notes & Quiz</span>
            </div>
            {onBackToNCERT && (
              <button
                onClick={onBackToNCERT}
                className="sm:hidden text-[11px] text-[#5A634E] font-semibold underline underline-offset-2"
              >
                Back to NCERT
              </button>
            )}
          </div>
        </div>

        {selectedSubject === 'science' ? (
          <ScienceStudyMaterialView
            onOpenAiAssistant={onOpenAiAssistant}
            onBackToNCERT={onBackToNCERT}
          />
        ) : selectedSubject === 'mathematics' ? (
          <MathematicsStudyMaterialView
            onOpenAiAssistant={onOpenAiAssistant}
            onBackToNCERT={onBackToNCERT}
          />
        ) : selectedSubject === 'business-studies' ? (
          <BusinessStudiesStudyMaterialView
            onOpenAiAssistant={onOpenAiAssistant}
            onBackToNCERT={onBackToNCERT}
          />
        ) : selectedSubject === 'physics' ? (
          <PhysicsStudyMaterialView
            onOpenAiAssistant={onOpenAiAssistant}
            onBackToNCERT={onBackToNCERT}
          />
        ) : selectedSubject === 'biology' ? (
          <BiologyStudyMaterialView
            onOpenAiAssistant={onOpenAiAssistant}
            onBackToNCERT={onBackToNCERT}
          />
        ) : (
          <>
            {/* Top Header Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="bg-amber-400/20 text-amber-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-amber-400/30">
                  {accountancyMaterialData.edition}
                </span>
                <span className="bg-blue-500/20 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-400/20">
                  Class 11 Commerce
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-400/20 font-mono">
                  Full 14 Chapters Syllabus
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onBackToNCERT && (
                  <button
                    onClick={onBackToNCERT}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-white"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Back to NCERT
                  </button>
                )}
                <button
                  onClick={() => setIsPrintMode(!isPrintMode)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-white"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {isPrintMode ? 'Normal View' : 'Print View'}
                </button>
                <button
                  id="download-accountancy-pdf-btn"
                  onClick={handleDownloadAccountancyPDF}
                  disabled={isDownloadingPdf}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-colors flex items-center gap-1.5 shadow-sm active:scale-98 disabled:opacity-50"
                  title="Download Accountancy Revision Notes & Questions as a formatted PDF"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" />
                  {isDownloadingPdf ? 'Generating...' : 'Download Notes PDF'}
                </button>
                <button
                  onClick={() => setSelfTestMode(!selfTestMode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    selfTestMode
                      ? 'bg-amber-500 text-slate-900 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {selfTestMode ? 'Self-Test Active' : 'Self-Test Mode'}
                </button>
              </div>
            </div>

            {pdfNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{pdfNotice}</span>
              </div>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {accountancyMaterialData.title}
              </h1>
              <p className="text-sm sm:text-base text-indigo-200 mt-1 max-w-3xl">
                {accountancyMaterialData.school}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-indigo-300 block font-medium">Author & Faculty</span>
                <span className="text-white font-semibold text-sm block">
                  {accountancyMaterialData.author.name}
                </span>
                <span className="text-indigo-200 text-[11px] block">
                  {accountancyMaterialData.author.qualifications}
                </span>
                <span className="text-indigo-300 text-[11px] block mt-0.5">
                  {accountancyMaterialData.author.designation}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-indigo-300 block font-medium">Inspiration & Principle</span>
                <span className="text-amber-300 font-semibold text-sm block">
                  Luca Pacioli
                </span>
                <span className="text-indigo-200 text-[11px] block">
                  Father of Double Entry Accountancy
                </span>
                <span className="text-emerald-300 text-[11px] block mt-0.5 italic">
                  &ldquo;FAIL = First Attempt In Learning&rdquo;
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-indigo-300 block font-medium">Material Inclusions</span>
                <div className="flex flex-wrap gap-1.5 mt-1 text-[11px]">
                  <span className="bg-blue-500/30 px-2 py-0.5 rounded text-blue-200 font-medium">
                    {chapters.length} Chapters
                  </span>
                  <span className="bg-emerald-500/30 px-2 py-0.5 rounded text-emerald-200 font-medium">
                    {totalMcqCount} MCQs
                  </span>
                  <span className="bg-amber-500/30 px-2 py-0.5 rounded text-amber-200 font-medium">
                    {total2MarkCount} (2-Marks)
                  </span>
                  <span className="bg-purple-500/30 px-2 py-0.5 rounded text-purple-200 font-medium">
                    {total3MarkCount} (3-Marks)
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-indigo-300 block font-medium">Special Master Reference</span>
                <div className="text-indigo-100 text-[11px] space-y-0.5 mt-1">
                  <div>✓ 30 Master Standard Journal Entries</div>
                  <div>✓ 37-Item Master Trial Balance Pro-forma</div>
                  <div>✓ 15 Master Final Account Adjustments</div>
                  <div>✓ HOTS Case Studies & Problem Blueprint</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across questions, definitions, formulas, journal entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Chapter Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="chapter-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Chapter:
              </label>
              <select
                id="chapter-select"
                value={selectedChapterNum}
                onChange={(e) =>
                  setSelectedChapterNum(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[240px]"
              >
                <option value="all">All 14 Chapters</option>
                {chapters.map((c) => (
                  <option key={c.chapterNumber} value={c.chapterNumber}>
                    Ch {c.chapterNumber}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs sm:text-sm">
            {[
              { id: 'all', label: 'All Content', icon: BookOpen },
              { id: 'mcq', label: `MCQs (${totalMcqCount})`, icon: CheckCircle2 },
              { id: '2marks', label: `2 Marks (${total2MarkCount})`, icon: FileText },
              { id: '3marks', label: `3 Marks (${total3MarkCount})`, icon: Layers },
              { id: '5marks', label: '5 Marks & Distinctions', icon: Award },
              { id: 'formats', label: 'Master Tables & Formats', icon: Calculator },
              { id: 'cases', label: 'HOTS Case Studies (8)', icon: Sparkles },
              { id: 'blueprint', label: 'Exam Blueprint & Sums', icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabCategory)}
                  className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === 'cases' ? (
          /* HOTS Case Studies Section */
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-900">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Interior Compulsory & HOTS Practical Case Studies
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 mt-1">
                Analytical and situation-based questions designed for Class 11 Accountancy Higher Order Thinking Skills (HOTS) and compulsory board questions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {accountancyMaterialData.interiorCompulsoryCaseStudies.map((cs) => (
                <div
                  key={cs.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Case Study #{cs.caseNumber}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${cs.title}\n\nScenario:\n${cs.scenario}\n\nSolution:\n${cs.solutionKey.join('\n')}`,
                          cs.id
                        )
                      }
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                    >
                      {copiedId === cs.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === cs.id ? 'Copied' : 'Copy Case'}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{cs.title}</h3>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 italic">
                    &ldquo;{cs.scenario}&rdquo;
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Discussion & Problem Queries:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-800">
                      {cs.discussionPoints.map((dp, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {dp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Model Accounting Solution & Analysis:
                    </h4>
                    <ul className="space-y-1.5 text-sm text-emerald-950">
                      {cs.solutionKey.map((sol, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-emerald-700">•</span>
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {onOpenAiAssistant && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() =>
                          onOpenAiAssistant(
                            `Please explain this Class 11 Accountancy HOTS Case Study step-by-step with practical accounting rules: "${cs.title}" - Scenario: "${cs.scenario}"`
                          )
                        }
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Ask AI Doubt Solver to explain this case
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'blueprint' ? (
          /* Blueprint & Important Sums Section */
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-indigo-900">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-700" />
                Class 11 Accountancy Board Exam Blueprint & Important Sums Matrix
              </h2>
              <p className="text-xs sm:text-sm text-indigo-800 mt-1">
                Prepared by P. Vaheeswaran (Vice-Principal & PG Assistant). High-yield question distribution for 2-mark, 3-mark, and 5-mark examination problems.
              </p>
            </div>

            {/* Sums Matrix Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-base">
                  Chapter-Wise Important Problems (Illustrations & Exercises)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Ch No.</th>
                      <th className="py-3 px-4">Chapter Title</th>
                      <th className="py-3 px-4 text-emerald-700">2 Marks Problems</th>
                      <th className="py-3 px-4 text-blue-700">3 Marks Problems</th>
                      <th className="py-3 px-4 text-purple-700">5 Marks Comprehensive Sums</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {accountancyMaterialData.importantSumsMatrix.map((item) => (
                      <tr key={item.chapterNumber} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-indigo-700">{item.chapterNumber}</td>
                        <td className="py-3 px-4 font-semibold">{item.chapterTitle}</td>
                        <td className="py-3 px-4 text-emerald-800 font-mono text-xs">{item.twoMarkSums}</td>
                        <td className="py-3 px-4 text-blue-800 font-mono text-xs">{item.threeMarkSums}</td>
                        <td className="py-3 px-4 text-purple-900 font-mono text-xs font-semibold">{item.fiveMarkSums}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Theory Questions Bank */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-emerald-700">
                    <FileText className="w-4 h-4" />
                    Most Important 2-Marks
                  </h4>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    31 Questions
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1 text-xs text-slate-700">
                  {accountancyMaterialData.importantTheoryBank.twoMarks.map((q, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 hover:bg-emerald-50 transition-colors">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-blue-700">
                    <Layers className="w-4 h-4" />
                    Most Important 3-Marks
                  </h4>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    9 Questions
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1 text-xs text-slate-700">
                  {accountancyMaterialData.importantTheoryBank.threeMarks.map((q, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 hover:bg-blue-50 transition-colors">
                      {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 text-purple-700">
                    <Award className="w-4 h-4" />
                    Most Important 5-Marks
                  </h4>
                  <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                    9 Questions
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1 text-xs text-slate-700">
                  {accountancyMaterialData.importantTheoryBank.fiveMarks.map((q, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 hover:bg-purple-50 transition-colors">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chapter-wise Content (All, MCQ, 2Marks, 3Marks, 5Marks, Formats) */
          <div className="space-y-8">
            {currentChapters.map((ch) => {
              // Filter items inside this chapter based on activeTab & searchQuery
              const showMcq = (activeTab === 'all' || activeTab === 'mcq') && ch.mcqs.length > 0;
              const show2Marks = (activeTab === 'all' || activeTab === '2marks') && ch.veryShortQuestions.length > 0;
              const show3Marks = (activeTab === 'all' || activeTab === '3marks') && ch.shortQuestions.length > 0;
              const show5Marks = (activeTab === 'all' || activeTab === '5marks') && ch.longQuestions.length > 0;
              const showFormats = (activeTab === 'all' || activeTab === 'formats') && (ch.formatsAndTables?.length || 0) > 0;

              const filteredMcqs = ch.mcqs.filter((m) => matchesSearch(m.question) || matchesSearch(m.options) || matchesSearch(m.answerText));
              const filtered2Marks = ch.veryShortQuestions.filter((q) => matchesSearch(q.question) || matchesSearch(q.answer));
              const filtered3Marks = ch.shortQuestions.filter((q) => matchesSearch(q.question) || matchesSearch(q.answer));
              const filtered5Marks = ch.longQuestions.filter((q) => matchesSearch(q.question) || matchesSearch(q.answer));

              const hasContent =
                (showMcq && filteredMcqs.length > 0) ||
                (show2Marks && filtered2Marks.length > 0) ||
                (show3Marks && filtered3Marks.length > 0) ||
                (show5Marks && filtered5Marks.length > 0) ||
                showFormats;

              if (!hasContent) return null;

              return (
                <div
                  key={ch.chapterNumber}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden space-y-6 pb-6"
                >
                  {/* Chapter Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 text-xs font-bold rounded-full uppercase tracking-wider border border-indigo-400/30">
                          Chapter {ch.chapterNumber}
                        </span>
                        <span className="text-slate-400 text-xs">Class 11 Accountancy</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                        {ch.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">
                        {ch.tagline}
                      </p>
                    </div>

                    {onOpenAiAssistant && (
                      <button
                        onClick={() =>
                          onOpenAiAssistant(
                            `Explain Chapter ${ch.chapterNumber}: ${ch.title} of Class 11 Accountancy with key rules, formulas, and examples.`
                          )
                        }
                        className="self-start sm:self-auto px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Ask AI Doubt on Ch {ch.chapterNumber}
                      </button>
                    )}
                  </div>

                  <div className="px-6 space-y-8">
                    {/* 1. MCQS SECTION */}
                    {showMcq && filteredMcqs.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                            I. Choose the Correct Answer (MCQ Self-Test)
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {filteredMcqs.length} Questions
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {filteredMcqs.map((mcq, idx) => {
                            const isSelected = selectedAnswers[mcq.id] !== undefined;
                            const userChoice = selectedAnswers[mcq.id];
                            const isCorrect = userChoice === mcq.correctIndex;
                            const showExp = revealedExplanations[mcq.id];

                            return (
                              <div
                                key={mcq.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-50/50 border-emerald-200'
                                      : 'bg-rose-50/50 border-rose-200'
                                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-2 flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                      <span className="text-indigo-600 font-bold mr-1">
                                        Q{idx + 1}.
                                      </span>
                                      {mcq.question}
                                    </p>

                                    {/* Options Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                      {mcq.options.map((opt, optIdx) => {
                                        const optChosen = userChoice === optIdx;
                                        const isRightOpt = optIdx === mcq.correctIndex;
                                        let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                                        if (isSelected || !selfTestMode) {
                                          if (isRightOpt) {
                                            btnClass = 'bg-emerald-600 text-white font-bold border-emerald-600';
                                          } else if (optChosen && !isRightOpt) {
                                            btnClass = 'bg-rose-600 text-white font-bold border-rose-600';
                                          }
                                        }

                                        return (
                                          <button
                                            key={optIdx}
                                            onClick={() => handleSelectOption(mcq.id, optIdx)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm border transition-all flex items-center justify-between ${btnClass}`}
                                          >
                                            <span>{opt}</span>
                                            {(isSelected || !selfTestMode) && isRightOpt && (
                                              <Check className="w-4 h-4 ml-1 flex-shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleToggleExplanation(mcq.id)}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap bg-indigo-50 px-2.5 py-1 rounded-lg self-start mt-0.5"
                                  >
                                    {showExp ? 'Hide Note' : 'Explanation'}
                                  </button>
                                </div>

                                {showExp && mcq.explanation && (
                                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-bold text-slate-900 mr-1">
                                        Answer: {mcq.answerText}
                                      </span>
                                      — {mcq.explanation}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 2. VERY SHORT ANSWER QUESTIONS (2 MARKS) */}
                    {show2Marks && filtered2Marks.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            II. Very Short Answer Questions (2 Marks)
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {filtered2Marks.length} Questions
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filtered2Marks.map((qa, idx) => (
                            <div
                              key={qa.id}
                              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Q{idx + 1} (2 Marks)
                                  </span>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        `${qa.question}\n\nAnswer:\n${Array.isArray(qa.answer) ? qa.answer.join('\n') : qa.answer}`,
                                        qa.id
                                      )
                                    }
                                    className="text-slate-400 hover:text-indigo-600"
                                    title="Copy answer"
                                  >
                                    {copiedId === qa.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2">
                                  {qa.question}
                                </h4>
                                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                  {Array.isArray(qa.answer) ? (
                                    <ul className="space-y-1">
                                      {qa.answer.map((pt, pIdx) => (
                                        <li key={pIdx}>{pt}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    qa.answer
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. SHORT ANSWER QUESTIONS (3 MARKS) */}
                    {show3Marks && filtered3Marks.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            III. Short Answer Questions (3 Marks)
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {filtered3Marks.length} Questions
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {filtered3Marks.map((qa, idx) => (
                            <div
                              key={qa.id}
                              className="bg-blue-50/40 rounded-2xl p-5 border border-blue-100 hover:border-blue-200 transition-all space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                                  Question {idx + 1} (3 Marks)
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      `${qa.question}\n\nAnswer:\n${Array.isArray(qa.answer) ? qa.answer.join('\n') : qa.answer}`,
                                      qa.id
                                    )
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  {copiedId === qa.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedId === qa.id ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {qa.question}
                              </h4>
                              <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed pl-1">
                                {Array.isArray(qa.answer) ? (
                                  <div className="space-y-1.5">
                                    {qa.answer.map((pt, pIdx) => (
                                      <div key={pIdx} className="flex items-start gap-1.5">
                                        <span className="font-semibold text-blue-700">•</span>
                                        <span>{pt}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  qa.answer
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. LONG ANSWER QUESTIONS & DISTINCTION TABLES (5 MARKS) */}
                    {show5Marks && filtered5Marks.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600" />
                            IV. Comprehensive & Distinction Questions (5 Marks)
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {filtered5Marks.length} Questions
                          </span>
                        </div>

                        <div className="space-y-4">
                          {filtered5Marks.map((qa, idx) => (
                            <div
                              key={qa.id}
                              className="bg-purple-50/40 rounded-2xl p-5 border border-purple-100 hover:border-purple-200 transition-all space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
                                  Long Answer {idx + 1} (5 Marks)
                                </span>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      `${qa.question}\n\n${Array.isArray(qa.answer) ? qa.answer.join('\n') : qa.answer}`,
                                      qa.id
                                    )
                                  }
                                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                >
                                  {copiedId === qa.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedId === qa.id ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                {qa.question}
                              </h4>

                              {/* If distinction table exists */}
                              {qa.table && (
                                <div className="overflow-x-auto rounded-xl border border-purple-200 bg-white">
                                  <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-purple-100/70 text-purple-900 font-bold uppercase text-xs">
                                      <tr>
                                        {qa.table.headers.map((h, hIdx) => (
                                          <th key={hIdx} className="py-2.5 px-3.5">
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-purple-100 text-slate-800">
                                      {qa.table.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-purple-50/50">
                                          {row.map((cell, cIdx) => (
                                            <td
                                              key={cIdx}
                                              className={`py-2 px-3.5 ${
                                                cIdx === 0 ? 'font-semibold text-purple-950' : ''
                                              }`}
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* Normal Text / Bullet points */}
                              {qa.answer && !qa.table && (
                                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                  {Array.isArray(qa.answer) ? (
                                    <div className="space-y-1.5">
                                      {qa.answer.map((pt, pIdx) => (
                                        <div key={pIdx} className="flex items-start gap-1.5">
                                          <span className="font-semibold text-purple-700">•</span>
                                          <span>{pt}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    qa.answer
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. SPECIAL MASTER FORMATS & TABLES */}
                    {showFormats &&
                      ch.formatsAndTables &&
                      ch.formatsAndTables.map((fmt, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-white rounded-2xl border-2 border-indigo-200 p-5 space-y-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-amber-400 text-slate-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                                  Master Format Reference
                                </span>
                                <span className="text-xs text-indigo-600 font-semibold">
                                  Chapter {ch.chapterNumber}
                                </span>
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                                {fmt.title}
                              </h3>
                              {fmt.description && (
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                                  {fmt.description}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                const text = JSON.stringify(fmt.data, null, 2);
                                copyToClipboard(text, `fmt_${fIdx}`);
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg"
                            >
                              {copiedId === `fmt_${fIdx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              {copiedId === `fmt_${fIdx}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>

                          {/* Render Table Data if available */}
                          {fmt.data && fmt.columns && (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-xs border-b border-slate-200">
                                  <tr>
                                    {fmt.columns.map((c, cIdx) => (
                                      <th key={cIdx} className="py-2.5 px-3">
                                        {c}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-800">
                                  {fmt.data.map((rowItem: any, rIdx: number) => {
                                    // Journal entries row
                                    if (rowItem.txn) {
                                      return (
                                        <tr key={rIdx} className="hover:bg-slate-50">
                                          <td className="py-2 px-3 font-bold text-slate-500">{rowItem.no}</td>
                                          <td className="py-2 px-3 font-medium text-slate-900">{rowItem.txn}</td>
                                          <td className="py-2 px-3 text-indigo-700 font-mono text-xs whitespace-pre-line">{rowItem.dr}</td>
                                          <td className="py-2 px-3 text-purple-700 font-mono text-xs whitespace-pre-line">{rowItem.cr}</td>
                                          <td className="py-2 px-3 text-slate-500 text-xs">{rowItem.rule}</td>
                                        </tr>
                                      );
                                    }
                                    // Trial balance row
                                    if (rowItem.head) {
                                      return (
                                        <tr key={rIdx} className="hover:bg-slate-50">
                                          <td className="py-2 px-3 font-bold text-slate-500">{rowItem.no}</td>
                                          <td className="py-2 px-3 font-medium text-slate-900">{rowItem.head}</td>
                                          <td className="py-2 px-3">
                                            <span
                                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                rowItem.side === 'Debit'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : 'bg-emerald-100 text-emerald-800'
                                              }`}
                                            >
                                              {rowItem.side}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3 text-slate-600 text-xs">{rowItem.type}</td>
                                        </tr>
                                      );
                                    }
                                    // 15 Adjustments row
                                    if (rowItem.name) {
                                      return (
                                        <tr key={rIdx} className="hover:bg-slate-50">
                                          <td className="py-2 px-3 font-bold text-slate-500">{rowItem.no}</td>
                                          <td className="py-2 px-3 font-bold text-slate-900">{rowItem.name}</td>
                                          <td className="py-2 px-3 text-indigo-700 font-mono text-xs whitespace-pre-line">{rowItem.entry}</td>
                                          <td className="py-2 px-3 text-blue-800 text-xs">{rowItem.pl}</td>
                                          <td className="py-2 px-3 text-purple-800 text-xs">{rowItem.bs}</td>
                                        </tr>
                                      );
                                    }
                                    // BRS row
                                    if (rowItem.type) {
                                      return (
                                        <tr key={rIdx} className="hover:bg-slate-50">
                                          <td className="py-2 px-3 font-bold">
                                            <span
                                              className={`px-2 py-0.5 rounded text-xs ${
                                                rowItem.type === 'ADD'
                                                  ? 'bg-emerald-100 text-emerald-800'
                                                  : rowItem.type === 'LESS'
                                                  ? 'bg-rose-100 text-rose-800'
                                                  : 'bg-indigo-100 text-indigo-800 font-extrabold'
                                              }`}
                                            >
                                              {rowItem.type}
                                            </span>
                                          </td>
                                          <td className="py-2 px-3 font-medium text-slate-900">{rowItem.txn}</td>
                                          <td className="py-2 px-3 text-slate-600 text-xs">{rowItem.rule}</td>
                                        </tr>
                                      );
                                    }
                                    return null;
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info & faculty acknowledgment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            {accountancyMaterialData.school}
          </p>
          <p>
            Curated by <span className="font-bold text-slate-800">{accountancyMaterialData.author.name}</span> ({accountancyMaterialData.author.qualifications}), {accountancyMaterialData.author.designation}. Contact:{' '}
            <span className="font-mono text-indigo-600">{accountancyMaterialData.author.cell}</span> |{' '}
            <span className="font-mono text-indigo-600">{accountancyMaterialData.author.email}</span>
          </p>
          <p className="italic text-slate-400">
            &ldquo;Accounting is the language of business. Master the rules of debit and credit, and success will follow.&rdquo;
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
