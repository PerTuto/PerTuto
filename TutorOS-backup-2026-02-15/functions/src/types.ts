import { z } from "genkit";

export const CognitiveDepthSchema = z.enum([
  "Fluency",
  "Conceptual",
  "Application",
  "Synthesis",
]);

export const CurriculumSchema = z
  .string()
  .describe("Curriculum name (e.g., Algebra 1, IB Math SL, Cambridge IGCSE)");

export const QuestionTypeSchema = z.enum([
  "MCQ_SINGLE",
  "MCQ_MULTI",
  "FILL_IN_BLANK",
  "FREE_RESPONSE",
  "PASSAGE_BASED",
]);

export const TaxonomySchema = z.object({
  domain: z.string(),
  topic: z.string(),
  subTopic: z.string(),
  microSkill: z.string(),
  cognitiveDepth: CognitiveDepthSchema,
  curriculum: CurriculumSchema,
  scaffoldLevel: z.number().min(1).max(5),
  commonMisconceptions: z.array(z.string()).optional(),
});

export const QuestionSchema = z.object({
  stemMarkdown: z
    .string()
    .describe("The question text in Markdown with LaTeX support"),
  type: QuestionTypeSchema,
  options: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
        explanation: z.string().optional(),
      }),
    )
    .optional(),
  correctAnswer: z.string().optional().describe("For non-MCQ types"),
  taxonomy: TaxonomySchema,
  hint: z.string().optional(),
  figureUrls: z
    .array(z.string())
    .optional()
    .describe("URLs of cropped diagrams/graphs"),
  figures: z
    .array(
      z.object({
        page: z.number(),
        box: z.array(z.number()).length(4), // [ymin, xmin, ymax, xmax]
        label: z.string().optional(),
      }),
    )
    .optional()
    .describe("Metadata for client-side rendering of figures"),
});

export const ExtractionResponseSchema = z.object({
  questions: z.array(QuestionSchema),
  sourceFilename: z.string().optional(),
  pdfUrl: z.string().optional(),
  debug: z.any().optional(),
});
