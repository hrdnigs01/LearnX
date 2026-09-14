import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import {
  User,
  Subject,
  Chapter,
  TuitionProfile,
  AdmissionRequest,
  MarketplaceItem,
  PaymentTransaction,
  PlannerTask,
  NotificationItem,
  QuizAttemptResult,
  MarketplaceOrder,
  PayoutRecord,
  GatewayWebhookLog,
  UserFeedback,
  SavedBookmark,
  DiscussionQuestion,
  WalletTransaction,
  UserQuestionAttemptHistory,
} from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'learnx_db.json');

export interface DatabaseSchema {
  users: User[];
  subjects: Subject[];
  chapters: Chapter[];
  tuitions: TuitionProfile[];
  admissions: AdmissionRequest[];
  marketplace: MarketplaceItem[];
  payments: PaymentTransaction[];
  plannerTasks: PlannerTask[];
  quizAttempts: QuizAttemptResult[];
  notifications: NotificationItem[];
  orders: MarketplaceOrder[];
  payouts: PayoutRecord[];
  webhookLogs: GatewayWebhookLog[];
  feedbacks: UserFeedback[];
  bookmarks: SavedBookmark[];
  discussions: DiscussionQuestion[];
  walletTransactions: WalletTransaction[];
  emailAuditLogs: any[];
  userQuestionHistory: UserQuestionAttemptHistory[];
}

// Initial seed data
const initialUsers: User[] = [
  {
    id: 'user_student_1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@learnx.in',
    phone: '+91 98765 43210',
    role: 'student',
    isRoleSelected: true,
    authProvider: 'email_password',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    classLevel: 10,
    stream: 'Science',
    xp: 1420,
    level: 4,
    streakDays: 7,
    lastActiveDate: new Date().toISOString(),
    walletCash: 120,
    walletCoins: 1450,
    escrowCash: 0,
    totalEarningsCash: 350,
    eloRating: 1450,
    battleWins: 18,
    battleLosses: 4,
    battleTier: 'Gold',
    badges: [
      { id: 'b1', title: 'First Step', description: 'Completed first NCERT quiz', icon: 'Award', unlockedAt: '2026-08-20' },
      { id: 'b2', title: 'Week Warrior', description: 'Achieved 7-day study streak', icon: 'Flame', unlockedAt: '2026-09-01' },
      { id: 'b3', title: 'Maths Wizard', description: 'Scored 100% on Quadratic Equations', icon: 'Zap', unlockedAt: '2026-08-28' },
    ],
    createdAt: '2026-08-15',
  },
  {
    id: 'user_seller_1',
    name: 'Priya Books & Stationery',
    email: 'priya.books@learnx.in',
    phone: '+91 98200 11223',
    role: 'seller',
    isRoleSelected: true,
    authProvider: 'mobile_otp',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    classLevel: 12,
    xp: 2800,
    level: 8,
    streakDays: 14,
    lastActiveDate: new Date().toISOString(),
    kycStatus: 'verified',
    kycDetails: {
      panNumber: 'ABCPG1234F',
      aadhaarLast4: '8821',
      businessName: 'Priya Academic Supplies & NCERT Book Depot',
      bankAccountNo: '982001928374',
      ifscCode: 'HDFC0000123',
      upiVpa: 'priyabooks@okhdfcbank',
      verifiedAt: '2026-08-01',
    },
    payoutBalance: 4250,
    totalEarned: 18500,
    totalWithdrawn: 14250,
    badges: [
      { id: 'b_s1', title: 'Top Rated Seller', description: '100% verified student textbook seller', icon: 'ShieldCheck', unlockedAt: '2026-08-01' },
    ],
    createdAt: '2026-07-01',
  },
  {
    id: 'user_provider_1',
    name: 'Er. Rajesh Bansal (Mentorship & Tutoring)',
    email: 'rajesh.bansal@learnx.in',
    phone: '+91 98711 22334',
    role: 'service_provider',
    isRoleSelected: true,
    authProvider: 'google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    classLevel: 12,
    xp: 4100,
    level: 12,
    streakDays: 30,
    lastActiveDate: new Date().toISOString(),
    kycStatus: 'verified',
    kycDetails: {
      panNumber: 'BNSLR5544K',
      aadhaarLast4: '4190',
      businessName: 'Bansal CBSE & JEE Doubt Mentorship Hub',
      bankAccountNo: '501002938471',
      ifscCode: 'SBIN0000456',
      upiVpa: 'rajesh.bansal@oksbi',
      verifiedAt: '2026-07-15',
    },
    payoutBalance: 7650,
    totalEarned: 34000,
    totalWithdrawn: 26350,
    badges: [
      { id: 'b_p1', title: 'Verified Mentor', description: 'Certified IIT/CBSE guidance provider', icon: 'Award', unlockedAt: '2026-07-15' },
    ],
    createdAt: '2026-06-15',
  },
  {
    id: 'user_tutor_1',
    name: 'Dr. Shalini Verma',
    email: 'shalini.verma@learnx.in',
    phone: '+91 98112 34567',
    role: 'service_provider',
    isRoleSelected: true,
    authProvider: 'email_password',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    classLevel: 12,
    xp: 3500,
    level: 10,
    streakDays: 22,
    lastActiveDate: new Date().toISOString(),
    badges: [
      { id: 'b_t1', title: 'Verified Educator', description: 'Document & background verified', icon: 'CheckCircle', unlockedAt: '2026-06-10' },
      { id: 'b_t2', title: 'Top Rated Tutor', description: 'Maintained 4.9+ star rating', icon: 'Star', unlockedAt: '2026-08-01' },
    ],
    createdAt: '2026-05-10',
  },
  {
    id: 'user_centre_1',
    name: 'Apex Scholars Academy',
    email: 'director@apexscholars.edu.in',
    phone: '+91 11 4567 8900',
    role: 'service_provider',
    isRoleSelected: true,
    authProvider: 'email_password',
    avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
    classLevel: 11,
    xp: 5000,
    level: 15,
    streakDays: 45,
    lastActiveDate: new Date().toISOString(),
    badges: [
      { id: 'b_c1', title: 'Certified Hub', description: 'Affiliated Coaching Institute', icon: 'ShieldCheck', unlockedAt: '2026-04-12' },
    ],
    createdAt: '2026-04-01',
  },
  {
    id: 'user_admin_1',
    name: 'LearnX Admin',
    email: 'admin@learnx.in',
    phone: '+91 80000 12345',
    role: 'admin',
    isRoleSelected: true,
    authProvider: 'email_password',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    classLevel: 12,
    xp: 9999,
    level: 25,
    streakDays: 100,
    lastActiveDate: new Date().toISOString(),
    badges: [
      { id: 'b_a1', title: 'Platform Master', description: 'LearnX Operations Admin', icon: 'Crown', unlockedAt: '2026-01-01' },
    ],
    createdAt: '2026-01-01',
  },
];

// Rich NCERT Subjects for 6 to 12
const initialSubjects: Subject[] = [
  // Class 10
  { id: 'sub_10_math', classLevel: 10, name: 'Mathematics', code: 'MATH-10', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 14, description: 'Real Numbers, Polynomials, Quadratic Equations, Triangles, Trigonometry, Statistics' },
  { id: 'sub_10_sci', classLevel: 10, name: 'Science', code: 'SCI-10', icon: 'Atom', color: 'from-emerald-500 to-teal-600', chaptersCount: 13, description: 'Chemical Reactions, Acids & Bases, Life Processes, Light, Electricity, Magnetic Effects' },
  { id: 'sub_10_sst', classLevel: 10, name: 'Social Science', code: 'SST-10', icon: 'Globe2', color: 'from-blue-500 to-indigo-600', chaptersCount: 18, description: 'History, Democratic Politics, Contemporary India, Economics' },
  { id: 'sub_10_eng', classLevel: 10, name: 'English', code: 'ENG-10', icon: 'BookOpen', color: 'from-purple-500 to-pink-600', chaptersCount: 12, description: 'First Flight, Footprints without Feet, Grammar & Composition' },

  // Class 9
  { id: 'sub_9_math', classLevel: 9, name: 'Mathematics', code: 'MATH-09', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 12, description: 'Number Systems, Polynomials, Coordinate Geometry, Lines and Angles, Triangles' },
  { id: 'sub_9_sci', classLevel: 9, name: 'Science', code: 'SCI-09', icon: 'Atom', color: 'from-emerald-500 to-teal-600', chaptersCount: 12, description: 'Matter in Our Surroundings, Fundamental Unit of Life, Motion, Force & Laws of Motion' },
  { id: 'sub_9_sst', classLevel: 9, name: 'Social Science', code: 'SST-09', icon: 'Globe2', color: 'from-blue-500 to-indigo-600', chaptersCount: 15, description: 'India and Contemporary World, Electoral Politics, Economics of Village Palampur' },

  // Class 8
  { id: 'sub_8_math', classLevel: 8, name: 'Mathematics', code: 'MATH-08', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 13, description: 'Rational Numbers, Linear Equations, Understanding Quadrilaterals, Mensuration' },
  { id: 'sub_8_sci', classLevel: 8, name: 'Science', code: 'SCI-08', icon: 'Atom', color: 'from-emerald-500 to-teal-600', chaptersCount: 13, description: 'Crop Production, Microorganisms, Coal & Petroleum, Combustion and Flame' },

  // Class 7
  { id: 'sub_7_math', classLevel: 7, name: 'Mathematics', code: 'MATH-07', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 13, description: 'Integers, Fractions and Decimals, Data Handling, Simple Equations, Lines and Angles' },
  { id: 'sub_7_sci', classLevel: 7, name: 'Science', code: 'SCI-07', icon: 'Atom', color: 'from-emerald-500 to-teal-600', chaptersCount: 13, description: 'Nutrition in Plants, Heat, Acids & Bases, Physical and Chemical Changes' },

  // Class 6
  { id: 'sub_6_math', classLevel: 6, name: 'Mathematics', code: 'MATH-06', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 12, description: 'Knowing Our Numbers, Whole Numbers, Playing with Numbers, Basic Geometrical Ideas' },
  { id: 'sub_6_sci', classLevel: 6, name: 'Science', code: 'SCI-06', icon: 'Atom', color: 'from-emerald-500 to-teal-600', chaptersCount: 11, description: 'Components of Food, Sorting Materials, Separation of Substances, Living Organisms' },

  // Class 11
  { id: 'sub_11_acct', classLevel: 11, name: 'Accountancy', code: 'ACCT-11', icon: 'Calculator', color: 'from-emerald-600 to-teal-700', chaptersCount: 13, description: 'Financial Accounting-I: Basic Accounting Terms, Accounting Principles, Journal, Ledger, Trial Balance, BRS', stream: 'Commerce' },
  { id: 'sub_11_bst', classLevel: 11, name: 'Business Studies', code: 'BST-11', icon: 'Briefcase', color: 'from-blue-600 to-cyan-700', chaptersCount: 11, description: 'Foundations of Business: Nature & Purpose, Forms of Business Organisation, Emerging Modes, Sources of Finance', stream: 'Commerce' },
  { id: 'sub_11_econ', classLevel: 11, name: 'Economics', code: 'ECON-11', icon: 'TrendingUp', color: 'from-amber-600 to-orange-700', chaptersCount: 15, description: 'Statistics for Economics & Introductory Microeconomics: Central Problems, Consumer Equilibrium, Demand', stream: 'Commerce' },
  { id: 'sub_11_phy', classLevel: 11, name: 'Physics', code: 'PHY-11', icon: 'Zap', color: 'from-violet-500 to-purple-600', chaptersCount: 14, description: 'Units & Measurements, Motion in a Straight Line, Laws of Motion, Work, Energy and Power', stream: 'Science' },
  { id: 'sub_11_chem', classLevel: 11, name: 'Chemistry', code: 'CHEM-11', icon: 'FlaskConical', color: 'from-teal-500 to-cyan-600', chaptersCount: 12, description: 'Some Basic Concepts of Chemistry, Structure of Atom, Chemical Bonding, Thermodynamics', stream: 'Science' },
  { id: 'sub_11_math', classLevel: 11, name: 'Mathematics', code: 'MATH-11', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 14, description: 'Sets, Relations and Functions, Trigonometric Functions, Complex Numbers, Permutations', stream: 'Science' },
  { id: 'sub_11_bio', classLevel: 11, name: 'Biology', code: 'BIO-11', icon: 'Dna', color: 'from-rose-500 to-red-600', chaptersCount: 19, description: 'The Living World, Biological Classification, Plant Kingdom, Cell: The Unit of Life', stream: 'Science' },
  { id: 'sub_11_eng', classLevel: 11, name: 'English Core', code: 'ENG-11', icon: 'BookOpen', color: 'from-purple-600 to-indigo-700', chaptersCount: 14, description: 'Hornbill, Snapshots, Comprehension, Note Making, Poster Drafting & Analytical Composition', stream: 'All' },

  // Class 12
  { id: 'sub_12_acct', classLevel: 12, name: 'Accountancy', code: 'ACCT-12', icon: 'Calculator', color: 'from-emerald-600 to-teal-700', chaptersCount: 12, description: 'Accounting for Partnership Firms, Share Capital, Debentures, and Financial Statement Analysis', stream: 'Commerce' },
  { id: 'sub_12_bst', classLevel: 12, name: 'Business Studies', code: 'BST-12', icon: 'Briefcase', color: 'from-blue-600 to-cyan-700', chaptersCount: 12, description: 'Principles and Functions of Management: Planning, Organising, Staffing, Directing, Controlling, Marketing', stream: 'Commerce' },
  { id: 'sub_12_econ', classLevel: 12, name: 'Economics', code: 'ECON-12', icon: 'TrendingUp', color: 'from-amber-600 to-orange-700', chaptersCount: 12, description: 'Introductory Macroeconomics and Indian Economic Development', stream: 'Commerce' },
  { id: 'sub_12_phy', classLevel: 12, name: 'Physics', code: 'PHY-12', icon: 'Zap', color: 'from-violet-500 to-purple-600', chaptersCount: 14, description: 'Electric Charges and Fields, Electrostatic Potential, Current Electricity, Optics, Modern Physics', stream: 'Science' },
  { id: 'sub_12_chem', classLevel: 12, name: 'Chemistry', code: 'CHEM-12', icon: 'FlaskConical', color: 'from-teal-500 to-cyan-600', chaptersCount: 10, description: 'Solutions, Electrochemistry, Chemical Kinetics, Coordination Compounds, Organic Chemistry', stream: 'Science' },
  { id: 'sub_12_math', classLevel: 12, name: 'Mathematics', code: 'MATH-12', icon: 'Calculator', color: 'from-amber-500 to-orange-600', chaptersCount: 13, description: 'Relations & Functions, Matrices, Determinants, Continuity & Differentiability, Integrals', stream: 'Science' },
  { id: 'sub_12_bio', classLevel: 12, name: 'Biology', code: 'BIO-12', icon: 'Dna', color: 'from-rose-500 to-red-600', chaptersCount: 13, description: 'Reproduction, Genetics & Evolution, Biotechnology, Ecology & Environment', stream: 'Science' },
  { id: 'sub_12_eng', classLevel: 12, name: 'English Core', code: 'ENG-12', icon: 'BookOpen', color: 'from-purple-600 to-indigo-700', chaptersCount: 14, description: 'Flamingo, Vistas, Reading Comprehension, Letters to the Editor & Report Writing', stream: 'All' },
];

// Rich original chapter notes, explanations, formulas & MCQs
const initialChapters: Chapter[] = [
  // Class 10 Math: Quadratic Equations
  {
    id: 'ch_10_math_quad',
    subjectId: 'sub_10_math',
    classLevel: 10,
    chapterNumber: 4,
    title: 'Quadratic Equations',
    description: 'Master standard form, factoring method, completing square, and the discriminant formula.',
    overview: 'A quadratic equation in the variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. It plays a pivotal role in physics, projectile mechanics, geometry, and business profit modeling.',
    keyConcepts: [
      {
        title: 'Standard Form of Quadratic Equation',
        explanation: 'The standard polynomial form is ax² + bx + c = 0. The highest power of the variable is 2 (degree 2).',
        example: '2x² - 5x + 3 = 0 where a = 2, b = -5, c = 3.'
      },
      {
        title: 'Solution by Factorization',
        explanation: 'Express the quadratic polynomial as a product of two linear factors (px + q)(rx + s) = 0 and apply the zero product property.',
        example: 'x² - 5x + 6 = (x - 2)(x - 3) = 0, yielding roots x = 2 and x = 3.'
      },
      {
        title: 'The Quadratic Formula & Discriminant (D)',
        explanation: 'For ax² + bx + c = 0, roots are given by x = (-b ± √(b² - 4ac)) / (2a). The discriminant D = b² - 4ac determines nature of roots: D > 0 (two distinct real roots), D = 0 (two equal real roots), D < 0 (no real roots).',
        example: 'If D = 25 - 24 = 1 > 0, roots are real and distinct.'
      }
    ],
    formulas: [
      'Standard Form: ax² + bx + c = 0 (a ≠ 0)',
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a',
      'Discriminant: D = b² - 4ac',
      'Sum of roots (α + β) = -b/a',
      'Product of roots (α · β) = c/a'
    ],
    revisionNotes: [
      'Always rearrange terms in descending powers of x before identifying coefficients a, b, c.',
      'A real-world quantity like length or time cannot be negative; discard extraneous negative roots when solving word problems.',
      'If D is a perfect square, roots are rational; if D is not a perfect square, roots form conjugate irrational pairs.'
    ],
    mcqs: [
      {
        id: 'q1',
        question: 'Which of the following is a quadratic equation?',
        options: ['x² + 2x + 1 = (4 - x)² + 3', '-2x² = (5 - x)(2x - 2/5)', '(k + 1)x² + (3/2)x = 7 where k = -1', 'x³ - x² = (x - 1)³'],
        correctIndex: 3,
        explanation: 'Expanding (x - 1)³ = x³ - 3x² + 3x - 1. The cubic terms x³ cancel on both sides, leaving a quadratic 2x² - 3x + 1 = 0.'
      },
      {
        id: 'q2',
        question: 'The discriminant of the equation 2x² - 4x + 3 = 0 is:',
        options: ['-8', '8', '-16', '16'],
        correctIndex: 0,
        explanation: 'D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, it has no real roots.'
      },
      {
        id: 'q3',
        question: 'If one root of the quadratic equation 2x² + kx - 6 = 0 is 2, the value of k is:',
        options: ['-1', '1', '2', '-2'],
        correctIndex: 0,
        explanation: 'Substitute x = 2: 2(2)² + k(2) - 6 = 0 => 8 + 2k - 6 = 0 => 2k = -2 => k = -1.'
      }
    ],
    practiceTest: {
      id: 'pt_10_math_quad',
      title: 'Class 10 Board Mock: Quadratic Equations Mastery',
      durationMinutes: 15,
      totalMarks: 20,
      questions: [
        {
          id: 'ptq1',
          question: 'Find the values of k for which the quadratic equation 2x² + kx + 3 = 0 has two equal real roots.',
          options: ['±2√6', '±√6', '±4√3', '±6'],
          correctIndex: 0,
          marks: 5,
          explanation: 'For equal roots, D = 0 => k² - 4(2)(3) = 0 => k² = 24 => k = ±√24 = ±2√6.'
        },
        {
          id: 'ptq2',
          question: 'The sum of the squares of two consecutive positive integers is 365. Find the integers.',
          options: ['13 and 14', '11 and 12', '14 and 15', '12 and 13'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Let integers be x and x + 1. x² + (x + 1)² = 365 => 2x² + 2x - 364 = 0 => x² + x - 182 = 0 => (x + 14)(x - 13) = 0. Since positive, x = 13 and x + 1 = 14.'
        },
        {
          id: 'ptq3',
          question: 'What is the nature of roots for 3x² - 4√3x + 4 = 0?',
          options: ['Real and equal', 'Real and distinct', 'No real roots', 'Cannot be determined'],
          correctIndex: 0,
          marks: 5,
          explanation: 'D = (-4√3)² - 4(3)(4) = 48 - 48 = 0. Thus roots are real and equal.'
        },
        {
          id: 'ptq4',
          question: 'If the roots of ax² + bx + c = 0 are reciprocal to each other, then:',
          options: ['c = a', 'b = 0', 'b = c', 'a = 1/c'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Let roots be α and 1/α. Product of roots = α · (1/α) = 1 = c/a => c = a.'
        }
      ]
    }
  },

  // Class 10 Science: Chemical Reactions and Equations
  {
    id: 'ch_10_sci_chem',
    subjectId: 'sub_10_sci',
    classLevel: 10,
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    description: 'Chemical changes, writing balanced chemical equations, types of reactions, oxidation-reduction.',
    overview: 'Whenever a chemical change occurs, we say that a chemical reaction has taken place. Observations that confirm a reaction include change in state, change in colour, evolution of a gas, or change in temperature.',
    keyConcepts: [
      {
        title: 'Balancing Chemical Equations',
        explanation: 'According to the Law of Conservation of Mass, the total mass of reactants equals total mass of products. Number of atoms of each element remains identical on both sides.',
        example: '3Fe + 4H₂O (steam) → Fe₃O₄ + 4H₂'
      },
      {
        title: 'Types of Reactions',
        explanation: '1. Combination: Two or more reactants form a single product. 2. Decomposition: Single reactant breaks into multiple products. 3. Displacement: More reactive element displaces a less reactive element. 4. Double Displacement: Exchange of ions between reactants.',
        example: 'Zn + CuSO₄ → ZnSO₄ + Cu (Displacement)'
      },
      {
        title: 'Redox Reactions & Corrosion',
        explanation: 'Oxidation is gain of oxygen or loss of hydrogen/electrons. Reduction is loss of oxygen or gain of hydrogen/electrons. Corrosion is the degradation of metals by moisture and acids.',
        example: 'CuO + H₂ → Cu + H₂O (CuO is reduced to Cu, H₂ is oxidized to H₂O)'
      }
    ],
    formulas: [
      'Combination: A + B → AB',
      'Decomposition: AB → A + B (Thermal, Electrolytic, Photolytic)',
      'Displacement: A + BC → AC + B',
      'Double Displacement: AB + CD → AD + CB (Precipitation)',
      'Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (Exothermic)'
    ],
    revisionNotes: [
      'Quicklime (CaO) reacting with water produces slaked lime [Ca(OH)₂] releasing intense heat (exothermic).',
      'Silver chloride turns grey in sunlight due to photolytic decomposition: 2AgCl → 2Ag + Cl₂.',
      'Antioxidants and nitrogen flushing prevent rancidity in fat-containing foods.'
    ],
    mcqs: [
      {
        id: 'q_sci1',
        question: 'Which of the following is an endothermic process?',
        options: ['Dilution of sulphuric acid', 'Sublimation of dry ice', 'Condensation of water vapours', 'Respiration'],
        correctIndex: 1,
        explanation: 'Sublimation requires absorption of thermal energy from surroundings, making it an endothermic change.'
      },
      {
        id: 'q_sci2',
        question: 'In the reaction CuO + H₂ → Cu + H₂O, the substance undergoing reduction is:',
        options: ['H₂', 'CuO', 'Cu', 'H₂O'],
        correctIndex: 1,
        explanation: 'Copper oxide loses oxygen to form copper, which is reduction. CuO is the oxidizing agent.'
      },
      {
        id: 'q_sci3',
        question: 'When lead nitrate powder is heated in a boiling tube, the brown fumes evolved are of:',
        options: ['NO', 'NO₂', 'N₂O', 'N₂'],
        correctIndex: 1,
        explanation: '2Pb(NO₃)₂ → 2PbO + 4NO₂ (brown gas) + O₂.'
      }
    ],
    practiceTest: {
      id: 'pt_10_sci_chem',
      title: 'Class 10 Science Rapid Test: Chemical Equations',
      durationMinutes: 10,
      totalMarks: 15,
      questions: [
        {
          id: 'ptq_s1',
          question: 'What is observed when a magnesium ribbon is burnt in air?',
          options: ['Dazzling white flame and white powder', 'Yellow flame and black residue', 'Blue flame and liquid droplets', 'Smoky orange flame without residue'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Magnesium burns with a dazzling white flame to produce white magnesium oxide powder (2Mg + O₂ → 2MgO).'
        },
        {
          id: 'ptq_s2',
          question: 'Electrolysis of water produces hydrogen and oxygen in which volume ratio?',
          options: ['1:1', '2:1', '1:2', '8:1'],
          correctIndex: 1,
          marks: 5,
          explanation: 'In 2H₂O → 2H₂ + O₂, two volumes of H₂ gas are collected at cathode for every one volume of O₂ at anode (2:1).'
        },
        {
          id: 'ptq_s3',
          question: 'Why do chips manufacturers flush bags with nitrogen gas?',
          options: ['To increase weight', 'To prevent oxidation and rancidity', 'To improve crispiness by dehydration', 'To kill bacteria with poison'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Nitrogen is an unreactive gas that prevents oils and fats from oxidizing and becoming rancid.'
        }
      ]
    }
  },

  // Class 10 Science: Life Processes
  {
    id: 'ch_10_sci_life',
    subjectId: 'sub_10_sci',
    classLevel: 10,
    chapterNumber: 6,
    title: 'Life Processes',
    description: 'Nutrition, Respiration, Transportation, and Excretion in plants and animals.',
    overview: 'The maintenance functions of living organisms must go on even when they are not doing anything particular. The processes which together perform this maintenance job are life processes: nutrition, respiration, transportation, and excretion.',
    keyConcepts: [
      {
        title: 'Autotrophic vs Heterotrophic Nutrition',
        explanation: 'Green plants use photosynthesis: 6CO₂ + 12H₂O + Chlorophyll + Sunlight → C₆H₁₂O₆ + 6O₂ + 6H₂O. Heterotrophs depend on autotrophs directly or indirectly.',
        example: 'Stomata regulate gas exchange and transpiration via turgor pressure of guard cells.'
      },
      {
        title: 'Human Digestive System',
        explanation: 'Salivary amylase breaks starch in mouth; pepsin in stomach breaks proteins in acidic medium (HCl); bile juice emulsifies fats; pancreatic lipase and trypsin complete digestion in small intestine villi.',
        example: 'Small intestine is the site of complete digestion of carbohydrates, proteins, and fats.'
      },
      {
        title: 'Transportation & Excretion',
        explanation: 'Double circulation in human heart (pulmonary and systemic) prevents mixing of oxygenated and deoxygenated blood. Nephrons in kidneys filter nitrogenous waste (urea) to form urine.',
        example: 'Xylem transports water and minerals unidirectionally; Phloem translocates sucrose bidirectionally.'
      }
    ],
    formulas: [
      'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
      'Aerobic: Glucose → Pyruvate (in cytoplasm) → CO₂ + H₂O + Energy (38 ATP, in mitochondria)',
      'Anaerobic (Yeast): Pyruvate → Ethanol + CO₂ + Energy (2 ATP)',
      'Anaerobic (Muscle): Pyruvate → Lactic Acid + Energy (causes cramps)'
    ],
    revisionNotes: [
      'Alveoli in lungs provide a large surface area for diffusion of gases wrapped in extensive capillary networks.',
      'Valves ensure blood flows in only one direction through the heart chambers.',
      'Bowman capsule and glomerulus perform ultrafiltration of blood under high hydrostatic pressure.'
    ],
    mcqs: [
      {
        id: 'q_lp1',
        question: 'Which enzyme is responsible for the digestion of proteins in the stomach?',
        options: ['Trypsin', 'Pepsin', 'Amylase', 'Lipase'],
        correctIndex: 1,
        explanation: 'Gastric glands secrete pepsinogen which converts to active pepsin in the presence of hydrochloric acid.'
      },
      {
        id: 'q_lp2',
        question: 'The breakdown of pyruvate to give carbon dioxide, water and energy takes place in:',
        options: ['Cytoplasm', 'Mitochondria', 'Chloroplast', 'Nucleus'],
        correctIndex: 1,
        explanation: 'Aerobic breakdown of pyruvate occurs inside the mitochondria.'
      },
      {
        id: 'q_lp3',
        question: 'The structural and functional unit of kidney is:',
        options: ['Neuron', 'Nephron', 'Alveolus', 'Villus'],
        correctIndex: 1,
        explanation: 'Nephrons are the microscopic filtration units in the kidney.'
      }
    ],
    practiceTest: {
      id: 'pt_10_sci_life',
      title: 'Class 10 Biology Check: Life Processes',
      durationMinutes: 12,
      totalMarks: 15,
      questions: [
        {
          id: 'ptq_lp1',
          question: 'What prevents backflow of blood inside the heart during contraction?',
          options: ['Valves in heart', 'Thick muscular walls of ventricles', 'Thin walls of atria', 'Septum'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Atrioventricular and semilunar valves prevent backward flow during systole.'
        },
        {
          id: 'ptq_lp2',
          question: 'Which component of blood helps in clot formation at an injury site?',
          options: ['RBCs', 'WBCs', 'Platelets', 'Plasma proteins'],
          correctIndex: 2,
          marks: 5,
          explanation: 'Platelets aggregate and release clotting factors to plug leakage.'
        },
        {
          id: 'ptq_lp3',
          question: 'Transpiration pull is primarily responsible for:',
          options: ['Transport of food', 'Upward movement of water and minerals in xylem', 'Translocation of hormones', 'Absorption of carbon dioxide'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Loss of water vapor through stomata creates suction pressure pulling water columns upward.'
        }
      ]
    }
  },

  // Class 12 Physics: Current Electricity
  {
    id: 'ch_12_phy_elec',
    subjectId: 'sub_12_phy',
    classLevel: 12,
    chapterNumber: 3,
    title: 'Current Electricity',
    description: 'Drift velocity, Ohm’s law, Kirchhoff’s circuit rules, Wheatstone bridge, and potentiometers.',
    overview: 'Charges in motion constitute an electric current. This chapter analyzes microscopic drift mechanisms, temperature coefficients of resistance, Kirchhoff’s junction and loop laws, and null-deflection measuring instruments.',
    keyConcepts: [
      {
        title: 'Ohm’s Law & Drift Velocity',
        explanation: 'Current I = n · A · e · vd. Drift velocity vd = (eE / m) · τ. Resistivity ρ = m / (n · e² · τ), which depends purely on material and temperature.',
        example: 'At standard room temp, electron drift velocity in copper wire is merely around 0.1 mm/s.'
      },
      {
        title: 'Kirchhoff’s Circuit Laws',
        explanation: '1. Current Law (KCL): Algebraic sum of currents at any junction is zero (conservation of charge). 2. Voltage Law (KVL): Algebraic sum of changes in potential around any closed loop is zero (conservation of energy).',
        example: 'In a balanced Wheatstone bridge, P/Q = R/S, resulting in zero current across the galvanometer.'
      }
    ],
    formulas: [
      'Current: I = n · e · A · vd',
      'Ohm’s Law: V = IR, where R = ρL/A',
      'Temperature dependence: R(T) = R₀ [1 + α(T - T₀)]',
      'EMF and Internal Resistance: V = E - Ir (discharging), V = E + Ir (charging)',
      'Balanced Wheatstone Bridge: P/Q = R/S'
    ],
    revisionNotes: [
      'Internal resistance of a cell increases with age, concentration of electrolyte, and distance between electrodes.',
      'Potentiometer is preferred over a voltmeter because it draws zero current at the null point, measuring true EMF.'
    ],
    mcqs: [
      {
        id: 'q_phy1',
        question: 'When temperature of a metallic conductor increases, its resistance:',
        options: ['Decreases', 'Increases', 'Remains unchanged', 'Becomes zero'],
        correctIndex: 1,
        explanation: 'Higher temperature increases thermal vibration of lattice ions, reducing relaxation time τ and increasing resistivity.'
      },
      {
        id: 'q_phy2',
        question: 'Kirchhoff’s second law (loop rule) is based on the conservation of:',
        options: ['Charge', 'Momentum', 'Energy', 'Angular momentum'],
        correctIndex: 2,
        explanation: 'Work done in moving a unit charge around any closed loop in an electrostatic field is zero, embodying energy conservation.'
      }
    ],
    practiceTest: {
      id: 'pt_12_phy_elec',
      title: 'Class 12 Board Prep: Current Electricity',
      durationMinutes: 15,
      totalMarks: 10,
      questions: [
        {
          id: 'ptq_phy1',
          question: 'Two wires of equal length and cross-sectional areas have resistivities in ratio 1:2. The ratio of their resistances is:',
          options: ['1:2', '2:1', '1:4', '4:1'],
          correctIndex: 0,
          marks: 5,
          explanation: 'R = ρL/A. For equal L and A, R₁/R₂ = ρ₁/ρ₂ = 1:2.'
        },
        {
          id: 'ptq_phy2',
          question: 'A cell of emf 2V and internal resistance 0.1 Ω is connected across a 3.9 Ω resistor. The terminal voltage is:',
          options: ['1.95 V', '2.00 V', '1.80 V', '1.50 V'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Current I = E / (R + r) = 2 / (3.9 + 0.1) = 2 / 4 = 0.5 A. Terminal voltage V = E - Ir = 2 - (0.5)(0.1) = 2 - 0.05 = 1.95 V.'
        }
      ]
    }
  },

  // Class 11 Accountancy: Introduction to Accounting & Basic Terms
  {
    id: 'ch_11_acct_intro',
    subjectId: 'sub_11_acct',
    classLevel: 11,
    chapterNumber: 1,
    title: 'Introduction to Accounting & Basic Accounting Terms',
    description: 'Definition, objectives, qualitative characteristics of accounting, assets, liabilities, capital, and accounting equation.',
    overview: 'Accounting is the art of recording, classifying, and summarizing in a significant manner and in terms of money, transactions and events which are, in part at least, of a financial character, and interpreting the results thereof. It bridges financial events with stakeholder decision making.',
    keyConcepts: [
      {
        title: 'Meaning and Objectives of Accounting',
        explanation: 'Accounting identifies economic events, measures them in monetary terms, records them systematically in books of original entry, and communicates financial reports (Income Statement & Balance Sheet) to users like owners, investors, creditors, tax authorities, and employees.',
        example: 'Recording cash sales of ₹50,000 to accurately report gross profit at period end.'
      },
      {
        title: 'Fundamental Accounting Terms: Assets, Liabilities & Capital',
        explanation: 'Assets are economic resources owned by the enterprise expected to yield future economic benefits (Current vs Non-Current / Fixed). Liabilities are debts or financial obligations owed to outsiders (Creditors, Bank Overdraft, Loans). Capital is the owner’s net equity/investment in the business.',
        example: 'Plant & Machinery, Debtors, Inventory, Bank Balance are assets; Sundry Creditors and Bills Payable are liabilities.'
      },
      {
        title: 'The Fundamental Accounting Equation',
        explanation: 'Based on the Dual Aspect Concept, every transaction impacts at least two accounts. Total resources (Assets) must always equal claims against them: Assets = Liabilities + Capital.',
        example: 'If owner starts business with ₹2,00,000 cash: Cash (Asset) increases by ₹2,00,000 and Capital increases by ₹2,00,000 (2,00,000 = 0 + 2,00,000).'
      },
      {
        title: 'Revenue, Expense, Drawings & Bad Debts',
        explanation: 'Revenue is gross inflow of cash or receivables arising from delivery of goods/services. Expense is cost incurred for generating revenue. Drawings are cash/goods withdrawn by proprietor for personal use (reduces Capital). Bad debts represent unrecoverable receivables from debtors.',
        example: 'Owner withdraws ₹10,000 for domestic utility bill: Bank drops by ₹10,000 and Drawings reduces Capital by ₹10,000.'
      }
    ],
    formulas: [
      'Fundamental Equation: Assets = Liabilities + Capital',
      'Capital = Assets - Liabilities',
      'Net Profit = Revenue - Expenses',
      'Closing Capital = Opening Capital + Additional Capital + Net Profit - Drawings',
      'Working Capital = Current Assets - Current Liabilities'
    ],
    revisionNotes: [
      'Qualitative characteristics: Reliability, Relevance, Understandability, and Comparability (RRUC).',
      'Separate Legal Entity Concept: Business is treated as distinct from its owner; personal transactions must never be mixed with business books.',
      'Money Measurement Concept: Only transactions expressible in monetary terms are recorded; worker morale or management quality are excluded.',
      'Cost Concept: Fixed assets are recorded at acquisition price rather than fluctuating market value.'
    ],
    mcqs: [
      {
        id: 'q_acct1',
        question: 'Which accounting principle states that a business enterprise will not be liquidated in the foreseeable future?',
        options: ['Money Measurement Concept', 'Going Concern Concept', 'Accounting Period Concept', 'Dual Aspect Concept'],
        correctIndex: 1,
        explanation: 'The Going Concern assumption presumes business continuity indefinitely, allowing depreciation to be spread over asset useful life.'
      },
      {
        id: 'q_acct2',
        question: 'If Total Assets of a business are ₹5,00,000 and Outside Liabilities are ₹1,80,000, what is the Proprietor’s Capital?',
        options: ['₹6,80,000', '₹3,20,000', '₹5,00,000', '₹1,80,000'],
        correctIndex: 1,
        explanation: 'Capital = Assets - Liabilities = ₹5,00,000 - ₹1,80,000 = ₹3,20,000.'
      },
      {
        id: 'q_acct3',
        question: 'Goods withdrawn by the owner for personal household consumption should be debited to:',
        options: ['Sales Account', 'Purchases Account', 'Drawings Account', 'Capital Account'],
        correctIndex: 2,
        explanation: 'Drawings Account is debited (representing proprietor personal use) while Purchases Account is credited at cost price.'
      }
    ],
    practiceTest: {
      id: 'pt_11_acct_intro',
      title: 'Class 11 Accountancy Mock: Foundations & Terms',
      durationMinutes: 15,
      totalMarks: 20,
      questions: [
        {
          id: 'ptq_ac1',
          question: 'Which of the following is NOT a qualitative characteristic of accounting information?',
          options: ['Reliability', 'Subjectivity', 'Relevance', 'Comparability'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Accounting information strives for objectivity, not subjectivity. Qualitative pillars are Reliability, Relevance, Understandability, Comparability.'
        },
        {
          id: 'ptq_ac2',
          question: 'A firm purchased furniture worth ₹40,000 for cash. What is the net impact on total assets?',
          options: ['Total assets increase by ₹40,000', 'Total assets decrease by ₹40,000', 'Total assets remain unchanged', 'Capital increases by ₹40,000'],
          correctIndex: 2,
          marks: 5,
          explanation: 'Furniture (Asset) increases by ₹40,000 while Cash (Asset) decreases by ₹40,000. Total assets remain strictly unchanged.'
        },
        {
          id: 'ptq_ac3',
          question: 'Unearned income (income received in advance) is classified as a/an:',
          options: ['Current Asset', 'Current Liability', 'Expense', 'Direct Revenue'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Since service or goods are yet to be rendered in future, unearned income is an obligation/liability of the enterprise.'
        },
        {
          id: 'ptq_ac4',
          question: 'If opening capital was ₹1,00,000, profit earned during year was ₹35,000, and drawings were ₹15,000, what is closing capital?',
          options: ['₹1,20,000', '₹1,50,000', '₹1,35,000', '₹80,000'],
          correctIndex: 0,
          marks: 5,
          explanation: 'Closing Capital = Opening (1,00,000) + Profit (35,000) - Drawings (15,000) = ₹1,20,000.'
        }
      ]
    }
  },

  // Class 11 Accountancy: Recording of Transactions - Journal & Ledger
  {
    id: 'ch_11_acct_journal',
    subjectId: 'sub_11_acct',
    classLevel: 11,
    chapterNumber: 3,
    title: 'Recording of Transactions: Journal & Rules of Debit/Credit',
    description: 'Double entry book keeping, golden rules of accounting, voucher preparation, journal entries, and ledger posting.',
    overview: 'The Double Entry System mandates that every transaction has a two-fold aspect involving a debit to one account and a corresponding credit to another account. Recording begins in the Journal (Book of Original Entry) and is summarized into the Ledger (Principal Book).',
    keyConcepts: [
      {
        title: 'Classification of Accounts (Traditional vs Modern)',
        explanation: 'Traditional: 1. Personal (Natural, Artificial, Representative). 2. Real (Tangible & Intangible property). 3. Nominal (Expenses, Losses, Incomes, Gains). Modern: Assets, Liabilities, Capital, Revenue, Expenses.',
        example: 'Bank Account is an Artificial Personal Account; Machinery is a Real Account; Salary Paid is a Nominal Account.'
      },
      {
        title: 'Golden Rules of Accounting',
        explanation: '• Personal Account: Debit the receiver, Credit the giver. \n• Real Account: Debit what comes in, Credit what goes out. \n• Nominal Account: Debit all expenses & losses, Credit all incomes & gains.',
        example: 'Paid rent in cash ₹5,000: Rent (Nominal expense) is Debited; Cash (Real asset going out) is Credited.'
      },
      {
        title: 'Modern Rules of Debit and Credit',
        explanation: 'Assets and Expenses: Increase is Debited (+Dr), Decrease is Credited (-Cr). \nLiabilities, Capital, and Revenue: Increase is Credited (+Cr), Decrease is Debited (-Dr).',
        example: 'Taking bank loan ₹1,00,000: Bank (Asset) +Dr ₹1,00,000; Bank Loan (Liability) +Cr ₹1,00,000.'
      },
      {
        title: 'Trade Discount vs Cash Discount',
        explanation: 'Trade discount is granted by seller on catalog list price at transaction time and is NEVER recorded in journal books. Cash discount is granted for prompt settlement within a specified period and IS recorded (Discount Allowed Dr / Discount Received Cr).',
        example: 'Goods list price ₹10,000 sold at 10% trade discount: Invoice made for ₹9,000; recorded as Sales ₹9,000.'
      }
    ],
    formulas: [
      'Personal A/c: Dr. Receiver | Cr. Giver',
      'Real A/c: Dr. What comes in | Cr. What goes out',
      'Nominal A/c: Dr. Expenses/Losses | Cr. Incomes/Gains',
      'Net Invoice Amount = List Price - Trade Discount',
      'Ledger Balance = Debit Total - Credit Total'
    ],
    revisionNotes: [
      'Journalizing is chronological (date-wise); Ledger posting is analytical (account-wise).',
      'Compound journal entry: An entry containing more than one debit or more than one credit.',
      'Goods lost by fire or theft: Debited to Loss by Fire/Theft A/c and Credited to Purchases A/c (not Sales).'
    ],
    mcqs: [
      {
        id: 'q_j1',
        question: 'Rent paid to landlord Mr. Sharma should be debited to:',
        options: ['Landlord Mr. Sharma Account', 'Rent Account', 'Cash Account', 'Prepaid Expense Account'],
        correctIndex: 1,
        explanation: 'Rent is a nominal expense for the business. Under nominal rule, debit all expenses regardless of who the landlord is.'
      },
      {
        id: 'q_j2',
        question: 'Which of the following discounts is NOT recorded in the books of account?',
        options: ['Cash Discount', 'Trade Discount', 'Settlement Rebate', 'Early Bird Discount'],
        correctIndex: 1,
        explanation: 'Trade discount is deducted directly from list price to arrive at net sale/purchase value and has no separate journal entry.'
      },
      {
        id: 'q_j3',
        question: 'Purchased goods from Raman for ₹20,000 on credit. The entry is:',
        options: ['Purchases A/c Dr. To Raman A/c', 'Raman A/c Dr. To Purchases A/c', 'Purchases A/c Dr. To Cash A/c', 'Cash A/c Dr. To Raman A/c'],
        correctIndex: 0,
        explanation: 'Purchases (Expense/Asset increase) is debited; Raman (Personal giver of credit) is credited.'
      }
    ],
    practiceTest: {
      id: 'pt_11_acct_journal',
      title: 'Class 11 Mock: Journalizing & Double Entry Mastery',
      durationMinutes: 15,
      totalMarks: 20,
      questions: [
        {
          id: 'ptq_j1',
          question: 'Sold goods to Rohan costing ₹15,000 at a profit of 20% on cost, allowing 10% trade discount. What is the Sales value credited?',
          options: ['₹18,000', '₹16,200', '₹15,000', '₹17,000'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Cost = ₹15,000. Profit 20% = ₹3,000 => List Price = ₹18,000. Less 10% Trade Discount (₹1,800) = ₹16,200.'
        },
        {
          id: 'ptq_j2',
          question: 'Machinery installation wages paid in cash should be debited to:',
          options: ['Wages Account', 'Machinery Account', 'Cash Account', 'Installation Charges Account'],
          correctIndex: 1,
          marks: 5,
          explanation: 'All expenses incurred to bring a fixed asset to its working condition are capital expenditures and capitalized to the asset account.'
        },
        {
          id: 'ptq_j3',
          question: 'A debit balance in a Nominal Account indicates:',
          options: ['Asset', 'Liability', 'Expense or Loss', 'Income or Gain'],
          correctIndex: 2,
          marks: 5,
          explanation: 'Nominal accounts debit expenses and losses, and credit incomes and gains.'
        },
        {
          id: 'ptq_j4',
          question: 'The process of transferring journal entries into ledger accounts is termed as:',
          options: ['Journalizing', 'Posting', 'Balancing', 'Casting'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Transferring debits and credits from journal to designated ledger accounts is known as Posting.'
        }
      ]
    }
  },

  // Class 11 Accountancy: BRS & Trial Balance
  {
    id: 'ch_11_acct_brs',
    subjectId: 'sub_11_acct',
    classLevel: 11,
    chapterNumber: 5,
    title: 'Bank Reconciliation Statement (BRS) & Trial Balance',
    description: 'Causes of difference between Cash Book and Pass Book, preparation of BRS, trial balance objectives and error detection.',
    overview: 'Bank Reconciliation Statement is a schedule prepared periodically to reconcile the bank balance as shown in the firm’s Cash Book with the balance certified in the Bank Pass Book / Bank Statement. A Trial Balance verifies the arithmetical accuracy of ledger postings.',
    keyConcepts: [
      {
        title: 'Need and Significance of BRS',
        explanation: 'Cash Book bank column is maintained by the firm; Pass Book is maintained by the bank. Differences arise due to timing differences in recording entries and errors by either party. BRS ensures fraud prevention, internal control, and accurate liquid asset valuation.',
        example: 'Cheque issued to supplier recorded in Cash Book immediately, but supplier presents it to bank 5 days later.'
      },
      {
        title: 'Key Causes of Differences in Balances',
        explanation: '1. Cheques issued but not yet presented for payment (Cash Book down, Pass Book up). \n2. Cheques deposited but not yet collected/credited by bank (Cash Book up, Pass Book down). \n3. Interest/Dividend credited directly by bank. \n4. Direct debits for insurance/bank charges. \n5. Direct deposits by customers into bank account.',
        example: 'Customer directly transfers ₹12,000 via NEFT: Bank balance rises, unknown to cashier until statement arrives.'
      },
      {
        title: 'Meaning and Objectives of Trial Balance',
        explanation: 'A Trial Balance is a statement prepared with debit and credit ledger balances on a given date to prove arithmetical equality of the double entry system and facilitate preparation of final accounts.',
        example: 'Total debits must equal total credits if all entries are correctly posted and cast.'
      }
    ],
    formulas: [
      'Favourable Cash Book Balance = Debit balance',
      'Overdraft Cash Book Balance = Credit balance',
      'Favourable Pass Book Balance = Credit balance',
      'Overdraft Pass Book Balance = Debit balance',
      'Trial Balance: Σ Debit Balances = Σ Credit Balances'
    ],
    revisionNotes: [
      'BRS is NOT an account; it is a statement prepared on a specific date.',
      'Errors not disclosed by Trial Balance: Errors of Principle, Compensating Errors, Complete Omission, Errors of Commission in original entry.',
      'Adjusted Cash Book: Permanent omissions and errors in Cash Book are first corrected in Cash Book before drafting BRS.'
    ],
    mcqs: [
      {
        id: 'q_brs1',
        question: 'Cheques issued to creditors but not yet presented for payment should be:',
        options: ['Added to Cash Book balance', 'Deducted from Cash Book balance', 'Added to Pass Book balance', 'Ignored in BRS'],
        correctIndex: 0,
        explanation: 'Cheque issue reduced Cash Book; since bank has not debited yet, add back to Cash Book balance to reach Pass Book balance.'
      },
      {
        id: 'q_brs2',
        question: 'Bank overdraft as per Cash Book means:',
        options: ['Debit balance in Cash Book', 'Credit balance in Cash Book', 'Credit balance in Pass Book', 'Zero balance'],
        correctIndex: 1,
        explanation: 'Overdraft is a liability to the bank, represented by a credit balance in the firm’s Cash Book.'
      },
      {
        id: 'q_brs3',
        question: 'Which of the following errors is NOT detected by a Trial Balance?',
        options: ['Wrong posting on one side of an account', 'Wrong casting of ledger balance', 'Error of principle', 'Omitting to post one aspect of a journal entry'],
        correctIndex: 2,
        explanation: 'An error of principle (e.g., treating capital expenditure as revenue) posts equal debit and credit amounts, leaving trial balance totals in balance.'
      }
    ],
    practiceTest: {
      id: 'pt_11_acct_brs',
      title: 'Class 11 Mock: BRS & Trial Balance Proficiency',
      durationMinutes: 12,
      totalMarks: 15,
      questions: [
        {
          id: 'ptq_brs1',
          question: 'Balance as per Cash Book is ₹25,000. Cheques deposited into bank for ₹8,000 were credited after date. What is Pass Book balance?',
          options: ['₹33,000', '₹17,000', '₹25,000', '₹9,000'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Pass book has not received credit yet: ₹25,000 - ₹8,000 = ₹17,000.'
        },
        {
          id: 'ptq_brs2',
          question: 'Interest on bank overdraft charged by bank ₹450 was entered in Pass Book only. Starting from Cash Book balance, we should:',
          options: ['Add ₹450', 'Subtract ₹450', 'Add ₹900', 'Ignore'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Bank charge has decreased the bank balance; subtract ₹450 from Cash Book balance to match Pass Book.'
        },
        {
          id: 'ptq_brs3',
          question: 'Suspense Account in a Trial Balance is opened when:',
          options: ['Net profit cannot be calculated', 'Trial Balance does not agree and errors are not immediately located', 'Cash is stolen', 'Bank balance is zero'],
          correctIndex: 1,
          marks: 5,
          explanation: 'A temporary Suspense Account absorbs the difference between debit and credit totals pending rectification of errors.'
        }
      ]
    }
  },

  // Class 11 Business Studies: Nature and Purpose of Business
  {
    id: 'ch_11_bst_nature',
    subjectId: 'sub_11_bst',
    classLevel: 11,
    chapterNumber: 1,
    title: 'Nature and Purpose of Business',
    description: 'Concept of business, economic vs non-economic activities, business vs profession vs employment, and business risks.',
    overview: 'All human beings engage in varied activities: economic activities to earn a livelihood (business, profession, employment) and non-economic activities driven by love, affection, sympathy, and social duty. Business represents organized economic effort to satisfy societal needs through goods and services at a profit.',
    keyConcepts: [
      {
        title: 'Economic vs Non-Economic Activities',
        explanation: 'Economic activities are undertaken with the motive of earning money and creating wealth. Non-economic activities are undertaken out of emotional, religious, patriotic, or humanitarian sentiments without financial expectations.',
        example: 'A chef cooking at a restaurant is an economic activity; cooking dinner for family at home is non-economic.'
      },
      {
        title: 'Comparison: Business, Profession, and Employment',
        explanation: '• Business: Entrepreneurial venture, production/sale of goods, capital needed based on scale, profit reward, high risk. \n• Profession: Specialized expert service, formal degree/code of conduct (Doctors, CAs, Lawyers), professional fees reward, limited risk. \n• Employment: Performing work under employment contract, salary/wages reward, no capital required, zero capital risk.',
        example: 'Running a pharma manufacturing firm (Business) vs practicing medicine at a clinic (Profession) vs being a staff nurse (Employment).'
      },
      {
        title: 'Multiple Objectives of Business',
        explanation: 'Beyond profit maximization: 1. Market standing (customer satisfaction). 2. Innovation (new products/methods). 3. Productivity (efficient resource utilization). 4. Physical and financial resources. 5. Worker performance and manager development. 6. Social responsibility (fair wages, eco-friendly practices).',
        example: 'Investing in zero-emission green packaging satisfies environmental social responsibility and builds brand loyalty.'
      },
      {
        title: 'Nature and Causes of Business Risk',
        explanation: 'Business risk refers to the possibility of inadequate profits or losses due to uncertainties. Causes include: Natural (earthquakes, floods), Human (theft, strikes, negligence), Economic (demand fluctuations, price changes, interest rates), and Physical/Technical (equipment breakdown).',
        example: 'A sudden shift in consumer preference toward electric two-wheelers creates an economic demand risk for petrol scooter makers.'
      }
    ],
    formulas: [
      'Economic Effort = Production + Distribution of Utilities',
      'Business Profit = Total Revenue - Total Economic Costs',
      'Risk ∝ Magnitude of Investment & Market Uncertainty',
      'Return on Investment (ROI) = (Operating Profit / Capital Employed) × 100'
    ],
    revisionNotes: [
      'Profit is essential as: Source of income for entrepreneur, Source of finance for expansion, Yardstick of efficiency, and Reward for risk-bearing.',
      'Industry (Primary, Secondary, Tertiary) produces goods; Commerce (Trade & Auxiliaries to Trade like Transport, Banking, Insurance, Warehousing, Advertising) facilitates distribution.',
      'Speculative risk involves possibility of gain or loss; Pure risk involves only possibility of loss or no loss (e.g., fire, theft).'
    ],
    mcqs: [
      {
        id: 'q_bst1',
        question: 'Which of the following is NOT an economic activity?',
        options: ['A teacher teaching in a coaching institute', 'A doctor treating patients in hospital', 'A mother nursing her sick child at home', 'A lawyer arguing a case in High Court'],
        correctIndex: 2,
        explanation: 'Mother nursing child is motivated by natural love and parental affection, which is a non-economic activity.'
      },
      {
        id: 'q_bst2',
        question: 'The reward or economic return earned by a professional practitioner is called:',
        options: ['Salary', 'Profit', 'Professional Fees', 'Commission'],
        correctIndex: 2,
        explanation: 'Professionals like Chartered Accountants and Doctors render expert services in exchange for Professional Fees.'
      },
      {
        id: 'q_bst3',
        question: 'Risk of loss due to dishonesty, fraud, or negligence of employees is classified as:',
        options: ['Natural cause', 'Human cause', 'Economic cause', 'Physical cause'],
        correctIndex: 1,
        explanation: 'Human causes arise from employee negligence, strikes, lockouts, or theft.'
      }
    ],
    practiceTest: {
      id: 'pt_11_bst_nature',
      title: 'Class 11 Business Studies Check: Business Concepts & Risks',
      durationMinutes: 12,
      totalMarks: 15,
      questions: [
        {
          id: 'ptq_b1',
          question: 'Which auxiliary to trade removes the hindrance of time in the distribution of goods?',
          options: ['Transportation', 'Warehousing', 'Insurance', 'Advertising'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Warehousing preserves goods from production time until they are demanded by consumers, removing the hindrance of time.'
        },
        {
          id: 'ptq_b2',
          question: 'In which occupation is a code of conduct prescribed by an apex statutory body mandatory?',
          options: ['Business', 'Profession', 'Employment', 'Hawking'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Professions (like ICAI for CAs, Bar Council for Lawyers) enforce a strict statutory code of conduct.'
        },
        {
          id: 'ptq_b3',
          question: 'A business transaction must involve which fundamental characteristic?',
          options: ['One-time isolated sale', 'Regularity of dealings in goods and services', 'Free giveaway of surplus items', 'Absence of monetary consideration'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Regularity and continuity of dealings is essential; selling an old personal bicycle once is not a business.'
        }
      ]
    }
  },

  // Class 11 Business Studies: Forms of Business Organisation
  {
    id: 'ch_11_bst_forms',
    subjectId: 'sub_11_bst',
    classLevel: 11,
    chapterNumber: 2,
    title: 'Forms of Business Organisation',
    description: 'Sole Proprietorship, Joint Hindu Family, Partnership, Cooperative Societies, and Joint Stock Companies.',
    overview: 'Choosing the right form of business organisation is one of the most critical decisions for an entrepreneur. Key parameters influencing selection include capital requirement, degree of control, division of risk, liability exposure, and legal compliance.',
    keyConcepts: [
      {
        title: 'Sole Proprietorship',
        explanation: 'Owned, managed, and controlled by a single individual who bears all risks and receives all profits. Merits: Quick decision-making, confidentiality, direct incentive, ease of formation. Demerit: Unlimited liability, limited financial resources, limited managerial ability, lack of business continuity.',
        example: 'Local neighborhood grocery store (Kirana) run by a single proprietor.'
      },
      {
        title: 'Joint Hindu Family Business (HUF)',
        explanation: 'Governed by Hindu Succession Act. Membership by birth into family. Karta (eldest male/female member) has unlimited liability; other members (Coparceners) have limited liability up to their share in ancestral coparcenary property.',
        example: 'Ancestral jewelry trading firm run by Karta with generational family coparceners.'
      },
      {
        title: 'Partnership & Limited Liability Partnership (LLP)',
        explanation: 'Relation between persons who have agreed to share profits of business carried on by all or any one acting for all (Mutual Agency). Minimum 2, maximum 50 members. In traditional partnership, liability is unlimited and joint/several. In LLP, partners enjoy limited liability with separate legal entity.',
        example: 'Three engineers pooling capital to launch a robotics startup with a signed Partnership Deed.'
      },
      {
        title: 'Joint Stock Company (Private vs Public)',
        explanation: 'An artificial person created by law, having separate legal entity, perpetual succession, and common seal. Private company: Minimum 2, maximum 200 members, cannot invite public for shares. Public company: Minimum 7, no maximum limit, shares freely transferable on stock exchanges.',
        example: 'Tata Motors Ltd (Public Company with millions of retail shareholders).'
      }
    ],
    formulas: [
      'Partnership Membership: Min 2, Max 50 (Rule 10 of Companies Rules)',
      'Private Company: Min 2, Max 200 members',
      'Public Company: Min 7 members, No upper limit',
      'Cooperative Principle: One Member, One Vote (Democratic Equality)'
    ],
    revisionNotes: [
      'Doctrine of Mutual Agency: Every partner is both a principal (bound by others) and an agent (can bind others).',
      'Perpetual Succession: Members may come and members may go, but the company goes on forever until legally wound up.',
      'Corporate Veil: Shareholders are not personally liable for company debts; liability is capped at unpaid share face value.'
    ],
    mcqs: [
      {
        id: 'q_f1',
        question: 'In a Sole Proprietorship, the liability of the owner is:',
        options: ['Limited to capital invested', 'Unlimited extending to personal property', 'Limited to loan taken', 'Zero'],
        correctIndex: 1,
        explanation: 'The proprietor is personally liable for business debts; personal assets can be attached if business assets fall short.'
      },
      {
        id: 'q_f2',
        question: 'The head of a Joint Hindu Family Business who possesses unlimited liability is called:',
        options: ['Coparcener', 'Karta', 'Managing Director', 'Partner'],
        correctIndex: 1,
        explanation: 'Karta is the elder managing head of the family business having unlimited liability.'
      },
      {
        id: 'q_f3',
        question: 'What is the maximum number of members in a Private Limited Company?',
        options: ['50', '100', '200', 'No limit'],
        correctIndex: 2,
        explanation: 'Under the Companies Act, 2013, a private company can have a maximum of 200 members (excluding employee shareholders).'
      }
    ],
    practiceTest: {
      id: 'pt_11_bst_forms',
      title: 'Class 11 Mock: Business Organisations Assessment',
      durationMinutes: 15,
      totalMarks: 20,
      questions: [
        {
          id: 'ptq_f1',
          question: 'The principle of "One Man, One Vote" regardless of shares held is the hallmark of:',
          options: ['Sole Proprietorship', 'Joint Stock Company', 'Cooperative Society', 'Partnership'],
          correctIndex: 2,
          marks: 5,
          explanation: 'Cooperative societies operate on democratic control: every member gets exactly one vote irrespective of capital contributed.'
        },
        {
          id: 'ptq_f2',
          question: 'Which document is considered the supreme charter or constitution of a Joint Stock Company?',
          options: ['Articles of Association', 'Memorandum of Association', 'Prospectus', 'Certificate of Incorporation'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Memorandum of Association (MoA) defines the external scope, capital, registered office, and objectives of the company.'
        },
        {
          id: 'ptq_f3',
          question: 'A key advantage of a Joint Stock Company over Partnership is:',
          options: ['Ease of formation', 'Secrecy of affairs', 'Perpetual succession and limited liability', 'Zero taxation'],
          correctIndex: 2,
          marks: 5,
          explanation: 'Companies enjoy perpetual succession (unaffected by death of members) and limited liability.'
        },
        {
          id: 'ptq_f4',
          question: 'Minimum number of members required to establish a Public Limited Company is:',
          options: ['2', '7', '10', '50'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Companies Act requires minimum 7 members to incorporate a public company.'
        }
      ]
    }
  },

  // Class 11 Mathematics: Sets & Functions
  {
    id: 'ch_11_math_sets',
    subjectId: 'sub_11_math',
    classLevel: 11,
    chapterNumber: 1,
    title: 'Sets and Functions',
    description: 'Representation of sets, subsets, Venn diagrams, operations on sets, Cartesian products, and relations.',
    overview: 'The theory of sets, introduced by Georg Cantor, serves as the fundamental bedrock of modern mathematics. Sets, relations, and functions formulate the language of algebra, calculus, probability, and computer algorithm logic.',
    keyConcepts: [
      {
        title: 'Definition and Representation of Sets',
        explanation: 'A set is a well-defined collection of distinct objects. Representation: 1. Roster/Tabular form: Elements listed inside braces separated by commas {2, 4, 6, 8}. 2. Set-Builder form: Stating the characteristic property {x : x is an even natural number < 10}.',
        example: 'Vowels in English alphabet: V = {a, e, i, o, u}.'
      },
      {
        title: 'Subsets, Universal Set & Power Set',
        explanation: 'Set A is subset of B (A ⊆ B) if every element in A belongs to B. Power Set P(A) is collection of all subsets of A; if n(A) = m, then n(P(A)) = 2^m.',
        example: 'If A = {1, 2}, P(A) = {∅, {1}, {2}, {1, 2}}. Total subsets = 2² = 4.'
      },
      {
        title: 'Operations on Sets & De Morgan’s Laws',
        explanation: '• Union (A ∪ B): Elements in A or B or both. \n• Intersection (A ∩ B): Elements common to both A and B. \n• Complement (A’): Elements in Universal set U not in A. \n• De Morgan’s Laws: (A ∪ B)’ = A’ ∩ B’ and (A ∩ B)’ = A’ ∪ B’.',
        example: 'If U = {1,2,3,4,5}, A = {2,3}, B = {3,4}: A ∪ B = {2,3,4}, A ∩ B = {3}, (A ∪ B)’ = {1,5}.'
      }
    ],
    formulas: [
      'n(A ∪ B) = n(A) + n(B) - n(A ∩ B)',
      'If A and B are disjoint: n(A ∪ B) = n(A) + n(B)',
      'n(A ∪ B ∪ C) = n(A) + n(B) + n(C) - n(A ∩ B) - n(B ∩ C) - n(A ∩ C) + n(A ∩ B ∩ C)',
      'Total subsets of set with n elements = 2ⁿ',
      'Total proper subsets = 2ⁿ - 1'
    ],
    revisionNotes: [
      'The empty set ∅ is a subset of every set.',
      'Every set is a subset of itself (reflexive).',
      'Disjoint sets have no common elements: A ∩ B = ∅.'
    ],
    mcqs: [
      {
        id: 'q_set1',
        question: 'If a set A has 4 elements, how many subsets does its power set P(A) contain?',
        options: ['8', '16', '32', '64'],
        correctIndex: 1,
        explanation: 'Number of subsets in power set = 2ⁿ = 2⁴ = 16.'
      },
      {
        id: 'q_set2',
        question: 'If n(A) = 30, n(B) = 25, and n(A ∪ B) = 45, what is n(A ∩ B)?',
        options: ['10', '15', '20', '5'],
        correctIndex: 0,
        explanation: 'n(A ∩ B) = n(A) + n(B) - n(A ∪ B) = 30 + 25 - 45 = 10.'
      },
      {
        id: 'q_set3',
        question: 'Which of the following represents the empty set?',
        options: ['{0}', '{∅}', '{x : x² + 1 = 0, x ∈ ℝ}', '{x : x is an even prime number}'],
        correctIndex: 2,
        explanation: 'For any real number x, x² ≥ 0, so x² + 1 = 0 has no real solutions. Thus it is the empty set ∅.'
      }
    ],
    practiceTest: {
      id: 'pt_11_math_sets',
      title: 'Class 11 Mock: Sets, Subsets & Venn Diagrams',
      durationMinutes: 15,
      totalMarks: 15,
      questions: [
        {
          id: 'ptq_ms1',
          question: 'In a survey of 100 students, 60 like coffee, 40 like tea, and 20 like both. How many like neither?',
          options: ['20', '15', '10', '25'],
          correctIndex: 0,
          marks: 5,
          explanation: 'n(C ∪ T) = 60 + 40 - 20 = 80. Students who like neither = Total - n(C ∪ T) = 100 - 80 = 20.'
        },
        {
          id: 'ptq_ms2',
          question: 'According to De Morgan’s Law, (A ∩ B)’ equals:',
          options: ['A’ ∩ B’', 'A’ ∪ B’', 'A ∪ B', 'A’ - B’'],
          correctIndex: 1,
          marks: 5,
          explanation: 'Complement of intersection equals union of complements: (A ∩ B)’ = A’ ∪ B’.'
        },
        {
          id: 'ptq_ms3',
          question: 'If A ⊆ B, then what is A ∩ B?',
          options: ['A', 'B', '∅', 'U'],
          correctIndex: 0,
          marks: 5,
          explanation: 'If all elements of A are inside B, their intersection is the entire set A itself.'
        }
      ]
    }
  }
];

// Rich Tuition Centre & Tutor Profiles
const initialTuitions: TuitionProfile[] = [
  {
    id: 'tuit_1',
    type: 'centre',
    name: 'Apex Scholars Coaching Institute',
    tagLine: 'Top CBSE Results in Delhi NCR for 15+ Consecutive Years',
    subjects: ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology'],
    classes: [9, 10, 11, 12],
    fees: 3500,
    feeFrequency: 'per month',
    timings: '4:00 PM – 8:00 PM (Mon to Sat)',
    location: 'Janakpuri District Centre, New Delhi',
    address: 'Plot 14, Community Centre, Janakpuri, New Delhi 110058',
    rating: 4.9,
    reviewCount: 142,
    availableSeats: 6,
    totalSeats: 30,
    verified: true,
    faculty: ['Er. Rohit Malhotra (IIT Delhi)', 'Dr. Shalini Verma (M.Sc Gold Medalist)', 'Prof. A.K. Sanyal (Ex-HOD Science)'],
    phone: '+91 11 4567 8900',
    email: 'admissions@apexscholars.edu.in',
    description: 'Equipped with smart interactive digital boards, daily DPPs, weekly chapter tests, personalized doubt clearing sessions, and parent-teacher performance tracking.',
    referralCode: 'APEX-DEL-2026',
    highlights: ['Air-conditioned smart classrooms', 'Dedicated Doubt Counter', 'Weekly Mock Tests with Rank Analytics', 'Printed Study Modules Included']
  },
  {
    id: 'tuit_2',
    type: 'home',
    name: 'Er. Rajesh Bansal (Private Home Tutor)',
    tagLine: 'One-on-One Personalized Mentorship for Classes 8–10',
    subjects: ['Mathematics', 'Science'],
    classes: [8, 9, 10],
    fees: 5000,
    feeFrequency: 'per month',
    timings: '5:30 PM – 7:30 PM (3 days/week)',
    location: 'Indirapuram & Vaishali, Ghaziabad',
    address: 'Sector 4, Vaishali, Ghaziabad, UP',
    rating: 4.8,
    reviewCount: 48,
    availableSeats: 2,
    totalSeats: 5,
    verified: true,
    faculty: ['Er. Rajesh Bansal (B.Tech ECE, 12 Years Teaching Experience)'],
    phone: '+91 98711 22334',
    email: 'rajesh.bansal.tutor@gmail.com',
    description: 'Patient, concept-first teaching method tailored to build deep foundations in algebra, trigonometry, and physical sciences. Home visits across Indirapuram, Vaishali, and Vasundhara.',
    referralCode: 'BANSAL-HT-08',
    highlights: ['1-on-1 Individual Attention', 'In-home visit with safety verification', 'Personalized Chapter Pacing', 'Monthly Parent Progress Reports']
  },
  {
    id: 'tuit_3',
    type: 'online',
    name: 'LearnX Live Interactive Classroom',
    tagLine: 'India’s Premier Live Micro-Batch Online Tutoring',
    subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Physics', 'Chemistry'],
    classes: [6, 7, 8, 9, 10, 11, 12],
    fees: 1800,
    feeFrequency: 'per month',
    timings: '6:00 PM – 9:00 PM (Live Batches)',
    location: 'Pan India (Online HD Streaming)',
    address: 'LearnX EdTech HQ, Koramangala, Bengaluru 560034',
    rating: 4.95,
    reviewCount: 380,
    availableSeats: 15,
    totalSeats: 50,
    verified: true,
    faculty: ['Master Teachers from Top Universities', 'Dedicated 24/7 AI & Human Teaching Assistants'],
    phone: '+91 80 4123 9999',
    email: 'live@learnx.in',
    description: 'Two-way audio/video live micro-batches capped at 25 students. Includes recorded lecture replays, live polls, digital whiteboard notes, and 24/7 doubt resolution.',
    referralCode: 'LX-LIVE-ONLINE',
    highlights: ['Micro-batch size (max 25)', 'Class recordings with lifetime access', 'Live in-class quizzes & instant leaderboard', '15% platform admission discount']
  },
  {
    id: 'tuit_4',
    type: 'centre',
    name: 'Pragati Science & Commerce Academy',
    tagLine: 'Focused Board & CUET Preparation for Senior Secondary',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Economics', 'Accountancy'],
    classes: [11, 12],
    fees: 4000,
    feeFrequency: 'per month',
    timings: '3:30 PM – 7:30 PM (Mon-Sat)',
    location: 'Kothrud, Pune',
    address: 'Pragati Arcade, Karve Road, Kothrud, Pune 411038',
    rating: 4.7,
    reviewCount: 89,
    availableSeats: 8,
    totalSeats: 40,
    verified: true,
    faculty: ['Prof. Milind Deshpande (Ph.D Physics)', 'Mrs. Sneha Joshi (CA, M.Com)'],
    phone: '+91 20 2543 1122',
    email: 'info@pragaticlasses.com',
    description: 'Renowned institute in Pune specializing in Class 11-12 Board excellence with synchronized CUET and JEE/NEET foundational coaching.',
    referralCode: 'PRAGATI-PUN-11',
    highlights: ['Separate Science & Commerce Wings', 'Extensive Previous 10-Year Question Bank', 'Bi-weekly OMR Test Series']
  }
];

// Rich Student Marketplace items
const initialMarketplace: MarketplaceItem[] = [
  {
    id: 'mkt_1',
    sellerId: 'user_student_1',
    sellerName: 'Aarav Sharma',
    sellerRole: 'student',
    title: 'NCERT Mathematics Class 10 (Latest 2025-26 Edition) + Exemplar',
    category: 'Used Books',
    price: 180,
    isExchange: false,
    condition: 'Like New',
    description: 'Hardly used textbook with neat pencil markings only on key formulas. Free formula cheat-sheet included!',
    classLevel: 10,
    subject: 'Mathematics',
    contactPhone: '+91 98765 43210',
    contactEmail: 'aarav.sharma@learnx.in',
    location: 'Janakpuri, New Delhi',
    status: 'active',
    tags: ['NCERT', 'Class 10', 'Maths', 'Exemplar'],
    createdAt: '2026-08-25'
  },
  {
    id: 'mkt_2',
    sellerId: 'user_student_2',
    sellerName: 'Diya Patel',
    sellerRole: 'student',
    title: 'HC Verma Concepts of Physics Vol 1 & 2 Combo',
    category: 'Used Books',
    price: 420,
    isExchange: true,
    condition: 'Good',
    description: 'Complete set of HC Verma. Willing to exchange for SL Arora Physics or sell outright.',
    classLevel: 11,
    subject: 'Physics',
    contactPhone: '+91 98221 55667',
    contactEmail: 'diya.patel@gmail.com',
    location: 'Viman Nagar, Pune',
    status: 'active',
    tags: ['HC Verma', 'Physics', 'Class 11', 'JEE'],
    createdAt: '2026-08-29'
  },
  {
    id: 'mkt_3',
    sellerId: 'user_student_3',
    sellerName: 'Kunal Joshi',
    sellerRole: 'student',
    title: 'Camlin Exam Geometry Box + Oxford Mathematical Instrument Set',
    category: 'Stationery',
    price: 120,
    isExchange: false,
    condition: 'Brand New',
    description: 'Unopened geometry box with precision compass, divider, set squares, and protractor.',
    classLevel: 9,
    contactPhone: '+91 97110 88990',
    contactEmail: 'kunal.j@outlook.com',
    location: 'Sector 62, Noida',
    status: 'active',
    tags: ['Stationery', 'Geometry Box', 'Instruments'],
    createdAt: '2026-09-01'
  },
  {
    id: 'mkt_4',
    sellerId: 'user_tutor_1',
    sellerName: 'Dr. Shalini Verma',
    sellerRole: 'tutor',
    title: '1-on-1 Emergency Doubt Clearing Session (60 Mins Online)',
    category: 'Tutoring',
    price: 299,
    isExchange: false,
    description: 'Stuck before exams? Book a 60-minute Google Meet/Zoom session to resolve your toughest Class 9-12 Science/Maths doubts.',
    classLevel: 10,
    subject: 'Science & Math',
    contactPhone: '+91 98112 34567',
    contactEmail: 'shalini.verma@learnx.in',
    location: 'Online / Pan India',
    status: 'active',
    tags: ['Doubt Session', 'Tutor', 'Live'],
    createdAt: '2026-09-02'
  },
  {
    id: 'mkt_5',
    sellerId: 'user_student_4',
    sellerName: 'Rohan Mehra',
    sellerRole: 'student',
    title: 'High School Science Fair PPT & Presentation Deck Design (12 Slides)',
    category: 'PPT/Design',
    price: 250,
    isExchange: false,
    description: 'Custom animated PowerPoint presentation deck formatted for school projects, environmental studies, or science symposiums.',
    classLevel: 11,
    contactPhone: '+91 98450 11223',
    contactEmail: 'rohan.designs@learnx.in',
    location: 'Indiranagar, Bengaluru',
    status: 'active',
    tags: ['PPT', 'Slides', 'Project', 'Canva'],
    createdAt: '2026-08-30'
  },
  {
    id: 'mkt_6',
    sellerId: 'user_student_5',
    sellerName: 'Ananya Singhania',
    sellerRole: 'student',
    title: 'Handmade Chart: Human Circulatory & Digestive System (Double Sized)',
    category: 'Chart/Diagram',
    price: 190,
    isExchange: false,
    condition: 'Like New',
    description: 'Clean, color-coded, labeled chart on heavy ivory sheet for Class 10 Biology board practical assessment.',
    classLevel: 10,
    subject: 'Science (Biology)',
    contactPhone: '+91 99100 44556',
    contactEmail: 'ananya.singh@gmail.com',
    location: 'Rohini, New Delhi',
    status: 'active',
    tags: ['Chart', 'Diagram', 'Biology', 'Practical'],
    createdAt: '2026-08-27'
  },
  {
    id: 'mkt_7',
    sellerId: 'user_student_1',
    sellerName: 'Aarav Sharma',
    sellerRole: 'student',
    title: 'Handwritten Topper Formula Notes & Mindmaps: Class 10 Mathematics',
    category: 'Notes Organization',
    price: 99,
    isExchange: false,
    condition: 'Like New',
    description: 'Organized spiral booklet of 42 pages containing all formula derivations, theorems, and shortcut tricks for Term 1 & 2.',
    classLevel: 10,
    subject: 'Mathematics',
    contactPhone: '+91 98765 43210',
    contactEmail: 'aarav.sharma@learnx.in',
    location: 'Janakpuri, New Delhi',
    status: 'active',
    tags: ['Topper Notes', 'Formulas', 'Class 10'],
    createdAt: '2026-09-02'
  }
];

// Seed Admission Requests
const initialAdmissions: AdmissionRequest[] = [
  {
    id: 'LX-ADM-2026-108',
    studentId: 'user_student_1',
    studentName: 'Aarav Sharma',
    studentPhone: '+91 98765 43210',
    studentEmail: 'aarav.sharma@learnx.in',
    studentClass: 10,
    tuitionId: 'tuit_1',
    tuitionName: 'Apex Scholars Coaching Institute',
    tuitionType: 'centre',
    preferredTiming: '5:00 PM – 7:00 PM',
    message: 'Seeking admission for Board Batch 2026 in Mathematics and Science.',
    status: 'Accepted',
    referralCode: 'APEX-DEL-2026',
    feeAmount: 3500,
    commissionAmount: 525, // 15% of 3500
    commissionPercent: 15,
    createdAt: '2026-09-01T10:30:00.000Z',
    updatedAt: '2026-09-02T14:15:00.000Z',
  }
];

// Seed Payments
const initialPayments: PaymentTransaction[] = [
  {
    id: 'TXN-UPI-20260901-8491',
    admissionId: 'LX-ADM-2026-108',
    userId: 'user_student_1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@learnx.in',
    amount: 3500,
    vpa: 'aarav@okaxis',
    paymentMethod: 'UPI',
    status: 'Paid',
    commissionAmount: 525, // 15%
    netAmount: 2975, // 3500 - 525 to tutor
    idempotencyKey: 'idemp_lx_adm_108_initial',
    receiptNumber: 'REC-LX-2026-0901-88',
    createdAt: '2026-09-01T10:45:00.000Z',
    paidAt: '2026-09-01T10:46:12.000Z',
    description: 'One-Time Admission Fee: Apex Scholars Coaching Institute (Class 10 Batch)'
  }
];

// Seed Planner tasks
const initialPlanner: PlannerTask[] = [
  {
    id: 'task_1',
    userId: 'user_student_1',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    title: 'Solve NCERT Exercise 4.2 (Factorization method)',
    date: '2026-09-04',
    time: '17:00',
    durationMinutes: 45,
    isCompleted: false,
    reminderEnabled: true,
    priority: 'high',
    notes: 'Focus on word problems related to speed of train and stream.'
  },
  {
    id: 'task_2',
    userId: 'user_student_1',
    subject: 'Science',
    chapter: 'Chemical Reactions and Equations',
    title: 'Revise displacement & double displacement reactions notes',
    date: '2026-09-04',
    time: '18:30',
    durationMinutes: 30,
    isCompleted: true,
    reminderEnabled: true,
    priority: 'medium',
    notes: 'Make sure to memorize colour changes for iron nail in copper sulphate.'
  },
  {
    id: 'task_3',
    userId: 'user_student_1',
    subject: 'Science',
    chapter: 'Life Processes',
    title: 'Take LearnX 15-Min MCQ Practice Test',
    date: '2026-09-05',
    time: '19:00',
    durationMinutes: 20,
    isCompleted: false,
    reminderEnabled: true,
    priority: 'high',
    notes: 'Target score: 100% to earn Science Whiz badge!'
  }
];

// Seed Notifications
const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_student_1',
    title: 'Admission Confirmed!',
    message: 'Apex Scholars Coaching Institute accepted your admission request LX-ADM-2026-108. Welcome aboard!',
    type: 'admission',
    read: false,
    timestamp: new Date().toISOString(),
    actionLink: '/tuition'
  },
  {
    id: 'notif_2',
    userId: 'user_student_1',
    title: 'Study Streak Alive: 7 Days 🔥',
    message: 'Great discipline, Aarav! Keep up your daily study pace to reach 10-day Legend badge.',
    type: 'study',
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    actionLink: '/planner'
  },
  {
    id: 'notif_3',
    userId: 'user_student_1',
    title: 'Payment Receipt Generated',
    message: 'Receipt REC-LX-2026-0901-88 for ₹3,500 has been verified. 15% platform commission logged.',
    type: 'payment',
    read: true,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    actionLink: '/payments'
  }
];

// Seed Quiz Attempts for Student Analytics
const initialQuizAttempts: QuizAttemptResult[] = [
  {
    id: 'att_1',
    userId: 'user_student_1',
    chapterId: 'ch_m1',
    subjectId: 'sub_m_10',
    score: 4,
    total: 5,
    percentage: 80,
    xpEarned: 80,
    passed: true,
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'att_2',
    userId: 'user_student_1',
    chapterId: 'ch_m4',
    subjectId: 'sub_m_10',
    score: 2,
    total: 5,
    percentage: 40,
    xpEarned: 40,
    passed: false,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'att_3',
    userId: 'user_student_1',
    chapterId: 'ch_s1',
    subjectId: 'sub_s_10',
    score: 3,
    total: 5,
    percentage: 60,
    xpEarned: 60,
    passed: true,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'att_4',
    userId: 'user_student_1',
    chapterId: 'ch_s2',
    subjectId: 'sub_s_10',
    score: 5,
    total: 5,
    percentage: 100,
    xpEarned: 100,
    passed: true,
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Seed User Feedbacks & Content Issues
const initialFeedbacks: UserFeedback[] = [
  {
    id: 'fb_1',
    userId: 'user_student_1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@learnx.in',
    role: 'student',
    rating: 5,
    category: 'feature_request',
    title: 'Offline chapter audio summaries',
    description: 'Could we have 3-minute voice recaps for NCERT Science chapters before exams? The notes are already top notch!',
    tags: ['Audio', 'Revision', 'Class 10'],
    status: 'under_review',
    adminResponse: 'Great suggestion, Aarav! Audio revision podcasts are slated for the Q4 roadmap.',
    pageContext: {
      path: '/learning',
      tab: 'notes',
      subjectName: 'Science',
      chapterNumber: 1,
      chapterTitle: 'Chemical Reactions and Equations',
      classLevel: 10,
      url: 'https://learnx.in/learning',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'fb_2',
    userId: 'user_student_1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav.sharma@learnx.in',
    role: 'student',
    rating: 3,
    category: 'content_issue',
    issueType: 'wrong_answer',
    title: 'Check Option B in Quadratic Equations MCQ #3',
    description: 'Question asks for discriminant value when b^2 - 4ac < 0. Option marked as real roots but should be no real roots.',
    tags: ['Maths', 'MCQ Key', 'Correction'],
    status: 'open',
    pageContext: {
      path: '/learning',
      tab: 'mcq',
      subjectName: 'Mathematics',
      chapterNumber: 4,
      chapterTitle: 'Quadratic Equations',
      questionId: 'ch4_mcq3',
      questionText: 'If the discriminant D = b^2 - 4ac < 0, what is the nature of the roots?',
      selectedAnswer: 'No real roots',
      correctAnswer: 'Two distinct real roots (reported key discrepancy)',
      classLevel: 10,
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'fb_3',
    userId: 'user_student_2',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.d@learnx.in',
    role: 'student',
    rating: 5,
    category: 'general',
    title: 'Study Planner alarm is a lifesaver!',
    description: 'The browser notifications and streak multipliers have helped me study 2 hours daily without procrastination. Thank you LearnX team!',
    tags: ['Praise', 'Habit', 'Planner'],
    status: 'resolved',
    adminResponse: 'So proud of your consistency, Ananya! Keep burning that streak flame.',
    resolvedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    pageContext: {
      path: '/planner',
      tab: 'planner',
      classLevel: 10,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'fb_4',
    userId: 'user_student_3',
    userName: 'Kabir Singhal',
    userEmail: 'kabir.s@learnx.in',
    role: 'student',
    rating: 4,
    category: 'bug',
    issueType: 'technical_glitch',
    title: 'Timer test auto-submit lag on mobile',
    description: 'When the 15-minute countdown hit zero on my mobile screen, the submit modal took 2 seconds to appear. Please optimize!',
    tags: ['Mobile', 'Timer', 'Performance'],
    status: 'under_review',
    pageContext: {
      path: '/learning',
      tab: 'test',
      subjectName: 'Science',
      chapterNumber: 2,
      chapterTitle: 'Acids, Bases and Salts',
      classLevel: 10,
      timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Seed Saved Bookmarks & Interactive Notes
const initialBookmarks: SavedBookmark[] = [
  {
    id: 'bm_1',
    userId: 'user_student_1',
    type: 'formula',
    title: 'Quadratic Formula & Discriminant Rules',
    content: 'x = (-b ± √(b² - 4ac)) / (2a). Nature of roots: D > 0 (Two distinct real roots), D = 0 (Two equal real roots), D < 0 (No real roots).',
    highlightColor: 'amber',
    subjectId: 'sub_m_10',
    subjectName: 'Mathematics',
    chapterId: 'ch_m4',
    chapterNumber: 4,
    chapterTitle: 'Quadratic Equations',
    classLevel: 10,
    tags: ['Important', 'Board Exam', 'Formula'],
    userNotes: 'Remember: If D is a perfect square, roots are rational! Essential for Section C 3-marker.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'bm_2',
    userId: 'user_student_1',
    type: 'concept',
    title: 'Law of Conservation of Mass in Reactions',
    content: 'Mass can neither be created nor destroyed in a chemical reaction. Total mass of elements in products must equal total mass in reactants.',
    highlightColor: 'emerald',
    subjectId: 'sub_s_10',
    subjectName: 'Science',
    chapterId: 'ch_s1',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    classLevel: 10,
    tags: ['Concept', 'Law'],
    userNotes: 'Always balance Fe + H2O -> Fe3O4 + H2 using step-wise atom count method first.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bm_3',
    userId: 'user_student_1',
    type: 'note_highlight',
    title: 'pH of Common Salts & Chlor-Alkali Process',
    content: 'Electrolysis of brine (aqueous NaCl) produces NaOH (caustic soda) at cathode, Cl2 gas at anode, and H2 gas at cathode.',
    highlightColor: 'sky',
    subjectId: 'sub_s_10',
    subjectName: 'Science',
    chapterId: 'ch_s2',
    chapterNumber: 2,
    chapterTitle: 'Acids, Bases and Salts',
    classLevel: 10,
    tags: ['High Yield', 'Chemistry', 'Experiment'],
    userNotes: 'Commonly asked in CBSE 2024 & 2025 question papers. Remember gas liberated at anode vs cathode.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Seed Discussion Q&A Forum Threads
const initialDiscussions: DiscussionQuestion[] = [
  {
    id: 'disc_1',
    subjectId: 'sub_m_10',
    subjectName: 'Mathematics',
    chapterId: 'ch_m4',
    chapterNumber: 4,
    chapterTitle: 'Quadratic Equations',
    classLevel: 10,
    title: 'How to easily factorize quadratic equations with large constant terms like 182?',
    content: 'In NCERT Exercise 4.2 Question 3, we have x² - 27x + 182 = 0. What is the fastest mental trick to find two numbers whose product is 182 and sum is -27 without listing all factors?',
    authorId: 'user_student_1',
    authorName: 'Aarav Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250',
    authorRole: 'student',
    upvotes: 8,
    upvotedBy: ['peer_1', 'peer_2', 'peer_3'],
    tags: ['Factorization', 'Tricks', 'NCERT Exercise 4.2'],
    isResolved: true,
    answers: [
      {
        id: 'ans_1',
        questionId: 'disc_1',
        authorId: 'user_provider_1',
        authorName: 'Er. Rajesh Bansal (Mentor)',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        authorRole: 'tutor',
        content: 'Take prime factorization of 182: 182 = 2 × 7 × 13. Group the prime factors into two numbers: (2 × 7) = 14 and 13. Notice 14 + 13 = 27! Both signs negative: (-14) × (-13) = +182 and (-14) + (-13) = -27. Hence (x - 14)(x - 13) = 0.',
        upvotes: 14,
        upvotedBy: ['user_student_1', 'peer_1', 'peer_4', 'peer_5'],
        isAccepted: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'ans_2',
        questionId: 'disc_1',
        authorId: 'peer_1',
        authorName: 'Tanvi Deshmukh',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        authorRole: 'student',
        content: 'Also you can use Quadratic Formula: D = (-27)² - 4(1)(182) = 729 - 728 = 1. √D = 1. Then x = (27 ± 1)/2 which directly yields 14 and 13!',
        upvotes: 9,
        upvotedBy: ['user_student_1', 'peer_2'],
        isAccepted: false,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'disc_2',
    subjectId: 'sub_s_10',
    subjectName: 'Science',
    chapterId: 'ch_s1',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    classLevel: 10,
    title: 'Why is respiration considered an exothermic reaction in CBSE exams?',
    content: 'My school teacher emphasized writing the complete balanced equation with glucose and oxygen. What specific points guarantee full marks in a 2-mark board question?',
    authorId: 'peer_2',
    authorName: 'Kabir Singhal',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorRole: 'student',
    upvotes: 6,
    upvotedBy: ['user_student_1', 'peer_1'],
    tags: ['Exothermic', 'Biology-Chemistry', 'Board Marking Scheme'],
    isResolved: false,
    answers: [
      {
        id: 'ans_3',
        questionId: 'disc_2',
        authorId: 'user_student_1',
        authorName: 'Aarav Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250',
        authorRole: 'student',
        content: 'State: 1) Glucose breakdown combines with oxygen in cells to release energy in the form of ATP. 2) Write equation: C6H12O6(aq) + 6O2(aq) -> 6CO2(aq) + 6H2O(l) + Energy. Highlighting "+ Energy" at the end gets you the full 2 marks.',
        upvotes: 7,
        upvotedBy: ['peer_2', 'peer_3'],
        isAccepted: false,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const window_context_fallback = 'https://learnx.in';

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(fileContent);
        // Merge any new seed subjects and chapters that might not exist in an existing file
        const savedSubjects = parsed.subjects || [];
        const existingSubIds = new Set(savedSubjects.map((s: any) => s.id));
        const mergedSubjects = [
          ...savedSubjects,
          ...initialSubjects.filter(s => !existingSubIds.has(s.id))
        ];

        const savedChapters = parsed.chapters || [];
        const existingChapIds = new Set(savedChapters.map((c: any) => c.id));
        const mergedChapters = [
          ...savedChapters,
          ...initialChapters.filter(c => !existingChapIds.has(c.id))
        ];

        return {
          users: parsed.users || initialUsers,
          subjects: mergedSubjects,
          chapters: mergedChapters,
          tuitions: parsed.tuitions || initialTuitions,
          admissions: parsed.admissions || initialAdmissions,
          marketplace: parsed.marketplace || initialMarketplace,
          payments: parsed.payments || initialPayments,
          plannerTasks: parsed.plannerTasks || initialPlanner,
          quizAttempts: (parsed.quizAttempts && parsed.quizAttempts.length > 0) ? parsed.quizAttempts : initialQuizAttempts,
          notifications: parsed.notifications || initialNotifications,
          orders: parsed.orders || [],
          payouts: parsed.payouts || [],
          webhookLogs: parsed.webhookLogs || [],
          feedbacks: parsed.feedbacks || initialFeedbacks,
          bookmarks: parsed.bookmarks || initialBookmarks,
          discussions: parsed.discussions || initialDiscussions,
          walletTransactions: parsed.walletTransactions || [],
          emailAuditLogs: parsed.emailAuditLogs || [],
          userQuestionHistory: parsed.userQuestionHistory || [],
        };
      }
    } catch (err) {
      console.error('Error reading database file, falling back to initial seed:', err);
    }

    const defaultData: DatabaseSchema = {
      users: initialUsers,
      subjects: initialSubjects,
      chapters: initialChapters,
      tuitions: initialTuitions,
      admissions: initialAdmissions,
      marketplace: initialMarketplace,
      payments: initialPayments,
      plannerTasks: initialPlanner,
      quizAttempts: initialQuizAttempts,
      notifications: initialNotifications,
      orders: [],
      payouts: [],
      webhookLogs: [],
      feedbacks: initialFeedbacks,
      bookmarks: initialBookmarks,
      discussions: initialDiscussions,
      walletTransactions: [],
      emailAuditLogs: [],
      userQuestionHistory: [],
    };

    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database atomically:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection];
  }

  public set<K extends keyof DatabaseSchema>(collection: K, items: DatabaseSchema[K]) {
    this.data[collection] = items;
    this.saveData(this.data);
  }

  public async generateQRCode(dataString: string): Promise<string> {
    try {
      return await QRCode.toDataURL(dataString, {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (err) {
      console.error('QR generation error:', err);
      return '';
    }
  }
}

export const db = new DatabaseManager();
