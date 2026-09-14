import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  RotateCcw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { User, ExamSimulatorPaper, PYQBattleQuestion } from '../types';
import { pyqBattleQuestionsPool } from '../data/competitiveExamData';
import { shuffleQuestionOptions, filterUniqueQuestions } from '../utils/questionEngine';
import { playChime } from '../utils/audio';

interface CustomTestBuilderProps {
  currentUser: User;
  classLevel: number;
  onStartCustomTest: (paper: ExamSimulatorPaper) => void;
}

// Available chapters organized by subject
const CHAPTERS_BY_SUBJECT: Record<string, string[]> = {
  Physics: [
    'All Chapters',
    'Kinematics & Motion',
    'Laws of Motion & Friction',
    'Work, Energy & Power',
    'Gravitation & Planetary Motion',
    'Thermodynamics & Kinetic Theory',
    'Electrostatics & Capacitance',
    'Current Electricity & Circuits',
    'Ray Optics & Wave Optics',
    'Modern Physics & Atoms',
  ],
  Chemistry: [
    'All Chapters',
    'Chemical Reactions & Stoichiometry',
    'Periodic Classification of Elements',
    'Chemical Bonding & Molecular Structure',
    'Thermodynamics & Chemical Equilibrium',
    'Chemical Kinetics & Catalysis',
    'Electrochemistry & Batteries',
    'Organic Chemistry - Hydrocarbons',
    'Coordination Compounds',
    'Biomolecules & Environmental Chemistry',
  ],
  Mathematics: [
    'All Chapters',
    'Real Numbers & Polynomials',
    'Quadratic Equations & Complex Numbers',
    'Trigonometry & Inverse Functions',
    'Coordinate Geometry & Conic Sections',
    'Limits, Continuity & Differential Calculus',
    'Integral Calculus & Area Under Curves',
    'Matrices & Determinants',
    'Vectors & 3D Geometry',
    'Probability & Statistics',
  ],
  Biology: [
    'All Chapters',
    'Cell - The Unit of Life & Division',
    'Genetics & Principles of Inheritance',
    'Molecular Basis of Inheritance',
    'Human Physiology & Organ Systems',
    'Plant Physiology & Photosynthesis',
    'Biotechnology & DNA Technology',
    'Ecology, Environment & Biodiversity',
  ],
  Science: [
    'All Chapters',
    'Light - Reflection & Refraction',
    'Electricity & Magnetic Effects',
    'Chemical Reactions & Acid-Bases',
    'Life Processes & Nutrition',
    'Metals and Non-metals',
    'Heredity and Evolution',
  ],
};

const DURATION_OPTIONS = [
  { label: '10 Mins (Speed Test)', minutes: 10 },
  { label: '20 Mins (Standard)', minutes: 20 },
  { label: '30 Mins (Half-Hour)', minutes: 30 },
  { label: '40 Mins (Full Section)', minutes: 40 },
  { label: '1 Hour (Mini Mock)', minutes: 60 },
  { label: '3 Hours (Full Simulation)', minutes: 180 },
];

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30];

export const CustomTestBuilder: React.FC<CustomTestBuilderProps> = ({
  currentUser,
  classLevel,
  onStartCustomTest,
}) => {
  // Config state
  const [selectedGrade, setSelectedGrade] = useState<string>(
    classLevel >= 11 ? `Class ${classLevel}` : 'Class 10'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('Physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('All Chapters');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(20);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Chapters list based on selected subject
  const availableChapters = useMemo(() => {
    return CHAPTERS_BY_SUBJECT[selectedSubject] || ['All Chapters'];
  }, [selectedSubject]);

  // Handle building & launching the test
  const handleGenerateTest = async () => {
    setIsGenerating(true);
    playChime('click');

    try {
      // 1. Fetch questions from API with filters
      let questions: PYQBattleQuestion[] = [];
      try {
        const queryParams = new URLSearchParams({
          subject: selectedSubject,
          classLevel: classLevel.toString(),
          count: selectedQuestionCount.toString(),
          difficulty: selectedDifficulty !== 'Mixed' ? selectedDifficulty : '',
          chapter: selectedChapter !== 'All Chapters' ? selectedChapter : '',
        });

        const res = await fetch(`/api/quiz/questions?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success && data.questions && data.questions.length > 0) {
          questions = data.questions;
        }
      } catch (err) {
        console.warn('Backend question fetch failed, using client fallback engine:', err);
      }

      // 2. Client-side fallback if needed
      if (questions.length === 0) {
        let pool = pyqBattleQuestionsPool;
        if (selectedSubject !== 'All') {
          const matched = pool.filter(
            (q) => q.subject.toLowerCase() === selectedSubject.toLowerCase()
          );
          if (matched.length > 0) pool = matched;
        }

        if (selectedDifficulty !== 'Mixed') {
          const diffMatch = pool.filter((q) => q.difficulty === selectedDifficulty);
          if (diffMatch.length >= 3) pool = diffMatch;
        }

        const filtered = filterUniqueQuestions(pool, new Set(), {
          subject: selectedSubject,
          classLevel,
          count: selectedQuestionCount,
        });
        questions = filtered;
      }

      // 3. Ensure each question has Fisher-Yates shuffled options
      const randomizedQuestions = questions.map((q) => shuffleQuestionOptions(q));

      // 4. Assemble the ExamSimulatorPaper
      const customPaper: ExamSimulatorPaper = {
        id: `custom_cbt_${Date.now()}`,
        title: `${selectedSubject}: ${selectedChapter} (${selectedGrade})`,
        code: `LX-CBT-${Date.now().toString(36).toUpperCase()}`,
        grade: selectedGrade,
        boardOrConductingBody: 'NCERT All-India',
        totalTimeMinutes: selectedDurationMinutes,
        totalMarks: randomizedQuestions.length * 4,
        sections: [
          {
            id: 'custom_sec_1',
            name: `${selectedSubject} (${randomizedQuestions.length} Qs)`,
            questionIds: randomizedQuestions.map((q) => q.id),
          },
        ],
        questions: randomizedQuestions.map((q, idx) => ({
          id: q.id,
          sectionId: 'custom_sec_1',
          questionNumber: idx + 1,
          questionText: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          positiveMarks: 4,
          negativeMarks: 1,
          topic: q.topic || selectedChapter,
        })),
        instructions: [
          `Total Duration: ${selectedDurationMinutes} minutes for ${randomizedQuestions.length} questions.`,
          `Marking Scheme: +4 marks for each correct answer; -1 negative mark for incorrect attempts.`,
          `Use the Question Palette on the right to navigate between answered and review states.`,
          `Unattempted questions receive 0 marks. The test auto-submits when the timer reaches 00:00.`,
          `Weak and missed questions will automatically be cataloged in your AI Mistake Vault.`,
        ],
      };

      playChime('badge');
      onStartCustomTest(customPaper);
    } catch (e) {
      console.error('Failed to generate custom test', e);
      alert('Unable to generate custom test. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-8">
      {/* Title & Description */}
      <div className="space-y-2 border-b border-[#EBE7DF] pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A634E]/10 text-[#5A634E] text-xs font-bold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive CBT Custom Test Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A4A3A]">
          Create Your Personalized Mock Exam
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7468] max-w-2xl leading-relaxed">
          Target your weak areas by customizing Grade, Subject, Specific Chapter, Difficulty, and Duration.
          Questions are dynamically pulled from non-repeating PYQ pools with randomized option shuffling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Target Grade & Subject */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              1. Select Class / Entrance Target
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE Main', 'NEET UG'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                    selectedGrade === g
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              2. Select Subject
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(sub);
                    setSelectedChapter('All Chapters');
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center flex flex-col items-center gap-1 ${
                    selectedSubject === sub
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  <span>
                    {sub === 'Physics' && '⚡'}
                    {sub === 'Chemistry' && '🧪'}
                    {sub === 'Mathematics' && '📐'}
                    {sub === 'Biology' && '🧬'}
                    {sub === 'Science' && '🔬'}
                  </span>
                  <span>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              3. Select Chapter / Specific Topic
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] text-xs font-medium text-[#4A4A3A] focus:outline-none focus:ring-2 focus:ring-[#5A634E]"
            >
              {availableChapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Difficulty, Question Count & Duration */}
        <div className="space-y-4">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              4. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-center ${
                    selectedDifficulty === diff
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              5. Number of Questions
            </label>
            <div className="grid grid-cols-6 gap-2">
              {QUESTION_COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSelectedQuestionCount(count)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                    selectedQuestionCount === count
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  {count} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-[#4A4A3A] uppercase tracking-wider mb-2">
              6. Session Duration (Adaptive Timer)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((dur) => (
                <button
                  key={dur.minutes}
                  type="button"
                  onClick={() => setSelectedDurationMinutes(dur.minutes)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-left ${
                    selectedDurationMinutes === dur.minutes
                      ? 'bg-[#5A634E] text-white border-[#5A634E] shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#7A7468] border-[#E5E0D8] hover:bg-[#F5F2ED]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dur.minutes} Mins</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Banner & Launch CTA */}
      <div className="pt-4 border-t border-[#EBE7DF] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#7A7468] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Ready to generate:{' '}
            <strong className="text-[#4A4A3A]">{selectedSubject}</strong> •{' '}
            <strong className="text-[#4A4A3A]">{selectedChapter}</strong> •{' '}
            <strong>{selectedQuestionCount} Questions</strong> ({selectedDurationMinutes} mins)
          </span>
        </div>

        <button
          type="button"
          onClick={handleGenerateTest}
          disabled={isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <span>Generating Questions...</span>
          ) : (
            <>
              <Award className="w-4 h-4" />
              <span>Launch Custom CBT Simulator ➔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
