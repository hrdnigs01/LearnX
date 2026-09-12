export interface MathQuizQuestion {
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

export interface MathFormula {
  title: string;
  formula: string;
  description: string;
}

export interface MathConcept {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  formulas?: MathFormula[];
  example?: {
    problem: string;
    solution: string;
  };
}

export interface MathChapterMaterial {
  chapterNumber: number;
  title: string;
  subtitle: string;
  pageCount: number;
  overview: string;
  coreFormulas: MathFormula[];
  concepts: MathConcept[];
  quizQuestions: MathQuizQuestion[];
  quickRevisionBulletins: string[];
}

export const mathematicsStudyMaterialData: MathChapterMaterial[] = [
  // CHAPTER 1: SETS
  {
    chapterNumber: 1,
    title: 'Sets',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 01',
    pageCount: 23,
    overview:
      'A set is a well-defined collection of distinct objects. Developed by Georg Cantor, set theory serves as the universal foundation for modern relations, functions, probability, and advanced calculus.',
    coreFormulas: [
      { title: 'Subset Count', formula: 'n(P(A)) = 2^n', description: 'Total number of subsets (Power Set) of a set with n elements' },
      { title: 'Union & Intersection', formula: 'n(A ∪ B) = n(A) + n(B) - n(A ∩ B)', description: 'Cardinality of union of two finite sets' },
      { title: 'De Morgan’s First Law', formula: '(A ∪ B)′ = A′ ∩ B′', description: 'The complement of a union is the intersection of complements' },
      { title: 'De Morgan’s Second Law', formula: '(A ∩ B)′ = A′ ∪ B′', description: 'The complement of an intersection is the union of complements' },
      { title: 'Difference of Sets', formula: 'A - B = A ∩ B′', description: 'Elements belonging to A but not to B' },
    ],
    concepts: [
      {
        id: 'sets_rep',
        title: 'Representation of Sets & Types',
        summary: 'Sets can be described via Roster (Tabular) form or Set-builder form. Special sets include Empty/Null set ∅, Singleton sets, Finite and Infinite sets.',
        keyPoints: [
          'Roster Form: Elements are listed within braces separated by commas without repetition, e.g., {1, 2, 3}.',
          'Set-builder Form: Specifies the defining characteristic property, e.g., {x : x ∈ N and x < 5}.',
          'Empty / Void / Null Set (∅): A set containing zero elements, e.g., {x : x ∈ N and 1 < x < 2}.',
          'Equal Sets: Two sets A and B are equal (A = B) iff every element of A is in B and vice-versa.',
          'Subsets: A ⊂ B if a ∈ A ⇒ a ∈ B. Every set is a subset of itself (A ⊂ A) and ∅ is a subset of every set.',
          'Intervals: (a, b) open interval {x: a < x < b}, [a, b] closed interval {x: a ≤ x ≤ b}.',
        ],
      },
      {
        id: 'sets_ops',
        title: 'Venn Diagrams & Set Operations',
        summary: 'Operations include Union, Intersection, Difference, and Complementation. Visualized through Venn diagrams named after John Venn.',
        keyPoints: [
          'Union (A ∪ B): {x : x ∈ A or x ∈ B}. Commutative, associative, idempotent.',
          'Intersection (A ∩ B): {x : x ∈ A and x ∈ B}. If A ∩ B = ∅, A and B are disjoint sets.',
          'Complement (A′): Elements in universal set U that do not belong to A (U - A).',
          '(A′)′ = A, A ∪ A′ = U, A ∩ A′ = ∅, ∅′ = U, U′ = ∅.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch1_q1',
        chapterNumber: 1,
        chapterTitle: 'Sets',
        question: 'If a set A contains 4 elements, what is the total number of subsets of A?',
        options: ['8', '12', '16', '32'],
        correctIndex: 2,
        explanation: 'The number of subsets of a set with n elements is given by 2^n. For n = 4, total subsets = 2^4 = 16.',
        topic: 'Power Set & Subsets',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch1_q2',
        chapterNumber: 1,
        chapterTitle: 'Sets',
        question: 'Which of the following represents an empty (null) set?',
        options: [
          '{x : x is an even prime number > 2}',
          '{x : x is an even prime number}',
          '{0}',
          '{x : x ∈ R and x^2 - 4 = 0}',
        ],
        correctIndex: 0,
        explanation: '2 is the only even prime number. Hence the set of even primes greater than 2 has no elements, which is the empty set ∅.',
        topic: 'Empty Set',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch1_q3',
        chapterNumber: 1,
        chapterTitle: 'Sets',
        question: 'According to De Morgan’s Law, (A ∪ B)′ is equal to:',
        options: ['A′ ∪ B′', 'A′ ∩ B′', 'A ∩ B', 'A - B'],
        correctIndex: 1,
        explanation: 'De Morgan’s first law states that the complement of the union of two sets is the intersection of their complements: (A ∪ B)′ = A′ ∩ B′.',
        topic: 'De Morgan’s Laws',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch1_q4',
        chapterNumber: 1,
        chapterTitle: 'Sets',
        question: 'If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, what is A - B?',
        options: ['{5, 6}', '{1, 2}', '{3, 4}', '{1, 2, 5, 6}'],
        correctIndex: 1,
        explanation: 'The difference A - B is the set of elements in A that are not in B. Here elements 3 and 4 are removed from A, giving {1, 2}.',
        topic: 'Difference of Sets',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch1_q5',
        chapterNumber: 1,
        chapterTitle: 'Sets',
        question: 'If n(A) = 40, n(B) = 30, and n(A ∩ B) = 10, find n(A ∪ B):',
        options: ['50', '60', '70', '80'],
        correctIndex: 1,
        explanation: 'n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = 40 + 30 - 10 = 60.',
        topic: 'Cardinality Formula',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'A set is a well-defined collection of distinct objects; order of elements in roster form is immaterial.',
      'Empty set ∅ has 0 elements; its power set P(∅) contains 1 element, namely {∅}.',
      'The number of proper subsets of a set of n elements is 2^n - 1.',
      'Intersection distributes over union: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
    ],
  },

  // CHAPTER 2: RELATIONS AND FUNCTIONS
  {
    chapterNumber: 2,
    title: 'Relations and Functions',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 02',
    pageCount: 19,
    overview:
      'Introduces Cartesian products of sets, relations as subsets of Cartesian products, and functions as special relations where each domain element has exactly one unique image.',
    coreFormulas: [
      { title: 'Cartesian Product Size', formula: 'n(A × B) = n(A) · n(B) = pq', description: 'Total number of ordered pairs in Cartesian product' },
      { title: 'Total Number of Relations', formula: 'Total Relations = 2^(pq)', description: 'Number of possible subsets of A × B' },
      { title: 'Identity Function', formula: 'f(x) = x, Domain = R, Range = R', description: 'Straight line passing through origin at 45°' },
      { title: 'Modulus Function', formula: 'f(x) = |x| = x for x ≥ 0, -x for x < 0', description: 'V-shaped curve with Domain = R, Range = [0, ∞)' },
      { title: 'Signum Function', formula: 'sgn(x) = 1 (x>0), 0 (x=0), -1 (x<0)', description: 'Step function with Domain = R, Range = {-1, 0, 1}' },
      { title: 'Greatest Integer Function', formula: 'f(x) = [x]', description: 'Greatest integer ≤ x, step graph with Range = Z' },
    ],
    concepts: [
      {
        id: 'rel_func_def',
        title: 'Cartesian Product & Relations',
        summary: 'Cartesian product P × Q is set of all ordered pairs (p, q). A relation R is any subset of P × Q.',
        keyPoints: [
          'Ordered pair (a, b) = (c, d) iff a = c and b = d.',
          'Domain: Set of all first elements in ordered pairs of R.',
          'Range: Set of all second elements in ordered pairs of R.',
          'Codomain: The entire destination set B (Range ⊆ Codomain).',
        ],
      },
      {
        id: 'func_types',
        title: 'Definition & Types of Functions',
        summary: 'A relation f: A → B is a function if every element of A has one and only one image in B.',
        keyPoints: [
          'No two distinct ordered pairs in f have the same first element.',
          'Rational function f(x) = g(x)/h(x) defined where h(x) ≠ 0.',
          'Algebra of real functions: (f ± g)(x) = f(x) ± g(x), (fg)(x) = f(x)g(x), (f/g)(x) = f(x)/g(x) when g(x) ≠ 0.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch2_q1',
        chapterNumber: 2,
        chapterTitle: 'Relations and Functions',
        question: 'If set A has 3 elements and set B has 2 elements, how many relations can be defined from A to B?',
        options: ['6', '36', '64', '128'],
        correctIndex: 2,
        explanation: 'n(A × B) = 3 × 2 = 6. Total number of subsets of A × B is 2^6 = 64. Hence, 64 distinct relations can be defined.',
        topic: 'Number of Relations',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch2_q2',
        chapterNumber: 2,
        chapterTitle: 'Relations and Functions',
        question: 'What is the range of the Signum function f(x) = sgn(x)?',
        options: ['R (all real numbers)', '[-1, 1]', '{-1, 0, 1}', '[0, ∞)'],
        correctIndex: 2,
        explanation: 'The signum function takes only 3 discrete values: +1 for x > 0, 0 for x = 0, and -1 for x < 0. Thus its range is {-1, 0, 1}.',
        topic: 'Signum Function',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch2_q3',
        chapterNumber: 2,
        chapterTitle: 'Relations and Functions',
        question: 'Find the domain of the real function f(x) = 1 / √(9 - x^2):',
        options: ['[-3, 3]', '(-3, 3)', '(-∞, -3) ∪ (3, ∞)', 'R - {3, -3}'],
        correctIndex: 1,
        explanation: 'For the square root in denominator to be defined and real, 9 - x^2 > 0 ⇒ x^2 < 9 ⇒ -3 < x < 3, which is the open interval (-3, 3).',
        topic: 'Domain of Real Functions',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch2_q4',
        chapterNumber: 2,
        chapterTitle: 'Relations and Functions',
        question: 'Which of the following relations represents a valid function?',
        options: [
          '{(2, 1), (2, 3), (3, 4)}',
          '{(1, 2), (2, 3), (3, 4), (4, 5)}',
          '{(3, 1), (3, 2), (3, 3)}',
          '{(1, 5), (2, 6), (1, 7)}',
        ],
        correctIndex: 1,
        explanation: 'In a function, no two distinct ordered pairs can share the same first element. Only {(1, 2), (2, 3), (3, 4), (4, 5)} has unique first elements.',
        topic: 'Function Criteria',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'A relation R ⊆ A × B is a function iff every x ∈ A has exactly one image y ∈ B.',
      'Modulus function |x| has domain R and range [0, ∞).',
      'Greatest integer function [2.7] = 2, [-1.3] = -2.',
    ],
  },

  // CHAPTER 3: TRIGONOMETRIC FUNCTIONS
  {
    chapterNumber: 3,
    title: 'Trigonometric Functions',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 03',
    pageCount: 33,
    overview:
      'Extends trigonometry from right triangles to general real functions on unit circles. Covers radian measure, signs in quadrants, compound angle formulas, multiple angle identities, and product-to-sum transformations.',
    coreFormulas: [
      { title: 'Arc Length & Radian Angle', formula: 'l = r θ (θ in radians)', description: 'Length of arc subtending angle θ at centre of circle of radius r' },
      { title: 'Degree-Radian Conversion', formula: 'π radians = 180°, 1 rad ≈ 57° 16′', description: 'Radian = (π / 180) × Degree' },
      { title: 'Cosine of Sum/Diff', formula: 'cos(x ± y) = cos x cos y ∓ sin x sin y', description: 'Fundamental cosine addition/subtraction theorem' },
      { title: 'Sine of Sum/Diff', formula: 'sin(x ± y) = sin x cos y ± cos x sin y', description: 'Fundamental sine addition/subtraction theorem' },
      { title: 'Double Angle Sine', formula: 'sin 2x = 2 sin x cos x = 2 tan x / (1 + tan^2 x)', description: 'Double angle expansion for sine' },
      { title: 'Double Angle Cosine', formula: 'cos 2x = cos^2 x - sin^2 x = 2 cos^2 x - 1 = 1 - 2 sin^2 x = (1 - tan^2 x)/(1 + tan^2 x)', description: 'Four standard forms of cos 2x' },
      { title: 'Triple Angle Formulas', formula: 'sin 3x = 3 sin x - 4 sin^3 x; cos 3x = 4 cos^3 x - 3 cos x', description: 'Triple angle identities' },
      { title: 'Sum to Product (C-D Formulas)', formula: 'sin C + sin D = 2 sin((C+D)/2) cos((C-D)/2); cos C + cos D = 2 cos((C+D)/2) cos((C-D)/2)', description: 'Converting trigonometric sums to products' },
    ],
    concepts: [
      {
        id: 'trig_quadrants',
        title: 'Quadrant Rule & Signs (ASTC)',
        summary: 'All Students Take Coffee rule dictates positive trigonometric ratios across four quadrants.',
        keyPoints: [
          'Quadrant I (0 to π/2): All ratios positive.',
          'Quadrant II (π/2 to π): Sine and Cosecant positive; others negative.',
          'Quadrant III (π to 3π/2): Tangent and Cotangent positive; others negative.',
          'Quadrant IV (3π/2 to 2π): Cosine and Secant positive; others negative.',
          'sin(-x) = -sin x, cos(-x) = cos x (even function), tan(-x) = -tan x.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch3_q1',
        chapterNumber: 3,
        chapterTitle: 'Trigonometric Functions',
        question: 'What is the radian measure corresponding to 240°?',
        options: ['3π/4', '4π/3', '5π/3', '7π/6'],
        correctIndex: 1,
        explanation: 'Radian measure = (π / 180) × 240 = 240π / 180 = 4π / 3.',
        topic: 'Degree to Radian',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch3_q2',
        chapterNumber: 3,
        chapterTitle: 'Trigonometric Functions',
        question: 'If cos x = -3/5 and x lies in the third quadrant, what is the value of sin x?',
        options: ['4/5', '-4/5', '3/4', '-5/4'],
        correctIndex: 1,
        explanation: 'sin^2 x = 1 - cos^2 x = 1 - 9/25 = 16/25. In the III quadrant, sine is negative, so sin x = -√(16/25) = -4/5.',
        topic: 'Signs in Quadrants',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch3_q3',
        chapterNumber: 3,
        chapterTitle: 'Trigonometric Functions',
        question: 'Evaluate the exact value of sin 15°:',
        options: ['(√3 - 1) / (2√2)', '(√3 + 1) / (2√2)', '(√6 - √2) / 2', '(√3 - 1) / 2'],
        correctIndex: 0,
        explanation: 'sin 15° = sin(45° - 30°) = sin 45° cos 30° - cos 45° sin 30° = (1/√2)(√3/2) - (1/√2)(1/2) = (√3 - 1) / (2√2).',
        topic: 'Compound Angle Expansion',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch3_q4',
        chapterNumber: 3,
        chapterTitle: 'Trigonometric Functions',
        question: 'The value of tan(π/8) is equal to:',
        options: ['√2 + 1', '√2 - 1', '1 - √2', '√3 - 1'],
        correctIndex: 1,
        explanation: 'Let x = π/8 ⇒ 2x = π/4. tan(π/4) = 1 = 2tan x / (1 - tan^2 x) ⇒ y^2 + 2y - 1 = 0 ⇒ y = -1 ± √2. Since π/8 is in Quad I, tan(π/8) = √2 - 1.',
        topic: 'Half Angle Tangent',
        difficulty: 'Hard',
      },
      {
        id: 'math_ch3_q5',
        chapterNumber: 3,
        chapterTitle: 'Trigonometric Functions',
        question: 'Find the value of cos 4x in terms of sin x and cos x:',
        options: ['1 - 4 sin^2 x cos^2 x', '1 - 8 sin^2 x cos^2 x', '8 cos^4 x - 1', '1 - 2 sin^2 2x'],
        correctIndex: 1,
        explanation: 'cos 4x = 1 - 2 sin^2 2x = 1 - 2(2 sin x cos x)^2 = 1 - 8 sin^2 x cos^2 x.',
        topic: 'Multiple Angle Identities',
        difficulty: 'Medium',
      },
    ],
    quickRevisionBulletins: [
      'l = r θ works ONLY when θ is in radians.',
      'sin(nπ) = 0 for all n ∈ Z; cos((2n+1)π/2) = 0.',
      'cos(–x) = cos x, but sin(–x) = –sin x.',
      'tan 2x = 2 tan x / (1 - tan^2 x).',
    ],
  },

  // CHAPTER 4: COMPLEX NUMBERS AND QUADRATIC EQUATIONS
  {
    chapterNumber: 4,
    title: 'Complex Numbers and Quadratic Equations',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 04',
    pageCount: 13,
    overview:
      'Extends the real number system to include solutions to x^2 + 1 = 0 by defining the imaginary unit i = √(-1). Studies algebra of complex numbers, modulus, conjugate, multiplicative inverse, and Argand plane.',
    coreFormulas: [
      { title: 'Imaginary Unit', formula: 'i^2 = -1, i^3 = -i, i^4 = 1, i^(4k) = 1', description: 'Cyclic powers of i with period 4' },
      { title: 'Modulus of Complex Number', formula: '|z| = √(a^2 + b^2)', description: 'Geometric distance from origin in Argand plane' },
      { title: 'Conjugate of z', formula: 'z̄ = a - ib for z = a + ib', description: 'Reflection/mirror image of z across the real axis' },
      { title: 'Multiplicative Inverse', formula: 'z^(-1) = z̄ / |z|^2 = (a - ib) / (a^2 + b^2)', description: 'Inverse such that z · z^(-1) = 1' },
      { title: 'Modulus Property', formula: 'z · z̄ = |z|^2', description: 'Product of a complex number and its conjugate is the square of its modulus' },
    ],
    concepts: [
      {
        id: 'complex_alg',
        title: 'Algebra & Modulus of Complex Numbers',
        summary: 'Addition, subtraction, multiplication, and division of z = a + ib. Understanding real and imaginary components.',
        keyPoints: [
          'Equality: a + ib = c + id iff a = c and b = d.',
          'Square root of negative real numbers: √(-a) = √a · i for positive real a.',
          'Caution: √a · √b = √(ab) holds true only when at least one of a or b is non-negative.',
          'Argand Plane: Real numbers represented on X-axis, imaginary numbers on Y-axis.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch4_q1',
        chapterNumber: 4,
        chapterTitle: 'Complex Numbers and Quadratic Equations',
        question: 'Evaluate the value of i^35:',
        options: ['1', '-1', 'i', '-i'],
        correctIndex: 3,
        explanation: '35 = 4 × 8 + 3. Therefore, i^35 = (i^4)^8 · i^3 = 1^8 · (-i) = -i.',
        topic: 'Powers of i',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch4_q2',
        chapterNumber: 4,
        chapterTitle: 'Complex Numbers and Quadratic Equations',
        question: 'Find the multiplicative inverse of z = 2 - 3i:',
        options: ['(2 + 3i) / 13', '(2 - 3i) / 13', '(-2 + 3i) / 13', '(2 + 3i) / 5'],
        correctIndex: 0,
        explanation: 'z^(-1) = z̄ / |z|^2. Here z̄ = 2 + 3i and |z|^2 = 2^2 + (-3)^2 = 13. Hence z^(-1) = (2 + 3i) / 13 = 2/13 + 3i/13.',
        topic: 'Multiplicative Inverse',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch4_q3',
        chapterNumber: 4,
        chapterTitle: 'Complex Numbers and Quadratic Equations',
        question: 'What is the modulus of the complex number z = (1 + i) / (1 - i)?',
        options: ['0', '1', '√2', '2'],
        correctIndex: 1,
        explanation: '(1 + i)/(1 - i) = (1 + i)^2 / (1 - i^2) = (1 + 2i - 1) / 2 = 2i / 2 = i. The modulus |i| = √(0^2 + 1^2) = 1.',
        topic: 'Modulus of Complex Numbers',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch4_q4',
        chapterNumber: 4,
        chapterTitle: 'Complex Numbers and Quadratic Equations',
        question: 'Find the least positive integer m such that ((1 + i)/(1 - i))^m = 1:',
        options: ['2', '4', '6', '8'],
        correctIndex: 1,
        explanation: '((1+i)/(1-i)) = i. Thus i^m = 1. The smallest positive integer power of i equal to 1 is m = 4.',
        topic: 'Properties of i',
        difficulty: 'Medium',
      },
    ],
    quickRevisionBulletins: [
      'i = √(-1), i^2 = -1, i^3 = -i, i^4 = 1.',
      'z · z̄ = |z|^2 is always a non-negative real number.',
      '|z1 · z2| = |z1| · |z2| and |z1 / z2| = |z1| / |z2|.',
    ],
  },

  // CHAPTER 5: LINEAR INEQUALITIES
  {
    chapterNumber: 5,
    title: 'Linear Inequalities',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 05',
    pageCount: 11,
    overview:
      'Covers algebraic solutions of linear inequalities in one variable, representation on the number line, and reversal of the inequality sign upon multiplying or dividing by negative real numbers.',
    coreFormulas: [
      { title: 'Sign Reversal Rule', formula: 'a < b ⇒ -a > -b; ax < b ⇒ x > b/a (for a < 0)', description: 'Multiplying or dividing by a negative number reverses the inequality direction' },
      { title: 'Double Inequality', formula: 'a ≤ x ≤ b ⇒ x ∈ [a, b]', description: 'Simultaneous intersection of two bounds' },
    ],
    concepts: [
      {
        id: 'ineq_rules',
        title: 'Rules of Inequality & Number Line Solutions',
        summary: 'Systematic techniques for algebraic manipulation of inequalities.',
        keyPoints: [
          'Rule 1: Equal numbers may be added to or subtracted from both sides without changing the sign.',
          'Rule 2: Both sides may be multiplied/divided by a positive number without changing sign; multiplying/dividing by a negative number REVERSES the sign.',
          'Strict inequalities (<, >) use an open circle (hollow dot) on number lines; slack inequalities (≤, ≥) use a closed dark circle.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch5_q1',
        chapterNumber: 5,
        chapterTitle: 'Linear Inequalities',
        question: 'Solve for real x: -12x > 30:',
        options: ['x > -2.5', 'x < -2.5', 'x ≥ -2.5', 'x ≤ -2.5'],
        correctIndex: 1,
        explanation: 'Dividing both sides by -12 reverses the inequality: x < 30 / (-12) ⇒ x < -5/2 = -2.5. Solution set is (-∞, -2.5).',
        topic: 'Negative Division Rule',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch5_q2',
        chapterNumber: 5,
        chapterTitle: 'Linear Inequalities',
        question: 'Solve 30x < 200 when x is a natural number (x ∈ N):',
        options: [
          '{1, 2, 3, 4, 5, 6}',
          '{0, 1, 2, 3, 4, 5, 6}',
          '{1, 2, 3, 4, 5, 6, 7}',
          '(-∞, 20/3)',
        ],
        correctIndex: 0,
        explanation: 'x < 200/3 ≈ 6.67. Since x is a natural number (N = {1, 2, 3, ...}), the solutions are {1, 2, 3, 4, 5, 6}.',
        topic: 'Discrete Natural Solutions',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch5_q3',
        chapterNumber: 5,
        chapterTitle: 'Linear Inequalities',
        question: 'Solve the double inequality: -5 ≤ (5 - 3x)/2 ≤ 8 for real x:',
        options: ['[-11/3, 5]', '[-5, 11/3]', '(-11/3, 5)', '[-5, 5]'],
        correctIndex: 0,
        explanation: 'Multiply by 2: -10 ≤ 5 - 3x ≤ 16. Subtract 5: -15 ≤ -3x ≤ 11. Divide by -3 (reverse signs): 5 ≥ x ≥ -11/3 ⇒ -11/3 ≤ x ≤ 5, i.e., [-11/3, 5].',
        topic: 'Double Inequalities',
        difficulty: 'Medium',
      },
    ],
    quickRevisionBulletins: [
      'Always flip the inequality sign when multiplying or dividing by a negative number!',
      'Interval notation: (a, b] includes b but excludes a.',
    ],
  },

  // CHAPTER 6: PERMUTATIONS AND COMBINATIONS
  {
    chapterNumber: 6,
    title: 'Permutations and Combinations',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 06',
    pageCount: 26,
    overview:
      'Fundamental counting techniques. Differentiates arrangements where order matters (Permutations nPr) from selections where order is irrelevant (Combinations nCr). Explores factorials, restricted arrangements, and identical objects.',
    coreFormulas: [
      { title: 'Factorial Notation', formula: 'n! = n(n-1)(n-2)...3·2·1; 0! = 1', description: 'Product of first n positive integers' },
      { title: 'Permutations (Order Matters)', formula: 'nPr = n! / (n - r)!', description: 'Arrangements of n distinct objects taken r at a time' },
      { title: 'Combinations (Order Doesn’t Matter)', formula: 'nCr = n! / [r! (n - r)!]', description: 'Selections of n objects taken r at a time' },
      { title: 'Relationship Formula', formula: 'nPr = nCr · r!', description: 'Each combination can be arranged in r! ways' },
      { title: 'Symmetry Property', formula: 'nCr = nC(n - r)', description: 'Selecting r objects is identical to rejecting n-r objects' },
      { title: 'Pascal Combination Identity', formula: 'nCr + nC(r - 1) = (n + 1)Cr', description: 'Fundamental recurrence for combinations' },
      { title: 'Permutations with Repeated Objects', formula: 'N = n! / (p1! p2! ... pk!)', description: 'Arranging n objects where p1 are identical of type 1, p2 of type 2, etc.' },
    ],
    concepts: [
      {
        id: 'perm_comb_core',
        title: 'Fundamental Counting Principle & Combinatorics',
        summary: 'Multiplication principle: If event 1 occurs in m ways and event 2 in n ways, total ways = m × n.',
        keyPoints: [
          'Permutations count distinct sequences/words/orders.',
          'Combinations count groups/teams/hands/chords where sequence is irrelevant.',
          'If nCa = nCb, then either a = b or a + b = n.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch6_q1',
        chapterNumber: 6,
        chapterTitle: 'Permutations and Combinations',
        question: 'How many 4-letter words (with or without meaning) can be formed from the word ROSE if repetition is not allowed?',
        options: ['16', '24', '64', '256'],
        correctIndex: 1,
        explanation: 'There are 4 distinct letters R, O, S, E. Number of permutations = 4P4 = 4! = 4 × 3 × 2 × 1 = 24.',
        topic: 'Permutations of Distinct Letters',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch6_q2',
        chapterNumber: 6,
        chapterTitle: 'Permutations and Combinations',
        question: 'Find the number of ways to arrange the letters of the word ALLAHABAD:',
        options: ['7560', '5040', '10080', '3780'],
        correctIndex: 0,
        explanation: 'Total letters = 9 (4 A’s, 2 L’s, 1 H, 1 B, 1 D). Total arrangements = 9! / (4! 2!) = (362880) / (24 × 2) = 7560.',
        topic: 'Permutations of Identical Objects',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch6_q3',
        chapterNumber: 6,
        chapterTitle: 'Permutations and Combinations',
        question: 'If nC9 = nC8, find the value of nC17:',
        options: ['17', '1', '0', '34'],
        correctIndex: 1,
        explanation: 'nCa = nCb implies n = a + b ⇒ n = 9 + 8 = 17. Therefore, nC17 = 17C17 = 1.',
        topic: 'Combination Equivalence',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch6_q4',
        chapterNumber: 6,
        chapterTitle: 'Permutations and Combinations',
        question: 'How many chords can be drawn through 21 points on a circle?',
        options: ['42', '210', '420', '441'],
        correctIndex: 1,
        explanation: 'A chord is formed by joining any 2 distinct points on a circle. Total chords = 21C2 = (21 × 20) / (2 × 1) = 210.',
        topic: 'Geometric Combinations',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'nPr = n! / (n-r)! counts arrangements; nCr = n! / [r!(n-r)!] counts selections.',
      '0! is defined as 1 by convention.',
      'nCr + nC(r-1) = (n+1)Cr.',
    ],
  },

  // CHAPTER 7: BINOMIAL THEOREM
  {
    chapterNumber: 7,
    title: 'Binomial Theorem',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 07',
    pageCount: 9,
    overview:
      'Provides the algebraic expansion of (a + b)^n for any positive integer n using combinatorial coefficients. Traced back to ancient Indian mathematician Pingala (Meru Prastara) and Blaise Pascal.',
    coreFormulas: [
      { title: 'Binomial Expansion', formula: '(a + b)^n = ∑ (k=0 to n) nCk a^(n-k) b^k', description: 'General expansion of binomial to power n' },
      { title: 'Number of Terms', formula: 'Total terms = n + 1', description: 'Always one more than index n' },
      { title: 'Sum of Coefficients', formula: 'nC0 + nC1 + nC2 + ... + nCn = 2^n', description: 'Obtained by setting a = 1, b = 1' },
      { title: 'Alternating Sum', formula: 'nC0 - nC1 + nC2 - ... + (-1)^n nCn = 0', description: 'Obtained by setting a = 1, b = -1' },
    ],
    concepts: [
      {
        id: 'binom_core',
        title: 'Pascal’s Triangle & Expansion Patterns',
        summary: 'Powers of first term decrease from n to 0 while powers of second term increase from 0 to n.',
        keyPoints: [
          'Sum of powers of a and b in every term is exactly equal to n.',
          'Binomial coefficients equidistant from beginning and end are equal: nCr = nC(n-r).',
          '(1 + x)^n = 1 + nC1 x + nC2 x^2 + ... + x^n.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch7_q1',
        chapterNumber: 7,
        chapterTitle: 'Binomial Theorem',
        question: 'How many terms are there in the expansion of (2x + 3y)^12?',
        options: ['11', '12', '13', '24'],
        correctIndex: 2,
        explanation: 'In the binomial expansion of (a + b)^n, the total number of terms is always n + 1. For n = 12, terms = 12 + 1 = 13.',
        topic: 'Number of Terms',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch7_q2',
        chapterNumber: 7,
        chapterTitle: 'Binomial Theorem',
        question: 'What is the sum of all binomial coefficients nC0 + nC1 + nC2 + ... + nCn for n = 6?',
        options: ['32', '64', '128', '256'],
        correctIndex: 1,
        explanation: 'The sum of binomial coefficients is 2^n. For n = 6, 2^6 = 64.',
        topic: 'Sum of Binomial Coefficients',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch7_q3',
        chapterNumber: 7,
        chapterTitle: 'Binomial Theorem',
        question: 'Which is larger: (1.01)^1000000 or 10,000?',
        options: ['10,000 is larger', '(1.01)^1000000 is larger', 'They are equal', 'Cannot be determined'],
        correctIndex: 1,
        explanation: 'By binomial theorem: (1 + 0.01)^1000000 = 1 + 1000000(0.01) + positive terms = 1 + 10000 + ... = 10001 + ... > 10,000.',
        topic: 'Binomial Approximations',
        difficulty: 'Medium',
      },
    ],
    quickRevisionBulletins: [
      'The expansion of (a + b)^n has (n + 1) terms.',
      'Coefficients follow Pascal’s triangle symmetry nCr = nCn-r.',
    ],
  },

  // CHAPTER 8: SEQUENCES AND SERIES
  {
    chapterNumber: 8,
    title: 'Sequences and Series',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 08',
    pageCount: 16,
    overview:
      'Studies Geometric Progressions (G.P.), general terms, sum to n terms, Geometric Mean (G.M.), and the fundamental inequality A.M. ≥ G.M. for positive real numbers.',
    coreFormulas: [
      { title: 'General Term of G.P.', formula: 'an = a · r^(n - 1)', description: 'nth term of geometric progression with first term a and ratio r' },
      { title: 'Sum of n Terms of G.P.', formula: 'Sn = a(1 - r^n)/(1 - r) = a(r^n - 1)/(r - 1) (r ≠ 1)', description: 'Sum of first n terms of a G.P.' },
      { title: 'Geometric Mean (G.M.)', formula: 'G.M. = √(ab)', description: 'Geometric mean between two positive numbers a and b' },
      { title: 'A.M. - G.M. Inequality', formula: 'A.M. ≥ G.M. ⇒ (a + b)/2 ≥ √(ab)', description: 'Arithmetic mean is always greater than or equal to Geometric mean' },
    ],
    concepts: [
      {
        id: 'gp_concepts',
        title: 'Geometric Progression & Means',
        summary: 'In a G.P., each successive term is obtained by multiplying the previous term by a constant common ratio r.',
        keyPoints: [
          'If each term is multiplied by a constant, the resulting sequence is also a G.P.',
          'Three terms in G.P. can be taken conveniently as a/r, a, ar.',
          'Inserting n geometric means G1, G2, ..., Gn between a and b: common ratio r = (b/a)^(1/(n+1)).',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch8_q1',
        chapterNumber: 8,
        chapterTitle: 'Sequences and Series',
        question: 'Find the 10th term of the G.P. 5, 25, 125, ...:',
        options: ['5^9', '5^10', '5^11', '50'],
        correctIndex: 1,
        explanation: 'Here a = 5, r = 25/5 = 5. The nth term is an = a · r^(n-1) ⇒ a10 = 5 · 5^9 = 5^10.',
        topic: 'nth Term of G.P.',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch8_q2',
        chapterNumber: 8,
        chapterTitle: 'Sequences and Series',
        question: 'If the A.M. and G.M. of two positive numbers are 10 and 8 respectively, the numbers are:',
        options: ['6 and 14', '4 and 16', '2 and 18', '5 and 15'],
        correctIndex: 1,
        explanation: '(a + b)/2 = 10 ⇒ a + b = 20. √(ab) = 8 ⇒ ab = 64. (a - b)^2 = (a + b)^2 - 4ab = 400 - 256 = 144 ⇒ a - b = ±12. Solving gives 16 and 4.',
        topic: 'A.M. and G.M. Relationship',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch8_q3',
        chapterNumber: 8,
        chapterTitle: 'Sequences and Series',
        question: 'The geometric mean of 4 and 16 is:',
        options: ['10', '8', '6', '12'],
        correctIndex: 1,
        explanation: 'G.M. = √(a · b) = √(4 × 16) = √64 = 8.',
        topic: 'Geometric Mean',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'nth term of G.P. is an = a r^(n-1).',
      'For any two positive unequal numbers, A.M. > G.M.',
    ],
  },

  // CHAPTER 9: STRAIGHT LINES
  {
    chapterNumber: 9,
    title: 'Straight Lines',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 09',
    pageCount: 25,
    overview:
      'Algebraic representation of straight lines in coordinate planes. Explores slopes, angles between lines, parallelism, perpendicularity, standard line equations, perpendicular distance of a point, and distance between parallel lines.',
    coreFormulas: [
      { title: 'Slope of Line', formula: 'm = tan θ = (y2 - y1) / (x2 - x1)', description: 'Inclination angle θ with positive x-axis' },
      { title: 'Parallel & Perpendicular Conditions', formula: 'Parallel: m1 = m2; Perpendicular: m1 · m2 = -1', description: 'Conditions based on slopes' },
      { title: 'Point-Slope Form', formula: 'y - y0 = m(x - x0)', description: 'Line through (x0, y0) with slope m' },
      { title: 'Slope-Intercept Form', formula: 'y = mx + c', description: 'Line with slope m and y-intercept c' },
      { title: 'Intercept Form', formula: 'x/a + y/b = 1', description: 'Line making intercepts a and b on coordinate axes' },
      { title: 'Perpendicular Distance from Point', formula: 'd = |Ax1 + By1 + C| / √(A^2 + B^2)', description: 'Distance of point (x1, y1) from line Ax + By + C = 0' },
      { title: 'Distance Between Parallel Lines', formula: 'd = |C1 - C2| / √(A^2 + B^2)', description: 'Distance between Ax + By + C1 = 0 and Ax + By + C2 = 0' },
    ],
    concepts: [
      {
        id: 'line_equations',
        title: 'Equations & Distance Formulas',
        summary: 'Derivations of two-point form, intercept form, angle between lines tan θ = |(m2 - m1)/(1 + m1 m2)|.',
        keyPoints: [
          'Slope of horizontal line = 0; slope of vertical line is undefined.',
          'General linear equation Ax + By + C = 0 has slope m = -A/B.',
          'Concurrent lines intersect at a common point.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch9_q1',
        chapterNumber: 9,
        chapterTitle: 'Straight Lines',
        question: 'What is the slope of a line perpendicular to 3x - 4y + 7 = 0?',
        options: ['3/4', '-3/4', '4/3', '-4/3'],
        correctIndex: 3,
        explanation: 'The given line has slope m1 = -A/B = -3/(-4) = 3/4. For a perpendicular line, m1 · m2 = -1 ⇒ m2 = -1 / (3/4) = -4/3.',
        topic: 'Perpendicular Lines',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch9_q2',
        chapterNumber: 9,
        chapterTitle: 'Straight Lines',
        question: 'Find the distance of the point (3, -5) from the line 3x - 4y - 26 = 0:',
        options: ['1 unit', '3/5 units', '7/5 units', '5 units'],
        correctIndex: 1,
        explanation: 'd = |3(3) - 4(-5) - 26| / √(3^2 + (-4)^2) = |9 + 20 - 26| / 5 = |3| / 5 = 3/5.',
        topic: 'Perpendicular Distance',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch9_q3',
        chapterNumber: 9,
        chapterTitle: 'Straight Lines',
        question: 'Find the distance between parallel lines 3x - 4y + 7 = 0 and 3x - 4y + 5 = 0:',
        options: ['2/5', '12/5', '2/25', '1/5'],
        correctIndex: 0,
        explanation: 'd = |C1 - C2| / √(A^2 + B^2) = |7 - 5| / √(3^2 + (-4)^2) = 2 / 5.',
        topic: 'Distance Between Parallel Lines',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch9_q4',
        chapterNumber: 9,
        chapterTitle: 'Straight Lines',
        question: 'The equation of a line with x-intercept -3 and y-intercept 2 is:',
        options: ['2x - 3y + 6 = 0', '-2x + 3y = 6', '2x + 3y + 6 = 0', '3x - 2y + 6 = 0'],
        correctIndex: 0,
        explanation: 'Intercept form is x/a + y/b = 1 ⇒ x/(-3) + y/2 = 1 ⇒ -2x + 3y = 6 ⇒ 2x - 3y + 6 = 0.',
        topic: 'Intercept Form',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Slope of line through (x1, y1) and (x2, y2) is (y2 - y1) / (x2 - x1).',
      'Two lines are perpendicular iff m1 · m2 = -1.',
      'Perpendicular distance from origin to Ax + By + C = 0 is |C| / √(A^2 + B^2).',
    ],
  },

  // CHAPTER 10: CONIC SECTIONS
  {
    chapterNumber: 10,
    title: 'Conic Sections',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 10',
    pageCount: 32,
    overview:
      'Curved sections obtained by slicing a double-napped right circular cone with a plane: Circles, Parabolas, Ellipses, and Hyperbolas. Detailed formulas for foci, directrices, eccentricity, and latus rectum.',
    coreFormulas: [
      { title: 'Circle Equation', formula: '(x - h)^2 + (y - k)^2 = r^2', description: 'Circle with centre (h, k) and radius r' },
      { title: 'Parabola (Standard)', formula: 'y^2 = 4ax (Focus: (a, 0), Directrix: x = -a)', description: 'Latus rectum length = 4a' },
      { title: 'Ellipse (Horizontal)', formula: 'x^2/a^2 + y^2/b^2 = 1 (a > b)', description: 'c^2 = a^2 - b^2, Eccentricity e = c/a < 1, Latus rectum = 2b^2/a' },
      { title: 'Hyperbola (Horizontal)', formula: 'x^2/a^2 - y^2/b^2 = 1', description: 'c^2 = a^2 + b^2, Eccentricity e = c/a > 1, Latus rectum = 2b^2/a' },
    ],
    concepts: [
      {
        id: 'conics_definitions',
        title: 'Geometric Definitions & Classification',
        summary: 'A conic is the locus of a point whose distance from a fixed focus bears a constant ratio e (eccentricity) to its distance from a fixed directrix.',
        keyPoints: [
          'Circle: e = 0. Cutting plane is perpendicular to cone axis (β = 90°).',
          'Ellipse: 0 < e < 1. Sum of focal distances PF1 + PF2 = 2a (constant).',
          'Parabola: e = 1. Distance to focus equals distance to directrix.',
          'Hyperbola: e > 1. Difference of focal distances |PF1 - PF2| = 2a (constant).',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch10_q1',
        chapterNumber: 10,
        chapterTitle: 'Conic Sections',
        question: 'Find the centre and radius of the circle: x^2 + y^2 + 8x + 10y - 8 = 0:',
        options: [
          'Centre (-4, -5), Radius = 7',
          'Centre (4, 5), Radius = 7',
          'Centre (-4, -5), Radius = 49',
          'Centre (-8, -10), Radius = 8',
        ],
        correctIndex: 0,
        explanation: 'Complete the square: (x + 4)^2 - 16 + (y + 5)^2 - 25 - 8 = 0 ⇒ (x + 4)^2 + (y + 5)^2 = 49 = 7^2. Centre = (-4, -5), Radius = 7.',
        topic: 'Circle Centre & Radius',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch10_q2',
        chapterNumber: 10,
        chapterTitle: 'Conic Sections',
        question: 'What is the length of the latus rectum of the parabola y^2 = 8x?',
        options: ['2', '4', '8', '16'],
        correctIndex: 2,
        explanation: 'Comparing with standard form y^2 = 4ax: 4a = 8 ⇒ a = 2. Length of latus rectum = 4a = 8.',
        topic: 'Parabola Latus Rectum',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch10_q3',
        chapterNumber: 10,
        chapterTitle: 'Conic Sections',
        question: 'For the ellipse x^2/25 + y^2/9 = 1, find its eccentricity e:',
        options: ['3/5', '4/5', '5/4', '16/25'],
        correctIndex: 1,
        explanation: 'Here a^2 = 25 ⇒ a = 5, b^2 = 9 ⇒ b = 3. c = √(a^2 - b^2) = √(25 - 9) = 4. Eccentricity e = c/a = 4/5.',
        topic: 'Ellipse Eccentricity',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch10_q4',
        chapterNumber: 10,
        chapterTitle: 'Conic Sections',
        question: 'In a hyperbola, eccentricity e is always:',
        options: ['e = 0', '0 < e < 1', 'e = 1', 'e > 1'],
        correctIndex: 3,
        explanation: 'By definition, for a hyperbola c > a, hence eccentricity e = c/a is strictly greater than 1 (e > 1).',
        topic: 'Conic Eccentricity Criteria',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Circle: (x-h)^2 + (y-k)^2 = r^2.',
      'Parabola latus rectum = 4a.',
      'Ellipse: a^2 = b^2 + c^2, e = c/a < 1.',
      'Hyperbola: c^2 = a^2 + b^2, e = c/a > 1.',
    ],
  },

  // CHAPTER 11: INTRODUCTION TO THREE DIMENSIONAL GEOMETRY
  {
    chapterNumber: 11,
    title: 'Introduction to Three Dimensional Geometry',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 11',
    pageCount: 9,
    overview:
      'Extends coordinate geometry into 3-dimensional space with three mutually perpendicular axes (OX, OY, OZ) and three coordinate planes dividing space into eight octants.',
    coreFormulas: [
      { title: '3D Distance Formula', formula: 'PQ = √[(x2 - x1)^2 + (y2 - y1)^2 + (z2 - z1)^2]', description: 'Distance between points P(x1, y1, z1) and Q(x2, y2, z2)' },
      { title: 'Distance from Origin', formula: 'OP = √(x^2 + y^2 + z^2)', description: 'Distance of point P(x, y, z) from origin O(0, 0, 0)' },
      { title: 'Centroid of Triangle', formula: 'G = ((x1+x2+x3)/3, (y1+y2+y3)/3, (z1+z2+z3)/3)', description: 'Coordinates of centroid of triangle with given vertices' },
    ],
    concepts: [
      {
        id: 'octants_rules',
        title: 'Coordinate Planes & Octants',
        summary: 'Space divided into 8 octants with signs of coordinates (+/-).',
        keyPoints: [
          'Any point on x-axis is (x, 0, 0); on y-axis is (0, y, 0); on z-axis is (0, 0, z).',
          'Any point in XY-plane has z = 0 (x, y, 0); in YZ-plane x = 0; in ZX-plane y = 0.',
          'Octant I: (+, +, +); Octant II: (-, +, +); Octant III: (-, -, +); Octant IV: (+, -, +).',
          'Octants V to VIII have z negative.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch11_q1',
        chapterNumber: 11,
        chapterTitle: 'Introduction to Three Dimensional Geometry',
        question: 'In which octant does the point (-3, 1, 2) lie?',
        options: ['Octant I', 'Octant II', 'Octant III', 'Octant VI'],
        correctIndex: 1,
        explanation: 'Here x is negative (-), y is positive (+), and z is positive (+). The signs (-, +, +) correspond to Octant II.',
        topic: 'Octants in 3D Space',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch11_q2',
        chapterNumber: 11,
        chapterTitle: 'Introduction to Three Dimensional Geometry',
        question: 'Find the distance between P(1, -3, 4) and Q(-4, 1, 2):',
        options: ['3√5 units', '√45 units', 'Both A and B', '5√3 units'],
        correctIndex: 2,
        explanation: 'PQ = √[(-4 - 1)^2 + (1 - (-3))^2 + (2 - 4)^2] = √[25 + 16 + 4] = √45 = 3√5 units. Both statements are correct.',
        topic: '3D Distance Calculation',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch11_q3',
        chapterNumber: 11,
        chapterTitle: 'Introduction to Three Dimensional Geometry',
        question: 'What is the y-coordinate of any point lying on the XZ-plane?',
        options: ['1', '0', '-1', 'Any real number'],
        correctIndex: 1,
        explanation: 'For any point in the XZ-plane, distance along the y-axis is zero. Hence its y-coordinate is always 0.',
        topic: 'Coordinate Planes',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      '3 coordinate planes divide space into 8 octants.',
      'Distance PQ = √[(Δx)^2 + (Δy)^2 + (Δz)^2].',
    ],
  },

  // CHAPTER 12: LIMITS AND DERIVATIVES
  {
    chapterNumber: 12,
    title: 'Limits and Derivatives',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 12',
    pageCount: 40,
    overview:
      'The foundational gateway to Calculus. Studies intuitive and formal definitions of limits, left/right hand limits, algebra of limits, standard trigonometric limits, and the First Principle of Derivatives.',
    coreFormulas: [
      { title: 'Standard Power Limit', formula: 'lim(x→a) [x^n - a^n] / [x - a] = n · a^(n - 1)', description: 'Valid for all rational exponents n and positive a' },
      { title: 'Standard Trigonometric Limit 1', formula: 'lim(x→0) [sin x / x] = 1 (x in radians)', description: 'Proven via Sandwich Theorem' },
      { title: 'Standard Trigonometric Limit 2', formula: 'lim(x→0) [(1 - cos x) / x] = 0', description: 'Trigonometric half-angle deduction' },
      { title: 'First Principle of Derivative', formula: "f'(x) = lim(h→0) [f(x + h) - f(x)] / h", description: 'Instantaneous rate of change definition' },
      { title: 'Power Rule of Derivative', formula: 'd/dx (x^n) = n · x^(n - 1)', description: 'Derivative of polynomial powers' },
      { title: 'Product Rule (Leibnitz Rule)', formula: '(u · v)′ = u′v + uv′', description: 'Derivative of product of two functions' },
      { title: 'Quotient Rule', formula: '(u / v)′ = (u′v - uv′) / v^2', description: 'Derivative of fraction of two functions' },
      { title: 'Trigonometric Derivatives', formula: 'd/dx(sin x) = cos x; d/dx(cos x) = -sin x; d/dx(tan x) = sec^2 x', description: 'Standard derivatives' },
    ],
    concepts: [
      {
        id: 'limits_existence',
        title: 'Existence of Limits & Sandwich Theorem',
        summary: 'A limit lim(x→a) f(x) exists iff Left Hand Limit (LHL) equals Right Hand Limit (RHL).',
        keyPoints: [
          'LHL: lim(x→a-) f(x); RHL: lim(x→a+) f(x).',
          'Sandwich Theorem: If f(x) ≤ g(x) ≤ h(x) and lim f(x) = l = lim h(x), then lim g(x) = l.',
          'Geometrically, f′(a) represents the slope of the tangent to curve y = f(x) at point x = a.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch12_q1',
        chapterNumber: 12,
        chapterTitle: 'Limits and Derivatives',
        question: 'Evaluate the limit: lim(x→0) [sin 4x / sin 2x]:',
        options: ['1', '2', '4', '1/2'],
        correctIndex: 1,
        explanation: 'lim(x→0) [sin 4x / sin 2x] = lim(x→0) [(sin 4x / 4x) · 4x] / [(sin 2x / 2x) · 2x] = (1 · 4) / (1 · 2) = 2.',
        topic: 'Trigonometric Limits',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch12_q2',
        chapterNumber: 12,
        chapterTitle: 'Limits and Derivatives',
        question: 'What is the derivative of f(x) = tan x with respect to x?',
        options: ['sec x', 'sec^2 x', '-cosec^2 x', 'tan^2 x'],
        correctIndex: 1,
        explanation: 'Using quotient rule on sin x / cos x: d/dx(tan x) = [(cos x)(cos x) - (sin x)(-sin x)] / cos^2 x = (cos^2 x + sin^2 x) / cos^2 x = 1 / cos^2 x = sec^2 x.',
        topic: 'Trigonometric Derivatives',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch12_q3',
        chapterNumber: 12,
        chapterTitle: 'Limits and Derivatives',
        question: 'Evaluate lim(x→1) [(x^15 - 1) / (x^10 - 1)]:',
        options: ['1', '3/2', '5/3', '2/3'],
        correctIndex: 1,
        explanation: 'Divide numerator and denominator by (x - 1): [lim (x^15 - 1)/(x - 1)] / [lim (x^10 - 1)/(x - 1)] = [15 · 1^14] / [10 · 1^9] = 15/10 = 3/2.',
        topic: 'Standard Power Limits',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch12_q4',
        chapterNumber: 12,
        chapterTitle: 'Limits and Derivatives',
        question: 'Find the derivative of f(x) = (x + 1) / x at x = 1:',
        options: ['1', '0', '-1', '2'],
        correctIndex: 2,
        explanation: 'f(x) = 1 + 1/x ⇒ f′(x) = -1/x^2. At x = 1, f′(1) = -1/(1)^2 = -1.',
        topic: 'Quotient Differentiation',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch12_q5',
        chapterNumber: 12,
        chapterTitle: 'Limits and Derivatives',
        question: 'If f(x) = 1 + x + x^2 + ... + x^50, what is the value of f′(1)?',
        options: ['1225', '1275', '2500', '50'],
        correctIndex: 1,
        explanation: 'f′(x) = 1 + 2x + 3x^2 + ... + 50x^49. At x = 1, f′(1) = 1 + 2 + 3 + ... + 50 = (50 × 51)/2 = 1275.',
        topic: 'Polynomial Differentiation',
        difficulty: 'Hard',
      },
    ],
    quickRevisionBulletins: [
      'lim(x→0) (sin x)/x = 1 (angle must be in radians).',
      'd/dx (x^n) = n x^(n-1).',
      'Product rule: (uv)′ = u′v + uv′; Quotient rule: (u/v)′ = (u′v - uv′)/v^2.',
    ],
  },

  // CHAPTER 13: STATISTICS
  {
    chapterNumber: 13,
    title: 'Statistics',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 13',
    pageCount: 32,
    overview:
      'Goes beyond measures of central tendency (mean, median) to study measures of dispersion: Range, Mean Deviation (about mean and median), Variance, and Standard Deviation for ungrouped and grouped data.',
    coreFormulas: [
      { title: 'Range', formula: 'Range = Maximum Value - Minimum Value', description: 'Difference between extreme values' },
      { title: 'Mean Deviation (about Mean)', formula: 'M.D.(x̄) = (1/N) ∑ fi |xi - x̄|', description: 'Mean of absolute deviations from mean' },
      { title: 'Mean Deviation (about Median)', formula: 'M.D.(M) = (1/N) ∑ fi |xi - M|', description: 'Mean of absolute deviations from median' },
      { title: 'Variance (σ^2)', formula: 'σ^2 = (1/N) ∑ fi (xi - x̄)^2 = (1/N) ∑ fi xi^2 - (x̄)^2', description: 'Mean of squares of deviations from mean' },
      { title: 'Standard Deviation (σ)', formula: 'σ = √(Variance)', description: 'Positive square root of variance' },
      { title: 'Scaling Property', formula: 'If yi = k xi, then New Variance = k^2 · σ^2', description: 'Variance scales by square of constant multiplier' },
      { title: 'Shifting Property', formula: 'If yi = xi + a, then New Variance = σ^2', description: 'Adding/subtracting a constant does not change variance' },
    ],
    concepts: [
      {
        id: 'dispersion_concepts',
        title: 'Measures of Dispersion & Significance',
        summary: 'Dispersion quantifies how spread out observations are around the central value.',
        keyPoints: [
          'Sum of deviations from mean ∑(xi - x̄) is always zero; absolute values or squared deviations are needed.',
          'Standard deviation has the same units as the original observations and mean.',
          'Median for continuous distribution: M = l + [(N/2 - C)/f] × h.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch13_q1',
        chapterNumber: 13,
        chapterTitle: 'Statistics',
        question: 'Find the mean deviation about the mean for the data: 6, 7, 10, 12, 13, 4, 8, 12:',
        options: ['2.25', '2.75', '3.15', '4.00'],
        correctIndex: 1,
        explanation: 'Mean x̄ = (6+7+10+12+13+4+8+12)/8 = 72/8 = 9. Absolute deviations |xi - 9| are: 3, 2, 1, 3, 4, 5, 1, 3. Sum = 22. M.D.(x̄) = 22/8 = 2.75.',
        topic: 'Mean Deviation about Mean',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch13_q2',
        chapterNumber: 13,
        chapterTitle: 'Statistics',
        question: 'The variance of 20 observations is 5. If each observation is multiplied by 2, what is the new variance?',
        options: ['10', '20', '25', '40'],
        correctIndex: 1,
        explanation: 'If each observation is multiplied by a constant k, the variance becomes k^2 times the original variance. Here k = 2, so New Variance = 2^2 × 5 = 4 × 5 = 20.',
        topic: 'Variance Scaling Property',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch13_q3',
        chapterNumber: 13,
        chapterTitle: 'Statistics',
        question: 'If a constant 10 is added to each observation in a dataset, the standard deviation will:',
        options: ['Increase by 10', 'Increase by 100', 'Remain unchanged', 'Double'],
        correctIndex: 2,
        explanation: 'Adding or subtracting a constant to all observations shifts the origin but leaves dispersion (variance and standard deviation) completely unchanged.',
        topic: 'Shift of Origin in Statistics',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Standard deviation is the positive square root of variance: σ = √(σ^2).',
      'Adding a constant changes the mean, but NOT the variance or standard deviation.',
      'Multiplying by k multiplies standard deviation by |k| and variance by k^2.',
    ],
  },

  // CHAPTER 14: PROBABILITY
  {
    chapterNumber: 14,
    title: 'Probability',
    subtitle: 'NCERT Class 11 Mathematics — Chapter 14',
    pageCount: 25,
    overview:
      'Axiomatic approach to probability developed by A.N. Kolmogorov. Defines events as subsets of the sample space S, mutually exclusive and exhaustive events, and fundamental probability addition theorems.',
    coreFormulas: [
      { title: 'Equally Likely Probability', formula: 'P(E) = n(E) / n(S) = m / n', description: 'Favourable outcomes divided by total sample space outcomes' },
      { title: 'Probability Axioms', formula: 'P(E) ≥ 0, P(S) = 1, P(E ∪ F) = P(E) + P(F) for disjoint events', description: 'Kolmogorov’s three probability axioms' },
      { title: 'Addition Rule of Probability', formula: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)', description: 'Probability of event A or B occurring' },
      { title: 'Complementary Event Probability', formula: 'P(not A) = P(A′) = 1 - P(A)', description: 'Probability of non-occurrence' },
      { title: 'Mutually Exclusive Addition', formula: 'P(A ∪ B) = P(A) + P(B) (when A ∩ B = ∅)', description: 'For mutually exclusive events' },
    ],
    concepts: [
      {
        id: 'prob_axioms',
        title: 'Axiomatic Probability & Types of Events',
        summary: 'Sample space S is universal set. Every event is a subset of S.',
        keyPoints: [
          'Impossible Event: Empty set ∅ with P(∅) = 0.',
          'Sure Event: Entire sample space S with P(S) = 1.',
          'Simple / Elementary Event: Contains only one sample point.',
          'Compound Event: Contains more than one sample point.',
          'Mutually Exclusive Events: Cannot occur simultaneously (A ∩ B = ∅).',
          'Exhaustive Events: Together cover the entire sample space (E1 ∪ E2 ∪ ... ∪ En = S).',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'math_ch14_q1',
        chapterNumber: 14,
        chapterTitle: 'Probability',
        question: 'A coin is tossed three times. What is the total number of elementary events in sample space S?',
        options: ['3', '6', '8', '9'],
        correctIndex: 2,
        explanation: 'Each toss has 2 outcomes (H, T). For 3 tosses, n(S) = 2^3 = 8: {HHH, HHT, HTH, THH, HTT, THT, TTH, TTT}.',
        topic: 'Sample Space Cardinality',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch14_q2',
        chapterNumber: 14,
        chapterTitle: 'Probability',
        question: 'If P(A) = 3/5 and P(B) = 1/5, and A and B are mutually exclusive events, find P(A or B):',
        options: ['2/5', '3/25', '4/5', '1'],
        correctIndex: 2,
        explanation: 'For mutually exclusive events, P(A ∩ B) = 0. Therefore P(A or B) = P(A ∪ B) = P(A) + P(B) = 3/5 + 1/5 = 4/5.',
        topic: 'Mutually Exclusive Addition',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch14_q3',
        chapterNumber: 14,
        chapterTitle: 'Probability',
        question: 'If P(A) = 0.54, P(B) = 0.69, and P(A ∩ B) = 0.35, find P(A ∪ B):',
        options: ['0.88', '0.92', '0.78', '0.85'],
        correctIndex: 0,
        explanation: 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B) = 0.54 + 0.69 - 0.35 = 1.23 - 0.35 = 0.88.',
        topic: 'Addition Theorem',
        difficulty: 'Medium',
      },
      {
        id: 'math_ch14_q4',
        chapterNumber: 14,
        chapterTitle: 'Probability',
        question: 'If P(A) = 2/11, what is the probability of the event "not A"?',
        options: ['9/11', '11/2', '1/11', '0'],
        correctIndex: 0,
        explanation: 'P(not A) = 1 - P(A) = 1 - 2/11 = 9/11.',
        topic: 'Complementary Probability',
        difficulty: 'Easy',
      },
      {
        id: 'math_ch14_q5',
        chapterNumber: 14,
        chapterTitle: 'Probability',
        question: 'A card is drawn from a pack of 52 cards. What is the probability that it is an Ace or a Black card?',
        options: ['28/52', '30/52', '26/52', '32/52'],
        correctIndex: 0,
        explanation: 'Number of aces = 4. Number of black cards = 26. Number of black aces (intersection) = 2. P(Ace ∪ Black) = (4 + 26 - 2)/52 = 28/52 = 7/13.',
        topic: 'Card Probability with Intersection',
        difficulty: 'Medium',
      },
    ],
    quickRevisionBulletins: [
      'P(∅) = 0, P(S) = 1, and 0 ≤ P(E) ≤ 1 for any event E.',
      'P(A ∪ B) = P(A) + P(B) - P(A ∩ B).',
      'For mutually exclusive events, P(A ∩ B) = 0.',
    ],
  },
];
