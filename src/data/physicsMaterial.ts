export interface PhysicsQuizQuestion {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaUsed?: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PhysicsConcept {
  id: string;
  title: string;
  summary: string;
  formulas?: string[];
  keyPoints: string[];
  solvedExample?: {
    question: string;
    stepByStepSolution: string[];
    finalAnswer: string;
  };
}

export interface PhysicsChapterMaterial {
  chapterNumber: number;
  title: string;
  subtitle: string;
  overview: string;
  coreFormulas: { name: string; formula: string; explanation: string }[];
  concepts: PhysicsConcept[];
  graphicalAnalysis?: {
    title: string;
    description: string;
    keyTakeaway: string;
  }[];
  ncertExerciseHighlights: {
    questionNum: string;
    problem: string;
    solution: string;
  }[];
  quizQuestions: PhysicsQuizQuestion[];
}

export const physicsMaterialData: PhysicsChapterMaterial[] = [
  // CHAPTER 1: PHYSICAL WORLD
  {
    chapterNumber: 1,
    title: 'Physical World',
    subtitle: 'CBSE Class 11 Physics • Chapter 01 NCERT Solutions & Foundations',
    overview:
      'Physics is the study of the basic laws of nature and their manifestation in natural phenomena. This introductory chapter explores the scope and excitement of physics, the relationship between physics, technology, and society, fundamental forces of nature (Gravitational, Electromagnetic, Strong Nuclear, Weak Nuclear), conservation laws (energy, momentum, angular momentum, charge), and scientific inquiry philosophical perspectives.',
    coreFormulas: [
      {
        name: 'Mass-Energy Equivalence (Einstein)',
        formula: 'E = m c^2',
        explanation: 'Relates mass m and relativistic energy E via speed of light c (3 × 10^8 m/s).',
      },
      {
        name: 'Planck’s Photon Energy',
        formula: 'E = h \\nu',
        explanation: 'Energy of quantum radiation where h is Planck’s constant and \\nu is frequency.',
      },
      {
        name: 'Kinetic Energy',
        formula: 'K = \\frac{1}{2} m v^2',
        explanation: 'Work done to accelerate a body of mass m to velocity v from rest.',
      },
    ],
    concepts: [
      {
        id: 'phy_c1_comprehensible',
        title: 'Einstein’s Aphorism: "The most incomprehensible thing about the world is that it is comprehensible"',
        summary:
          'Explores why diverse and immense natural phenomena obey simple, universal mathematical physical laws.',
        keyPoints: [
          'The physical universe consists of billions of celestial bodies and complex micro-systems, yet they all adhere to a unified set of fundamental laws (gravitation, electromagnetism, thermodynamics).',
          'Human scientific observation, reasoning, and mathematical modeling allow human intelligence to comprehend, predict, and control these universal principles.',
        ],
      },
      {
        id: 'phy_c1_dirac_beauty',
        title: 'Dirac’s Perspective: Beauty in Physics Equations',
        summary:
          'P.A.M. Dirac observed that fundamental physics equations exhibit deep mathematical symmetry and elegance.',
        keyPoints: [
          'Simplicity and symmetry: Equations such as Maxwell’s equations, E = mc², and Dirac’s relativistic wave equation unite vast swathes of physics with minimalist beauty.',
          'Scientific validity still requires experimental verification: While elegance is a powerful heuristic for discovering laws, an equation must strictly agree with empirical measurements to be accepted as physical law.',
        ],
      },
      {
        id: 'phy_c1_science_tech_society',
        title: 'Physics, Technology and Industrial Revolutions',
        summary:
          'Technological leaps driving human civilization originated directly from physical discoveries.',
        keyPoints: [
          'First Industrial Revolution: Emerged from thermodynamics and the steam engine in England and Western Europe, coupled with Newtonian mechanics.',
          'Second (Contemporary) Industrial Revolution: Driven by semiconductors, silicon microprocessors, information technology, quantum optics, biotechnology, and robotics.',
          'Social Responsibility in Science: Discoveries must be applied for human welfare (e.g. medical imaging, solar clean energy, disease eradication) rather than destructive nuclear or biological warfare.',
        ],
      },
    ],
    ncertExerciseHighlights: [
      {
        questionNum: 'Ex 1.1',
        problem: 'What did Einstein mean by: "The most incomprehensible thing about the world is that it is comprehensible"?',
        solution:
          'The universe is immensely complex with diverse phenomena. Yet, through careful scientific observation and mathematical analysis, we discover that all phenomena obey universal, logical, and comprehensible physical laws.',
      },
      {
        questionNum: 'Ex 1.6',
        problem: 'Why do crab shells in a Japanese coastal region resemble a Samurai face (Carl Sagan’s Cosmos illustration)?',
        solution:
          'Artificial selection: Fishermen in honour of the dead Samurai threw back crabs whose shell patterns accidentally resembled a face. These crabs survived longer and reproduced, propagating the specific genetic trait across generations.',
      },
    ],
    quizQuestions: [
      {
        id: 'phy_c1_q1',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Which of the following is the weakest fundamental force in nature over macroscopic distances?',
        options: ['Strong Nuclear Force', 'Electromagnetic Force', 'Weak Nuclear Force', 'Gravitational Force'],
        correctIndex: 3,
        explanation:
          'Gravitational force is the weakest of all fundamental forces (relative strength ~10⁻³⁸ compared to strong nuclear force), though it dominates large celestial structures due to its infinite range and strictly attractive nature.',
        topic: 'Fundamental Forces',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c1_q2',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Which physical conservation law is a direct consequence of the homogeneity of time in physics?',
        options: ['Law of Conservation of Linear Momentum', 'Law of Conservation of Energy', 'Law of Conservation of Angular Momentum', 'Law of Conservation of Charge'],
        correctIndex: 1,
        explanation:
          'By Noether’s theorem, the symmetry of physical laws under time translation (homogeneity of time) yields the Law of Conservation of Energy.',
        topic: 'Conservation Laws',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c1_q3',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'The first Industrial Revolution in the 18th century was fundamentally catalyzed by the physical principles of:',
        options: ['Quantum Mechanics', 'Thermodynamics and Steam Engines', 'Nuclear Fission', 'Relativistic Electrodynamics'],
        correctIndex: 1,
        explanation:
          'The invention of the steam engine and developments in heat, work, and thermodynamics laid the mechanical foundation for the first Industrial Revolution.',
        topic: 'Physics & Technology',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c1_q4',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'The Heike crab shell evolution resembling a Samurai warrior illustrates which scientific principle?',
        options: ['Spontaneous Generation', 'Evolution by Artificial Selection', 'Lamarckian Inheritance', 'Radioactive Mutation'],
        correctIndex: 1,
        explanation:
          'Fishermen releasing crabs that resembled samurai faces caused artificial selection, ensuring those crabs survived and passed down their shell features.',
        topic: 'Scientific Method',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c1_q5',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Who formulated the famous relativistic mass-energy equivalence equation E = mc²?',
        options: ['Isaac Newton', 'Albert Einstein', 'P.A.M. Dirac', 'James Clerk Maxwell'],
        correctIndex: 1,
        explanation:
          'Albert Einstein deduced E = mc² as a direct consequence of Special Relativity in 1905.',
        topic: 'Famous Equations',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c1_q6',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'What is the range of the Strong Nuclear Force that binds protons and neutrons inside an atomic nucleus?',
        options: ['Infinite', 'About 10⁻¹⁵ m (1 fermi)', 'About 10⁻¹⁰ m (1 Å)', 'A few centimeters'],
        correctIndex: 1,
        explanation:
          'The strong nuclear force operates over extremely short nuclear distances of roughly 10⁻¹⁵ m (1 femtometer or fermi).',
        topic: 'Fundamental Forces',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c1_q7',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Which of the following contemporary fields is responsible for driving the modern "Second Industrial Revolution"?',
        options: ['Biotechnology and Supercomputers', 'Information Technology and Robotics', 'Super-conducting materials', 'All of the above'],
        correctIndex: 3,
        explanation:
          'The modern knowledge revolution is powered by biotechnology, supercomputers, robotics, IT, and room-temperature superconductors.',
        topic: 'Modern Physics and Society',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c1_q8',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'According to scientific philosophy, an intelligent assertion that "ghosts exist" is refuted scientifically because:',
        options: [
          'No repeatable experiments or physical phenomena exist that verify their presence',
          'Ghosts are too small to be seen under microscopes',
          'Science only studies planets',
          'Nobody has cameras in old buildings',
        ],
        correctIndex: 0,
        explanation:
          'While unobserved particles like electrons produce consistent, testable, and mathematically predictable physical effects, claims of ghosts lack any reproducible experimental verification.',
        topic: 'Nature of Science',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c1_q9',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Conservation of linear momentum is a manifestation of which fundamental space symmetry?',
        options: ['Isotropy of space', 'Homogeneity of space', 'Homogeneity of time', 'Lorentz Invariance'],
        correctIndex: 1,
        explanation:
          'Homogeneity of space (invariance of physical laws under spatial translation) corresponds to the conservation of linear momentum.',
        topic: 'Conservation Laws',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c1_q10',
        chapterNumber: 1,
        chapterTitle: 'Physical World',
        question: 'Which British physicist famously asserted: "It is more important to have beauty in the equations of physics than to have them agree with experiments"?',
        options: ['Michael Faraday', 'P. A. M. Dirac', 'Ernest Rutherford', 'J.J. Thomson'],
        correctIndex: 1,
        explanation:
          'Paul Dirac championed mathematical simplicity and aesthetic beauty as guiding criteria in theoretical physics.',
        topic: 'Historical Perspectives',
        difficulty: 'Medium',
      },
    ],
  },

  // CHAPTER 2: UNITS AND MEASUREMENTS
  {
    chapterNumber: 2,
    title: 'Units and Measurements',
    subtitle: 'CBSE Class 11 Physics • Chapter 02 Complete NCERT Solutions',
    overview:
      'Measurement of any physical quantity involves comparison with a standard unit. This chapter covers the SI unit system, dimensional analysis, significant figures, propagation of experimental errors, astronomical measurement techniques (parallax method, light year, parsec), and micro-scale estimations (atomic sizes, Avogadro hypothesis, nuclear density).',
    coreFormulas: [
      {
        name: 'Percentage Error Propagation',
        formula: 'P = \\frac{a^3 b^2}{\\sqrt{c} d} \\implies \\frac{\\Delta P}{P} = 3\\frac{\\Delta a}{a} + 2\\frac{\\Delta b}{b} + \\frac{1}{2}\\frac{\\Delta c}{c} + \\frac{\\Delta d}{d}',
        explanation: 'Powers multiply fractional errors when estimating maximum combined percentage error.',
      },
      {
        name: 'Parallax Distance Formula',
        formula: 'D = \\frac{b}{\\theta}',
        explanation: 'Distance D of a distant celestial body where b is the orbital baseline and \\theta is the parallax angle in radians.',
      },
      {
        name: '1 Parsec in Meters',
        formula: '1\\text{ pc} = \\frac{1.496 \\times 10^{11}\\text{ m}}{1\'\' (4.85 \\times 10^{-6}\\text{ rad})} \\approx 3.08 \\times 10^{16}\\text{ m}',
        explanation: 'Distance at which 1 AU subtends an angle of 1 second of arc (1 parsec = 3.26 light years).',
      },
      {
        name: 'Nuclear Radius Formula',
        formula: 'R = R_0 A^{1/3}',
        explanation: 'Empirical nuclear size where R_0 \\approx 1.2 \\times 10^{-15} m and A is mass number, proving nuclear density is constant (~2.3 × 10^17 kg/m^3).',
      },
    ],
    concepts: [
      {
        id: 'phy_c2_dimensions',
        title: 'Dimensional Analysis & Principle of Homogeneity',
        summary:
          'Only quantities with identical dimensions can be added, subtracted, or equated.',
        keyPoints: [
          'Trigonometric, exponential, and logarithmic functions must have purely dimensionless arguments: in y = a sin(vt), the argument vt has dimensions [L], which violates physical rules unless divided by a length or multiplied by time/period.',
          'Formula Testing: In the relativistic mass relation m = m_0 / (1 - v^2)^(1/2), 1 - v^2 is dimensionally invalid because 1 is dimensionless and v^2 has dimensions [L^2 T^-2]. The correct relation must be m = m_0 / \\sqrt{1 - v^2/c^2}.',
        ],
      },
      {
        id: 'phy_c2_sig_figs',
        title: 'Rules of Significant Figures & Rounding Off',
        summary:
          'Precise bookkeeping of measurement certainty.',
        keyPoints: [
          'All non-zero digits are significant.',
          'Zeroes between non-zero digits are always significant (e.g. 6.032 has 4 significant figures).',
          'Leading zeroes to the left of the first non-zero digit in numbers < 1 are NEVER significant (e.g. 0.007 has 1 sig fig; 0.0006032 has 4 sig figs).',
          'Trailing zeroes in a number with a decimal point ARE significant (e.g. 0.2370 has 4 sig figs; 6.320 J has 4 sig figs).',
          'In multiplication/division, the final product retains the least number of significant figures among the components. In addition/subtraction, the result retains the least number of decimal places.',
        ],
      },
      {
        id: 'phy_c2_astronomical_units',
        title: 'Astronomical Units: Light Year & Parsec',
        summary:
          'Measuring interstellar distances.',
        keyPoints: [
          '1 Light Year: Distance travelled by light in vacuum in 1 year = 3 × 10^8 m/s × 365.25 × 86400 s = 9.46 × 10^15 m.',
          '1 Parsec: Parallactic second = 3.08 × 10^16 m = 3.26 light years.',
          'Alpha Centauri is 4.29 light years away = 4.29 × (9.46 × 10^15) / (3.08 × 10^16) = 1.32 parsecs.',
        ],
      },
    ],
    ncertExerciseHighlights: [
      {
        questionNum: 'Ex 2.1(a)',
        problem: 'The volume of a cube of side 1 cm is equal to _____ m³.',
        solution: '1 cm = 10⁻² m. Volume = (10⁻² m)³ = 10⁻⁶ m³.',
      },
      {
        questionNum: 'Ex 2.1(c)',
        problem: 'A vehicle moving with a speed of 18 km/h covers _____ meters in 1 second.',
        solution: '18 km/h = 18 × (5/18) m/s = 5 m/s. In 1 second, distance = 5 m.',
      },
      {
        questionNum: 'Ex 2.13',
        problem: 'P = a³ b² / (√c · d). Given percentage errors: a=1%, b=3%, c=4%, d=2%. Find % error in P.',
        solution: 'ΔP/P = 3(1%) + 2(3%) + 1/2(4%) + 1(2%) = 3% + 6% + 2% + 2% = 13%.',
      },
      {
        questionNum: 'Ex 2.30',
        problem: 'SONAR echo from an enemy submarine takes 77.0 s. Speed of sound in water is 1450 m/s. Find distance.',
        solution: 'Time to reach submarine t = 77.0 / 2 = 38.5 s. Distance = 1450 m/s × 38.5 s = 55,825 m = 55.8 km.',
      },
    ],
    quizQuestions: [
      {
        id: 'phy_c2_q1',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'How many significant figures are present in the measured value 0.0006032 m²?',
        options: ['7', '6', '4', '5'],
        correctIndex: 2,
        explanation:
          'Leading zeros are not significant. Only 6, 0, 3, and 2 are significant, giving exactly 4 significant figures.',
        topic: 'Significant Figures',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c2_q2',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'If a physical quantity P is given by P = (a³ b²) / (√c · d), and percentage errors in a, b, c, d are 1%, 3%, 4%, and 2% respectively, the percentage error in P is:',
        options: ['10%', '13%', '15%', '7%'],
        correctIndex: 1,
        explanation:
          'ΔP/P = 3(Δa/a) + 2(Δb/b) + (1/2)(Δc/c) + (Δd/d) = 3(1%) + 2(3%) + 0.5(4%) + 2% = 3% + 6% + 2% + 2% = 13%.',
        topic: 'Error Analysis',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c2_q3',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'What is 1 parsec expressed in meters?',
        options: ['9.46 × 10¹⁵ m', '3.08 × 10¹⁶ m', '1.496 × 10¹¹ m', '3.84 × 10⁸ m'],
        correctIndex: 1,
        explanation:
          '1 parsec (parallactic second) is defined as 1 AU / 1 arcsecond = 1.496×10¹¹ / 4.85×10⁻⁶ ≈ 3.08 × 10¹⁶ m.',
        topic: 'Astronomical Distances',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c2_q4',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'Which of the following instruments has the highest precision for measuring small lengths?',
        options: [
          'A vernier caliper with 20 divisions on the sliding scale (LC = 0.01 cm)',
          'A screw gauge of pitch 1 mm and 100 divisions (LC = 0.001 cm)',
          'An optical instrument measuring within a wavelength of visible light (~10⁻⁵ cm)',
          'A standard wooden meter scale (LC = 0.1 cm)',
        ],
        correctIndex: 2,
        explanation:
          'An optical instrument measuring within a wavelength of light (~10⁻⁵ cm = 0.00001 cm) has the smallest least count, hence the highest precision.',
        topic: 'Measurement Precision',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c2_q5',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'Which of the following displacement formulas for periodic motion is dimensionally correct?',
        options: [
          'y = a sin(vt)',
          'y = (a/T) sin(t/a)',
          'y = a sin(2πt / T)',
          'y = (a√2) [sin(2πvt) + cos(2πa/t)]',
        ],
        correctIndex: 2,
        explanation:
          'The argument of trigonometric functions must be dimensionless. 2πt/T has dimensions [T]/[T] = M⁰L⁰T⁰, and y and a both have dimensions of length [L].',
        topic: 'Dimensional Homogeneity',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c2_q6',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'A SONAR transmits a pulse towards an enemy submarine and receives its echo after 77.0 s. Given speed of sound in water is 1450 m/s, the distance to the submarine is:',
        options: ['111.6 km', '55.8 km', '27.9 km', '77.0 km'],
        correctIndex: 1,
        explanation:
          'Echo time is two-way travel: d = v × (t / 2) = 1450 × (77.0 / 2) = 1450 × 38.5 = 55,825 m ≈ 55.8 km.',
        topic: 'Echo & Sonar Ranging',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c2_q7',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'The density of a sodium nucleus is approximately of the order of:',
        options: ['10³ kg/m³', '10⁷ kg/m³', '10¹⁷ kg/m³', '10²⁷ kg/m³'],
        correctIndex: 2,
        explanation:
          'Because nuclear radius follows R = R₀ A¹/³, the nuclear mass density is independent of mass number A and equals approximately 2.3 × 10¹⁷ kg/m³.',
        topic: 'Nuclear Density',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c2_q8',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'The mass of a grocer’s box is 2.300 kg. Two gold pieces of 20.15 g and 20.17 g are added. The total mass to correct significant figures is:',
        options: ['2.34032 kg', '2.34 kg', '2.3 kg', '2.340 kg'],
        correctIndex: 2,
        explanation:
          'In addition, the result must retain as many decimal places as the quantity with the least decimal places. The box is 2.300 kg (1 decimal place if converted, or 2.3 kg as measured on a grocer balance with 1 decimal digit). Hence 2.3 kg.',
        topic: 'Significant Figures in Operations',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c2_q9',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'Convert 1 calorie (4.2 J) into a new unit system where mass is α kg, length is β m, and time is γ s:',
        options: ['4.2 α β² γ⁻²', '4.2 α⁻¹ β⁻² γ²', '4.2 α² β⁻¹ γ', '4.2 α⁻² β γ⁻¹'],
        correctIndex: 1,
        explanation:
          '1 J = 1 kg m² s⁻². In new units, 1 kg = α⁻¹ unit, 1 m = β⁻¹ unit, 1 s = γ⁻¹ unit. Therefore 1 cal = 4.2 (α⁻¹)(β⁻²)(γ⁻²)⁻¹ = 4.2 α⁻¹ β⁻² γ².',
        topic: 'Unit Conversions',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c2_q10',
        chapterNumber: 2,
        chapterTitle: 'Units and Measurements',
        question: 'The nearest star to our solar system (Alpha Centauri) is 4.29 light years away. In parsecs, this distance is approximately:',
        options: ['1.32 parsec', '4.29 parsec', '3.08 parsec', '0.76 parsec'],
        correctIndex: 0,
        explanation:
          '1 light year ≈ 9.46 × 10¹⁵ m and 1 parsec ≈ 3.08 × 10¹⁶ m. Thus, (4.29 × 9.46 × 10¹⁵) / (3.08 × 10¹⁶) = 1.32 parsecs.',
        topic: 'Astronomical Units',
        difficulty: 'Medium',
      },
    ],
  },

  // CHAPTER 3: MOTION IN A STRAIGHT LINE
  {
    chapterNumber: 3,
    title: 'Motion in a Straight Line',
    subtitle: 'CBSE Class 11 Physics • Chapter 03 Complete NCERT Solutions',
    overview:
      'Kinematics deals with the description of motion without regard to its causes. This chapter examines position, path length, displacement, average velocity vs average speed, instantaneous velocity, uniform acceleration equations of motion ($v = u + at$, $s = ut + \\frac{1}{2}at^2$, $v^2 - u^2 = 2as$), distance in the $n^{\\text{th}}$ second, graphical interpretation ($x-t, v-t, a-t$), and relative velocity in one dimension.',
    coreFormulas: [
      {
        name: 'Equations of Uniformly Accelerated Motion',
        formula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 - u^2 = 2as',
        explanation: 'Three kinematic equations connecting initial velocity u, final velocity v, acceleration a, time t, and displacement s.',
      },
      {
        name: 'Distance in nth Second',
        formula: 'D_n = u + \\frac{a}{2}(2n - 1)',
        explanation: 'Linear relation with n during constant acceleration starting from rest.',
      },
      {
        name: 'Relative Velocity in 1D',
        formula: 'v_{BA} = v_B - v_A',
        explanation: 'Velocity of body B relative to body A along a straight line.',
      },
      {
        name: 'Vertical Projection Peak Height & Time',
        formula: 'h = \\frac{u^2}{2g}, \\quad t_{\\text{ascent}} = \\frac{u}{g}',
        explanation: 'For a projectile thrown straight upward against constant gravity g.',
      },
    ],
    concepts: [
      {
        id: 'phy_c3_point_object',
        title: 'Point Object Concept & Path Length vs Displacement',
        summary:
          'When an object’s dimensions are negligible compared to distance travelled.',
        keyPoints: [
          'Point Object: A railway carriage moving between two stations or a monkey on a circular track can be treated as a point object because their size is negligible compared to the travel distance. A spinning cricket ball that turns sharply or a tumbling beaker cannot.',
          'Path Length vs Displacement: Path length is total actual distance covered (scalar, always ≥ 0). Displacement is shortest vector distance from initial to final position. Path length ≥ |Displacement|; equality holds ONLY in unidirectional straight-line motion.',
        ],
      },
      {
        id: 'phy_c3_graphs',
        title: 'Graphical Kinematics: x-t and v-t Plots',
        summary:
          'Geometric meaning of slopes and areas in motion graphs.',
        keyPoints: [
          'Slope of x-t graph: Instantaneous velocity dx/dt.',
          'Slope of v-t graph: Instantaneous acceleration dv/dt.',
          'Area under v-t graph: Change in position (displacement) between time t1 and t2.',
          'Non-physical graphs: A graph with vertical loops or multiple positions at a single instant t is physically impossible. Speed-time graphs can NEVER have negative values.',
        ],
      },
      {
        id: 'phy_c3_relative_motion',
        title: 'Relative Velocity & Pursuit Problems',
        summary:
          'Analyzing frames of reference in pursuit and collision avoidance.',
        keyPoints: [
          'Jet Airplane Exhaust: A jet flies at 500 km/h and ejects combustion products at 1500 km/h relative to itself. To a stationary ground observer, products move at 1500 - 500 = 1000 km/h in the opposite direction.',
          'Police Van & Thief: Police van at 30 km/h (8.33 m/s) fires bullet with muzzle velocity 150 m/s at thief car fleeing at 192 km/h (53.33 m/s). Bullet strikes thief car at (150 + 8.33) - 53.33 = 105 m/s.',
          'Drunkard Walk: 5 steps forward (5 s), 3 steps backward (3 s) → net 2 m in 8 s. To reach pit at 13 m: 8 m is reached in 32 s; the next 5 steps take him directly into the pit at 13 m. Total time = 32 + 5 = 37 s!',
        ],
      },
    ],
    ncertExerciseHighlights: [
      {
        questionNum: 'Ex 3.4',
        problem: 'Drunkard takes 5 m forward (5s) and 3 m backward (3s). How long does he take to fall into a pit 13 m away?',
        solution: 'Net progress: 2 m in 8 s. After 4 cycles (32 s), he is at 8 m. In the next 5 s, he steps 5 m forward, reaching 13 m and falling in. Total time = 32 + 5 = 37 s.',
      },
      {
        questionNum: 'Ex 3.5',
        problem: 'Jet plane moves at 500 km/h and ejects exhaust gases at 1500 km/h relative to plane. Speed of exhaust relative to ground observer?',
        solution: 'v_exhaust,ground = v_exhaust,plane + v_plane = -1500 + 500 = -1000 km/h (1000 km/h opposite to jet motion).',
      },
      {
        questionNum: 'Ex 3.10',
        problem: 'A ball is thrown up with 29.4 m/s. (a) Direction of acceleration? (b) Height reached? (c) Total time to return? (g=9.8 m/s²)',
        solution: 'Acceleration is always 9.8 m/s² vertically downward. Max height h = u²/(2g) = (29.4)² / (19.6) = 44.1 m. Time of flight = 2u/g = 2(29.4)/9.8 = 6 s.',
      },
      {
        questionNum: 'Ex 3.18',
        problem: 'Police van at 30 km/h fires bullet at 150 m/s at a thief car at 192 km/h. Speed with which bullet hits thief’s car?',
        solution: 'v_van = 30 × (5/18) = 8.33 m/s. v_bullet,ground = 150 + 8.33 = 158.33 m/s. v_thief = 192 × (5/18) = 53.33 m/s. Relative hitting speed = 158.33 - 53.33 = 105 m/s.',
      },
    ],
    quizQuestions: [
      {
        id: 'phy_c3_q1',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A drunkard takes 5 steps forward (1m each in 1s) and 3 steps backward (1s each). How much time does he take to fall into a pit 13 m away?',
        options: ['52 s', '37 s', '40 s', '32 s'],
        correctIndex: 1,
        explanation:
          'Each 8 s cycle gives 2 m net advance. In 4 cycles (32 s), he covers 8 m. In the next 5 s he walks 5 m forward to reach 13 m and falls into the pit. Total time = 32 + 5 = 37 seconds.',
        topic: 'Kinematics & Periodic Steps',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c3_q2',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A police van moving at 30 km/h fires a bullet with muzzle velocity 150 m/s at a thief’s car fleeing at 192 km/h in the same direction. With what speed does the bullet hit the thief’s car?',
        options: ['150 m/s', '105 m/s', '125 m/s', '97 m/s'],
        correctIndex: 1,
        explanation:
          'v_van = 30 × 5/18 = 8.33 m/s. v_bullet = 150 + 8.33 = 158.33 m/s. v_thief = 192 × 5/18 = 53.33 m/s. Relative velocity = 158.33 - 53.33 = 105 m/s.',
        topic: 'Relative Velocity',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c3_q3',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A ball thrown vertically upward with initial speed 29.4 m/s reaches what maximum height? (Take g = 9.8 m/s²)',
        options: ['29.4 m', '44.1 m', '88.2 m', '14.7 m'],
        correctIndex: 1,
        explanation:
          'h = u² / (2g) = (29.4)² / (2 × 9.8) = 864.36 / 19.6 = 44.1 m.',
        topic: 'Motion Under Gravity',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c3_q4',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'Can a body have zero instantaneous speed and yet have non-zero acceleration?',
        options: [
          'Yes, at the highest point of a vertically projected body under gravity',
          'No, zero speed always implies zero acceleration',
          'Yes, but only in uniform circular motion',
          'No, acceleration is defined as speed divided by time',
        ],
        correctIndex: 0,
        explanation:
          'At maximum height, the instantaneous velocity of a vertically thrown object momentarily becomes zero, but the acceleration due to gravity (g = 9.8 m/s² downward) remains continuously active.',
        topic: 'Kinematic Concepts',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c3_q5',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A car moving at 126 km/h is brought to a stop within 200 m. What is the retardation of the car?',
        options: ['3.06 m/s²', '4.25 m/s²', '2.15 m/s²', '9.80 m/s²'],
        correctIndex: 0,
        explanation:
          'u = 126 × 5/18 = 35 m/s, v = 0, s = 200 m. v² - u² = 2as => 0 - (35)² = 2a(200) => a = -1225 / 400 = -3.06 m/s².',
        topic: 'Stopping Distance & Retardation',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c3_q6',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'Two towns are connected by bus service leaving every T minutes. A cyclist moving at 20 km/h is passed by a bus every 18 min in his direction, and every 6 min in the opposite direction. The bus service interval T is:',
        options: ['12 min', '9 min', '15 min', '18 min'],
        correctIndex: 1,
        explanation:
          '(V - 20) × 18/60 = VT/60 and (V + 20) × 6/60 = VT/60. Equating gives 18(V - 20) = 6(V + 20) => 3V - 60 = V + 20 => 2V = 80 => V = 40 km/h. Then T = 9 minutes.',
        topic: 'Relative Velocity Problems',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c3_q7',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'The area under a velocity-time (v-t) graph between time t1 and t2 represents:',
        options: ['Total acceleration', 'Instantaneous speed', 'Net displacement of the particle', 'Force acting on the particle'],
        correctIndex: 2,
        explanation:
          'The definite integral ∫ v dt over the time interval equals the change in position, which is the displacement.',
        topic: 'Graphical Analysis',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c3_q8',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A ball dropped from a height of 90 m on a floor loses one-tenth of its speed on each bounce. Its speed just before the first impact is:',
        options: ['42.0 m/s', '37.8 m/s', '30.0 m/s', '45.2 m/s'],
        correctIndex: 0,
        explanation:
          'v = √(2gh) = √(2 × 9.8 × 90) = √1764 = 42.0 m/s. (It rebounds with 9/10 × 42 = 37.8 m/s).',
        topic: 'Motion Under Gravity',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c3_q9',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'Two trains A and B of length 400 m each are moving at 72 km/h (20 m/s). Train B accelerates at 1 m/s² for 50 s until its guard brushes past the driver of train A. The initial distance between them was:',
        options: ['1000 m', '1250 m', '2250 m', '800 m'],
        correctIndex: 1,
        explanation:
          'Distance covered by train A: s_A = 20 × 50 = 1000 m. Distance covered by train B: s_B = 20(50) + 0.5(1)(50)² = 1000 + 1250 = 2250 m. Original distance = s_B - s_A = 2250 - 1000 = 1250 m.',
        topic: 'Equations of Motion',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c3_q10',
        chapterNumber: 3,
        chapterTitle: 'Motion in a Straight Line',
        question: 'A man walks 2.5 km to a market at 5 km/h (30 min). Finding it closed, he instantly walks back at 7.5 km/h (20 min). His average speed for the whole 50 min journey is:',
        options: ['0 km/h', '5.0 km/h', '6.0 km/h', '6.25 km/h'],
        correctIndex: 2,
        explanation:
          'Total distance = 2.5 + 2.5 = 5 km. Total time = 30 + 20 = 50 min = 50/60 h = 5/6 h. Average speed = 5 / (5/6) = 6.0 km/h. (His average velocity was 0 km/h).',
        topic: 'Average Speed vs Average Velocity',
        difficulty: 'Medium',
      },
    ],
  },

  // CHAPTER 4: MOTION IN A PLANE
  {
    chapterNumber: 4,
    title: 'Motion in a Plane (Vectors & Projectiles)',
    subtitle: 'CBSE Class 11 Physics • Chapter 04 Complete NCERT Solutions',
    overview:
      'Motion in two dimensions requires vector algebra. This chapter covers scalar and vector distinctions, triangle and parallelogram laws of addition, vector resolution into Cartesian components (i, j), projectile motion kinematics (time of flight, trajectory parabola, maximum height, horizontal range), relative velocity in 2D (rain-umbrella, river-boat swimmer, wind-flag), and uniform circular motion with centripetal acceleration.',
    coreFormulas: [
      {
        name: 'Projectile Maximum Height',
        formula: 'h_m = \\frac{u^2 \\sin^2 \\theta}{2g}',
        explanation: 'Vertical peak achieved by a projectile launched at angle \\theta with velocity u.',
      },
      {
        name: 'Projectile Horizontal Range',
        formula: 'R = \\frac{u^2 \\sin 2\\theta}{g}',
        explanation: 'Total horizontal distance covered; maximum range occurs at \\theta = 45^\\circ (R_{\\text{max}} = u^2/g).',
      },
      {
        name: 'Height-Range Angle Identity',
        formula: '\\tan \\theta = \\frac{4 h_m}{R}',
        explanation: 'Direct trigonometric link connecting launch angle \\theta to max height and horizontal range.',
      },
      {
        name: 'Centripetal Acceleration in UCM',
        formula: 'a_c = \\frac{v^2}{r} = \\omega^2 r = 4\\pi^2 \\nu^2 r',
        explanation: 'Radial acceleration directed toward the center of a circular path of radius r at linear speed v and frequency \\nu.',
      },
    ],
    concepts: [
      {
        id: 'phy_c4_scalars_vectors',
        title: 'Scalars vs Vectors & Vector Algebra Rules',
        summary:
          'Distinguishing magnitude-only quantities from directional entities obeying vector addition.',
        keyPoints: [
          'Scalars: Mass, volume, speed, density, temperature, energy, electric current (current has direction but adds algebraically, not vectorially).',
          'Vectors: Displacement, velocity, acceleration, force, impulse, magnetic moment.',
          'Vector Inequalities: For any two vectors a and b: |a + b| ≤ |a| + |b|, |a + b| ≥ ||a| - |b||, |a - b| ≤ |a| + |b|, |a - b| ≥ ||a| - |b||. Equality holds when vectors are collinear.',
        ],
      },
      {
        id: 'phy_c4_projectile',
        title: 'Projectile Motion Kinematics',
        summary:
          'Two-dimensional motion under constant gravitational acceleration.',
        keyPoints: [
          'Horizontal motion: Uniform velocity v_x = u cos θ with zero horizontal acceleration.',
          'Vertical motion: Uniform acceleration a_y = -g under gravity.',
          'Ceiling Constraint (Ex 4.15): In a hall of height 25 m, a ball thrown at 40 m/s can clear the ceiling if u² sin²θ / (2g) ≤ 25 m, giving sin θ = 0.5534 (θ = 33.6°). Max horizontal distance R = u² sin(2θ) / g = 150.5 m.',
          'Cricketer Throw (Ex 4.16): If max horizontal range R_max = u²/g = 100 m, thrown vertically upward it reaches H = u² / (2g) = R_max / 2 = 50 m.',
        ],
      },
      {
        id: 'phy_c4_relative_2d',
        title: '2D Relative Velocity: Rain, Swimmer & Wind',
        summary:
          'Relative velocity vector subtraction v_AB = v_A - v_B in 2 dimensions.',
        keyPoints: [
          'Rain and Umbrella: Rain falling vertically at v_r and woman cycling horizontally at v_c. Relative velocity of rain w.r.t woman is v_rel = v_r - v_c. She must tilt her umbrella at tan θ = v_c / v_r with the vertical towards the direction of cycling.',
          'River-Swimmer: Swimmer swimming perpendicular to current with speed v_s in river flowing at v_r. Crossing time depends ONLY on river width and swimmer speed: t = w / v_s. Downstream drift = v_r × t.',
          'Wind and Boat Flag: When boat moves at v_b in wind of velocity v_w, flag flutters along relative velocity of wind w.r.t boat: v_wb = v_w - v_b.',
        ],
      },
    ],
    ncertExerciseHighlights: [
      {
        questionNum: 'Ex 4.12',
        problem: 'Rain falls vertically at 30 m/s. Woman rides bicycle at 10 m/s south. Direction to hold umbrella?',
        solution: 'Relative velocity of rain w.r.t cyclist: tan θ = v_cyclist / v_rain = 10 / 30 = 1/3 ≈ 0.333. θ = tan⁻¹(0.333) ≈ 18° south of vertical.',
      },
      {
        questionNum: 'Ex 4.13',
        problem: 'Man swims at 4.0 km/h in still water across 1.0 km wide river flowing at 3.0 km/h. Find crossing time and drift.',
        solution: 'Time to cross = Width / v_man = 1.0 km / 4.0 km/h = 0.25 h = 15 min. Downstream drift = v_river × t = 3.0 km/h × 0.25 h = 0.75 km = 750 m.',
      },
      {
        questionNum: 'Ex 4.16',
        problem: 'A cricketer can throw a ball to maximum horizontal distance of 100 m. How high can he throw the same ball vertically?',
        solution: 'R_max = u² / g = 100 m. Vertical height H_max = u² / (2g) = R_max / 2 = 100 / 2 = 50 m.',
      },
      {
        questionNum: 'Ex 4.17',
        problem: 'Stone whirled on 80 cm string makes 14 revolutions in 25 s. Magnitude and direction of acceleration?',
        solution: 'Frequency ν = 14/25 Hz. ω = 2πν = 2(22/7)(14/25) = 88/25 rad/s. Centripetal acceleration a_c = ω² r = (88/25)² × 0.8 ≈ 9.91 m/s² directed toward the center.',
      },
    ],
    quizQuestions: [
      {
        id: 'phy_c4_q1',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'Which of the following physical quantities is a vector?',
        options: ['Electric current', 'Total path length', 'Impulse', 'Gravitational potential'],
        correctIndex: 2,
        explanation:
          'Impulse equals the product of force (vector) and time (scalar), making it a vector quantity. Electric current, path length, and potential are scalars.',
        topic: 'Scalars vs Vectors',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c4_q2',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'Rain is falling vertically at 30 m/s and a cyclist rides south at 10 m/s. At what angle with the vertical must the umbrella be held?',
        options: ['tan⁻¹(3) ≈ 71.6°', 'tan⁻¹(1/3) ≈ 18.4°', '45°', '30°'],
        correctIndex: 1,
        explanation:
          'tan θ = v_cyclist / v_rain = 10 / 30 = 1/3 ≈ 0.333 => θ ≈ 18.4° towards the south.',
        topic: 'Relative Velocity 2D',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c4_q3',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'A cricketer can throw a cricket ball to a maximum horizontal distance of 100 m. How high above the ground can he throw the same ball?',
        options: ['100 m', '50 m', '25 m', '200 m'],
        correctIndex: 1,
        explanation:
          'R_max = u²/g = 100 m. Maximum vertical height H = u²/(2g) = R_max / 2 = 100 / 2 = 50 m.',
        topic: 'Projectile Motion',
        difficulty: 'Easy',
      },
      {
        id: 'phy_c4_q4',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'A swimmer can swim at 4.0 km/h in still water across a 1.0 km wide river flowing steadily at 3.0 km/h. If he heads normal to the bank, his downstream drift upon reaching the opposite bank is:',
        options: ['1000 m', '750 m', '500 m', '333 m'],
        correctIndex: 1,
        explanation:
          'Crossing time t = 1.0 km / 4.0 km/h = 0.25 h (15 min). Drift down the river = v_river × t = 3.0 km/h × 0.25 h = 0.75 km = 750 m.',
        topic: 'River Swimmer Problem',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c4_q5',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'For a projectile launched with speed u at angle θ, what is the mathematical relationship connecting maximum height h_m and horizontal range R?',
        options: ['tan θ = h_m / R', 'tan θ = 4 h_m / R', 'tan θ = 2 h_m / R', 'tan θ = h_m / (4 R)'],
        correctIndex: 1,
        explanation:
          'h_m = u² sin²θ / (2g) and R = 2 u² sin θ cos θ / g. Dividing gives h_m / R = (sin²θ / 2) / (2 sin θ cos θ) = (tan θ) / 4 => tan θ = 4 h_m / R.',
        topic: 'Projectile Formulas',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c4_q6',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'A stone tied to an 80 cm string makes 14 revolutions in 25 s in a horizontal circle. What is its centripetal acceleration?',
        options: ['9.91 m/s²', '4.95 m/s²', '19.8 m/s²', '0.80 m/s²'],
        correctIndex: 0,
        explanation:
          'ω = 2π(14/25) = 88/25 rad/s. a_c = ω² r = (88/25)² × 0.8 = 12.39 × 0.8 ≈ 9.91 m/s² directed radially inward.',
        topic: 'Circular Motion',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c4_q7',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'An aircraft executes a horizontal loop of radius 1.00 km at 900 km/h (250 m/s). What is the ratio of its centripetal acceleration to g (9.8 m/s²)?',
        options: ['12.5', '6.38', '25.5', '1.00'],
        correctIndex: 1,
        explanation:
          'a_c = v² / r = (250)² / 1000 = 62500 / 1000 = 62.5 m/s². Ratio a_c / g = 62.5 / 9.8 ≈ 6.38.',
        topic: 'Circular Motion',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c4_q8',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'In uniform circular motion (UCM), the average acceleration vector over one complete cycle is:',
        options: ['v² / r radially inward', 'v² / r along the tangent', 'A null vector', 'Infinite'],
        correctIndex: 2,
        explanation:
          'While the magnitude of centripetal acceleration is constant (v²/r), its direction continuously rotates uniformly through 360°, so its vector sum/average over one complete revolution is zero (null vector).',
        topic: 'Circular Motion Concepts',
        difficulty: 'Medium',
      },
      {
        id: 'phy_c4_q9',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'Given four vectors such that a + b + c + d = 0, which statement is always mathematically true?',
        options: [
          'a, b, c, and d must each be a null vector',
          'The magnitude of (a + c) equals the magnitude of (b + d)',
          'The magnitude of a can exceed the sum of magnitudes of b, c, and d',
          'All four vectors must be parallel to each other',
        ],
        correctIndex: 1,
        explanation:
          'a + c = -(b + d). Taking modulus on both sides gives |a + c| = |-(b + d)| = |b + d|.',
        topic: 'Vector Algebra',
        difficulty: 'Hard',
      },
      {
        id: 'phy_c4_q10',
        chapterNumber: 4,
        chapterTitle: 'Motion in a Plane',
        question: 'A bullet fired at 30° hits the ground 3.0 km away. With the same muzzle velocity, can it hit a target 5.0 km away?',
        options: [
          'Yes, by firing at 45°',
          'No, the maximum achievable range is only 3.46 km',
          'Yes, by firing vertically',
          'Yes, if fired at 60°',
        ],
        correctIndex: 1,
        explanation:
          'R = u² sin(2θ)/g => 3 = (u²/g) sin 60° = (u²/g)(√3/2) => u²/g = 6/√3 = 2√3 ≈ 3.46 km. The maximum range R_max = u²/g = 3.46 km, which cannot reach 5.0 km.',
        topic: 'Projectile Range',
        difficulty: 'Hard',
      },
    ],
  },
];
