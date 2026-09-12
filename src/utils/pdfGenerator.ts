import { jsPDF } from 'jspdf';
import { Chapter, User, PlannerTask, StudyAlarm } from '../types';
import { formatTime12Hour } from './alarmStorage';

interface StudyNotesOptions {
  title: string;
  subject: string;
  classLevel: number | string;
  overview?: string;
  keyConcepts?: { title: string; explanation: string; example?: string }[];
  formulas?: string[];
  revisionNotes?: string[];
  questions?: { question: string; answer?: string; explanation?: string; marks?: number }[];
  studentName?: string;
}

interface PlannerSummaryOptions {
  user: User;
  classLevel: number;
  tasks: PlannerTask[];
  alarms: StudyAlarm[];
  studyTargetHours?: number;
}

/**
 * Adds a standard LearnX running header and footer to a page
 */
function addRunningHeaderFooter(doc: jsPDF, pageNum: number, totalPages: number, docCategory: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top running header line (on pages > 1)
  if (pageNum > 1) {
    doc.setDrawColor(229, 224, 216); // #E5E0D8
    doc.setLineWidth(0.3);
    doc.line(15, 12, pageWidth - 15, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(139, 131, 116); // #8B8374
    doc.text('LearnX NCERT Study Companion', 15, 9);
    doc.text(docCategory, pageWidth - 15, 9, { align: 'right' });
  }

  // Bottom running footer line
  doc.setDrawColor(229, 224, 216);
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(139, 131, 116);
  const nowStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Generated on ${nowStr} • LearnX Educational Suite`, 15, pageHeight - 7);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 15, pageHeight - 7, { align: 'right' });
}

/**
 * Applies headers and footers to all pages after rendering
 */
function finalizePages(doc: jsPDF, docCategory: string) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addRunningHeaderFooter(doc, i, totalPages, docCategory);
  }
}

/**
 * Checks vertical position and creates a new page if remaining space is insufficient
 */
function ensureSpace(doc: jsPDF, currentY: number, requiredSpace: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (currentY + requiredSpace > pageHeight - 20) {
    doc.addPage();
    return 22; // Start position on new page below running header
  }
  return currentY;
}

/**
 * Generates and downloads a comprehensive Study Notes PDF
 */
export function downloadStudyNotesPDF(opts: StudyNotesOptions): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 30; // 15mm left/right margins

    let y = 18;

    // --- Title Banner (Sage Green) ---
    doc.setFillColor(90, 99, 78); // #5A634E
    doc.roundedRect(15, y, contentWidth, 24, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(237, 240, 233); // Light tint
    doc.text('LEARNX • NCERT SMART REVISION NOTES', 20, y + 8);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const splitTitle = doc.splitTextToSize(opts.title, contentWidth - 10);
    doc.text(splitTitle[0] || opts.title, 20, y + 17);

    y += 30;

    // --- Metadata Information Strip ---
    doc.setFillColor(245, 242, 237); // #F5F2ED
    doc.setDrawColor(229, 224, 216);
    doc.roundedRect(15, y, contentWidth, 12, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(74, 74, 58); // #4A4A3A
    doc.text(`Subject: ${opts.subject}`, 20, y + 7.5);
    doc.text(`Class: ${opts.classLevel}`, 75, y + 7.5);
    if (opts.studentName) {
      doc.text(`Student: ${opts.studentName}`, 130, y + 7.5);
    } else {
      doc.text(`Curriculum: CBSE / NCERT`, 130, y + 7.5);
    }

    y += 18;

    // --- Chapter Overview / Summary ---
    if (opts.overview) {
      y = ensureSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 99, 78);
      doc.text('1. Chapter Overview & Objectives', 15, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(56, 60, 47);
      const overviewLines = doc.splitTextToSize(opts.overview, contentWidth);
      doc.text(overviewLines, 15, y);
      y += overviewLines.length * 5 + 6;
    }

    // --- Key Concepts ---
    if (opts.keyConcepts && opts.keyConcepts.length > 0) {
      y = ensureSpace(doc, y, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 99, 78);
      doc.text('2. High-Yield Key Concepts', 15, y);
      y += 6;

      opts.keyConcepts.forEach((concept, idx) => {
        y = ensureSpace(doc, y, 22);

        // Concept Card Box
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 224, 216);
        doc.roundedRect(15, y, contentWidth, 16, 2, 2, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(74, 74, 58);
        doc.text(`• Concept ${idx + 1}: ${concept.title}`, 18, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(107, 102, 92);
        const expLines = doc.splitTextToSize(concept.explanation, contentWidth - 8);
        doc.text(expLines, 18, y + 11);

        y += Math.max(16, 10 + expLines.length * 4) + 4;

        if (concept.example) {
          y = ensureSpace(doc, y, 12);
          doc.setFillColor(245, 242, 237);
          doc.roundedRect(20, y, contentWidth - 10, 8, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(90, 99, 78);
          doc.text(`Illustration: ${concept.example}`, 23, y + 5.5);
          y += 12;
        }
      });
      y += 4;
    }

    // --- Formulas & Key Equations ---
    if (opts.formulas && opts.formulas.length > 0) {
      y = ensureSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 99, 78);
      doc.text('3. Essential Formulas & Quantitative Rules', 15, y);
      y += 6;

      opts.formulas.forEach((formula, idx) => {
        y = ensureSpace(doc, y, 12);

        doc.setFillColor(237, 240, 233); // Tint
        doc.setDrawColor(216, 223, 210);
        doc.roundedRect(15, y, contentWidth, 10, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(90, 99, 78);
        doc.text(`[Eq ${idx + 1}]`, 18, y + 6.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(40, 50, 30);
        const formulaLines = doc.splitTextToSize(formula, contentWidth - 30);
        doc.text(formulaLines[0] || formula, 35, y + 6.5);

        y += 13;
      });
      y += 4;
    }

    // --- Revision Bullet Points ---
    if (opts.revisionNotes && opts.revisionNotes.length > 0) {
      y = ensureSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 99, 78);
      doc.text('4. Rapid Examination Revision Points', 15, y);
      y += 6;

      opts.revisionNotes.forEach((note, idx) => {
        const noteLines = doc.splitTextToSize(`${idx + 1}. ${note}`, contentWidth - 6);
        const noteHeight = noteLines.length * 4.5 + 3;

        y = ensureSpace(doc, y, noteHeight);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(56, 60, 47);
        doc.text(noteLines, 17, y);

        y += noteHeight;
      });
      y += 4;
    }

    // --- Practice Q&As or MCQs ---
    if (opts.questions && opts.questions.length > 0) {
      y = ensureSpace(doc, y, 25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 99, 78);
      doc.text('5. High-Yield Practice Questions & Solutions', 15, y);
      y += 6;

      opts.questions.forEach((q, idx) => {
        const qLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, contentWidth - 8);
        const aLines = q.answer ? doc.splitTextToSize(`Ans: ${q.answer}`, contentWidth - 12) : [];
        const expLines = q.explanation ? doc.splitTextToSize(`Note: ${q.explanation}`, contentWidth - 12) : [];

        const totalCardHeight = 10 + (qLines.length + aLines.length + expLines.length) * 4.5;
        y = ensureSpace(doc, y, totalCardHeight);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 224, 216);
        doc.roundedRect(15, y, contentWidth, totalCardHeight - 2, 2, 2, 'D');

        let cardY = y + 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(74, 74, 58);
        doc.text(qLines, 18, cardY);
        cardY += qLines.length * 4.5 + 2;

        if (aLines.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(39, 110, 60);
          doc.text(aLines, 20, cardY);
          cardY += aLines.length * 4 + 1;
        }

        if (expLines.length > 0) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(107, 102, 92);
          doc.text(expLines, 20, cardY);
        }

        y += totalCardHeight + 2;
      });
    }

    // Finalize all pages with running headers & page numbers
    finalizePages(doc, `${opts.subject} • Class ${opts.classLevel}`);

    // Generate safe file name
    const sanitizedTitle = opts.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
    const fileName = `LearnX_${opts.subject}_Class${opts.classLevel}_${sanitizedTitle}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to generate Study Notes PDF:', err);
    return false;
  }
}

/**
 * Convenient wrapper to generate Study Notes PDF from a Chapter object
 */
export function downloadChapterNotesPDF(chapter: Chapter, subjectName: string, studentName?: string): boolean {
  return downloadStudyNotesPDF({
    title: chapter.title,
    subject: subjectName,
    classLevel: chapter.classLevel,
    overview: chapter.overview || chapter.description,
    keyConcepts: chapter.keyConcepts,
    formulas: chapter.formulas,
    revisionNotes: chapter.revisionNotes,
    questions: chapter.practiceTest?.questions?.map((q) => ({
      question: q.question,
      answer: q.options ? `Option: ${q.options[q.correctIndex]}` : undefined,
      explanation: q.explanation,
      marks: q.marks,
    })),
    studentName,
  });
}

/**
 * Generates and downloads a personalized Study Planner Summary & Timetable PDF
 */
export function downloadPlannerSummaryPDF(opts: PlannerSummaryOptions): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 30;

    let y = 18;

    // --- Header Banner ---
    doc.setFillColor(90, 99, 78); // #5A634E
    doc.roundedRect(15, y, contentWidth, 24, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(237, 240, 233);
    doc.text('LEARNX • DAILY STUDY PLANNER & TIMETABLE', 20, y + 8);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`${opts.user.name}'s Personalized Learning Schedule`, 20, y + 17);

    y += 30;

    // --- Profile & Progress Summary Strip ---
    doc.setFillColor(245, 242, 237);
    doc.setDrawColor(229, 224, 216);
    doc.roundedRect(15, y, contentWidth, 15, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(74, 74, 58);
    doc.text(`Class: ${opts.classLevel} ${opts.user.stream ? `(${opts.user.stream})` : ''}`, 20, y + 6.5);
    doc.text(`Study Streak: ${opts.user.streakDays} Days`, 75, y + 6.5);
    doc.text(`Earned XP: ${opts.user.xp.toLocaleString()} XP`, 130, y + 6.5);

    const completedTasks = opts.tasks.filter((t) => t.isCompleted).length;
    const taskProgressPct = opts.tasks.length > 0 ? Math.round((completedTasks / opts.tasks.length) * 100) : 0;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 102, 92);
    doc.text(`Task Progress: ${completedTasks}/${opts.tasks.length} Completed (${taskProgressPct}%)`, 20, y + 11.5);
    doc.text(`Active Alarms: ${opts.alarms.filter((a) => a.isEnabled).length} Scheduled`, 130, y + 11.5);

    y += 22;

    // --- Section 1: Active Study Alarms & Audio Timetable ---
    y = ensureSpace(doc, y, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(90, 99, 78);
    doc.text('1. Scheduled Study Alarms & Audio Reminders', 15, y);
    y += 6;

    if (opts.alarms.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(139, 131, 116);
      doc.text('No study alarms configured. Set reminder alarms in the LearnX Study Planner.', 15, y);
      y += 8;
    } else {
      // Table Header
      doc.setFillColor(237, 240, 233);
      doc.rect(15, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(90, 99, 78);
      doc.text('Time', 18, y + 5);
      doc.text('Alarm Title / Purpose', 45, y + 5);
      doc.text('Subject', 115, y + 5);
      doc.text('Frequency', 150, y + 5);
      y += 7;

      opts.alarms.forEach((alarm) => {
        y = ensureSpace(doc, y, 9);
        doc.setDrawColor(235, 230, 222);
        doc.line(15, y + 8, pageWidth - 15, y + 8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(alarm.isEnabled ? 74 : 150, alarm.isEnabled ? 74 : 150, alarm.isEnabled ? 58 : 150);
        doc.text(formatTime12Hour(alarm.time), 18, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.text(alarm.title.slice(0, 38), 45, y + 5.5);

        doc.text(alarm.subject || 'General Study', 115, y + 5.5);

        const freqStr = alarm.repeat === 'daily' ? 'Daily' : alarm.repeat === 'weekdays' ? 'Mon-Fri' : 'Custom';
        doc.text(alarm.isEnabled ? freqStr : 'Disabled', 150, y + 5.5);

        y += 8.5;
      });
      y += 6;
    }

    // --- Section 2: Syllabus Tasks, Chapter Goals & Deadlines ---
    y = ensureSpace(doc, y, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(90, 99, 78);
    doc.text('2. Academic Goals & Syllabus Checkpoints', 15, y);
    y += 6;

    if (opts.tasks.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(139, 131, 116);
      doc.text('No pending study tasks found. Add goals in the Study Planner.', 15, y);
      y += 8;
    } else {
      opts.tasks.forEach((task) => {
        y = ensureSpace(doc, y, 14);

        doc.setFillColor(task.isCompleted ? 245 : 255, 242, 237);
        doc.setDrawColor(229, 224, 216);
        doc.roundedRect(15, y, contentWidth, 12, 1.5, 1.5, task.isCompleted ? 'FD' : 'D');

        // Checkbox status circle
        doc.setFillColor(task.isCompleted ? 90 : 255, task.isCompleted ? 99 : 255, task.isCompleted ? 78 : 255);
        doc.setDrawColor(90, 99, 78);
        doc.circle(21, y + 6, 2.5, task.isCompleted ? 'FD' : 'D');

        doc.setFont('helvetica', task.isCompleted ? 'normal' : 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(task.isCompleted ? 139 : 74, task.isCompleted ? 131 : 74, task.isCompleted ? 116 : 58);
        const taskTitle = task.isCompleted ? `[Done] ${task.title}` : task.title;
        doc.text(taskTitle.slice(0, 50), 28, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(107, 102, 92);
        const metaText = `Subject: ${task.subject || 'All'} • Due: ${task.date || 'Today'} • Duration: ${task.durationMinutes || 45} mins`;
        doc.text(metaText, 28, y + 9.5);

        // Priority badge
        const prioColor: Record<string, [number, number, number]> = {
          high: [192, 57, 43],
          medium: [175, 96, 26],
          low: [90, 99, 78],
        };
        const color = prioColor[task.priority || 'medium'] || [90, 99, 78];
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...color);
        doc.text((task.priority || 'NORMAL').toUpperCase(), contentWidth + 5, y + 7, { align: 'right' });

        y += 14;
      });
      y += 4;
    }

    // --- Section 3: Pomodoro Focus Guidelines & Daily Advice ---
    y = ensureSpace(doc, y, 32);
    doc.setFillColor(245, 242, 237);
    doc.setDrawColor(216, 223, 210);
    doc.roundedRect(15, y, contentWidth, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 99, 78);
    doc.text('3. Proven Pomodoro & Spaced Repetition Strategy', 20, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(74, 74, 58);
    doc.text('• 25m Focus Block: 25 minutes pure uninterrupted reading without phone distractions.', 20, y + 12);
    doc.text('• 5m Active Rest: Hydrate, stretch, or rest your eyes before starting the next concept.', 20, y + 16.5);
    doc.text('• 4-Cycle Rule: After four consecutive 25m sprints, take a restorative 20-30 minute break.', 20, y + 21);

    y += 32;

    // Finalize pages
    finalizePages(doc, 'LearnX Study Planner & Timetable');

    const fileName = `LearnX_Study_Planner_${opts.user.name.replace(/[^a-zA-Z0-9]/g, '_')}_Class${opts.classLevel}.pdf`;
    doc.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to generate Planner Summary PDF:', err);
    return false;
  }
}
