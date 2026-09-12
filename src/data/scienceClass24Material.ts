export interface ScienceQuizQuestion {
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

export interface ScienceFormulaOrEquation {
  name: string;
  equation: string;
  details: string;
}

export interface ScienceTopicHighlight {
  heading: string;
  points: string[];
  reactionsOrEquations?: string[];
}

export interface ScienceChapter {
  chapterNumber: number;
  title: string;
  category: 'Chemical Sciences' | 'Life Sciences' | 'Natural Phenomena & Physics' | 'Applied Science & Environment';
  totalPages: number;
  summary: string;
  coreConcepts: ScienceTopicHighlight[];
  importantEquations: ScienceFormulaOrEquation[];
  mcqs: ScienceQuizQuestion[];
}

export const scienceClass24Data: ScienceChapter[] = [
  // CHAPTER 1: CHEMICAL REACTIONS AND EQUATIONS
  {
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    category: 'Chemical Sciences',
    totalPages: 9,
    summary:
      'A chemical change involves breaking old chemical bonds and forming new substances with entirely distinct properties. This chapter explores word and skeletal equations, the law of conservation of mass, systematic hit-and-trial balancing, exothermic vs endothermic reactions, and major reaction classes: combination, decomposition (thermal, electrolytic, photolytic), displacement, double displacement, precipitation, neutralization, redox (classical and electronic transfer), and daily-life effects like corrosion and rancidity.',
    importantEquations: [
      { name: 'Photosynthesis / Endothermic', equation: '6CO₂ + 12H₂O + Sunlight/Chlorophyll → C₆H₁₂O₆ + 6H₂O + 6O₂', details: 'Conversion of solar radiant energy into chemical glucose bonds' },
      { name: 'Thermal Decomposition of Lead Nitrate', equation: '2Pb(NO₃)₂(s) —Δ→ 2PbO(s) + 4NO₂(g) + O₂(g)', details: 'Produces yellow lead monoxide residue and brown nitrogen dioxide fumes' },
      { name: 'Electrolytic Decomposition of Water', equation: '2H₂O(l) —electric current→ 2H₂(g) + O₂(g)', details: 'Volume ratio of hydrogen collected at cathode to oxygen at anode is exactly 2:1' },
      { name: 'Photolytic Decomposition of Silver Chloride', equation: '2AgCl(s) —sunlight→ 2Ag(s) + Cl₂(g)', details: 'White AgCl turns grey; foundation of black-and-white photography' },
      { name: 'Thermite Reaction / Displacement', equation: 'Fe₂O₃(s) + 2Al(s) —Δ→ Al₂O₃(s) + 2Fe(l) + Heat', details: 'Molten iron produced is used for welding railway tracks and machine parts' },
      { name: 'Rusting of Iron (Hydrated Ferric Oxide)', equation: '4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O', details: 'Requires both oxygen and moisture; causes structural degradation' }
    ],
    coreConcepts: [
      {
        heading: 'Indicators of a Chemical Reaction',
        points: [
          'Change in state (e.g., burning of candle wax producing water vapor and carbon dioxide)',
          'Change in color (e.g., blue copper sulphate turning light green upon adding iron nail)',
          'Evolution of a gas (e.g., zinc reacting with dilute H₂SO₄ liberating hydrogen gas with pop sound)',
          'Change in temperature (exothermic e.g., quicklime + water; endothermic e.g., barium hydroxide + ammonium chloride)'
        ]
      },
      {
        heading: 'Balancing Chemical Equations & Hit-and-Trial Rules',
        points: [
          'Law of Conservation of Mass: Total mass of reactants equals total mass of products; atoms cannot be created or destroyed.',
          'Start balancing with the compound containing the maximum number of atoms.',
          'Balance elements with high frequency first (often metals/oxygen/hydrogen), and never modify chemical subscripts inside chemical formulas.'
        ],
        reactionsOrEquations: [
          '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂',
          '3Fe + 4H₂O ⇌ Fe₃O₄ + 4H₂'
        ]
      },
      {
        heading: 'Types of Chemical Reactions',
        points: [
          'Combination (Synthesis): Two or more reactants combine to form a single product. Example: CaO + H₂O → Ca(OH)₂ (slaked lime).',
          'Decomposition: A single reactant breaks down into two or more simpler products via heat (thermal), electricity (electrolysis), or light (photolysis).',
          'Displacement: A more reactive element displaces a less reactive element from its salt solution (Fe + CuSO₄ → FeSO₄ + Cu).',
          'Double Displacement: Mutual exchange of ions between two compounds. Includes Precipitation (formation of insoluble solid, e.g., Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl) and Neutralization (Acid + Base → Salt + Water).',
          'Redox (Reduction-Oxidation): Simultaneous oxidation (gain of O, loss of H, or loss of electrons) and reduction (loss of O, gain of H, or gain of electrons).'
        ]
      },
      {
        heading: 'Corrosion and Rancidity in Everyday Life',
        points: [
          'Corrosion: Slow eating away of metals by atmospheric moisture, oxygen, and carbon dioxide. Iron rusts to reddish-brown Fe₂O₃·xH₂O; copper acquires green coating of basic copper carbonate CuCO₃·Cu(OH)₂; silver tarnishes black due to Ag₂S.',
          'Prevention: Galvanizing (zinc coating), painting, greasing, sacrificial protection, and alloying (e.g., stainless steel = Fe + Cr + Ni).',
          'Rancidity: Oxidation of unsaturated fats and oils causing foul taste and smell. Prevented by antioxidants (BHA, BHT, Vitamin C), packaging with unreactive nitrogen gas, and airtight vacuum containers.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch1_q1',
        chapterNumber: 1,
        chapterTitle: 'Chemical Reactions and Equations',
        question: 'When aqueous solutions of barium chloride and sodium sulphate are mixed, an insoluble white precipitate is formed. What is the chemical formula of this precipitate?',
        options: ['BaSO₄', 'NaCl', 'BaS', 'Na₂SO₄'],
        correctIndex: 0,
        explanation: 'The reaction is Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2NaCl(aq). Barium sulphate (BaSO₄) is insoluble in water and forms the white precipitate.',
        topic: 'Double Displacement & Precipitation',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch1_q2',
        chapterNumber: 1,
        chapterTitle: 'Chemical Reactions and Equations',
        question: 'In the reaction: CuO + H₂ —Δ→ Cu + H₂O, which substance acts as the oxidizing agent?',
        options: ['H₂', 'CuO', 'Cu', 'H₂O'],
        correctIndex: 1,
        explanation: 'CuO loses oxygen to form Cu, meaning it undergoes reduction. The substance that undergoes reduction supplies oxygen and acts as the oxidizing agent.',
        topic: 'Redox Reactions',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch1_q3',
        chapterNumber: 1,
        chapterTitle: 'Chemical Reactions and Equations',
        question: 'During the electrolysis of acidified water, what is the ratio of the volume of hydrogen gas collected at the cathode to oxygen gas collected at the anode?',
        options: ['1:1', '2:1', '1:2', '3:1'],
        correctIndex: 1,
        explanation: 'The balanced equation is 2H₂O(l) → 2H₂(g) + O₂(g). Two volumes of hydrogen are liberated at the cathode for every one volume of oxygen at the anode (ratio 2:1).',
        topic: 'Electrolytic Decomposition',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch1_q4',
        chapterNumber: 1,
        chapterTitle: 'Chemical Reactions and Equations',
        question: 'Why are potato chip packets flushed with nitrogen gas before sealing?',
        options: [
          'To increase the crispiness by adding moisture',
          'To prevent oxidation of oils and fats (rancidity)',
          'To disinfect bacteria with acidic atmosphere',
          'To cool the chips below freezing temperature'
        ],
        correctIndex: 1,
        explanation: 'Nitrogen is an unreactive inert gas that replaces oxygen inside the packet, preventing aerobic oxidation of unsaturated fats/oils, thereby avoiding rancidity.',
        topic: 'Rancidity Prevention',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch1_q5',
        chapterNumber: 1,
        chapterTitle: 'Chemical Reactions and Equations',
        question: 'On heating green crystals of ferrous sulphate (FeSO₄·7H₂O), brown ferric oxide is formed along with which two gaseous products?',
        options: ['SO₂ and SO₃', 'CO and CO₂', 'NO₂ and N₂O', 'H₂S and O₂'],
        correctIndex: 0,
        explanation: '2FeSO₄(s) —Δ→ Fe₂O₃(s) + SO₂(g) + SO₃(g). Sulphur dioxide and sulphur trioxide gases have a characteristic smell of burning sulphur.',
        topic: 'Thermal Decomposition',
        difficulty: 'Hard'
      }
    ]
  },

  // CHAPTER 2: ACIDS, BASES AND SALTS
  {
    chapterNumber: 2,
    title: 'Acids, Bases and Salts',
    category: 'Chemical Sciences',
    totalPages: 14,
    summary:
      'Acids furnish hydronium ions (H₃O⁺) in aqueous solutions, while bases furnish hydroxide ions (OH⁻). This unit comprehensively covers organic acids from natural sources, mineral acids, pH scale calculations, indicators (litmus, phenolphthalein, methyl orange, universal indicator, olfactory), acid-base neutralisation, and commercially crucial industrial salts: Sodium chloride, Washing Soda (Solvay process), Baking Soda, Bleaching Powder, Caustic Soda (Chlor-alkali process), and Plaster of Paris.',
    importantEquations: [
      { name: 'Formation of Hydronium Ion', equation: 'HCl + H₂O → H₃O⁺ + Cl⁻', details: 'Hydrogen ions cannot exist alone; they associate with polar water molecules' },
      { name: 'Chlor-Alkali Process (Caustic Soda)', equation: '2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g)', details: 'Chlorine gas collected at anode; Hydrogen gas collected at cathode; NaOH near cathode' },
      { name: 'Solvay Reaction for Baking Soda', equation: 'NaCl + H₂O + CO₂ + NH₃ → NH₄Cl + NaHCO₃↓', details: 'Sodium hydrogen carbonate precipitates out due to lower solubility in brine' },
      { name: 'Thermal Conversion of Baking Soda', equation: '2NaHCO₃ —Δ→ Na₂CO₃ + H₂O + CO₂↑', details: 'CO₂ released causes cake batter to rise, making bakery items soft and spongy' },
      { name: 'Preparation of Plaster of Paris', equation: 'CaSO₄·2H₂O (Gypsum) —373 K (100°C)→ CaSO₄·½H₂O (POP) + 1½ H₂O', details: 'Careful temperature control is required to prevent dead-burnt plaster (anhydrous CaSO₄)' },
      { name: 'Setting of Plaster of Paris', equation: 'CaSO₄·½H₂O + 1½ H₂O → CaSO₄·2H₂O (Gypsum)', details: 'Exothermic hardening reaction forming a solid interlocking crystalline mass within 15 minutes' }
    ],
    coreConcepts: [
      {
        heading: 'Natural Sources of Common Organic Acids',
        points: [
          'Vinegar: Acetic acid (Ethanoic acid CH₃COOH)',
          'Sour milk / Curd: Lactic acid',
          'Oranges & Lemons: Citric acid',
          'Tamarind & Unripe Grapes: Tartaric acid',
          'Tomato: Oxalic acid',
          'Ant sting & Nettle leaf: Formic acid (Methanoic acid HCOOH) - neutralized by mild baking soda'
        ]
      },
      {
        heading: 'The pH Scale and Importance in Daily Life',
        points: [
          'Definition: pH = -log[H⁺]. Scale ranges from 0 (strongly acidic) to 7 (neutral) to 14 (strongly alkaline).',
          'Human Blood & Body pH: Maintained strictly in narrow range of 7.0 to 7.8.',
          'Acid Rain: Rainwater with pH less than 5.6; lowers aquatic water pH and corrodes monuments.',
          'Digestive System: Gastric juice (pH ~ 1.2 to 2.0) contains HCl; excess acid causes acidity, treated with antacids (milk of magnesia Mg(OH)₂ or NaHCO₃).',
          'Tooth Decay: Enamel (calcium hydroxyapatite) begins corroding when mouth pH falls below 5.5 due to bacterial acid production from sugar breakdown.'
        ]
      },
      {
        heading: 'Water of Crystallization & Industrial Salts',
        points: [
          'Water of Crystallization: Fixed number of water molecules chemically bound in one formula unit of a crystalline salt.',
          'Washing Soda: Na₂CO₃·10H₂O (dehydrate salt; effloresces to monohydrate in dry air).',
          'Blue Vitriol (Copper sulphate): CuSO₄·5H₂O (blue; turns anhydrous white on heating).',
          'Gypsum: CaSO₄·2H₂O → heated to 373 K yields Plaster of Paris CaSO₄·½H₂O.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch2_q1',
        chapterNumber: 2,
        chapterTitle: 'Acids, Bases and Salts',
        question: 'Tooth enamel is the hardest substance in the human body. At what pH value in the mouth does tooth enamel start corroding?',
        options: ['Below 5.5', 'Between 7.0 and 7.8', 'Above 8.5', 'Below 2.0'],
        correctIndex: 0,
        explanation: 'Bacteria present in the mouth produce acids by degrading leftover sugars, dropping mouth pH below 5.5, which dissolves calcium phosphate enamel.',
        topic: 'pH in Everyday Life',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch2_q2',
        chapterNumber: 2,
        chapterTitle: 'Acids, Bases and Salts',
        question: 'In the Chlor-alkali process, what products are liberated at the anode and cathode respectively?',
        options: [
          'Anode: Cl₂ gas; Cathode: H₂ gas',
          'Anode: H₂ gas; Cathode: Cl₂ gas',
          'Anode: O₂ gas; Cathode: Na metal',
          'Anode: Cl₂ gas; Cathode: NaOH solid'
        ],
        correctIndex: 0,
        explanation: 'In the electrolysis of concentrated aqueous NaCl (brine), chlorine gas (Cl₂) is liberated at the positive anode, while hydrogen gas (H₂) is liberated at the negative cathode.',
        topic: 'Chlor-Alkali Process',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch2_q3',
        chapterNumber: 2,
        chapterTitle: 'Acids, Bases and Salts',
        question: 'What is the correct chemical representation of Plaster of Paris (POP)?',
        options: ['CaSO₄·2H₂O', 'CaSO₄·½H₂O', 'CaSO₄·H₂O', '2CaSO₄·H₂O'],
        correctIndex: 1,
        explanation: 'Plaster of Paris is calcium sulphate hemihydrate, CaSO₄·½H₂O (or written as (CaSO₄)₂·H₂O, where two formula units of CaSO₄ share one water molecule).',
        topic: 'Plaster of Paris',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch2_q4',
        chapterNumber: 2,
        chapterTitle: 'Acids, Bases and Salts',
        question: 'Which of the following acids is naturally present in ant stings causing a burning sensation?',
        options: ['Methanoic acid', 'Oxalic acid', 'Tartaric acid', 'Citric acid'],
        correctIndex: 0,
        explanation: 'Ant stings inject methanoic acid (formic acid, HCOOH). Applying a mild base like baking soda provides instant relief through neutralization.',
        topic: 'Natural Organic Acids',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 3: METALS AND NON-METALS
  {
    chapterNumber: 3,
    title: 'Metals and Non-metals',
    category: 'Chemical Sciences',
    totalPages: 30,
    summary:
      'Metals are electropositive elements with high ductility, malleability, sonority, and electrical conductivity, while non-metals exhibit electronegative behavior. This chapter covers the reactivity series, chemical reactions with air, water, and acids, ionic bonding versus covalent bonding (Lewis electron-dot structures), and the complete metallurgical extraction cycle: concentration (froth floatation, hydraulic washing, magnetic separation), conversion to oxide (calcination vs roasting), chemical/electrolytic reduction, and electrolytic refining.',
    importantEquations: [
      { name: 'Roasting of Zinc Blende (Sulphide Ore)', equation: '2ZnS(s) + 3O₂(g) —Heat in excess air→ 2ZnO(s) + 2SO₂(g)↑', details: 'Sulphide ores are converted to oxides by heating strongly in excess air' },
      { name: 'Calcination of Calamine (Carbonate Ore)', equation: 'ZnCO₃(s) —Heat in limited air→ ZnO(s) + CO₂(g)↑', details: 'Carbonate ores are decomposed into oxides in limited air below melting point' },
      { name: 'Reduction with Carbon Coke', equation: 'ZnO(s) + C(s) —Δ→ Zn(s) + CO(g)', details: 'Coke acts as an inexpensive reducing agent for moderately reactive metals' },
      { name: 'Thermite (Aluminothermic) Welding', equation: 'Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Tremendous Heat', details: 'Molten iron flows into cracked girder joints and rail tracks' },
      { name: 'Electrolytic Refining of Copper', equation: 'Anode: Cu(impure) → Cu²⁺ + 2e⁻ | Cathode: Cu²⁺ + 2e⁻ → Cu(pure)', details: 'Impurities like Au and Ag settle down as anode mud; Cu deposits on pure cathode strip' }
    ],
    coreConcepts: [
      {
        heading: 'The Reactivity (Activity) Series of Metals',
        points: [
          'High Reactivity: Potassium (K), Sodium (Na), Calcium (Ca), Magnesium (Mg), Aluminium (Al). Cannot be reduced with carbon; extracted by electrolytic reduction of molten chlorides or oxides.',
          'Medium Reactivity: Zinc (Zn), Iron (Fe), Lead (Pb), Copper (Cu). Occur as sulphides or carbonates; reduced using carbon or carbon monoxide after roasting/calcination.',
          'Low Reactivity: Silver (Ag), Gold (Au), Platinum (Pt). Often found in native (free) state; mercury extracted simply by heating cinnabar (HgS).'
        ]
      },
      {
        heading: 'Ionic (Electrovalent) vs Covalent Bonding',
        points: [
          'Ionic Bonds: Complete transfer of electrons from a metal (cation) to a non-metal (anion). Examples: NaCl (Na⁺ + Cl⁻), MgCl₂ (Mg²⁺ + 2Cl⁻), CaO (Ca²⁺ + O²⁻).',
          'Ionic Properties: High melting and boiling points due to strong electrostatic crystal lattice forces; hard and brittle; conduct electricity in molten and aqueous states but NOT in solid state.',
          'Covalent Bonds: Mutual sharing of electron pairs between non-metallic atoms. Examples: H₂ (single bond), O₂ (double bond), N₂ (triple bond), CH₄ (methane tetravalent).'
        ]
      },
      {
        heading: 'Metallurgy: From Ore to Pure Metal',
        points: [
          'Gangue: Sandy, rocky, earthy impurities associated with mined ores.',
          'Froth Floatation: Employs pine oil and collectors to selectively wet sulphide ores, floating them with froth while gangue sinks in water.',
          'Roasting vs Calcination: Roasting heats sulphide ores in excess oxygen; Calcination heats carbonate/hydrated ores in absent or limited oxygen.',
          'Electrolytic Refining: Impure metal is made the anode; a thin sheet of pure metal is the cathode; electrolyte is a soluble metal salt solution.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch3_q1',
        chapterNumber: 3,
        chapterTitle: 'Metals and Non-metals',
        question: 'Which of the following metals cannot be extracted from its oxide by carbon reduction and requires electrolytic reduction?',
        options: ['Zinc (Zn)', 'Iron (Fe)', 'Aluminium (Al)', 'Lead (Pb)'],
        correctIndex: 2,
        explanation: 'Aluminium has higher affinity for oxygen than carbon does. Therefore, Al₂O₃ must be reduced electrolytically (Hall-Héroult process with cryolite Na₃AlF₆).',
        topic: 'Extraction of Highly Reactive Metals',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch3_q2',
        chapterNumber: 3,
        chapterTitle: 'Metals and Non-metals',
        question: 'Why do ionic compounds conduct electricity in aqueous solution or molten state, but not in the solid state?',
        options: [
          'In solid state, free mobile ions are locked in a rigid crystal lattice',
          'Solid ionic compounds have no charged particles',
          'Water converts ionic bonds into metallic bonds',
          'Electrons only exist in liquid state'
        ],
        correctIndex: 0,
        explanation: 'Conduction requires mobile charge carriers. In solid state, ions cannot move due to strong electrostatic attraction in the lattice; melting or dissolving frees ions to migrate.',
        topic: 'Properties of Ionic Compounds',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch3_q3',
        chapterNumber: 3,
        chapterTitle: 'Metals and Non-metals',
        question: 'During the electrolytic refining of copper, what material forms the cathode and where does anode mud settle?',
        options: [
          'Cathode: Pure copper; Anode mud: Bottom of anode',
          'Cathode: Impure copper; Anode mud: Surface of electrolyte',
          'Cathode: Graphite; Anode mud: Deposited on cathode',
          'Cathode: Platinum; Anode mud: Dissolves completely'
        ],
        correctIndex: 0,
        explanation: 'A thin strip of pure copper is the cathode (attracting Cu²⁺). Impurities like gold and silver settle beneath the impure anode as valuable anode mud.',
        topic: 'Electrolytic Refining',
        difficulty: 'Hard'
      },
      {
        id: 'sci_ch3_q4',
        chapterNumber: 3,
        chapterTitle: 'Metals and Non-metals',
        question: 'Which pair of non-metals is liquid and lustrous at room temperature respectively?',
        options: [
          'Liquid: Bromine; Lustrous: Iodine',
          'Liquid: Mercury; Lustrous: Carbon',
          'Liquid: Chlorine; Lustrous: Sulphur',
          'Liquid: Gallium; Lustrous: Phosphorus'
        ],
        correctIndex: 0,
        explanation: 'Bromine is the only non-metal liquid at room temperature. Iodine is a non-metal that exhibits metallic-like lustrous shine.',
        topic: 'Physical Exceptions in Elements',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 6: LIFE PROCESSES
  {
    chapterNumber: 6,
    title: 'Life Processes',
    category: 'Life Sciences',
    totalPages: 8,
    summary:
      'Life processes maintain and repair cellular integrity in living organisms. This comprehensive unit covers autotrophic photosynthesis (light absorption, photolysis, carbon fixation) and heterotrophic nutrition (Amoeba phagocytosis, human alimentary canal with enzymes), aerobic vs anaerobic cellular respiration (glycolysis, lactic acid, ATP), circulation (human four-chambered heart, double circulation, xylem/phloem transport), and excretion (kidney nephron filtration and selective reabsorption).',
    importantEquations: [
      { name: 'Photosynthesis Master Equation', equation: '6CO₂ + 12H₂O —Sunlight/Chlorophyll→ C₆H₁₂O₆ + 6O₂ + 6H₂O', details: 'Photolysis of water yields hydrogen to reduce CO₂ into glucose' },
      { name: 'Aerobic Respiration (Mitochondria)', equation: 'Pyruvate (3-C) + O₂ → 6CO₂ + 6H₂O + 38 ATP Energy', details: 'Complete oxidation yielding high energy in presence of oxygen' },
      { name: 'Anaerobic in Yeast (Fermentation)', equation: 'Pyruvate (3-C) —No O₂→ Ethanol (2-C) + CO₂ + 2 ATP', details: 'Produces alcohol in brewing and baking' },
      { name: 'Anaerobic in Human Muscle Cells', equation: 'Pyruvate (3-C) —Lack of O₂→ Lactic Acid (3-C) + 2 ATP', details: 'Accumulation of lactic acid during sudden vigorous exercise causes muscle cramps' }
    ],
    coreConcepts: [
      {
        heading: 'Human Alimentary Canal & Digestive Enzymes',
        points: [
          'Mouth: Salivary amylase breaks down starch into maltose sugars.',
          'Stomach: Gastric glands secrete Hydrochloric acid (activates pepsin, kills bacteria), Pepsin (digests proteins into peptones), and Mucus (protects gastric lining).',
          'Liver & Pancreas: Liver secretes bile (emulsifies fats, alkalinizes chime); Pancreas secretes trypsin (proteins), lipase (emulsified fats), and pancreatic amylase.',
          'Small Intestine: Complete digestion into glucose, amino acids, fatty acids and glycerol. Villi with rich capillary networks maximize absorption surface area.'
        ]
      },
      {
        heading: 'Human Circulatory System & Double Circulation',
        points: [
          'Heart: 4 chambers (Right/Left Atrium, Right/Left Ventricle). Septum prevents mixing of oxygenated and deoxygenated blood.',
          'Double Circulation: Blood passes through the heart twice in one complete cardiac cycle — Pulmonary circuit (heart to lungs and back) and Systemic circuit (heart to rest of body and back).',
          'Blood Vessels: Arteries (thick elastic walls, high pressure, carry blood away from heart); Veins (thin walls, low pressure, internal valves prevent backflow).'
        ]
      },
      {
        heading: 'Excretion in Humans: The Nephron Machinery',
        points: [
          'Kidneys contain ~1 million functional units called nephrons.',
          'Ultrafiltration occurs in the glomerulus inside Bowman’s capsule under high hydrostatic pressure.',
          'Selective Reabsorption: Tubular parts reabsorb essential glucose, amino acids, salts, and major water volumes back into peritubular capillaries.',
          'Urine collected in collecting ducts drains via ureters into urinary bladder until voluntary micturition.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch6_q1',
        chapterNumber: 6,
        chapterTitle: 'Life Processes',
        question: 'What causes painful muscle cramps in athletes during sudden intense sprinting?',
        options: [
          'Accumulation of lactic acid due to anaerobic respiration in muscle cells',
          'Excessive intake of glucose in blood',
          'Overproduction of carbon dioxide in lungs',
          'Breakdown of ethanol in muscles'
        ],
        correctIndex: 0,
        explanation: 'When oxygen demand exceeds supply during heavy sprinting, muscle cells convert pyruvate anaerobically into 3-carbon lactic acid, causing cramps.',
        topic: 'Respiration Pathways',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch6_q2',
        chapterNumber: 6,
        chapterTitle: 'Life Processes',
        question: 'Which enzyme is responsible for the emulsification of large fat globules into smaller droplets in the small intestine?',
        options: ['Bile salts (from bile)', 'Pepsin', 'Salivary amylase', 'Trypsin'],
        correctIndex: 0,
        explanation: 'Bile produced by the liver contains bile salts that emulsify large fat globules into microscopic micelles, greatly increasing the surface area for pancreatic lipase.',
        topic: 'Human Digestion',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch6_q3',
        chapterNumber: 6,
        chapterTitle: 'Life Processes',
        question: 'In the human nephron, where does initial filtration (ultrafiltration) of blood take place?',
        options: ['Glomerulus inside Bowman’s capsule', 'Loop of Henle', 'Collecting duct', 'Urinary bladder'],
        correctIndex: 0,
        explanation: 'High pressure in the tuft of capillaries called the glomerulus forces water, glucose, salts, and urea into Bowman’s capsule as initial filtrate.',
        topic: 'Excretory System',
        difficulty: 'Medium'
      }
    ]
  },

  // CHAPTER 7: CONTROL AND COORDINATION
  {
    chapterNumber: 7,
    title: 'Control and Coordination',
    category: 'Life Sciences',
    totalPages: 6,
    summary:
      'Organisms coordinate responses to internal and external stimuli through the nervous system and chemical endocrine hormones. This unit details neuron histology, impulse transmission across chemical synapses, reflex arcs, brain anatomy (cerebrum, cerebellum, medulla oblongata), plant directional movements (tropisms), plant growth regulators (auxins, gibberellins, cytokinins, abscisic acid), and human endocrine feedback loops.',
    importantEquations: [
      { name: 'Nerve Impulse Sequence', equation: 'Dendrite → Cell Body (Cyton) → Axon → Synapse (Neurotransmitter release)', details: 'Electrical impulse travels along axon; converted to chemical acetylcholine signal at synaptic cleft' },
      { name: 'Reflex Arc Path', equation: 'Receptor (Skin) → Sensory Neuron → Spinal Cord (Relay Neuron) → Motor Neuron → Effector (Muscle)', details: 'Bypasses brain for immediate protective reaction against thermal/pain stimuli' },
      { name: 'Negative Feedback Loop', equation: 'High Blood Sugar → Pancreatic β-cells release Insulin → Cells uptake glucose → Normal Blood Sugar', details: 'Feedback regulation controls hormone quantity and timing' }
    ],
    coreConcepts: [
      {
        heading: 'Structure of Neuron & Synaptic Transmission',
        points: [
          'Dendrites acquire sensory information from external receptors.',
          'The impulse travels electrically down the axon to the nerve endings.',
          'At the synapse, electrical signal triggers release of neurotransmitters (chemical messengers) that cross the gap and set off a similar impulse in the next dendrite.'
        ]
      },
      {
        heading: 'Parts of Human Brain & Their Functions',
        points: [
          'Forebrain: Cerebrum is the seat of consciousness, intelligence, memory, voluntary muscle actions, and sensory interpretation.',
          'Midbrain: Connects forebrain to hindbrain; controls auditory and visual reflex movements of head and eyes.',
          'Hindbrain: Cerebellum maintains body posture and motor balance; Medulla oblongata regulates involuntary life functions (heart rate, breathing, peristalsis, blood pressure, salivation, vomiting).'
        ]
      },
      {
        heading: 'Phytohormones (Plant Hormones) & Tropic Movements',
        points: [
          'Auxin: Synthesized at shoot tips; diffuses to shaded side causing cells to elongate faster, bending shoot toward light (Phototropism).',
          'Gibberellins: Promote stem elongation, break seed dormancy, bolting.',
          'Cytokinins: Promote rapid cell division; concentrated in developing fruits and seeds; delay senescence.',
          'Abscisic Acid (ABA): Stress hormone that inhibits growth, causes wilting and falling of leaves, and closes stomata during drought.'
        ]
      },
      {
        heading: 'Human Endocrine Glands and Hormones',
        points: [
          'Pituitary Gland: Master gland located at base of brain; secretes Growth Hormone (GH). Hyposecretion causes dwarfism; hypersecretion causes gigantism.',
          'Thyroid Gland: Secretes thyroxine containing iodine; regulates carbohydrate, protein, and fat metabolism. Deficiency causes goitre (swollen neck).',
          'Adrenal Gland: Secretes adrenaline (emergency hormone); accelerates heart rate, diverts blood to skeletal muscles, dilates pupils during fight-or-flight.',
          'Pancreas: Secretes insulin; promotes uptake of glucose into cells. Insufficient secretion results in Diabetes mellitus.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch7_q1',
        chapterNumber: 7,
        chapterTitle: 'Control and Coordination',
        question: 'Which part of the human brain is primarily responsible for maintaining posture, equilibrium, and precision of voluntary movements (like walking in a straight line)?',
        options: ['Cerebellum', 'Cerebrum', 'Hypothalamus', 'Medulla oblongata'],
        correctIndex: 0,
        explanation: 'The cerebellum in the hindbrain coordinates voluntary muscle movements, maintaining posture, bodily balance, and equilibrium.',
        topic: 'Brain Anatomy & Function',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch7_q2',
        chapterNumber: 7,
        chapterTitle: 'Control and Coordination',
        question: 'Which plant hormone functions as a natural growth inhibitor that induces dormancy and causes wilting of leaves?',
        options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Abscisic acid'],
        correctIndex: 3,
        explanation: 'Abscisic acid (ABA) is the plant growth inhibitor and stress hormone. It triggers stomatal closure and promotes leaf and fruit abscission (wilting/falling).',
        topic: 'Plant Hormones',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch7_q3',
        chapterNumber: 7,
        chapterTitle: 'Control and Coordination',
        question: 'Why is the dietary intake of iodized salt recommended for healthy human thyroid functioning?',
        options: [
          'Iodine is required for the thyroid gland to synthesize thyroxine hormone',
          'Iodine prevents stomach acid buildup',
          'Iodine stimulates insulin release from the pancreas',
          'Iodine increases bone calcium content'
        ],
        correctIndex: 0,
        explanation: 'The thyroid gland requires iodine to synthesize thyroxine, which regulates metabolic rate. Lack of iodine in diet causes goitre.',
        topic: 'Endocrine Glands',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 10: LIGHT – REFLECTION AND REFRACTION
  {
    chapterNumber: 10,
    title: 'Light – Reflection and Refraction',
    category: 'Natural Phenomena & Physics',
    totalPages: 35,
    summary:
      'Light exhibits rectilinear propagation, reflection, and refraction. This comprehensive module covers plane and spherical mirrors (concave and convex), focal length relationships, detailed ray diagrams across all 6 object positions, Cartesian sign conventions, the mirror formula, Snell’s law of refraction, absolute and relative refractive indices, glass slab lateral displacement, spherical lenses, the lens formula, magnification ratios, and dioptre power calculations.',
    importantEquations: [
      { name: 'Mirror Equation', equation: '1/f = 1/v + 1/u', details: 'Connects object distance (u), image distance (v), and focal length (f)' },
      { name: 'Mirror Magnification', equation: 'm = h′/h = -v/u', details: 'Negative m indicates real/inverted image; positive m indicates virtual/erect image' },
      { name: 'Snell’s Law of Refraction', equation: 'sin i / sin r = constant = n₂₁ = v₁ / v₂', details: 'Ratio of sine of angle of incidence to sine of angle of refraction equals relative refractive index' },
      { name: 'Absolute Refractive Index', equation: 'n = c / v', details: 'Speed of light in vacuum (c = 3×10⁸ m/s) divided by speed of light in medium (v)' },
      { name: 'Lens Formula', equation: '1/f = 1/v - 1/u', details: 'Note the negative sign before 1/u distinguishing it from the mirror formula' },
      { name: 'Lens Magnification', equation: 'm = h′/h = +v/u', details: 'Positive sign for lens magnification in contrast to negative sign for mirrors' },
      { name: 'Power of a Lens', equation: 'P = 1 / f (in metres) [Unit: Dioptre (D)]', details: 'Convex lens has positive power (+D); concave lens has negative power (-D)' }
    ],
    coreConcepts: [
      {
        heading: 'Concave vs Convex Mirrors: Image Characteristics',
        points: [
          'Concave Mirror (Converging): Real, inverted images for objects beyond F; virtual, erect, and magnified image ONLY when object is between Pole (P) and Focus (F). Used in shaving mirrors, dentist headlamps, torches, and solar furnaces.',
          'Convex Mirror (Diverging): Always produces virtual, erect, and diminished images regardless of object position. Provides wide field of view; used as rear-view mirrors in automobiles.'
        ]
      },
      {
        heading: 'New Cartesian Sign Convention',
        points: [
          'All distances measured from the Pole (P) of mirror or Optical Centre (O) of lens.',
          'Distances measured in the direction of incident light are positive (+); opposite direction are negative (-).',
          'Object distance (u) is ALWAYS negative (-u).',
          'Focal length of Concave mirror/lens is negative (-f); Focal length of Convex mirror/lens is positive (+f).'
        ]
      },
      {
        heading: 'Refraction and Lateral Displacement through Glass Slab',
        points: [
          'When light enters optically denser medium from rarer (Air to Glass), it bends towards the normal (∠i > ∠r).',
          'When light exits denser to rarer (Glass to Air), it bends away from the normal (∠r < ∠e).',
          'Emergent ray is parallel to the incident ray; lateral shift (perpendicular distance between incident and emergent rays) depends on slab thickness and refractive index.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch10_q1',
        chapterNumber: 10,
        chapterTitle: 'Light – Reflection and Refraction',
        question: 'An object is placed at the centre of curvature (C) of a concave mirror. Where will the image be formed, and what will be its nature and magnification?',
        options: [
          'At C, Real, Inverted, and m = -1',
          'At F, Virtual, Erect, and m = +1',
          'Beyond C, Real, Inverted, and m = -2',
          'Between C and F, Real, Diminished, and m = -0.5'
        ],
        correctIndex: 0,
        explanation: 'When an object is at C of a concave mirror, rays reflect to form an image precisely at C of the identical size (m = -1), real and inverted.',
        topic: 'Spherical Mirror Ray Tracing',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch10_q2',
        chapterNumber: 10,
        chapterTitle: 'Light – Reflection and Refraction',
        question: 'A convex lens of focal length 50 cm is placed in contact with a concave lens of focal length 20 cm. What is the power of the combination in Dioptres?',
        options: ['-3.0 D', '+2.0 D', '-5.0 D', '+7.0 D'],
        correctIndex: 0,
        explanation: 'P₁ = 1/f₁ = 1/(+0.5 m) = +2 D. P₂ = 1/f₂ = 1/(-0.2 m) = -5 D. Combined power P = P₁ + P₂ = +2 - 5 = -3.0 D.',
        topic: 'Lens Power Combination',
        difficulty: 'Hard'
      },
      {
        id: 'sci_ch10_q3',
        chapterNumber: 10,
        chapterTitle: 'Light – Reflection and Refraction',
        question: 'Why are convex mirrors preferred as rear-view mirrors in vehicles?',
        options: [
          'They always give an erect, diminished image and a much wider field of view',
          'They invert images to make them easily readable',
          'They magnify distant vehicles into bright focal spots',
          'They absorb infrared night rays to reduce glare'
        ],
        correctIndex: 0,
        explanation: 'Convex mirrors curve outwards, giving a substantially broader field of view than flat mirrors, and always create upright (erect) albeit diminished images.',
        topic: 'Mirror Applications',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 11: HUMAN EYE AND COLOURFUL WORLD
  {
    chapterNumber: 11,
    title: 'Human Eye and the Colourful World',
    category: 'Natural Phenomena & Physics',
    totalPages: 35,
    summary:
      'Human vision is facilitated by a flexible crystalline lens and light-sensitive retina. This chapter details structural anatomy, power of accommodation, optical vision defects (myopia, hypermetropia, presbyopia, astigmatism) and their corrective lenses, dispersion through prisms, rainbow formation, atmospheric refraction (twinkling of stars, advanced sunrise/delayed sunset), and Rayleigh scattering (Tyndall effect, blue sky, red sunset).',
    importantEquations: [
      { name: 'Least Distance of Distinct Vision', equation: 'D = 25 cm (Near Point) | Far Point = Infinity', details: 'Normal human eye accommodates between 25 cm and infinity' },
      { name: 'Rayleigh Scattering Law', equation: 'Scattering Intensity (I) ∝ 1 / λ⁴', details: 'Shorter blue wavelengths scatter roughly 10x more than longer red wavelengths' },
      { name: 'Prism Refraction Relation', equation: '∠A + ∠δ = ∠i + ∠e', details: 'Angle of prism (A) + Angle of deviation (δ) = Angle of incidence (i) + Angle of emergence (e)' }
    ],
    coreConcepts: [
      {
        heading: 'Vision Defects and Optical Corrections',
        points: [
          'Myopia (Near-sightedness): Distant objects cannot be seen clearly. Image forms in front of the retina due to excessive eyeball elongation or high lens curvature. Corrected using a Concave lens of suitable focal length.',
          'Hypermetropia (Far-sightedness): Nearby objects cannot be seen clearly. Image forms behind retina due to shortened eyeball or too long focal length. Corrected using a Convex lens.',
          'Presbyopia: Old-age hypermetropia caused by gradual weakening of ciliary muscles and diminishing lens flexibility. Corrected using bifocal lenses (upper concave for distance, lower convex for reading).'
        ]
      },
      {
        heading: 'Dispersion and Rainbow Phenomenon',
        points: [
          'Dispersion: Splitting of white light into its 7 component spectrum colors (VIBGYOR) when passing through a prism due to different refractive speeds.',
          'Red light bends least (longest wavelength); Violet light bends most (shortest wavelength).',
          'Rainbow Formation: Suspended raindrops act as miniature prisms undergoing three optical steps: Refraction + Internal reflection + Dispersion.'
        ]
      },
      {
        heading: 'Atmospheric Refraction & Light Scattering',
        points: [
          'Twinkling of Stars: Starlight passes through continuously fluctuating atmospheric layers of varying optical density, shifting apparent position and perceived intensity.',
          'Advanced Sunrise and Delayed Sunset: Light bends over the earth horizon, making the sun visible ~2 minutes before actual horizon crossing and ~2 minutes after sunset.',
          'Blue Sky & Red Sunset: Tiny nitrogen/oxygen gas molecules scatter shorter blue wavelengths across the daytime sky. At sunset, light traverses thick atmospheric paths where blue is scattered away, leaving longer red light.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch11_q1',
        chapterNumber: 11,
        chapterTitle: 'Human Eye and the Colourful World',
        question: 'A student suffering from myopia cannot see objects clearly beyond 1.5 m. What type and power of lens does the optometrist prescribe?',
        options: ['Concave lens of power -0.67 D', 'Convex lens of power +0.67 D', 'Concave lens of power -1.5 D', 'Convex lens of power +1.5 D'],
        correctIndex: 0,
        explanation: 'To correct myopia with far point d = 1.5 m, focal length f = -1.5 m. Power P = 1 / f = 1 / (-1.5) = -0.67 D (concave lens).',
        topic: 'Myopia Correction',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch11_q2',
        chapterNumber: 11,
        chapterTitle: 'Human Eye and the Colourful World',
        question: 'The sky appears dark or black rather than blue to astronauts in outer space because:',
        options: [
          'There is no atmosphere to scatter sunlight into the eyes',
          'Sunlight does not travel through vacuum',
          'All spectrum wavelengths get completely absorbed by cosmic dust',
          'The human pupil dilates to maximum aperture'
        ],
        correctIndex: 0,
        explanation: 'Scattering requires particulate medium or atmospheric gas molecules. In outer space vacuum, light rays travel straight without scattering, giving the sky a pitch-black background.',
        topic: 'Atmospheric Scattering',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch11_q3',
        chapterNumber: 11,
        chapterTitle: 'Human Eye and the Colourful World',
        question: 'By approximately how many total minutes is daylight prolonged each day due to atmospheric refraction of sunlight at sunrise and sunset?',
        options: ['4 minutes', '2 minutes', '10 minutes', '1 minute'],
        correctIndex: 0,
        explanation: 'Atmospheric refraction causes early sunrise by ~2 minutes and delayed sunset by ~2 minutes, prolonging total daylight by ~4 minutes.',
        topic: 'Atmospheric Refraction',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 12: ELECTRICITY
  {
    chapterNumber: 12,
    title: 'Electricity',
    category: 'Natural Phenomena & Physics',
    totalPages: 6,
    summary:
      'Electricity powers contemporary civilization. This unit explores electrical charge conservation, Coulomb’s law, current flow, potential difference, Ohm’s law, resistivity parameters, series versus parallel resistance circuits, heating effects (Joule’s Law), electric power calculations, and domestic safety fixtures (fuse wire ratings, 3-pin plugs, earthing).',
    importantEquations: [
      { name: 'Current & Charge', equation: 'I = Q / t = n·e / t (e = 1.6×10⁻¹⁹ C)', details: '1 Ampere is equivalent to flow of 6.25×10¹⁸ electrons per second' },
      { name: 'Electric Potential Difference', equation: 'V = W / Q (1 Volt = 1 Joule / 1 Coulomb)', details: 'Work done moving unit positive charge between two circuit points' },
      { name: 'Ohm’s Law', equation: 'V = I · R', details: 'Potential difference is directly proportional to current under constant temperature' },
      { name: 'Electrical Resistance & Resistivity', equation: 'R = ρ · (l / A)', details: 'Resistance is proportional to length (l) and inversely proportional to cross-sectional area (A)' },
      { name: 'Equivalent Resistance in Series', equation: 'R_s = R₁ + R₂ + R₃', details: 'Current is identical through every resistor; total resistance increases' },
      { name: 'Equivalent Resistance in Parallel', equation: '1/R_p = 1/R₁ + 1/R₂ + 1/R₃', details: 'Voltage is identical across every branch; total resistance is less than smallest component' },
      { name: 'Joule’s Law of Heating', equation: 'H = I² · R · t', details: 'Heat produced is proportional to square of current, resistance, and duration' },
      { name: 'Commercial Unit of Energy', equation: '1 kWh = 1 Unit = 3.6 × 10⁶ Joules (3.6 MJ)', details: 'Energy consumed by 1000 W appliance operating for 1 hour' }
    ],
    coreConcepts: [
      {
        heading: 'Series vs Parallel Circuit Combinations',
        points: [
          'Series: Same current flows through all components. If one appliance fails or disconnects, the entire circuit breaks. Not used for domestic appliances.',
          'Parallel: Every appliance receives full mains voltage (220 V in India) and operates on an independent switch. If one fails, others continue unhindered.'
        ]
      },
      {
        heading: 'Electric Fuse and Safety Fixtures',
        points: [
          'Fuse Wire: Made of lead-tin alloy with low melting point and high resistance.',
          'Always connected in series with the live wire before appliances.',
          'If current exceeds safe rating (due to overloading or short-circuiting), Joule heat melts the fuse, breaking the circuit and saving costly equipment.'
        ]
      },
      {
        heading: 'Earthing and Shock Prevention',
        points: [
          'Appliances with metallic casings (irons, refrigerators, washing machines) are connected to the thick green earth wire.',
          'The earth wire provides a low-resistance path to ground. In case of insulation leakage touching metal case, leakage current drains safely to ground, blowing the fuse without shocking the user.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch12_q1',
        chapterNumber: 12,
        chapterTitle: 'Electricity',
        question: 'A wire of resistance R is cut into 5 equal parts. These 5 pieces are then connected in parallel. What is the equivalent resistance R′ of this parallel combination?',
        options: ['R / 25', 'R / 5', '5 R', '25 R'],
        correctIndex: 0,
        explanation: 'Each cut piece has resistance r = R/5. When 5 such resistors are joined in parallel: 1/R′ = (1/(R/5)) × 5 = 25/R ⇒ R′ = R/25.',
        topic: 'Resistor Circuits',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch12_q2',
        chapterNumber: 12,
        chapterTitle: 'Electricity',
        question: 'An electric heater rated 2000 W is operated for 5 hours daily for 30 days. If electricity costs ₹6 per kWh (unit), what is the monthly electricity cost?',
        options: ['₹1,800', '₹600', '₹3,600', '₹900'],
        correctIndex: 0,
        explanation: 'Daily energy = 2 kW × 5 h = 10 kWh. Monthly energy (30 days) = 10 × 30 = 300 units (kWh). Total cost = 300 units × ₹6 = ₹1,800.',
        topic: 'Commercial Energy Calculation',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch12_q3',
        chapterNumber: 12,
        chapterTitle: 'Electricity',
        question: 'Why is an electric fuse wire connected strictly in series with the LIVE wire rather than the neutral wire?',
        options: [
          'So that when the fuse melts, the appliance is completely isolated from high potential mains voltage',
          'Because current only flows through the live wire',
          'Because neutral wire cannot conduct heating effects',
          'To prevent the earth wire from overheating'
        ],
        correctIndex: 0,
        explanation: 'If the fuse were on the neutral wire, a melted fuse would break the circuit but the appliance would remain live at 220 V, posing a fatal shock hazard on contact.',
        topic: 'Domestic Electrical Safety',
        difficulty: 'Hard'
      }
    ]
  },

  // CHAPTER 13: MAGNETIC EFFECTS OF ELECTRIC CURRENT
  {
    chapterNumber: 13,
    title: 'Magnetic Effects of Electric Current',
    category: 'Natural Phenomena & Physics',
    totalPages: 18,
    summary:
      'Electric current and magnetism are deeply linked. This unit traces Oersted’s historical discovery, magnetic field lines, straight conductor/circular coil/solenoid field geometry, Fleming’s Left-Hand Rule (Electric Motor principle), Faraday’s electromagnetic induction experiments, Fleming’s Right-Hand Rule (Electric Generator principle), AC vs DC current characteristics, and domestic wiring schemes.',
    importantEquations: [
      { name: 'Magnetic Force on Conductor', equation: 'F = B · I · l · sin θ', details: 'Maximum force when conductor is perpendicular to magnetic field lines (θ = 90°)' },
      { name: 'Fleming’s Left-Hand Rule (Motor)', equation: 'Thumb: Motion/Force | Forefinger: Magnetic Field | Middle Finger: Current', details: 'Determines direction of mechanical thrust in DC motors and galvanometers' },
      { name: 'Fleming’s Right-Hand Rule (Generator)', equation: 'Thumb: Motion of Conductor | Forefinger: Magnetic Field | Middle Finger: Induced Current', details: 'Determines direction of induced current generated in rotating coils' },
      { name: 'Alternating Current in India', equation: 'Frequency = 50 Hz | Voltage = 220 V', details: 'Direction of current reverses every 1/100 second (100 times per second)' }
    ],
    coreConcepts: [
      {
        heading: 'Magnetic Field Patterns & Solenoid Magnetism',
        points: [
          'Field lines form continuous closed loops originating from North pole and terminating at South pole externally, and South to North internally.',
          'Right-Hand Thumb Rule: Grasp straight conductor with right hand with thumb pointing in current direction; curled fingers reveal magnetic field line direction.',
          'Solenoid: Long coil of insulated copper wire wrapped in cylinder. Internal magnetic field lines are parallel and uniform. Placing soft iron core inside creates a powerful electromagnet.'
        ]
      },
      {
        heading: 'Electric Motor (DC) Working & Commutator',
        points: [
          'Converts electrical energy into mechanical torque based on magnetic force on a current-carrying loop.',
          'Armature coil is placed between opposite poles of a strong permanent magnet.',
          'Split-ring commutator reverses the direction of current in coil arms every half rotation (180°), ensuring unidirectional continuous rotary torque.'
        ]
      },
      {
        heading: 'Electromagnetic Induction & Electric Generator',
        points: [
          'Discovered by Michael Faraday: Relative motion between a magnetic field and coil induces an electromotive force (induced current).',
          'AC Generator uses slip rings to deliver alternating current that reverses polarity periodically.',
          'DC Generator uses split rings to deliver unidirectional current output.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch13_q1',
        chapterNumber: 13,
        chapterTitle: 'Magnetic Effects of Electric Current',
        question: 'What is the critical function of the split-ring commutator in an electric DC motor?',
        options: [
          'It reverses the direction of current in the armature coil every half-rotation to sustain continuous rotation',
          'It steps up the voltage from the battery',
          'It cools the armature copper wire during rotation',
          'It converts kinetic energy into electrical energy'
        ],
        correctIndex: 0,
        explanation: 'Without a commutator, the torque on the armature would reverse after 180° causing the motor to oscillate. The split rings reverse current direction every half turn.',
        topic: 'DC Motor Principle',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch13_q2',
        chapterNumber: 13,
        chapterTitle: 'Magnetic Effects of Electric Current',
        question: 'In India, domestic alternating current (AC) has a frequency of 50 Hz. How many times per second does this current change its direction?',
        options: ['100 times', '50 times', '200 times', '25 times'],
        correctIndex: 0,
        explanation: 'Each complete cycle of 50 Hz AC involves two reversals of current direction. Therefore, in one second (50 cycles), current reverses direction 50 × 2 = 100 times.',
        topic: 'AC vs DC Characteristics',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch13_q3',
        chapterNumber: 13,
        chapterTitle: 'Magnetic Effects of Electric Current',
        question: 'Which of the following describes the magnetic field lines inside a long current-carrying solenoid?',
        options: [
          'They are straight parallel lines indicating uniform magnetic field strength',
          'They are concentric circles around each loop',
          'They are zero at the centre of the solenoid',
          'They diverge outwards from the midpoint'
        ],
        correctIndex: 0,
        explanation: 'Inside a solenoid, magnetic field lines are equidistant and parallel to each other, indicating that the magnetic field is uniform at all internal points.',
        topic: 'Solenoid Field Characteristics',
        difficulty: 'Easy'
      }
    ]
  },

  // CHAPTER 15: OUR ENVIRONMENT
  {
    chapterNumber: 15,
    title: 'Our Environment',
    category: 'Applied Science & Environment',
    totalPages: 2,
    summary:
      'All living organisms depend on interacting biotic and abiotic components within ecosystems. This concise high-yield revision covers trophic levels, Lindeman’s 10% law of energy transfer, biological magnification of toxic pesticides in top predators, stratospheric ozone (O₃) shielding against lethal ultraviolet radiation, CFC-induced ozone depletion, and solid waste disposal.',
    importantEquations: [
      { name: 'Ozone Formation in Stratosphere', equation: 'O₂ —High Energy UV→ O + O | O + O₂ → O₃ (Ozone)', details: 'UV radiation splits diatomic oxygen; nascent oxygen combines with O₂ to synthesize protective O₃' },
      { name: 'Lindeman’s 10% Energy Law', equation: 'Energy available at trophic level n = 10% of energy at level (n - 1)', details: '90% of energy is dissipated as heat or used for metabolic maintenance and reproduction' }
    ],
    coreConcepts: [
      {
        heading: 'Food Chains, Webs and 10% Energy Transfer',
        points: [
          'Producers (green plants) capture ~1% of solar energy falling on leaves and convert it into chemical energy via photosynthesis.',
          'According to the 10% law, only 10% of captured food energy is passed on to the next trophic level.',
          'Because energy diminishes rapidly (1000 J → 100 J → 10 J → 1 J), food chains rarely exceed 4 to 5 trophic tiers.'
        ]
      },
      {
        heading: 'Biological Magnification (Biomagnification)',
        points: [
          'Non-biodegradable synthetic chemicals (e.g. DDT, pesticides) sprayed on crops enter the soil and water bodies.',
          'They cannot be metabolized or excreted by organisms and accumulate in increasing concentrations at each progressive trophic level.',
          'Top consumers (especially humans) accumulate the highest toxic concentration in their tissues.'
        ]
      },
      {
        heading: 'Ozone Layer Depletion & Global Mitigation',
        points: [
          'Stratospheric Ozone (O₃) shields terrestrial life from carcinogenic solar UV rays that cause skin cancer, cataract, and immune suppression.',
          'Synthetic Chlorofluorocarbons (CFCs) used in refrigerators, aerosols, and fire extinguishers release free chlorine radicals that destroy thousands of ozone molecules.',
          'The 1987 UNEP Montreal Protocol successfully froze and phased out global CFC production.'
        ]
      }
    ],
    mcqs: [
      {
        id: 'sci_ch15_q1',
        chapterNumber: 15,
        chapterTitle: 'Our Environment',
        question: 'If 20,000 J of solar energy falls on green plants (producers), and plants capture 1% into chemical food, how much energy will reach the secondary consumers in the food chain: Plants → Deer → Tiger?',
        options: ['2 J', '20 J', '200 J', '0.2 J'],
        correctIndex: 0,
        explanation: 'Plants capture 1% of 20,000 J = 200 J. Deer (primary consumer) receives 10% of 200 J = 20 J. Tiger (secondary consumer) receives 10% of 20 J = 2 J.',
        topic: '10 Percent Energy Law',
        difficulty: 'Medium'
      },
      {
        id: 'sci_ch15_q2',
        chapterNumber: 15,
        chapterTitle: 'Our Environment',
        question: 'Which international agreement successfully mandated the freeze and phase-out of ozone-depleting Chlorofluorocarbons (CFCs)?',
        options: ['Montreal Protocol (1987)', 'Kyoto Protocol', 'Paris Climate Accord', 'Ramsar Convention'],
        correctIndex: 0,
        explanation: 'In 1987, the United Nations Environment Programme (UNEP) forged the Montreal Protocol, which mandated freezing CFC production at 1986 levels.',
        topic: 'Ozone Layer Protection',
        difficulty: 'Easy'
      },
      {
        id: 'sci_ch15_q3',
        chapterNumber: 15,
        chapterTitle: 'Our Environment',
        question: 'Why does biological magnification result in the maximum pesticide concentration inside human bodies?',
        options: [
          'Humans occupy the topmost trophic position in multiple food chains and eat diverse contaminated foods',
          'Human kidneys cannot filter water',
          'Pesticides are produced naturally in human cells',
          'Humans breathe in more atmospheric nitrogen'
        ],
        correctIndex: 0,
        explanation: 'Since non-biodegradable chemicals accumulate progressively without excretion at each level, apex predators like humans at the summit accumulate peak concentrations.',
        topic: 'Biomagnification',
        difficulty: 'Easy'
      }
    ]
  }
];
