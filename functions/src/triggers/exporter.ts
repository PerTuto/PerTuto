
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

import * as logger from "firebase-functions/logger";

export const tenantDataExporter = onCall(async (request) => {
  const { tenantId, format } = request.data;
  const uid = request.auth?.uid;

  if (!uid) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }

  if (!tenantId) {
    throw new HttpsError("invalid-argument", "tenantId is required.");
  }

  logger.info(`Starting export for tenant: ${tenantId}, requested by: ${uid}`);

  const db = getFirestore();
  const collections = [
    "students", "courses", "classes", "assignments", 
    "attendance", "invoices", "payments", "ledger", 
    "leads", "questions", "quizzes", "evaluations", "tests"
  ];

  try {
    const exportData: Record<string, any[]> = {};

    for (const colName of collections) {
      const snapshot = await db.collection(`tenants/${tenantId}/${colName}`).get();
      exportData[colName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // In a production environment, we would use 'archiver' or 'jszip' 
    // to create a ZIP and upload to Firebase Storage.
    // For this implementation, we simulate the return of a data structure 
    // that would normally be a signed URL to the ZIP.
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `export-${tenantId}-${timestamp}.${format}`;
    
    // Simulate storage upload
    logger.info(`Export generated: ${fileName}`);

    return {
      success: true,
      message: "Export generated successfully. In a real environment, this would be a signed URL.",
      fileName,
      data: format === 'json' ? exportData : "CSV_FLATTENED_CONTENT_SIMULATED"
    };

  } catch (error: any) {
    logger.error("Export failed:", error);
    throw new HttpsError("internal", "Failed to aggregate tenant data.");
  }
});
