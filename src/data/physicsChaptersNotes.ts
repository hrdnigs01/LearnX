// Comprehensive Physics Chapter Notes & Formulas extracted from Class 11 curriculum and uploaded notes

export interface DetailedPhysicsNoteChapter {
  id: string;
  chapterNumber: number;
  title: string;
  category: string;
  totalPagesInDoc: number;
  highlights: string[];
  keyFormulas: {
    name: string;
    formula: string;
    details: string;
  }[];
  detailedSections: {
    heading: string;
    subtopics: {
      subheading: string;
      content: string;
      formula?: string;
      points?: string[];
    }[];
  }[];
  mcqQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
  }[];
}

export const physicsUploadedChaptersNotes: DetailedPhysicsNoteChapter[] = [
  // 1. LAWS OF MOTION
  {
    id: 'laws-of-motion',
    chapterNumber: 5,
    title: 'Laws of Motion & Friction',
    category: 'Mechanics',
    totalPagesInDoc: 14,
    highlights: [
      'Newton’s Three Laws of Motion & Inertial vs Non-Inertial Frames',
      'Linear Momentum, Impulse & Conservation of Momentum',
      'Apparent Weight in an Accelerating Elevator / Lift',
      'Static, Limiting, Kinetic and Rolling Friction',
      'Angle of Friction (tan θ = μ) and Angle of Repose (tan α = μ)',
      'Circular Motion Dynamics: Centripetal force, Banking of roads, Bending of cyclist',
      'Pseudo Force in Non-Inertial Frames & Pulley Constrained Motion',
    ],
    keyFormulas: [
      { name: "Newton's Second Law", formula: 'F = dp/dt = m(dv/dt) = m·a', details: 'Valid for constant mass system.' },
      { name: 'Impulse of Force', formula: 'I = F_avg × Δt = Δp = p2 - p1', details: 'Area under F-t curve gives total impulse.' },
      { name: 'Apparent Weight in Lift (Upward Accel)', formula: 'R = m(g + a) = W0(1 + a/g)', details: 'Person feels heavier.' },
      { name: 'Apparent Weight in Lift (Downward Accel)', formula: 'R = m(g - a) = W0(1 - a/g)', details: 'Weightlessness when a = g.' },
      { name: 'Limiting Friction', formula: 'f_ms = μ_s · R', details: 'Independent of contact surface area.' },
      { name: 'Angle of Friction & Repose', formula: 'tan θ = μ_s = tan α  =>  θ = α', details: 'Angle of friction equals angle of repose.' },
      { name: 'Centripetal Force', formula: 'F_c = m·v^2 / r = m·r·ω^2', details: 'Acts towards the center along the radius.' },
      { name: 'Safe Velocity on Level Road', formula: 'v_max = √(μ_s · r · g)', details: 'Independent of mass of vehicle.' },
      { name: 'Optimum Speed on Banked Road', formula: 'v0 = √(r · g · tan θ)', details: 'No friction needed to prevent skidding.' },
      { name: 'Max Speed on Banked Road with Friction', formula: 'v_max = √[r·g·(μ_s + tan θ) / (1 - μ_s·tan θ)]', details: 'Limits before car skids up incline.' },
      { name: 'Bending of a Cyclist', formula: 'tan θ = v^2 / (r · g)', details: 'θ is angle made with vertical.' },
      { name: 'Atwood Machine (Pulley)', formula: 'a = (m1 - m2)g / (m1 + m2),  T = 2 m1 m2 g / (m1 + m2)', details: 'Ideal frictionless, massless string & pulley.' },
    ],
    detailedSections: [
      {
        heading: '1. Force and Equilibrium',
        subtopics: [
          {
            subheading: 'Definition & Superposition',
            content: 'Force changes the state of rest or uniform motion of a body or deflects it from its path. It is a vector quantity with SI unit Newton (N) and dimensions [M L T^-2]. Resultant of two forces F1 and F2 at angle θ is F = √(F1^2 + F2^2 + 2F1F2 cos θ), tan α = (F2 sin θ) / (F1 + F2 cos θ).',
          },
          {
            subheading: "Lami's Theorem",
            content: 'If three coplanar forces F1, F2, F3 acting at a point keep it in equilibrium, then: F1 / sin(π - α) = F2 / sin(π - β) = F3 / sin(π - γ), where α, β, γ are opposite angles.',
          },
        ],
      },
      {
        heading: "2. Newton's Three Laws of Motion",
        subtopics: [
          {
            subheading: 'First Law (Law of Inertia)',
            content: 'Every body continues in its state of rest or uniform motion in a straight line unless compelled by a resultant external force. Mass is the quantitative measure of inertia. A frame in which 1st law is valid is an inertial frame; an accelerating frame is non-inertial.',
          },
          {
            subheading: 'Second Law',
            content: 'Rate of change of momentum is directly proportional to applied force and takes place in the direction of force: F = dp/dt = m(dv/dt) = ma. Unit force produces 1 m/s^2 acceleration in 1 kg mass.',
          },
          {
            subheading: 'Third Law & Conservation of Momentum',
            content: 'To every action there is always an equal and opposite reaction (F_AB = -F_BA). Action and reaction always act on different bodies. In an isolated system (F_ext = 0), total linear momentum is conserved: m1 u1 + m2 u2 = m1 v1 + m2 v2.',
          },
        ],
      },
      {
        heading: '3. Friction and Circular Motion Dynamics',
        subtopics: [
          {
            subheading: 'Laws of Limiting Friction',
            content: 'Frictional force opposes relative motion between two surfaces in contact. Limiting friction f_ms is directly proportional to normal reaction (f_ms = μ_s R) and independent of apparent contact area. Kinetic friction f_k = μ_k R is slightly less than limiting friction.',
          },
          {
            subheading: 'Banking of Roads and Bending of Cyclist',
            content: 'To negotiate curved tracks safely without depending purely on friction, roads are banked at angle θ such that the horizontal component of normal reaction (R sin θ) provides the required centripetal force mv^2/r. For cyclist bending at angle θ with vertical, tan θ = v^2 / (rg).',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'lom_q1',
        question: 'A body of mass 5 kg is suspended in an elevator accelerating upwards at 2 m/s^2. What is the apparent weight recorded by a spring balance? (Take g = 9.8 m/s^2)',
        options: ['49 N', '59 N', '39 N', '10 N'],
        correctIndex: 1,
        explanation: 'Apparent weight in upward accelerating elevator R = m(g + a) = 5(9.8 + 2) = 5 × 11.8 = 59 N.',
        difficulty: 'Medium',
        topic: 'Apparent Weight in a Lift',
      },
      {
        id: 'lom_q2',
        question: 'What is the relationship between the angle of friction (θ) and the angle of repose (α) for the same pair of surfaces?',
        options: ['θ = α', 'θ = 2α', 'θ = α / 2', 'θ + α = 90°'],
        correctIndex: 0,
        explanation: 'Since tan θ = μ_s and tan α = μ_s, it strictly follows that θ = α (angle of friction equals angle of repose).',
        difficulty: 'Easy',
        topic: 'Friction',
      },
      {
        id: 'lom_q3',
        question: 'A car of mass 1000 kg rounds a level circular curve of radius 50 m. If the coefficient of static friction is 0.5, what is the maximum speed without skidding? (g = 9.8 m/s^2)',
        options: ['15.65 m/s', '25 m/s', '10 m/s', '49 m/s'],
        correctIndex: 0,
        explanation: 'v_max = √(μ_s · r · g) = √(0.5 × 50 × 9.8) = √245 ≈ 15.65 m/s.',
        difficulty: 'Medium',
        topic: 'Level Curve Motion',
      },
      {
        id: 'lom_q4',
        question: 'When a horse pulls a cart, the force that causes the horse to move forward is exerted by:',
        options: ['The cart on the horse', 'The ground on the horse', 'The horse on the ground', 'The horse on the cart'],
        correctIndex: 1,
        explanation: "By Newton's third law, the horse pushes the ground backward, and the reaction force exerted by the ground on the horse pushes it forward.",
        difficulty: 'Easy',
        topic: "Newton's Third Law",
      },
      {
        id: 'lom_q5',
        question: 'In an Atwood machine, two masses m1 = 6 kg and m2 = 4 kg are connected by a light string over a frictionless pulley. What is the acceleration of the system? (g = 10 m/s^2)',
        options: ['1 m/s^2', '2 m/s^2', '5 m/s^2', '10 m/s^2'],
        correctIndex: 1,
        explanation: 'a = (m1 - m2)g / (m1 + m2) = (6 - 4) × 10 / (6 + 4) = 20 / 10 = 2 m/s^2.',
        difficulty: 'Medium',
        topic: 'Connected Bodies & Pulleys',
      },
      {
        id: 'lom_q6',
        question: 'A frame of reference in which Newton’s first law does NOT hold true directly without introducing pseudo forces is called:',
        options: ['Inertial frame', 'Non-inertial frame', 'Equilibrium frame', 'Galilean frame'],
        correctIndex: 1,
        explanation: 'A non-inertial frame is an accelerating or rotating frame where fictitious/pseudo force F_pseudo = -m a0 must be added.',
        difficulty: 'Easy',
        topic: 'Inertial vs Non-Inertial Frames',
      },
      {
        id: 'lom_q7',
        question: 'What is the optimum angle of banking θ for a curve of radius r designed for vehicle speed v without relying on friction?',
        options: ['θ = tan^-1(v / rg)', 'θ = tan^-1(v^2 / rg)', 'θ = sin^-1(v^2 / rg)', 'θ = cos^-1(v / rg)'],
        correctIndex: 1,
        explanation: 'Balancing R sin θ = mv^2/r and R cos θ = mg yields tan θ = v^2 / (rg).',
        difficulty: 'Easy',
        topic: 'Banking of Roads',
      },
    ],
  },

  // 2. WORK, POWER AND ENERGY
  {
    id: 'work-power-energy',
    chapterNumber: 6,
    title: 'Work, Energy & Power',
    category: 'Mechanics',
    totalPagesInDoc: 10,
    highlights: [
      'Mechanical Work W = F · s = F s cos θ & SI unit Joule (1 J = 10^7 ergs)',
      'Work Done by a Variable Force W = ∫ F dx (Area under F-x curve)',
      'Conservative vs Non-Conservative Forces (path independence & closed loop work)',
      'Power P = dW/dt = F · v (1 horsepower = 746 Watts)',
      'Kinetic Energy and Relation with Linear Momentum: K = p^2 / 2m',
      'Work-Energy Theorem: Total work done equals change in kinetic energy',
      'Potential Energy of a Spring: U = 1/2 k x^2 & Conservation of Mechanical Energy',
      'Motion in a Vertical Circle: Critical speeds v_top = √(gl) and v_bottom = √(5gl)',
    ],
    keyFormulas: [
      { name: 'Work (Dot Product)', formula: 'W = F · s = F s cos θ = Fx x + Fy y + Fz z', details: 'Scalar quantity. Positive for θ < 90°, negative for θ > 90°, zero for θ = 90°.' },
      { name: 'Work by Variable Force', formula: 'W = ∫[x_A to x_B] F(x) dx', details: 'Equal to area under the F-x curve.' },
      { name: 'Kinetic Energy & Momentum', formula: 'K = 1/2 m v^2 = p^2 / (2m),  p = √(2mK)', details: 'If momentum is constant, K ∝ 1/m.' },
      { name: 'Work-Energy Theorem', formula: 'W_net = ΔK = 1/2 m v^2 - 1/2 m u^2', details: 'Valid for both constant and variable forces.' },
      { name: 'Spring Potential Energy', formula: 'U = 1/2 k x^2', details: 'Restoring force F = -kx. Spring constant k in N/m.' },
      { name: 'Power', formula: 'P = dW/dt = F · v', details: 'Units: Watt (J/s), 1 hp = 746 W.' },
      { name: 'Vertical Circle Minimum Velocity (Top)', formula: 'v_top = √(g·l)', details: 'String tension T_top = 0.' },
      { name: 'Vertical Circle Minimum Velocity (Bottom)', formula: 'v_bottom = √(5g·l)', details: 'Tension difference T_bottom - T_top = 6mg.' },
      { name: 'Conical Pendulum Time Period', formula: 'T = 2π √(l cos θ / g) = 2π √(h / g)', details: 'h is vertical distance below support.' },
    ],
    detailedSections: [
      {
        heading: '1. Work and Its Nature',
        subtopics: [
          {
            subheading: 'Definition and Units',
            content: 'Work is said to be done by a force when the point of application undergoes displacement. W = F s cos θ. Absolute SI unit: Joule (1 J = 1 N·m); CGS: Erg (1 J = 10^7 ergs). Gravitational unit: 1 kg-m = 9.8 Joules.',
          },
          {
            subheading: 'Zero and Negative Work',
            content: 'Work is zero when displacement is zero (pushing a fixed wall) or force is perpendicular to displacement (cos 90° = 0, e.g. centripetal force in circular motion, coolie carrying luggage on horizontal floor). Work is negative when force opposes displacement (friction, gravity when throwing a ball up).',
          },
        ],
      },
      {
        heading: '2. Conservative Forces & Work-Energy Theorem',
        subtopics: [
          {
            subheading: 'Conservative Forces',
            content: 'A force is conservative if work done around any closed path is zero (∮ F · dr = 0), and work done depends only on initial and final positions (e.g. gravitational force, electrostatic force, elastic spring force). Frictional and viscous forces are non-conservative.',
          },
          {
            subheading: 'Work-Energy Principle',
            content: 'Work done by the net force acting on a body equals the change in its kinetic energy: W_net = K_f - K_i. For conservative forces, F(x) = -dU/dx, hence ΔK + ΔU = 0, or K + U = constant.',
          },
        ],
      },
      {
        heading: '3. Motion in a Vertical Circle',
        subtopics: [
          {
            subheading: 'Critical Velocities',
            content: 'For a body of mass m tied to a string of length l to complete a vertical circle: velocity at highest point must be at least v_top = √(gl) where tension T = 0. By conservation of energy, velocity at lowest point must be at least v_bottom = √(5gl). Difference in tension between lowest and highest points is always 6mg.',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'wpe_q1',
        question: 'If the linear momentum of a body is increased by 50%, what is the percentage increase in its kinetic energy?',
        options: ['50%', '100%', '125%', '225%'],
        correctIndex: 2,
        explanation: 'K = p^2 / 2m. If p becomes 1.5p, K becomes (1.5)^2 K = 2.25K. Percentage increase = (2.25 - 1) × 100% = 125%.',
        difficulty: 'Medium',
        topic: 'Kinetic Energy and Momentum',
      },
      {
        id: 'wpe_q2',
        question: 'What is the work done by the centripetal force on an artificial satellite orbiting in a circular path around Earth?',
        options: ['Positive', 'Negative', 'Zero', 'Depends on satellite mass'],
        correctIndex: 2,
        explanation: 'The centripetal force is always perpendicular to the instantaneous displacement (θ = 90°), so W = F s cos 90° = 0.',
        difficulty: 'Easy',
        topic: 'Nature of Work Done',
      },
      {
        id: 'wpe_q3',
        question: 'A mass attached to a light string is whirled in a vertical circle of radius R. What is the minimum velocity required at the lowest point to complete the loop?',
        options: ['√(gR)', '√(2gR)', '√(3gR)', '√(5gR)'],
        correctIndex: 3,
        explanation: 'At the top v_min = √(gR). Using conservation of mechanical energy: 1/2 m v_bot^2 = 1/2 m (gR) + mg(2R) => v_bot = √(5gR).',
        difficulty: 'Medium',
        topic: 'Vertical Circle Motion',
      },
      {
        id: 'wpe_q4',
        question: 'A spring of force constant k is stretched by x. The potential energy stored is U. If it is further stretched by another x, the additional work done is:',
        options: ['U', '2U', '3U', '4U'],
        correctIndex: 2,
        explanation: 'Initial energy U1 = 1/2 k x^2 = U. Final energy U2 = 1/2 k (2x)^2 = 4 (1/2 k x^2) = 4U. Additional work W = U2 - U1 = 4U - U = 3U.',
        difficulty: 'Hard',
        topic: 'Spring Potential Energy',
      },
      {
        id: 'wpe_q5',
        question: 'Which of the following forces is a non-conservative force?',
        options: ['Gravitational force', 'Elastic spring force', 'Electrostatic force', 'Viscous force of fluid'],
        correctIndex: 3,
        explanation: 'Viscous force and friction dissipate mechanical energy into heat and their work depends on path length, making them non-conservative.',
        difficulty: 'Easy',
        topic: 'Conservative vs Non-conservative',
      },
    ],
  },

  // 3. ROTATIONAL MOTION
  {
    id: 'rotational-motion',
    chapterNumber: 7,
    title: 'System of Particles & Rotational Motion',
    category: 'Mechanics',
    totalPagesInDoc: 8,
    highlights: [
      'Rotational Kinematics: θ, ω = dθ/dt, α = dω/dt and kinematic equations',
      'Torque τ = r × F = I α and conditions for Mechanical Equilibrium',
      'Moment of Inertia I = ∑ m_i r_i^2 and Radius of Gyration k = √(I/M)',
      'Theorems of Moment of Inertia: Parallel Axis & Perpendicular Axis',
      'Moment of Inertia of Standard Bodies (Ring, Disc, Solid/Hollow Sphere, Rod)',
      'Angular Momentum L = r × p = I ω and Law of Conservation of Angular Momentum',
      'Pure Rolling Motion: v_cm = R ω, Total K.E. = 1/2 M v_cm^2 (1 + k^2 / R^2)',
      'Acceleration of rolling body on inclined plane: a = g sin θ / (1 + I / MR^2)',
    ],
    keyFormulas: [
      { name: 'Kinematic Equations of Rotation', formula: 'ω = ω0 + αt,  θ = ω0 t + 1/2 α t^2,  ω^2 - ω0^2 = 2αθ', details: 'Analogous to v = u + at, s = ut + 1/2 at^2.' },
      { name: 'Torque', formula: 'τ = r × F = r F sin θ = I α', details: 'Rotational analog of force. Unit: N·m.' },
      { name: 'Moment of Inertia', formula: 'I = ∑ mi ri^2 = M k^2', details: 'k is radius of gyration. Rotational inertia.' },
      { name: 'Parallel Axis Theorem', formula: 'I = I_cm + M d^2', details: 'Applicable to all 3D bodies for parallel axes.' },
      { name: 'Perpendicular Axis Theorem', formula: 'Iz = Ix + Iy', details: 'Applicable only to planar lamina.' },
      { name: 'Angular Momentum', formula: 'L = r × p = I ω,  τ_ext = dL/dt', details: 'Conserved when external torque τ_ext = 0.' },
      { name: 'Total K.E. of Rolling Body', formula: 'K_total = 1/2 M v_cm^2 + 1/2 I_cm ω^2 = 1/2 M v_cm^2 (1 + k^2 / R^2)', details: 'Combination of translation and rotation.' },
      { name: 'Acceleration on Incline', formula: 'a = g sin θ / (1 + k^2 / R^2)', details: 'Solid sphere reaches bottom first, hollow ring last.' },
    ],
    detailedSections: [
      {
        heading: '1. Moment of Inertia of Standard Bodies',
        subtopics: [
          {
            subheading: 'Standard Values',
            content: 'Circular Ring (about axis): MR^2. Circular Disc (about axis): 1/2 MR^2. Thin Rod (length L, through center): 1/12 ML^2; through end: 1/3 ML^2. Solid Cylinder: 1/2 MR^2. Hollow Cylinder: MR^2. Solid Sphere: 2/5 MR^2. Hollow Sphere: 2/3 MR^2.',
          },
        ],
      },
      {
        heading: '2. Rolling Motion and Dynamics',
        subtopics: [
          {
            subheading: 'Condition for Pure Rolling',
            content: 'In pure rolling on a stationary surface, point of contact is instantaneously at rest: v_cm = R ω. Static friction is required for rolling, but does zero work because contact point has zero displacement.',
          },
          {
            subheading: 'Race on Inclined Plane',
            content: 'When bodies roll down an incline of height h: v = √[2gh / (1 + k^2/R^2)]. The smaller the ratio k^2/R^2, the greater the acceleration. Order of finish: Solid Sphere (k^2/R^2 = 0.4) > Solid Cylinder/Disc (0.5) > Hollow Sphere (0.67) > Ring/Hollow Cylinder (1.0).',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'rot_q1',
        question: 'A solid sphere, a disc, and a ring of the same mass and radius roll down an inclined plane from the same height without slipping. Which body reaches the bottom first?',
        options: ['Ring', 'Disc', 'Solid sphere', 'All reach at the same time'],
        correctIndex: 2,
        explanation: 'Acceleration a = g sin θ / (1 + k^2/R^2). For solid sphere k^2/R^2 = 2/5 = 0.4 (smallest), so it has highest acceleration and reaches first.',
        difficulty: 'Medium',
        topic: 'Rolling on Inclined Plane',
      },
      {
        id: 'rot_q2',
        question: 'A ballet dancer stretches her arms outward while spinning on a frictionless floor. What happens to her angular velocity?',
        options: ['Increases', 'Decreases', 'Remains unchanged', 'Becomes zero'],
        correctIndex: 1,
        explanation: 'By conservation of angular momentum L = I ω = constant. Stretching arms increases moment of inertia I, so angular speed ω decreases.',
        difficulty: 'Easy',
        topic: 'Conservation of Angular Momentum',
      },
      {
        id: 'rot_q3',
        question: 'What is the moment of inertia of a uniform circular disc of mass M and radius R about its diameter?',
        options: ['MR^2', '1/2 MR^2', '1/4 MR^2', '2/5 MR^2'],
        correctIndex: 2,
        explanation: 'By perpendicular axis theorem Iz = Ix + Iy. For a symmetric disc Ix = Iy, so 2 Ix = Iz = 1/2 MR^2 => I_dia = 1/4 MR^2.',
        difficulty: 'Medium',
        topic: 'Perpendicular Axis Theorem',
      },
      {
        id: 'rot_q4',
        question: 'What is the ratio of rotational kinetic energy to total kinetic energy for a solid sphere rolling without slipping?',
        options: ['2/7', '5/7', '2/5', '1/2'],
        correctIndex: 0,
        explanation: 'K_rot = 1/2 I ω^2 = 1/2 (2/5 M R^2)(v/R)^2 = 1/5 M v^2. K_total = 1/2 M v^2 + 1/5 M v^2 = 7/10 M v^2. Ratio = (1/5) / (7/10) = 2/7.',
        difficulty: 'Hard',
        topic: 'Rolling Kinetic Energy',
      },
    ],
  },

  // 4. GRAVITATION
  {
    id: 'gravitation',
    chapterNumber: 8,
    title: 'Gravitation',
    category: 'Mechanics',
    totalPagesInDoc: 11,
    highlights: [
      'Newton’s Universal Law of Gravitation & Universal Constant G = 6.67 × 10^-11 N m^2/kg^2',
      'Acceleration Due to Gravity g = GM / R^2 & Relation with Mean Density',
      'Variation of g with Altitude: g_h = g(1 - 2h/R) and Depth: g_d = g(1 - d/R)',
      'Variation of g with Latitude: g’ = g - R ω^2 cos^2 λ (Maximum at poles, minimum at equator)',
      'Satellite Motion: Orbital Speed v_c = √(GM / r), Time Period T = 2π √(r^3 / GM)',
      'Kepler’s Three Laws: Law of Orbits, Law of Areas (Areal Velocity = const), Law of Periods (T^2 ∝ R^3)',
      'Escape Velocity v_e = √(2GM / R) = √(2gR) ≈ 11.2 km/s (v_e = √2 v_c)',
      'Geostationary Satellites: Height ≈ 36,000 km, Period = 24 hrs, and Weightlessness',
    ],
    keyFormulas: [
      { name: 'Universal Law of Gravitation', formula: 'F = G · m1 · m2 / r^2', details: 'Conservative, central force, independent of medium.' },
      { name: 'Acceleration Due to Gravity', formula: 'g = G·M / R^2 = 4/3 π G R ρ', details: 'Standard surface value g ≈ 9.8 m/s^2.' },
      { name: 'Variation with Height (h << R)', formula: 'g_h = g (1 - 2h / R)', details: 'Decreases linearly for small heights.' },
      { name: 'Variation with Depth d', formula: 'g_d = g (1 - d / R)', details: 'Becomes zero at the center of Earth (d = R).' },
      { name: 'Variation with Latitude λ', formula: "g' = g - R ω^2 cos^2 λ", details: 'Poles (λ=90°): g_pole = g; Equator (λ=0°): g_eq = g - R ω^2.' },
      { name: 'Orbital Velocity', formula: 'v_c = √(GM / (R + h)) ≈ √(gR) ≈ 7.92 km/s', details: 'Speed to orbit closely above surface.' },
      { name: 'Escape Velocity', formula: 'v_e = √(2GM / R) = √(2gR) = √2 v_c ≈ 11.2 km/s', details: 'Independent of mass and angle of projection.' },
      { name: 'Kepler’s Third Law', formula: 'T^2 = (4π^2 / GM) · r^3  =>  T^2 ∝ r^3', details: 'Harmonic law relating period and orbital radius.' },
      { name: 'Total Energy of Satellite', formula: 'T.E. = -G M m / (2r) = -K.E. = 1/2 P.E.', details: 'Negative sign indicates bound gravitational state.' },
    ],
    detailedSections: [
      {
        heading: "1. Acceleration Due to Gravity & Variations",
        subtopics: [
          {
            subheading: 'Altitude and Depth Comparison',
            content: 'At height h, g decreases twice as fast as at depth d for small distances (g_h = g(1 - 2h/R) vs g_d = g(1 - d/R)). Thus, the value of g at height h equals that at depth d = 2h.',
          },
          {
            subheading: 'Earth Rotation & Shape Effect',
            content: 'Due to rotation of Earth with angular speed ω, centrifugal force reduces effective gravity: g’ = g - R ω^2 cos^2 λ. If Earth stops rotating, g at the equator increases by R ω^2, while g at the poles remains unchanged.',
          },
        ],
      },
      {
        heading: "2. Kepler's Laws & Escape Dynamics",
        subtopics: [
          {
            subheading: "Kepler's Second Law",
            content: 'The line joining a planet to the sun sweeps out equal areas in equal intervals of time (dA/dt = L / 2m = constant). This is a direct consequence of the conservation of angular momentum under a central gravitational force.',
          },
          {
            subheading: 'Escape Velocity and Atmospheric Retention',
            content: 'Escape velocity is the minimum projection speed to break free from gravitational pull: v_e = √(2gR) ≈ 11.2 km/s on Earth. On the Moon, v_e ≈ 2.38 km/s, which is lower than the rms speed of gas molecules, explaining why the Moon has no atmosphere.',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'grav_q1',
        question: 'At what height h above the surface of the Earth does the acceleration due to gravity become g/4? (R is radius of Earth)',
        options: ['R/2', 'R', '2R', '4R'],
        correctIndex: 1,
        explanation: 'g_h = g · [R / (R + h)]^2. If g_h = g/4, then R / (R + h) = 1/2 => R + h = 2R => h = R.',
        difficulty: 'Medium',
        topic: 'Variation of g with Altitude',
      },
      {
        id: 'grav_q2',
        question: 'What is the relation between escape velocity (v_e) from the surface of Earth and orbital velocity (v_c) of a satellite orbiting close to Earth?',
        options: ['v_e = v_c', 'v_e = √2 · v_c', 'v_e = 2 · v_c', 'v_e = v_c / √2'],
        correctIndex: 1,
        explanation: 'v_e = √(2GM/R) and v_c = √(GM/R), hence v_e = √2 · v_c ≈ 1.414 v_c.',
        difficulty: 'Easy',
        topic: 'Escape & Orbital Velocity',
      },
      {
        id: 'grav_q3',
        question: 'Kepler’s second law (law of areas: dA/dt = constant) is a direct consequence of the conservation of:',
        options: ['Linear momentum', 'Energy', 'Angular momentum', 'Mass'],
        correctIndex: 2,
        explanation: 'Since the gravitational force is central, the torque about the Sun is zero (τ = r × F = 0), so angular momentum L is conserved and dA/dt = L/(2m) = constant.',
        difficulty: 'Easy',
        topic: "Kepler's Laws",
      },
      {
        id: 'grav_q4',
        question: 'If the radius of Earth shrinks by 1% while its mass remains constant, the acceleration due to gravity on its surface will:',
        options: ['Decrease by 1%', 'Increase by 1%', 'Increase by 2%', 'Decrease by 2%'],
        correctIndex: 2,
        explanation: 'g = GM / R^2. Differentiating: Δg/g = -2 (ΔR/R). If R decreases by 1% (ΔR/R = -1%), g increases by (-2)(-1%) = +2%.',
        difficulty: 'Medium',
        topic: 'Acceleration Due to Gravity',
      },
      {
        id: 'grav_q5',
        question: 'What is the orbital time period and approximate height of a geostationary communication satellite?',
        options: ['12 hours, 10,000 km', '24 hours, 36,000 km', '48 hours, 64,000 km', '84.6 minutes, 500 km'],
        correctIndex: 1,
        explanation: 'A geostationary satellite rotates from west to east with time period T = 24 hours at an altitude of approximately 35,800 km (~36,000 km).',
        difficulty: 'Easy',
        topic: 'Communication Satellite',
      },
    ],
  },

  // 5. PROPERTIES OF MATTER (SOLIDS & FLUIDS)
  {
    id: 'solids-and-fluids',
    chapterNumber: 9,
    title: 'Mechanical Properties of Solids & Fluids',
    category: 'Properties of Matter',
    totalPagesInDoc: 11,
    highlights: [
      'Stress-Strain Relationship & Hooke’s Law (Young’s, Bulk & Shear Modulus)',
      'Stress-Strain Curve: Proportional limit, Yield point, Ductile vs Brittle, Elastomers',
      'Elastic Potential Energy Density u = 1/2 × stress × strain = 1/2 Y (strain)^2',
      'Poisson’s Ratio σ = Lateral Strain / Longitudinal Strain (Theoretical -1 to 0.5)',
      'Pascal’s Law, Hydraulic Lift & Variation of Fluid Pressure P = P0 + ρgh',
      'Archimedes’ Principle, Buoyancy & Principle of Floatation',
      'Bernoulli’s Theorem P + 1/2 ρ v^2 + ρ g h = const & Torricelli’s Efflux v = √(2gh)',
      'Viscosity, Stokes’ Law F = 6πηrv & Terminal Velocity v_t = 2 r^2 (ρ - σ) g / 9η',
      'Surface Tension S, Excess Pressure in Drops (2T/R) and Bubbles (4T/R), Capillarity',
    ],
    keyFormulas: [
      { name: 'Hooke’s Law & Young’s Modulus', formula: 'Y = (F / A) / (ΔL / L) = F L / (A ΔL)', details: 'SI Unit: N/m^2 or Pa. Dimensions: [M L^-1 T^-2].' },
      { name: 'Bulk Modulus & Compressibility', formula: 'B = -ΔP / (ΔV / V),  k = 1 / B', details: 'Measures resistance to volume change.' },
      { name: 'Poisson’s Ratio', formula: 'σ = -(ΔD / D) / (ΔL / L)', details: 'Practical range for most solids: 0 to 0.5.' },
      { name: 'Equation of Continuity', formula: 'A1 · v1 = A2 · v2 = Constant', details: 'Consequence of conservation of mass in fluid flow.' },
      { name: 'Bernoulli’s Equation', formula: 'P + 1/2 ρ v^2 + ρ g h = Constant', details: 'Conservation of energy for streamline, incompressible, non-viscous fluid.' },
      { name: 'Torricelli’s Law of Efflux', formula: 'v = √(2gh)', details: 'Velocity of liquid flowing out of small orifice at depth h.' },
      { name: 'Stokes’ Law & Terminal Velocity', formula: 'F = 6πηrv,  v_t = 2 r^2 (ρ - σ) g / (9η)', details: 'Constant maximum velocity achieved by sphere in viscous fluid.' },
      { name: 'Excess Pressure (Drop vs Bubble)', formula: 'ΔP_drop = 2T / R,   ΔP_bubble = 4T / R', details: 'Soap bubble has two free liquid-air interfaces.' },
      { name: 'Capillary Rise (Jurin’s Law)', formula: 'h = 2 T cos θ / (r · ρ · g)', details: 'Wetting liquids (θ < 90°) ascend, non-wetting descend.' },
    ],
    detailedSections: [
      {
        heading: '1. Elasticity & Mechanical Properties of Solids',
        subtopics: [
          {
            subheading: 'Stress-Strain Curve Features',
            content: 'Region OA: Hooke’s law strictly obeyed (proportional limit). Point B: Elastic limit / yield point; removing load restores original shape. Region BD: Plastic flow with permanent deformation (set). Point D: Ultimate tensile strength. Point E: Fracture point. Materials with large plastic extension are ductile (copper, aluminium); small plastic range are brittle (cast iron, glass).',
          },
          {
            subheading: 'Bending of Beams',
            content: 'Depression at the centre of a supported beam under load W: δ = W L^3 / (4 b d^3 Y). Since depth d appears cubed in denominator, increasing beam depth reduces sagging most effectively, motivating the use of I-shaped girders.',
          },
        ],
      },
      {
        heading: '2. Hydrodynamics & Surface Phenomena',
        subtopics: [
          {
            subheading: 'Bernoulli Applications',
            content: 'Venturimeter measures flow rate Q = A1 A2 √[2gh / (A1^2 - A2^2)]. Dynamic lift of aircraft wings and Magnus effect in spinning balls result from pressure differences created by differing fluid velocities.',
          },
          {
            subheading: 'Surface Tension & Capillary Action',
            content: 'Surface tension S is force per unit length perpendicular to an imaginary line on the liquid surface. Angle of contact is acute for glass-water (concave meniscus, capillary rise) and obtuse for glass-mercury (convex meniscus, capillary depression).',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'sol_q1',
        question: 'Why are cross-sections of heavy structural steel girders and bridge beams made in the shape of an ‘I’?',
        options: [
          'To minimize bending depression δ while saving material and weight',
          'To increase shear modulus without changing volume',
          'To increase Poisson’s ratio',
          'To make the beam brittle',
        ],
        correctIndex: 0,
        explanation: 'Sagging δ = W L^3 / (4 b d^3 Y) depends inversely on d^3. An I-shape provides large depth d at the flanges where bending stresses are maximum, minimizing sag with reduced weight.',
        difficulty: 'Medium',
        topic: 'Bending of Beams',
      },
      {
        id: 'sol_q2',
        question: 'Two soap bubbles have radii in the ratio 2 : 1. What is the ratio of the excess pressure inside them?',
        options: ['1 : 2', '2 : 1', '1 : 4', '4 : 1'],
        correctIndex: 0,
        explanation: 'Excess pressure ΔP = 4T / R. Therefore ΔP1 / ΔP2 = R2 / R1 = 1 / 2.',
        difficulty: 'Easy',
        topic: 'Surface Tension & Bubbles',
      },
      {
        id: 'sol_q3',
        question: 'Water flows through a horizontal pipe of varying cross-section. At a point where the cross-sectional area is halved, the fluid speed becomes:',
        options: ['Halved', 'Doubled', 'Quadrupled', 'Remains unchanged'],
        correctIndex: 1,
        explanation: 'By the equation of continuity A1 v1 = A2 v2. If A2 = A1/2, then v2 = 2 v1 (velocity is doubled).',
        difficulty: 'Easy',
        topic: 'Equation of Continuity',
      },
      {
        id: 'sol_q4',
        question: 'A spherical raindrop of radius r falls through air with terminal velocity v_t. If two identical such raindrops coalesce into a single spherical drop, its new terminal velocity will be:',
        options: ['2^(1/3) v_t', '2^(2/3) v_t', '2 v_t', '4 v_t'],
        correctIndex: 1,
        explanation: 'v_t ∝ r^2. When two drops combine, volume doubles: 4/3 π R^3 = 2(4/3 π r^3) => R = 2^(1/3) r. Thus v_new ∝ R^2 = (2^(1/3) r)^2 = 2^(2/3) v_t.',
        difficulty: 'Hard',
        topic: 'Terminal Velocity',
      },
      {
        id: 'sol_q5',
        question: 'Which of the following substances displays elastic behavior with large strains up to several hundred percent without showing plastic flow (elastomer)?',
        options: ['Copper', 'Natural vulcanized rubber', 'Cast iron', 'Quartz'],
        correctIndex: 1,
        explanation: 'Rubber and the tissue of the aorta are elastomers; they stretch to large strains elastically without a well-defined plastic region.',
        difficulty: 'Easy',
        topic: 'Elastomers',
      },
    ],
  },

  // 6. THERMODYNAMICS & KINETIC THEORY
  {
    id: 'thermodynamics-ktg',
    chapterNumber: 12,
    title: 'Heat, Thermodynamics & Kinetic Theory',
    category: 'Thermal Physics',
    totalPagesInDoc: 29,
    highlights: [
      'First Law of Thermodynamics ΔQ = ΔU + W & Thermodynamic Indicator P-V Diagrams',
      'Isothermal (T=const, W = nRT ln(V2/V1)), Adiabatic (Q=0, W = nR(T1-T2)/(γ-1))',
      'Heat Engines: Efficiency η = 1 - Q2/Q1. Carnot Cycle: η = 1 - T_sink / T_source',
      'Refrigerator & Heat Pump: Coefficient of Performance COP β = Q2 / W',
      'Second Law of Thermodynamics: Kelvin-Planck & Clausius Statements',
      'Kinetic Theory of Gases: Pressure P = 1/3 n m v_rms^2 = 1/3 ρ v_rms^2',
      'Degrees of Freedom: Monoatomic (3), Diatomic Rigid (5), Non-Rigid (7)',
      'Law of Equipartition of Energy: 1/2 kB T per degree of freedom',
      'Mayer’s Formula Cp - Cv = R & Specific Heat Ratio γ = Cp / Cv',
      'Mean Free Path λ = 1 / (√2 π n d^2) & Maxwell Speed Distribution',
    ],
    keyFormulas: [
      { name: 'First Law of Thermodynamics', formula: 'ΔQ = ΔU + ΔW,  where W = ∫ P dV', details: 'Sign: ΔQ > 0 (heat added), W > 0 (gas expands), ΔU > 0 (temperature rises).' },
      { name: 'Isothermal Work Done', formula: 'W_iso = n R T ln(V2 / V1) = 2.303 n R T log10(V2 / V1)', details: 'ΔU = 0 since temperature is constant.' },
      { name: 'Adiabatic Relation & Work', formula: 'P V^γ = const,  W_adi = (P1 V1 - P2 V2) / (γ - 1) = n R (T1 - T2) / (γ - 1)', details: 'Slope of adiabatic curve is γ times isothermal curve.' },
      { name: 'Carnot Engine Efficiency', formula: 'η_Carnot = 1 - T2 / T1 = (T1 - T2) / T1', details: 'T1 is source temperature, T2 is sink temperature in Kelvin.' },
      { name: 'Refrigerator COP', formula: 'β = Q2 / W = T2 / (T1 - T2)', details: 'Coefficient of Performance.' },
      { name: 'Pressure from Kinetic Theory', formula: 'P = 1/3 n m v_rms^2 = 2/3 E_v', details: 'Pressure is 2/3 of translational kinetic energy per unit volume.' },
      { name: 'RMS Speed of Gas Molecules', formula: 'v_rms = √(3RT / M) = √(3 kB T / m)', details: 'v_rms > v_avg > v_mp.' },
      { name: 'Molar Heat Capacities', formula: 'Cv = f/2 · R,   Cp = (f/2 + 1)R,   γ = 1 + 2/f', details: 'f=3 for monoatomic (γ=5/3=1.67); f=5 for diatomic (γ=7/5=1.4).' },
      { name: 'Mean Free Path', formula: 'λ = 1 / (√2 π n d^2)', details: 'Inversely proportional to number density n and molecular diameter squared.' },
    ],
    detailedSections: [
      {
        heading: '1. Thermodynamic Cycles & Laws',
        subtopics: [
          {
            subheading: 'Carnot Cycle Analysis',
            content: 'Consists of four reversible processes: (1) Isothermal expansion at T1, (2) Adiabatic expansion from T1 to T2, (3) Isothermal compression at T2, (4) Adiabatic compression back to T1. Carnot theorem states no heat engine working between two given reservoirs can be more efficient than a reversible Carnot engine.',
          },
          {
            subheading: 'Second Law of Thermodynamics',
            content: 'Kelvin-Planck statement: It is impossible to construct an engine operating in a cycle that produces no other effect than the absorption of heat from a single reservoir and its complete conversion into work. Clausius statement: Heat cannot spontaneously flow from a colder body to a hotter body without external work.',
          },
        ],
      },
      {
        heading: '2. Kinetic Theory & Equipartition',
        subtopics: [
          {
            subheading: 'Degrees of Freedom and Internal Energy',
            content: 'Monoatomic gas (He, Ne, Ar): 3 translational degrees of freedom, U = 3/2 nRT, Cv = 3/2 R. Diatomic rigid gas (O2, N2): 3 translational + 2 rotational = 5 DOF, U = 5/2 nRT, Cv = 5/2 R, Cp = 7/2 R, γ = 1.4. At high temperatures, vibrational modes become active, adding 2 degrees of freedom (1 kinetic + 1 potential).',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'thermo_q1',
        question: 'A Carnot engine operates between a source at 500 K and a sink at 300 K. What is its thermal efficiency?',
        options: ['60%', '40%', '50%', '20%'],
        correctIndex: 1,
        explanation: 'η = 1 - T_sink / T_source = 1 - 300/500 = 200/500 = 0.40 = 40%.',
        difficulty: 'Easy',
        topic: 'Carnot Engine Efficiency',
      },
      {
        id: 'thermo_q2',
        question: 'In an adiabatic expansion of an ideal gas, the work done by the gas is at the expense of its:',
        options: ['External heat input', 'Internal energy', 'Atmospheric pressure', 'Surface tension'],
        correctIndex: 1,
        explanation: 'In adiabatic process ΔQ = 0. By First Law ΔQ = ΔU + W => W = -ΔU. Work done by the gas reduces its internal energy, causing temperature to fall.',
        difficulty: 'Easy',
        topic: 'Adiabatic Process',
      },
      {
        id: 'thermo_q3',
        question: 'What is the ratio of molar heat capacities γ = Cp / Cv for a rigid diatomic gas like Nitrogen (N2)?',
        options: ['1.67 (5/3)', '1.40 (7/5)', '1.33 (4/3)', '1.28 (9/7)'],
        correctIndex: 1,
        explanation: 'For a rigid diatomic gas, degrees of freedom f = 5. Cv = 5/2 R, Cp = 7/2 R, so γ = Cp/Cv = 7/5 = 1.40.',
        difficulty: 'Medium',
        topic: 'Degrees of Freedom',
      },
      {
        id: 'thermo_q4',
        question: 'At what temperature will the root mean square (rms) speed of oxygen molecules be double its value at 0°C (273 K)?',
        options: ['546 K', '819 K', '1092 K', '1365 K'],
        correctIndex: 2,
        explanation: 'v_rms ∝ √T. For v_rms to double, T must increase 4 times: T = 4 × 273 K = 1092 K.',
        difficulty: 'Medium',
        topic: 'RMS Velocity',
      },
      {
        id: 'thermo_q5',
        question: 'Why does the slope of an adiabatic curve on a P-V diagram exceed the slope of an isothermal curve at any given point?',
        options: [
          'Because (dP/dV)_adi = γ · (dP/dV)_iso and γ > 1',
          'Because internal energy is zero',
          'Because temperature is constant',
          'Because volume cannot change',
        ],
        correctIndex: 0,
        explanation: 'Isothermal slope is -P/V. Adiabatic slope is -γ(P/V). Since γ = Cp/Cv > 1, the adiabatic curve is γ times steeper.',
        difficulty: 'Medium',
        topic: 'Indicator Diagram Slopes',
      },
    ],
  },

  // 7. OSCILLATIONS AND WAVES
  {
    id: 'oscillations-waves',
    chapterNumber: 14,
    title: 'Oscillations & Waves',
    category: 'Vibrations & Acoustics',
    totalPagesInDoc: 8,
    highlights: [
      'Simple Harmonic Motion (S.H.M.): Differential Equation d^2x/dt^2 + ω^2 x = 0',
      'Displacement x = A sin(ωt + φ), Velocity v = ω√(A^2 - x^2), Acceleration a = -ω^2 x',
      'Energy in S.H.M.: Kinetic Energy K = 1/2 m ω^2(A^2 - x^2), Potential Energy U = 1/2 m ω^2 x^2',
      'Total Energy is Constant: E = 1/2 m ω^2 A^2 = 1/2 k A^2',
      'Spring Oscillations: T = 2π √(m/k); Series (1/k = 1/k1 + 1/k2), Parallel (k = k1 + k2)',
      'Simple Pendulum: T = 2π √(l/g); Second’s Pendulum length l ≈ 1 m (T = 2 s)',
      'Speed of Sound: Newton’s Formula v = √(P/ρ) & Laplace’s Correction v = √(γP/ρ) = 331.3 m/s',
      'Standing Waves in Stretched Strings: f_n = n v / (2L) (all harmonics)',
      'Vibrations in Organ Pipes: Open Pipe (all harmonics), Closed Pipe (only odd harmonics)',
      'Beats Frequency f_b = |f1 - f2| & Doppler Effect for Sound',
    ],
    keyFormulas: [
      { name: 'S.H.M. Acceleration', formula: 'a = -ω^2 · x', details: 'Directed towards mean position at all instants.' },
      { name: 'S.H.M. Velocity', formula: 'v = ± ω √(A^2 - x^2)', details: 'Maximum at mean position (v_max = Aω), zero at extremes.' },
      { name: 'Total Energy of S.H.M.', formula: 'E = K + U = 1/2 m ω^2 A^2 = 1/2 k A^2', details: 'Constant at all positions and time instants.' },
      { name: 'Simple Pendulum Period', formula: 'T = 2π √(l / g)', details: 'Independent of mass of bob and amplitude (for small θ).' },
      { name: 'Laplace’s Formula for Speed of Sound', formula: 'v = √(γ P / ρ) = √(γ R T / M)', details: 'Adiabatic process assumption; resolves Newton’s 16% error.' },
      { name: 'Open Organ Pipe Harmonics', formula: 'f_n = n · v / (2L),  n = 1, 2, 3...', details: 'Antinodes at both open ends; all harmonics present.' },
      { name: 'Closed Organ Pipe Harmonics', formula: 'f_n = (2n - 1) · v / (4L),  n = 1, 2, 3...', details: 'Node at closed end; only odd harmonics (1, 3, 5...) present.' },
      { name: 'Beats Frequency', formula: 'f_beat = |f1 - f2|', details: 'Max audible beats distinguishable by human ear is ~10-16 Hz.' },
      { name: 'Doppler Effect', formula: "f' = f0 · (v ± v_L) / (v ∓ v_S)", details: 'Apparent frequency when source and listener are in relative motion.' },
    ],
    detailedSections: [
      {
        heading: '1. S.H.M. Dynamics and Energy',
        subtopics: [
          {
            subheading: 'Kinematics & Graphs',
            content: 'In S.H.M., restoring force F = -kx. Phase difference between displacement and velocity is π/2; between displacement and acceleration is π. Total mechanical energy E = 1/2 k A^2 is conserved, transforming between kinetic (max at x = 0) and potential (max at x = ±A).',
          },
          {
            subheading: 'Pendulum in an Accelerating Frame',
            content: 'In an elevator accelerating upward with acceleration a: T = 2π √[l / (g + a)] (period decreases). In downward acceleration a: T = 2π √[l / (g - a)] (period increases). In free fall (a = g): T = ∞ (pendulum ceases to oscillate).',
          },
        ],
      },
      {
        heading: '2. Acoustics & Waves',
        subtopics: [
          {
            subheading: 'Newton vs Laplace Formulation',
            content: 'Newton assumed sound propagation in air is isothermal (v = √(P/ρ) ≈ 280 m/s at STP). Laplace corrected this by recognizing that compressions and rarefactions happen so rapidly that heat exchange is zero (adiabatic process), giving v = √(γP/ρ) ≈ 331.3 m/s, matching experimental reality.',
          },
          {
            subheading: 'Organ Pipes Comparison',
            content: 'An open pipe of length L has fundamental frequency f_open = v/(2L) and produces all harmonics (f, 2f, 3f...). A closed pipe of length L has fundamental f_closed = v/(4L) = 1/2 f_open and produces only odd harmonics (f, 3f, 5f...). An open pipe produces a richer musical tone.',
          },
        ],
      },
    ],
    mcqQuestions: [
      {
        id: 'osc_q1',
        question: 'At what displacement from the mean position is the kinetic energy of an oscillator executing S.H.M. equal to its potential energy?',
        options: ['x = A / 2', 'x = A / √2', 'x = A / √3', 'x = A / 4'],
        correctIndex: 1,
        explanation: 'K.E. = 1/2 k (A^2 - x^2) and P.E. = 1/2 k x^2. Equating: A^2 - x^2 = x^2 => 2x^2 = A^2 => x = A / √2 ≈ 0.707 A.',
        difficulty: 'Medium',
        topic: 'Energy in S.H.M.',
      },
      {
        id: 'osc_q2',
        question: 'Why did Laplace correct Newton’s formula for the speed of sound in a gas?',
        options: [
          'Sound propagation is an isothermal process',
          'Sound propagation is an adiabatic process with no heat exchange',
          'Air has zero compressibility',
          'Sound waves are transverse in gases',
        ],
        correctIndex: 1,
        explanation: 'Compressions and rarefactions occur so quickly that no heat can enter or leave the system, making the process adiabatic: v = √(γP/ρ).',
        difficulty: 'Easy',
        topic: 'Laplace Correction',
      },
      {
        id: 'osc_q3',
        question: 'An open organ pipe has a fundamental frequency of 300 Hz. If one of its ends is closed, what will be its new fundamental frequency?',
        options: ['150 Hz', '300 Hz', '600 Hz', '75 Hz'],
        correctIndex: 0,
        explanation: 'f_open = v / (2L) = 300 Hz. When closed at one end, f_closed = v / (4L) = 1/2 f_open = 300 / 2 = 150 Hz.',
        difficulty: 'Medium',
        topic: 'Organ Pipes',
      },
      {
        id: 'osc_q4',
        question: 'Two tuning forks produce 4 beats per second. If the frequency of one fork is 256 Hz, what are the possible frequencies of the other fork?',
        options: ['252 Hz or 260 Hz', '254 Hz or 258 Hz', '250 Hz or 262 Hz', '255 Hz or 257 Hz'],
        correctIndex: 0,
        explanation: 'Beat frequency f_b = |f1 - f2| = 4 Hz. Therefore f2 = 256 ± 4 = 252 Hz or 260 Hz.',
        difficulty: 'Easy',
        topic: 'Beats Phenomenon',
      },
      {
        id: 'osc_q5',
        question: 'A train moving at 34 m/s blows a horn of frequency 500 Hz towards a stationary observer. What is the apparent frequency heard? (Speed of sound = 340 m/s)',
        options: ['450 Hz', '500 Hz', '555.5 Hz', '600 Hz'],
        correctIndex: 2,
        explanation: "By Doppler's formula: f' = f0 [v / (v - v_S)] = 500 × [340 / (340 - 34)] = 500 × (340 / 306) ≈ 555.5 Hz.",
        difficulty: 'Hard',
        topic: 'Doppler Effect',
      },
    ],
  },
];
