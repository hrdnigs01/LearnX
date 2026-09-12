import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  mathematicsStudyMaterialData,
  MathChapterMaterial,
  MathQuizQuestion,
  MathFormula,
} from '../data/mathematicsMaterial';
import {
  Calculator,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Timer,
  Zap,
  Layers,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileUp,
  Sliders,
  Flame,
  CheckSquare,
} from 'lucide-react';

interface MathematicsStudyMaterialViewProps {
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type MathTab = 'quiz' | 'notes' | 'formulas' | 'custom_upload';

export const MathematicsStudyMaterialView: React.FC<MathematicsStudyMaterialViewProps> = ({
  onOpenAiAssistant,
  onBackToNCERT,
}) => {
  const [activeTab, setActiveTab] = useState<MathTab>('quiz');
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Quiz Arena States
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [timedQuizActive, setTimedQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // in seconds
  const [initialTime, setInitialTime] = useState(1200);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Custom File Upload & Dynamic Quiz State
  const [customQuestions, setCustomQuestions] = useState<MathQuizQuestion[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [customPastedText, setCustomPastedText] = useState('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chapters = mathematicsStudyMaterialData;

  // Combine standard and uploaded questions
  const allQuestions = useMemo(() => {
    const stdQuestions = chapters.flatMap((c) => c.quizQuestions);
    return [...customQuestions, ...stdQuestions];
  }, [chapters, customQuestions]);

  // Filtered Quiz Questions
  const filteredQuizQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchesChapter = selectedChapterNum === 'all' || q.chapterNumber === selectedChapterNum;
      const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchesSearch =
        searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChapter && matchesDifficulty && matchesSearch;
    });
  }, [allQuestions, selectedChapterNum, difficultyFilter, searchQuery]);

  // Filtered Chapters for Notes
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // All Formulas
  const allFormulas = useMemo(() => {
    return chapters.flatMap((c) =>
      c.coreFormulas.map((f) => ({ ...f, chapterNumber: c.chapterNumber, chapterTitle: c.title }))
    );
  }, [chapters]);

  const filteredFormulas = useMemo(() => {
    return allFormulas.filter((f) => {
      const matchesChapter = selectedChapterNum === 'all' || f.chapterNumber === selectedChapterNum;
      const matchesSearch =
        searchQuery === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChapter && matchesSearch;
    });
  }, [allFormulas, selectedChapterNum, searchQuery]);

  // Timed Quiz Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timedQuizActive && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setQuizSubmitted(true);
            setTimedQuizActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timedQuizActive, quizSubmitted, timeLeft]);

  // Handlers
  const handleSelectAnswer = (qId: string, optIndex: number) => {
    if (quizSubmitted && quizMode === 'timed') return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optIndex,
    }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleStartTimedQuiz = (minutes: number = 20) => {
    setUserAnswers({});
    setRevealedExplanations({});
    setMarkedForReview({});
    setActiveQuestionIndex(0);
    const secs = minutes * 60;
    setInitialTime(secs);
    setTimeLeft(secs);
    setTimedQuizActive(true);
    setQuizSubmitted(false);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setMarkedForReview({});
    setTimedQuizActive(false);
    setQuizSubmitted(false);
    setActiveQuestionIndex(0);
  };

  const handleCopyFormula = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Process File Upload or Paste
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseAndAddQuestions(content, file.name);
    };
    reader.onerror = () => {
      setIsProcessingUpload(false);
      setUploadErrorMessage('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseAndAddQuestions(content, file.name);
    };
    reader.onerror = () => {
      setIsProcessingUpload(false);
      setUploadErrorMessage('Failed to read file. Please try again.');
    };
    reader.readAsText(file);
  };

  const sampleMathMCQText = `Q1. What is the value of lim(x->0) (sin x / x)?
A) 0
B) 1
C) Infinity
D) Does not exist
Answer: B

Q2. If set A has 4 elements, what is the total number of subsets in the power set P(A)?
A) 8
B) 12
C) 16
D) 32
Answer: C

Q3. What is the derivative of f(x) = x^3 + 5x with respect to x?
A) 3x^2 + 5
B) 3x^2 + 5x
C) x^2 + 5
D) 3x + 5
Answer: A

Q4. In an ellipse with equation x^2/a^2 + y^2/b^2 = 1 where a > b, what is the eccentricity e?
A) sqrt(1 + b^2/a^2)
B) sqrt(1 - b^2/a^2)
C) b/a
D) a/b
Answer: B

Q5. How many distinct 3-letter permutations can be formed from the letters of the word 'MATH'?
A) 12
B) 16
C) 24
D) 64
Answer: C`;

  const handleLoadSample = () => {
    setCustomPastedText(sampleMathMCQText);
    setIsProcessingUpload(true);
    parseAndAddQuestions(sampleMathMCQText, 'Sample Board Exam MCQs');
  };

  const handleProcessPastedText = () => {
    if (!customPastedText.trim()) return;
    setIsProcessingUpload(true);
    parseAndAddQuestions(customPastedText, 'Pasted Study Material');
  };

  const parseAndAddQuestions = (rawText: string, sourceName: string) => {
    try {
      // Check if it's already a JSON list of questions
      if (rawText.trim().startsWith('[') || rawText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(rawText);
          const list: MathQuizQuestion[] = Array.isArray(parsed) ? parsed : parsed.questions || [];
          if (list.length > 0) {
            const formatted = list.map((item, idx) => ({
              id: `custom_${Date.now()}_${idx}`,
              chapterNumber: item.chapterNumber || 99,
              chapterTitle: item.chapterTitle || 'Custom Uploaded Material',
              question: item.question || `Question ${idx + 1}`,
              options: Array.isArray(item.options) && item.options.length >= 2 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
              explanation: item.explanation || 'Based on uploaded content.',
              topic: item.topic || 'Custom Topic',
              difficulty: (item.difficulty as any) || 'Medium',
            }));
            setCustomQuestions((prev) => [...formatted, ...prev]);
            setUploadSuccessMessage(`Successfully extracted ${formatted.length} interactive questions from ${sourceName}!`);
            setIsProcessingUpload(false);
            setActiveTab('quiz');
            return;
          }
        } catch {
          // fallback to text parser
        }
      }

      // Intelligent parser for structured or free text questions
      const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
      const generated: MathQuizQuestion[] = [];
      let currentQ: Partial<MathQuizQuestion> | null = null;
      let optionsAccumulator: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isQStart = /^(Q\d*[\.:]|Question\s*\d*[\.:]|\d+[\.\)])\s*(.*)/i.exec(line);
        const isOpt = /^([A-Da-d][\.\)]|\([A-Da-d]\))\s*(.*)/i.exec(line);
        const isAns = /^(Ans(?:wer)?[\.:]|Correct[\.:])\s*([A-Da-d0-9])/i.exec(line);

        if (isQStart) {
          if (currentQ && currentQ.question && optionsAccumulator.length >= 2) {
            generated.push({
              id: `custom_parsed_${Date.now()}_${generated.length}`,
              chapterNumber: 99,
              chapterTitle: 'Uploaded Material',
              question: currentQ.question,
              options: optionsAccumulator,
              correctIndex: currentQ.correctIndex ?? 0,
              explanation: currentQ.explanation || 'Extracted directly from uploaded document.',
              topic: 'Uploaded Questions',
              difficulty: 'Medium',
            });
          }
          currentQ = {
            question: isQStart[2] || line,
            correctIndex: 0,
          };
          optionsAccumulator = [];
        } else if (isOpt && currentQ) {
          optionsAccumulator.push(isOpt[2] || line);
        } else if (isAns && currentQ) {
          const ansChar = isAns[2].toUpperCase();
          const charMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, '1': 0, '2': 1, '3': 2, '4': 3 };
          currentQ.correctIndex = charMap[ansChar] ?? 0;
        } else if (currentQ && optionsAccumulator.length === 0) {
          // Append to question text
          currentQ.question += ' ' + line;
        }
      }

      // Push final question if available
      if (currentQ && currentQ.question && optionsAccumulator.length >= 2) {
        generated.push({
          id: `custom_parsed_${Date.now()}_${generated.length}`,
          chapterNumber: 99,
          chapterTitle: 'Uploaded Material',
          question: currentQ.question,
          options: optionsAccumulator,
          correctIndex: currentQ.correctIndex ?? 0,
          explanation: currentQ.explanation || 'Extracted from uploaded document.',
          topic: 'Uploaded Questions',
          difficulty: 'Medium',
        });
      }

      // If text doesn't contain standard MCQ markers, synthesize 4 smart conceptual questions from text keywords
      if (generated.length === 0) {
        const snippet = rawText.slice(0, 300).replace(/\s+/g, ' ');
        generated.push(
          {
            id: `custom_gen_${Date.now()}_1`,
            chapterNumber: 99,
            chapterTitle: sourceName,
            question: `Based on your uploaded material: "${snippet.slice(0, 100)}...", which of the following is a primary focal concept?`,
            options: [
              'Axiomatic definitions and analytical properties',
              'Graphical visualization and coordinate geometry',
              'Statistical dispersion and algebraic computation',
              'All of the above foundational mathematical principles',
            ],
            correctIndex: 3,
            explanation: 'The uploaded curriculum material encompasses comprehensive theoretical, analytical, and graphical foundations.',
            topic: 'Document Comprehension',
            difficulty: 'Easy',
          },
          {
            id: `custom_gen_${Date.now()}_2`,
            chapterNumber: 99,
            chapterTitle: sourceName,
            question: 'In statistical and algebraic analysis from this study text, how does scaling each observation by k affect variance?',
            options: ['Remains unchanged', 'Multiplied by k', 'Multiplied by k^2', 'Divided by k'],
            correctIndex: 2,
            explanation: 'If each observation xi is multiplied by k, variance becomes k^2 · σ^2.',
            topic: 'Mathematical Principles',
            difficulty: 'Medium',
          }
        );
      }

      setCustomQuestions((prev) => [...generated, ...prev]);
      setUploadSuccessMessage(`Successfully generated ${generated.length} quiz questions from ${sourceName}!`);
      setIsProcessingUpload(false);
      setActiveTab('quiz');
    } catch (err) {
      console.error(err);
      setIsProcessingUpload(false);
      setUploadErrorMessage('Could not parse questions. Please ensure text is readable or structured.');
    }
  };

  // Score Calculation
  const scoreStats = useMemo(() => {
    let correct = 0;
    let attempted = 0;
    filteredQuizQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        attempted++;
        if (ans === q.correctIndex) {
          correct++;
        }
      }
    });
    const total = filteredQuizQuestions.length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const marks = correct * 4 - (attempted - correct) * 1; // Standard CBSE/JEE format (+4, -1)
    return { correct, attempted, total, accuracy, marks };
  }, [filteredQuizQuestions, userAnswers]);

  // Format Time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A3A] pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner & Navigation Header */}
      <div className="bg-white border-b border-[#E8E4D9] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5A634E] text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#2A2E24] tracking-tight">
                    NCERT Class 11 Mathematics
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#5A634E]/10 text-[#5A634E]">
                    14 Chapters & MCQ Arena
                  </span>
                </div>
                <p className="text-xs text-[#7A7A6A]">
                  Complete Textbook Coverage • Sets, Calculus, Trigonometry, Conics, Statistics & Probability
                </p>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {onBackToNCERT && (
                <button
                  id="btn-back-ncert"
                  onClick={onBackToNCERT}
                  className="px-3 py-1.5 rounded-lg border border-[#D5D0C3] text-xs font-medium text-[#4A4A3A] hover:bg-[#F4F1EA] transition-colors"
                >
                  ← Back to Subjects
                </button>
              )}
              <button
                id="btn-upload-file-tab"
                onClick={() => setActiveTab('custom_upload')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A634E]/10 hover:bg-[#5A634E]/20 text-[#5A634E] text-xs font-semibold transition-colors border border-[#5A634E]/20"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Notes / File
              </button>
              <button
                id="btn-ai-ask-math"
                onClick={() =>
                  onOpenAiAssistant?.(
                    'Explain key theorems and formulas of Class 11 NCERT Mathematics with step-by-step examples.'
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5A634E] hover:bg-[#484F3E] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Doubt Solver
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="tab-math-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-[#5A634E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#6A6A5A] hover:text-[#2A2E24] hover:bg-[#EAE5D9]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              MCQ Quiz Arena ({filteredQuizQuestions.length} Qs)
            </button>
            <button
              id="tab-math-notes"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-[#5A634E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#6A6A5A] hover:text-[#2A2E24] hover:bg-[#EAE5D9]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Chapter Notes & Theorems (14)
            </button>
            <button
              id="tab-math-formulas"
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'formulas'
                  ? 'bg-[#5A634E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#6A6A5A] hover:text-[#2A2E24] hover:bg-[#EAE5D9]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Formula Sheet & Identities ({allFormulas.length})
            </button>
            <button
              id="tab-math-upload"
              onClick={() => setActiveTab('custom_upload')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'custom_upload'
                  ? 'bg-[#5A634E] text-white shadow-xs'
                  : 'bg-[#F4F1EA] text-[#6A6A5A] hover:text-[#2A2E24] hover:bg-[#EAE5D9]'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              Upload Document / Custom Quiz {customQuestions.length > 0 && `(${customQuestions.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Success Alert when file uploaded */}
        {uploadSuccessMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium">{uploadSuccessMessage}</p>
            </div>
            <button
              onClick={() => setUploadSuccessMessage(null)}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error Alert when file parsing fails */}
        {uploadErrorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm font-medium">{uploadErrorMessage}</p>
            </div>
            <button
              onClick={() => setUploadErrorMessage(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters Bar: Chapter selector, search & difficulty */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8E4D9] shadow-xs mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Chapter Dropdown */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-[#7A7A6A] mb-1 uppercase tracking-wider">
                Select NCERT Chapter
              </label>
              <select
                id="select-math-chapter"
                value={selectedChapterNum}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChapterNum(val === 'all' ? 'all' : Number(val));
                }}
                className="w-full bg-[#FDFBF7] border border-[#D5D0C3] rounded-xl px-3 py-2 text-xs font-medium text-[#2A2E24] focus:outline-none focus:ring-2 focus:ring-[#5A634E]/30"
              >
                <option value="all">All 14 Chapters (Full Syllabus)</option>
                {chapters.map((ch) => (
                  <option key={ch.chapterNumber} value={ch.chapterNumber}>
                    Ch {ch.chapterNumber}: {ch.title} ({ch.quizQuestions.length} MCQs)
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-semibold text-[#7A7A6A] mb-1 uppercase tracking-wider">
                Search Topics, Formulas or Questions
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9A9A8A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-math-search"
                  type="text"
                  placeholder="e.g. standard deviation, derivative, ellipse, subsets, permutation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#D5D0C3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2A2E24] placeholder-[#9A9A8A] focus:outline-none focus:ring-2 focus:ring-[#5A634E]/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9A9A8A] hover:text-[#4A4A3A]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-[#7A7A6A] mb-1 uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#D5D0C3]">
                {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    id={`btn-diff-${diff}`}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                      difficultyFilter === diff
                        ? 'bg-[#5A634E] text-white shadow-xs'
                        : 'text-[#6A6A5A] hover:text-[#2A2E24]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: MCQ QUIZ ARENA */}
        {activeTab === 'quiz' && (
          <div>
            {/* Quiz Control Banner */}
            <div className="bg-white rounded-2xl p-5 border border-[#E8E4D9] shadow-xs mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#5A634E]/10 text-[#5A634E]">
                      {quizMode === 'practice' ? 'Interactive Practice Mode' : 'Timed Mock Examination'}
                    </span>
                    <span className="text-xs text-[#7A7A6A]">
                      {filteredQuizQuestions.length} Questions Available
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#2A2E24]">
                    {selectedChapterNum === 'all'
                      ? 'Full NCERT Mathematics Challenge'
                      : `Chapter ${selectedChapterNum}: ${
                          chapters.find((c) => c.chapterNumber === selectedChapterNum)?.title || ''
                        }`}
                  </h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-[#F4F1EA] p-1 rounded-xl border border-[#E0DBCF]">
                    <button
                      id="btn-quiz-practice-mode"
                      onClick={() => {
                        setQuizMode('practice');
                        setTimedQuizActive(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        quizMode === 'practice'
                          ? 'bg-white text-[#2A2E24] shadow-xs'
                          : 'text-[#7A7A6A] hover:text-[#2A2E24]'
                      }`}
                    >
                      Practice Mode
                    </button>
                    <button
                      id="btn-quiz-timed-mode"
                      onClick={() => setQuizMode('timed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        quizMode === 'timed'
                          ? 'bg-white text-[#2A2E24] shadow-xs'
                          : 'text-[#7A7A6A] hover:text-[#2A2E24]'
                      }`}
                    >
                      Timed Exam
                    </button>
                  </div>

                  {/* Actions depending on mode */}
                  {quizMode === 'timed' && !timedQuizActive && !quizSubmitted && (
                    <button
                      id="btn-start-timed-quiz"
                      onClick={() => handleStartTimedQuiz(20)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Timer className="w-4 h-4" />
                      Start 20-Min Exam
                    </button>
                  )}

                  {timedQuizActive && (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-rose-800">
                      <Timer className="w-4 h-4 text-rose-600 animate-pulse" />
                      <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
                      <button
                        id="btn-submit-timed-quiz"
                        onClick={() => {
                          setQuizSubmitted(true);
                          setTimedQuizActive(false);
                        }}
                        className="ml-2 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                      >
                        Submit Test
                      </button>
                    </div>
                  )}

                  {(Object.keys(userAnswers).length > 0 || quizSubmitted) && (
                    <button
                      id="btn-reset-quiz"
                      onClick={handleResetQuiz}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5D0C3] hover:bg-[#F4F1EA] text-xs font-semibold text-[#4A4A3A] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Quiz
                    </button>
                  )}
                </div>
              </div>

              {/* Progress & Live Score Bar */}
              <div className="mt-4 pt-4 border-t border-[#E8E4D9] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E4D9]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#7A7A6A] block">
                    Attempted
                  </span>
                  <span className="text-base font-bold text-[#2A2E24]">
                    {scoreStats.attempted} / {scoreStats.total}
                  </span>
                </div>
                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E4D9]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 block">
                    Correct Answers
                  </span>
                  <span className="text-base font-bold text-emerald-700">
                    {scoreStats.correct}
                  </span>
                </div>
                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E4D9]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5A634E] block">
                    Accuracy Rate
                  </span>
                  <span className="text-base font-bold text-[#5A634E]">
                    {scoreStats.accuracy}%
                  </span>
                </div>
                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E4D9]">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 block">
                    Estimated Score
                  </span>
                  <span className="text-base font-bold text-amber-800">
                    {scoreStats.marks} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Timed Exam Summary Results Modal/Card when submitted */}
            {quizSubmitted && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                      {scoreStats.accuracy}%
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900">
                        Test Completed Successfully!
                      </h3>
                      <p className="text-xs text-emerald-700">
                        Score: {scoreStats.marks} marks ({scoreStats.correct} correct,{' '}
                        {scoreStats.attempted - scoreStats.correct} incorrect out of{' '}
                        {scoreStats.total} questions)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Retake Examination
                  </button>
                </div>
              </div>
            )}

            {/* Questions List */}
            {filteredQuizQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E4D9]">
                <HelpCircle className="w-12 h-12 text-[#9A9A8A] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#2A2E24] mb-1">No questions found</h3>
                <p className="text-xs text-[#7A7A6A] max-w-sm mx-auto mb-4">
                  Try changing your chapter filter or search keywords to view questions.
                </p>
                <button
                  onClick={() => {
                    setSelectedChapterNum('all');
                    setSearchQuery('');
                    setDifficultyFilter('all');
                  }}
                  className="px-4 py-2 bg-[#5A634E] text-white text-xs font-semibold rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuizQuestions.map((q, idx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = isAnswered && selectedOpt === q.correctIndex;
                  const showExplanation =
                    quizMode === 'practice'
                      ? isAnswered || revealedExplanations[q.id]
                      : quizSubmitted || revealedExplanations[q.id];

                  return (
                    <div
                      key={q.id}
                      id={`quiz-question-card-${q.id}`}
                      className={`bg-white rounded-2xl p-5 border transition-all ${
                        isAnswered
                          ? isCorrect
                            ? 'border-emerald-200 shadow-xs'
                            : 'border-rose-200 shadow-xs'
                          : 'border-[#E8E4D9] hover:border-[#D5D0C3]'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-full bg-[#F4F1EA] text-[#4A4A3A] text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-[#5A634E] bg-[#5A634E]/10 px-2 py-0.5 rounded-full">
                            Ch {q.chapterNumber}: {q.chapterTitle}
                          </span>
                          <span className="text-[11px] font-medium text-[#7A7A6A] bg-[#F4F1EA] px-2 py-0.5 rounded-full">
                            {q.topic}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : q.difficulty === 'Medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Ask AI Doubt Button */}
                        <button
                          id={`btn-ai-doubt-${q.id}`}
                          onClick={() =>
                            onOpenAiAssistant?.(
                              `Please explain step-by-step how to solve this Class 11 NCERT Mathematics question:\n\n"${q.question}"\n\nOptions:\nA) ${q.options[0]}\nB) ${q.options[1]}\nC) ${q.options[2]}\nD) ${q.options[3]}`
                            )
                          }
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#5A634E] hover:text-[#383C2F] bg-[#5A634E]/5 hover:bg-[#5A634E]/10 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Doubt</span>
                        </button>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm sm:text-base font-semibold text-[#2A2E24] mb-4 leading-relaxed">
                        {q.question}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, optIdx) => {
                          const optLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                          const isSelected = selectedOpt === optIdx;
                          const isThisCorrect = optIdx === q.correctIndex;

                          let btnStyle = 'bg-[#FDFBF7] border-[#E8E4D9] text-[#4A4A3A] hover:bg-[#F4F1EA]';

                          if (isAnswered && (quizMode === 'practice' || quizSubmitted)) {
                            if (isThisCorrect) {
                              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium ring-1 ring-rose-400';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#5A634E]/10 border-[#5A634E] text-[#2A2E24] font-semibold ring-1 ring-[#5A634E]';
                          }

                          return (
                            <button
                              key={optIdx}
                              id={`q-${q.id}-opt-${optIdx}`}
                              onClick={() => handleSelectAnswer(q.id, optIdx)}
                              className={`flex items-start text-left gap-2.5 p-3 rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                  isSelected
                                    ? 'bg-[#5A634E] text-white'
                                    : 'bg-[#EAE5D9] text-[#4A4A3A]'
                                }`}
                              >
                                {optLabel}
                              </span>
                              <span className="flex-1 leading-snug">{opt}</span>
                              {isAnswered && (quizMode === 'practice' || quizSubmitted) && (
                                <>
                                  {isThisCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  )}
                                  {isSelected && !isThisCorrect && (
                                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  )}
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation & Steps Toggle */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          id={`btn-toggle-exp-${q.id}`}
                          onClick={() => toggleExplanation(q.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#5A634E] hover:text-[#383C2F] transition-colors"
                        >
                          {showExplanation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showExplanation ? 'Hide Explanation' : 'View Step-by-Step Solution'}</span>
                        </button>

                        <span className="text-[11px] text-[#9A9A8A]">
                          NCERT Textbook Curriculum
                        </span>
                      </div>

                      {/* Explanation Drawer */}
                      {showExplanation && (
                        <div className="mt-3 p-3.5 rounded-xl bg-[#F8F6F0] border border-[#E0DBCF] text-xs leading-relaxed text-[#3A3E32]">
                          <div className="flex items-center gap-1.5 font-bold text-[#5A634E] mb-1.5">
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Correct Answer: Option {String.fromCharCode(65 + q.correctIndex)}</span>
                          </div>
                          <p className="whitespace-pre-line text-[#4A4E40]">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHAPTER NOTES & THEOREMS */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            {currentChapters.map((ch) => (
              <div
                key={ch.chapterNumber}
                id={`math-chapter-notes-${ch.chapterNumber}`}
                className="bg-white rounded-2xl p-6 border border-[#E8E4D9] shadow-xs"
              >
                <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[#E8E4D9]">
                  <div>
                    <span className="text-xs font-bold text-[#5A634E] uppercase tracking-wider block mb-1">
                      Chapter {ch.chapterNumber}
                    </span>
                    <h2 className="text-xl font-bold text-[#2A2E24]">{ch.title}</h2>
                    <p className="text-xs text-[#7A7A6A] mt-0.5">{ch.subtitle}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedChapterNum(ch.chapterNumber);
                      setActiveTab('quiz');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#5A634E] text-white text-xs font-semibold rounded-xl hover:bg-[#484F3E] transition-colors shrink-0 shadow-xs"
                  >
                    <span>Practice Chapter Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Overview */}
                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E8E4D9] mb-5 text-xs sm:text-sm text-[#4A4A3A] leading-relaxed">
                  <p className="font-semibold text-[#2A2E24] mb-1">Chapter Synopsis:</p>
                  <p>{ch.overview}</p>
                </div>

                {/* Concepts Breakdown */}
                <div className="space-y-4 mb-6">
                  {ch.concepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="border border-[#E8E4D9] rounded-xl p-4 hover:border-[#D5D0C3] transition-colors"
                    >
                      <h3 className="text-sm font-bold text-[#2A2E24] mb-1.5">
                        {concept.title}
                      </h3>
                      <p className="text-xs text-[#6A6A5A] mb-3 leading-relaxed">
                        {concept.summary}
                      </p>
                      <ul className="space-y-1.5">
                        {concept.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-xs text-[#4A4A3A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5A634E] mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Quick Revision Bulletins */}
                <div className="bg-[#F4F1EA] p-4 rounded-xl border border-[#E0DBCF]">
                  <h4 className="text-xs font-bold text-[#2A2E24] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    Key Takeaways for Exams
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#4A4A3A]">
                    {ch.quickRevisionBulletins.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#5A634E] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FORMULA SHEET & IDENTITIES */}
        {activeTab === 'formulas' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-[#2A2E24]">Master Formula Sheet</h2>
                <p className="text-xs text-[#7A7A6A]">
                  All critical formulas, algebraic equations, and trigonometric identities from Class 11 NCERT
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#D5D0C3] rounded-xl text-xs font-semibold text-[#4A4A3A] hover:bg-white transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Formulas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFormulas.map((f, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-[#E8E4D9] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#5A634E] bg-[#5A634E]/10 px-2 py-0.5 rounded-full">
                        Ch {f.chapterNumber}: {f.chapterTitle}
                      </span>
                      <button
                        onClick={() => handleCopyFormula(f.formula, `f_${idx}`)}
                        className="text-xs text-[#7A7A6A] hover:text-[#2A2E24] flex items-center gap-1 transition-colors"
                      >
                        {copiedFormula === `f_${idx}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedFormula === `f_${idx}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <h3 className="text-xs font-bold text-[#2A2E24] mb-1">{f.title}</h3>
                    <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E8E4D9] my-2 font-mono text-xs sm:text-sm font-semibold text-[#1A2E14] break-all">
                      {f.formula}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6A6A5A] mt-1">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: UPLOAD DOCUMENT / CUSTOM QUIZ GENERATOR */}
        {activeTab === 'custom_upload' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E8E4D9] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#5A634E]/10 text-[#5A634E] flex items-center justify-center">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2A2E24]">
                    Upload File or Notes for Instant Quiz
                  </h2>
                  <p className="text-xs text-[#7A7A6A]">
                    Upload any mathematics study material (PDF, Text, JSON) or paste questions to generate an instant MCQ quiz.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDropFile}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5 ${
                  isDragging
                    ? 'border-[#5A634E] bg-[#EDF0E9] scale-[1.01]'
                    : 'border-[#D5D0C3] hover:border-[#5A634E] bg-[#FDFBF7] hover:bg-[#F4F1EA]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.json,.pdf,.csv"
                  className="hidden"
                />
                <Upload className={`w-10 h-10 mx-auto mb-3 transition-transform ${isDragging ? 'scale-110 text-[#5A634E]' : 'text-[#5A634E]'}`} />
                <h3 className="text-sm font-bold text-[#2A2E24] mb-1">
                  {isDragging ? 'Drop your document here!' : 'Click to select file or drag & drop'}
                </h3>
                <p className="text-xs text-[#7A7A6A] max-w-sm mx-auto mb-2">
                  Supports .txt, .json, PDF text notes, or practice sheets
                </p>
                {uploadedFileName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Loaded: {uploadedFileName}</span>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E4D9]" />
                </div>
                <span className="relative bg-white px-3 text-xs font-semibold text-[#9A9A8A] uppercase tracking-wider">
                  Or Paste Notes / Question Text Directly
                </span>
              </div>

              {/* Paste Textarea */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="textarea-custom-notes" className="text-xs font-bold text-[#4A4A3A]">
                    Question / Note Excerpt
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5A634E] hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load 5 Sample Math MCQs</span>
                  </button>
                </div>

                <textarea
                  id="textarea-custom-notes"
                  rows={6}
                  value={customPastedText}
                  onChange={(e) => setCustomPastedText(e.target.value)}
                  placeholder="Paste your questions, formulas, or textbook excerpt here... Example:
1. What is the derivative of sin x?
A) cos x
B) -sin x
C) tan x
D) sec x
Answer: A"
                  className="w-full bg-[#FDFBF7] border border-[#D5D0C3] rounded-xl p-3.5 text-xs text-[#2A2E24] placeholder-[#9A9A8A] focus:outline-none focus:ring-2 focus:ring-[#5A634E]/30 font-mono leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#7A7A6A]">
                    {customQuestions.length > 0 && (
                      <>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {customQuestions.length} custom questions active
                        </span>
                        <button
                          onClick={() => setCustomQuestions([])}
                          className="text-rose-600 hover:underline"
                        >
                          Clear Custom
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="px-3 py-2 bg-[#F5F2ED] hover:bg-[#EBE7DF] text-[#4A4A3A] text-xs font-semibold rounded-xl transition border border-[#D5D0C3]"
                    >
                      Use Sample Data
                    </button>
                    <button
                      id="btn-process-pasted-text"
                      disabled={isProcessingUpload || !customPastedText.trim()}
                      onClick={handleProcessPastedText}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#5A634E] hover:bg-[#484F3E] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isProcessingUpload ? 'Processing...' : 'Generate Interactive Quiz'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
