import { ResourceType } from "@/lib/types";

/**
 * Comprehensive K-12 Seed Data
 * Covers: IB, CAIE, Edexcel, CBSE, ICSE, AP, MOE
 */

export const K12_ALL_SEED_DATA = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // IB (International Baccalaureate)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "IB", curriculum: "IB Diploma", subject: "Math AA (HL)", grade: "11-12", sortOrder: 1,
    title: "Topic 1: Number and Algebra",
    content: "- Arithmetic and geometric sequences and series\n- Exponents and logarithms\n- Proof by mathematical induction\n- Complex numbers (Cartesian, polar, Euler forms)\n- Systems of linear equations",
    tags: ["ib", "math-aa", "hl"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "IB", curriculum: "IB Diploma", subject: "Physics (HL)", grade: "11-12", sortOrder: 2,
    title: "Topic 2: Mechanics",
    content: "- Kinematics (equations of motion, projectile motion)\n- Forces and dynamics (Newton's laws, friction)\n- Work, energy, power, and momentum\n- Circular motion and gravitation",
    tags: ["ib", "physics", "hl"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "IB", curriculum: "IB Diploma", subject: "Chemistry (SL)", grade: "11-12", sortOrder: 3,
    title: "Topic 4: Chemical Bonding",
    content: "- Ionic bonding and structure\n- Covalent bonding (Lewis structures, VSEPR theory)\n- Intermolecular forces (Hydrogen bonding, London dispersion, dipole-dipole)\n- Metallic bonding",
    tags: ["ib", "chemistry", "sl"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "IB", curriculum: "IB Diploma", subject: "Economics (HL)", grade: "11-12", sortOrder: 4,
    title: "Unit 2: Microeconomics",
    content: "- Demand, supply, and equilibrium\n- Elasticities (PED, YED, XED, PES)\n- Government intervention (taxes, subsidies, price controls)\n- Market failure (externalities, public goods)\n- Market power (monopoly, oligopoly, monopolistic competition)",
    tags: ["ib", "economics", "hl"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CAIE (Cambridge Assessment International Education)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CAIE", curriculum: "IGCSE", subject: "Mathematics (0580)", grade: "9-10", sortOrder: 1,
    title: "Section 1: Number",
    content: "- Types of numbers, prime factors, LCM, HCF\n- Percentages, fractions, decimals\n- Ratio and proportion\n- Indices and standard form\n- Personal and small business finance",
    tags: ["caie", "igcse", "math"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CAIE", curriculum: "IGCSE", subject: "Physics (0625)", grade: "9-10", sortOrder: 2,
    title: "Section 3: Waves",
    content: "- General properties of waves\n- Light (reflection, refraction, lenses, dispersion)\n- Sound waves (speed, pitch, loudness)\n- Electromagnetic spectrum",
    tags: ["caie", "igcse", "physics"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CAIE", curriculum: "A-Level", subject: "Mathematics (9709)", grade: "11-12", sortOrder: 3,
    title: "Pure Mathematics 1",
    content: "- Quadratics, functions, coordinate geometry\n- Circular measure and trigonometry\n- Series (arithmetic and geometric progression)\n- Differentiation and integration basics",
    tags: ["caie", "a-level", "math"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CAIE", curriculum: "A-Level", subject: "Chemistry (9701)", grade: "11-12", sortOrder: 4,
    title: "Physical Chemistry",
    content: "- Atomic structure and moles\n- Chemical bonding and states of matter\n- Enthalpy changes and chemical energetics\n- Equilibria and reaction kinetics",
    tags: ["caie", "a-level", "chemistry"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Edexcel
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "Edexcel", curriculum: "International GCSE", subject: "Mathematics (4MA1)", grade: "9-10", sortOrder: 1,
    title: "Topic 2: Algebra",
    content: "- Expressions, equations, and formulae\n- Sequences, functions, and graphs\n- Inequalities and simultaneous equations\n- Quadratics and expanding brackets",
    tags: ["edexcel", "igcse", "math"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "Edexcel", curriculum: "International GCSE", subject: "Biology (4BI1)", grade: "9-10", sortOrder: 2,
    title: "Section 2: Structure and Function",
    content: "- Cells and transport mechanisms\n- Human nutrition and digestive system\n- Respiration and gas exchange\n- Coordination and response (nervous, endocrine systems)",
    tags: ["edexcel", "igcse", "biology"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "Edexcel", curriculum: "A-Level", subject: "Mathematics (9MA0)", grade: "11-12", sortOrder: 3,
    title: "Pure Mathematics (Year 1)",
    content: "- Algebraic expressions, quadratics, equations and inequalities\n- Graphs and transformations\n- Straight line graphs and circles\n- Trigonometric ratios and identities",
    tags: ["edexcel", "a-level", "math"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CBSE (Central Board of Secondary Education)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CBSE", curriculum: "CBSE", subject: "Mathematics", grade: "10", sortOrder: 1,
    title: "Unit 2: Algebra",
    content: "- Polynomials (zeroes, relationship between zeroes and coefficients)\n- Pair of Linear Equations in Two Variables\n- Quadratic Equations (factorization, quadratic formula)\n- Arithmetic Progressions",
    tags: ["cbse", "math", "grade10"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CBSE", curriculum: "CBSE", subject: "Science", grade: "10", sortOrder: 2,
    title: "Unit 3: Natural Phenomena (Physics)",
    content: "- Reflection of light by curved surfaces\n- Refraction of light and lenses\n- Human eye and colorful world\n- Dispersion, scattering of light",
    tags: ["cbse", "physics", "grade10"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "CBSE", curriculum: "CBSE", subject: "Chemistry", grade: "12", sortOrder: 3,
    title: "Unit 1: Solutions",
    content: "- Types of solutions, expression of concentration\n- Solubility of gases in liquids, solid solutions\n- Colligative properties (elevation of boiling point, depression of freezing point, osmotic pressure)\n- Determination of molecular masses using colligative properties",
    tags: ["cbse", "chemistry", "grade12"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ICSE (Indian Certificate of Secondary Education)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "ICSE", curriculum: "ICSE", subject: "Mathematics", grade: "10", sortOrder: 1,
    title: "Unit 3: Geometry",
    content: "- Circles (tangents, intersecting chords, cyclic properties)\n- Geometry constructions\n- Locus and its properties",
    tags: ["icse", "math", "grade10"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "ICSE", curriculum: "ICSE", subject: "Physics", grade: "10", sortOrder: 2,
    title: "Unit 2: Light",
    content: "- Refraction of light at plane surfaces\n- Total internal reflection and prisms\n- Lenses (convex, concave) and sign convention\n- Electromagnetic spectrum",
    tags: ["icse", "physics", "grade10"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AP (Advanced Placement)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "AP", curriculum: "AP", subject: "Calculus AB", grade: "11-12", sortOrder: 1,
    title: "Unit 2: Differentiation",
    content: "- Defining the derivative and rate of change\n- Basic derivative rules (power, sum, difference)\n- Product and quotient rules\n- Chain rule and implicit differentiation",
    tags: ["ap", "calculus", "high-school"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "AP", curriculum: "AP", subject: "Physics C: Mechanics", grade: "11-12", sortOrder: 2,
    title: "Unit 2: Newton's Laws of Motion",
    content: "- Static equilibrium (first law)\n- Dynamics of a single particle (second law)\n- Systems of two or more objects (third law)",
    tags: ["ap", "physics", "mechanics"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "AP", curriculum: "AP", subject: "Computer Science A", grade: "11-12", sortOrder: 3,
    title: "Unit 5: Writing Classes",
    content: "- Anatomy of a class (instance variables, constructors, methods)\n- Accessor and mutator methods\n- Scope, access, and the `this` keyword\n- Static variables and methods",
    tags: ["ap", "computer-science", "java"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MOE (UAE Ministry of Education)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "MOE", curriculum: "MOE (UAE)", subject: "Mathematics (Adv)", grade: "12", sortOrder: 1,
    title: "Unit 1: Limits and Continuity",
    content: "- Limits of functions and end behavior\n- Evaluating limits analytically\n- Continuity of functions at a point and on an interval\n- Intermediate Value Theorem",
    tags: ["moe", "uae", "math", "grade12"] },
  { type: ResourceType.Syllabus, vertical: "k12" as const, board: "MOE", curriculum: "MOE (UAE)", subject: "Physics (Adv)", grade: "12", sortOrder: 2,
    title: "Unit 1: Electromagnetism",
    content: "- Electric fields and potentials\n- Capacitance and dielectrics\n- Magnetic fields and forces\n- Electromagnetic induction (Faraday's Law)",
    tags: ["moe", "uae", "physics", "grade12"] },
];
