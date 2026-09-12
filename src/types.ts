export type UserRole = 'student' | 'seller' | 'service_provider' | 'admin' | 'tutor' | 'centre';

export interface KycDetails {
  panNumber?: string;
  aadhaarLast4?: string;
  businessName?: string;
  bankAccountNo?: string;
  ifscCode?: string;
  upiVpa?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  classLevel: number; // 6 - 12
  stream?: 'Science' | 'Commerce' | 'Arts';
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  badges: Badge[];
  createdAt: string;
  // Auth & Roles
  isRoleSelected?: boolean;
  authProvider?: 'mobile_otp' | 'google' | 'email_password';
  kycStatus?: 'not_submitted' | 'pending_verification' | 'verified' | 'rejected';
  kycDetails?: KycDetails;
  payoutBalance?: number; // 85% net earnings available for payout
  totalEarned?: number;
  totalWithdrawn?: number;
  // Student Profile Customization
  schoolName?: string;
  city?: string;
  locality?: string;
  // Competitive 1v1 Battle Stats
  eloRating?: number;
  battleWins?: number;
  battleLosses?: number;
  battleTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
  // Wallet Engine (Real INR Cash + Virtual Coins + Escrow)
  walletCash?: number; // e.g. 120 (INR)
  walletCoins?: number; // e.g. 1450 (Coins)
  escrowCash?: number; // Amount held in escrow during active duel (e.g. 20)
  totalEarningsCash?: number; // Cumulative winnings from paid duels in INR
}

export type BattleTierId = 'tier_free' | 'tier_20' | 'tier_40' | 'tier_60' | 'tier_80';

export interface BattleTierConfig {
  id: BattleTierId;
  name: string;
  entryFee: number; // in INR
  winnerReward: number; // in INR
  winnerRewardCoins?: number; // for free tier (5 Coins)
  isCash: boolean;
  tagline: string;
  badge: string;
  badgeColor: string;
}

export const BATTLE_TIERS: BattleTierConfig[] = [
  {
    id: 'tier_free',
    name: 'Free Practice Arena',
    entryFee: 0,
    winnerReward: 0,
    winnerRewardCoins: 5,
    isCash: false,
    tagline: 'Zero risk, sharpen skills',
    badge: 'Entry ₹0 → Win 5 Coins',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'tier_20',
    name: 'Bronze Duel',
    entryFee: 20,
    winnerReward: 30,
    isCash: true,
    tagline: 'Entry ₹20 • Winner gets ₹30',
    badge: '₹20 Entry → ₹30 Win',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'tier_40',
    name: 'Silver Duel',
    entryFee: 40,
    winnerReward: 50,
    isCash: true,
    tagline: 'Entry ₹40 • Winner gets ₹50',
    badge: '₹40 Entry → ₹50 Win',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 'tier_60',
    name: 'Gold Duel',
    entryFee: 60,
    winnerReward: 70,
    isCash: true,
    tagline: 'Entry ₹60 • Winner gets ₹70',
    badge: '₹60 Entry → ₹70 Win',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  },
  {
    id: 'tier_80',
    name: 'Platinum Duel',
    entryFee: 80,
    winnerReward: 90,
    isCash: true,
    tagline: 'Entry ₹80 • Winner gets ₹90',
    badge: '₹80 Entry → ₹90 Win',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

export type WalletTransactionType =
  | 'deposit'
  | 'escrow_hold'
  | 'match_payout_win'
  | 'match_loss_forfeit'
  | 'escrow_refund'
  | 'coin_reward'
  | 'coin_redemption';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  amountCash: number; // positive = credit, negative = debit
  amountCoins: number; // positive = credit, negative = debit
  balanceCashAfter: number;
  balanceCoinsAfter: number;
  description: string;
  status: 'settled' | 'held_in_escrow' | 'refunded';
  createdAt: string;
  metadata?: {
    tierId?: string;
    tierName?: string;
    matchId?: string;
    opponentName?: string;
    coinsRedeemed?: number;
    cashCredited?: number;
    upiReference?: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export type SubjectMaterialType = 'mathematics' | 'business-studies' | 'physics' | 'biology' | 'accountancy';

export interface Subject {
  id: string;
  classLevel: number;
  name: string;
  code: string;
  icon: string;
  color: string;
  chaptersCount: number;
  description: string;
  stream?: 'Science' | 'Commerce' | 'Arts' | 'All';
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  classLevel: number;
  chapterNumber: number;
  title: string;
  description: string;
  overview: string;
  keyConcepts: {
    title: string;
    explanation: string;
    example?: string;
  }[];
  formulas: string[];
  revisionNotes: string[];
  mcqs: MCQQuestion[];
  practiceTest: {
    id: string;
    title: string;
    durationMinutes: number;
    totalMarks: number;
    questions: PracticeTestQuestion[];
  };
}

export interface QuizAttemptResult {
  id: string;
  userId: string;
  chapterId: string;
  subjectId: string;
  score: number;
  total: number;
  percentage: number;
  xpEarned: number;
  passed: boolean;
  date: string;
}

export interface PlannerTask {
  id: string;
  userId: string;
  subject: string;
  chapter: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  isCompleted: boolean;
  reminderEnabled: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export type AlarmSoundType = 'bell' | 'digital' | 'chime' | 'gentle';

export interface StudyAlarm {
  id: string;
  userId?: string;
  title: string;
  subject: string;
  time: string; // "HH:MM" 24-hour format
  isEnabled: boolean;
  repeat: 'daily' | 'weekdays' | 'custom' | 'once';
  days: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  soundType: AlarmSoundType;
  snoozeMinutes: number;
  notes?: string;
  lastTriggeredKey?: string;
  taskId?: string;
}

export type TuitionType = 'centre' | 'home' | 'online';

export interface TuitionProfile {
  id: string;
  type: TuitionType;
  name: string;
  tagLine: string;
  subjects: string[];
  classes: number[];
  fees: number;
  feeFrequency: 'per month' | 'per course';
  timings: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  availableSeats: number;
  totalSeats: number;
  verified: boolean;
  faculty: string[];
  phone: string;
  email: string;
  description: string;
  referralCode: string;
  highlights: string[];
}

export type AdmissionStatus = 'Submitted' | 'Under Review' | 'Accepted' | 'Paid' | 'Enrolled' | 'Rejected';

export interface AdmissionRequest {
  id: string; // e.g. LX-ADM-XXXX
  studentId: string;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  studentClass: number;
  tuitionId: string;
  tuitionName: string;
  tuitionType: TuitionType;
  preferredTiming: string;
  message?: string;
  status: AdmissionStatus;
  referralCode?: string;
  feeAmount: number;
  commissionAmount: number; // 15% LearnX platform commission
  commissionPercent: number; // 15
  paymentId?: string;
  qrCodeDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MarketplaceCategory =
  | 'Used Books'
  | 'Stationery'
  | 'Peer Tutoring'
  | 'Tutoring'
  | 'Presentations & Charts'
  | 'PPT/Design'
  | 'Chart/Diagram'
  | 'Project Guidance'
  | 'Study Notes'
  | 'Notes Organization';

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  title: string;
  category: MarketplaceCategory;
  price: number;
  isExchange: boolean;
  condition?: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  classLevel?: number;
  subject?: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  status: 'active' | 'sold' | 'under_review';
  tags: string[];
  createdAt: string;
}

export type PaymentStatus =
  | 'Pending'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export interface PaymentTransaction {
  id: string; // TXN-UPI-XXXX
  admissionId?: string;
  marketplaceItemId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  vpa: string;
  paymentMethod: 'UPI' | 'QR' | 'Intent';
  status: PaymentStatus;
  commissionAmount: number; // 15% LearnX commission for admissions
  netAmount: number; // amount - commission
  idempotencyKey: string;
  receiptNumber: string;
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
  description: string;
}

export interface WebSearchResult {
  query: string;
  summary: string;
  sources: {
    title: string;
    uri: string;
    snippet?: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'admission' | 'payment' | 'study' | 'quiz' | 'badge' | 'system';
  read: boolean;
  timestamp: string;
  actionLink?: string;
}

export type LeaderboardTimeframe = 'daily' | 'weekly' | 'all_time';

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  classLevel: number;
  xp: number;
  streakDays: number;
  level: number;
}

export interface QuizLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  classLevel: number;
  battlesWon: number;
  totalBattles: number;
  winPercentage: number;
  totalEarningsCash: number; // in INR
  eloRating: number;
  tier: string;
  city?: string;
  badge?: string;
}

export interface XPLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  classLevel: number;
  xp: number;
  streakDays: number;
  level: number;
  lessonsCompleted: number;
  practiceTestsCount: number;
  city?: string;
  badge?: string;
}

export interface DualLeaderboardResponse {
  timeframe: LeaderboardTimeframe;
  quizLeaderboard: QuizLeaderboardEntry[];
  xpLeaderboard: XPLeaderboardEntry[];
  userQuizRank?: number;
  userXpRank?: number;
}

export interface MarketplaceOrder {
  id: string; // ORD-XXXX
  itemId: string;
  itemTitle: string;
  itemCategory: MarketplaceCategory;
  itemPrice: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerAddress?: string;
  paymentTransactionId: string;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  grossAmount: number;
  learnxCommission: number; // 15% LearnX platform fee
  sellerPayoutAmount: number; // 85% net to seller
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRecord {
  id: string; // PAYOUT-XXXX
  userId: string;
  userName: string;
  role: UserRole;
  grossAmount: number;
  commissionDeducted: number;
  netPayoutAmount: number;
  destinationType: 'bank_account' | 'upi';
  destinationDetail: string;
  status: 'Pending' | 'Processed' | 'Failed';
  utr?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface GatewayWebhookLog {
  id: string;
  gateway: 'phonepe' | 'razorpay' | 'cashfree' | 'npci_upi';
  event: string;
  transactionId: string;
  amount: number;
  status: string;
  signatureVerified: boolean;
  timestamp: string;
}

export interface AiDiagnosticStatus {
  apiKeyConfigured: boolean;
  primaryModel: string;
  fallbackModels: string[];
  activeModel: string;
  lastCheckedAt: string;
  status: 'connected' | 'degraded' | 'error';
  lastTechnicalError: string | null;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  latencyMs?: number;
}

// ==========================================
// USER FEEDBACK & ISSUE REPORTING TYPES
// ==========================================
export type FeedbackCategory = 'general' | 'feature_request' | 'bug' | 'content_issue' | 'suggestion';
export type IssueType = 'wrong_answer' | 'typo' | 'technical_glitch' | 'missing_diagram' | 'other';
export type FeedbackStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface FeedbackPageContext {
  path?: string;
  tab?: string;
  subjectId?: string;
  subjectName?: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  questionId?: string;
  questionText?: string;
  selectedAnswer?: string;
  correctAnswer?: string;
  classLevel?: number;
  url?: string;
  timestamp?: string;
}

export interface UserFeedback {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  role?: string;
  rating?: number; // 1 to 5 stars
  category: FeedbackCategory;
  issueType?: IssueType;
  title: string;
  description: string;
  tags?: string[];
  pageContext?: FeedbackPageContext;
  status: FeedbackStatus;
  adminResponse?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// INTERACTIVE NOTES & BOOKMARKING TYPES
// ==========================================
export type BookmarkContentType = 'concept' | 'formula' | 'question' | 'note_highlight' | 'revision_point';

export interface SavedBookmark {
  id: string;
  userId: string;
  type: BookmarkContentType;
  title: string;
  content: string;
  highlightColor?: 'amber' | 'emerald' | 'sky' | 'rose' | 'purple';
  subjectId?: string;
  subjectName?: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  classLevel?: number;
  tags?: string[];
  userNotes?: string;
  createdAt: string;
}

// ==========================================
// PEER DISCUSSION FORUM TYPES
// ==========================================
export interface DiscussionAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  content: string;
  upvotes: number;
  upvotedBy: string[]; // user IDs
  isAccepted?: boolean;
  createdAt: string;
}

export interface DiscussionQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId?: string;
  chapterNumber?: number;
  chapterTitle?: string;
  classLevel: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  upvotes: number;
  upvotedBy: string[];
  tags: string[];
  answers: DiscussionAnswer[];
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// STUDENT WEAK AREA & PERFORMANCE INSIGHTS
// ==========================================
export interface RecommendedRevisionItem {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterTitle: string;
  chapterNumber: number;
  subtopic: string;
  accuracy: number; // e.g. 45%
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  recommendedAction: 'take_quiz' | 'review_notes' | 'solve_practice';
}

export interface SubjectAccuracyMetric {
  subjectId: string;
  subjectName: string;
  accuracyPercentage: number;
  totalQuestionsAttempted: number;
  correctCount: number;
  incorrectCount: number;
  tier: 'Excellent' | 'Good' | 'Needs Attention' | 'Critical';
  weakSubtopics: string[];
}

export interface StudentPerformanceAnalytics {
  overallAccuracy: number;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  streakDays: number;
  xp: number;
  level: number;
  subjectMetrics: SubjectAccuracyMetric[];
  recommendedRevisions: RecommendedRevisionItem[];
  recentQuizScores: {
    date: string;
    subjectName: string;
    chapterTitle: string;
    score: number;
    total: number;
    percentage: number;
  }[];
}

// ==========================================
// LIVE 1V1 PYQ BATTLE & DUEL ARENA
// ==========================================
export type BattleTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';

export interface PYQBattleQuestion {
  id: string;
  subject: string;
  topic: string;
  classLevel: number;
  pyqSource: string; // e.g., 'CBSE 2024', 'JEE Main 2023', 'NEET UG 2024'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timeLimitSeconds: number; // typically 15 seconds
}

export interface BattleOpponent {
  id: string;
  name: string;
  avatar: string;
  school: string;
  city: string;
  eloRating: number;
  tier: BattleTier;
  level: number;
  isBot?: boolean;
}

export interface BattleRoundResult {
  questionIndex: number;
  playerAnswer: number | null;
  playerTimeSeconds: number;
  playerScoreGain: number;
  opponentAnswer: number | null;
  opponentTimeSeconds: number;
  opponentScoreGain: number;
  correctIndex: number;
}

export interface BattleDuelState {
  id: string;
  opponent: BattleOpponent;
  subject: string;
  classLevel: number;
  status: 'searching' | 'match_found' | 'countdown' | 'in_round' | 'round_feedback' | 'finished';
  currentQuestionIndex: number;
  questions: PYQBattleQuestion[];
  playerScore: number;
  opponentScore: number;
  roundResults: BattleRoundResult[];
  playerCurrentAnswer: number | null;
  opponentCurrentAnswer: number | null;
  playerAnswerTime: number;
  opponentAnswerTime: number;
  eloChange: number;
  isWinner: boolean | null; // true = won, false = lost, null = draw
}

// ==========================================
// AI MISTAKE NOTEBOOK ("WEAKNESS VAULT")
// ==========================================
export type MistakeCategory =
  | 'Conceptual Error'
  | 'Calculation Slip'
  | 'Formula Gap'
  | 'Misread Question';

export interface MistakeNotebookItem {
  id: string;
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
  mistakeCategory: MistakeCategory;
  aiRemedyNote: string;
  mnemonicOrFormulaTip?: string;
  masteryScore: number; // 0 (Unmastered), 50 (Under Review), 100 (Mastered)
  status: 'needs_retest' | 'in_progress' | 'mastered';
  attemptsCount: number;
  lastRetestedAt?: string;
  addedAt: string;
}

// ==========================================
// REAL EXAM SIMULATOR (NTA / BOARD CBT)
// ==========================================
export type ExamQuestionPaletteStatus =
  | 'not_visited'
  | 'not_answered'
  | 'answered'
  | 'marked_for_review'
  | 'answered_and_marked_for_review';

export interface ExamSimulatorQuestion {
  id: string;
  sectionId: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  positiveMarks: number; // default +4
  negativeMarks: number; // default -1
  imagePromptOrFormula?: string;
  topic?: string;
}

export interface ExamSimulatorSection {
  id: string;
  name: string; // e.g. 'Physics', 'Chemistry', 'Mathematics', 'Biology'
  questionIds: string[];
}

export interface ExamSimulatorPaper {
  id: string;
  title: string; // e.g., 'NTA JEE Main 2026 Full Syllabus CBT Mock'
  code: string;
  boardOrConductingBody: 'NTA' | 'CBSE Board' | 'NEET UG' | 'ICSE' | 'NCERT All-India';
  grade: string;
  totalTimeMinutes: number; // e.g. 60 or 180
  totalMarks: number;
  instructions: string[];
  sections: ExamSimulatorSection[];
  questions: ExamSimulatorQuestion[];
}

export interface ExamQuestionState {
  selectedOption: number | null;
  status: ExamQuestionPaletteStatus;
  timeSpentSeconds: number;
}

export interface ExamResultBreakdown {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  totalScore: number;
  maximumMarks: number;
  negativeMarksLost: number;
  accuracyPercentage: number;
  percentileRankEstimate: number;
  timeTakenMinutes: number;
  sectionWise: {
    sectionName: string;
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
    maxScore: number;
  }[];
}


