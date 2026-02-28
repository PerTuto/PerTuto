export enum TaxonomyDomainType {
  MATH = "MATH",
  ENGLISH = "ENGLISH", // Future proofing
  SCIENCE = "SCIENCE",
}

export enum CognitiveLevel {
  FLUENCY = "Fluency",
  CONCEPTUAL = "Conceptual Understanding",
  APPLICATION = "Application",
  STRATEGIC_THINKING = "Strategic Thinking",
  EXTENDED_THINKING = "Extended Thinking",
}

export interface TaxonomyDomain {
  id: string;
  name: string;
  type: TaxonomyDomainType;
  description?: string;
  order: number;
}

export interface TaxonomyTopic {
  id: string;
  domainId: string;
  name: string;
  description?: string;
  order: number;
  parentTopicId?: string; // For nested topics if needed
}

export interface TaxonomySubTopic {
  id: string;
  topicId: string;
  name: string;
  description?: string;
  order: number;
}

export interface TaxonomyMicroSkill {
  id: string;
  subTopicId: string;
  name: string;
  description?: string;
  order: number;
}

export interface StandardMapping {
  standardCode: string; // e.g. "CCSS.MATH.CONTENT.HSA.CED.A.1"
  description: string;
  curriculum: string; // "Common Core", "SAT", "IB"
}

// Unified Node structure for dynamic management
export interface TaxonomyNode {
  id: string;
  parentId: string | null;
  level: "subject" | "unit" | "topic" | "skill";
  name: string;
  description?: string;
  order: number;
  metadata?: Record<string, unknown>;
}

// Helper specific to our project needs
export type TaxonomyPath = {
  domainId: string;
  topicId: string;
  subTopicId?: string;
  microSkillId?: string;
};
