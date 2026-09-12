// Class 11 Accountancy Full Study Material (New Edition 2024-25)
// Source: Vivekananda Vidyalaya Matric Hr Sec School, Pannaikadu Pirivu, Kodaikanal
// Prepared by: P. Vaheeswaran M.Com., M.Phil., DCA., B.Ed. (Vice-Principal & PG Assistant of Commerce & Accountancy)

export interface MCQItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  answerText: string;
  explanation?: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string | string[];
  marks?: number;
  subPoints?: { label: string; text: string }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface MasterFormat {
  title: string;
  description?: string;
  columns?: string[];
  data?: any[];
  htmlOrMarkdown?: string;
}

export interface ChapterMaterial {
  chapterNumber: number;
  title: string;
  tagline: string;
  mcqs: MCQItem[];
  veryShortQuestions: QAItem[]; // 2 Marks
  shortQuestions: QAItem[]; // 3 Marks
  longQuestions: QAItem[]; // 5 Marks
  formatsAndTables?: MasterFormat[];
}

export interface CaseStudyItem {
  id: string;
  caseNumber: number;
  title: string;
  scenario: string;
  discussionPoints: string[];
  solutionKey: string[];
}

export interface ImportantSumsItem {
  chapterNumber: number;
  chapterTitle: string;
  twoMarkSums: string;
  threeMarkSums: string;
  fiveMarkSums: string;
}

export interface AccountancyStudyGuide {
  title: string;
  edition: string;
  school: string;
  author: {
    name: string;
    qualifications: string;
    designation: string;
    school: string;
    cell: string;
    email: string;
  };
  motto: string;
  preface: string;
  chapters: ChapterMaterial[];
  interiorCompulsoryCaseStudies: CaseStudyItem[];
  importantTheoryBank: {
    twoMarks: string[];
    threeMarks: string[];
    fiveMarks: string[];
  };
  importantSumsMatrix: ImportantSumsItem[];
}

export const accountancyMaterialData: AccountancyStudyGuide = {
  title: '11th Std Accountancy Full Material',
  edition: 'New Edition 2024-25',
  school: 'Vivekananda Vidyalaya Matric Hr Sec School, Pannaikadu Pirivu, Kodaikanal',
  author: {
    name: 'P. Vaheeswaran',
    qualifications: 'M.Com., M.Phil., DCA., B.Ed.',
    designation: 'Vice-Principal & PG Assistant of Commerce & Accountancy',
    school: 'Vivekananda Vidyalaya Matric Hr Sec School, Pannaikadu Pirivu, Kodaikanal, Dindigul Dt.',
    cell: '9791324143',
    email: 'npvasu92@gmail.com',
  },
  motto: 'Luca Pacioli — Father of Accountancy. "If you fail never give up because FAIL means First Attempt In Learning."',
  preface:
    'Prepared to assist higher secondary students in understanding core accounting foundations easily and scoring top marks in public board exams. Contains chapter-wise complete Choose the Correct Answer, 2-mark Very Short Answers, 3-mark Short Answers, 5-mark Distinction Tables, Practical Case Studies, and Important Problem blue-prints.',
  chapters: [
    // CHAPTER 1
    {
      chapterNumber: 1,
      title: 'Introduction to Accounting',
      tagline: 'Foundations, Objectives, Functions & Users of Accounting Information',
      mcqs: [
        {
          id: 'c1_mcq_1',
          question: 'The root of financial accounting system is:',
          options: ['(a) Social accounting', '(b) Stewardship accounting', '(c) Management accounting', '(d) Responsibility accounting'],
          correctIndex: 1,
          answerText: '(b) Stewardship accounting',
          explanation: 'Stewardship accounting is the historical root where agents/stewards managed resources on behalf of wealthy owners.'
        },
        {
          id: 'c1_mcq_2',
          question: 'Which one of the following is not a main objective of accounting?',
          options: [
            '(a) Systematic recording of transactions',
            '(b) Ascertainment of the profitability of the business',
            '(c) Ascertainment of the financial position of the business',
            '(d) Solving tax disputes with tax authorities'
          ],
          correctIndex: 3,
          answerText: '(d) Solving tax disputes with tax authorities',
          explanation: 'Solving tax disputes is a secondary legal consequence, not a primary objective of the accounting system.'
        },
        {
          id: 'c1_mcq_3',
          question: 'Which one of the following is not a branch of accounting?',
          options: ['(a) Financial accounting', '(b) Management accounting', '(c) Human resources accounting', '(d) None of the above'],
          correctIndex: 3,
          answerText: '(d) None of the above',
          explanation: 'All three (Financial, Management, and Human Resources accounting) are recognized branches.'
        },
        {
          id: 'c1_mcq_4',
          question: 'Financial position of a business is ascertained on the basis of:',
          options: ['(a) Journal', '(b) Trial balance', '(c) Balance Sheet', '(d) Ledger'],
          correctIndex: 2,
          answerText: '(c) Balance Sheet',
          explanation: 'The Balance Sheet shows the position of assets, liabilities, and capital on a specific date.'
        },
        {
          id: 'c1_mcq_5',
          question: 'Who is considered to be the internal user of the financial information?',
          options: ['(a) Creditor', '(b) Employee', '(c) Customer', '(d) Government'],
          correctIndex: 1,
          answerText: '(b) Employee',
          explanation: 'Employees and Management work inside the organization and are internal users; creditors, customers, and government are external users.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c1_vsq_1',
          marks: 2,
          question: 'Define accounting.',
          answer: '“The process of identifying, measuring, and communicating economic information to permit informed judgements and decisions by users of the information.” — American Accounting Association (AAA)'
        },
        {
          id: 'c1_vsq_2',
          marks: 2,
          question: 'List any two functions of accounting.',
          answer: [
            '(i) Measurement: Accounting works as a tool for measuring the performance and showing the financial position of business enterprises.',
            '(ii) Forecasting: With the help of various tools of accounting, future performance and financial position can be forecasted.'
          ]
        },
        {
          id: 'c1_vsq_3',
          marks: 2,
          question: 'What are the steps involved in the process of accounting?',
          answer: [
            '1. Identifying the transactions and Journalizing',
            '2. Posting and balancing in Ledger',
            '3. Preparation of Trial balance',
            '4. Preparation of Trading and Profit or Loss A/c',
            '5. Preparation of Balance sheet'
          ]
        },
        {
          id: 'c1_vsq_4',
          marks: 2,
          question: 'Who are the parties interested in accounting information?',
          answer: 'Owners, Management, Employees, Customers, Government, Creditors, Investors, and Researchers.'
        },
        {
          id: 'c1_vsq_5',
          marks: 2,
          question: 'Name any two bases of recording accounting information.',
          answer: '1. Cash basis\n2. Accrual basis (Mercantile basis)\n3. Mixed or Hybrid basis'
        }
      ],
      shortQuestions: [
        {
          id: 'c1_sq_1',
          marks: 3,
          question: 'Explain the meaning of accounting.',
          answer: 'Accounting is the systematic process of identifying, measuring, recording, classifying, summarizing, interpreting, and communicating financial information to interested stakeholders.'
        },
        {
          id: 'c1_sq_2',
          marks: 3,
          question: 'Discuss briefly the branches of accounting.',
          answer: [
            'i) Financial Accounting: Concerned with identification, recording, classifying, and summarising of financial transactions and events to provide information for decision making.',
            'ii) Management Accounting: Concerned with presentation of accounting information in such a way as to assist management in day-to-day operations and policy decisions.',
            'iii) Human Resources Accounting: Concerned with identification, quantification, and reporting of investments made in the human resources of an enterprise.'
          ]
        },
        {
          id: 'c1_sq_3',
          marks: 3,
          question: 'Discuss in detail the importance of accounting.',
          answer: [
            'i) Systematic records: All transactions of an enterprise are recorded systematically in books of accounts.',
            'ii) Preparation of financial statements: Results of business operations and financial position can be ascertained periodically.',
            'iii) Information to interested groups: Supplies vital financial data to owners, management, creditors, tax authorities, and government.'
          ]
        },
        {
          id: 'c1_sq_4',
          marks: 3,
          question: 'Why are Investors and Government interested in accounting information?',
          answer: [
            '(a) Investors: Need to know about the financial condition and earning capacity of a business before committing or maintaining their investment.',
            '(b) Government: The scarce resources of the country are used by business units. Information about enterprise performance helps in formulating industrial policies, national development, and tax assessments.'
          ]
        }
      ],
      longQuestions: [
        {
          id: 'c1_lq_1',
          marks: 5,
          question: 'Who are the parties interested in accounting information? Explain their interest.',
          answer: [
            '(i) Owners: Provide capital and are interested in knowing whether the business earned profit or incurred loss, and its financial health on a given date.',
            '(ii) Management: Uses accounting data as the primary basis for planning, decision-making, and organizational control.',
            '(iii) Employees: Interested in profit-earning capacity which affects remuneration, bonus, working conditions, and retirement security.',
            '(iv) Investors: Need to evaluate risk, return on investment, and financial solvency before investing capital.',
            '(v) Government: Monitored for tax compliance (GST, income tax) and economic policy formulation.',
            '(vi) Researchers: Analyze published financial statements for industrial research and economic evaluation.'
          ]
        },
        {
          id: 'c1_lq_2',
          marks: 5,
          question: 'Discuss the role of an accountant in the modern business world.',
          answer: [
            '(i) Record keeper: Maintains systematic records of all financial transactions and prepares financial statements.',
            '(ii) Provider of information to management: Assists management with timely information required for strategic decisions and operational control.',
            '(iii) Protector of business assets: Maintains accurate records of assets to exercise control, avoid misuse, and arrange asset insurance.',
            '(iv) Financial advisor: Analyses financial statements and advises on investment avenues, capital budgeting, and cost minimization.',
            '(v) Tax manager: Ensures timely filing of tax returns, tax compliance, and optimizes legitimate tax exemptions.',
            '(vi) Public relations officer: Provides verifiable accounting information to external stakeholders as per legal regulations.'
          ]
        }
      ]
    },

    // CHAPTER 2
    {
      chapterNumber: 2,
      title: 'Conceptual Framework of Accounting',
      tagline: 'GAAP, Accounting Concepts, Conventions & Standards',
      mcqs: [
        {
          id: 'c2_mcq_1',
          question: 'The business is liable to the proprietor in respect of capital introduced by him according to:',
          options: ['(a) Money measurement concept', '(b) Cost concept', '(c) Business entity concept', '(d) Dual aspect concept'],
          correctIndex: 2,
          answerText: '(c) Business entity concept',
          explanation: 'The Business Entity Concept treats the owner and business enterprise as separate and distinct entities.'
        },
        {
          id: 'c2_mcq_2',
          question: 'The concept which assumes that a business will last indefinitely is:',
          options: ['(a) Business Entity', '(b) Going concern', '(c) Periodicity', '(d) Conservatism'],
          correctIndex: 1,
          answerText: '(b) Going concern',
          explanation: 'The Going Concern concept assumes that the enterprise will continue operating for an indefinite period into the foreseeable future.'
        },
        {
          id: 'c2_mcq_3',
          question: 'GAAPs stand for:',
          options: [
            '(a) Generally Accepted Accounting Policies',
            '(b) Generally Accepted Accounting Principles',
            '(c) Generally Accepted Accounting Provisions',
            '(d) None of these'
          ],
          correctIndex: 1,
          answerText: '(b) Generally Accepted Accounting Principles',
          explanation: 'GAAP refers to the standard framework of guidelines for financial accounting.'
        },
        {
          id: 'c2_mcq_4',
          question: 'The rule of stock valuation ‘cost price or net realizable value whichever is lower’ is based on:',
          options: ['(a) Materiality', '(b) Money measurement', '(c) Conservatism', '(d) Accrual'],
          correctIndex: 2,
          answerText: '(c) Conservatism',
          explanation: 'The principle of conservatism (prudence) mandates providing for all anticipated losses while not anticipating unrealized gains.'
        },
        {
          id: 'c2_mcq_5',
          question: 'In India, Accounting Standards are issued by:',
          options: ['(a) Reserve Bank of India', '(b) The Cost and Management Accountants of India', '(c) Supreme Court of India', '(d) The Institute of Chartered Accountants of India (ICAI)'],
          correctIndex: 3,
          answerText: '(d) The Institute of Chartered Accountants of India (ICAI)',
          explanation: 'ICAI constitutes the Accounting Standards Board (ASB) which formulates and issues Accounting Standards in India.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c2_vsq_1',
          marks: 2,
          question: 'Define book-keeping.',
          answer: '“Book-keeping is an art of recording business dealings in a set of books.” — J.R. Batliboi'
        },
        {
          id: 'c2_vsq_2',
          marks: 2,
          question: 'What is meant by accounting concepts?',
          answer: 'Accounting concepts are the fundamental basic assumptions, postulates, and conditions upon which the entire structure of accounting has been laid down by broad consensus.'
        },
        {
          id: 'c2_vsq_3',
          marks: 2,
          question: 'Briefly explain about the Realization concept.',
          answer: 'Under the realization concept, any change in the value of an asset or revenue is recognized only when the business actually realizes it through sale or legal claim, rather than through mere market fluctuations.'
        },
        {
          id: 'c2_vsq_4',
          marks: 2,
          question: 'What is the “Full Disclosure Principle” of accounting?',
          answer: 'It states that all material information that would make a significant difference to users in making economic decisions must be completely and transparently disclosed in the financial statements.'
        },
        {
          id: 'c2_vsq_5',
          marks: 2,
          question: 'Write a brief note on the ‘Consistency’ assumption.',
          answer: 'It states that accounting policies and practices must remain unchanged from one accounting period to another, ensuring that financial statements of successive years are comparable.'
        }
      ],
      shortQuestions: [
        {
          id: 'c2_sq_1',
          marks: 3,
          question: 'What is the matching concept? Why should a business concern follow this concept?',
          answer: 'The matching concept states that revenues earned during an accounting period must be matched with the expenses incurred during that exact same period to earn those revenues. This enables the calculation of true profit or loss.'
        },
        {
          id: 'c2_sq_2',
          marks: 3,
          question: '“Only monetary transactions are recorded in accounting”. Explain the statement.',
          answer: 'Under the money measurement concept, only transactions that can be measured and expressed in terms of money are recorded in accounts. Qualitative factors like employee skill or employee loyalty cannot be expressed in currency and are omitted.'
        },
        {
          id: 'c2_sq_3',
          marks: 3,
          question: '“Business units last indefinitely”. Mention and explain the concept on which this is based.',
          answer: 'Based on the Going Concern Concept. It assumes that the business will continue its operations for an indefinitely long time and will not be closed or liquidated in the immediate foreseeable future.'
        },
        {
          id: 'c2_sq_4',
          marks: 3,
          question: 'Write a brief note on Accounting Standards.',
          answer: 'Accounting standards provide the standardized norms and framework to be followed in financial reporting. They ensure consistency, comparability, adequacy, and reliability. Definition: “Accounting standards are codes of conduct imposed by customs, law or professional bodies for the benefit of public accountants and accountants generally.” — Kohler'
        }
      ],
      longQuestions: [
        {
          id: 'c2_lq_1',
          marks: 5,
          question: 'Explain the Matching Concept in detail with accounting adjustments.',
          answer: [
            '1. Core Principle: Revenues earned during an accounting period must be paired with expenses incurred to earn that revenue.',
            '2. Underlying Base: Built on the Accrual and Periodicity concepts.',
            '3. Scope of Expenses: Not all cash paid is considered; only expenses relating to the current accounting period are taken.',
            '4. Key Adjustments: Adjustments are systematically passed for outstanding expenses, prepaid expenses, accrued income, and unearned revenue.',
            '5. Asset Provisions: Provisions for depreciation of fixed assets and doubtful debts are deducted from the period revenues before declaring profit or loss.'
          ]
        }
      ]
    },

    // CHAPTER 3
    {
      chapterNumber: 3,
      title: 'Books of Prime Entry & Journalizing',
      tagline: 'Accounting Equation, Classification of Accounts & Golden Rules',
      mcqs: [
        {
          id: 'c3_mcq_1',
          question: 'Accounting equation signifies that:',
          options: [
            '(a) Capital of a business is equal to assets',
            '(b) Liabilities of a business are equal to assets',
            '(c) Capital of a business is equal to liabilities',
            '(d) Assets of a business are equal to the total of capital and liabilities'
          ],
          correctIndex: 3,
          answerText: '(d) Assets of a business are equal to the total of capital and liabilities',
          explanation: 'Assets = Capital + Liabilities.'
        },
        {
          id: 'c3_mcq_2',
          question: '‘Cash withdrawn by the proprietor from the business for his personal use’ causes:',
          options: [
            '(a) Decrease in assets and decrease in owner’s capital',
            '(b) Increase in one asset and decrease in another asset',
            '(c) Increase in one asset and increase in liabilities',
            '(d) Increase in asset and decrease in capital'
          ],
          correctIndex: 0,
          answerText: '(a) Decrease in assets and decrease in owner’s capital',
          explanation: 'Cash (asset) decreases, and Drawings reduces Capital (owner’s equity).'
        },
        {
          id: 'c3_mcq_3',
          question: 'A firm has assets of ₹1,00,000 and external liabilities of ₹60,000. Its capital would be:',
          options: ['(a) ₹1,60,000', '(b) ₹60,000', '(c) ₹1,00,000', '(d) ₹40,000'],
          correctIndex: 3,
          answerText: '(d) ₹40,000',
          explanation: 'Capital = Assets - Liabilities = ₹1,00,000 - ₹60,000 = ₹40,000.'
        },
        {
          id: 'c3_mcq_4',
          question: 'The incorrect accounting equation is:',
          options: [
            '(a) Assets = Liabilities + Capital',
            '(b) Assets = Capital + Liabilities',
            '(c) Liabilities = Assets + Capital',
            '(d) Capital = Assets – Liabilities'
          ],
          correctIndex: 2,
          answerText: '(c) Liabilities = Assets + Capital',
          explanation: 'Liabilities = Assets - Capital, so (c) is false.'
        },
        {
          id: 'c3_mcq_5',
          question: 'Accounting equation is formed based on the accounting principle of:',
          options: ['(a) Dual aspect', '(b) Consistency', '(c) Going concern', '(d) Accrual'],
          correctIndex: 0,
          answerText: '(a) Dual aspect',
          explanation: 'Dual aspect dictates that every transaction has a debit and an equal credit.'
        },
        {
          id: 'c3_mcq_6',
          question: 'Real account deals with:',
          options: ['(a) Individual persons', '(b) Expenses and losses', '(c) Assets', '(d) Incomes and gains'],
          correctIndex: 2,
          answerText: '(c) Assets',
          explanation: 'Real accounts represent tangible properties and intangible possessions of the business.'
        },
        {
          id: 'c3_mcq_7',
          question: 'Which one of the following is a Representative Personal Account?',
          options: ['(a) Building A/c', '(b) Outstanding salary A/c', '(c) Mahesh A/c', '(d) Balan & Co'],
          correctIndex: 1,
          answerText: '(b) Outstanding salary A/c',
          explanation: 'Outstanding salary represents the group of employees to whom salary is due.'
        },
        {
          id: 'c3_mcq_8',
          question: 'Prepaid rent is a:',
          options: ['(a) Nominal A/c', '(b) Personal A/c', '(c) Real A/c', '(d) Representative personal A/c'],
          correctIndex: 3,
          answerText: '(d) Representative personal A/c',
          explanation: 'Prepaid expenses represent the landlord or persons who have received advance rent.'
        },
        {
          id: 'c3_mcq_9',
          question: 'Withdrawal of cash from business by the proprietor should be credited to:',
          options: ['(a) Drawings A/c', '(b) Cash A/c', '(c) Capital A/c', '(d) Purchases A/c'],
          correctIndex: 1,
          answerText: '(b) Cash A/c',
          explanation: 'Entry is Drawings A/c Dr to Cash A/c Cr. Cash goes out and is credited.'
        },
        {
          id: 'c3_mcq_10',
          question: 'In double entry system of book keeping, every business transaction affects:',
          options: [
            '(a) Minimum of two accounts',
            '(b) Same account on two different dates',
            '(c) Two sides of the same account',
            '(d) Minimum three accounts'
          ],
          correctIndex: 0,
          answerText: '(a) Minimum of two accounts',
          explanation: 'There must be at least one account debited and one account credited.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c3_vsq_1',
          marks: 2,
          question: 'What are source documents?',
          answer: 'Source documents are documentary evidences supporting business transactions. Examples: Cash receipt, Invoice, Debit note, Credit note, Pay-in slip, and Cheque counterfoil.'
        },
        {
          id: 'c3_vsq_2',
          marks: 2,
          question: 'What is the Accounting Equation?',
          answer: 'The accounting equation expresses the mathematical balance between assets and claims against them:\nAssets = Capital + Liabilities'
        },
        {
          id: 'c3_vsq_3',
          marks: 2,
          question: 'Write transactions that: a) Decrease asset and liability, b) Increase one asset and decrease another.',
          answer: 'a) Paid loan / bank overdraft in cash (decreases Cash and decreases Liability).\nb) Purchased furniture for cash (Furniture asset increases, Cash asset decreases).'
        },
        {
          id: 'c3_vsq_4',
          marks: 2,
          question: 'What is meant by journalizing?',
          answer: 'Recording a business transaction in the journal in chronological order with debit and credit aspects and a brief narration is called journalizing.'
        },
        {
          id: 'c3_vsq_5',
          marks: 2,
          question: 'What is a Real Account?',
          answer: 'All accounts relating to tangible properties (building, cash, stock) and intangible possessions (goodwill, patents) are called Real Accounts.'
        },
        {
          id: 'c3_vsq_6',
          marks: 2,
          question: 'How are Personal Accounts classified?',
          answer: '1. Natural Person’s Account (e.g., Vinoth A/c, Malini A/c)\n2. Artificial Person’s Account (e.g., BHEL A/c, SBI Bank A/c)\n3. Representative Personal Account (e.g., Outstanding Salaries A/c, Prepaid Rent A/c)'
        },
        {
          id: 'c3_vsq_7',
          marks: 2,
          question: 'State the accounting rule for Nominal Account.',
          answer: 'Debit all expenses and losses. Credit all incomes and gains.'
        },
        {
          id: 'c3_vsq_8',
          marks: 2,
          question: 'Give the Golden Rules of Double Entry Accounting System.',
          answer: [
            '1. Personal Account: Debit the Receiver — Credit the Giver',
            '2. Real Account: Debit what comes in — Credit what goes out',
            '3. Nominal Account: Debit all expenses and losses — Credit all incomes and gains'
          ]
        }
      ],
      shortQuestions: [
        {
          id: 'c3_sq_1',
          marks: 3,
          question: 'Write a brief note on the accounting equation approach of recording transactions.',
          answer: 'The accounting equation expresses the relationship between assets and claims of outsiders (liabilities) and owners (capital). Capital + Liabilities = Assets. Accounts are classified into: Asset, Liability, Capital, Revenue, and Expense accounts.'
        },
        {
          id: 'c3_sq_2',
          marks: 3,
          question: 'What is an Account? Classify accounts with suitable examples.',
          answer: 'An account is an individual summarized record of transactions relating to a person, asset, liability, revenue, expense, or capital. Classification: (i) Personal Accounts (Natural, Artificial, Representative), (ii) Impersonal Accounts (Real tangible/intangible and Nominal).'
        },
        {
          id: 'c3_sq_3',
          marks: 3,
          question: 'What is the accounting treatment for life insurance premium paid on the life of the proprietor?',
          answer: 'Life insurance of the proprietor is a personal expense, so it is treated as drawings. Journal entry:\nDrawings A/c Dr\n  To Cash/Bank A/c Cr\n(Being insurance premium on the life of proprietor paid from business funds)'
        },
        {
          id: 'c3_sq_4',
          marks: 3,
          question: 'State the principles of the Double Entry System.',
          answer: [
            '1. In every business transaction, there are two aspects: receiving aspect and giving aspect.',
            '2. Each transaction involves at least two accounts (one debit and one credit).',
            '3. For every debit, there must be a corresponding and equal credit.'
          ]
        },
        {
          id: 'c3_sq_5',
          marks: 3,
          question: 'Explain the steps in journalizing.',
          answer: [
            '1. Identify the accounts involved in the transaction.',
            '2. Classify them under Personal, Real, or Nominal account.',
            '3. Apply the Golden Rules of debit and credit.',
            '4. Record the date, write the debit account with "Dr.", write credited account starting with "To", enter amounts, and write the narration.'
          ]
        }
      ],
      longQuestions: [
        {
          id: 'c3_lq_1',
          marks: 5,
          question: 'What is the Double Entry System? State its advantages.',
          answer: [
            'Definition: “Every transaction involving money or money’s worth has two fold aspects, the receiving of a value on the one hand and the giving of the same value on the other.” — Munro and Palmer',
            'Advantages:',
            '(i) Accuracy: Since both aspects are recorded, arithmetical accuracy can be verified through the trial balance.',
            '(ii) Ascertainment of business results: Facilitates accurate calculation of net profit or loss.',
            '(iii) Comparative study: Facilitates performance comparison and future business planning.',
            '(iv) Common acceptance: Accepted by tax authorities, courts, banks, and financial institutions.'
          ]
        }
      ],
      formatsAndTables: [
        {
          title: '30 Master Standard Journal Entries (Essential Handbook Reference)',
          description: 'Standard rules for all 30 foundational commercial transactions in Class 11 Accountancy.',
          columns: ['S.No.', 'Transaction', 'Debit Account', 'Credit Account', 'Narration / Rule'],
          data: [
            { no: 1, txn: 'Commenced business with cash', dr: 'Cash A/c', cr: 'To Capital A/c', rule: 'Cash comes in (Real Dr), Owner gives capital (Personal Cr)' },
            { no: 2, txn: 'Opened bank account / Cash deposited', dr: 'Bank A/c', cr: 'To Cash A/c', rule: 'Bank receiver (Dr), Cash goes out (Cr)' },
            { no: 3, txn: 'Withdrew cash from bank for office use', dr: 'Cash A/c', cr: 'To Bank A/c', rule: 'Cash comes in (Dr), Bank giver (Cr)' },
            { no: 4, txn: 'Borrowed loan from bank', dr: 'Bank A/c', cr: 'To Bank Loan A/c', rule: 'Money deposited in bank, Bank loan liability created' },
            { no: 5, txn: 'Cash purchases of goods', dr: 'Purchases A/c', cr: 'To Cash A/c', rule: 'Purchases expense (Dr), Cash goes out (Cr)' },
            { no: 6, txn: 'Goods purchased by cheque / net banking', dr: 'Purchases A/c', cr: 'To Bank A/c', rule: 'Purchases expense (Dr), Bank pays (Cr)' },
            { no: 7, txn: 'Credit purchases from supplier', dr: 'Purchases A/c', cr: 'To Creditor’s A/c', rule: 'Purchases expense (Dr), Creditor giver (Cr)' },
            { no: 8, txn: 'Cash sales of goods', dr: 'Cash A/c', cr: 'To Sales A/c', rule: 'Cash comes in (Dr), Sales income (Cr)' },
            { no: 9, txn: 'Credit sales to customer', dr: 'Debtor’s A/c', cr: 'To Sales A/c', rule: 'Debtor receiver (Dr), Sales income (Cr)' },
            { no: 10, txn: 'Assets bought on credit', dr: 'Asset A/c (Machinery/Furniture)', cr: 'To Creditor A/c', rule: 'Specific asset debited, Supplier credited' },
            { no: 11, txn: 'Assets bought for cash', dr: 'Asset A/c', cr: 'To Cash A/c', rule: 'Asset comes in (Dr), Cash goes out (Cr)' },
            { no: 12, txn: 'Expenses paid (Salary, Rent, Wages)', dr: 'Expense A/c', cr: 'To Cash A/c', rule: 'Expense nominal debited, Cash credited' },
            { no: 13, txn: 'Incomes received (Rent, Interest)', dr: 'Cash A/c', cr: 'To Income Received A/c', rule: 'Cash comes in (Dr), Income credited (Cr)' },
            { no: 14, txn: 'Purchases returns / Returns outward', dr: 'Creditor’s A/c', cr: 'To Purchases Returns A/c', rule: 'Supplier receiver (Dr), Goods return credited' },
            { no: 15, txn: 'Sales returns / Returns inward', dr: 'Sales Returns A/c', cr: 'To Debtor’s A/c', rule: 'Goods come back (Dr), Customer giver (Cr)' },
            { no: 16, txn: 'Cash received from debtors', dr: 'Cash A/c', cr: 'To Debtor’s A/c', rule: 'Cash comes in (Dr), Debtor giver (Cr)' },
            { no: 17, txn: 'Cash received from debtors & discount allowed', dr: 'Cash A/c Dr\nDiscount Allowed A/c Dr', cr: 'To Debtor’s A/c', rule: 'Discount allowed is a nominal loss (Dr)' },
            { no: 18, txn: 'Cash paid to creditors', dr: 'Creditor’s A/c', cr: 'To Cash A/c', rule: 'Creditor receiver (Dr), Cash goes out (Cr)' },
            { no: 19, txn: 'Cash paid to creditors & discount received', dr: 'Creditor’s A/c', cr: 'To Cash A/c\nTo Discount Received A/c', rule: 'Discount received is a nominal gain (Cr)' },
            { no: 20, txn: 'Drawings of proprietor (Cash / Bank / Goods)', dr: 'Drawings A/c', cr: 'To Cash / Bank / Purchases A/c', rule: 'Personal use debited to Drawings; goods reduce Purchases' },
            { no: 21, txn: 'Received Bills Receivable from debtor', dr: 'Bills Receivable A/c', cr: 'To Debtor’s A/c', rule: 'Bill is an asset (Dr), Debtor giver (Cr)' },
            { no: 22, txn: 'Cash received on maturity of bill', dr: 'Cash A/c', cr: 'To Bills Receivable A/c', rule: 'Cash comes in (Dr), Bill cancelled (Cr)' },
            { no: 23, txn: 'Discounting Bills Receivable with bank', dr: 'Bank A/c Dr\nDiscount A/c Dr', cr: 'To Bills Receivable A/c', rule: 'Bank proceeds Dr, Discount charges Dr, Bill given to bank' },
            { no: 24, txn: 'Dishonour of discounted bill', dr: 'Debtor’s A/c', cr: 'To Bank A/c', rule: 'Debtor re-debited, Bank re-credited' },
            { no: 25, txn: 'Accepting Bills Payable to creditor', dr: 'Creditor’s A/c', cr: 'To Bills Payable A/c', rule: 'Creditor receiver (Dr), Bills Payable liability (Cr)' },
            { no: 26, txn: 'Cash paid for Bills Payable', dr: 'Bills Payable A/c', cr: 'To Cash A/c', rule: 'Liability discharged (Dr), Cash goes out (Cr)' },
            { no: 27, txn: 'Bills Payable dishonoured on due date', dr: 'Bills Payable A/c', cr: 'To Creditor’s A/c', rule: 'Bill cancelled, Creditor liability restored' },
            { no: 28, txn: 'Goods issued for charity', dr: 'Charities A/c', cr: 'To Purchases A/c', rule: 'Charity expense (Dr), Purchases reduced (Cr)' },
            { no: 29, txn: 'Goods distributed as free samples', dr: 'Sales Promotion / Advt A/c', cr: 'To Purchases A/c', rule: 'Promotion expense (Dr), Purchases reduced (Cr)' },
            { no: 30, txn: 'Goods taken for office use', dr: 'Office Expenses A/c', cr: 'To Purchases A/c', rule: 'Office expense (Dr), Purchases reduced (Cr)' }
          ]
        }
      ]
    },

    // CHAPTER 4
    {
      chapterNumber: 4,
      title: 'Ledger Accounts & Balancing',
      tagline: 'Principal Book, Posting Procedure & Balance c/d vs b/d',
      mcqs: [
        {
          id: 'c4_mcq_1',
          question: 'The main objective of preparing a ledger account is to:',
          options: [
            '(a) Ascertain the financial position',
            '(b) Ascertain the profit or loss',
            '(c) Ascertain the profit or loss and financial position',
            '(d) Know the balance of each ledger account'
          ],
          correctIndex: 3,
          answerText: '(d) Know the balance of each ledger account',
          explanation: 'Ledgers group transactions account-wise to find net debit/credit balances.'
        },
        {
          id: 'c4_mcq_2',
          question: 'The process of transferring debit and credit items from journal to ledger accounts is called:',
          options: ['(a) Casting', '(b) Posting', '(c) Journalising', '(d) Balancing'],
          correctIndex: 1,
          answerText: '(b) Posting',
          explanation: 'Transferring entries from journal to ledger is posting.'
        },
        {
          id: 'c4_mcq_3',
          question: 'J.F. stands for:',
          options: ['(a) Ledger page number', '(b) Journal page number', '(c) Voucher number', '(d) Order number'],
          correctIndex: 1,
          answerText: '(b) Journal page number',
          explanation: 'J.F. is Journal Folio (page reference of the journal in the ledger).'
        },
        {
          id: 'c4_mcq_4',
          question: 'The process of finding the net difference between debit and credit totals in a ledger is called:',
          options: ['(a) Casting', '(b) Posting', '(c) Journalizing', '(d) Balancing'],
          correctIndex: 3,
          answerText: '(d) Balancing',
          explanation: 'Balancing finds the net remaining amount at period end.'
        },
        {
          id: 'c4_mcq_5',
          question: 'If the total of the debit side of an account exceeds the total of its credit side, it means:',
          options: ['(a) Credit balance', '(b) Debit balance', '(c) Nil balance', '(d) Debit and credit balance'],
          correctIndex: 1,
          answerText: '(b) Debit balance',
          explanation: 'Excess of debit over credit is a Debit Balance.'
        },
        {
          id: 'c4_mcq_6',
          question: 'The amount brought into the business by the proprietor should be credited to:',
          options: ['(a) Cash account', '(b) Drawings account', '(c) Capital account', '(d) Suspense account'],
          correctIndex: 2,
          answerText: '(c) Capital account',
          explanation: 'Cash A/c is debited, and Capital A/c is credited.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c4_vsq_1',
          marks: 2,
          question: 'What is a ledger?',
          answer: 'A ledger is the principal book of accounts containing a summarized and permanent record of all transactions relating to a person, asset, liability, expense, or income.'
        },
        {
          id: 'c4_vsq_2',
          marks: 2,
          question: 'What is meant by posting?',
          answer: 'The systematic process of recording debit and credit aspects from the journal into their respective accounts in the ledger is called posting.'
        },
        {
          id: 'c4_vsq_3',
          marks: 2,
          question: 'What is a debit balance?',
          answer: 'If the total of the debit side of an account is greater than the total of its credit side, the net balancing figure is called a debit balance.'
        },
        {
          id: 'c4_vsq_4',
          marks: 2,
          question: 'What is a credit balance?',
          answer: 'If the total of the credit side of an account is higher than the debit side, the balancing figure is called a credit balance.'
        },
        {
          id: 'c4_vsq_5',
          marks: 2,
          question: 'What is balancing of an account?',
          answer: 'Balancing means calculating the difference between debit and credit totals and entering it on the lesser side as "Balance c/d" so both sides equalize.'
        }
      ],
      shortQuestions: [
        {
          id: 'c4_sq_1',
          marks: 3,
          question: 'Explain the utilities of maintaining a ledger.',
          answer: [
            '1. Quick information: Get instant financial position of any individual customer, supplier, or asset.',
            '2. Control: Helps management analyze balances and exercise control over operations.',
            '3. Prepares Trial Balance: Ledger balances form the direct input for testing arithmetical accuracy.',
            '4. Facilitates Final Accounts: Necessary for compiling the Trading, Profit & Loss A/c and Balance Sheet.'
          ]
        },
        {
          id: 'c4_sq_2',
          marks: 3,
          question: 'How is posting made from the journal to the ledger?',
          answer: [
            '1. Locate the debited account in the ledger and go to its Debit side. Record the date, write "To [Credited Account Name]" and enter the debit amount.',
            '2. Locate the credited account in the ledger and go to its Credit side. Record the date, write "By [Debited Account Name]" and enter the credit amount.'
          ]
        },
        {
          id: 'c4_sq_3',
          marks: 3,
          question: 'Explain the procedure for balancing a ledger account.',
          answer: '1. Total debit and credit columns separately.\n2. Ascertain the difference.\n3. Put difference on the shorter side as "To/By Balance c/d".\n4. Write the matching totals on both sides.\n5. Bring down the balance to the opposite side as "To/By Balance b/d" on the next opening date.'
        }
      ],
      longQuestions: [
        {
          id: 'c4_lq_1',
          marks: 5,
          question: 'Distinguish between Journal and Ledger.',
          answer: 'Master comparison across 7 parameters.',
          table: {
            headers: ['Basis', 'Journal (Book of Prime Entry)', 'Ledger (Principal Book)'],
            rows: [
              ['Recording Order', 'Chronological order (date-wise as it happens)', 'Analytical / Account-wise order'],
              ['Stage of Accounting', 'First stage (original entry)', 'Second stage (final / secondary entry)'],
              ['Process Name', 'Recording is called Journalizing', 'Recording is called Posting'],
              ['Basis of Information', 'Based on source documents (vouchers, invoices)', 'Based on recorded journal entries'],
              ['Trial Balance', 'Cannot be prepared directly from journal', 'Directly prepared from ledger balances'],
              ['Net Position', 'Cannot ascertain net balance of an individual head', 'Provides immediate net balance of any head'],
              ['Page Reference', 'Ledger Folio (L.F.) column is maintained', 'Journal Folio (J.F.) column is maintained']
            ]
          }
        }
      ]
    },

    // CHAPTER 5
    {
      chapterNumber: 5,
      title: 'Trial Balance',
      tagline: 'Summary Statement, Arithmetical Accuracy & Suspense Account',
      mcqs: [
        {
          id: 'c5_mcq_1',
          question: 'Trial balance is a:',
          options: ['(a) Statement', '(b) Account', '(c) Ledger', '(d) Journal'],
          correctIndex: 0,
          answerText: '(a) Statement',
          explanation: 'A Trial Balance is a statement of balances extracted from ledger accounts, not an account itself.'
        },
        {
          id: 'c5_mcq_2',
          question: 'After the preparation of ledger, the next step is the preparation of:',
          options: ['(a) Trading account', '(b) Trial balance', '(c) Journal', '(d) Profit and loss account'],
          correctIndex: 1,
          answerText: '(b) Trial balance',
          explanation: 'Trial balance summarizes all ledger balances before final accounts.'
        },
        {
          id: 'c5_mcq_3',
          question: 'The trial balance contains the balances of:',
          options: ['(a) Only personal accounts', '(b) Only real accounts', '(c) Only nominal accounts', '(d) All accounts'],
          correctIndex: 3,
          answerText: '(d) All accounts',
          explanation: 'It contains balances of Personal, Real, and Nominal accounts.'
        },
        {
          id: 'c5_mcq_4',
          question: 'While preparing the trial balance, the credit total is short by ₹200. This difference will be:',
          options: [
            '(a) Debited to suspense account',
            '(b) Credited to suspense account',
            '(c) Adjusted to any debit balance',
            '(d) Adjusted to any credit balance'
          ],
          correctIndex: 1,
          answerText: '(b) Credited to suspense account',
          explanation: 'The shortfall on the credit side is placed on the credit side of the Suspense Account.'
        },
        {
          id: 'c5_mcq_5',
          question: 'The account which has a debit balance and is shown in the debit column of the trial balance is:',
          options: ['(a) Sundry creditors account', '(b) Bills payable account', '(c) Drawings account', '(d) Capital account'],
          correctIndex: 2,
          answerText: '(c) Drawings account',
          explanation: 'Drawings represents money withdrawn by the owner and always has a debit balance.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c5_vsq_1',
          marks: 2,
          question: 'What is a trial balance?',
          answer: '“A trial balance is a statement, prepared with the debit and credit balances of the ledger accounts to test the arithmetical accuracy of the books.” — J.R. Batliboi'
        },
        {
          id: 'c5_vsq_2',
          marks: 2,
          question: 'What are the methods of preparing a trial balance?',
          answer: '1. Balance method (most popular)\n2. Total method\n3. Total and Balance method'
        },
        {
          id: 'c5_vsq_3',
          marks: 2,
          question: 'State debit or credit for: Carriage outwards, Sales, Capital, Drawings, Bad debts, Purchase returns.',
          answer: 'Debit: Carriage outwards, Drawings, Bad debts.\nCredit: Sales, Capital, Purchase returns.'
        }
      ],
      shortQuestions: [
        {
          id: 'c5_sq_1',
          marks: 3,
          question: 'What are the objectives of preparing a trial balance?',
          answer: [
            '1. Test of arithmetical accuracy: Confirms every debit has an equal credit.',
            '2. Basis for final accounts: Provides summary data for Trading, P&L, and Balance Sheet.',
            '3. Location of errors: Discloses mathematical discrepancies and omission of single-sided postings.'
          ]
        },
        {
          id: 'c5_sq_2',
          marks: 3,
          question: 'What are the limitations of a trial balance?',
          answer: [
            '1. Can only be prepared under the double entry system.',
            '2. Complete omission of a transaction will not cause disagreement.',
            '3. Errors of principle and compensating errors do not affect the tally of a trial balance.'
          ]
        },
        {
          id: 'c5_sq_3',
          marks: 3,
          question: '‘A trial balance is only prima facie evidence of arithmetical accuracy’. Do you agree? Why?',
          answer: 'Yes, agreed. An agreed trial balance only proves that debit totals equal credit totals. It does NOT prove that transactions were entered into correct accounts, or that no transactions were completely omitted, or that fundamental accounting principles were strictly obeyed.'
        }
      ],
      longQuestions: [
        {
          id: 'c5_lq_1',
          marks: 5,
          question: 'Distinguish between Trial Balance and Balance Sheet.',
          answer: 'Master comparison across key parameters.',
          table: {
            headers: ['Basis', 'Trial Balance', 'Balance Sheet'],
            rows: [
              ['Nature', 'Statement of ledger balances on a given date', 'Statement of assets and liabilities on a given date'],
              ['Purpose', 'To verify arithmetical accuracy of ledger posting', 'To ascertain true financial position of business'],
              ['Contents', 'Contains all personal, real, and nominal accounts', 'Contains only personal and real accounts'],
              ['Order of Items', 'Order is not compulsory', 'Arranged strictly by Liquidity or Permanence'],
              ['Compulsion', 'Not legally compulsory', 'Legally compulsory for companies and regulated firms'],
              ['Stage', 'Prepared before Trading & P&L A/c', 'Prepared after Trading & P&L A/c as the final statement']
            ]
          }
        }
      ],
      formatsAndTables: [
        {
          title: '37-Item Master Trial Balance Standard Format (Debit vs Credit Classifications)',
          description: 'Comprehensive pro-forma list of all 37 recurring commercial ledger balance heads.',
          columns: ['S.No.', 'Ledger Head', 'Debit / Credit', 'Classification Nature'],
          data: [
            { no: 1, head: 'Cash in hand', side: 'Debit', type: 'Current Asset' },
            { no: 2, head: 'Cash at bank', side: 'Debit', type: 'Current Asset' },
            { no: 3, head: 'Bills receivable', side: 'Debit', type: 'Current Asset' },
            { no: 4, head: 'Sundry debtors', side: 'Debit', type: 'Current Asset' },
            { no: 5, head: 'Opening stock', side: 'Debit', type: 'Trading Inventory' },
            { no: 6, head: 'Plant and Machinery', side: 'Debit', type: 'Fixed Asset' },
            { no: 7, head: 'Land and Building (Premises)', side: 'Debit', type: 'Fixed Asset' },
            { no: 8, head: 'Furniture and Fixtures', side: 'Debit', type: 'Fixed Asset' },
            { no: 9, head: 'Vehicles', side: 'Debit', type: 'Fixed Asset' },
            { no: 10, head: 'Goodwill', side: 'Debit', type: 'Intangible Asset' },
            { no: 11, head: 'Investment', side: 'Debit', type: 'Non-Current Asset' },
            { no: 12, head: 'Drawings', side: 'Debit', type: 'Owner Equity Reduction' },
            { no: 13, head: 'Purchases', side: 'Debit', type: 'Direct Expense' },
            { no: 14, head: 'Sales returns (Return inward)', side: 'Debit', type: 'Revenue Deduction' },
            { no: 15, head: 'Carriage inwards', side: 'Debit', type: 'Direct Expense' },
            { no: 16, head: 'Carriage outwards', side: 'Debit', type: 'Indirect Expense' },
            { no: 17, head: 'Rent paid', side: 'Debit', type: 'Indirect Expense' },
            { no: 18, head: 'Commission paid', side: 'Debit', type: 'Indirect Expense' },
            { no: 19, head: 'Interest paid', side: 'Debit', type: 'Finance Expense' },
            { no: 20, head: 'Bad debts', side: 'Debit', type: 'Operating Loss' },
            { no: 21, head: 'Insurance premium', side: 'Debit', type: 'Indirect Expense' },
            { no: 22, head: 'General expenses', side: 'Debit', type: 'Indirect Expense' },
            { no: 23, head: 'Sundry expenses', side: 'Debit', type: 'Indirect Expense' },
            { no: 24, head: 'Electricity charges', side: 'Debit', type: 'Indirect Expense' },
            { no: 25, head: 'Selling expenses', side: 'Debit', type: 'Indirect Expense' },
            { no: 26, head: 'Travelling expenses', side: 'Debit', type: 'Indirect Expense' },
            { no: 27, head: 'Wages', side: 'Debit', type: 'Direct Manufacturing Expense' },
            { no: 28, head: 'Sales', side: 'Credit', type: 'Operating Revenue' },
            { no: 29, head: 'Purchases returns (Return outward)', side: 'Credit', type: 'Cost Deduction' },
            { no: 30, head: 'Capital', side: 'Credit', type: 'Owner Equity' },
            { no: 31, head: 'Bank loan', side: 'Credit', type: 'Long-term Liability' },
            { no: 32, head: 'Sundry creditors', side: 'Credit', type: 'Current Liability' },
            { no: 33, head: 'Bills payable', side: 'Credit', type: 'Current Liability' },
            { no: 34, head: 'Bank overdraft', side: 'Credit', type: 'Current Liability' },
            { no: 35, head: 'Rent received', side: 'Credit', type: 'Indirect Income' },
            { no: 36, head: 'Interest received', side: 'Credit', type: 'Indirect Income' },
            { no: 37, head: 'Provision for bad debts', side: 'Credit', type: 'Provision / Valuation Allowance' }
          ]
        }
      ]
    },

    // CHAPTER 6
    {
      chapterNumber: 6,
      title: 'Subsidiary Books - I',
      tagline: 'Purchases Book, Sales Book, Returns, Debit/Credit Notes & Bills',
      mcqs: [
        {
          id: 'c6_mcq_1',
          question: 'Purchases book is used to record:',
          options: ['(a) All purchases of goods', '(b) All credit purchases of assets', '(c) All credit purchases of goods', '(d) All purchases of assets'],
          correctIndex: 2,
          answerText: '(c) All credit purchases of goods',
          explanation: 'Only credit purchases of trade goods are recorded in the Purchases Book.'
        },
        {
          id: 'c6_mcq_2',
          question: 'A periodic total of the purchases book is posted to the:',
          options: [
            '(a) Debit side of the purchases account',
            '(b) Debit side of the sales account',
            '(c) Credit side of the purchases account',
            '(d) Credit side of the sales account'
          ],
          correctIndex: 0,
          answerText: '(a) Debit side of the purchases account',
          explanation: 'Purchases account is debited with the total of credit purchases.'
        },
        {
          id: 'c6_mcq_3',
          question: 'The source document used for recording entries in sales book is:',
          options: ['(a) Debit note', '(b) Credit note', '(c) Invoice', '(d) Cash receipt'],
          correctIndex: 2,
          answerText: '(c) Invoice',
          explanation: 'Outward sales invoice is sent to the customer upon credit sales.'
        },
        {
          id: 'c6_mcq_4',
          question: 'Purchases of fixed assets on credit basis is recorded in:',
          options: ['(a) Purchases book', '(b) Sales book', '(c) Purchases returns book', '(d) Journal proper'],
          correctIndex: 3,
          answerText: '(d) Journal proper',
          explanation: 'Only trade merchandise goes to Purchases Book; fixed assets bought on credit go to Journal Proper.'
        },
        {
          id: 'c6_mcq_5',
          question: 'Which of the following statements is NOT true?',
          options: [
            '(a) Cash discount is recorded in the books of accounts',
            '(b) Assets purchased on credit are recorded in journal proper',
            '(c) Trade discount is recorded in the books of accounts',
            '(d) 3 grace days are added while determining the due date of a bill'
          ],
          correctIndex: 2,
          answerText: '(c) Trade discount is recorded in the books of accounts',
          explanation: 'Trade discount is deducted directly from catalog price on invoice and is NEVER recorded in books of account.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c6_vsq_1',
          marks: 2,
          question: 'Mention four types of subsidiary books.',
          answer: '1. Purchases Book\n2. Sales Book\n3. Purchases Returns Book\n4. Sales Returns Book\n(Also: Cash Book, Bills Receivable Book, Bills Payable Book, Journal Proper).'
        },
        {
          id: 'c6_vsq_2',
          marks: 2,
          question: 'What is a Debit Note?',
          answer: 'A Debit Note is a document sent by a buyer to the supplier when returning defective/excess goods, informing that the supplier’s account has been debited.'
        },
        {
          id: 'c6_vsq_3',
          marks: 2,
          question: 'What is a Credit Note?',
          answer: 'A Credit Note is a statement issued by a seller to a customer when goods are received back, acknowledging that customer’s account has been credited.'
        },
        {
          id: 'c6_vsq_4',
          marks: 2,
          question: 'What is Journal Proper?',
          answer: 'Journal Proper is a residuary subsidiary book used to record transactions that cannot be entered in any other special subsidiary book (e.g. opening entries, adjustment entries, rectification entries, credit purchase/sale of fixed assets).'
        },
        {
          id: 'c6_vsq_5',
          marks: 2,
          question: 'Define Bill of Exchange.',
          answer: '“It is an instrument in writing containing an unconditional order, signed by the maker, directing a certain person to pay a certain sum of money only to, or to the bearer of the instrument.” — Negotiable Instruments Act, 1881'
        }
      ],
      shortQuestions: [
        {
          id: 'c6_sq_1',
          marks: 3,
          question: 'Mention which subsidiary books record the following transactions:',
          answer: [
            '(i) Sale of goods for cash -> Cash Book',
            '(ii) Sale of goods on credit -> Sales Book',
            '(iii) Purchases of goods on credit -> Purchases Book',
            '(iv) Proprietor takes goods for personal use -> Journal Proper',
            '(v) Goods returned to suppliers for which cash is not immediately received -> Purchases Returns Book',
            '(vi) Asset purchased on credit -> Journal Proper'
          ]
        },
        {
          id: 'c6_sq_2',
          marks: 3,
          question: 'What are the advantages of maintaining subsidiary books?',
          answer: [
            '1. Proper and systematic record: Grouped conveniently by nature.',
            '2. Division of work: Multiple clerks can work simultaneously on different day books.',
            '3. Convenient posting: Direct periodic totals can be posted to control accounts.',
            '4. Quick reference and fraud reduction: Prevents voluminous clutter in the journal.'
          ]
        },
        {
          id: 'c6_sq_3',
          marks: 3,
          question: 'Write short notes on: (a) Endorsement of a bill, (b) Discounting of a bill.',
          answer: [
            '(a) Endorsement: Signing on the back of the bill of exchange to transfer its legal title to another person (Endorser transfers to Endorsee).',
            '(b) Discounting: Encashing the bill with a commercial bank before its maturity date; the bank deducts a small finance charge (discount) and pays the net balance in cash immediately.'
          ]
        }
      ],
      longQuestions: []
    },

    // CHAPTER 7
    {
      chapterNumber: 7,
      title: 'Subsidiary Books - II (Cash Book)',
      tagline: 'Single, Double, Triple Column, Petty Cash Imprest & Contra Entries',
      mcqs: [
        {
          id: 'c7_mcq_1',
          question: 'Cash book is a:',
          options: ['(a) Subsidiary book', '(b) Principal book', '(c) Journal proper', '(d) Both subsidiary book and principal book'],
          correctIndex: 3,
          answerText: '(d) Both subsidiary book and principal book',
          explanation: 'It records original transactions (subsidiary) and serves as the cash account itself (principal).'
        },
        {
          id: 'c7_mcq_2',
          question: 'Which of the following is recorded as a Contra Entry?',
          options: [
            '(a) Withdrew cash from bank for personal use',
            '(b) Withdrew cash from bank for office use',
            '(c) Direct payment by customer into bank account',
            '(d) Bank charges interest'
          ],
          correctIndex: 1,
          answerText: '(b) Withdrew cash from bank for office use',
          explanation: 'Cash comes in and Bank decreases; both sides of the Cash Book are impacted simultaneously.'
        },
        {
          id: 'c7_mcq_3',
          question: 'In a Triple Column Cash Book, bank overdraft brought forward will appear in:',
          options: ['(a) Cash column debit side', '(b) Cash column credit side', '(c) Bank column debit side', '(d) Bank column credit side'],
          correctIndex: 3,
          answerText: '(d) Bank column credit side',
          explanation: 'Overdraft is a liability and is shown on the credit side as "By Balance b/d".'
        },
        {
          id: 'c7_mcq_4',
          question: 'The balance in the petty cash book is:',
          options: ['(a) An expense', '(b) A profit', '(c) An asset', '(d) A liability'],
          correctIndex: 2,
          answerText: '(c) An asset',
          explanation: 'Unspent petty cash remaining in hand is a current asset.'
        },
        {
          id: 'c7_mcq_5',
          question: 'Cash account cannot have a credit balance because:',
          options: [
            '(a) It is prohibited by law',
            '(b) Actual cash payments cannot exceed available cash receipts',
            '(c) Bank overdraft is always available',
            '(d) None of the above'
          ],
          correctIndex: 1,
          answerText: '(b) Actual cash payments cannot exceed available cash receipts',
          explanation: 'You cannot pay more physical cash than what you hold.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c7_vsq_1',
          marks: 2,
          question: 'What is a Cash Book?',
          answer: 'A cash book is a book of prime entry in which all cash receipts and cash payments (and bank transactions) are systematically recorded in chronological order.'
        },
        {
          id: 'c7_vsq_2',
          marks: 2,
          question: 'What are the different types of Cash Book?',
          answer: '1. Single Column Cash Book (Cash only)\n2. Double Column Cash Book (Cash & Discount)\n3. Three Column Cash Book (Cash, Bank & Discount)\n4. Petty Cash Book'
        },
        {
          id: 'c7_vsq_3',
          marks: 2,
          question: 'What is Cash Discount?',
          answer: 'A reduction allowed to debtors to encourage prompt payment within a stipulated credit period. It is recorded in the books of accounts.'
        },
        {
          id: 'c7_vsq_4',
          marks: 2,
          question: 'What is Trade Discount?',
          answer: 'A percentage deduction given by a seller from catalog list price for bulk purchases. It is deducted on the invoice and NOT recorded in the books of accounts.'
        },
        {
          id: 'c7_vsq_5',
          marks: 2,
          question: 'What is the Imprest System of Petty Cash?',
          answer: 'Under the imprest system, a fixed sum (imprest money) is given to the petty cashier at the start of a period. At the end, the head cashier reimburses the exact total spent, restoring the original balance.'
        }
      ],
      shortQuestions: [
        {
          id: 'c7_sq_1',
          marks: 3,
          question: 'Briefly explain Contra Entry with an example.',
          answer: 'When a transaction affects both cash and bank accounts simultaneously, it is recorded on both the debit and credit sides of a Three Column Cash Book. To indicate this, "C" is marked in the L.F. column. Example: Deposited ₹10,000 cash into bank (Bank column debited, Cash column credited).'
        },
        {
          id: 'c7_sq_2',
          marks: 3,
          question: 'Write the advantages of maintaining a Petty Cash Book.',
          answer: [
            '1. Relieves main cashier from hundreds of minor payments.',
            '2. Better control and periodic auditing of small expenses.',
            '3. Avoids overcrowding in the main cash book.'
          ]
        }
      ],
      longQuestions: [
        {
          id: 'c7_lq_1',
          marks: 5,
          question: 'Bring out the differences between Cash Discount and Trade Discount.',
          answer: 'Comprehensive comparison table.',
          table: {
            headers: ['Basis of Distinction', 'Cash Discount', 'Trade Discount'],
            rows: [
              ['Primary Purpose', 'Allowed to encourage prompt or early cash payment', 'Allowed to encourage customers to buy goods in bulk/large quantities'],
              ['Time of Allowance', 'Allowed at the time of payment within credit term', 'Allowed at the time of sale/purchase on invoice'],
              ['Relation', 'Related to time of settlement', 'Related to quantity of goods bought'],
              ['Accounting Treatment', 'Recorded in books of account (Discount Allowed / Received)', 'NOT recorded in books of account; only net figure is entered'],
              ['Deduction from Invoice', 'Not deducted from invoice price directly', 'Deducted directly from the catalog/list price on invoice']
            ]
          }
        }
      ]
    },

    // CHAPTER 8
    {
      chapterNumber: 8,
      title: 'Bank Reconciliation Statement (BRS)',
      tagline: 'Timing Differences, Errors & Pro-forma Adjustment Schedule',
      mcqs: [
        {
          id: 'c8_mcq_1',
          question: 'A Bank Reconciliation Statement is prepared by:',
          options: ['(a) Bank', '(b) Business / Customer', '(c) Debtor to the business', '(d) Creditor to the business'],
          correctIndex: 1,
          answerText: '(b) Business / Customer',
          explanation: 'The trader/business accountant prepares the BRS to reconcile their cash book bank column with the passbook.'
        },
        {
          id: 'c8_mcq_2',
          question: 'Debit balance in the bank column of the cash book means:',
          options: [
            '(a) Credit balance as per bank statement (Favourable)',
            '(b) Debit balance as per bank statement',
            '(c) Overdraft as per cash book',
            '(d) None of the above'
          ],
          correctIndex: 0,
          answerText: '(a) Credit balance as per bank statement (Favourable)',
          explanation: 'A debit in cash book is an asset for the business, which represents a credit (liability/deposit) on the bank statement.'
        },
        {
          id: 'c8_mcq_3',
          question: 'Balance as per cash book is ₹2,000. Bank charge of ₹50 debited by bank is not yet in cash book. Pass book balance is:',
          options: ['(a) ₹1,950 credit balance', '(b) ₹1,950 debit balance', '(c) ₹2,050 debit balance', '(d) ₹2,050 credit balance'],
          correctIndex: 0,
          answerText: '(a) ₹1,950 credit balance',
          explanation: '₹2,000 - ₹50 = ₹1,950 favorable (credit) balance in the bank statement.'
        },
        {
          id: 'c8_mcq_4',
          question: 'Which of the following is NOT a timing difference in BRS?',
          options: [
            '(a) Cheque deposited but not yet credited',
            '(b) Cheque issued but not yet presented for payment',
            '(c) Amount directly paid into bank by customer',
            '(d) Wrong debit entered in the cash book'
          ],
          correctIndex: 3,
          answerText: '(d) Wrong debit entered in the cash book',
          explanation: 'Wrong debit is a clerical error, not a standard transit/timing delay.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c8_vsq_1',
          marks: 2,
          question: 'What is meant by bank overdraft?',
          answer: 'When a business withdraws more money than its actual bank balance under a sanctioned bank facility, it results in an overdrawn negative balance called bank overdraft.'
        },
        {
          id: 'c8_vsq_2',
          marks: 2,
          question: 'What is a Bank Reconciliation Statement?',
          answer: 'A Bank Reconciliation Statement (BRS) is a statement prepared periodically to identify, explain, and reconcile the differences between the bank balance as per the cash book and the balance as per the bank statement.'
        },
        {
          id: 'c8_vsq_3',
          marks: 2,
          question: 'State any two causes of disagreement between cash book and bank statement.',
          answer: '1. Cheques issued by business but not yet presented for payment.\n2. Cheques deposited into bank but not yet collected and credited.'
        },
        {
          id: 'c8_vsq_4',
          marks: 2,
          question: 'Why does money deposited into bank appear on the Debit side of cash book but Credit side of bank statement?',
          answer: 'For the business, bank balance is an Asset (debited). For the bank, money received from customer is a Liability owed back to the depositor (credited).'
        }
      ],
      shortQuestions: [
        {
          id: 'c8_sq_1',
          marks: 3,
          question: 'Give three reasons for preparing a Bank Reconciliation Statement.',
          answer: [
            '1. To identify delays in cheque clearance.',
            '2. To determine actual usable bank balance and avoid cheque bounce.',
            '3. To detect and discourage fraud, embezzlement, or clerical errors in accounts.'
          ]
        },
        {
          id: 'c8_sq_2',
          marks: 3,
          question: 'What is the effect of bank interest charged if the balance is an overdraft?',
          answer: 'If the account is in overdraft (negative balance), bank interest charged will further INCREASE the overdraft liability.'
        }
      ],
      longQuestions: [],
      formatsAndTables: [
        {
          title: 'Master Bank Reconciliation Statement Pro-Forma (Starting from Favourable Cash Book Balance)',
          description: 'Standard Add / Less operational framework for solving BRS sums in Class 11 Accountancy.',
          columns: ['Type', 'Transaction Details', 'Effect on Cash Book Balance'],
          data: [
            { type: 'Base', txn: 'Balance as per Cash Book (Debit / Favourable)', rule: 'Starting Point' },
            { type: 'ADD', txn: 'Cheques issued but not yet presented for payment at bank', rule: 'Bank balance is higher than cash book' },
            { type: 'ADD', txn: 'Interest credited / paid by bank (not recorded in cash book)', rule: 'Bank balance is higher' },
            { type: 'ADD', txn: 'Dividend / interest collected directly by bank', rule: 'Bank balance is higher' },
            { type: 'ADD', txn: 'Direct deposit by a customer into business bank account', rule: 'Bank balance is higher' },
            { type: 'ADD', txn: 'Any error undercasting credit or overcasting debit of pass book', rule: 'Adjusting discrepancy' },
            { type: 'LESS', txn: 'Cheques deposited into bank but not yet collected/credited', rule: 'Cash book is higher than bank passbook' },
            { type: 'LESS', txn: 'Cheques dishonoured and debited by bank but not in cash book', rule: 'Bank balance reduced' },
            { type: 'LESS', txn: 'Bank charges, commission or interest on overdraft debited by bank', rule: 'Bank balance reduced' },
            { type: 'LESS', txn: 'Insurance premium, rent, loan installments paid by bank as per standing instruction', rule: 'Bank balance reduced' },
            { type: 'LESS', txn: 'Direct debits or errors reducing passbook balance', rule: 'Bank balance reduced' },
            { type: 'RESULT', txn: 'Balance as per Bank Statement / Pass Book', rule: 'Target reconciled balance' }
          ]
        }
      ]
    },

    // CHAPTER 9
    {
      chapterNumber: 9,
      title: 'Rectification of Errors',
      tagline: 'Errors of Principle, Omission, Commission & Suspense Account',
      mcqs: [
        {
          id: 'c9_mcq_1',
          question: 'Error of principle arises when:',
          options: [
            '(a) There is complete omission of a transaction',
            '(b) There is partial omission of a transaction',
            '(c) Distinction is not made between capital and revenue items',
            '(d) There are wrong postings and wrong castings'
          ],
          correctIndex: 2,
          answerText: '(c) Distinction is not made between capital and revenue items',
          explanation: 'Treating capital expenditure as revenue expenditure (or vice versa) is an Error of Principle.'
        },
        {
          id: 'c9_mcq_2',
          question: 'Wages paid for installation of machinery wrongly debited to wages account is an error of:',
          options: ['(a) Partial omission', '(b) Principle', '(c) Complete omission', '(d) Duplication'],
          correctIndex: 1,
          answerText: '(b) Principle',
          explanation: 'Installation wages are capital expenditure that must be debited to Machinery A/c, not Wages A/c.'
        },
        {
          id: 'c9_mcq_3',
          question: 'Errors not affecting the agreement of trial balance are:',
          options: ['(a) Errors of principle', '(b) Errors of overcasting', '(c) Errors of undercasting', '(d) Errors of partial omission'],
          correctIndex: 0,
          answerText: '(a) Errors of principle',
          explanation: 'Errors of principle have equal debit and credit and do not disrupt trial balance agreement.'
        },
        {
          id: 'c9_mcq_4',
          question: 'The difference in trial balance is temporarily transferred to:',
          options: ['(a) The capital account', '(b) The trading account', '(c) The suspense account', '(d) The profit and loss account'],
          correctIndex: 2,
          answerText: '(c) The suspense account',
          explanation: 'Suspense Account holds one-sided discrepancies until errors are located and rectified.'
        },
        {
          id: 'c9_mcq_5',
          question: 'A credit purchase of furniture from Athiyaman was debited to purchases account. The rectifying entry debits:',
          options: ['(a) Purchases account', '(b) Athiyaman account', '(c) Furniture account', '(d) None of these'],
          correctIndex: 2,
          answerText: '(c) Furniture account',
          explanation: 'Furniture A/c Dr to Purchases A/c Cr. Furniture must be debited to correct the books.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c9_vsq_1',
          marks: 2,
          question: 'What is meant by rectification of errors?',
          answer: 'The systematic correction of accounting mistakes in the books of accounts by passing appropriate rectifying journal entries without erasing or overwriting figures.'
        },
        {
          id: 'c9_vsq_2',
          marks: 2,
          question: 'What is an Error of Principle?',
          answer: 'Mistake committed in violating fundamental accounting rules, especially confusing capital expenditure with revenue expenditure. Example: Recording repair of machinery as purchase of machinery, or installation wages in wages account.'
        },
        {
          id: 'c9_vsq_3',
          marks: 2,
          question: 'What are Compensating Errors?',
          answer: 'Errors where the effect of one mistake is counterbalanced or neutralized by one or more other mistakes of an equal amount on opposite sides.'
        },
        {
          id: 'c9_vsq_4',
          marks: 2,
          question: 'What is a Suspense Account?',
          answer: 'A temporary ledger account created to put the difference in an untallied trial balance so final accounts can proceed pending location and rectification of one-sided errors.'
        }
      ],
      shortQuestions: [
        {
          id: 'c9_sq_1',
          marks: 3,
          question: 'What are the errors NOT disclosed by a trial balance?',
          answer: [
            '1. Error of complete omission',
            '2. Error of principle',
            '3. Compensating errors',
            '4. Error of original entry (wrong amount entered in journal itself)',
            '5. Posting to wrong account on the correct side'
          ]
        },
        {
          id: 'c9_sq_2',
          marks: 3,
          question: 'What are the errors DISCLOSED by a trial balance?',
          answer: [
            '1. Wrong totaling / casting of subsidiary books.',
            '2. Wrong calculation of ledger balances.',
            '3. Partial omission of a transaction (posted to one account only).',
            '4. Posting an amount to the wrong side of an account.'
          ]
        },
        {
          id: 'c9_sq_3',
          marks: 3,
          question: 'Distinguish between One-sided errors and Two-sided errors.',
          answer: [
            'One-sided errors: Affect only one account and cause trial balance disagreement. Rectified using Suspense Account after trial balance.',
            'Two-sided errors: Affect two or more accounts with equal debit and credit impact. Do not affect trial balance tally. Rectified via journal entry.'
          ]
        }
      ],
      longQuestions: []
    },

    // CHAPTER 10
    {
      chapterNumber: 10,
      title: 'Depreciation Accounting',
      tagline: 'Straight Line vs Written Down Value Method & Calculation Formulas',
      mcqs: [
        {
          id: 'c10_mcq_1',
          question: 'Under Straight Line Method (SLM), the amount of annual depreciation is:',
          options: ['(a) Increasing every year', '(b) Decreasing every year', '(c) Constant for all the years', '(d) Fluctuating every year'],
          correctIndex: 2,
          answerText: '(c) Constant for all the years',
          explanation: 'Depreciation is calculated on initial cost and remains identical each year.'
        },
        {
          id: 'c10_mcq_2',
          question: 'If total charge of depreciation and maintenance cost are considered together, the method providing a uniform charge is:',
          options: ['(a) Straight line method', '(b) Diminishing balance / WDV method', '(c) Annuity method', '(d) Insurance policy method'],
          correctIndex: 1,
          answerText: '(b) Diminishing balance / WDV method',
          explanation: 'Higher depreciation + lower repairs in early years balances with lower depreciation + higher repairs in later years.'
        },
        {
          id: 'c10_mcq_3',
          question: 'Depreciation is caused by:',
          options: ['(a) Lapse of time', '(b) Usage / wear and tear', '(c) Obsolescence', '(d) All of the above'],
          correctIndex: 3,
          answerText: '(d) All of the above',
          explanation: 'Physical wear, passage of time, and technological obsolescence all cause depreciation.'
        },
        {
          id: 'c10_mcq_4',
          question: 'For which asset is the Depletion method adopted?',
          options: ['(a) Plant and machinery', '(b) Mines and quarries', '(c) Buildings', '(d) Trademark'],
          correctIndex: 1,
          answerText: '(b) Mines and quarries',
          explanation: 'Natural wasting assets (minerals, quarries, oil wells) deplete with extraction.'
        },
        {
          id: 'c10_mcq_5',
          question: 'Residual value of an asset means the amount it can fetch on sale at the:',
          options: ['(a) Beginning of useful life', '(b) End of useful life', '(c) Middle of useful life', '(d) None of these'],
          correctIndex: 1,
          answerText: '(b) End of useful life',
          explanation: 'Residual / scrap value is the estimated scrap realization at the end of economic life.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c10_vsq_1',
          marks: 2,
          question: 'What is meant by depreciation?',
          answer: '“Depreciation is the gradual and permanent decrease in the value of an asset from any cause.” — R.N. Carter\n“Depreciation is the measure of exhaustion of the effective life of an asset from any cause during a given period.” — Spicer and Pegler'
        },
        {
          id: 'c10_vsq_2',
          marks: 2,
          question: 'List out the various methods of calculating depreciation.',
          answer: '1. Straight Line Method (SLM)\n2. Written Down Value Method (WDV)\n3. Sum of Years of Digits Method\n4. Machine Hour Rate Method\n5. Depletion Method\n6. Annuity Method\n7. Sinking Fund Method\n8. Revaluation Method\n9. Insurance Policy Method'
        },
        {
          id: 'c10_vsq_3',
          marks: 2,
          question: 'Give the formulas for amount and rate of depreciation under Straight Line Method.',
          answer: [
            'Amount of Depreciation per year = (Original Cost of Asset - Scrap Value) / Estimated Useful Life in Years',
            'Rate of Depreciation (%) = (Amount of Depreciation per year / Original Cost) × 100'
          ]
        },
        {
          id: 'c10_vsq_4',
          marks: 2,
          question: 'What is the Sinking Fund Method?',
          answer: 'Under this method, annual depreciation is transferred to a dedicated Depreciation Fund and invested in external interest-bearing securities to generate exact cash for asset replacement when retired.'
        }
      ],
      shortQuestions: [
        {
          id: 'c10_sq_1',
          marks: 3,
          question: 'What are the main objectives of providing depreciation?',
          answer: [
            '1. To ascertain true profit or loss: Expenses must be matched against revenues.',
            '2. To present true and fair view of financial position: Assets are shown at true written-down values.',
            '3. To avail tax benefits: Depreciation is an allowable deduction under the Income Tax Act.',
            '4. To accumulate funds for asset replacement.'
          ]
        },
        {
          id: 'c10_sq_2',
          marks: 3,
          question: 'What are the causes of depreciation?',
          answer: [
            '1. Physical wear and tear from constant operational usage.',
            '2. Efflux of time (passage of time even without active use).',
            '3. Obsolescence due to technological innovations and inventions.',
            '4. Inadequacy due to scale expansion.',
            '5. Lack of proper maintenance.'
          ]
        }
      ],
      longQuestions: [
        {
          id: 'c10_lq_1',
          marks: 5,
          question: 'Distinguish between Straight Line Method (SLM) and Written Down Value (WDV) Method.',
          answer: 'Comprehensive 6-point board exam distinction table.',
          table: {
            headers: ['Basis of Distinction', 'Straight Line Method (SLM)', 'Written Down Value Method (WDV)'],
            rows: [
              ['Base of Calculation', 'Calculated on the Original Acquisition Cost of the asset', 'Calculated on the opening book balance (Written Down Value) each year'],
              ['Amount of Depreciation', 'Remains identical and constant throughout all years', 'Decreases continuously year after year'],
              ['Final Book Value', 'Book value can be reduced to absolute zero (or exact scrap value)', 'Book value never reaches absolute zero'],
              ['Computation of Rate', 'Easy and straightforward to calculate', 'Mathematically complex to compute'],
              ['Total Annual Charge (Depr + Repairs)', 'Increases as asset ages (fixed depreciation + rising repair bills)', 'Remains almost uniform (high depr + low repairs initially; low depr + high repairs later)'],
              ['Income Tax Acceptance', 'Generally not accepted by Indian Income Tax Authorities', 'Recognized and accepted under the Indian Income Tax Act'],
              ['Suitability', 'Suitable for patents, leases, furniture, where repairs are minimal', 'Suitable for plant, machinery, motor vehicles, where repairs increase with age']
            ]
          }
        }
      ]
    },

    // CHAPTER 11
    {
      chapterNumber: 11,
      title: 'Capital and Revenue Transactions',
      tagline: 'Capital Expenditure, Revenue Expenditure, Deferred Revenue & Receipts',
      mcqs: [
        {
          id: 'c11_mcq_1',
          question: 'Amount spent on increasing the seating capacity in a cinema hall is:',
          options: ['(a) Capital expenditure', '(b) Revenue expenditure', '(c) Deferred revenue expenditure', '(d) None of the above'],
          correctIndex: 0,
          answerText: '(a) Capital expenditure',
          explanation: 'It increases the permanent revenue-earning capacity of the cinema hall.'
        },
        {
          id: 'c11_mcq_2',
          question: 'Expenditure of ₹20,000 for trial run of a newly installed machinery is:',
          options: ['(a) Preliminary expense', '(b) Revenue expenditure', '(c) Capital expenditure', '(d) Deferred revenue expenditure'],
          correctIndex: 2,
          answerText: '(c) Capital expenditure',
          explanation: 'All expenses incurred to bring an asset to working condition prior to commercial operation are capital.'
        },
        {
          id: 'c11_mcq_3',
          question: 'Interest received on bank deposits is a:',
          options: ['(a) Capital receipt', '(b) Revenue receipt', '(c) Capital expenditure', '(d) Revenue expenditure'],
          correctIndex: 1,
          answerText: '(b) Revenue receipt',
          explanation: 'Interest is a regular recurring income from normal fund investments.'
        },
        {
          id: 'c11_mcq_4',
          question: 'Amount received from IDBI as a medium-term loan for working capital is a:',
          options: ['(a) Capital expenditure', '(b) Revenue expenditure', '(c) Revenue receipt', '(d) Capital receipt'],
          correctIndex: 3,
          answerText: '(d) Capital receipt',
          explanation: 'Loans create financial obligations and are non-recurring capital receipts.'
        },
        {
          id: 'c11_mcq_5',
          question: 'Pre-operative expenses are:',
          options: ['(a) Revenue expenditure', '(b) Prepaid revenue expenditure', '(c) Deferred revenue expenditure', '(d) Capital expenditure'],
          correctIndex: 3,
          answerText: '(d) Capital expenditure',
          explanation: 'Expenses incurred prior to the commencement of business operations are capital in nature.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c11_vsq_1',
          marks: 2,
          question: 'What is meant by Revenue Expenditure?',
          answer: 'Expenditure incurred for day-to-day operations or for maintaining the current earning capacity of the business. It is recurring and its benefit is exhausted within one accounting period (e.g., salaries, rent, repairs).'
        },
        {
          id: 'c11_vsq_2',
          marks: 2,
          question: 'What is Capital Expenditure?',
          answer: 'Expenditure incurred to acquire fixed assets, improve efficiency, or expand earning capacity, the benefits of which extend over multiple accounting periods. It is non-recurring.'
        },
        {
          id: 'c11_vsq_3',
          marks: 2,
          question: 'What is Capital Profit?',
          answer: 'Profit arising from the sale of fixed capital assets above book value/cost, or premium on issue of shares. It cannot be distributed as general dividend.'
        },
        {
          id: 'c11_vsq_4',
          marks: 2,
          question: 'What is Deferred Revenue Expenditure?',
          answer: 'Revenue expenditure by nature, the benefits of which will be enjoyed over several subsequent accounting periods (e.g., massive advertising campaign, heavy modernization costs).'
        }
      ],
      shortQuestions: [
        {
          id: 'c11_sq_1',
          marks: 3,
          question: 'Give two examples of Deferred Revenue Expenditure.',
          answer: '1. Massive advertising expenditure for launching a brand-new product line.\n2. Major restructuring and structural overhaul of plant and machinery.'
        }
      ],
      longQuestions: [
        {
          id: 'c11_lq_1',
          marks: 5,
          question: 'Distinguish between Capital Expenditure and Revenue Expenditure.',
          answer: 'Core distinction table.',
          table: {
            headers: ['Basis', 'Capital Expenditure', 'Revenue Expenditure'],
            rows: [
              ['Nature', 'Non-recurring in nature', 'Recurring in nature'],
              ['Benefit Period', 'Spans multiple future accounting periods', 'Exhausted within the current accounting period'],
              ['Impact on Earning', 'Increases the revenue-earning capacity of business', 'Maintains the existing revenue-earning capacity'],
              ['Accounting Treatment', 'Shown on the Assets side of the Balance Sheet', 'Debited to Trading or Profit and Loss Account'],
              ['Examples', 'Purchase of machinery, building extension, installation costs', 'Wages, salaries, factory rent, routine repairs']
            ]
          }
        },
        {
          id: 'c11_lq_2',
          marks: 5,
          question: 'Distinguish between Capital Receipt and Revenue Receipt.',
          answer: 'Core distinction table.',
          table: {
            headers: ['Basis', 'Capital Receipt', 'Revenue Receipt'],
            rows: [
              ['Nature', 'Non-recurring in nature', 'Recurring in nature'],
              ['Amount Size', 'Substantial and large amount', 'Comparatively smaller amount'],
              ['Profit Distribution', 'Not available for distribution as operational profits', 'Available for distribution as operational profits'],
              ['Accounting Treatment', 'Appears on Liabilities side or deduction from assets in Balance Sheet', 'Credited to Trading or Profit & Loss Account'],
              ['Examples', 'Capital introduced by owner, bank loan borrowed, sale of machinery', 'Sales revenue, interest on investments, rent earned, commission received']
            ]
          }
        }
      ]
    },

    // CHAPTER 12
    {
      chapterNumber: 12,
      title: 'Final Accounts - I (Without Adjustments)',
      tagline: 'Trading Account, Profit & Loss Account, Marshalling of Balance Sheet',
      mcqs: [
        {
          id: 'c12_mcq_1',
          question: 'Closing stock is an item of:',
          options: ['(a) Fixed asset', '(b) Current asset', '(c) Fictitious asset', '(d) Intangible asset'],
          correctIndex: 1,
          answerText: '(b) Current asset',
          explanation: 'Closing inventory can be converted to cash within the operating cycle.'
        },
        {
          id: 'c12_mcq_2',
          question: 'Balance sheet is:',
          options: ['(a) An account', '(b) A statement', '(c) Neither a statement nor an account', '(d) None of the above'],
          correctIndex: 1,
          answerText: '(b) A statement',
          explanation: 'It has no "To" or "By" debit/credit columns; it is a statement of assets and liabilities.'
        },
        {
          id: 'c12_mcq_3',
          question: 'Net profit of the business increases the:',
          options: ['(a) Drawings', '(b) Receivables', '(c) Debts', '(d) Capital'],
          correctIndex: 3,
          answerText: '(d) Capital',
          explanation: 'Net profit is transferred and added to owner’s capital.'
        },
        {
          id: 'c12_mcq_4',
          question: 'Carriage inwards will be shown:',
          options: ['(a) In the trading account', '(b) In the profit and loss account', '(c) On liabilities side', '(d) On assets side'],
          correctIndex: 0,
          answerText: '(a) In the trading account',
          explanation: 'Carriage on raw materials/purchases is a direct expense.'
        },
        {
          id: 'c12_mcq_5',
          question: 'Drawings appearing in the trial balance is:',
          options: [
            '(a) Added to purchases',
            '(b) Subtracted from purchases',
            '(c) Added to capital',
            '(d) Subtracted from capital on the balance sheet'
          ],
          correctIndex: 3,
          answerText: '(d) Subtracted from capital on the balance sheet',
          explanation: 'Drawings reduces the net equity of the proprietor.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c12_vsq_1',
          marks: 2,
          question: 'Write a note on Trading Account.',
          answer: 'The Trading Account ascertains the gross result of buying and selling merchandise. It determines Gross Profit or Gross Loss by comparing Net Sales with the Cost of Goods Sold.'
        },
        {
          id: 'c12_vsq_2',
          marks: 2,
          question: 'What are Wasting Assets?',
          answer: 'Assets that get exhausted or depleted gradually in the process of excavation or extraction. Examples: Mines, oil wells, quarries.'
        },
        {
          id: 'c12_vsq_3',
          marks: 2,
          question: 'What are Fixed Assets?',
          answer: '“Fixed assets are assets of a relatively permanent nature used in the operations of business and not intended for sale.” — Finney and Miller'
        },
        {
          id: 'c12_vsq_4',
          marks: 2,
          question: 'Name two Direct Expenses and two Indirect Expenses.',
          answer: 'Direct Expenses: Wages, Carriage Inwards, Freight.\nIndirect Expenses: Office Salaries, Carriage Outwards, Rent & Rates.'
        }
      ],
      shortQuestions: [
        {
          id: 'c12_sq_1',
          marks: 3,
          question: 'What is meant by Closing Entries? Why are they passed?',
          answer: 'Closing entries are passed in Journal Proper at the end of the accounting year to close all nominal accounts (revenues, expenses, purchases, sales) by transferring their balances to Trading and Profit & Loss Account.'
        },
        {
          id: 'c12_sq_2',
          marks: 3,
          question: 'What are Gross Profit and Net Profit formulas?',
          answer: '• Gross Profit = Net Sales - Cost of Goods Sold (COGS)\n• COGS = Opening Stock + Net Purchases + Direct Expenses - Closing Stock\n• Net Profit = Gross Profit + Indirect Incomes - Operating & Indirect Expenses'
        },
        {
          id: 'c12_sq_3',
          marks: 3,
          question: 'What is meant by Grouping and Marshalling of assets and liabilities?',
          answer: 'Marshalling is arranging assets and liabilities in a specific structured order in the Balance Sheet. Two orders: (1) Order of Liquidity (most liquid cash first), (2) Order of Permanence (fixed permanent assets like land first).'
        }
      ],
      longQuestions: [],
      formatsAndTables: [
        {
          title: 'Master Trading & Profit and Loss Account Standard Format',
          description: 'Standard pro-forma format for Dr and Cr sides.',
          columns: ['Particulars (Dr)', 'Amount (₹)', 'Particulars (Cr)', 'Amount (₹)'],
          data: [
            { dr: 'To Opening stock', drAmt: 'xxx', cr: 'By Sales (less returns)', crAmt: 'xxx' },
            { dr: 'To Purchases (less returns)', drAmt: 'xxx', cr: 'By Closing stock', crAmt: 'xxx' },
            { dr: 'To Direct expenses (Wages, Carriage inward, Octroi, Duty)', drAmt: 'xxx', cr: 'By Gross Loss c/d (if any)', crAmt: 'xxx' },
            { dr: 'To Gross Profit c/d (transferred to P&L)', drAmt: 'xxx', cr: '---', crAmt: '---' },
            { dr: 'To Administrative Expenses (Salaries, Rent, Legal, Audit)', drAmt: 'xxx', cr: 'By Gross Profit b/d', crAmt: 'xxx' },
            { dr: 'To Selling & Dist. Expenses (Advt, Commission, Bad debts)', drAmt: 'xxx', cr: 'By Indirect Incomes (Discount, Rent, Interest)', crAmt: 'xxx' },
            { dr: 'To Other Losses (Depreciation, Repairs, Bank charges)', drAmt: 'xxx', cr: 'By Net Loss (transferred to Capital)', crAmt: 'xxx' },
            { dr: 'To Net Profit (transferred to Capital A/c in Balance Sheet)', drAmt: 'xxx', cr: '---', crAmt: '---' }
          ]
        }
      ]
    },

    // CHAPTER 13
    {
      chapterNumber: 13,
      title: 'Final Accounts - II (With Adjustments)',
      tagline: '15 Master Adjustments, Accruals, Prepayments, Bad Debts & Provisions',
      mcqs: [
        {
          id: 'c13_mcq_1',
          question: 'Prepayment of insurance premium appearing in adjustments will appear in:',
          options: [
            '(a) The trading account on debit side',
            '(b) The profit and loss account on credit side only',
            '(c) Deducted from insurance in P&L and shown on Assets side of Balance Sheet',
            '(d) Liabilities side only'
          ],
          correctIndex: 2,
          answerText: '(c) Deducted from insurance in P&L and shown on Assets side of Balance Sheet',
          explanation: 'Adjustments outside trial balance have two-fold impact: deducted from expense in P&L and shown as Current Asset.'
        },
        {
          id: 'c13_mcq_2',
          question: 'Net profit earned during the year is:',
          options: ['(a) Debited to capital account', '(b) Credited to capital account', '(c) Debited to drawings', '(d) Credited to drawings'],
          correctIndex: 1,
          answerText: '(b) Credited to capital account',
          explanation: 'Net profit increases capital and is added (credited) to Capital.'
        },
        {
          id: 'c13_mcq_3',
          question: 'Accrued interest on investment will be shown:',
          options: [
            '(a) On credit side of P&L account',
            '(b) On assets side of Balance Sheet',
            '(c) Both (a) and (b)',
            '(d) None of these'
          ],
          correctIndex: 2,
          answerText: '(c) Both (a) and (b)',
          explanation: 'Added to interest income in P&L credit side and recorded as an asset in Balance Sheet.'
        },
        {
          id: 'c13_mcq_4',
          question: 'If there is no existing provision, provision created for doubtful debts is:',
          options: [
            '(a) Debited to bad debts account',
            '(b) Debited to sundry debtors account',
            '(c) Credited to bad debts account',
            '(d) Debited to Profit and Loss account'
          ],
          correctIndex: 3,
          answerText: '(d) Debited to Profit and Loss account',
          explanation: 'Profit and Loss A/c Dr to Provision for Doubtful Debts A/c.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c13_vsq_1',
          marks: 2,
          question: 'What are Adjusting Entries?',
          answer: 'Entries recorded at the end of the accounting period in the Journal Proper to incorporate unrecorded transactions, outstanding liabilities, accrued incomes, prepayments, or provisions to ascertain true operational results.'
        },
        {
          id: 'c13_vsq_2',
          marks: 2,
          question: 'What is an Outstanding Expense?',
          answer: 'An expense that has been incurred during the current accounting period and is due for payment, but remains unpaid at period end. It is treated as a current liability.'
        },
        {
          id: 'c13_vsq_3',
          marks: 2,
          question: 'What is a Prepaid Expense?',
          answer: 'An expenditure paid for in advance in the current accounting period for benefits to be consumed in future accounting periods. It is treated as a current asset.'
        },
        {
          id: 'c13_vsq_4',
          marks: 2,
          question: 'What is Provision for Doubtful Debts?',
          answer: 'An amount set aside as a charge against current profit to meet estimated anticipated losses arising from bad debts among existing trade debtors in the succeeding year.'
        }
      ],
      shortQuestions: [
        {
          id: 'c13_sq_1',
          marks: 3,
          question: 'Explain how Closing Stock is treated in final accounts.',
          answer: '1. If given in adjustments outside trial balance: Credited to Trading Account AND shown as a Current Asset in Balance Sheet.\n2. If given inside trial balance: Shown ONLY on the Assets side of Balance Sheet.'
        },
        {
          id: 'c13_sq_2',
          marks: 3,
          question: 'Give the adjusting entries for: (i) Interest on Capital, (ii) Interest on Drawings.',
          answer: [
            '(i) Interest on Capital:\nInterest on Capital A/c Dr\n  To Capital A/c Cr\n(Debited to P&L A/c and added to Capital in Balance Sheet)',
            '(ii) Interest on Drawings:\nCapital A/c Dr (or Drawings A/c Dr)\n  To Interest on Drawings A/c Cr\n(Credited to P&L A/c and deducted from Capital in Balance Sheet)'
          ]
        }
      ],
      longQuestions: [],
      formatsAndTables: [
        {
          title: 'Master 15 Adjustments Reference Chart (Journal Entries & Final Accounts Treatment)',
          description: 'The complete two-fold accounting treatment matrix from the study material.',
          columns: ['S.No.', 'Adjustment Name', 'Journal Entry', 'Trading & P/L Account Treatment', 'Balance Sheet Treatment'],
          data: [
            {
              no: 1,
              name: 'Closing Stock',
              entry: 'Closing Stock A/c Dr\n  To Trading A/c',
              pl: 'Credited to Trading Account',
              bs: 'Shown on Assets side as Current Asset'
            },
            {
              no: 2,
              name: 'Outstanding Expenses',
              entry: 'Concerned Expense A/c Dr\n  To Outstanding Expense A/c',
              pl: 'Added to concerned expense (Debit side)',
              bs: 'Shown on Liabilities side as Current Liability'
            },
            {
              no: 3,
              name: 'Prepaid Expenses',
              entry: 'Prepaid Expense A/c Dr\n  To Concerned Expense A/c',
              pl: 'Deducted from concerned expense (Debit side)',
              bs: 'Shown on Assets side as Current Asset'
            },
            {
              no: 4,
              name: 'Accrued Income',
              entry: 'Accrued Income A/c Dr\n  To Concerned Income A/c',
              pl: 'Added to concerned income (Credit side)',
              bs: 'Shown on Assets side as Current Asset'
            },
            {
              no: 5,
              name: 'Income Received in Advance',
              entry: 'Concerned Income A/c Dr\n  To Income Received in Advance A/c',
              pl: 'Deducted from concerned income (Credit side)',
              bs: 'Shown on Liabilities side as Current Liability'
            },
            {
              no: 6,
              name: 'Interest on Capital',
              entry: 'Interest on Capital A/c Dr\n  To Capital A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Added to Capital on Liabilities side'
            },
            {
              no: 7,
              name: 'Interest on Drawings',
              entry: 'Capital A/c Dr\n  To Interest on Drawings A/c',
              pl: 'Credited to Profit and Loss A/c',
              bs: 'Deducted from Capital on Liabilities side'
            },
            {
              no: 8,
              name: 'Interest on Loan Outstanding',
              entry: 'Interest on Loan A/c Dr\n  To Outstanding Interest A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Added to Loan on Liabilities side'
            },
            {
              no: 9,
              name: 'Interest on Investment Accrued',
              entry: 'Accrued Interest A/c Dr\n  To Interest on Investment A/c',
              pl: 'Credited to Profit and Loss A/c',
              bs: 'Added to Investments or shown as Current Asset'
            },
            {
              no: 10,
              name: 'Depreciation on Fixed Assets',
              entry: 'Depreciation A/c Dr\n  To Concerned Fixed Asset A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Deducted from specific Asset on Assets side'
            },
            {
              no: 11,
              name: 'Bad Debts (New / Further)',
              entry: 'Bad Debts A/c Dr\n  To Sundry Debtors A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Deducted from Sundry Debtors on Assets side'
            },
            {
              no: 12,
              name: 'Provision for Bad & Doubtful Debts',
              entry: 'Profit and Loss A/c Dr\n  To Provision for Doubtful Debts A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Deducted from Sundry Debtors (after further bad debts)'
            },
            {
              no: 13,
              name: 'Provision for Discount on Debtors',
              entry: 'Profit and Loss A/c Dr\n  To Provision for Discount on Debtors A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Deducted from Sundry Debtors (after doubtful debts provision)'
            },
            {
              no: 14,
              name: 'Income Tax Paid by Proprietor',
              entry: 'Drawings A/c Dr\n  To Bank / Cash A/c',
              pl: 'Not shown in P&L (personal tax of owner)',
              bs: 'Deducted as Drawings from Capital on Liabilities side'
            },
            {
              no: 15,
              name: 'Manager’s Commission on Net Profit',
              entry: 'Manager’s Commission A/c Dr\n  To Outstanding Commission A/c',
              pl: 'Debited to Profit and Loss A/c',
              bs: 'Shown on Liabilities side as Current Liability'
            }
          ]
        }
      ]
    },

    // CHAPTER 14
    {
      chapterNumber: 14,
      title: 'Computerized Accounting System (CAS)',
      tagline: 'Software Types, Coding Architectures & MIS Reports',
      mcqs: [
        {
          id: 'c14_mcq_1',
          question: 'In accounting, computer is commonly used in:',
          options: ['(a) Recording business transactions', '(b) Payroll accounting', '(c) Stores accounting', '(d) All of the above'],
          correctIndex: 3,
          answerText: '(d) All of the above',
          explanation: 'Computers handle bookkeeping, payroll, inventory, and MIS reporting.'
        },
        {
          id: 'c14_mcq_2',
          question: 'Customized accounting software is suitable for:',
          options: ['(a) Small, conventional business', '(b) Large, medium business', '(c) Large, typical business', '(d) None of the above'],
          correctIndex: 1,
          answerText: '(b) Large, medium business',
          explanation: 'Customized software modifies standard packages to suit specific medium and large enterprise operational needs.'
        },
        {
          id: 'c14_mcq_3',
          question: 'TALLY is an example of:',
          options: [
            '(a) Tailor-made accounting software',
            '(b) Ready-made accounting software',
            '(c) In-built accounting software',
            '(d) Customized accounting software'
          ],
          correctIndex: 1,
          answerText: '(b) Ready-made accounting software',
          explanation: 'Tally is an off-the-shelf, ready-to-use commercial package.'
        },
        {
          id: 'c14_mcq_4',
          question: 'Which of the following is NOT a method of codification of accounts?',
          options: ['(a) Access codes', '(b) Sequential codes', '(c) Block codes', '(d) Mnemonic codes'],
          correctIndex: 0,
          answerText: '(a) Access codes',
          explanation: 'Sequential, Block, and Mnemonic are standard codification methods; access code is a security credential.'
        }
      ],
      veryShortQuestions: [
        {
          id: 'c14_vsq_1',
          marks: 2,
          question: 'What is CAS (Computerized Accounting System)?',
          answer: 'CAS refers to the system of recording, processing, and generating accounting records and financial statements using computer hardware and dedicated accounting software.'
        },
        {
          id: 'c14_vsq_2',
          marks: 2,
          question: 'Name three categories of accounting software packages.',
          answer: '1. Ready-made software (e.g., Tally, Busy, Marg)\n2. Customized software (standard software adapted to enterprise)\n3. Tailor-made software (developed from scratch for large organizations)'
        },
        {
          id: 'c14_vsq_3',
          marks: 2,
          question: 'What are Mnemonic codes?',
          answer: 'Codes consisting of alphabets or abbreviations as intuitive symbols to codify information (e.g., SJ for Sales Journal, HQ for Head Quarters).'
        },
        {
          id: 'c14_vsq_4',
          marks: 2,
          question: 'What is Grouping of Accounts in CAS?',
          answer: 'Classifying ledger accounts systematically into Major, Minor, and Sub-heads (Assets, Liabilities, Revenues, Expenses) and assigning alphanumeric codes for database processing.'
        }
      ],
      shortQuestions: [
        {
          id: 'c14_sq_1',
          marks: 3,
          question: 'Explain the three types of coding methods with examples.',
          answer: [
            '1. Sequential codes: Numbers or letters assigned in consecutive order (e.g., CL001, CL002).',
            '2. Block codes: Numbers partitioned into specified ranges allocated to groups (e.g., 100-199 Small Pumps, 200-299 Medium Pumps, 300-399 Pipes).',
            '3. Mnemonic codes: Letters or abbreviations representing the account name (e.g., SJ for Sales Journal, CB for Cash Book).'
          ]
        },
        {
          id: 'c14_sq_2',
          marks: 3,
          question: 'List out the reports generated by Computerized Accounting Systems.',
          answer: 'Day Book, Cash Book, Sales Report, Purchase Register, Stock Valuation Summary, Trial Balance, Trading and Profit & Loss Account, and Balance Sheet.'
        },
        {
          id: 'c14_sq_3',
          marks: 3,
          question: 'Mention three limitations of Computerized Accounting Systems.',
          answer: [
            '1. Vulnerability to data loss due to power interruptions or hardware failure.',
            '2. High initial cost of installation, training, and software licenses.',
            '3. Risk of cyber fraud, unauthorized access, and hacking.'
          ]
        }
      ],
      longQuestions: [
        {
          id: 'c14_lq_1',
          marks: 5,
          question: 'Explain the advantages of Computerized Accounting Systems in detail.',
          answer: [
            '1. Faster Processing: Computes millions of transactions and balances in seconds.',
            '2. High Accuracy: Eliminates posting errors, arithmetic miscalculations, and incorrect casts.',
            '3. Reliability: Computers do not suffer from human tiredness, boredom, or fatigue.',
            '4. Instant Up-to-Date Balances: Ledgers update in real-time as transactions are recorded.',
            '5. Automated MIS Reporting: Instant generation of aging schedules, trial balances, and cash flows.',
            '6. Enhanced Employee Motivation: Specialization in modern software boosts staff productivity.'
          ]
        }
      ]
    }
  ],

  // INTERIOR COMPULSORY & HOTS CASE STUDIES
  interiorCompulsoryCaseStudies: [
    {
      id: 'case_1_shg',
      caseNumber: 1,
      title: 'Accounting for Rural Self-Help Groups (SHGs)',
      scenario:
        'Self-Help Groups (SHGs) are informal voluntary groups of 5-20 individuals who pool savings and provide small loans to members. Members are often minimally educated, yet they must track loans, bank deposits, and interest.',
      discussionPoints: [
        'How do SHGs maintain their accounts?',
        'Is the formal financial accounting system suitable for all village enterprises?'
      ],
      solutionKey: [
        'SHGs maintain simple tabulations: Meeting registers, Cash book, Member loan passbooks, and General ledgers.',
        'Formal double-entry systems are often too complex for rural self-run groups; simple single-column cash registers or mechanical/app-based micro-accounting tools are more practical.'
      ]
    },
    {
      id: 'case_2_magesh',
      caseNumber: 2,
      title: 'Magesh’s Packing Materials Business & Closing Stock Dilemma',
      scenario:
        'Magesh started a trading business selling packaging material. He has good sales skills but little accounting knowledge. At the end of Year 1, he found some stock damaged and needing repair to be saleable. He also withdrew money from the business bank account for personal household use but forgot to record it.',
      discussionPoints: [
        'Does every entrepreneur need accounting knowledge?',
        'Identify key accounting concepts involved.',
        'How should damaged closing stock be valued?',
        'Can he compare his results with competitors?'
      ],
      solutionKey: [
        'Yes, basic accounting knowledge is essential to prevent untracked withdrawals, cash leakage, and tax penalties.',
        'Concepts involved: Business Entity Concept (Drawings must be segregated), Conservatism / Prudence Concept (Stock valuation), Dual Aspect Concept.',
        'Damaged closing stock must be valued at Net Realizable Value (Expected selling price minus cost of repairs) or cost, whichever is LOWER, according to the Conservatism Principle.',
        'He can compare results with competitors ONLY IF he adheres to standard GAAP accounting and properly accounts for drawings and inventory.'
      ]
    },
    {
      id: 'case_3_international_gaap',
      caseNumber: 3,
      title: 'Cross-Border Comparison: Indian GAAP vs IFRS',
      scenario:
        'An investor wishes to compare the published financial statements of an Indian enterprise with a competitor in Europe and the United States.',
      discussionPoints: [
        'Is it possible to directly compare an Indian company with an International company?',
        'Do all countries follow the same accounting standards?'
      ],
      solutionKey: [
        'Direct comparison requires careful adjustments because India follows Indian Accounting Standards (Ind AS / AS), the US follows US GAAP, and Europe follows IFRS.',
        'Harmonization efforts (such as Ind AS convergence with IFRS) facilitate comparability, but local tax and regulatory differences still exist.'
      ]
    },
    {
      id: 'case_4_debit_note_dispute',
      caseNumber: 4,
      title: 'Disputed Goods Return & Debit Note Validity',
      scenario:
        'A customer returns goods with a debit note claiming they are damaged. The supplier disagrees with the claim and refuses to accept that goods were defective.',
      discussionPoints: [
        'Can the customer immediately treat his debit note as a final source document for purchase returns?'
      ],
      solutionKey: [
        'A debit note represents an internal claim. Until the supplier inspects the goods and accepts the claim by issuing a corresponding Credit Note, the return is pending reconciliation.',
        'Proper business procedure requires mutual verification and retention of delivery receipts.'
      ]
    },
    {
      id: 'case_5_crossed_cheque',
      caseNumber: 5,
      title: 'Crossed Cheque vs Bearer Cheque Security',
      scenario:
        'A business receives large settlements and must choose whether to accept bearer or crossed cheques.',
      discussionPoints: [
        'Why are crossed cheques preferred over bearer cheques in commercial trade?'
      ],
      solutionKey: [
        'Crossed cheques cannot be encashed over the bank counter in cash. They must be routed through a payee bank account.',
        'This creates an immutable audit trail, minimizing risks of theft, loss, and fraud.'
      ]
    },
    {
      id: 'case_6_pearlita',
      caseNumber: 6,
      title: 'Pearlita’s Electronic Goods Trading Store',
      scenario:
        'Pearlita buys and sells electronics on cash and credit. She accepts returns from customers and returns defective goods to distributors. She maintains a dedicated business bank account.',
      discussionPoints: [
        'Why does she maintain double-entry bookkeeping?',
        'Is it necessary to maintain a separate bank account from personal funds?'
      ],
      solutionKey: [
        'Double-entry ensures accurate tracking of debtors, creditors, returns, and inventory.',
        'A separate business bank account is required under the Business Entity Concept. Using a personal account creates confusion between capital, drawings, and true commercial profit.'
      ]
    },
    {
      id: 'case_7_vetri_cash_book',
      caseNumber: 7,
      title: 'Vetri’s Sole Proprietorship & Cash Management',
      scenario:
        'Vetri runs a food retail shop. He sells for cash and credit, receives discounts, and has many petty expenses. He attempts to manage all transactions in a single simple cash book.',
      discussionPoints: [
        'Is a simple cash book sufficient as his business expands?',
        'What books should Vetri maintain?'
      ],
      solutionKey: [
        'A simple single-column cash book is inadequate because it cannot track discounts, bank payments, or credit sales/purchases.',
        'Recommended structure: (1) Three-Column Cash Book, (2) Petty Cash Book (Imprest), (3) Purchases Book, (4) Sales Book, (5) Purchases & Sales Returns Books.'
      ]
    },
    {
      id: 'case_8_joseph_credit',
      caseNumber: 8,
      title: 'Mr. Joseph’s Readymade Garment Store & Credit Risk',
      scenario:
        'Mr. Joseph initially dealt exclusively in cash. To retain customers, he introduced credit periods and bulk purchase discounts. Later, debtors delayed payments, creating severe cash flow difficulties.',
      discussionPoints: [
        'What type of discount was Joseph offering?',
        'How can Joseph incentivize timely payments?'
      ],
      solutionKey: [
        'Bulk purchase discount is a Trade Discount, which encourages larger order volume but does NOT incentivize fast payment.',
        'To speed up collection, Joseph should offer a Cash Discount (e.g., 2% discount if paid within 10 days) and set clear credit limits.'
      ]
    }
  ],

  // IMPORTANT THEORY QUESTIONS BLUEPRINT
  importantTheoryBank: {
    twoMarks: [
      '1. Define accounting (American Accounting Association).',
      '2. What are the steps involved in the process of accounting?',
      '3. Who are the parties interested in accounting information?',
      '4. Name any two bases of recording accounting information.',
      '5. Define book-keeping (J.R. Batliboi).',
      '6. What are source documents?',
      '7. What is accounting equation?',
      '8. Give the golden rules of double entry accounting system.',
      '9. What is meant by posting?',
      '10. What are the methods of preparation of trial balance?',
      '11. Mention four types of subsidiary books.',
      '12. What is debit note?',
      '13. What is credit note?',
      '14. What is journal proper?',
      '15. What are the different types of cash book?',
      '16. What is cash discount?',
      '17. What is trade discount?',
      '18. What is bank reconciliation statement?',
      '19. What is meant by rectification of errors?',
      '20. What are compensating errors?',
      '21. What is meant by depreciation?',
      '22. List out the various methods of depreciation.',
      '23. What is sinking fund method?',
      '24. What are wasting assets?',
      '25. What are fixed assets?',
      '26. What are adjusting entries?',
      '27. What is a computer in accounting context?',
      '28. Name any two accounting packages.',
      '29. Give any two examples of readymade software.',
      '30. What is coding in computerized accounting?',
      '31. What are mnemonic codes?'
    ],
    threeMarks: [
      '1. Explain the meaning of accounting.',
      '2. Why are investors and government interested in accounting information?',
      '3. What is matching concept? Why should a business concern follow this concept?',
      '4. “Only monetary transactions are recorded in accounting”. Explain the statement.',
      '5. State the principles of double entry system of book keeping.',
      '6. What are the errors not disclosed by a trial balance?',
      '7. What are the errors disclosed by a trial balance?',
      '8. “Balance sheet is not an account” — Explain.',
      '9. Study the formats: Cash book format, subsidiary books format, trial balance format.'
    ],
    fiveMarks: [
      '1. What is double entry system? State its advantages in detail.',
      '2. What is ledger? Explain its utilities.',
      '3. What are the causes for depreciation?',
      '4. Distinguish between straight line method and written down value method of providing depreciation.',
      '5. Distinguish between capital expenditure and revenue expenditure.',
      '6. Distinguish between capital receipt and revenue receipt.',
      '7. What are the various types of accounting software packages (Ready-made, Customized, Tailor-made)?',
      '8. List out the various reports generated by computerized accounting system.',
      '9. Distinguish between journal and ledger across seven fundamental parameters.'
    ]
  },

  // IMPORTANT SUMS BLUEPRINT MATRIX
  importantSumsMatrix: [
    { chapterNumber: 3, chapterTitle: 'Books of Prime Entry', twoMarkSums: 'Illustration: 5', threeMarkSums: 'Exercise: 1', fiveMarkSums: 'Illustrations: 1, 2, 3 | Exercises: 3, 4, 7, 8, 12' },
    { chapterNumber: 4, chapterTitle: 'Ledger', twoMarkSums: 'Illustrations: 2, 3 | Exercise: 3, 5', threeMarkSums: 'Exercises: 1, 4, 6', fiveMarkSums: 'Exercises: 8, 11' },
    { chapterNumber: 5, chapterTitle: 'Trial Balance', twoMarkSums: 'All standard format illustrations', threeMarkSums: 'All balancing illustrations', fiveMarkSums: 'All comprehensive trial balance exercises' },
    { chapterNumber: 6, chapterTitle: 'Subsidiary Books - I', twoMarkSums: 'Exercise: 2', threeMarkSums: 'Exercises: 1, 2', fiveMarkSums: 'Exercises: 5, 7 | Page 115 (Examples)' },
    { chapterNumber: 7, chapterTitle: 'Subsidiary Books - II (Cash Book)', twoMarkSums: 'Exercises: 1, 2', threeMarkSums: 'Exercises: 1, 2', fiveMarkSums: 'Illustration: 6 | Exercises: 4, 6, 8' },
    { chapterNumber: 8, chapterTitle: 'Bank Reconciliation Statement', twoMarkSums: 'Exercises: 1, 8', threeMarkSums: 'Exercises: 2, 5, 6, 9', fiveMarkSums: 'Illustrations: 1, 3, 4, 5, 6, 7 | Exercises: 8, 9' },
    { chapterNumber: 9, chapterTitle: 'Rectification of Errors', twoMarkSums: 'Illustrations: 1, 2, 3, 4 | Exercises: 1, 2, 3', threeMarkSums: 'Exercises: 6, 9', fiveMarkSums: 'Exercises: 11, 13' },
    { chapterNumber: 10, chapterTitle: 'Depreciation Accounting', twoMarkSums: 'Illustration: 1 | Exercise: 1, 11', threeMarkSums: 'Illustrations: 2, 3 | Exercises: 2, 3, 4, 5, 6, 12', fiveMarkSums: 'Exercises: 8, 9, 15' },
    { chapterNumber: 11, chapterTitle: 'Capital & Revenue Transactions', twoMarkSums: 'All identification sums', threeMarkSums: 'All categorization exercises', fiveMarkSums: 'Comprehensive classification problems' },
    { chapterNumber: 12, chapterTitle: 'Final Accounts - I', twoMarkSums: 'Illustrations: 1, 2, 3 | Exercises: 1, 2, 3, 10', threeMarkSums: 'Exercises: 7, 8, 9', fiveMarkSums: 'Exercise: 11 (Full Trading, P&L, Balance Sheet)' },
    { chapterNumber: 13, chapterTitle: 'Final Accounts - II (With Adjustments)', twoMarkSums: 'Exercises: 1, 2', threeMarkSums: 'Exercises: 5, 9', fiveMarkSums: 'Exercises: 10, 14, 17 | Illustrations: 6, 8, 9, 12, 13' }
  ]
};
