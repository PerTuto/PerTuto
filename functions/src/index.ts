import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { generateQuestionsFlow, generateNotesFlow } from "./flows/content-factory";
import { extractQuestionsFromPdfFlow } from "./flows/pdf-extraction";
import { syncDriveFolderFlow } from "./flows/drive-sync";
import { worksheetExtractorFlow } from "./flows/extractor";
import { quizCuratorFlow } from "./flows/curator";
import { questionValidatorFlow } from "./flows/validator";
import { questionEnhancerFlow } from "./flows/enhancer";
import { paperGeneratorFlow } from "./flows/paper-generator";
import { paperExportFlow } from "./flows/paper-exporter";
import { answerSheetEvaluatorFlow } from "./flows/evaluator";
import { gapAnalyzerFlow } from "./flows/gap-analyzer";
import { scorePredictorFlow } from "./flows/score-predictor";
import { assignmentFeedbackFlow } from "./flows/assignment-feedback";
import { practiceEvaluatorFlow } from "./flows/practice-evaluator";
import { tenantDataExporter as exporterTrigger } from "./triggers/exporter";
import { onCall } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { apiKey } from "./config/genkit";

admin.initializeApp();

// Migration from functionsV1.config() to params
const gmailEmail = defineString("GMAIL_EMAIL", { default: "super@pertuto.com" });
const gmailPassword = defineString("GMAIL_PASSWORD");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail.value(),
        pass: gmailPassword.value(),
    },
});

export const onLeadCreated = functionsV1.region("asia-south1").firestore
    .document("tenants/pertuto-default/leads/{leadId}")
    .onCreate(async (snap) => {
        const lead = snap.data();

        if (!gmailEmail.value() || !gmailPassword.value()) {
            console.error("Gmail credentials are not set in functions config.");
            return;
        }

        // 1. Send Admin Notification
        const adminMailOptions = {
            from: `"PerTuto Bot" <${gmailEmail.value()}>`,
            to: "super@pertuto.com",
            subject: `New Lead Alert: ${lead.name}`,
            html: `
        <h2>🚀 New Lead Received</h2>
        <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.phone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.subject || "N/A"}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Grade:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.grade || "N/A"}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Message:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${lead.message || "-"}</td></tr>
        </table>
        <p><a href="https://pertuto.com/dashboard/leads" style="background-color: #1B7A6D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
      `,
        };

        try {
            await transporter.sendMail(adminMailOptions);
            console.log("Admin notification sent successfully.");
        } catch (error) {
            console.error("Error sending admin notification:", error);
        }

        // 2. Send Student Auto-Reply
        if (lead.email) {
            const studentMailOptions = {
                from: `"PerTuto Classes" <${gmailEmail.value()}>`,
                to: lead.email,
                subject: "We've received your request!",
                html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                  <h1>Hi ${lead.name},</h1>
                  <p>Thanks for reaching out to PerTuto Classes! 🎓</p>
                  <p>We have received your details and one of our academic counselors will get in touch with you shortly to discuss your personalized learning plan.</p>
                  <p>In the meantime, feel free to browse our <a href="https://pertuto.com">website</a>.</p>
                  <br>
                  <p>Best regards,</p>
                  <p><strong>The PerTuto Team</strong></p>
              </div>
            `,
            };

            try {
                await transporter.sendMail(studentMailOptions);
                console.log("Student auto-reply sent successfully.");
            } catch (error) {
                console.error("Error sending student auto-reply:", error);
            }
        }
    });

// Genkit API Wrappers
export const generateQuestions = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await generateQuestionsFlow(request.data);
});

export const generateNotes = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await generateNotesFlow(request.data);
});

export const generateQuestionsFromPdf = onCall({
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 240, // PDFs take longer
    secrets: [apiKey],
}, async (request) => {
    return await extractQuestionsFromPdfFlow(request.data);
});

export const syncDriveFolder = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120,
    secrets: [apiKey],
}, async (request) => {
    return await syncDriveFolderFlow(request.data);
});

export const worksheetExtractor = onCall({
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 240,
    secrets: [apiKey],
}, async (request) => {
    return await worksheetExtractorFlow(request.data);
});

export const quizCurator = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await quizCuratorFlow(request.data);
});

export const questionValidator = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await questionValidatorFlow(request.data);
});

export const questionEnhancer = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120,
    secrets: [apiKey],
}, async (request) => {
    return await questionEnhancerFlow(request.data);
});

export const paperGenerator = onCall({
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 180,
    secrets: [apiKey],
}, async (request) => {
    return await paperGeneratorFlow(request.data);
});

export const paperExport = onCall({
    region: "us-central1",
    memory: "2GiB", // PDF gen needs more RAM
    timeoutSeconds: 300,
    secrets: [apiKey],
}, async (request) => {
    return await paperExportFlow(request.data);
});

export const evaluator = onCall({
    region: "us-central1",
    memory: "2GiB", // Vision AI needs more RAM
    timeoutSeconds: 540,
    secrets: [apiKey],
}, async (request) => {
    return await answerSheetEvaluatorFlow(request.data);
});

export const tenantDataExporter = exporterTrigger;

export const gapAnalyzer = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await gapAnalyzerFlow(request.data);
});

export const scorePredictor = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await scorePredictorFlow(request.data);
});

export const assignmentFeedback = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await assignmentFeedbackFlow(request.data);
});

export const practiceEvaluator = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    secrets: [apiKey],
}, async (request) => {
    return await practiceEvaluatorFlow(request.data);
});
