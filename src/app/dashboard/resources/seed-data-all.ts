import { ResourceType } from "@/lib/types";

/**
 * Complete Seed Data — All Curricula
 * ═══════════════════════════════════════════════════════════
 * CBSE Mathematics 8-12  (67 entries — already exists)
 * IB Math AA SL/HL       (5 topics)
 * IB Chemistry SL/HL     (6 topics)
 * IGCSE Physics           (6 topics)
 * IGCSE Mathematics       (10 topics)
 * A-Level Biology AS/A2   (19 topics)
 * ═══════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IB MATH ANALYSIS & APPROACHES (SL / HL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const IB_MATH_AA_SEED_DATA = [
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "SL", sortOrder: 1,
    title: "Topic 1: Number and Algebra (SL)",
    content: "- Operations with numbers in the form a × 10ᵏ (scientific notation)\n- Arithmetic sequences and series: nth term uₙ = u₁ + (n−1)d, sum Sₙ\n- Geometric sequences and series: nth term, sum, sigma notation\n- Compound interest and financial applications\n- Laws of exponents and logarithms\n- Simple deductive proof (numerical and algebraic)\n- The Binomial Theorem: expansion of (a+b)ⁿ, Pascal's triangle\n- Counting principles using nCr",
    tags: ["algebra", "sequences", "ib-sl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "HL", sortOrder: 2,
    title: "Topic 1: Number and Algebra (HL Extensions)",
    content: "**Additional HL Content:**\n\n- Permutations and combinations\n- Extension of binomial theorem to fractional and negative indices\n- Partial fractions\n- Complex numbers: Cartesian form z = a + bi, modulus, argument, conjugate\n- Polar/Euler form: z = r·cis θ = re^(iθ)\n- De Moivre's theorem and nth roots of complex numbers\n- Proof by mathematical induction\n- Solutions of systems of linear equations (up to 3×3)\n- Polynomial equations with complex roots",
    tags: ["algebra", "complex-numbers", "ib-hl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "SL", sortOrder: 3,
    title: "Topic 2: Functions (SL)",
    content: "- Concept of a function: domain, range, graph\n- Equations of straight lines (gradient-intercept, point-gradient)\n- The quadratic function: vertex, axis of symmetry, discriminant\n- Solving quadratic equations and inequalities\n- Reciprocal function f(x) = 1/x and rational functions\n- Exponential functions f(x) = aˣ and f(x) = eˣ\n- Logarithmic functions: f(x) = logₐx and f(x) = ln x\n- Composite functions (f ∘ g)(x)\n- Inverse functions f⁻¹(x)\n- Transformations of graphs: translations, reflections, stretches",
    tags: ["functions", "ib-sl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "HL", sortOrder: 4,
    title: "Topic 2: Functions (HL Extensions)",
    content: "**Additional HL Content:**\n\n- Polynomial functions: factor and remainder theorems\n- Fundamental theorem of algebra\n- Rational functions and their graphs (asymptotic behaviour)\n- Odd and even functions\n- Self-inverse functions\n- Solutions of inequalities (both linear and quadratic)\n- Modulus function |f(x)|\n- Reciprocal trigonometric functions: sec, csc, cot",
    tags: ["functions", "ib-hl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "SL", sortOrder: 5,
    title: "Topic 3: Geometry and Trigonometry (SL)",
    content: "- 3D geometry: distance, midpoint in 3D space\n- Right-angled trigonometry: sin, cos, tan\n- Sine rule (including ambiguous case) and cosine rule\n- Area of a triangle: A = ½ab sin C\n- Radian measure of angles\n- Length of arc and area of sector\n- Unit circle: definitions of sin θ, cos θ, tan θ\n- Pythagorean identity: sin²θ + cos²θ = 1\n- Double angle identities (sin 2θ, cos 2θ)\n- Circular functions and their graphs (amplitude, period, phase shift)\n- Solving trigonometric equations in finite intervals",
    tags: ["trigonometry", "geometry", "ib-sl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "HL", sortOrder: 6,
    title: "Topic 3: Geometry and Trigonometry (HL Extensions)",
    content: "**Additional HL Content:**\n\n- Reciprocal trig ratios: sec θ, csc θ, cot θ\n- Compound angle identities: sin(A ± B), cos(A ± B), tan(A ± B)\n- Symmetry properties of trigonometric graphs\n- Vectors: representation, unit vectors, base vectors i, j, k\n- Scalar (dot) product: a · b = |a||b|cos θ\n- Vector (cross) product: a × b\n- Vector equation of a line in 2D and 3D\n- Lines in space: parallel, intersecting, skew\n- Vector equations of planes\n- Angles and intersections between lines and planes\n- Shortest distance between lines",
    tags: ["trigonometry", "vectors", "ib-hl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "SL", sortOrder: 7,
    title: "Topic 4: Statistics and Probability (SL)",
    content: "- Population vs sample, discrete vs continuous data\n- Presentation of data: frequency tables, histograms, box-and-whisker\n- Measures of central tendency: mean, median, mode\n- Measures of dispersion: range, IQR, standard deviation, variance\n- Linear correlation: Pearson's r, scatter diagrams\n- Regression line: equation of y on x\n- Probability: sample spaces, events, Venn and tree diagrams\n- Combined events: P(A ∪ B), mutually exclusive events\n- Conditional probability: P(A|B)\n- Independent events\n- Discrete random variables, expected value E(X)\n- Binomial distribution: X ~ B(n, p), mean, variance\n- Normal distribution: X ~ N(μ, σ²), standardisation, z-scores",
    tags: ["statistics", "probability", "ib-sl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "HL", sortOrder: 8,
    title: "Topic 4: Statistics and Probability (HL Extensions)",
    content: "**Additional HL Content:**\n\n- Bayes' theorem\n- Continuous random variables and probability density functions\n- Linear transformations of a single random variable\n- Unbiased estimators and their distributions\n- Hypothesis testing for proportions and means (z-test, t-test)",
    tags: ["statistics", "probability", "ib-hl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "SL", sortOrder: 9,
    title: "Topic 5: Calculus (SL)",
    content: "- Limits and convergence (intuitive understanding)\n- Derivative as gradient of tangent and rate of change\n- Differentiation from first principles (simple polynomials)\n- Derivatives of xⁿ, sin x, cos x, tan x, eˣ, ln x\n- Chain rule, product rule, quotient rule\n- Tangent and normal lines\n- Increasing/decreasing functions, local maxima and minima\n- Points of inflexion\n- Optimisation problems\n- Indefinite integrals: ∫xⁿ dx, ∫sin x dx, ∫cos x dx, ∫eˣ dx, ∫(1/x) dx\n- Integration by inspection and substitution\n- Definite integrals: area under curves, area between curves\n- Kinematics: displacement, velocity, acceleration",
    tags: ["calculus", "ib-sl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Mathematics AA", grade: "HL", sortOrder: 10,
    title: "Topic 5: Calculus (HL Extensions)",
    content: "**Additional HL Content:**\n\n- Continuity and differentiability\n- Derivatives of arcsin x, arccos x, arctan x\n- Implicit differentiation\n- Related rates of change\n- Integration by parts: ∫u dv = uv − ∫v du\n- Integration using partial fractions\n- Volumes of revolution about x-axis and y-axis\n- First-order differential equations: separable variables, homogeneous, integrating factor\n- Maclaurin series for eˣ, sin x, cos x, ln(1+x), (1+x)ᵖ\n- L'Hôpital's rule for limits\n- Improper integrals\n- Euler's method for numerical solutions of differential equations",
    tags: ["calculus", "ib-hl"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IB CHEMISTRY (SL / HL) — New 2024 Syllabus
// Structure 1-3 + Reactivity 1-3
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const IB_CHEMISTRY_SEED_DATA = [
  // STRUCTURE
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 1,
    title: "Structure 1: Models of the Particulate Nature of Matter",
    content: "**S1.1 — Introduction to the particulate nature of matter**\n- Elements, compounds and mixtures\n- Kinetic molecular theory\n- Temperature and kinetic energy\n- States of matter and phase transitions\n\n**S1.2 — The nuclear atom**\n- Protons, neutrons, electrons\n- Atomic number, mass number\n- Isotopes and relative atomic mass\n\n**S1.3 — Electron configurations**\n- Emission spectra and energy levels\n- Electron configuration (sub-shells: s, p, d)\n- Hydrogen emission spectrum\n\n**S1.4 — Counting particles by mass: The mole**\n- Avogadro constant (6.02 × 10²³)\n- Molar mass, relative formula mass\n- Empirical and molecular formulae\n- Mole calculations and stoichiometry\n\n**S1.5 — Ideal gases**\n- The ideal gas equation: PV = nRT\n- Deviations from ideal behaviour",
    tags: ["structure", "atomic-theory", "mole"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 2,
    title: "Structure 2: Models of Bonding and Structure",
    content: "**S2.1 — The ionic model**\n- Formation of ionic compounds\n- Lattice structures and properties\n- Trends in ionic radii\n\n**S2.2 — The covalent model**\n- Single, double, triple covalent bonds\n- Lewis (electron dot) structures\n- VSEPR theory: predicting molecular shapes\n- Bond polarity and molecular polarity\n- Intermolecular forces: London dispersion, dipole-dipole, hydrogen bonding\n- Covalent network structures (diamond, graphite, SiO₂)\n- Chromatography\n\n**S2.3 — The metallic model**\n- Metallic bonding: sea of delocalised electrons\n- Properties of metals\n- Alloys\n\n**S2.4 — From models to materials**\n- Relationship between structure, bonding and properties",
    tags: ["bonding", "structure", "intermolecular-forces"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "HL", sortOrder: 3,
    title: "Structure 2: Bonding — HL Extensions",
    content: "**Additional HL Content:**\n\n- Resonance structures and delocalisation\n- Benzene structure and delocalisation\n- Expanded octet and exceptions to octet rule\n- Formal charge and most stable Lewis structures\n- Sigma (σ) and pi (π) bonds\n- Hybridisation: sp, sp², sp³",
    tags: ["bonding", "ib-hl", "hybridisation"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 4,
    title: "Structure 3: Classification of Matter",
    content: "**S3.1 — The periodic table: Classification of elements**\n- Structure of the periodic table (groups, periods)\n- Electron configuration and trends\n- Periodicity: atomic radius, ionisation energy, electronegativity, electron affinity\n- Metallic and non-metallic oxides\n- Oxidation states\n\n**S3.2 — Functional groups: Classification of organic compounds**\n- Representation: structural, condensed, skeletal formulae\n- Homologous series\n- Functional groups: alkanes, alkenes, alcohols, halogenoalkanes, aldehydes, ketones, carboxylic acids, esters, amines, amides\n- IUPAC nomenclature\n- Structural isomerism",
    tags: ["periodic-table", "organic-chemistry", "nomenclature"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "HL", sortOrder: 5,
    title: "Structure 3: Classification — HL Extensions",
    content: "**Additional HL Content:**\n\n- Discontinuities in ionisation energy trends (evidence for sub-shells)\n- d-block elements: variable oxidation states, coloured compounds\n- Transition metal complexes\n- Stereoisomerism: geometric (cis-trans) and optical isomers\n- Mass spectrometry and spectroscopic identification (IR, ¹H NMR)",
    tags: ["periodic-table", "organic-chemistry", "ib-hl", "spectroscopy"] },

  // REACTIVITY
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 6,
    title: "Reactivity 1: What Drives Chemical Reactions?",
    content: "**R1.1 — Measuring enthalpy changes**\n- Exothermic and endothermic reactions\n- Enthalpy profile diagrams\n- Calorimetry and specific heat capacity: q = mcΔT\n- Standard enthalpy of combustion, formation, neutralisation\n\n**R1.2 — Energy cycles in reactions**\n- Bond enthalpies (average)\n- Hess's Law and enthalpy cycle calculations\n\n**R1.3 — Energy from fuels**\n- Combustion of hydrocarbons\n- Incomplete combustion and carbon monoxide\n- Fossil fuels and environmental impact",
    tags: ["energetics", "enthalpy", "hess-law"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "HL", sortOrder: 7,
    title: "Reactivity 1: Energetics — HL Extensions",
    content: "**R1.4 — Entropy and spontaneity (HL Only)**\n\n- Entropy (S): measure of disorder\n- Standard entropy change ΔS°\n- Gibbs free energy: ΔG° = ΔH° − TΔS°\n- Spontaneity and sign of ΔG\n- Born-Haber cycles for ionic compounds\n- Lattice enthalpy and enthalpy of hydration\n- Standard enthalpy of solution\n- Relationship between ΔG and equilibrium constant K",
    tags: ["energetics", "entropy", "gibbs", "ib-hl"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 8,
    title: "Reactivity 2: How Much, How Fast, and How Far?",
    content: "**R2.1 — The amount of chemical change**\n- Balanced equations and stoichiometry\n- Limiting and excess reagents\n- Percentage yield and atom economy\n- Concentration: mol dm⁻³\n- Avogadro's law and molar volume of gases\n\n**R2.2 — How fast? The rate of chemical change**\n- Rate of reaction and measuring rates\n- Factors: concentration, temperature, surface area, catalysts\n- Collision theory and activation energy\n- Maxwell-Boltzmann distribution\n\n**R2.3 — How far? The extent of chemical change**\n- Dynamic equilibrium\n- Equilibrium constant Kc\n- Le Chatelier's principle\n- Position of equilibrium and reaction quotient Q",
    tags: ["stoichiometry", "kinetics", "equilibrium"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "HL", sortOrder: 9,
    title: "Reactivity 2: Quantitative Chemistry — HL Extensions",
    content: "**Additional HL Content:**\n\n- Rate expressions and order of reaction\n- Determining rate equations from experimental data\n- Rate constant k and Arrhenius equation: k = Ae^(−Ea/RT)\n- Kp for gaseous equilibria (partial pressures)\n- Relationship between K and ΔG°\n- Buffer solutions: acidic and basic\n- Buffer calculations and Henderson-Hasselbalch equation\n- pH curves and indicators for acid-base titrations",
    tags: ["kinetics", "equilibrium", "ib-hl", "buffers"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "SL", sortOrder: 10,
    title: "Reactivity 3: What Are the Mechanisms of Chemical Change?",
    content: "**R3.1 — Proton transfer reactions**\n- Brønsted-Lowry acids and bases\n- pH scale and calculating pH: pH = −log[H⁺]\n- Strong vs weak acids and bases\n- Acid-base reactions and neutralisation\n\n**R3.2 — Electron transfer reactions**\n- Oxidation and reduction (OIL RIG)\n- Oxidation states\n- Redox equations (half-equations)\n- Reactivity series and displacement reactions\n- Electrochemical cells\n- Standard electrode potentials (E°)\n\n**R3.3 — Electron sharing reactions**\n- Free-radical substitution (alkanes + halogens)\n- Electrophilic addition (alkenes)\n- Nucleophilic substitution (halogenoalkanes: SN1 and SN2)\n\n**R3.4 — Electron-pair sharing reactions**\n- Addition reactions of alkenes\n- Oxidation and reduction of organic molecules\n- Condensation and hydrolysis (esters, amides)",
    tags: ["acids-bases", "redox", "organic-mechanisms"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IB", subject: "Chemistry", grade: "HL", sortOrder: 11,
    title: "Reactivity 3: Mechanisms — HL Extensions",
    content: "**Additional HL Content:**\n\n- Ka, Kb, Kw and pKa calculations\n- pH of weak acids and bases\n- Electrolysis: quantitative aspects (Faraday's laws)\n- Fuel cells and rechargeable batteries\n- Nucleophilic substitution: SN1 vs SN2 mechanisms in detail\n- Elimination reactions (E1, E2)\n- Electrophilic substitution of benzene\n- Retrosynthesis and multi-step organic synthesis\n- Reaction pathways and functional group interconversions",
    tags: ["acids-bases", "organic-mechanisms", "ib-hl", "synthesis"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IGCSE PHYSICS (Cambridge 0625)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const IGCSE_PHYSICS_SEED_DATA = [
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 1,
    title: "Topic 1: Motion, Forces and Energy",
    content: "**1.1 Physical quantities and measurement techniques**\n- Scalars and vectors\n- Speed, velocity, acceleration\n- Distance-time and speed-time graphs\n\n**1.2 Motion**\n- Uniform and non-uniform motion\n- Equations of motion (v = u + at, s = ut + ½at²)\n- Acceleration of free-fall (g ≈ 10 m/s²)\n\n**1.3 Mass and weight**\n- Gravitational field strength: W = mg\n\n**1.4 Density**\n- Density = mass / volume\n- Measuring density of regular and irregular objects\n\n**1.5 Forces**\n- Types of forces: gravity, friction, normal, tension\n- Resultant force and Newton's first law\n- Hooke's law: F = kx (limit of proportionality)\n\n**1.6 Momentum**\n- Momentum = mass × velocity\n- Conservation of momentum in collisions\n- Impulse: F × t = Δp\n\n**1.7 Energy, work and power**\n- KE = ½mv², GPE = mgh\n- Work done = force × distance\n- Power = energy / time, Efficiency = useful output / total input\n\n**1.8 Pressure**\n- Pressure = force / area\n- Pressure in liquids: P = ρgh",
    tags: ["motion", "forces", "energy", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 2,
    title: "Topic 2: Thermal Physics",
    content: "**2.1 Kinetic particle model of matter**\n- States of matter: solid, liquid, gas\n- Particle arrangement, motion, and energy\n- Brownian motion as evidence for particles\n- Evaporation and boiling\n- Factors affecting rate of evaporation\n\n**2.2 Thermal properties and temperature**\n- Thermal expansion of solids, liquids, and gases\n- Measurement of temperature (thermometers)\n- Thermal capacity: Q = mcΔθ\n- Specific latent heat: Q = mL\n- Heating and cooling curves\n\n**2.3 Transfer of thermal energy**\n- Conduction: molecular vibration, free electrons in metals\n- Convection: density currents in fluids\n- Radiation: emission and absorption of infrared\n- Vacuum flasks and applications\n- Factors affecting rate of thermal energy transfer",
    tags: ["thermal-physics", "heat-transfer", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 3,
    title: "Topic 3: Waves",
    content: "**3.1 General properties of waves**\n- Transverse and longitudinal waves\n- Wave terms: amplitude, frequency, wavelength, period\n- Wave equation: v = f × λ\n- Wavefronts and ray diagrams\n\n**3.2 Light**\n- Reflection: law of reflection, plane mirrors\n- Refraction: Snell's law (n₁ sin θ₁ = n₂ sin θ₂)\n- Total internal reflection and critical angle\n- Optical fibres and applications\n- Thin converging lenses: focal length, images\n- Ray diagrams for converging lenses\n- Magnification = image height / object height\n- Dispersion of white light through a prism\n\n**3.3 Electromagnetic spectrum**\n- Order: radio, microwave, infrared, visible, UV, X-ray, gamma\n- Properties, uses, and dangers of each type\n- Speed of electromagnetic waves: c = 3 × 10⁸ m/s\n\n**3.4 Sound**\n- Longitudinal nature of sound waves\n- Reflection (echoes), refraction of sound\n- Speed of sound in different media\n- Frequency range of human hearing (20 Hz – 20 000 Hz)\n- Ultrasound applications",
    tags: ["waves", "light", "sound", "electromagnetic-spectrum"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 4,
    title: "Topic 4: Electricity and Magnetism",
    content: "**4.1 Simple phenomena of magnetism**\n- Permanent magnets: poles, magnetic fields\n- Hard and soft magnetic materials\n- Magnetic field patterns (bar magnets)\n\n**4.2 Electrical quantities**\n- Electric charge, conductors and insulators\n- Current I = Q/t\n- Electromotive force (e.m.f.) and potential difference (p.d.)\n- Resistance: V = IR\n- Resistivity and factors affecting resistance\n- I-V characteristics: resistors, filament lamps, diodes\n\n**4.3 Electric circuits**\n- Series and parallel circuits\n- Combined resistance calculations\n- Potential dividers\n- Thermistors and LDRs in circuits\n- Relays and reed switches\n\n**4.4 Electrical safety**\n- Fuses and circuit breakers\n- Earthing and double insulation\n- Power: P = IV = I²R = V²/R\n- Energy: E = IVt (kWh calculations)\n\n**4.5 Electromagnetic effects**\n- Electromagnetic induction: Faraday's law, Lenz's law\n- a.c. generator and d.c. motor\n- Transformers: Vₛ/Vₚ = Nₛ/Nₚ\n- Transmission of electrical energy\n- Rectification (half-wave, full-wave)",
    tags: ["electricity", "magnetism", "circuits", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 5,
    title: "Topic 5: Nuclear Physics",
    content: "**5.1 The nuclear model of the atom**\n- Rutherford scattering experiment\n- Protons, neutrons, electrons\n- Nuclide notation: ᴬ_Z X\n- Isotopes\n\n**5.2 Radioactivity**\n- Alpha (α), beta (β), gamma (γ) radiation\n- Properties and penetrating powers\n- Deflection in electric and magnetic fields\n- Background radiation\n- Radioactive decay equations\n- Half-life and decay curves\n- Safety precautions when handling radioactive sources\n\n**5.3 Nuclear fission and fusion**\n- Nuclear fission: splitting heavy nuclei (chain reactions)\n- Nuclear fusion: combining light nuclei\n- Nuclear power stations\n- E = mc² (qualitative understanding)",
    tags: ["nuclear-physics", "radioactivity", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Physics", grade: "Core", sortOrder: 6,
    title: "Topic 6: Space Physics",
    content: "**6.1 Earth and the Solar System**\n- The Solar System: planets, dwarf planets, asteroids, comets\n- Orbital motion: gravity provides centripetal force\n- Orbital speed and distance from star\n\n**6.2 Stars and the Universe**\n- The Sun as a star: hydrogen fusion\n- Life cycle of a star: nebula → main sequence → red giant → white dwarf / supernova → neutron star / black hole\n- The Hertzsprung-Russell diagram (qualitative)\n- Red-shift and the expansion of the Universe\n- The Big Bang theory\n- Cosmic microwave background radiation (CMBR) as evidence",
    tags: ["space-physics", "astronomy", "cambridge-igcse"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IGCSE MATHEMATICS (Cambridge 0580)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const IGCSE_MATH_SEED_DATA = [
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 1,
    title: "Topic 1: Number",
    content: "- Natural numbers, integers, prime numbers, square and cube numbers\n- Rational and irrational numbers; surds (Extended)\n- HCF and LCM\n- Fractions, decimals, percentages and conversions\n- Ordering operations (BIDMAS)\n- Standard form (scientific notation): a × 10ⁿ\n- Ratio, proportion and rates\n- Percentage increase/decrease, reverse percentages\n- Simple and compound interest\n- Speed, distance, time problems\n- Estimation and limits of accuracy (upper and lower bounds)\n- Set notation and Venn diagrams",
    tags: ["number", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 2,
    title: "Topic 2: Algebra and Graphs",
    content: "- Algebraic notation, expressions, and simplification\n- Substitution and evaluation\n- Expansion of brackets and factorisation\n- Algebraic fractions (Extended)\n- Indices (laws of exponents)\n- Solving linear equations and inequalities\n- Simultaneous equations (linear; one linear + one non-linear for Extended)\n- Quadratic equations: factorisation, formula, completing the square\n- Sequences: nth term of linear and quadratic sequences\n- Direct and inverse proportion\n- Functions: f(x) notation, domain, range, composite, inverse (Extended)\n- Graphs: linear, quadratic, cubic, reciprocal, exponential\n- Gradient of a curve (tangent method, Extended)\n- Graphical solution of equations",
    tags: ["algebra", "graphs", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 3,
    title: "Topic 3: Coordinate Geometry",
    content: "- Cartesian coordinates in two dimensions\n- Gradient of a straight line: m = (y₂ − y₁) / (x₂ − x₁)\n- Equation of a straight line: y = mx + c\n- Midpoint of a line segment\n- Length of a line segment (distance formula)\n- Gradient and equation of parallel lines\n- Gradient and equation of perpendicular lines (Extended)",
    tags: ["coordinate-geometry", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 4,
    title: "Topic 4: Geometry",
    content: "- Angles: at a point, on a straight line, vertically opposite\n- Parallel lines and transversals (alternate, corresponding, co-interior)\n- Angle properties of triangles and quadrilaterals\n- Congruent triangles: SSS, SAS, ASA, RHS\n- Similar figures: length, area, volume ratios\n- Properties of quadrilaterals (parallelogram, rhombus, rectangle, square, trapezium, kite)\n- Polygons: interior and exterior angles\n- Symmetry: line and rotational\n- Circle theorems (Extended):\n  - Angle at centre = 2 × angle at circumference\n  - Angles in the same segment\n  - Angle in a semicircle\n  - Cyclic quadrilateral (opposite angles sum to 180°)\n  - Tangent-radius, alternate segment theorem",
    tags: ["geometry", "circle-theorems", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 5,
    title: "Topic 5: Mensuration",
    content: "- Perimeter and area: triangle, rectangle, parallelogram, trapezium, circle\n- Arc length and sector area\n- Surface area and volume of 3D shapes:\n  - Cuboid, prism, cylinder\n  - Sphere: A = 4πr², V = (4/3)πr³\n  - Cone: A = πrl (curved), V = (1/3)πr²h\n  - Pyramid: V = (1/3) × base area × h\n- Compound shapes and solids\n- Units: conversions between cm², m², cm³, litres",
    tags: ["mensuration", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 6,
    title: "Topic 6: Trigonometry",
    content: "- Pythagoras' theorem in 2D and 3D\n- Right-angled trigonometry: sin, cos, tan (SOH-CAH-TOA)\n- Exact values: sin/cos/tan of 0°, 30°, 45°, 60°, 90°\n- Sine rule: a/sin A = b/sin B = c/sin C (including ambiguous case, Extended)\n- Cosine rule: a² = b² + c² − 2bc cos A\n- Area of a triangle: A = ½ab sin C\n- Bearings and angle of elevation/depression\n- 3D trigonometry (Extended)\n- Trigonometric graphs: sin x, cos x, tan x",
    tags: ["trigonometry", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 7,
    title: "Topic 7: Transformations and Vectors",
    content: "- Transformations:\n  - Reflection: axis of reflection\n  - Rotation: centre, angle, direction\n  - Translation: column vector notation\n  - Enlargement: centre and scale factor (negative for Extended)\n- Combined transformations\n- Vectors:\n  - Notation: column vectors and position vectors\n  - Magnitude of a vector: |v| = √(x² + y²)\n  - Addition, subtraction, scalar multiplication\n  - Parallel vectors and applications with geometry",
    tags: ["transformations", "vectors", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 8,
    title: "Topic 8: Probability",
    content: "- Probability scale: 0 to 1\n- Theoretical and experimental probability\n- Expected frequency\n- Relative frequency and long-run estimation\n- Combined events:\n  - Two-way tables\n  - Tree diagrams with replacement and without\n  - Venn diagrams for combined events\n- Independent and dependent (conditional) events\n- P(A or B), P(A and B) rules",
    tags: ["probability", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 9,
    title: "Topic 9: Statistics",
    content: "- Data classification: qualitative, quantitative, discrete, continuous\n- Tally charts and frequency tables (ungrouped and grouped)\n- Mean, median, mode (for grouped and ungrouped data)\n- Range and interquartile range\n- Stem-and-leaf diagrams\n- Cumulative frequency tables and curves\n- Median and quartiles from cumulative frequency\n- Histograms with equal and unequal class intervals (frequency density)\n- Scatter diagrams and correlation\n- Line of best fit and interpolation\n- Pie charts and bar charts",
    tags: ["statistics", "cambridge-igcse"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "IGCSE", subject: "Mathematics", grade: "Extended", sortOrder: 10,
    title: "Topic 10: Matrices (Extended Only)",
    content: "- Order of a matrix\n- Addition and subtraction of matrices\n- Scalar multiplication\n- Matrix multiplication (up to 2×2 × 2×2)\n- Determinant of a 2×2 matrix: ad − bc\n- Inverse of a 2×2 matrix\n- Identity matrix I\n- Solving simultaneous equations using inverse matrices\n- Transformations as matrices (Extended only)",
    tags: ["matrices", "cambridge-igcse", "extended"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// A-LEVEL BIOLOGY (Cambridge 9700)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const A_LEVEL_BIOLOGY_SEED_DATA = [
  // AS LEVEL (Topics 1-11)
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 1,
    title: "Topic 1: Cell Structure",
    content: "**AS Level**\n\n- Cell theory and cell size\n- Light microscopy and electron microscopy (TEM, SEM)\n- Magnification and resolution\n- Prokaryotic cells (bacteria) vs eukaryotic cells\n- Ultrastructure: nucleus, ER, Golgi, mitochondria, chloroplasts, ribosomes, lysosomes, centrioles\n- Cell fractionation and differential centrifugation\n- Specimen preparation: staining techniques",
    tags: ["cell-biology", "as-level", "microscopy"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 2,
    title: "Topic 2: Biological Molecules",
    content: "**AS Level**\n\n- Water: hydrogen bonding, high specific heat capacity, solvent properties\n- Carbohydrates: monosaccharides (glucose), disaccharides (maltose, sucrose, lactose), polysaccharides (starch, glycogen, cellulose)\n- Lipids: triglycerides, phospholipids, cholesterol\n- Proteins: amino acids, peptide bonds, primary to quaternary structure\n- Enzymes: active site, lock-and-key vs induced fit model\n- Food tests: Benedict's, iodine, biuret, emulsion (ethanol)\n- Chromatography (Rᶠ values)",
    tags: ["biological-molecules", "as-level", "enzymes"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 3,
    title: "Topic 3: Enzymes",
    content: "**AS Level**\n\n- Enzymes as biological catalysts: lowering activation energy\n- Enzyme-substrate complex\n- Factors affecting enzyme activity: temperature, pH, substrate concentration, enzyme concentration\n- Vmax and Km (Michaelis-Menten kinetics)\n- Competitive and non-competitive inhibition\n- Immobilised enzymes and their industrial applications\n- Intracellular and extracellular enzymes",
    tags: ["enzymes", "as-level", "kinetics"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 4,
    title: "Topic 4: Cell Membranes and Transport",
    content: "**AS Level**\n\n- Fluid mosaic model: phospholipid bilayer, proteins, cholesterol, glycolipids, glycoproteins\n- Movement across membranes:\n  - Diffusion and facilitated diffusion (channel and carrier proteins)\n  - Osmosis: water potential (Ψ), solute potential (Ψₛ), pressure potential (Ψₚ)\n  - Active transport: carrier proteins, ATP requirement\n- Endocytosis and exocytosis\n- Cell signalling and receptor proteins\n- Practical: effect of solute concentration on plant tissue",
    tags: ["cell-membranes", "transport", "as-level", "osmosis"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 5,
    title: "Topic 5: The Mitotic Cell Cycle",
    content: "**AS Level**\n\n- Cell cycle: interphase (G1, S, G2) and mitosis\n- DNA replication: semi-conservative mechanism\n- Mitosis stages: prophase, metaphase, anaphase, telophase\n- Cytokinesis in animal and plant cells\n- Significance of mitosis: growth, repair, asexual reproduction\n- Stem cells: totipotent, pluripotent, multipotent\n- Cancer: uncontrolled cell division, role of oncogenes and tumour suppressor genes",
    tags: ["cell-cycle", "mitosis", "as-level", "dna-replication"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 6,
    title: "Topic 6: Nucleic Acids and Protein Synthesis",
    content: "**AS Level**\n\n- DNA structure: double helix, antiparallel, complementary base pairing (A-T, G-C)\n- RNA structure: mRNA, tRNA, rRNA\n- Genes and the genetic code: triplet, degenerate, universal, non-overlapping\n- Transcription: RNA polymerase, mRNA processing\n- Translation: ribosome, tRNA, codons, anticodons, polypeptide formation\n- Mutations: substitution, insertion, deletion, and their effects\n- Gene expression and regulation",
    tags: ["nucleic-acids", "protein-synthesis", "as-level", "genetics"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 7,
    title: "Topic 7: Transport in Plants",
    content: "**AS Level**\n\n- Xylem structure and function: lignified, dead cells, water and mineral transport\n- Transpiration: cohesion-tension theory, adhesion\n- Factors affecting transpiration rate: light, temperature, humidity, wind\n- Measuring transpiration: potometer\n- Translocation: phloem sieve tubes, companion cells\n- Mass flow hypothesis (Münch hypothesis)\n- Sources and sinks in translocation\n- Root structure: root hairs, cortex, endodermis, Casparian strip",
    tags: ["transport-plants", "xylem", "phloem", "as-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 8,
    title: "Topic 8: Transport in Mammals",
    content: "**AS Level**\n\n- Circulatory system: double circulation (pulmonary and systemic)\n- Structure of the heart: four chambers, valves, coronary arteries\n- Cardiac cycle: systole, diastole, pressure changes\n- Control of heart rate: SA node, AVN, Purkyne fibres\n- Blood vessels: arteries, veins, capillaries — structure and function\n- Blood: plasma, red blood cells, white blood cells, platelets\n- Haemoglobin: oxygen dissociation curve, Bohr effect\n- Tissue fluid formation and lymphatic system",
    tags: ["transport-mammals", "heart", "blood", "as-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 9,
    title: "Topic 9: Gas Exchange",
    content: "**AS Level**\n\n- Gas exchange surfaces: large surface area, thin, moist, good blood supply\n- Human gas exchange system: trachea, bronchi, bronchioles, alveoli\n- Ventilation mechanism: diaphragm, intercostal muscles, pressure changes\n- Gas exchange in alveoli: diffusion gradients\n- Smoking and disease: chronic bronchitis, emphysema, lung cancer\n- Gas exchange in insects: tracheal system, spiracles\n- Gas exchange in fish: counter-current flow in gills",
    tags: ["gas-exchange", "lungs", "as-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 10,
    title: "Topic 10: Infectious Diseases",
    content: "**AS Level**\n\n- Pathogens: bacteria, viruses, fungi, protoctists\n- Transmission of infectious diseases: direct contact, airborne, waterborne, vectors\n- Examples: cholera (Vibrio cholerae), TB (Mycobacterium), malaria (Plasmodium), HIV/AIDS\n- Non-specific defences: skin, mucus, stomach acid, phagocytosis\n- Antibiotics: mechanism of action, antibiotic resistance (MRSA)\n- Global impact of infectious diseases\n- Preventing spread: hygiene, vaccination, vector control",
    tags: ["infectious-diseases", "pathogens", "as-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 11,
    title: "Topic 11: Immunity",
    content: "**AS Level**\n\n- Immune response: specific and non-specific\n- Phagocytes: neutrophils and macrophages (phagocytosis, antigen presentation)\n- Lymphocytes: T cells (helper, killer, memory) and B cells (plasma cells, memory cells)\n- Antibodies: structure (variable and constant regions), functions (agglutination, neutralisation)\n- Cell-mediated immunity and humoral immunity\n- Active immunity: natural (infection) and artificial (vaccination)\n- Passive immunity: natural (breast milk) and artificial (antibody injection)\n- Vaccination programmes and herd immunity\n- Autoimmune diseases and allergies",
    tags: ["immunity", "antibodies", "vaccination", "as-level"] },

  // A2 LEVEL (Topics 12-19)
  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 12,
    title: "Topic 12: Energy and Respiration",
    content: "**A2 Level**\n\n- ATP as the universal energy currency\n- Aerobic respiration:\n  - Glycolysis (cytoplasm): glucose → 2 pyruvate, 2 ATP, 2 NADH\n  - Link reaction: pyruvate → acetyl CoA + CO₂\n  - Krebs cycle (matrix): 2 ATP, reduced NAD/FAD\n  - Oxidative phosphorylation (inner membrane): electron transport chain, chemiosmosis, 26-28 ATP\n- Anaerobic respiration:\n  - Lactate pathway (animals)\n  - Ethanol pathway (yeast)\n- Respiratory substrates: RQ = CO₂ produced / O₂ consumed\n- Respirometers and measuring respiratory rate",
    tags: ["respiration", "atp", "a2-level", "biochemistry"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 13,
    title: "Topic 13: Photosynthesis",
    content: "**A2 Level**\n\n- Chloroplast structure: thylakoids, grana, stroma, lamellae\n- Photosynthetic pigments: chlorophyll a, chlorophyll b, carotenoids\n- Light-dependent reactions (thylakoid membranes):\n  - Photosystems I and II\n  - Photolysis of water\n  - Non-cyclic and cyclic photophosphorylation\n  - Production of ATP, reduced NADP, O₂\n- Light-independent reactions (Calvin cycle, stroma):\n  - Carbon fixation: CO₂ + RuBP → GP (catalysed by RuBisCO)\n  - Reduction: GP → G3P (TP) using ATP and reduced NADP\n  - Regeneration of RuBP\n- Limiting factors: light intensity, CO₂ concentration, temperature\n- C3 and C4 plants (overview)",
    tags: ["photosynthesis", "calvin-cycle", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 14,
    title: "Topic 14: Homeostasis",
    content: "**A2 Level**\n\n- Homeostasis: maintaining a constant internal environment\n- Negative feedback and positive feedback mechanisms\n- Thermoregulation:\n  - Endotherms vs ectotherms\n  - Role of hypothalamus, vasodilation, vasoconstriction, sweating, shivering\n- Blood glucose regulation:\n  - Insulin (β-cells): lowers blood glucose (glycogenesis, increased uptake)\n  - Glucagon (α-cells): raises blood glucose (glycogenolysis, gluconeogenesis)\n  - Diabetes mellitus: Type 1 (autoimmune) and Type 2 (insulin resistance)\n- Kidney and excretion:\n  - Nephron structure: Bowman's capsule, PCT, loop of Henle, DCT, collecting duct\n  - Ultrafiltration and selective reabsorption\n  - Osmoregulation: ADH and water reabsorption\n  - Counter-current multiplier in loop of Henle",
    tags: ["homeostasis", "kidney", "blood-glucose", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 15,
    title: "Topic 15: Control and Coordination",
    content: "**A2 Level**\n\n- Nervous system: sensory, relay, motor neurones\n- Structure of a myelinated neurone\n- Resting potential and action potential\n- Saltatory conduction along myelinated nerve fibres\n- Synaptic transmission: neurotransmitters (acetylcholine), synaptic cleft\n- Reflex arcs: receptor → sensory → relay → motor → effector\n- Endocrine system: hormones and target organs\n- Comparison: nervous vs hormonal communication\n- Plant growth regulators: auxin, gibberellin\n- Tropisms: phototropism, gravitropism\n- Commercial applications of plant hormones",
    tags: ["nervous-system", "hormones", "synapses", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 16,
    title: "Topic 16: Inheritance",
    content: "**A2 Level**\n\n- Meiosis: two divisions, crossing over, independent assortment, genetic variation\n- Comparison of mitosis and meiosis\n- Mendelian genetics: monohybrid and dihybrid crosses\n- Genotype, phenotype, dominant, recessive, codominant, multiple alleles\n- Sex linkage: X-linked inheritance (e.g., haemophilia, colour blindness)\n- Autosomal linkage and recombination\n- Chi-squared (χ²) test for goodness of fit\n- Epistasis: complementary and inhibiting genes\n- Continuous and discontinuous variation\n- Polygenic inheritance",
    tags: ["inheritance", "genetics", "meiosis", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 17,
    title: "Topic 17: Selection and Evolution",
    content: "**A2 Level**\n\n- Variation: genetic and environmental\n- Natural selection: overproduction, variation, competition, survival of the fittest\n- Types of selection: stabilising, directional, disruptive\n- Speciation: allopatric and sympatric\n- Reproductive isolation mechanisms\n- Evolution of antibiotic resistance in bacteria\n- Hardy-Weinberg principle: p² + 2pq + q² = 1\n- Allele frequency calculations\n- Genetic drift and gene flow\n- Artificial selection and selective breeding",
    tags: ["evolution", "natural-selection", "speciation", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "A2", sortOrder: 18,
    title: "Topic 18: Biodiversity, Classification and Conservation",
    content: "**A2 Level**\n\n- Biodiversity: species diversity, habitat diversity, genetic diversity\n- Simpson's index of diversity: D = 1 − Σ(n/N)²\n- Classification: domain, kingdom, phylum, class, order, family, genus, species\n- Three-domain system: Bacteria, Archaea, Eukarya\n- Five kingdoms: Prokaryotae, Protoctista, Fungi, Plantae, Animalia\n- Binomial nomenclature\n- Phylogenetics and cladograms\n- Molecular evidence for evolution: cytochrome c, DNA/RNA sequences\n- Conservation: in-situ (national parks, reserves), ex-situ (zoos, seed banks)\n- Sustainability and human impact on biodiversity",
    tags: ["biodiversity", "classification", "conservation", "a2-level"] },

  { type: ResourceType.Syllabus, vertical: "k12" as const, curriculum: "A-Level", subject: "Biology", grade: "AS", sortOrder: 19,
    title: "Topic 19: Genetic Technology",
    content: "**A2 Level**\n\n- Genetic engineering: restriction enzymes, ligases, vectors (plasmids)\n- Recombinant DNA technology\n- PCR (Polymerase Chain Reaction): denaturation, annealing, extension\n- Gel electrophoresis and DNA profiling\n- Gene cloning: transformation of bacteria\n- Applications: GM organisms, gene therapy, insulin production\n- Ethical, social and environmental considerations of genetic technology\n- CRISPR-Cas9 gene editing (overview)\n- Bioinformatics and genome sequencing projects",
    tags: ["genetic-technology", "pcr", "genetic-engineering", "a2-level"] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Combined export for easy seeding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ALL_ADDITIONAL_SEED_DATA = [
  ...IB_MATH_AA_SEED_DATA,
  ...IB_CHEMISTRY_SEED_DATA,
  ...IGCSE_PHYSICS_SEED_DATA,
  ...IGCSE_MATH_SEED_DATA,
  ...A_LEVEL_BIOLOGY_SEED_DATA,
];
