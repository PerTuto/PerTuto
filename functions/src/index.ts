import * as functionsV1 from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { generateQuestionsFlow, generateNotesFlow } from "./flows/content-factory";
import { extractQuestionsFromPdfFlow } from "./flows/pdf-extraction";
import { syncDriveFolderFlow } from "./flows/drive-sync";
import { onCall } from "firebase-functions/v2/https";

admin.initializeApp();

// Config will be set via CLI: firebase functions:config:set gmail.email="super@pertuto.com" gmail.password="xxxx"
const gmailEmail = functionsV1.config().gmail?.email;
const gmailPassword = functionsV1.config().gmail?.password;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

export const onLeadCreated = functionsV1.region("asia-south1").firestore
    .document("leads/{leadId}")
    .onCreate(async (snap) => {
        const lead = snap.data();

        if (!gmailEmail || !gmailPassword) {
            console.error("Gmail credentials are not set in functions config.");
            return;
        }

        // 1. Send Admin Notification
        const adminMailOptions = {
            from: `"PerTuto Bot" <${gmailEmail}>`,
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
        <p><a href="https://pertutoclasses.web.app/leads" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Dashboard</a></p>
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
                from: `"PerTuto Classes" <${gmailEmail}>`,
                to: lead.email,
                subject: "We've received your request!",
                html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                  <h1>Hi ${lead.name},</h1>
                  <p>Thanks for reaching out to PerTuto Classes! 🎓</p>
                  <p>We have received your details and one of our academic counselors will get in touch with you shortly to discuss your personalized learning plan.</p>
                  <p>In the meantime, feel free to browse our <a href="https://pertutoclasses.web.app">website</a>.</p>
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
    timeoutSeconds: 60
}, async (request) => {
    return await generateQuestionsFlow(request.data);
});

export const generateNotes = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60
}, async (request) => {
    return await generateNotesFlow(request.data);
});

export const generateQuestionsFromPdf = onCall({
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 240 // PDFs take longer
}, async (request) => {
    return await extractQuestionsFromPdfFlow(request.data);
});

export const syncDriveFolder = onCall({
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120
}, async (request) => {
    return await syncDriveFolderFlow(request.data);
});
