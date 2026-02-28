
import { z } from "genkit";
import { ai } from "../config/genkit";
import { uploadToStorage } from "../utils/storage";

export const paperExportFlow = ai.defineFlow(
  {
    name: "paperExportFlow",
    inputSchema: z.object({
      tenantId: z.string(),
      paper: z.any(), // The QuestionPaper object
      questions: z.array(z.any()), // Full question objects with stem and options
    }),
    outputSchema: z.object({
      pdfUrl: z.string().url(),
    }),
  },
  async (input) => {
    const { paper, questions, tenantId } = input;
    
    // 1. Generate HTML with professional styling & LaTeX support
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: 900; margin: 0; }
          .meta { display: flex; justify-content: space-between; margin-top: 10px; font-weight: bold; }
          .section { margin-top: 30px; }
          .section-title { font-size: 18px; font-weight: bold; border-left: 4px solid #1B7A6D; padding-left: 10px; margin-bottom: 15px; }
          .question { margin-bottom: 20px; page-break-inside: avoid; }
          .q-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; }
          .options { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .option { border: 1px solid #eee; padding: 10px; border-radius: 5px; font-size: 14px; }
          @media print {
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${paper.title}</h1>
          <div class="meta">
            <span>Duration: ${paper.duration} Mins</span>
            <span>Total Marks: ${paper.totalMarks}</span>
          </div>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">${paper.instructions || ""}</p>
        </div>

        ${paper.sections.map((section: any) => `
          <div class="section">
            <h2 class="section-title">${section.title}</h2>
            <p style="font-size: 12px; color: #666; margin-bottom: 15px; font-style: italic;">${section.instructions || ""}</p>
            
            ${section.questionIds.map((qid: string, idx: number) => {
              const q = questions.find(q => q.id === qid);
              if (!q) return `<p>Question ${qid} not found</p>`;
              return `
                <div class="question">
                  <div class="q-header">
                    <span>Q${idx + 1}</span>
                    <span style="font-weight: normal; color: #666;">[${q.marks || 1} Marks]</span>
                  </div>
                  <div class="q-stem">${q.stem}</div>
                  ${q.type?.startsWith('MCQ') ? `
                    <div class="options">
                      ${(q.options || []).map((o: any, oidx: number) => `
                        <div class="option">(${String.fromCharCode(65 + oidx)}) ${o.text}</div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        `).join('')}

        <script>
          document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.body, {
              delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
              ]
            });
          });
        </script>
      </body>
      </html>
    `;

    // Note: Puppeteer requires installation in functions/package.json
    // We import it dynamically to avoid crashes if not available during build
    try {
      const puppeteer = require("puppeteer");
      const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: "new" 
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();

      const timestamp = Date.now();
      const storagePath = `tenants/${tenantId}/papers/${paper.id}_${timestamp}.pdf`;
      const pdfUrl = await uploadToStorage(pdfBuffer, storagePath, "application/pdf");

      return { pdfUrl };
    } catch (error: any) {
      console.error("PDF Generation failed:", error.message);
      // Fallback: Just return a placeholder or throw
      throw new Error("PDF generation requires 'puppeteer' package and Chromium runtime.");
    }
  }
);
