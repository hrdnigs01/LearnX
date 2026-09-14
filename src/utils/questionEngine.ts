import { PYQBattleQuestion, UserQuestionAttemptHistory } from '../types';

/**
 * Fisher-Yates Option Shuffler
 * Randomizes options A, B, C, D so correct answer is uniformly distributed (25% each)
 * Eliminates 'Option A' bias completely.
 */
export function shuffleQuestionOptions<T extends { options: string[]; correctIndex: number }>(question: T): T {
  if (!question.options || question.options.length < 2) return question;

  const originalCorrectText = question.options[question.correctIndex];
  const indices = question.options.map((_, i) => i);

  // Fisher-Yates Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const newOptions = indices.map((idx) => question.options[idx]);
  const newCorrectIndex = newOptions.indexOf(originalCorrectText);

  return {
    ...question,
    options: newOptions,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}

/**
 * Get Unique, Non-Repeating Questions excluding user's past attempt history
 */
export function filterUniqueQuestions(
  pool: PYQBattleQuestion[],
  historyQuestionIds: Set<string>,
  options?: {
    subject?: string;
    classLevel?: number;
    topic?: string;
    difficulty?: string;
    count?: number;
  }
): PYQBattleQuestion[] {
  let filtered = [...pool];

  if (options?.subject && options.subject !== 'All') {
    filtered = filtered.filter(
      (q) => q.subject.toLowerCase() === options.subject!.toLowerCase()
    );
  }

  if (options?.classLevel && options.classLevel > 0) {
    filtered = filtered.filter((q) => q.classLevel === options.classLevel);
  }

  if (options?.topic && options.topic !== 'All' && options.topic !== 'all') {
    filtered = filtered.filter(
      (q) => q.topic.toLowerCase().includes(options.topic!.toLowerCase())
    );
  }

  if (options?.difficulty && options.difficulty !== 'All' && options.difficulty !== 'Mixed') {
    filtered = filtered.filter(
      (q) => q.difficulty?.toLowerCase() === options.difficulty!.toLowerCase()
    );
  }

  // Strictly prioritize never-attempted questions: WHERE question_id NOT IN (...)
  const neverAttempted = filtered.filter((q) => !historyQuestionIds.has(q.id));

  let finalSelection: PYQBattleQuestion[] = [];

  if (neverAttempted.length >= (options?.count || 5)) {
    finalSelection = neverAttempted;
  } else {
    // If pool exhausted in this niche, include least recently attempted
    finalSelection = [...neverAttempted, ...filtered.filter((q) => historyQuestionIds.has(q.id))];
  }

  // Shuffle question order
  const shuffledQuestions = [...finalSelection].sort(() => 0.5 - Math.random());
  const selectedBatch = shuffledQuestions.slice(0, options?.count || 5);

  // Dynamically shuffle options for each selected question
  return selectedBatch.map((q) => shuffleQuestionOptions(q));
}

/**
 * Helper to determine appropriate timer in seconds
 * Standard MCQs: 60-120 seconds
 * Numericals / Calculations: 180-300 seconds (3-5 minutes)
 */
export function getRecommendedTimerSeconds(question: PYQBattleQuestion): number {
  if (question.timeLimitSeconds && question.timeLimitSeconds >= 60) {
    return question.timeLimitSeconds;
  }

  const text = (question.question + ' ' + (question.explanation || '')).toLowerCase();
  const isNumerical =
    text.includes('calculate') ||
    text.includes('ratio') ||
    text.includes('value of') ||
    text.includes('numerical') ||
    text.includes('mass') ||
    text.includes('velocity') ||
    text.includes('resistance') ||
    text.includes('integrate') ||
    text.includes('solve for') ||
    text.includes('√') ||
    text.includes('^');

  if (isNumerical) {
    // 3 to 5 minutes for numerical calculation problems
    return question.difficulty === 'Hard' ? 240 : 180;
  }

  // Standard MCQ: 75 to 90 seconds
  return question.difficulty === 'Hard' ? 90 : 75;
}
