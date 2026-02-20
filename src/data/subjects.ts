export interface SubjectPageData {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  problemSection: {
    heading: string;
    paragraph: string;
  };
  agitateSection: {
    heading: string;
    bulletPoints: string[];
  };
  solutionSection: {
    heading: string;
    paragraph: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
}

export const subjectsData: SubjectPageData[] = [
  {
    slug: "ib-math-aa",
    seoTitle: "Expert IB Math AA Tutoring in Dubai | PerTuto",
    seoDescription: "Struggling with IB Math Analysis & Approaches? Get expert tutoring in Dubai. HL and SL specialists guaranteed to improve your IB score. Book a demo.",
    hero: {
      headline: "Master IB Math AA and Secure Your 7",
      subheadline: "Expert, tailored tutoring in Dubai for both Higher Level (HL) and Standard Level (SL). We turn complex calculus and algebra into your strongest assets.",
      ctaText: "Book Your Free Demo"
    },
    problemSection: {
      heading: "Why is IB Math AA So Overwhelming?",
      paragraph: "The rigorous pace of the IB Diploma Programme leaves little room for hesitation, especially in Math Analysis and Approaches. Complex topics like advanced calculus, abstract algebra, and probability are introduced rapidly, leaving many students feeling lost and anxious. The immense pressure of mastering these difficult concepts for the high-stakes final exam often leads to high stress and faltering confidence."
    },
    agitateSection: {
      heading: "Falling behind means risking your top-tier university offers.",
      bulletPoints: [
        "The gap between MYP and DP Math AA is massive and unforgiving.",
        "School curriculums move too fast to ensure every student masters the foundational concepts.",
        "A poor Internal Assessment (IA) score can permanently ruin your final IB grade."
      ]
    },
    solutionSection: {
      heading: "The PerTuto Method: Targeted, Proven, Stress-Free",
      paragraph: "Our elite Dubai-based tutors demystify IB Math AA by breaking down convoluted topics into digestible, actionable steps. We meticulously analyze past papers with your child to build resilient exam technique, while providing step-by-step guidance to ensure their Internal Assessment scores top marks. With PerTuto, your child receives the premium, personalized attention necessary to secure a 7 and confidently unlock prestigious university admissions."
    },
    features: [
      { title: "Past Paper Mastery", description: "We don’t just teach theory; we drill IB-specific exam techniques and complex multi-part questions." },
      { title: "IA Guidance", description: "Step-by-step strategic support to ensure your Internal Assessment scores in the top percentage." },
      { title: "Flexible Scheduling", description: "In-person in Dubai or premium online sessions that seamlessly fit a busy IB student's schedule." }
    ]
  },
  {
    slug: "igcse-physics",
    seoTitle: "Premium IGCSE Physics Tutoring in Dubai | PerTuto",
    seoDescription: "Guarantee an A* in IGCSE Physics with Dubai's top tutoring agency. We simplify complex formulas and master past papers for top grades. Book a demo today.",
    hero: {
      headline: "Achieve an A* in IGCSE Physics with Confidence",
      subheadline: "Elite, personalized IGCSE Physics tutoring in Dubai. We transform confusing formulas and abstract concepts into clear, exam-ready knowledge.",
      ctaText: "Book Your Free Demo"
    },
    problemSection: {
      heading: "Why Does IGCSE Physics Frustrate So Many Students?",
      paragraph: "IGCSE Physics demands much more than rote memorization; it requires a deep, conceptual understanding of invisible forces, complex electrical circuits, and intricate formulas. Many students struggle to connect theoretical classroom physics to the practical problem-solving required in exams. Without a highly solid foundation early on, the sheer volume of the syllabus becomes an overwhelming burden as mock exams approach."
    },
    agitateSection: {
      heading: "Memorizing formulas won't secure the top grades you need for A-Levels.",
      bulletPoints: [
        "Students frequently struggle to apply memorized formulas to novel, unseen exam questions.",
        "The mark schemes are notoriously specific; simply stating a correct physics fact isn't enough to earn the point.",
        "Alternative-to-Practical papers require specialized analysis skills that aren't always taught thoroughly in large classrooms."
      ]
    },
    solutionSection: {
      heading: "The PerTuto Method: Crystal Clear Concepts and Exam Precision",
      paragraph: "Our specialized IGCSE tutors in Dubai excel at making physics tangible, relatable, and genuinely easy to grasp for every learning style. We focus heavily on past-paper drilling, ensuring students know exactly how the Cambridge or Edexcel mark schemes reward points. By reinforcing core principles and perfecting exam techniques, we build the unshakeable confidence your child needs to achieve absolute top-tier results."
    },
    features: [
      { title: "Mark Scheme Focus", description: "Learn exactly what Cambridge and Edexcel examiners are looking for, avoiding common pitfalls." },
      { title: "Conceptual Clarity", description: "Visual and practical explanations that make abstract physics principles highly intuitive." },
      { title: "Mock Exams", description: "Regular, timed assessments to build mental endurance and pinpoint specific topics of weakness." }
    ]
  },
  {
    slug: "corporate-python-data-science",
    seoTitle: "Corporate Python & Data Science Training in Dubai | PerTuto",
    seoDescription: "Upskill your workforce with premium Python and Data Science training in Dubai. Practical, ROI-driven corporate courses for modern professionals. Book a consultation.",
    hero: {
      headline: "Accelerate Your Career with Python & Data Science",
      subheadline: "High-impact, ROI-driven corporate training in Dubai. Master AI, data analysis, and Python programming with flexible schedules designed for busy professionals.",
      ctaText: "Book Your Free Demo"
    },
    problemSection: {
      heading: "Is Your Technical Skillset Keeping Up with the AI Era?",
      paragraph: "The modern corporate landscape in Dubai is rapidly shifting towards data-driven decision-making, automation, and artificial intelligence. Professionals and teams lacking strong coding or data science capabilities are increasingly finding themselves at a competitive disadvantage. Navigating complex Python libraries, machine learning algorithms, and data visualization tools through generic self-study is notoriously time-consuming and inefficient."
    },
    agitateSection: {
      heading: "Stagnant technical skills lead to missed promotions and highly inefficient workflows.",
      bulletPoints: [
        "Relying on manual Excel crunching costs your team hundreds of wasted hours every month.",
        "Competitors are already aggressively leveraging AI and automated data pipelines to move faster.",
        "Generic online courses offer zero accountability and have abysmally low completion and retention rates."
      ]
    },
    solutionSection: {
      heading: "The PerTuto Method: Practical, ROI-Driven Corporate Upskilling",
      paragraph: "We deliver bespoke, hands-on Python and Data Science training tailored directly to the distinct business challenges you face in Dubai. Our industry-veteran instructors bypass the academic fluff, focusing purely on practical applications—from automating tedious daily workflows to building predictive models that drive immediate business ROI. With ultra-flexible scheduling that accommodates heavy executive workloads, you can aggressively upskill your team without disrupting daily operations."
    },
    features: [
      { title: "Custom Curriculum", description: "Lessons completely tailored to your company's actual datasets and unique industry challenges." },
      { title: "Workflow Automation", description: "Learn to write robust scripts that automate repetitive daily data tasks instantly saving countless hours." },
      { title: "Executive Dashboards", description: "Build compelling, automated data visualizations that drive strategic, data-backed decision-making." }
    ]
  }
];

export function getSubjectBySlug(slug: string): SubjectPageData | undefined {
  return subjectsData.find((subject) => subject.slug === slug);
}
