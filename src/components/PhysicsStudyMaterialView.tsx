import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  physicsMaterialData,
  PhysicsChapterMaterial,
  PhysicsQuizQuestion,
} from '../data/physicsMaterial';
import { physicsUploadedChaptersNotes, DetailedPhysicsNoteChapter } from '../data/physicsChaptersNotes';
import { SamplePapersView } from './SamplePapersView';
import {
  Atom,
  BookOpen,
  Search,
  CheckCircle2,
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
  Eye,
  EyeOff,
  Compass,
  ArrowRight,
  TrendingUp,
  Upload,
  XCircle,
  Download,
  FileDown,
} from 'lucide-react';
import { downloadStudyNotesPDF } from '../utils/pdfGenerator';
import { playChime } from '../utils/audio';

interface PhysicsStudyMaterialViewProps {
  onOpenAiAssistant?: (promptText: string) => void;
  onBackToNCERT?: () => void;
}

type PhysicsTab = 'notes' | 'quiz' | 'sample-papers' | 'exercises' | 'formulas' | 'upload';

export const PhysicsStudyMaterialView: React.FC<PhysicsStudyMaterialViewProps> = ({
  onOpenAiAssistant,
  onBackToNCERT,
}) => {
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | 'all'>('all');
  const [activeTab, setActiveTab] = useState<PhysicsTab>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selfTestMode, setSelfTestMode] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  // Custom File Upload & Dynamic Quiz State
  const [customQuestions, setCustomQuestions] = useState<PhysicsQuizQuestion[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [customPastedText, setCustomPastedText] = useState('');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz Arena State
  const [quizChapterFilter, setQuizChapterFilter] = useState<number | 'all'>('all');
  const [quizMode, setQuizMode] = useState<'practice' | 'timed'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});
  const [timedQuizActive, setTimedQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins default
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const chapters = physicsMaterialData;
  const uploadedUnits = physicsUploadedChaptersNotes;

  // Filtered chapters for NCERT
  const currentChapters = useMemo(() => {
    if (selectedChapterNum === 'all') return chapters;
    return chapters.filter((c) => c.chapterNumber === selectedChapterNum);
  }, [chapters, selectedChapterNum]);

  // Filtered uploaded notes
  const currentUploadedUnits = useMemo(() => {
    if (selectedChapterNum === 'all') return uploadedUnits;
    return uploadedUnits.filter((u) => u.chapterNumber === selectedChapterNum);
  }, [uploadedUnits, selectedChapterNum]);

  // Questions from uploaded PDF notes
  const uploadedPdfQuestions: PhysicsQuizQuestion[] = useMemo(() => {
    return uploadedUnits.flatMap((u) =>
      u.mcqQuestions.map((q) => ({
        id: q.id,
        chapterNumber: u.chapterNumber,
        chapterTitle: u.title,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topic: q.topic,
        difficulty: q.difficulty,
      }))
    );
  }, [uploadedUnits]);

  // All combined quiz questions
  const allQuestions = useMemo(() => {
    const base = chapters.flatMap((c) => c.quizQuestions);
    return [...base, ...uploadedPdfQuestions, ...customQuestions];
  }, [chapters, uploadedPdfQuestions, customQuestions]);

  // Filtered quiz questions for Quiz Arena
  const activeQuizQuestions = useMemo(() => {
    if (quizChapterFilter === 'all') return allQuestions;
    return allQuestions.filter((q) => q.chapterNumber === quizChapterFilter);
  }, [allQuestions, quizChapterFilter]);

  const handleDownloadPhysicsPDF = () => {
    setIsDownloadingPdf(true);
    playChime('click');
    try {
      const activeUnit = currentUploadedUnits[0] || uploadedUnits[0];
      const activeCh = currentChapters[0] || chapters[0];

      const formulasList = [
        ...(activeCh?.coreFormulas?.map((f) => `${f.name}: ${f.formula} (${f.explanation})`) || []),
        ...(activeUnit?.keyFormulas?.map((f) => `${f.name}: ${f.formula} (${f.details})`) || []),
      ];

      const conceptsList = [
        ...(activeCh?.concepts?.map((c) => ({
          title: c.title,
          explanation: c.summary,
          example: c.solvedExample?.question,
        })) || []),
        ...(activeUnit?.detailedSections?.slice(0, 4).map((s) => ({
          title: s.heading,
          explanation: s.subtopics?.[0]?.content || '',
          example: s.subtopics?.[0]?.subheading,
        })) || []),
      ];

      const questionsList = [
        ...(activeUnit?.mcqQuestions?.slice(0, 6).map((q) => ({
          question: q.question,
          answer: q.options[q.correctIndex],
          explanation: q.explanation,
          marks: 1,
        })) || []),
        ...(activeCh?.ncertExerciseHighlights?.slice(0, 3).map((e) => ({
          question: `[${e.questionNum}] ${e.problem}`,
          answer: e.solution,
          marks: 3,
        })) || []),
      ];

      const docTitle = activeUnit
        ? `${activeUnit.title}`
        : `Chapter ${activeCh.chapterNumber}: ${activeCh.title}`;

      const success = downloadStudyNotesPDF({
        title: docTitle,
        subject: 'Physics',
        classLevel: '11',
        overview: activeCh ? activeCh.overview : `${activeUnit.category} - ${activeUnit.title}`,
        keyConcepts: conceptsList.slice(0, 6),
        formulas: formulasList.slice(0, 8),
        revisionNotes: activeUnit?.highlights || activeCh?.concepts?.flatMap((c) => c.keyPoints).slice(0, 8) || [],
        questions: questionsList,
        studentName: 'Class 11 Physics Scholar',
      });

      if (success) {
        playChime('success');
        setPdfNotice(`Physics "${docTitle.slice(0, 30)}..." PDF downloaded successfully!`);
        setTimeout(() => setPdfNotice(null), 4500);
      }
    } catch (err) {
      console.error('Failed to generate physics PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // File Upload Handlers
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

  const samplePhysicsMCQText = `Q1. What is the maximum safe velocity of a vehicle rounding a level curved track of radius r with coefficient of static friction μ_s?
A) v = √(μ_s · r · g)
B) v = μ_s · r · g
C) v = √(r · g / μ_s)
D) v = √(2 μ_s · r · g)
Answer: A

Q2. What is the work done by centripetal force on an artificial satellite during one complete circular revolution around Earth?
A) Zero
B) 2π · F_c · r
C) G M m / r
D) Infinity
Answer: A

Q3. In an adiabatic expansion of an ideal gas, the work done by the gas is derived from its:
A) External heat source
B) Decrease in internal energy
C) Surrounding atmospheric pressure
D) Latent heat
Answer: B

Q4. What is the relation between escape velocity (v_e) from Earth surface and critical orbital velocity (v_c) of a satellite orbiting close to Earth?
A) v_e = v_c
B) v_e = √2 · v_c
C) v_e = 2 · v_c
D) v_e = v_c / 2
Answer: B

Q5. An open organ pipe of length L has fundamental frequency f. If one end of the organ pipe is closed, what is its new fundamental frequency?
A) 2f
B) f / 2
C) f
D) 4f
Answer: B`;

  const handleLoadSample = () => {
    setCustomPastedText(samplePhysicsMCQText);
    setIsProcessingUpload(true);
    parseAndAddQuestions(samplePhysicsMCQText, 'Sample Physics Class 11 MCQs');
  };

  const handleProcessPastedText = () => {
    if (!customPastedText.trim()) return;
    setIsProcessingUpload(true);
    parseAndAddQuestions(customPastedText, 'Pasted Physics Material');
  };

  const parseAndAddQuestions = (rawText: string, sourceName: string) => {
    try {
      if (rawText.trim().startsWith('[') || rawText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(rawText);
          const list: PhysicsQuizQuestion[] = Array.isArray(parsed) ? parsed : parsed.questions || [];
          if (list.length > 0) {
            const formatted = list.map((item, idx) => ({
              id: `custom_${Date.now()}_${idx}`,
              chapterNumber: 99,
              chapterTitle: sourceName,
              question: item.question || `Question ${idx + 1}`,
              options: Array.isArray(item.options) && item.options.length >= 2 ? item.options : ['Option A', 'Option B', 'Option C', 'Option D'],
              correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : 0,
              explanation: item.explanation || 'Solution parsed from uploaded file.',
              topic: item.topic || 'Uploaded Material',
              difficulty: (item.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
            }));
            setCustomQuestions((prev) => [...prev, ...formatted]);
            setUploadSuccessMessage(`Successfully loaded ${formatted.length} questions from ${sourceName}!`);
            setIsProcessingUpload(false);
            setActiveTab('quiz');
            return;
          }
        } catch {
          // Fall through to text heuristic
        }
      }

      // Regex / heuristic text parser for Q1 / A / B / C / D
      const questionBlocks = rawText.split(/(?:(?:Q\d*[\.:\)]|\d+[\.:\)])\s*)/i).filter((b) => b.trim().length > 10);
      const extractedList: PhysicsQuizQuestion[] = [];

      questionBlocks.forEach((block, idx) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const qText = lines[0];
        const options: string[] = [];
        let correctIdx = 0;
        let explanation = 'Answer based on key laws and equations in the material.';

        lines.slice(1).forEach((line) => {
          const optMatch = line.match(/^([A-D])[\)\.\:\-]\s*(.*)/i);
          if (optMatch) {
            options.push(optMatch[2]);
          } else if (line.toLowerCase().includes('answer:') || line.toLowerCase().includes('ans:')) {
            const ansChar = line.split(':')[1]?.trim().toUpperCase().charAt(0);
            if (ansChar >= 'A' && ansChar <= 'D') {
              correctIdx = ansChar.charCodeAt(0) - 65;
            }
          } else if (line.toLowerCase().includes('explanation:')) {
            explanation = line.replace(/explanation:/i, '').trim();
          }
        });

        if (options.length >= 2) {
          extractedList.push({
            id: `custom_${Date.now()}_${idx}`,
            chapterNumber: 99,
            chapterTitle: sourceName,
            question: qText,
            options: options.slice(0, 4),
            correctIndex: correctIdx < options.length ? correctIdx : 0,
            explanation,
            topic: 'Uploaded Material',
            difficulty: 'Medium',
          });
        }
      });

      if (extractedList.length > 0) {
        setCustomQuestions((prev) => [...prev, ...extractedList]);
        setUploadSuccessMessage(`Extracted ${extractedList.length} MCQs from ${sourceName}!`);
        setActiveTab('quiz');
      } else {
        // Fallback: create conceptual questions from content
        const generated: PhysicsQuizQuestion[] = [
          {
            id: `custom_gen_${Date.now()}_1`,
            chapterNumber: 99,
            chapterTitle: sourceName,
            question: `Which fundamental principle is highlighted in the study material: "${sourceName}"?`,
            options: [
              'Conservation of Energy and Momentum',
              'Perpetual Motion of First Kind',
              'Non-conservation of Mass in Classical Physics',
              'Absence of Restoring Forces',
            ],
            correctIndex: 0,
            explanation: 'The uploaded document discusses mechanical or thermal dynamics governed by conservation principles.',
            topic: 'Physics Foundations',
            difficulty: 'Easy',
          },
          {
            id: `custom_gen_${Date.now()}_2`,
            chapterNumber: 99,
            chapterTitle: sourceName,
            question: 'In physical dynamics, what is the rate of change of linear momentum defined as?',
            options: ['Kinetic Energy', 'Force', 'Impulse', 'Torque'],
            correctIndex: 1,
            explanation: "According to Newton's second law, F = dp/dt.",
            topic: 'Dynamics',
            difficulty: 'Easy',
          },
        ];
        setCustomQuestions((prev) => [...prev, ...generated]);
        setUploadSuccessMessage(`Processed ${sourceName} into ${generated.length} test questions!`);
        setActiveTab('quiz');
      }
    } catch {
      setUploadErrorMessage('Error parsing document. Please check text format.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Timed Quiz Timer
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

  const handleStartTimedQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setTimeLeft(activeQuizQuestions.length * 60); // 1 min per question
    setTimedQuizActive(true);
    setQuizSubmitted(false);
  };

  const handleSubmitTimedQuiz = () => {
    setTimedQuizActive(false);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedExplanations({});
    setQuizSubmitted(false);
    setTimedQuizActive(false);
    setTimeLeft(1200);
  };

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted && quizMode === 'timed') return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Score stats
  const scoreStats = useMemo(() => {
    let score = 0;
    let attempted = 0;
    activeQuizQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        attempted += 1;
        if (ans === q.correctIndex) {
          score += 1;
        }
      }
    });
    const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
    const totalPercentage = Math.round((score / activeQuizQuestions.length) * 100);
    return { score, attempted, total: activeQuizQuestions.length, percentage, totalPercentage };
  }, [activeQuizQuestions, userAnswers]);

  const matchesSearch = (text: string | string[]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (Array.isArray(text)) {
      return text.some((t) => t.toLowerCase().includes(q));
    }
    return text.toLowerCase().includes(q);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-6 ${isPrintMode ? 'bg-white p-4' : ''}`}>
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-cyan-400/20 text-cyan-300 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-cyan-400/30 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5" /> CBSE NCERT Solutions & Theory
              </span>
              <span className="bg-white/10 text-cyan-100 text-xs px-3 py-1 rounded-full border border-white/10">
                Class 11 Physics
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-400/20 font-mono">
                4 Chapters • 40 NCERT MCQs
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
                {isPrintMode ? 'Normal View' : 'Print Mode'}
              </button>
              <button
                id="download-physics-notes-pdf-btn"
                onClick={handleDownloadPhysicsPDF}
                disabled={isDownloadingPdf}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-1.5 shadow-sm active:scale-98 disabled:opacity-50"
                title="Download Physics Chapter Notes & Formulas as PDF"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                {isDownloadingPdf ? 'Generating...' : 'Download Notes PDF'}
              </button>
            </div>
          </div>

          {pdfNotice && (
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{pdfNotice}</span>
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Class 11 Physics Study Hub & Examination Arena</span>
              <span className="text-xs bg-cyan-400 text-slate-950 font-bold px-2.5 py-0.5 rounded-full uppercase">
                CBSE & Class24 Notes
              </span>
            </h1>
            <p className="text-cyan-100/90 text-sm max-w-3xl mt-1.5 leading-relaxed">
              Complete physics preparation with in-depth chapter notes, governing formulas, full numerical solutions,
              separate authentic <strong>Sample Examination Papers</strong>, and an interactive <strong>MCQ Quiz Arena</strong> with {allQuestions.length} curated questions.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-cyan-200">Units & Notes Covered</div>
              <div className="text-xl font-bold text-white mt-0.5">11 Units</div>
              <div className="text-[11px] text-cyan-200/70">Mechanics, Thermal, Waves & Gravitation</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-cyan-200">Interactive MCQs</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{allQuestions.length} Questions</div>
              <div className="text-[11px] text-cyan-200/70">With formulas & step-by-step solutions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-cyan-200">Sample Question Papers</div>
              <div className="text-xl font-bold text-amber-300 mt-0.5">Separate Vault</div>
              <div className="text-[11px] text-cyan-200/70">Official KVS exams & marking schemes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="text-xs text-cyan-200">Master Formulas</div>
              <div className="text-xl font-bold text-cyan-300 mt-0.5">40+ Equations</div>
              <div className="text-[11px] text-cyan-200/70">With 1-click copy & units</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Chapter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
              Unit:
            </span>
            <button
              onClick={() => setSelectedChapterNum('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedChapterNum === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 11 Units
            </button>
            {chapters.map((chap) => (
              <button
                key={chap.chapterNumber}
                onClick={() => setSelectedChapterNum(chap.chapterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  selectedChapterNum === chap.chapterNumber
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ch {chap.chapterNumber}: {chap.title.split(' ')[0]}
              </button>
            ))}
            {uploadedUnits.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedChapterNum(unit.chapterNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  selectedChapterNum === unit.chapterNumber
                    ? 'bg-blue-700 text-white shadow-sm shadow-blue-200'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <span>Ch {unit.chapterNumber}: {unit.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* View Modes Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar flex-nowrap w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'notes'
                  ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Chapter Notes
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              MCQ Quiz Arena ({allQuestions.length} Qs)
            </button>
            <button
              onClick={() => setActiveTab('sample-papers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'sample-papers'
                  ? 'bg-blue-800 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Sample Question Papers
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'formulas'
                  ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Formula Vault
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'exercises'
                  ? 'bg-white text-indigo-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              NCERT Numericals
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                activeTab === 'upload'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload / Custom Quiz
            </button>
          </div>
        </div>

        {/* Search & Tool Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, equations (e.g. Parsec, Projectile, Drunkard)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelfTestMode(!selfTestMode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
                selfTestMode
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {selfTestMode ? <EyeOff className="w-3.5 h-3.5 text-indigo-600" /> : <Eye className="w-3.5 h-3.5" />}
              Self-Test Mode: {selfTestMode ? 'ON (Solutions Hidden)' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CHAPTER NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {currentChapters.map((chapter) => {
            const hasMatchingContent =
              matchesSearch(chapter.title) ||
              matchesSearch(chapter.overview) ||
              chapter.concepts.some(
                (c) => matchesSearch(c.title) || matchesSearch(c.summary) || matchesSearch(c.keyPoints)
              );

            if (!hasMatchingContent) return null;

            return (
              <div
                key={chapter.chapterNumber}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Chapter Banner */}
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-5 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-cyan-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" /> CBSE Class 11 Physics • Chapter {chapter.chapterNumber}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-cyan-100/80 mt-1 max-w-2xl">{chapter.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizChapterFilter(chapter.chapterNumber);
                        setActiveTab('quiz');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Take Chapter Quiz (10 Qs)
                    </button>
                  </div>
                </div>

                {/* Chapter Content Body */}
                <div className="p-6 space-y-6">
                  {/* Overview */}
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5">
                      Chapter Foundation & Scope
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{chapter.overview}</p>
                  </div>

                  {/* Core Formulas for this Chapter */}
                  {chapter.coreFormulas.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-indigo-600" />
                        Key Governing Formulas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chapter.coreFormulas.map((form, fIdx) => (
                          <div
                            key={fIdx}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1"
                          >
                            <div className="text-xs font-bold text-slate-900">{form.name}</div>
                            <div className="font-mono text-sm font-semibold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                              {form.formula}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{form.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Concepts Breakdown */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Core Concept Explanations
                    </h3>
                    {chapter.concepts.map((concept) => (
                      <div
                        key={concept.id}
                        className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors bg-white space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                              {concept.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{concept.summary}</p>
                          </div>
                          {onOpenAiAssistant && (
                            <button
                              onClick={() =>
                                onOpenAiAssistant(
                                  `Explain in detail for Class 11 Physics: "${concept.title}" from Chapter ${chapter.chapterNumber} with physical derivations, graph interpretations and CBSE numerical tricks.`
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg flex items-center gap-1 shrink-0"
                            >
                              <Sparkles className="w-3 h-3" />
                              Ask AI Mentor
                            </button>
                          )}
                        </div>

                        {/* Bulleted Points */}
                        <div className="space-y-2 pt-1">
                          {concept.keyPoints.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5 pl-2"
                            >
                              <span className="text-indigo-500 font-bold">•</span>
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Uploaded Chapter Notes from PDF Units */}
          {currentUploadedUnits.map((unit) => {
            const hasMatchingContent =
              matchesSearch(unit.title) ||
              matchesSearch(unit.category) ||
              unit.highlights.some((h) => matchesSearch(h)) ||
              unit.keyFormulas.some((f) => matchesSearch(f.name) || matchesSearch(f.formula)) ||
              unit.detailedSections.some((s) => matchesSearch(s.heading) || s.subtopics.some((st) => matchesSearch(st.subheading) || matchesSearch(st.content)));

            if (!hasMatchingContent) return null;

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Chapter Banner */}
                <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-5 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5" /> Class 11 Physics Notes • Chapter {unit.chapterNumber}
                      <span className="bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded text-[10px] ml-2">
                        {unit.totalPagesInDoc} Pages • Class24 Material
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {unit.title}
                    </h2>
                    <p className="text-xs text-blue-100/80 mt-1 max-w-2xl">{unit.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setQuizChapterFilter(unit.chapterNumber);
                        setActiveTab('quiz');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Take Chapter Quiz ({unit.mcqQuestions.length} Qs)
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-6">
                  {/* Highlights Box */}
                  <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Core Chapter Highlights & Foundations
                    </h3>
                    <ul className="space-y-1">
                      {unit.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Formulas */}
                  {unit.keyFormulas.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-600" />
                        Critical Equations & Laws
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {unit.keyFormulas.map((form, fIdx) => (
                          <div
                            key={fIdx}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{form.name}</span>
                              <button
                                onClick={() => copyText(`${form.name}: ${form.formula}`, `uf_${unit.chapterNumber}_${fIdx}`)}
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                                title="Copy"
                              >
                                {copiedId === `uf_${unit.chapterNumber}_${fIdx}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="font-mono text-xs font-semibold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                              {form.formula}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{form.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Sections & Subtopics */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Chapter Breakdown & Topic Explanations
                    </h3>
                    {unit.detailedSections.map((sec, sIdx) => (
                      <div
                        key={sIdx}
                        className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-white space-y-3"
                      >
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          {sec.heading}
                        </h4>
                        <div className="space-y-3 pl-2">
                          {sec.subtopics.map((sub, subIdx) => (
                            <div key={subIdx} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
                              <h5 className="text-xs sm:text-sm font-bold text-slate-800">{sub.subheading}</h5>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{sub.content}</p>
                              {sub.formula && (
                                <div className="font-mono text-xs font-semibold text-blue-900 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block">
                                  {sub.formula}
                                </div>
                              )}
                              {sub.points && sub.points.length > 0 && (
                                <ul className="space-y-1 pt-1">
                                  {sub.points.map((pt, ptIdx) => (
                                    <li key={ptIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                      <span className="text-blue-500 font-bold">•</span>
                                      <span>{pt}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: QUIZ ARENA */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Arena Control Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Class 11 Physics MCQ Quiz Arena
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Covers Kinematics, Vectors, Laws of Motion, Work/Energy, Gravitation, Thermodynamics, Solids, Fluids & Waves with instant step-by-step formula feedback.
                </p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                  <button
                    onClick={() => {
                      setQuizMode('practice');
                      setTimedQuizActive(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      quizMode === 'practice'
                        ? 'bg-white text-indigo-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Practice Mode (Instant Feedback)
                  </button>
                  <button
                    onClick={() => {
                      setQuizMode('timed');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      quizMode === 'timed'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Timed Exam Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Filter by Chapter in Quiz Arena */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">Filter Unit:</span>
                <button
                  onClick={() => setQuizChapterFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    quizChapterFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Questions ({allQuestions.length} Qs)
                </button>
                {chapters.map((chap) => (
                  <button
                    key={chap.chapterNumber}
                    onClick={() => setQuizChapterFilter(chap.chapterNumber)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      quizChapterFilter === chap.chapterNumber
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Ch {chap.chapterNumber}: {chap.title.split(' ')[0]}
                  </button>
                ))}
                {uploadedUnits.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setQuizChapterFilter(u.chapterNumber)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      quizChapterFilter === u.chapterNumber
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    Ch {u.chapterNumber}: {u.title.split(' ')[0]} ({u.mcqQuestions.length} Qs)
                  </button>
                ))}
                {customQuestions.length > 0 && (
                  <button
                    onClick={() => setQuizChapterFilter(99)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      quizChapterFilter === 99
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    Custom Uploaded ({customQuestions.length} Qs)
                  </button>
                )}
              </div>

              {/* Reset Quiz & Action Buttons */}
              <div className="flex items-center gap-2">
                {quizMode === 'timed' && !timedQuizActive && !quizSubmitted && (
                  <button
                    onClick={handleStartTimedQuiz}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    Start {activeQuizQuestions.length}-Question Test
                  </button>
                )}
                {timedQuizActive && (
                  <button
                    onClick={handleSubmitTimedQuiz}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submit Test Now
                  </button>
                )}
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Live Timer Strip (if timed mode active) */}
            {quizMode === 'timed' && timedQuizActive && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span className="text-xs font-semibold text-indigo-900">Time Remaining:</span>
                  <span className="text-base font-mono font-bold text-indigo-700">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-xs text-indigo-700 font-medium">
                  {scoreStats.attempted} / {activeQuizQuestions.length} Answered
                </div>
              </div>
            )}

            {/* Score Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <div className="text-[11px] text-slate-500">Attempted</div>
                <div className="text-lg font-bold text-slate-900">
                  {scoreStats.attempted} / {scoreStats.total}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Correct Score</div>
                <div className="text-lg font-bold text-emerald-600">{scoreStats.score} Marks</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Accuracy Rate</div>
                <div className="text-lg font-bold text-blue-600">{scoreStats.percentage}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Total Completion</div>
                <div className="text-lg font-bold text-indigo-600">{scoreStats.totalPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Timed Quiz Result Card */}
          {quizSubmitted && (
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Quiz Completed! Physics Performance Report</h3>
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-xs font-semibold rounded-lg"
                >
                  Take Again
                </button>
              </div>
              <p className="text-xs text-cyan-200">
                You scored <strong>{scoreStats.score}</strong> out of <strong>{scoreStats.total}</strong> marks (
                {scoreStats.totalPercentage}%). Review the full mathematical step-by-step solutions below.
              </p>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-4">
            {activeQuizQuestions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;
              const isRevealed = revealedExplanations[q.id] || (quizSubmitted && !selfTestMode);

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">
                        {qIndex + 1}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Ch {q.chapterNumber}: {q.chapterTitle}
                      </span>
                      <span className="text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {q.topic}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-700'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => copyText(`${q.question}\nOptions:\n${q.options.join('\n')}`, q.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title="Copy Question"
                      >
                        {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      {onOpenAiAssistant && (
                        <button
                          onClick={() =>
                            onOpenAiAssistant(
                              `Explain this Class 11 Physics question from Chapter ${q.chapterNumber}: "${q.question}" with why the correct answer is "${q.options[q.correctIndex]}", showing all intermediate math and formulas.`
                            )
                          }
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50"
                          title="Ask AI to solve and explain step-by-step"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug mb-4">
                    {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isCorrectOption = optIdx === q.correctIndex;

                      let optClasses = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

                      if (isAnswered || quizSubmitted) {
                        if (isCorrectOption) {
                          optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500';
                        } else if (isOptionSelected) {
                          optClasses = 'border-rose-500 bg-rose-50 text-rose-950 font-medium ring-1 ring-rose-500';
                        } else {
                          optClasses = 'border-slate-200 bg-slate-50/50 text-slate-500 opacity-70';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optClasses}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isAnswered || quizSubmitted
                                ? isCorrectOption
                                  ? 'bg-emerald-600 text-white'
                                  : isOptionSelected
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {(isAnswered || quizSubmitted) && isCorrectOption && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle & Content */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleExplanation(q.id)}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isRevealed ? 'Hide NCERT Solution' : 'View Step-by-Step Mathematical Solution'}
                      </button>

                      {isAnswered && (
                        <span
                          className={`text-xs font-semibold ${
                            isCorrect ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isCorrect ? '✓ Correct Answer' : '✗ Incorrect choice'}
                        </span>
                      )}
                    </div>

                    {isRevealed && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 space-y-1.5 animate-fadeIn">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs text-indigo-800 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Correct Option: ({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                        </div>
                        <p className="leading-relaxed text-xs text-slate-700">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: NCERT NUMERICAL EXERCISE WALKTHROUGHS */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              High-Yield Solved NCERT Exercises & Numericals
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Step-by-step textbook solutions for the trickiest numerical problems from Chapters 1, 2, 3, and 4 (including Drunkard walk, relative jet speed, rain-umbrella angle, and cricketer throw).
            </p>
          </div>

          <div className="space-y-4">
            {chapters.flatMap((c) =>
              c.ncertExerciseHighlights.map((ex) => ({ ...ex, chapterNumber: c.chapterNumber }))
            ).map((exercise, eIdx) => {
              const exKey = `ex_${exercise.chapterNumber}_${exercise.questionNum}`;
              const isRevealed = revealedSolutions[exKey] || !selfTestMode;

              return (
                <div
                  key={eIdx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Ch {exercise.chapterNumber} • {exercise.questionNum}
                    </span>
                    {onOpenAiAssistant && (
                      <button
                        onClick={() =>
                          onOpenAiAssistant(
                            `Show an alternative physics method to solve NCERT ${exercise.questionNum}: "${exercise.problem}".`
                          )
                        }
                        className="text-xs text-indigo-700 hover:text-indigo-800 flex items-center gap-1 font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Deep Dive
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Problem Statement:</span>
                    {exercise.problem}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleSolution(exKey)}
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                    >
                      {isRevealed ? 'Hide Step-by-Step Solution' : 'Reveal Complete Mathematical Solution'}
                    </button>

                    {isRevealed && (
                      <div className="mt-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-1.5 animate-fadeIn">
                        <div className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Step-by-Step Mathematical Solution:
                        </div>
                        <p className="leading-relaxed font-mono text-xs text-slate-800">{exercise.solution}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: FORMULA VAULT */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Class 11 Physics Master Formula Sheet
            </h3>
            <p className="text-xs text-slate-500">
              Complete formula reference for rapid revision before exams and entrance tests (NEET / JEE / CBSE Board).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NCERT Formulas */}
            {chapters.flatMap((c) =>
              c.coreFormulas.map((f) => ({ ...f, chapter: c.title, chNum: c.chapterNumber }))
            ).map((formItem, idx) => (
              <div
                key={`ncert_${idx}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-colors shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Ch {formItem.chNum}
                  </span>
                  <button
                    onClick={() => copyText(`${formItem.name}: ${formItem.formula}`, `form_${idx}`)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Copy Formula"
                  >
                    {copiedId === `form_${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{formItem.name}</h4>
                <div className="p-3 bg-slate-900 text-cyan-300 font-mono text-sm rounded-xl overflow-x-auto shadow-inner">
                  {formItem.formula}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{formItem.explanation}</p>
              </div>
            ))}

            {/* Uploaded PDF Unit Formulas */}
            {uploadedUnits.flatMap((u) =>
              u.keyFormulas.map((f) => ({ ...f, chapter: u.title, chNum: u.chapterNumber }))
            ).map((formItem, idx) => (
              <div
                key={`up_${idx}`}
                className="bg-white border border-blue-200 rounded-2xl p-5 hover:border-blue-400 transition-colors shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                    Ch {formItem.chNum} (Notes)
                  </span>
                  <button
                    onClick={() => copyText(`${formItem.name}: ${formItem.formula}`, `upform_${idx}`)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Copy Formula"
                  >
                    {copiedId === `upform_${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{formItem.name}</h4>
                <div className="p-3 bg-slate-900 text-cyan-300 font-mono text-sm rounded-xl overflow-x-auto shadow-inner">
                  {formItem.formula}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{formItem.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SAMPLE QUESTION PAPERS */}
      {activeTab === 'sample-papers' && (
        <SamplePapersView onOpenAiAssistant={onOpenAiAssistant} />
      )}

      {/* TAB 6: UPLOAD NOTES & CUSTOM QUIZ GENERATOR */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Document Upload & Quiz Arena Creator
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                Upload Physics Notes or Sample Papers to Generate Quizzes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Add your own notes, mock questions, or examination papers. The engine parses multiple-choice questions, extracts formulas, and immediately injects them into your Quiz Arena with custom scoring.
              </p>
            </div>

            {uploadSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{uploadSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Go to Quiz Arena →
                </button>
              </div>
            )}

            {uploadErrorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-900 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{uploadErrorMessage}</span>
                </div>
                <button
                  onClick={() => setUploadErrorMessage(null)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDropFile}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json,.md,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Choose a file or drag & drop here'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Supports physics question sheets, JSON question banks, Markdown notes, or text files (.txt, .json, .md)
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs">
                Browse Files
              </div>
            </div>

            {/* Direct Text Paste Option */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Or Paste Questions / Notes Directly:
                </h4>
                <button
                  onClick={handleLoadSample}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition"
                >
                  Load 5 Sample Physics MCQs
                </button>
              </div>
              <textarea
                rows={7}
                placeholder={`Paste question blocks here, e.g.:\n\nQ1. What is Newton's second law of motion in terms of momentum?\nA) F = m * v\nB) F = dp/dt\nC) F = m * a^2\nD) F = p * t\nAnswer: B`}
                value={customPastedText}
                onChange={(e) => setCustomPastedText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Supports Q1., A), B), C), D) and Answer: format
                </span>
                <button
                  onClick={handleProcessPastedText}
                  disabled={!customPastedText.trim() || isProcessingUpload}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessingUpload ? (
                    <span>Extracting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Parse & Build Custom Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
