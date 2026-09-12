export interface BioQuizQuestion {
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

export interface BioConcept {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  diagramOrTable?: {
    type: 'hierarchy' | 'comparison' | 'cycle' | 'classification';
    title: string;
    rows?: { col1: string; col2: string; col3?: string }[];
    steps?: string[];
  };
}

export interface BioChapterMaterial {
  chapterNumber: number;
  title: string;
  subtitle: string;
  pageCount: number;
  overview: string;
  importancePoints: string[];
  concepts: BioConcept[];
  mnemonicsAndTips: { title: string; text: string }[];
  quizQuestions: BioQuizQuestion[];
  quickRevisionBulletins: string[];
}

export const biologyStudyMaterialData: BioChapterMaterial[] = [
  // CHAPTER 1: THE LIVING WORLD
  {
    chapterNumber: 1,
    title: 'The Living World',
    subtitle: 'CBSE Quick Revision Notes — Chapter 01',
    pageCount: 4,
    overview:
      'Life is a unique, complex organization of molecules that expresses itself through chemical reactions leading to growth, development, responsiveness, adaptation and reproduction. This chapter lays the taxonomic foundation for cataloguing 1.7 to 1.8 million living species using standardized nomenclature, hierarchical categories, and specialized taxonomic aids.',
    importancePoints: [
      'It is impossible to study every individual organism; studying representative members of a group yields comprehensive knowledge of the entire taxon.',
      'Aids in accurate identification of newly discovered organisms globally without vernacular confusion.',
      'Helps establish phylogenetic and ecological relationships among living and extinct organisms.',
      'Past organisms and fossils cannot be systematically understood without a standardized classification framework.',
    ],
    concepts: [
      {
        id: 'c1_unique_features',
        title: 'Unique Features of Living Organisms',
        summary:
          'Explores the fundamental characteristics of life and contrasts defining properties with non-defining characteristics.',
        keyPoints: [
          'Growth: Increase in mass and number. In plants, growth by cell division continues throughout life in meristematic areas; in animals, it occurs only up to a certain age. Living organisms exhibit intrinsic (internal) growth from within; non-living objects (mountains, sand dunes, boulders, crystals) exhibit extrinsic growth by accumulation of matter on surfaces. Hence, growth alone is not an unconditioned defining property unless specified as intrinsic.',
          'Reproduction: Formation of new progeny resembling parents. Unicellular organisms exhibit reproduction as synonymous with growth (cell division). Non-reproducing living organisms exist (mules, sterile worker bees, infertile human couples); therefore, reproduction is NOT an all-inclusive defining characteristic of life (though no non-living entity can reproduce).',
          'Metabolism: Sum total of all biochemical reactions occurring inside an organism. Divided into Anabolism (constructive synthesis, e.g., photosynthesis) and Catabolism (destructive breakdown, e.g., cellular respiration). No non-living object exhibits metabolism. Metabolism is a DEFINING PROPERTY of living beings.',
          'Consciousness: Ability to perceive environmental surroundings and respond to external stimuli (physical, chemical, biological). All organisms from prokaryotes to complex eukaryotes respond to photoperiod, temperature, water, pollutants. Human beings are the ONLY organisms possessing self-consciousness. Consciousness is the DEFINING PROPERTY of living organisms.',
          'Life Span: Distinct trajectory consisting of birth, juvenile growth, maturity, senescence, and natural death.',
        ],
        diagramOrTable: {
          type: 'comparison',
          title: 'Defining vs Non-Defining Properties of Life',
          rows: [
            { col1: 'Property', col2: 'Defining or Non-Defining?', col3: 'Scientific Reason / Exception' },
            { col1: 'Growth', col2: 'Non-defining', col3: 'Non-living mountains/crystals also grow externally by surface accretion' },
            { col1: 'Reproduction', col2: 'Non-defining', col3: 'Sterile worker bees, mules, and infertile human couples cannot reproduce but are alive' },
            { col1: 'Metabolism', col2: 'Defining Property', col3: 'Present in ALL living cells without exception; never seen in non-living objects' },
            { col1: 'Cellular Organization', col2: 'Defining Property', col3: 'Fundamental structural unit of all living organisms' },
            { col1: 'Consciousness', col2: 'Defining Property', col3: 'Every living cell perceives and responds to environment; humans have self-consciousness' },
          ],
        },
      },
      {
        id: 'c1_systematics_nomenclature',
        title: 'Biodiversity, Systematics & Binomial Nomenclature',
        summary:
          'Standardized scientific naming conventions established by Carolus Linnaeus and universal taxonomic codes.',
        keyPoints: [
          'Biodiversity: Total number and types of organisms on Earth, currently documented between 1.7 to 1.8 million species (~1.25 million animals and ~0.5 million plants).',
          'Systematics: Branch of biology dealing with cataloguing, comparative anatomy, evolutionary relationships, and identification of organisms.',
          'Nomenclature: Standardizing names so each organism has a single, universally accepted scientific name. Governed by ICBN (International Code of Botanical Nomenclature) for plants and ICZN (International Code of Zoological Nomenclature) for animals.',
          'Binomial Nomenclature (Carolus Linnaeus): Every scientific name has two components: (1) Generic name (Genus) and (2) Specific epithet (Species).',
          'Universal Rules of Nomenclature:',
          '1. Names are derived from Latin and printed in italics (or underlined separately when handwritten).',
          '2. The first word represents the Genus and starts with a CAPITAL letter (e.g., Mangifera).',
          '3. The second word denotes the specific epithet and starts with a small letter (e.g., indica).',
          '4. Author citation appears after the specific epithet in abbreviated form: Mangifera indica Linn.',
        ],
      },
      {
        id: 'c1_taxonomic_hierarchy',
        title: 'Taxonomic Hierarchy & Categories',
        summary:
          'The 7 obligate taxonomic ranks arranged in ascending/descending order from Species to Kingdom.',
        keyPoints: [
          'Taxon / Category: A distinct rank in the hierarchical classification system.',
          'Species (Lowest basic unit): Group of natural individuals with fundamental morphological similarities capable of interbreeding freely to produce fertile offspring (e.g., indica in Mangifera indica, sapiens in Homo sapiens, leo in Panthera leo).',
          'Genus: Group of closely related species with correlated characters (e.g., Panthera contains leo [lion], tigris [tiger], pardus [leopard]; Solanum contains tuberosum [potato] and melongena [brinjal]).',
          'Family: Group of related genera with less common characters than genus. Vegetative and reproductive features are used (e.g., Solanaceae includes Solanum, Petunia, Datura; Felidae includes Panthera and Felis [cats]).',
          'Order: Assemblage of families resembling one another in a few floral/carnivorous characters (e.g., Carnivora includes Felidae and Canidae [dogs]; Polymoniales includes Solanaceae and Convolvulaceae).',
          'Class: Category consisting of related orders (e.g., Mammalia includes Carnivora, Primata, Rodentia; Dicotyledoneae includes Sapindales, Polymoniales).',
          'Division / Phylum: Phylum is used for animals (e.g., Chordata includes mammals, birds, reptiles, amphibians, fishes); Division is used for plants (e.g., Angiospermae).',
          'Kingdom (Highest obligate rank): Plantae (all plants) and Animalia (all animals).',
        ],
        diagramOrTable: {
          type: 'hierarchy',
          title: 'Obligate Taxonomic Hierarchy (Ascending Order)',
          steps: [
            '1. Species (e.g., sapiens / indica) — Maximum common characters',
            '2. Genus (e.g., Homo / Mangifera)',
            '3. Family (e.g., Hominidae / Anacardiaceae)',
            '4. Order (e.g., Primata / Sapindales)',
            '5. Class (e.g., Mammalia / Dicotyledoneae)',
            '6. Phylum / Division (e.g., Chordata / Angiospermae)',
            '7. Kingdom (e.g., Animalia / Plantae) — Minimum common characters',
          ],
        },
      },
      {
        id: 'c1_taxonomic_aids',
        title: 'Taxonomic Aids for Identification & Research',
        summary:
          'Techniques, repositories, and procedures useful in specimen collection, storage, and identification.',
        keyPoints: [
          'Herbarium: Storehouse of collected plant specimens that are dried, pressed, and mounted systematically on standard sheets. Each sheet carries a label at bottom right: Date and place of collection, English, local and botanical names, Family, and Collector’s name. Serves as a quick referral system.',
          'Botanical Gardens: Specialized facilities with living plant collections for reference and taxonomy. Famous examples: Royal Botanic Gardens, Kew (London, UK); Indian Botanical Garden, Shibpur (Kolkata/Howrah); National Botanical Research Institute (NBRI), Lucknow.',
          'Museums: Educational repositories in schools and colleges. Plant and animal specimens preserved in glass jars with chemical preservative solutions (formalin) or dried specimens. Insects are pinned in insect boxes after collecting, killing, and pinning. Bird/mammal skeletons are mounted.',
          'Zoological Parks (Zoos): Ex-situ conservation facilities where live wild animals are kept in protected enclosures under human care to observe feeding habits and natural behaviour.',
          'Taxonomic Key: Artificial analytical device used to identify unknown organisms based on contrasting characteristics in a pair called a COUPLET. Each statement in a couplet is called a LEAD. Acceptance of one lead leads to rejection of the alternative. Keys are analytical in nature, with separate keys for species, genus, and family.',
        ],
      },
    ],
    mnemonicsAndTips: [
      {
        title: 'Mnemonic for Taxonomic Hierarchy',
        text: '“Keep Ponds Clean Or Frogs Get Sick” → Kingdom, Phylum, Class, Order, Family, Genus, Species.',
      },
      {
        title: 'Key Rule in Keys',
        text: 'Couplet = Pair of contrasting characters. Lead = Each individual statement in a couplet. Keys are strictly ANALYTICAL.',
      },
      {
        title: 'Herbarium Label Trap',
        text: 'Remember: Herbarium labels do NOT mention plant height! They record date, location, English name, vernacular name, botanical name, family, and collector name.',
      },
    ],
    quizQuestions: [
      {
        id: 'bio_q1_1',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Which of the following is considered an absolute defining property of all living organisms?',
        options: ['Intrinsic growth', 'Metabolism', 'Reproduction', 'External movement'],
        correctIndex: 1,
        explanation:
          'Metabolism is the sum total of all chemical reactions occurring in an organism. It occurs in every living cell without exception and never in non-living objects.',
        topic: 'Characteristics of Life',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q1_2',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Why is reproduction NOT considered an all-inclusive defining characteristic of living beings?',
        options: [
          'Unicellular organisms do not reproduce',
          'Certain organisms like mules, sterile worker bees, and infertile human couples cannot reproduce',
          'Non-living crystals can also reproduce in chemical solutions',
          'Reproduction is synonymous with death',
        ],
        correctIndex: 1,
        explanation:
          'Living organisms such as worker bees, mules, and infertile human couples do not reproduce, yet they are unquestionably alive. Therefore, reproduction is not an all-inclusive defining property.',
        topic: 'Characteristics of Life',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q1_3',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'As per the universal rules of binomial nomenclature, how should the scientific name of Mango be written when handwritten?',
        options: [
          'Mangifera indica (all in capital letters without underline)',
          'Mangifera indica with both words separately underlined',
          'mangifera Indica with common underline',
          'Mangifera Indica in italics without underline',
        ],
        correctIndex: 1,
        explanation:
          'The genus begins with a capital letter (Mangifera), the specific epithet begins with a small letter (indica), and when handwritten, both words MUST be underlined separately.',
        topic: 'Binomial Nomenclature',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q1_4',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Which taxonomic aid utilizes a pair of contrasting statements called a "couplet" where each statement is termed a "lead"?',
        options: ['Herbarium', 'Botanical Garden', 'Taxonomic Key', 'Museum Catalogue'],
        correctIndex: 2,
        explanation:
          'Taxonomic keys are analytical tools based on contrasting characters in a pair known as a couplet. Each individual statement within the couplet is called a lead.',
        topic: 'Taxonomic Aids',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q1_5',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Which of the following information is NOT provided on the label of a standard herbarium sheet?',
        options: ['Date of collection', 'Collector’s name', 'Height of the plant in wild habitat', 'Botanical and family name'],
        correctIndex: 2,
        explanation:
          'A herbarium label provides date and place of collection, English, local and botanical names, family, and collector’s name. Plant height is NOT recorded.',
        topic: 'Taxonomic Aids',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q1_6',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Which of the following taxonomic categories contains organisms with the MAXIMUM number of common shared characteristics?',
        options: ['Kingdom', 'Class', 'Family', 'Species'],
        correctIndex: 3,
        explanation:
          'As we move down the taxonomic hierarchy from Kingdom to Species, the number of common characteristics increases. Species is the lowest category with the highest similarity.',
        topic: 'Taxonomic Hierarchy',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q1_7',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Lion (Panthera leo), Tiger (Panthera tigris), and Leopard (Panthera pardus) belong to the same:',
        options: ['Species', 'Genus', 'Order only', 'Family but different genus'],
        correctIndex: 1,
        explanation:
          'Leo, tigris, and pardus are distinct species that all belong to the shared genus Panthera due to close morphological and anatomical affinities.',
        topic: 'Taxonomic Hierarchy',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q1_8',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'National Botanical Research Institute (NBRI) is situated at which Indian city?',
        options: ['Kolkata', 'Dehradun', 'Lucknow', 'New Delhi'],
        correctIndex: 2,
        explanation:
          'NBRI is located in Lucknow, Uttar Pradesh. The Indian Botanical Garden is in Shibpur (Howrah/Kolkata).',
        topic: 'Taxonomic Aids',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q1_9',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'Which property of living organisms is considered exclusive to humans?',
        options: ['Metabolism', 'Photoperiod perception', 'Self-consciousness', 'Homeostasis'],
        correctIndex: 2,
        explanation:
          'While all living beings possess consciousness (perceiving surroundings), human beings are the only organisms on Earth that possess self-consciousness (awareness of self).',
        topic: 'Characteristics of Life',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q1_10',
        chapterNumber: 1,
        chapterTitle: 'The Living World',
        question: 'ICBN stands for:',
        options: [
          'International Code of Biological Nomenclature',
          'International Code of Botanical Nomenclature',
          'Indian Council of Botanical Names',
          'International Congress of Botanical Nature',
        ],
        correctIndex: 1,
        explanation:
          'ICBN stands for International Code of Botanical Nomenclature, the governing body establishing universal naming standards for plants.',
        topic: 'Binomial Nomenclature',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Biodiversity spans 1.7 – 1.8 million described species (1.25M animals, 0.5M plants).',
      'Metabolism & Consciousness are defining properties; Growth & Reproduction are non-defining.',
      'Binomial nomenclature was introduced by Carolus Linnaeus (Genus capital, species lowercase).',
      'Hierarchy: Kingdom > Phylum/Division > Class > Order > Family > Genus > Species.',
      'Herbarium provides dried plant sheets; Botanical gardens conserve living plants.',
      'Taxonomic key consists of couplets made of two leads; keys are strictly analytical.',
    ],
  },

  // CHAPTER 2: BIOLOGICAL CLASSIFICATION
  {
    chapterNumber: 2,
    title: 'Biological Classification',
    subtitle: 'CBSE Quick Revision Notes — Chapter 02',
    pageCount: 6,
    overview:
      'Biological classification groups organisms systematically based on similarities, cellular architecture, and evolutionary relationships. From Linnaeus’s Two Kingdom and Haeckel’s Three Kingdom systems to R.H. Whittaker’s Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia) and the biology of non-cellular entities (Viruses, Viroids, Lichens).',
    importancePoints: [
      'Establishes evolutionary pathways (phylogenetics) from ancient prokaryotic cells to complex multicellular eukaryotes.',
      'Whittaker’s system resolved anomalies of earlier classifications by grouping fungi separately based on chitinous cell walls and saprophytic nutrition.',
      'Explains ecological roles: Monera/Fungi as primary decomposers, Protista (diatoms) as oceanic chief producers.',
      'Details pathological microbial agents causing human, animal, and plant epidemics (bacteria, viruses, viroids).',
    ],
    concepts: [
      {
        id: 'c2_classification_systems',
        title: 'Historical Systems of Classification',
        summary: 'Comparison of Artificial, Natural, and Phylogenetic classification systems.',
        keyPoints: [
          'Artificial System: Based on only one or two superficial morphological characters (e.g., Aristotle classified animals into Enaima [with red blood] and Anaima [without red blood]; and plants into herbs, shrubs, and trees).',
          'Natural System: Based on natural affinities and comprehensive study of internal/external characters, ultrastructure, embryology, and phytochemistry (e.g., George Bentham and Joseph Dalton Hooker classification).',
          'Phylogenetic System: Based on evolutionary relationships of organisms from primitive ancestors to advanced lineages (e.g., Engler and Prantl, Hutchinson).',
          'Two Kingdom System (Linnaeus): Divided into Plantae and Animalia based strictly on the presence or absence of a cell wall. Disadvantages: Failed to distinguish prokaryotes from eukaryotes, unicellular from multicellular, or photosynthetic from heterotrophic fungi.',
          'Three Kingdom System (Ernst Haeckel): Created Kingdom Protista for unicellular organisms lacking tissue differentiation.',
          'Five Kingdom System (R.H. Whittaker, 1969): Divided living world into Monera, Protista, Fungi, Plantae, and Animalia.',
          'Whittaker’s 5 Criteria: 1. Complexity of cell structure (Prokaryotic vs Eukaryotic), 2. Body organization (Unicellular vs Multicellular), 3. Mode of nutrition (Autotrophic vs Absorptive/Ingestive Heterotrophic), 4. Reproduction, 5. Phylogenetic relationships.',
        ],
        diagramOrTable: {
          type: 'classification',
          title: 'Whittaker’s Five Kingdoms At a Glance',
          rows: [
            { col1: 'Kingdom', col2: 'Cell Type & Wall', col3: 'Mode of Nutrition & Examples' },
            { col1: 'Monera', col2: 'Prokaryotic; Non-cellulosic (peptidoglycan)', col3: 'Autotrophic (photo/chemo) & Heterotrophic; Bacteria, BGA, Mycoplasma' },
            { col1: 'Protista', col2: 'Eukaryotic; Cell wall in some (diatoms)', col3: 'Photosynthetic / Holozoic / Saprobic; Amoeba, Diatoms, Euglena' },
            { col1: 'Fungi', col2: 'Eukaryotic; Chitin & fungal cellulose', col3: 'Heterotrophic (Saprophytic / Parasitic); Rhizopus, Yeast, Mushroom' },
            { col1: 'Plantae', col2: 'Eukaryotic; Cellulose wall present', col3: 'Autotrophic (Photosynthetic); Algae, Bryophytes, Gymno, Angiosperms' },
            { col1: 'Animalia', col2: 'Eukaryotic; Cell wall completely ABSENT', col3: 'Heterotrophic (Holozoic / Ingestive); Sponges to Chordates' },
          ],
        },
      },
      {
        id: 'c2_monera',
        title: 'Kingdom Monera: Bacteria & Archaebacteria',
        summary: 'Sole prokaryotic kingdom comprising bacteria, archaebacteria, cyanobacteria, and mycoplasma.',
        keyPoints: [
          'Prokaryotic Features: Microscopic, unicellular, naked DNA (genophore / nucleoid), lack membrane-bound organelles (mitochondria, ER, Golgi), single-stranded flagella if motile, 70S ribosomes.',
          'Four Bacterial Shapes: Coccus (spherical), Bacillus (rod-shaped), Spirillum (spiral/coiled), Vibrio (comma-shaped).',
          'Archaebacteria: Group of most primitive prokaryotes surviving in extreme hostile environments due to unique cell wall structure (lacking peptidoglycan with branched lipid chains):',
          '• Halophiles: Survive in extreme saline environments.',
          '• Thermoacidophiles: Survive in boiling, acidic hot sulphur springs (up to 80°C, pH 2).',
          '• Methanogens: Survive in anaerobic marshy soils and the rumen of cud-chewing ruminants (cows/buffaloes); produce biogas (methane) from animal dung.',
          'Eubacteria (True Bacteria): Rigid cell wall with peptidoglycan, motile forms possess flagellum.',
          '• Cyanobacteria (Blue-Green Algae): Photosynthetic autotrophs containing chlorophyll a and carotenoids. Unicellular, colonial or filamentous with gelatinous sheath. Possess specialized thick-walled cells called HETEROCYSTS for biological nitrogen fixation (e.g., Nostoc, Anabaena).',
          '• Chemosynthetic Autotrophs: Oxidize inorganic compounds (nitrates, nitrites, ammonia) to release ATP energy; play a vital role in recycling nutrients (N, P, Fe, S).',
          '• Heterotrophic Bacteria: Decomposers, make curd from milk (Lactobacillus), produce antibiotics, fix nitrogen in legume roots. Pathogens cause diseases: Cholera (Vibrio cholerae), Typhoid (Salmonella typhi), Tetanus (Clostridium tetani), Citrus Canker (Xanthomonas citri).',
          'Mycoplasma (PPLO): Smallest free-living prokaryotes (0.1–0.3 µm) lacking a cell wall entirely! Can survive WITHOUT oxygen. Cause pleuropneumonia and other diseases in plants and animals.',
        ],
      },
      {
        id: 'c2_protista',
        title: 'Kingdom Protista: Eukaryotic Microorganisms',
        summary: 'Unicellular eukaryotes divided into 5 major groups: Chrysophytes, Dinoflagellates, Euglenoids, Slime Moulds, Protozoans.',
        keyPoints: [
          'General: Primarily aquatic plankton, 9+2 arrangement of microtubules composed of tubulin protein in flagella/cilia.',
          '1. Chrysophytes (Diatoms & Desmids / Golden Algae): Fresh and marine water. Cell walls form two thin overlapping shells fitting together like a soap box, embedded with indestructible silica. Accumulations over millions of years form DIATOMACEOUS EARTH, used in polishing and filtration of oils and syrups. Diatoms are the chief primary producers in oceans.',
          '2. Dinoflagellates: Mostly marine, photosynthetic, biflagellate (one longitudinal flagellum and one transverse in a groove). Rapid bloom of red dinoflagellates (Gonyaulax, Gymnodinium) causes toxic RED TIDES, releasing saxitoxin which kills fish.',
          '3. Euglenoids (Euglena): Freshwater organisms in stagnant water. Lack a cellulosic cell wall; possess a flexible proteinaceous layer called PELLICLE. Two flagella (one long, one short). Mixotrophic: photosynthetic in sunlight, heterotrophic predator in dark.',
          '4. Slime Moulds: Saprophytic protists moving along decaying twigs. Under favorable conditions, form an aggregated mass called PLASMODIUM. Under unfavorable conditions, plasmodium differentiates into fruiting bodies bearing spores with true cellulose walls that are extremely resistant to adverse conditions.',
          '5. Protozoans: Heterotrophs living as predators or parasites. Four classes:',
          '• Amoeboids: Move via pseudopodia (Amoeba), parasitic Entamoeba (causes amoebic dysentery).',
          '• Flagellated: Possess flagella, parasitic Trypanosoma (causes sleeping sickness, transmitted by Tsetse fly).',
          '• Ciliated: Thousands of coordinating cilia and an oral gullet (Paramecium).',
          '• Sporozoans: Possess an infectious spore-like stage in life cycle (Plasmodium, the malaria parasite).',
        ],
      },
      {
        id: 'c2_fungi',
        title: 'Kingdom Fungi & Acellular Entities (Viruses, Viroids, Lichens)',
        summary: 'Fungi classes and acellular biological agents excluded from the 5 Kingdom classification.',
        keyPoints: [
          'Kingdom Fungi Characteristics: Heterotrophic, achlorophyllous, cell wall composed of chitin and fungal cellulose. Reserve food is glycogen and oil. Mycelium of hyphae. Sexual cycle: Plasmogamy → Karyogamy → Meiosis in zygote.',
          'Four Fungal Classes:',
          '1. Phycomycetes: Aseptate and coenocytic (multinucleate) mycelium. Asexual zoospores (motile) or aplanospores. E.g., Mucor, Rhizopus (bread mould), Albugo (mustard parasite).',
          '2. Ascomycetes (Sac Fungi): Branched and septate mycelium. Asexual conidia on conidiophores. Sexual ascospores produced endogenously in sac-like asci inside ascocarps. Coprophilous (growing on dung). E.g., Neurospora (biochemical genetics), Aspergillus, Claviceps, Penicillium.',
          '3. Basidiomycetes (Club Fungi): Branched and septate mycelium. Asexual spores absent. Plasmogamy by somatic cells. Basidiospores produced exogenously on basidium inside basidiocarps. E.g., Agaricus (edible mushroom), Ustilago (smut), Puccinia (rust).',
          '4. Deuteromycetes (Fungi Imperfecti): Only asexual/vegetative stages known. When sexual stages are discovered, moved to Ascomycetes or Basidiomycetes. E.g., Alternaria, Colletotrichum, Trichoderma.',
          'Viruses: Acellular entities with an inert crystalline structure outside living host cells. Obligate parasites. Genetic material is either DNA or RNA (never both). Plant viruses generally have single-stranded RNA (ssRNA); animal viruses have ssRNA, dsRNA, or dsDNA; bacteriophages have double-stranded DNA (dsDNA). Discovered by D.J. Ivanowsky (1892). Cause AIDS, mumps, influenza, rabies, tobacco mosaic.',
          'Viroids: Discovered by T.O. Diener (1971). Infectious agents smaller than viruses consisting of free infectious RNA without any protein coat (capsid). Low molecular weight RNA. Cause Potato Spindle Tuber Disease.',
          'Lichens: Symbiotic mutualistic association between an alga (Phycobiont, autotrophic) and a fungus (Mycobiont, provides shelter and water). Excellent bio-indicators of air pollution (do not grow in SO2 polluted environments).',
        ],
      },
    ],
    mnemonicsAndTips: [
      {
        title: 'Bacterial Shapes Memory Trick',
        text: 'C-B-S-V: Coccus = Circular, Bacillus = Bar/Rod, Spirillum = Spiral, Vibrio = (,) Comma.',
      },
      {
        title: 'Phycomycetes vs Ascomycetes Mycelium',
        text: 'Phycomycetes are ASEPTATE & COENOCYTIC (continuous tube with multiple nuclei). All other 3 classes (Ascomycetes, Basidiomycetes, Deuteromycetes) are SEPTATE & BRANCHED.',
      },
      {
        title: 'Viroid vs Virus Distinction',
        text: 'Viroid = Virus - Protein Coat! It is naked, free RNA discovered by T.O. Diener.',
      },
    ],
    quizQuestions: [
      {
        id: 'bio_q2_1',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Who proposed the five kingdom system of classification based on cell structure, body organization, and mode of nutrition?',
        options: ['Carolus Linnaeus', 'Ernst Haeckel', 'R.H. Whittaker', 'Bentham and Hooker'],
        correctIndex: 2,
        explanation:
          'R.H. Whittaker (1969) proposed the Five Kingdom classification: Monera, Protista, Fungi, Plantae, and Animalia.',
        topic: 'Five Kingdom System',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q2_2',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Which group of organisms possesses specialized cells called "heterocysts" for biological nitrogen fixation?',
        options: ['Methanogens', 'Cyanobacteria (e.g., Nostoc and Anabaena)', 'Chrysophytes', 'Mycoplasma'],
        correctIndex: 1,
        explanation:
          'Cyanobacteria (blue-green algae) like Nostoc and Anabaena possess specialized thick-walled cells called heterocysts dedicated to nitrogen fixation.',
        topic: 'Kingdom Monera',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q2_3',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Archaebacteria are able to survive in extreme hostile environments (hot springs, salty areas, marshlands) due to:',
        options: [
          'Thick cellulose cell wall',
          'Presence of complex peptidoglycan',
          'Different cell wall structure with branched chain lipids in membrane',
          'Abundant 80S ribosomes',
        ],
        correctIndex: 2,
        explanation:
          'Archaebacteria differ from true bacteria in having a distinctive cell wall structure lacking peptidoglycan and containing ether-linked branched lipid chains.',
        topic: 'Kingdom Monera',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q2_4',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Which organism completely lacks a cell wall and can survive in the total absence of oxygen?',
        options: ['Bacillus', 'Mycoplasma (PPLO)', 'Rhizopus', 'Euglena'],
        correctIndex: 1,
        explanation:
          'Mycoplasma (PPLO) are the smallest known free-living prokaryotes, completely devoid of a cell wall and facultatively anaerobic.',
        topic: 'Kingdom Monera',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q2_5',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'The silica-impregnated indestructible cell walls of which protists accumulate over geological eras to form "Diatomaceous Earth"?',
        options: ['Dinoflagellates', 'Euglenoids', 'Diatoms (Chrysophytes)', 'Slime Moulds'],
        correctIndex: 2,
        explanation:
          'Diatoms possess overlapping siliceous shells fitting like a soap box. When they die, the silica walls accumulate to form diatomaceous earth used for filtration and polishing.',
        topic: 'Kingdom Protista',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q2_6',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'The phenomenon of "Red Tide" in oceans is primarily caused by rapid population bloom of:',
        options: ['Red algae (Polysiphonia)', 'Dinoflagellates like Gonyaulax and Gymnodinium', 'Cyanobacteria', 'Diatoms'],
        correctIndex: 1,
        explanation:
          'Red dinoflagellates such as Gonyaulax and Gymnodinium multiply rapidly, coloring the sea red and secreting potent toxins (saxitoxins) that cause fish mortality.',
        topic: 'Kingdom Protista',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q2_7',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Euglenoids are considered unique among protists because they:',
        options: [
          'Have a rigid chitin wall',
          'Possess a protein-rich flexible pellicle instead of a cell wall and show mixotrophic nutrition',
          'Are non-motile parasites',
          'Lack any photosynthetic pigments',
        ],
        correctIndex: 1,
        explanation:
          'Euglenoids lack a cell wall; they possess a flexible protein layer called a pellicle and exhibit mixotrophy (photosynthetic in light, predatory in darkness).',
        topic: 'Kingdom Protista',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q2_8',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'In which class of fungi is the mycelium aseptate and coenocytic (multinucleated continuous tube)?',
        options: ['Ascomycetes', 'Basidiomycetes', 'Deuteromycetes', 'Phycomycetes'],
        correctIndex: 3,
        explanation:
          'Phycomycetes (such as Mucor, Rhizopus, and Albugo) have aseptate and coenocytic mycelia. The other three classes have septate, branched hyphae.',
        topic: 'Kingdom Fungi',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q2_9',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Neurospora, extensively utilized in biochemical and genetic research, belongs to:',
        options: ['Phycomycetes', 'Ascomycetes', 'Basidiomycetes', 'Deuteromycetes'],
        correctIndex: 1,
        explanation:
          'Neurospora crassa is an Ascomycete (sac fungus) used as a model organism in molecular genetics (Drosophila of the plant kingdom).',
        topic: 'Kingdom Fungi',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q2_10',
        chapterNumber: 2,
        chapterTitle: 'Biological Classification',
        question: 'Viroids differ from viruses in that viroids:',
        options: [
          'Possess a thick protein capsid and DNA',
          'Consist of free infectious RNA without any protein coat',
          'Have larger size than bacteria',
          'Can only infect animals',
        ],
        correctIndex: 1,
        explanation:
          'Discovered by T.O. Diener in 1971, viroids are sub-viral agents made of free, low-molecular-weight RNA without any protective protein capsid.',
        topic: 'Acellular Entities',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Whittaker’s 5 criteria: Cell type, Body organization, Mode of nutrition, Reproduction, Phylogeny.',
      'Bacteria shapes: Coccus (round), Bacillus (rod), Spirillum (spiral), Vibrio (comma).',
      'Archaebacteria have non-peptidoglycan walls: Halophiles (salt), Thermoacidophiles (hot springs), Methanogens (rumen/biogas).',
      'Mycoplasma: Smallest, lack cell wall, survive anaerobically, pathogenic.',
      'Diatoms have silica soap-box walls forming diatomaceous earth; chief ocean producers.',
      'Gonyaulax causes toxic Red Tides; Euglena has pellicle and mixotrophic nutrition.',
      'Fungi wall has chitin; Phycomycetes have coenocytic aseptate mycelia; Neurospora is an Ascomycete.',
      'Viroids (T.O. Diener) are free RNA without protein coats; Lichens are sensitive SO2 bio-indicators.',
    ],
  },

  // CHAPTER 10: CELL CYCLE AND CELL DIVISION
  {
    chapterNumber: 10,
    title: 'Cell Cycle and Cell Division',
    subtitle: 'CBSE Quick Revision Notes — Chapter 10',
    pageCount: 4,
    overview:
      'The sequence of coordinated events by which a cell duplicates its genome, synthesizes cellular constituents, and divides into daughter cells. Covers the cell cycle timeline (Human ~24 hrs, Yeast ~90 mins), Interphase sub-stages (G1, S, G2, G0 Quiescent stage), Mitosis (Equational division) and Meiosis (Reductional division) with detailed Prophase-I crossing over genetics.',
    importancePoints: [
      'Explains continuity of life and tissue repair: how a single zygote develops into a multicellular organism with identical diploid genomes.',
      'Mitosis ensures identical somatic duplication, replacing worn-out gastrointestinal lining, epidermal cells, and blood cells.',
      'Meiosis halves chromosome count (2n → n) to conserve species-specific ploidy across generations during sexual reproduction.',
      'Crossing over during Pachytene creates genetic recombination, the raw substrate driving natural selection and evolution.',
    ],
    concepts: [
      {
        id: 'c10_cell_cycle_phases',
        title: 'Cell Cycle Timeline & Interphase Stages',
        summary: 'Detailed timeline of cell division, G1, S, G2 phases, and the G0 Quiescent stage.',
        keyPoints: [
          'Definition: The orderly sequence of events by which a cell duplicates its genome, synthesizes other cellular constituents, and divides into two daughter cells is called the cell cycle.',
          'Duration: Human somatic cells divide once in approximately 24 hours; Yeast completes cell division in merely 90 minutes.',
          'Two Fundamental Phases: 1. Interphase (Resting/growth phase, accounting for >95% of cell cycle time), 2. M Phase (Mitosis/division phase, accounting for <5% of time).',
          '• G1 Phase (Gap 1): Interval between mitosis and initiation of DNA replication. Cell is metabolically active, synthesizes RNA and proteins, and grows continuously in volume.',
          '• S Phase (Synthesis): Period of DNA replication. Amount of DNA per cell DOUBLES (from 2C to 4C)! However, the number of chromosomes remains STRICTLY UNCHANGED (2n remains 2n). In animal cells, the centriole duplicates in the cytoplasm.',
          '• G2 Phase (Gap 2): Synthesis of proteins (tubulin for spindle fibers) occurs in preparation for mitosis while cell growth continues.',
          '• G0 Phase (Quiescent Stage): Cells in adult animals that do not divide routinely (e.g., heart muscle cells, neurons) exit the G1 phase to enter an inactive stage called G0. Cells remain metabolically active but do not divide unless needed to replace lost or damaged tissue.',
        ],
        diagramOrTable: {
          type: 'cycle',
          title: 'Cell Cycle Phase Distribution (~24 Hour Human Cell)',
          steps: [
            '1. G1 Phase (~10 hours): Rapid protein synthesis, cell growth, RNA production',
            '2. S Phase (~9 hours): DNA replication (2C → 4C); Centriole duplication in cytoplasm',
            '3. G2 Phase (~4 hours): Spindle protein synthesis, pre-mitotic check',
            '4. M Phase (~1 hour): Karyokinesis (Prophase → Metaphase → Anaphase → Telophase) & Cytokinesis',
            '• Quiescent G0: Metabolically active exit stage for non-dividing mature cells',
          ],
        },
      },
      {
        id: 'c10_mitosis',
        title: 'Mitosis: Stages of Equational Division',
        summary: 'Four stages of karyokinesis (Prophase, Metaphase, Anaphase, Telophase) and cytokinesis in plant vs animal cells.',
        keyPoints: [
          'Equational Division: Chromosome number in daughter cells is identical to the parent cell (2n → 2n). Occurs in somatic diploid cells of animals (and both haploid/diploid cells in plants).',
          '1. Prophase: Chromosomal material begins condensing; centrioles move toward opposite poles; aster and spindle fibers assemble. By late prophase: nuclear membrane, nucleolus, Golgi complex, and ER completely disappear.',
          '2. Metaphase: Nuclear membrane is completely absent. Chromosomes are at their highest state of condensation; this is the MOST SUITABLE STAGE to study chromosome morphology and size! Chromosomes align along the equatorial METAPHASE PLATE. Spindle fibers attach to disc-shaped KINETOCHORES on centromeres.',
          '3. Anaphase: Splitting of each centromere occurs simultaneously. Sister chromatids separate and are pulled toward opposite poles as daughter chromosomes. Centromeres lead while arms trail in V, L, J, or I shapes.',
          '4. Telophase: Chromosomes reach opposite poles, uncoil, and lose individual identity. Nuclear envelope reassembles around chromosome clusters; nucleolus, Golgi, and ER reform.',
          'Cytokinesis: Division of cytoplasm. In animal cells: a cleavage furrow appears in the plasma membrane and deepens centripetally (outside-in). In plant cells: rigid walls prevent furrowing; a cell plate (derived from phragmoplast) forms centrifugally (center outward).',
          'Significance: Diploid genetic identity, growth of multicellular organisms, cell repair (gut lining, blood cells), vegetative growth via apical and lateral cambium.',
        ],
      },
      {
        id: 'c10_meiosis_prophase1',
        title: 'Meiosis I: Reductional Division & Prophase I Sub-stages',
        summary: 'Meiosis stages with in-depth analysis of the 5 sub-stages of Prophase I and crossing over.',
        keyPoints: [
          'Reductional Division: Reduces chromosome number by half (2n → n) yielding 4 haploid daughter cells. Two sequential cycles of nuclear division (Meiosis I & II) but only a single cycle of DNA replication.',
          'Prophase I (Longest and most complex phase, 5 sub-stages):',
          '1. Leptotene: Chromosomes condense progressively and become visible under the light microscope.',
          '2. Zygotene: Homologous chromosomes begin pairing together in a process called SYNAPSIS. Formed structure is called a BIVALENT or TETRAD. Synapsis is stabilized by a nucleoprotein structure called the SYNAPTONEMAL COMPLEX.',
          '3. Pachytene: Recombination nodules appear. CROSSING OVER takes place between NON-SISTER CHROMATIDS of homologous chromosomes. Mediated by the enzyme RECOMBINASE. Genetic material is exchanged.',
          '4. Diplotene: Dissolution of the synaptonemal complex; homologous chromosomes separate except at crossover sites, forming X-shaped contact points called CHIASMATA. (In oocytes of some vertebrates, diplotene can persist for months/years).',
          '5. Diakinesis: Characterized by TERMINALISATION OF CHIASMATA. Chromosomes fully condense, nucleolus disappears, and nuclear envelope breaks down.',
          'Metaphase I: Bivalent chromosomes align on the equatorial plate; spindle fibers attach to homologous pairs.',
          'Anaphase I: Homologous chromosomes separate to opposite poles, BUT SISTER CHROMATIDS REMAIN ATTACHED at their centromeres (unlike mitosis!).',
          'Telophase I & Interkinesis: Nuclear membrane reforms, cytokinesis produces a dyad of cells. Interkinesis is a short-lived resting interval between Meiosis I and II with NO DNA replication.',
        ],
        diagramOrTable: {
          type: 'hierarchy',
          title: 'Chronological Progression of Prophase I Stages',
          steps: [
            '1. Leptotene → Chromosome compaction & visibility',
            '2. Zygotene → Synapsis of homologous pairs; Synaptonemal complex; Bivalent/Tetrad formation',
            '3. Pachytene → Crossing over between non-sister chromatids via enzyme Recombinase',
            '4. Diplotene → Dissolution of synaptonemal complex; X-shaped Chiasmata appearance',
            '5. Diakinesis → Terminalisation of chiasmata; breakdown of nuclear envelope',
          ],
        },
      },
      {
        id: 'c10_meiosis2_vs_mitosis',
        title: 'Meiosis II & Comparative Analysis (Mitosis vs Meiosis)',
        summary: 'Equational division of haploid cells and side-by-side comparison table.',
        keyPoints: [
          'Meiosis II: Resembles a standard equational mitosis occurring on haploid nuclei. In Anaphase II, centromeres split simultaneously, sister chromatids migrate to opposite poles, and cytokinesis produces 4 haploid daughter cells (tetrad).',
          'Significance of Meiosis: Conserves the constant species chromosome number across generations in sexually reproducing taxa; crossing over introduces novel genetic combinations driving variation and evolution.',
        ],
        diagramOrTable: {
          type: 'comparison',
          title: 'Comprehensive Matrix: Mitosis vs Meiosis',
          rows: [
            { col1: 'Feature', col2: 'Mitosis (Equational)', col3: 'Meiosis (Reductional)' },
            { col1: 'Occurrence', col2: 'Somatic cells (and germ stem cells)', col3: 'Germline reproductive cells (meiocytes)' },
            { col1: 'Number of Divisions', col2: 'One single nuclear division', col3: 'Two successive divisions (Meiosis I & II)' },
            { col1: 'Daughter Cells Produced', col2: '2 diploid daughter cells (2n → 2n)', col3: '4 haploid daughter cells (2n → n)' },
            { col1: 'DNA Replication Cycles', col2: 'One cycle preceding division', col3: 'One single cycle preceding Meiosis I only' },
            { col1: 'Synapsis & Chiasmata', col2: 'Completely absent', col3: 'Present (Zygotene & Diplotene)' },
            { col1: 'Crossing Over', col2: 'Absent', col3: 'Present in Pachytene (enzyme Recombinase)' },
            { col1: 'Centromere Splitting in Anaphase I', col2: 'Centromeres split in Anaphase', col3: 'Centromeres DO NOT split in Anaphase I' },
            { col1: 'Genetic Outcome', col2: 'Genetically identical clones', col3: 'Genetically varied recombinants' },
          ],
        },
      },
    ],
    mnemonicsAndTips: [
      {
        title: 'Prophase-I Stages Mnemonic',
        text: '“Lazy Zebras Pack Delicious Donuts” → Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.',
      },
      {
        title: 'DNA Amount vs Chromosome Count in S Phase',
        text: 'Crucial NEET/Board rule: In S Phase, DNA quantity doubles from 2C to 4C, but chromosome number remains CONSTANT at 2n (chromatids replicate, but centromere count is identical).',
      },
      {
        title: 'Morphology Study Stage',
        text: 'Metaphase is ALWAYS the best stage to study chromosome morphology, karyotyping, and count because chromosomes are shortest, thickest, and aligned at the equatorial plate.',
      },
    ],
    quizQuestions: [
      {
        id: 'bio_q10_1',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'During which phase of the cell cycle does DNA replication take place, resulting in doubling of DNA content?',
        options: ['G1 phase', 'S phase (Synthesis)', 'G2 phase', 'M phase'],
        correctIndex: 1,
        explanation:
          'During S (Synthesis) phase, DNA replication takes place, doubling DNA content from 2C to 4C, while chromosome number remains 2n.',
        topic: 'Interphase',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q10_2',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'If a parent cell has 16 chromosomes (2n = 16) and 2C DNA content, what will be its chromosome number and DNA content at G2 phase?',
        options: [
          '16 chromosomes and 4C DNA',
          '32 chromosomes and 4C DNA',
          '16 chromosomes and 2C DNA',
          '8 chromosomes and 2C DNA',
        ],
        correctIndex: 0,
        explanation:
          'During S phase, DNA content doubles from 2C to 4C, but the chromosome number remains unchanged (2n = 16). At G2, chromosome count is 16 and DNA is 4C.',
        topic: 'Interphase',
        difficulty: 'Hard',
      },
      {
        id: 'bio_q10_3',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'Cells in adult animals like heart cells and neurons that do not divide exit the G1 phase and enter which inactive stage?',
        options: ['S phase', 'G0 Quiescent stage', 'G2 phase', 'Interkinesis'],
        correctIndex: 1,
        explanation:
          'Cells that do not regularly divide exit G1 and enter an inactive phase called the Quiescent stage (G0). They remain metabolically active but do not proliferate.',
        topic: 'Interphase',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q10_4',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'Which stage of mitosis is universally considered the most suitable for studying the morphology, size, and shape of chromosomes?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctIndex: 1,
        explanation:
          'At metaphase, chromosomes reach maximum condensation and align clearly on the equatorial metaphase plate, making it the ideal stage for morphological study.',
        topic: 'Mitosis',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q10_5',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'Spindle fibers attach to chromosomes during metaphase at specialized disc-shaped structures on the centromere called:',
        options: ['Centrosomes', 'Kinetochores', 'Chromomeres', 'Telomeres'],
        correctIndex: 1,
        explanation:
          'Kinetochores are disc-shaped protein structures situated on the centromere to which spindle microtubules attach during cell division.',
        topic: 'Mitosis',
        difficulty: 'Easy',
      },
      {
        id: 'bio_q10_6',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'In which stage of Prophase I of Meiosis does crossing over occur between non-sister chromatids of homologous chromosomes?',
        options: ['Leptotene', 'Zygotene', 'Pachytene', 'Diplotene'],
        correctIndex: 2,
        explanation:
          'Crossing over occurs during Pachytene stage, mediated by the enzyme recombinase, leading to genetic exchange between non-sister chromatids.',
        topic: 'Meiosis Prophase I',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q10_7',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'The X-shaped structures formed due to the dissolution of the synaptonemal complex during Diplotene are known as:',
        options: ['Synapsis', 'Chiasmata', 'Kinetochores', 'Centrosomes'],
        correctIndex: 1,
        explanation:
          'In Diplotene, dissolution of the synaptonemal complex causes homologous chromosomes to separate except at crossover points, forming X-shaped chiasmata.',
        topic: 'Meiosis Prophase I',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q10_8',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'What is a critical difference between Anaphase I of Meiosis and Anaphase of Mitosis?',
        options: [
          'In Anaphase I, centromeres split; in Mitosis, they do not',
          'In Anaphase I, homologous chromosomes separate while sister chromatids remain attached at centromeres',
          'In Anaphase I, spindle fibers do not attach to chromosomes',
          'In Mitosis, chromosome number is halved',
        ],
        correctIndex: 1,
        explanation:
          'In Anaphase I of meiosis, whole homologous chromosomes separate to opposite poles, but sister chromatids remain attached at their centromere. In mitotic anaphase, centromeres split.',
        topic: 'Meiosis vs Mitosis',
        difficulty: 'Hard',
      },
      {
        id: 'bio_q10_9',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'How does cytokinesis differ between animal and plant cells?',
        options: [
          'Animal cells divide by cell plate formation; plant cells divide by furrowing',
          'Animal cells divide centripetally by a cleavage furrow; plant cells divide centrifugally by cell plate formation',
          'Animal cells do not undergo cytokinesis',
          'Plant cells divide centripetally from outside to inside',
        ],
        correctIndex: 1,
        explanation:
          'Animal cells lack rigid walls, dividing centripetally through a furrow deepening inward. Plant cells have inextensible walls, dividing centrifugally through a cell plate forming from the center outward.',
        topic: 'Cytokinesis',
        difficulty: 'Medium',
      },
      {
        id: 'bio_q10_10',
        chapterNumber: 10,
        chapterTitle: 'Cell Cycle and Cell Division',
        question: 'The brief stage between Meiosis I and Meiosis II without any DNA replication is called:',
        options: ['Interphase', 'Interkinesis', 'Diakinesis', 'Quiescent stage'],
        correctIndex: 1,
        explanation:
          'Interkinesis (interphase II) is the short-lived interval separating Meiosis I and Meiosis II. Crucially, NO DNA replication takes place during interkinesis.',
        topic: 'Meiosis',
        difficulty: 'Easy',
      },
    ],
    quickRevisionBulletins: [
      'Cell cycle duration: Human cell ~24 hrs; Yeast ~90 mins.',
      'Interphase occupies >95% of the cycle: G1 (growth), S (DNA doubles 2C→4C), G2 (mitotic proteins).',
      'Chromosome number remains 2n in S phase even though DNA content doubles.',
      'G0 (quiescent stage): Non-dividing metabolically active cells (neurons, heart cells).',
      'Metaphase is the best stage to study chromosome morphology on the metaphase plate.',
      'Prophase I sub-stages: Leptotene (compaction) → Zygotene (synapsis/tetrad) → Pachytene (crossing over via recombinase) → Diplotene (chiasmata) → Diakinesis (terminalisation).',
      'In Anaphase I, homologous chromosomes separate; centromeres do NOT split until Anaphase II.',
      'Animal cytokinesis is centripetal (furrow); plant cytokinesis is centrifugal (cell plate).',
    ],
  },
];
