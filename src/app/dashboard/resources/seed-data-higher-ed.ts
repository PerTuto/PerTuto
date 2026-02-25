import { ResourceType } from "@/lib/types";

/**
 * Higher Education Seed Data
 * ═══════════════════════════════════════
 * University Mathematics, Statistics, Research Methods, Academic Writing
 * ═══════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UNIVERSITY MATHEMATICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const HIGHER_ED_SEED_DATA = [
  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 1,
    title: "Calculus I: Limits & Derivatives",
    content: "- Limits and continuity\n- Definition of the derivative (first principles)\n- Differentiation rules: power, product, quotient, chain\n- Derivatives of trigonometric, exponential, and logarithmic functions\n- Implicit differentiation and related rates\n- Applications: curve sketching, optimisation, L'Hôpital's rule\n- Mean Value Theorem and Rolle's Theorem",
    tags: ["calculus", "derivatives", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 2,
    title: "Calculus II: Integration & Series",
    content: "- Definite and indefinite integrals\n- Fundamental Theorem of Calculus\n- Techniques: substitution, integration by parts, partial fractions, trig substitution\n- Improper integrals\n- Applications: area, volume of revolution, arc length, work\n- Sequences and infinite series\n- Convergence tests: ratio, root, comparison, integral\n- Taylor and Maclaurin series\n- Power series and radius of convergence",
    tags: ["calculus", "integration", "series", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 3,
    title: "Calculus III: Multivariable Calculus",
    content: "- Vectors in 2D and 3D, dot and cross products\n- Vector-valued functions and space curves\n- Partial derivatives and the gradient vector\n- Directional derivatives\n- Multiple integrals: double and triple integrals\n- Change of variables: polar, cylindrical, spherical coordinates\n- Line integrals and surface integrals\n- Green's Theorem, Stokes' Theorem, Divergence Theorem",
    tags: ["multivariable-calculus", "vectors", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 4,
    title: "Linear Algebra",
    content: "- Systems of linear equations and Gaussian elimination\n- Matrices: operations, inverses, transposes\n- Determinants and their properties\n- Vector spaces and subspaces\n- Linear independence, basis, dimension\n- Linear transformations and their matrices\n- Eigenvalues and eigenvectors\n- Diagonalisation\n- Inner product spaces and orthogonality\n- Gram-Schmidt process\n- Applications: Markov chains, least squares, image compression",
    tags: ["linear-algebra", "eigenvalues", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 5,
    title: "Differential Equations",
    content: "- First-order ODEs: separable, exact, linear, Bernoulli\n- Second-order linear ODEs: homogeneous and non-homogeneous\n- Method of undetermined coefficients\n- Variation of parameters\n- Laplace transforms\n- Systems of differential equations\n- Phase portraits and stability analysis\n- Introduction to partial differential equations (heat, wave, Laplace)\n- Fourier series\n- Boundary value problems",
    tags: ["differential-equations", "laplace", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Mathematics", grade: "Undergraduate", sortOrder: 6,
    title: "Discrete Mathematics",
    content: "- Logic: propositional and predicate logic, truth tables\n- Proof techniques: direct, contrapositive, contradiction, induction\n- Set theory: operations, power sets, Cartesian products\n- Relations: equivalence relations, partial orders\n- Functions: injective, surjective, bijective\n- Counting: permutations, combinations, pigeonhole principle\n- Graph theory: paths, cycles, trees, Euler/Hamilton circuits\n- Recurrence relations and generating functions\n- Modular arithmetic and number theory basics",
    tags: ["discrete-math", "logic", "graph-theory", "undergraduate"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATISTICS & PROBABILITY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Statistics", grade: "Undergraduate", sortOrder: 1,
    title: "Descriptive Statistics & Data Visualisation",
    content: "- Types of data: categorical, numerical, ordinal\n- Measures of central tendency: mean, median, mode\n- Measures of spread: variance, standard deviation, IQR\n- Data visualisation: histograms, box plots, scatter plots, heat maps\n- Skewness and kurtosis\n- Outlier detection (IQR method, Z-scores)\n- Correlation: Pearson's r, Spearman's rank",
    tags: ["descriptive-stats", "data-viz", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Statistics", grade: "Undergraduate", sortOrder: 2,
    title: "Probability Theory",
    content: "- Sample spaces, events, axioms of probability\n- Conditional probability and Bayes' theorem\n- Independence of events\n- Discrete random variables: PMF, CDF, expectation, variance\n- Distributions: Binomial, Poisson, Geometric, Hypergeometric\n- Continuous random variables: PDF, CDF\n- Distributions: Uniform, Normal, Exponential, Gamma\n- Central Limit Theorem\n- Moment generating functions\n- Joint distributions and marginals",
    tags: ["probability", "distributions", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Statistics", grade: "Undergraduate", sortOrder: 3,
    title: "Inferential Statistics & Hypothesis Testing",
    content: "- Point estimation and sampling distributions\n- Confidence intervals: for means, proportions, differences\n- Hypothesis testing framework: null, alternative, p-value, significance level\n- Z-tests and t-tests (one-sample, two-sample, paired)\n- Chi-squared tests: goodness-of-fit, independence\n- ANOVA: one-way and two-way\n- Non-parametric tests: Mann-Whitney, Wilcoxon, Kruskal-Wallis\n- Type I and Type II errors, power of a test",
    tags: ["hypothesis-testing", "inference", "undergraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Statistics", grade: "Undergraduate", sortOrder: 4,
    title: "Regression & Predictive Modelling",
    content: "- Simple linear regression: OLS, residuals, R²\n- Multiple linear regression: model building, multicollinearity\n- Assumptions checking: normality, homoscedasticity, independence\n- Logistic regression: binary classification, odds ratios\n- Model selection: AIC, BIC, adjusted R²\n- Cross-validation and overfitting\n- Introduction to time series: trend, seasonality, ARIMA\n- Bayesian statistics: priors, posteriors, credible intervals",
    tags: ["regression", "modelling", "bayesian", "undergraduate"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RESEARCH METHODS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Research Methods", grade: "Postgraduate", sortOrder: 1,
    title: "Research Design & Methodology",
    content: "- Types of research: exploratory, descriptive, explanatory, evaluative\n- Qualitative vs quantitative vs mixed methods\n- Research paradigms: positivism, interpretivism, pragmatism\n- Literature review: systematic search, critical analysis, gap identification\n- Research questions and hypothesis formulation\n- Sampling: probability (random, stratified, cluster) vs non-probability (convenience, snowball)\n- Validity and reliability\n- Ethical considerations: informed consent, anonymity, IRB approval",
    tags: ["research-design", "methodology", "postgraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Research Methods", grade: "Postgraduate", sortOrder: 2,
    title: "Data Collection & Analysis Techniques",
    content: "- Surveys and questionnaire design (Likert scales, open/closed questions)\n- Interviews: structured, semi-structured, unstructured\n- Case study methodology\n- Content analysis and thematic analysis\n- Coding qualitative data: open, axial, selective coding\n- Statistical analysis: choosing the right test\n- Using SPSS, R, or Python for data analysis\n- Triangulation and mixed-methods integration\n- Reporting findings: tables, figures, narrative",
    tags: ["data-collection", "qualitative", "quantitative", "postgraduate"] },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACADEMIC WRITING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Academic Writing", grade: "All Levels", sortOrder: 1,
    title: "Essay & Report Writing",
    content: "- Essay structure: introduction, body paragraphs, conclusion\n- Thesis statement development\n- Argumentation and evidence-based writing\n- Academic tone and style\n- Referencing: APA 7th, MLA 9th, Harvard, Chicago styles\n- Paraphrasing, summarising, and avoiding plagiarism\n- Report structure: executive summary, methodology, findings, recommendations\n- Editing and proofreading strategies",
    tags: ["essay-writing", "referencing", "academic-writing"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Academic Writing", grade: "Postgraduate", sortOrder: 2,
    title: "Thesis & Dissertation Writing",
    content: "- Choosing a research topic and defining scope\n- Writing a research proposal\n- Thesis structure: abstract, introduction, literature review, methodology, results, discussion, conclusion\n- Writing the literature review: synthesis, not summary\n- Presenting quantitative and qualitative findings\n- Discussion chapter: interpreting results, implications, limitations\n- Abstract writing and keywords for discoverability\n- Viva voce / oral defence preparation\n- Time management and writing milestones",
    tags: ["thesis-writing", "dissertation", "postgraduate"] },

  { type: ResourceType.Syllabus, vertical: "higher-ed" as const, curriculum: "University", subject: "Academic Writing", grade: "All Levels", sortOrder: 3,
    title: "Critical Thinking & Analysis",
    content: "- Evaluating sources: credibility, bias, relevance, currency\n- Logical reasoning: deductive, inductive, abductive\n- Identifying logical fallacies\n- Analysing arguments: claim, evidence, warrant\n- Comparative and contrastive analysis\n- Synthesising multiple perspectives\n- Developing original arguments\n- Peer review and constructive feedback",
    tags: ["critical-thinking", "analysis", "academic-writing"] },
];
