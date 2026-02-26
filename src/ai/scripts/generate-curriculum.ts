import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { adminFirestore } from '@/lib/firebase/admin-app';
import dotenv from 'dotenv';
import path from 'path';

// Load local environment variables for API keys and Firebase Configs
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Ensure GOOGLE_GENAI_API_KEY is available
if (!process.env.GOOGLE_GENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    console.error("Missing GOOGLE_GENAI_API_KEY in environment.");
    process.exit(1);
}

// Map key for Genkit if it only exists as GEMINI_API_KEY
if (!process.env.GOOGLE_GENAI_API_KEY && process.env.GEMINI_API_KEY) {
    process.env.GOOGLE_GENAI_API_KEY = process.env.GEMINI_API_KEY;
}

const ai = genkit({
  plugins: [googleAI()],
  // You can optionally define model defaults here
});

const DEFAULT_TENANT_ID = "pertuto-default";

// 1. Zod Schema enforcing strict output formatting
const GeneratedResourceSchema = z.object({
  title: z.string().describe("The clean display title of the resource. e.g. 'Grade 10 Mathematics Comprehensive Syllabus'"),
  seoTitle: z.string().describe("A keyword-rich SEO title under 60 characters targeting long-tail searches (e.g. 'CBSE Grade 10 Math Syllabus & Study Guide 2024')"),
  seoDescription: z.string().describe("A compelling 150-character meta description designed to drive click-through from Google search results."),
  keywords: z.array(z.string()).describe("A list of 5-8 highly relevant SEO keywords as lowercase strings."),
  content: z.string().describe("The extremely detailed, comprehensive syllabus or study guide in RAW MARKDOWN format. Use ## headings, - bullet points, ** bolding, and tables. DO NOT output JSON in this string."),
  tags: z.array(z.string()).describe("3-5 short tag strings (e.g., 'algebra', 'trigonometry', 'exam prep').")
});

async function runFactory() {
    console.log("🚀 Starting Autonomous AI Content Factory...");

    // 2. The Curriculum Matrix Loop
    const BOARDS = ['CBSE', 'IB'];
    const SUBJECTS = ['Mathematics', 'Science'];
    // Truncated specific grades for safety/cost in demo runs, expand to full K-12 later.
    const GRADES = ['9', '10'];

    const targetModel = 'googleAI/gemini-3-pro';

    for (const board of BOARDS) {
        for (const subject of SUBJECTS) {
            for (const grade of GRADES) {
                const targetName = `${board} Grade ${grade} ${subject}`;
                console.log(`\n⏳ Generating payload for: ${targetName}...`);

                try {
                    // 3. Genkit Structured Workflow execution
                    const prompt = `You are a world-class K-12 educator and curriculum designer.
Generate a comprehensive, expert-level Syllabus and Study Outline for ${board} ${subject} Grade ${grade}.
The resulting content should be deeply engaging, technically accurate, and formatted in rich Markdown.
Include:
- Course Overview
- Core Learning Objectives
- Detailed Chapter / Unit Breakdown
- Exam Tips and Grading Guidelines

Output strictly in the requested JSON fields. Make the SEO parameters exceptionally strong for student acquisition.`;

                    // We use `gemini-2.5-pro` as the fallback if Gemini 3 is unavailable on this GCP project yet
                    const fallbackModel = 'googleAI/gemini-2.5-pro';

                    let response;
                    try {
                        response = await ai.generate({
                            model: targetModel,
                            prompt,
                            output: { schema: GeneratedResourceSchema }
                        });
                    } catch (e: any) {
                        console.warn(`[!] ${targetModel} might not be available yet. Falling back to ${fallbackModel}...`);
                        response = await ai.generate({
                            model: fallbackModel,
                            prompt,
                            output: { schema: GeneratedResourceSchema }
                        });
                    }
                    
                    const payload = response.output;
                    
                    if (!payload) {
                        console.error(`❌ Failed to parse payload for ${targetName}`);
                        continue;
                    }

                    console.log(`✅ AI Generation complete for ${targetName}. Validated against Zod schema.`);

                    // 4. Direct Firestore Injection with Human-in-the-Loop constraints
                    const resourceDoc = {
                        tenantId: DEFAULT_TENANT_ID, // Bind to default tenant
                        vertical: 'k12',
                        type: 'Syllabus', // ResourceType.Syllabus Equivalent
                        board: board,
                        curriculum: board,
                        subject: subject,
                        grade: grade,
                        title: payload.title,
                        seoTitle: payload.seoTitle,
                        seoDescription: payload.seoDescription,
                        keywords: payload.keywords,
                        content: payload.content,
                        tags: payload.tags,
                        sortOrder: 10,
                        published: false, // CRITICAL: Force Draft mode for HITL verification
                        isFeatured: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const docRef = await adminFirestore.collection('resources').add(resourceDoc);
                    console.log(`💾 Successfully injected into Firestore as DRAFT [ID: ${docRef.id}]`);

                } catch (err) {
                    console.error(`🚨 Fatal Error generating ${targetName}:`, err);
                }
            }
        }
    }

    console.log("\n🎉 AI Factory execution finished.");
    process.exit(0);
}

runFactory().catch(console.error);
