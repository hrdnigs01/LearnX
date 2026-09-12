export interface BStQuizQuestion {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface BStConcept {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  tableOrChart?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
}

export interface BStHotsCase {
  id: string;
  scenario: string;
  question: string;
  answer: string;
  conceptApplied: string;
}

export interface BStChapterMaterial {
  chapterNumber: number;
  title: string;
  subtitle: string;
  overview: string;
  keyTerms: { term: string; definition: string }[];
  concepts: BStConcept[];
  comparisons?: {
    title: string;
    headers: string[];
    rows: string[][];
  }[];
  hotsCases: BStHotsCase[];
  gistOfLesson: string[];
  quizQuestions: BStQuizQuestion[];
}

export const businessStudiesMaterialData: BStChapterMaterial[] = [
  // CHAPTER 3: PUBLIC, PRIVATE AND GLOBAL ENTERPRISES
  {
    chapterNumber: 3,
    title: 'Public, Private and Global Enterprises',
    subtitle: 'CBSE Class 11 Business Studies • Chapter 03 Complete Guide',
    overview:
      'The Indian economy is a mixed economy comprising both privately owned business organisations and government-managed public sector enterprises. This chapter classifies public sector enterprises into Departmental Undertakings, Statutory Corporations, and Government Companies, analyzes the post-1991 Industrial Policy reforms (disinvestment, MoU, reduction in reserved sectors), and explores Multinational Corporations (MNCs), Joint Ventures, and Public-Private Partnerships (PPP).',
    keyTerms: [
      {
        term: 'Public Sector Enterprises',
        definition:
          'Enterprises owned, managed, and controlled by the central or state government, or jointly by both, with service to society and public welfare as primary motives.',
      },
      {
        term: 'Departmental Undertakings',
        definition:
          'The oldest and most traditional form of organizing public enterprises, functioning as an integral department or branch of a government ministry funded directly by the government treasury (e.g. Indian Railways, Post & Telegraphs, Defence).',
      },
      {
        term: 'Statutory Corporation',
        definition:
          'A public enterprise brought into existence by a Special Act of the Parliament which defines its powers, statutory functions, employee service rules, and relationship with government departments (e.g., LIC, RBI, FCI, ONGC).',
      },
      {
        term: 'Government Company',
        definition:
          'According to the Indian Companies Act, a company in which not less than 51% of the paid-up share capital is held by the Central Government, or State Government(s), or jointly by both. Shares are held in the name of the President of India (e.g., BHEL, SAIL, HMT).',
      },
      {
        term: 'Disinvestment',
        definition:
          'The sale of equity shares of public sector undertakings (PSUs) to the private sector and the general public to reduce government fiscal deficit and infuse commercial discipline.',
      },
      {
        term: 'Global Enterprises (MNCs)',
        definition:
          'Giant corporate bodies that own and control production or service facilities in more than one country, headquartered in a home country with subsidiaries in host countries (e.g., Samsung, Coca-Cola, Unilever, Hyundai).',
      },
      {
        term: 'Joint Venture',
        definition:
          'A business partnership between two or more independent commercial entities agreeing to pool resources and expertise for mutual financial and strategic benefit (e.g., Maruti Suzuki, Hero Honda).',
      },
      {
        term: 'Public Private Partnership (PPP)',
        definition:
          'A long-term project or service arrangement financed and operated through collaboration between government bodies and private sector enterprises (e.g., metro rail projects, expressways).',
      },
    ],
    concepts: [
      {
        id: 'c3_departmental',
        title: 'Departmental Undertakings — Characteristics, Merits & Demerits',
        summary:
          'Directly organized under a government ministry; highest direct parliamentary oversight and ministerial accountability.',
        keyPoints: [
          'Financing: Funded directly by the government treasury through budgetary allocations; all revenues earned are deposited directly into the government treasury.',
          'Staffing: Employees are central or state civil servants subject to government service rules and recruitment boards (UPSC/SSC).',
          'Accountability: Directly answerable to the minister and legislature; audited by the Comptroller and Auditor General (CAG).',
          'Suitability: Ideal where national security, sovereign defense, public secrecy, and strategic communications are paramount (e.g. Defence, Indian Railways, Atomic Energy).',
          'Demerits: Red tapism, excessive political interference, extreme lack of managerial autonomy, and inability to take prompt commercial advantage of market opportunities.',
        ],
      },
      {
        id: 'c3_statutory',
        title: 'Statutory Corporations — Autonomous Public Bodies',
        summary:
          'Statutory bodies incorporated under Special Acts of Parliament combining public authority with commercial flexibility.',
        keyPoints: [
          'Separate Legal Entity: Can sue, be sued, hold property, and enter into contracts in their own corporate name.',
          'Financial Independence: Prepares independent budgets; can borrow from the government or capital markets and retain earnings for expansion.',
          'Employment: Personnel are NOT government civil servants; governed by internal service regulations framed by the corporation.',
          'Board of Directors: Appointed by the government representing diverse stakeholders, public interest, and specialized industries.',
          'Merits: Freedom from routine bureaucratic interference; policies undergo parliamentary review ensuring public interest is guarded.',
          'Demerits: In practice, operational autonomy is frequently circumscribed by political interference in major funding and policy decisions.',
        ],
      },
      {
        id: 'c3_govt_company',
        title: 'Government Companies — Registered Under Companies Act',
        summary:
          'Companies where at least 51% paid-up capital is owned by the government; shares are subscribed in the name of the President of India.',
        keyPoints: [
          'Incorporation: Formed under the Indian Companies Act like any commercial company; retains separate legal identity.',
          'Autonomy: Enjoys maximum operational autonomy among all three forms of public enterprises as it operates under commercial company law.',
          'Appointment: Staff are recruited in accordance with the Memorandum & Articles of Association; exempted from rigid civil service audit constraints.',
          'Check on Malpractices: Often introduced in consumer goods to counter private monopolies and provide essential goods/services at fair prices.',
          'Demerits: Freedom often exists on paper only, as bureaucrats dominate the Board of Directors.',
        ],
      },
      {
        id: 'c3_1991_reforms',
        title: '1991 Industrial Policy Reforms in Public Sector',
        summary:
          'Radical economic shifts to curtail fiscal drain and revitalize inefficient public undertakings.',
        keyPoints: [
          'De-reservation: The number of industries reserved exclusively for the public sector was sharply pruned from 17 down to 3: (1) Atomic Energy, (2) Arms and Ammunition, and (3) Rail Transport.',
          'Disinvestment of Sick/Non-strategic Units: Diluting government ownership by selling equity shares to institutional investors, private sector, and general public.',
          'Memorandum of Understanding (MoU): Clear quantitative performance contracts signed between PSU management and administrative ministries granting managerial autonomy in exchange for target commitments.',
          'Revival via BIFR: Sick but viable units referred to Board for Industrial and Financial Reconstruction (BIFR); non-viable units wound up.',
          'National Renewal Fund (NRF): Established to retrain, redeploy retrenched labor, and finance Voluntary Retirement Schemes (VRS).',
        ],
      },
      {
        id: 'c3_global_and_jv',
        title: 'Global Enterprises (MNCs), Joint Ventures & PPP',
        summary:
          'Mechanisms of cross-border capital, technological transfer, and collaborative infrastructure execution.',
        keyPoints: [
          'MNC Characteristics: Giant financial muscle, international network of branches/subsidiaries, parent HQ control, advanced proprietary R&D, aggressive branding.',
          'Joint Venture Synergies: Pooling of capital, access to advanced foreign technology, established distribution channels, low-cost local labor, shared enterprise risk.',
          'Public Private Partnership (PPP): Suitable for high-priority, capital-intensive mega projects with long gestation periods (airports, highways, power grids) where revenue and risks are shared.',
        ],
      },
    ],
    comparisons: [
      {
        title: 'Comparison: Statutory Corporation vs Government Company',
        headers: ['Basis of Distinction', 'Statutory Corporation', 'Government Company'],
        rows: [
          ['Formation', 'By a Special Act passed in the Parliament or State Legislature.', 'Registered under the Companies Act (1956 / 2013).'],
          ['Ownership', 'Wholly owned by the government.', 'At least 51% of paid-up capital is owned by the government.'],
          ['Management & Control', 'Nominated Board of Directors as per Special Act.', 'Board of Directors can include private and government representatives.'],
          ['Status of Employees', 'Employees are NOT civil servants; guided by corporate rules.', 'Employees are appointed under Articles of Association.'],
          ['Autonomy', 'Statutory autonomy, but parliamentary questions apply.', 'Highest commercial and operational flexibility.'],
          ['Examples', 'LIC, RBI, Food Corporation of India (FCI), SBI.', 'BHEL, SAIL, HMT, ONGC, NTPC.'],
        ],
      },
    ],
    hotsCases: [
      {
        id: 'hots_c3_1',
        scenario:
          'Soma noticed that the Government is aggressively divesting its shares in several public sector undertakings (PSUs), while private firms in the same industries are posting record profits. She wonders why PSUs failed to generate equal returns.',
        question:
          'Can public sector enterprises compete with the private sector in terms of commercial profit and operational efficiency? State three principal reasons.',
        answer:
          'No, typical PSUs face structural disadvantages: (1) Primary Social Service Motive: PSUs prioritize balanced regional development, employment generation, and subsidised pricing rather than sheer profit maximization. (2) Bureaucratic & Political Interference: Lack of autonomous decision-making due to political pressures and rigid ministerial controls. (3) Inefficient Management: Often steered by generalist bureaucrats rather than performance-driven commercial professionals, leading to delayed decision-making.',
        conceptApplied: 'Limitations of Public Sector & Rationale for Disinvestment',
      },
      {
        id: 'hots_c3_2',
        scenario:
          'A leading auto manufacturer in Japan collaborated with a domestic government-controlled automobile firm in India to create passenger cars for the Indian subcontinent.',
        question:
          'Name the form of enterprise created. What distinct benefits did each entity derive from this alliance?',
        answer:
          'It is a Joint Venture (such as Maruti Suzuki). Benefits: (1) The foreign firm gained immediate access to India’s massive distribution network, low-cost manufacturing workforce, and regulatory licenses. (2) The Indian partner gained advanced Japanese automotive engineering, superior design technology, and global brand goodwill.',
        conceptApplied: 'Joint Ventures and Collaborative Benefits',
      },
    ],
    gistOfLesson: [
      'The Indian economy relies on private sector enterprises (profit-driven) and public sector enterprises (social welfare and strategic control).',
      'Departmental Undertakings are best suited for national security and defense where direct ministerial control and state funding are mandatory.',
      'Statutory Corporations are formed by Special Acts of Parliament with separate legal personality and financial autonomy (LIC, RBI).',
      'Government Companies require at least 51% government shareholding registered in the name of the President of India.',
      'The 1991 Industrial Policy reformed public enterprise by pruning reserved industries from 17 to 3, initiating disinvestment, and signing MoUs.',
      'MNCs, Joint Ventures, and PPPs drive modern infrastructure through shared financial resources, cutting-edge technology, and distributed risk.',
    ],
    quizQuestions: [
      {
        id: 'bst_c3_q1',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Which of the following is considered the oldest and most traditional form of organizing public enterprises?',
        options: ['Statutory Corporation', 'Departmental Undertaking', 'Government Company', 'Joint Venture'],
        correctIndex: 1,
        explanation:
          'Departmental Undertaking is the oldest form. It functions as an integral wing of a government ministry without a separate legal identity (e.g., Railways, Post & Telegraphs).',
        topic: 'Forms of Public Enterprises',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c3_q2',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'In a Government Company, what minimum percentage of the paid-up share capital must be held by the government?',
        options: ['49%', '50%', '51%', '75%'],
        correctIndex: 2,
        explanation:
          'Under the Companies Act, a government company is one in which not less than 51% of the paid-up share capital is held by the Central Government, State Government(s), or jointly by both.',
        topic: 'Government Company',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c3_q3',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'In whose name are the shares of a Government Company subscribed and held in India?',
        options: ['Prime Minister of India', 'Finance Minister of India', 'President of India', 'Speaker of the Lok Sabha'],
        correctIndex: 2,
        explanation:
          'All equity shares held by the Government of India in government companies are held in the name of the President of India.',
        topic: 'Government Company Registration',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c3_q4',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Which form of public sector enterprise is established by passing a Special Act of the Parliament?',
        options: ['Departmental Undertaking', 'Statutory Corporation', 'Public Limited Company', 'Sole Proprietorship'],
        correctIndex: 1,
        explanation:
          'Statutory Corporations (like Life Insurance Corporation, Reserve Bank of India) are created by Special Acts of Parliament specifying their powers, functions, and immunities.',
        topic: 'Statutory Corporation',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c3_q5',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Where national defense and sovereign security are concerned, which form of public enterprise is most suitable?',
        options: ['Joint Venture', 'Statutory Corporation', 'Departmental Undertaking', 'Public-Private Partnership'],
        correctIndex: 2,
        explanation:
          'Departmental Undertakings operate directly under ministerial command and government treasury, ensuring absolute secrecy and control vital for national defense and ordnance factories.',
        topic: 'Departmental Undertaking',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c3_q6',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Under the 1991 Industrial Policy reforms, the number of industries reserved exclusively for the public sector was pruned to:',
        options: ['17 industries', '8 industries', '3 industries', 'Zero industries'],
        correctIndex: 2,
        explanation:
          'Reserved industries were reduced from 17 down to 3: Atomic Energy, Arms & Ammunition, and Rail Transport.',
        topic: 'Changing Role of Public Sector',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c3_q7',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'The sale of equity shares of public sector units to private enterprises and the general public is referred to as:',
        options: ['Nationalisation', 'Disinvestment', 'Amalgamation', 'Securitisation'],
        correctIndex: 1,
        explanation:
          'Disinvestment involves selling state-owned equity shares in PSUs to private buyers and public investors to foster efficiency and ease fiscal deficits.',
        topic: 'Disinvestment',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c3_q8',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Which fund was created by the Government to retrain, redeploy retrenched labor and finance voluntary retirement schemes in PSUs?',
        options: ['Consolidated Fund of India', 'National Renewal Fund (NRF)', 'Contingency Fund of India', 'Prime Minister Relief Fund'],
        correctIndex: 1,
        explanation:
          'The National Renewal Fund (NRF) was constituted during the 1991 reforms to protect the interests of workers impacted by PSU restructuring and voluntary retirement.',
        topic: '1991 Industrial Policy',
        difficulty: 'Hard',
      },
      {
        id: 'bst_c3_q9',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'Which of the following represents a classic example of a Statutory Corporation in India?',
        options: ['Indian Railways', 'Hindustan Machine Tools (HMT)', 'Life Insurance Corporation of India (LIC)', 'Post and Telegraph Department'],
        correctIndex: 2,
        explanation:
          'LIC was established under the Life Insurance Corporation Act 1956 passed by the Indian Parliament, making it a Statutory Corporation.',
        topic: 'Statutory Corporation Examples',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c3_q10',
        chapterNumber: 3,
        chapterTitle: 'Public, Private and Global Enterprises',
        question: 'A large infrastructure project like a high-speed express highway financed and operated jointly by the State and a private consortium is known as:',
        options: ['Departmental Monopoly', 'Public Private Partnership (PPP)', 'Cooperative Society', 'Cartel'],
        correctIndex: 1,
        explanation:
          'A Public Private Partnership (PPP) is an enterprise/project where private expertise, capital, and operations join public planning and welfare oversight.',
        topic: 'Public Private Partnership',
        difficulty: 'Easy',
      },
    ],
  },

  // CHAPTER 5: EMERGING MODES OF BUSINESS
  {
    chapterNumber: 5,
    title: 'Emerging Modes of Business',
    subtitle: 'CBSE Class 11 Business Studies • Chapter 05 Complete Guide',
    overview:
      'The emergence of digital communications, internet connectivity, and outsourcing has fundamentally transformed modern commerce. This chapter explores e-Business and its scope (B2B, B2C, Intra-B, C2C), contrasts e-business with traditional business, examines online transaction stages and security protocols (SSL, digital cash), outlines transaction risks (order, delivery, payment defaults, VIRUS threats), and provides an exhaustive analysis of Outsourcing (BPO, KPO, verticals, horizontals, captive units, sweat shopping, and ethical dilemmas).',
    keyTerms: [
      {
        term: 'e-Business',
        definition:
          'A comprehensive term referring to all business transactions, functions, and internal processes (inventory management, production planning, accounting, HR) conducted electronically over internet networks.',
      },
      {
        term: 'e-Commerce',
        definition:
          'A subset of e-Business that specifically refers to a firm’s commercial buying and selling interactions with customers and suppliers over the internet.',
      },
      {
        term: 'VIRUS',
        definition:
          'Vital Information & Resources Under Siege — a malicious program designed to replicate, disrupt functioning, corrupt files, and damage system data.',
      },
      {
        term: 'Secure Sockets Layer (SSL)',
        definition:
          'The cryptographic protocol technology used for encrypting and securing sensitive user credentials, payment details, and transmission data in online transactions.',
      },
      {
        term: 'Digital Cash / Cyber Currency',
        definition:
          'An electronic form of currency existing solely in cyberspace; buyers deposit funds into digital accounts to execute immediate internet transactions.',
      },
      {
        term: 'Sweat Shopping',
        definition:
          'Outsourcing practice wherein firms attempt to minimize operating costs by extracting maximum labor from low-wage manpower in developing countries, emphasizing repetitive "doing" skills over cognitive development.',
      },
      {
        term: 'BPO (Business Process Outsourcing)',
        definition:
          'The business practice of contracting out non-core or specific operational processes to specialized third-party service providers to trim costs, improve quality, and conserve managerial bandwidth.',
      },
      {
        term: 'Captive BPO Units',
        definition:
          'Outsourced service units set up directly by the parent company (often an MNC) exclusively to service its own internal processes (e.g., dedicated payroll or tech-support arms).',
      },
      {
        term: 'Horizontals',
        definition:
          'Third-party outsourcing firms that provide a wide variety of non-core administrative, clerical, or customer service processes across multiple unrelated industries.',
      },
      {
        term: 'Verticals',
        definition:
          'Third-party outsourcing contractors that specialize exclusively in specific, high-depth industry niches, handling both non-core and core technical activities.',
      },
    ],
    concepts: [
      {
        id: 'c5_scope_ebusiness',
        title: 'Scope of e-Business: B2B, B2C, Intra-B & C2C',
        summary:
          'Four primary transaction flows connecting commercial entities, end-consumers, and internal enterprise divisions.',
        keyPoints: [
          'B2B (Business-to-Business): Electronically conducted commerce between commercial manufacturers, wholesalers, and suppliers (e.g., automobile assembly plants ordering components from ancillary vendors). Comprises the highest transaction volume.',
          'B2C (Business-to-Consumer): Online selling of finished products/services directly to retail customers (e.g., Amazon, Flipkart, online ticket bookings).',
          'Intra-B Commerce: Internal electronic communication within a single corporate enterprise across departments, branches, and supply chain nodes (e.g., ERP systems, intranet video conferences, real-time inventory tracking).',
          'C2C (Consumer-to-Consumer): Digital platforms where individuals buy, sell, or auction goods and services directly with other individuals (e.g., OLX, eBay, Quikr).',
        ],
      },
      {
        id: 'c5_online_transaction_steps',
        title: 'Online Transaction Lifecycle & Payment Mechanisms',
        summary:
          'The three operational stages of e-commerce and various payment gateways.',
        keyPoints: [
          'Stage 1 — Pre-Purchase / Sale: Browsing online catalogues, searching product specifications, price discovery, and reading customer reviews.',
          'Stage 2 — Purchase / Sale: Price negotiation, cart confirmation, closing the agreement, and choosing payment channels.',
          'Stage 3 — Delivery: Physical transit and handover of tangible goods (or digital download of software/e-books).',
          'Payment Channels: (a) Cash on Delivery (COD) upon doorstep receipt, (b) Cheque clearance, (c) Net-Banking electronic fund transfer, (d) Credit/Debit Cards ("Plastic Money"), (e) Digital Wallets & Digital Cash.',
        ],
      },
      {
        id: 'c5_risks',
        title: 'Risks in e-Business: Transactional, Data & Intellectual',
        summary:
          'Three prominent categories of cyber risk faced by e-business participants.',
        keyPoints: [
          'Transaction Risks: Default on Order (buyer denies placing order or seller denies receiving it); Default on Delivery (goods delivered to incorrect location or damaged goods delivered); Default on Payment (buyer claims payment made, seller denies receipt).',
          'Data Storage & Transmission Risks: Malicious VIRUS infections destroying server databases, and unauthorized packet interception (man-in-the-middle attacks) during unencrypted data transmission.',
          'Threat to Intellectual Property & Privacy: Trade secrets, proprietary formulas, customer profiles leaked onto public internet, and email inbox spamming by unsolicited promotional marketing.',
        ],
      },
      {
        id: 'c5_outsourcing_full',
        title: 'Outsourcing — Nature, Scope Breakdown, Needs & Ethical Concerns',
        summary:
          'Contracting out non-core activities to domestic or overseas specialist agencies.',
        keyPoints: [
          'Four Key Segments: Contract Manufacturing accounts for 56% of global outsourcing, Contract Research 19%, Informatics 15%, and Contract Sales 10%.',
          'Need for Outsourcing: (1) Focusing managerial attention on core competencies, (2) Quest for excellence by leveraging world-class specialists, (3) Global cost reduction through competitive wage differentials, (4) Growth through strategic alliances, (5) Economic fillip to developing nations (India holds ~60% share in global IT/BPO services).',
          'Concerns & Limitations: (1) Confidentiality risk (outsourced vendor might leak secrets or start rival firms), (2) "Sweat Shopping" and wage exploitation, (3) Ethical concerns (child labor or substandard work conditions overseas), (4) Domestic resistance and backlash in home countries suffering from unemployment.',
        ],
      },
    ],
    comparisons: [
      {
        title: 'Comparison: Traditional Business vs e-Business',
        headers: ['Basis of Distinction', 'Traditional Business', 'e-Business'],
        rows: [
          ['Ease of Formation', 'Difficult; requires cumbersome physical licenses & procedures.', 'Simple; quick online registration and minimal procedural friction.'],
          ['Physical Presence', 'Mandatory (physical retail stores, commercial offices).', 'Not required; virtual internet storefronts.'],
          ['Location Requirements', 'Must be situated near markets or raw material hubs.', 'None; location agnostic on the internet.'],
          ['Cost of Setting Up', 'High (real estate, showrooms, physical display inventory).', 'Low (website domain, software, server storage).'],
          ['Operating Costs', 'High (staff, physical maintenance, utilities).', 'Low (automated workflows, consolidated fulfillment centers).'],
          ['Contact with Customers', 'Indirect through tiers of wholesalers and retailers.', 'Direct contact between producer and final customer.'],
          ['Internal Communication', 'Hierarchical (top-down vertical chain of command).', 'Horizontal (direct communication across all levels).'],
          ['Response Time', 'Long and sluggish turnaround time.', 'Instantaneous at the click of a mouse.'],
          ['Personal Touch', 'High face-to-face interpersonal touch.', 'Low interpersonal contact; purely digital interface.'],
          ['Ease of Going Global', 'Very difficult and expensive.', 'Seamless global reach without national physical borders.'],
        ],
      },
    ],
    hotsCases: [
      {
        id: 'hots_c5_1',
        scenario:
          'Mr. X ordered an expensive robotic vacuum cleaner from an online vendor Mr. Y. After two weeks of waiting, the package never arrived. Upon investigation, he discovered that the courier company delivered the vacuum cleaner to an entirely different address.',
        question:
          'Identify the category of e-business risk illustrated in this case. Also explain two other related transaction risks.',
        answer:
          'The case illustrates "Default on Delivery" under Transaction Risks. The other two related transaction risks are: (1) Default on Order Taking/Giving: The customer claims they never placed the order, or the seller asserts the order was never received. (2) Default on Payment: The customer asserts that payment was successfully transferred, but the merchant denies receiving the funds in their bank ledger.',
        conceptApplied: 'Transaction Risks in e-Business',
      },
      {
        id: 'hots_c5_2',
        scenario:
          'A prominent multi-speciality hospital contracts out its sanitation, patient food catering, and security services to an outside agency, while maintaining its surgery and critical patient diagnosis teams internally. However, a luxury 5-star hotel treats housekeeping and catering as its core competency.',
        question:
          'Explain why what is non-core for the hospital is core for the hotel. How does this justify the principle of outsourcing?',
        answer:
          'Every enterprise must identify its own distinctive core and non-core competencies. For a hospital, healthcare diagnosis and surgery are the core competencies, whereas housekeeping and catering are supportive (non-core) and can be outsourced. For a luxury hotel, guest hospitality, pristine housekeeping, and gourmet catering are the core drivers of competitive advantage and customer loyalty, hence cannot be outsourced casually.',
        conceptApplied: 'Core vs Non-Core Activities in Outsourcing',
      },
    ],
    gistOfLesson: [
      'Traditional business is constrained by geographical proximity, heavy infrastructure costs, and lengthy transaction cycles.',
      'e-Business encompasses all electronic business processes and transactions, operating 24x7 with global reach and low setup costs.',
      'Scope includes B2B, B2C, Intra-B, and C2C electronic transactions.',
      'Key security elements include Secure Sockets Layer (SSL) encryption, firewalls, and digital cash accounts.',
      'Outsourcing is contracting out non-core functions to specialist agencies (Horizontals and Verticals), enabling firms to focus on core excellence.',
      'While outsourcing boosts efficiency and employment in developing nations like India (60% global share), it raises concerns regarding confidentiality, sweat shopping, and home-country job losses.',
    ],
    quizQuestions: [
      {
        id: 'bst_c5_q1',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'What does the abbreviation "VIRUS" stand for in computer security terminology?',
        options: [
          'Virtual Information Resources Under System',
          'Vital Information & Resources Under Siege',
          'Verified Integrated Resources Using Software',
          'Variable Information Rendering Unified System',
        ],
        correctIndex: 1,
        explanation:
          'In computer networks, VIRUS stands for "Vital Information & Resources Under Siege".',
        topic: 'Data & Transmission Risks',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c5_q2',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'Which of the following is the widest and most inclusive business term?',
        options: ['e-Commerce', 'e-Procurement', 'e-Business', 'e-Trading'],
        correctIndex: 2,
        explanation:
          'e-Business is the most inclusive term. While e-Commerce only covers customer and supplier interactions, e-Business includes inventory management, production, HR, accounting, and product development.',
        topic: 'e-Business vs e-Commerce',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c5_q3',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'Transactions occurring between two industrial units, such as a tyre manufacturer selling tyres to a car assembler, fall under:',
        options: ['B2C Commerce', 'B2B Commerce', 'C2C Commerce', 'Intra-B Commerce'],
        correctIndex: 1,
        explanation:
          'Electronically conducted business transactions between two commercial business entities are classified as B2B (Business-to-Business) commerce.',
        topic: 'Scope of e-Business',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c5_q4',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'What is the cryptographic technology used to encrypt and secure sensitive credit card details in online transactions?',
        options: ['HTML', 'Secure Sockets Layer (SSL)', 'FTP Protocol', 'SMTP'],
        correctIndex: 1,
        explanation:
          'Secure Sockets Layer (SSL) encrypts sensitive user information (passwords, card numbers) during online data transit.',
        topic: 'Online Security',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c5_q5',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'Third-party outsourcing firms that undertake contracts across diverse processes and multiple industries are called:',
        options: ['Verticals', 'Captive units', 'Horizontals', 'Special Purpose Vehicles'],
        correctIndex: 2,
        explanation:
          'Service providers that undertake broad non-core assignments from diverse industries are known as "Horizontals". Firms dedicated to deep industry-specific niches are "Verticals".',
        topic: 'Outsourcing Terminology',
        difficulty: 'Hard',
      },
      {
        id: 'bst_c5_q6',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'According to industry data, which segment constitutes the largest share of global outsourcing at 56%?',
        options: ['Contract Sales', 'Contract Research', 'Contract Manufacturing', 'Informatics'],
        correctIndex: 2,
        explanation:
          'Contract Manufacturing dominates the global outsourcing pie with 56% share, followed by Contract Research (19%), Informatics (15%), and Contract Sales (10%).',
        topic: 'Scope of Outsourcing',
        difficulty: 'Hard',
      },
      {
        id: 'bst_c5_q7',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'When a buyer uses eBay or OLX to sell their used laptop to another individual, the transaction model is:',
        options: ['B2B', 'B2C', 'C2C', 'Intra-B'],
        correctIndex: 2,
        explanation:
          'Consumer-to-Consumer (C2C) commerce connects individual sellers directly with individual buyers on an online platform.',
        topic: 'Scope of e-Business',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c5_q8',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'The practice of outsourcing work to developing countries solely to exploit low-cost manpower with minimal skill building is called:',
        options: ['Cloud Sourcing', 'Sweat Shopping', 'Offshoring Parity', 'Smart Contracting'],
        correctIndex: 1,
        explanation:
          'Firms looking purely to shave labor costs without fostering cognitive or thinking skills from host-country workers are criticized for "Sweat Shopping".',
        topic: 'Concerns over Outsourcing',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c5_q9',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'India currently holds approximately what share of the global outsourcing market in software and IT-enabled services?',
        options: ['20%', '40%', '60%', '85%'],
        correctIndex: 2,
        explanation:
          'India commands roughly 60% of the world’s global outsourcing share in software engineering and IT-enabled business services.',
        topic: 'Economic Importance of Outsourcing',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c5_q10',
        chapterNumber: 5,
        chapterTitle: 'Emerging Modes of Business',
        question: 'Which of the following is an internal transaction risk where a merchant denies ever receiving an order from a customer?',
        options: ['Default on Delivery', 'Default on Order taking/giving', 'Interception of data', 'Intellectual Infringement'],
        correctIndex: 1,
        explanation:
          'When either the seller denies order receipt or the buyer denies placing it, it is classified as "Default on Order taking/giving".',
        topic: 'Transaction Risks',
        difficulty: 'Medium',
      },
    ],
  },

  // CHAPTER 6: SOCIAL RESPONSIBILITIES OF BUSINESS & BUSINESS ETHICS
  {
    chapterNumber: 6,
    title: 'Social Responsibilities of Business & Business Ethics',
    subtitle: 'CBSE Class 11 Business Studies • Chapter 06 Complete Guide',
    overview:
      'A business enterprise draws all its physical, financial, and human capital from society and cannot operate as an isolated profit-maximizing machine. This chapter details the concept of Social Responsibility, evaluates arguments for and against social responsibility, outlines the 4 kinds of social obligations (Economic, Legal, Ethical, Discretionary), examines obligations towards four key interest groups (Shareholders, Employees, Consumers, Government/Community), reviews environmental protection and the 4 types of pollution, and breaks down the core elements of Business Ethics.',
    keyTerms: [
      {
        term: 'Social Responsibility',
        definition:
          'The voluntary and moral obligation of business management to formulate policies and execute actions that are aligned with the objectives and values of society.',
      },
      {
        term: 'Business Environment',
        definition:
          'The totality of all external economic, social, legal, technological, and political forces with which business interacts constantly and which affect its operations.',
      },
      {
        term: 'Environmental Protection',
        definition:
          'The deliberate, systematic practice of conserving natural resources and shielding ecosystems from existing or potential threats caused by industrial discharges.',
      },
      {
        term: 'Pollution',
        definition:
          'The emission, release, or dumping of harmful chemical wastes, particulates, and noise into the biosphere, threatening animal, plant, and human health.',
      },
      {
        term: 'Business Ethics',
        definition:
          'The socially determined moral principles, standards, and values that ought to govern all business conduct and commercial dealings.',
      },
      {
        term: 'Code of Ethics',
        definition:
          'A formal written document published by an enterprise articulating its guiding moral principles, expected standards of honesty, fairness, and legal compliance across the organisation.',
      },
    ],
    concepts: [
      {
        id: 'c6_arguments',
        title: 'Arguments For and Against Social Responsibility',
        summary:
          'Evaluating whether enterprises should focus strictly on profits or embrace broader societal well-being.',
        keyPoints: [
          'Arguments FOR: (1) Justification for existence and growth — profit is a byproduct of genuine service to society; (2) Long-term interest of the firm — socially responsive businesses build trust and goodwill; (3) Avoidance of harsh government regulations — proactive ethical conduct pre-empts restrictive laws; (4) Maintenance of society — businesses contribute to social peace and harmony; (5) Availability of business resources — managerial expertise and capital can solve social challenges effectively; (6) Converting social problems into profitable opportunities.',
          'Arguments AGAINST: (1) Violation of pure profit motive — Friedman doctrine that business fulfills duties purely by maximizing efficiency and paying taxes; (2) Burden on consumers — high social investments may inflate product prices; (3) Lack of social problem-solving skills — business leaders are trained in finance, not social reform; (4) People’s resistance — citizens dislike business meddling in community affairs.',
        ],
      },
      {
        id: 'c6_realities',
        title: 'The Realities of Modern Social Responsibility',
        summary:
          'Forces compelling contemporary corporations to adopt social obligations as a pragmatic necessity.',
        keyPoints: [
          'Threat of Public Regulations: Democratically elected governments enforce stringent environmental and consumer protection acts.',
          'Pressure of Labor Movement: Educated unions and workers reject arbitrary "hire and fire" regimes, demanding fair wages and workplace safety.',
          'Consumer Consciousness: Consumers readily leverage consumer courts and social media against defective goods or misleading advertisements.',
          'Development of Professional Managers: Management institutes educate executives to harmonize commercial profit with ethical standards.',
          'Synergy of Interests: Recognition that societal prosperity and corporate profitability are complementary rather than conflicting.',
        ],
      },
      {
        id: 'c6_kinds',
        title: 'Four Kinds of Social Responsibility',
        summary:
          'Categorization of obligations ranging from statutory minimums to philanthropic deeds.',
        keyPoints: [
          '1. Economic Responsibility: Producing goods/services desired by consumers and selling them at a profit to remain financially viable.',
          '2. Legal Responsibility: Operating strictly within the laws of the nation (paying taxes, honoring employment statutes).',
          '3. Ethical Responsibility: Conduct expected by society that is not formally codified by statutory law (e.g. respecting cultural sentiments in ads, truth in sales pitches).',
          '4. Discretionary Responsibility: Purely voluntary contributions assumed by the firm (e.g., funding schools, disaster relief donations, charitable foundations).',
        ],
      },
      {
        id: 'c6_stakeholders',
        title: 'Responsibility Towards Different Interest Groups',
        summary:
          'Specific duties owed to diverse corporate stakeholders.',
        keyPoints: [
          'Shareholders / Owners: Fair, stable dividend return on capital, ensuring security of invested funds, and providing accurate periodic financial reports.',
          'Workers / Employees: Meaningful work, safe working environment, fair living wages, democratic trade union rights, and career development.',
          'Consumers: Unadulterated goods of consistent quality, fair pricing, prompt grievance redressal, and avoiding deceptive promotions.',
          'Government & Community: Diligent and honest tax payments, compliance with state laws, pollution control, and community welfare.',
        ],
      },
      {
        id: 'c6_pollution',
        title: 'Environmental Protection & Pollution Control',
        summary:
          'Industrial waste disposal, 4 pollution types, and corporate rationale for green practices.',
        keyPoints: [
          'Types of Pollution: (1) Air (toxic gases like CO, smoke causing ozone depletion and acid rain); (2) Water (chemical dumping destroying aquatic ecology); (3) Land (hazardous industrial landfills making soil barren); (4) Noise (heavy factory engines and transport causing hearing loss and cardiovascular stress).',
          'Need for Pollution Control: Reduces catastrophic health hazards (cancer, lung disease); reduces legal liability and compensation penalties; yields cost savings via cleaner production technology; improves public corporate image.',
          'Business Action Steps: Top management environmental commitment, employee participation, waste recycling programs, compliance with state environmental laws, and regular environmental audits.',
        ],
      },
      {
        id: 'c6_elements_ethics',
        title: 'Elements of Business Ethics & Implementation',
        summary:
          'The five core pillars required to make business ethics operational in an enterprise.',
        keyPoints: [
          '1. Top Management Commitment: Senior leaders must personally model and uphold organizational ethical values.',
          '2. Publication of a "Code": Written ethics manual outlining expected conduct on honesty, safety, conflict of interest, and fair competition.',
          '3. Compliance Mechanism: Institutionalizing reporting hotlines, ethics committees, and monitoring protocols.',
          '4. Involving Employees at All Levels: Training programs ensuring all staff actively apply ethical guidelines.',
          '5. Measuring Results: Conducting regular ethics audits to gauge adherence and revise codes accordingly.',
        ],
      },
    ],
    hotsCases: [
      {
        id: 'hots_c6_1',
        scenario:
          'A fertilizer company secretly releases untreated toxic industrial effluent into a nearby river at night to avoid the capital cost of installing an Effluent Treatment Plant (ETP). Six months later, villagers suffer severe illnesses, aquatic life is destroyed, and the National Green Tribunal slaps a Rs. 50 crore penalty on the company.',
        question:
          'Identify the interest groups whose rights were violated. Explain how installing pollution control equipment would have reduced liability and costs for the firm.',
        answer:
          'The firm violated its social responsibility towards: (1) Community/Society (destroying clean water and public health), (2) Government (violating environmental laws), and (3) Shareholders (eroding value through huge regulatory penalties and reputational loss). Installing pollution control equipment would have: (a) Reduced Risk of Liability (preventing court fines and compensation claims), (b) Cost Saving (modern ETPs recycle water and by-products), and (c) Safeguarded Public Image.',
        conceptApplied: 'Need for Pollution Control & Reduced Liability',
      },
      {
        id: 'hots_c6_2',
        scenario:
          'A manufacturing company indulges in five practices: (a) Pays wages below the statutory minimum wage, (b) Sells adulterated cooking oil, (c) Falsifies balance sheets to evade corporate tax, (d) Emits dense black particulate smoke without scrubbers, (e) Charges differential inflated prices to vulnerable buyers.',
        question:
          'Identify which specific stakeholder group is victimized in each of the five instances.',
        answer:
          '(a) Underpaying workers violates responsibility towards Workers/Employees. (b) Adulterated product violates responsibility towards Consumers. (c) Falsifying books to evade tax violates responsibility towards the Government. (d) Emitting toxic black smoke violates responsibility towards Society and the Environment. (e) Unfair price discrimination violates responsibility towards Consumers.',
        conceptApplied: 'Social Responsibility Towards Different Stakeholder Groups',
      },
    ],
    gistOfLesson: [
      'Business draws human and natural resources from society and is obligated to align its operations with societal welfare.',
      'Social responsibility encompasses Economic, Legal, Ethical, and Discretionary obligations.',
      'Key stakeholders include Shareholders, Employees, Consumers, and the Government/Community.',
      'Environmental protection is an urgent imperative; pollution control reduces liabilities, curtails costs, and protects brand reputation.',
      'Business ethics requires top management commitment, a published code of conduct, compliance mechanisms, employee involvement, and regular audits.',
    ],
    quizQuestions: [
      {
        id: 'bst_c6_q1',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Which of the following is an example of Discretionary Social Responsibility?',
        options: [
          'Paying corporate income tax to the government on time',
          'Supplying goods at fair prices to consumers',
          'Providing voluntary donations and medical relief to earthquake victims',
          'Adhering to factory safety laws for industrial workers',
        ],
        correctIndex: 2,
        explanation:
          'Discretionary responsibility is purely voluntary and charitable in nature, such as donating relief supplies during natural disasters or funding schools.',
        topic: 'Kinds of Social Responsibility',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c6_q2',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Providing a fair return on invested capital and ensuring fund safety is a responsibility towards which interest group?',
        options: ['Consumers', 'Shareholders or Owners', 'Suppliers', 'Government'],
        correctIndex: 1,
        explanation:
          'Ensuring capital safety, regular dividends, and transparent disclosures is the business responsibility towards shareholders and owners.',
        topic: 'Stakeholder Responsibilities',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c6_q3',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Which argument AGAINST social responsibility is supported by the classical view of economists like Milton Friedman?',
        options: [
          'Lack of social skills among managers',
          'Violation of profit maximization objective',
          'Burden of charitable expenses passed to consumers',
          'All of the above',
        ],
        correctIndex: 3,
        explanation:
          'All three are primary arguments against social responsibility: violation of pure profit maximization, passing costs to consumers, and lack of specialized social skills.',
        topic: 'Arguments Against Social Responsibility',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c6_q4',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'What is the written formal document defining moral principles and standards of conduct for all enterprise employees called?',
        options: ['Articles of Association', 'Code of Ethics', 'Memorandum of Association', 'Prospectus'],
        correctIndex: 1,
        explanation:
          'A Code of Ethics is the official written compilation of moral principles and behavioural expectations published by a business enterprise.',
        topic: 'Elements of Business Ethics',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c6_q5',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'How does the installation of pollution control devices directly benefit a business in economic terms?',
        options: [
          'It guarantees monopoly status in the market',
          'It reduces legal compensation liabilities and generates cost savings through improved technology',
          'It completely eliminates the need for paying income tax',
          'It avoids hiring qualified factory workers',
        ],
        correctIndex: 1,
        explanation:
          'Installing pollution control devices reduces liability for toxic damage and promotes cost savings by adopting cleaner, waste-reducing production techniques.',
        topic: 'Need for Pollution Control',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c6_q6',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Operating strictly in accordance with statutory national laws is known as:',
        options: ['Economic Responsibility', 'Legal Responsibility', 'Discretionary Responsibility', 'Ethical Responsibility'],
        correctIndex: 1,
        explanation:
          'Operating within the laws of the land and being a law-abiding enterprise represents Legal Responsibility.',
        topic: 'Kinds of Social Responsibility',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c6_q7',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Respecting religious sentiments, human dignity, and avoiding false promises in advertising falls under:',
        options: ['Legal Responsibility', 'Ethical Responsibility', 'Economic Responsibility', 'Financial Responsibility'],
        correctIndex: 1,
        explanation:
          'Conduct that is expected by society’s moral standards but not explicitly commanded by statute constitutes Ethical Responsibility.',
        topic: 'Kinds of Social Responsibility',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c6_q8',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Which of the following is an essential element required to make business ethics truly effective in an enterprise?',
        options: [
          'Commitment exclusively by junior interns',
          'Top Management commitment and active involvement of employees at all levels',
          'Keeping the code of ethics strictly confidential from employees',
          'Avoiding audits of ethical performance',
        ],
        correctIndex: 1,
        explanation:
          'Top management commitment and pervasive involvement of employees across all organizational tiers are vital pillars of business ethics.',
        topic: 'Elements of Business Ethics',
        difficulty: 'Medium',
      },
      {
        id: 'bst_c6_q9',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Noise pollution caused by industrial generators and heavy equipment creates which major health hazard?',
        options: ['Ozone layer thinning', 'Hearing impairment and cardiovascular stress', 'Soil salinity', 'Eutrophication of lakes'],
        correctIndex: 1,
        explanation:
          'Excessive industrial and vehicular noise directly leads to hearing loss, heart irregularities, and mental anxiety.',
        topic: 'Types of Pollution',
        difficulty: 'Easy',
      },
      {
        id: 'bst_c6_q10',
        chapterNumber: 6,
        chapterTitle: 'Social Responsibilities of Business & Business Ethics',
        question: 'Which stakeholder group is directly protected when a firm strictly avoids hoarding, adulteration, and misleading advertisements?',
        options: ['Government', 'Suppliers', 'Consumers', 'Shareholders'],
        correctIndex: 2,
        explanation:
          'Avoiding product adulteration, artificial price inflation through hoarding, and misleading promotional claims is the business duty towards Consumers.',
        topic: 'Responsibility Towards Consumers',
        difficulty: 'Easy',
      },
    ],
  },
];
