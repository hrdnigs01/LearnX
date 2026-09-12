import { MistakeNotebookItem, MistakeCategory } from '../types';
import { seedMistakesData } from '../data/competitiveExamData';

const MISTAKE_VAULT_KEY = 'learnx_ai_mistake_vault_v1';

export function getMistakeVault(): MistakeNotebookItem[] {
  try {
    const raw = localStorage.getItem(MISTAKE_VAULT_KEY);
    if (!raw) {
      // Seed with initial high-yield mistakes
      localStorage.setItem(MISTAKE_VAULT_KEY, JSON.stringify(seedMistakesData));
      return seedMistakesData;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read mistake vault from localStorage', e);
  }
  return seedMistakesData;
}

export function saveMistakeVault(items: MistakeNotebookItem[]): void {
  try {
    localStorage.setItem(MISTAKE_VAULT_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('learnx_mistakes_updated'));
  } catch (e) {
    console.error('Failed to write mistake vault to localStorage', e);
  }
}

export function addMistakeToVault(params: {
  questionId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  userWrongIndex: number;
  explanation: string;
  subjectName: string;
  chapterTitle?: string;
  classLevel: number;
  pyqYearOrSource?: string;
  sourceContext: '1v1_battle' | 'exam_simulator' | 'ncert_quiz' | 'sample_paper' | 'manual_bookmark';
  mistakeCategory?: MistakeCategory;
  aiRemedyNote?: string;
  mnemonicOrFormulaTip?: string;
}): MistakeNotebookItem {
  const current = getMistakeVault();
  
  // Check if this question is already in the vault
  const existingIdx = current.findIndex(
    (m) => m.questionId === params.questionId || m.questionText === params.questionText
  );

  const category: MistakeCategory =
    params.mistakeCategory ||
    (params.subjectName.toLowerCase().includes('math') || params.questionText.includes('value')
      ? 'Calculation Slip'
      : params.questionText.includes('formula') || params.questionText.includes('unit')
      ? 'Formula Gap'
      : params.questionText.toLowerCase().includes('not') || params.questionText.toLowerCase().includes('except')
      ? 'Misread Question'
      : 'Conceptual Error');

  const remedyNote =
    params.aiRemedyNote ||
    `AI Diagnosis: Carefully review the core definition. ${params.explanation}`;

  if (existingIdx >= 0) {
    // Update existing mistake entry
    const updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      userWrongIndex: params.userWrongIndex,
      attemptsCount: updated[existingIdx].attemptsCount + 1,
      status: 'needs_retest',
      masteryScore: Math.max(0, updated[existingIdx].masteryScore - 25),
      lastRetestedAt: new Date().toISOString(),
    };
    saveMistakeVault(updated);
    return updated[existingIdx];
  }

  const newItem: MistakeNotebookItem = {
    id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    questionId: params.questionId,
    questionText: params.questionText,
    options: params.options,
    correctIndex: params.correctIndex,
    userWrongIndex: params.userWrongIndex,
    explanation: params.explanation,
    subjectName: params.subjectName,
    chapterTitle: params.chapterTitle,
    classLevel: params.classLevel,
    pyqYearOrSource: params.pyqYearOrSource || 'NCERT PYQ',
    sourceContext: params.sourceContext,
    mistakeCategory: category,
    aiRemedyNote: remedyNote,
    mnemonicOrFormulaTip: params.mnemonicOrFormulaTip,
    masteryScore: 0,
    status: 'needs_retest',
    attemptsCount: 1,
    addedAt: new Date().toISOString(),
  };

  saveMistakeVault([newItem, ...current]);
  return newItem;
}

export function updateMistakeMastery(id: string, wasCorrect: boolean): MistakeNotebookItem | null {
  const current = getMistakeVault();
  const index = current.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const item = current[index];
  const newMastery = wasCorrect
    ? Math.min(100, item.masteryScore + 50)
    : Math.max(0, item.masteryScore - 25);

  const newStatus = newMastery >= 100 ? 'mastered' : newMastery > 0 ? 'in_progress' : 'needs_retest';

  const updatedItem: MistakeNotebookItem = {
    ...item,
    masteryScore: newMastery,
    status: newStatus,
    attemptsCount: item.attemptsCount + 1,
    lastRetestedAt: new Date().toISOString(),
  };

  const updatedList = [...current];
  updatedList[index] = updatedItem;
  saveMistakeVault(updatedList);
  return updatedItem;
}

export function removeMistakeFromVault(id: string): void {
  const current = getMistakeVault();
  saveMistakeVault(current.filter((m) => m.id !== id));
}
