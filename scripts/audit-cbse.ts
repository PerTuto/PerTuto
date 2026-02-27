import fs from 'fs';
import path from 'path';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'pertutoclasses',
  });
}
const db = admin.firestore();
const TENANT_ID = 'pertuto-default';
const RESOURCES_PATH = `tenants/${TENANT_ID}/resources`;

async function auditDatabase() {
  console.log('🔍 Auditing Firestore Database...');
  const snapshot = await db.collection(RESOURCES_PATH).where('board', '==', 'CBSE').get();
  
  const subjectsByGrade: Record<string, Set<string>> = {};
  const duplicateFinder: Record<string, number> = {};
  let totalDocs = 0;
  let duplicates = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    totalDocs++;

    // Track subjects per grade
    const grade = data.grade || 'unknown';
    if (!subjectsByGrade[grade]) subjectsByGrade[grade] = new Set();
    subjectsByGrade[grade].add(data.subject);

    // Find duplicates based on title + subject + grade
    const uniqueKey = `${data.grade}-${data.subject}-${data.title}`;
    duplicateFinder[uniqueKey] = (duplicateFinder[uniqueKey] || 0) + 1;
  });

  console.log(`\nTotal CBSE documents in DB: ${totalDocs}`);

  console.log('\n--- Duplicates Found ---');
  for (const [key, count] of Object.entries(duplicateFinder)) {
    if (count > 1) {
      console.log(`Duplicate (${count}x): ${key}`);
      duplicates++;
    }
  }
  if (duplicates === 0) console.log('✅ No duplicates found in DB.');

  console.log('\n--- Subjects per Grade ---');
  for (const [grade, subjects] of Object.entries(subjectsByGrade)) {
    console.log(`Grade ${grade}: ${subjects.size} subjects (${Array.from(subjects).slice(0, 3).join(', ')}...)`);
  }
}

function auditLocalFiles() {
  console.log('\n🔍 Auditing Local JSON Files...');
  const baseDir = path.join(__dirname, 'data', 'cbse');
  const subjects = fs.readdirSync(baseDir);

  let emptyObjects = 0;
  let missingStructuredFields = 0;

  for (const subject of subjects) {
    const subjectDir = path.join(baseDir, subject);
    if (!fs.statSync(subjectDir).isDirectory()) continue;

    const files = fs.readdirSync(subjectDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(subjectDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Identify empty scaffolding
      if (!data.syllabus || data.syllabus.length === 0) {
        emptyObjects++;
      } else {
        // Check if populated ones have the new structured fields
        for (const item of data.syllabus) {
          if (item.title !== 'Course Overview') {
             if (!item.overview || !item.keyTopics || item.keyTopics.length === 0) {
               missingStructuredFields++;
               console.log(`⚠️ Missing structured fields in: ${subject}/${file} -> ${item.title}`);
             }
          }
        }
      }
    }
  }

  console.log(`\nLocal Files Audit:`);
  console.log(`- Empty Placeholder JSONs: ${emptyObjects}`);
  console.log(`- Populated Entries Missing Structured Data: ${missingStructuredFields}`);
}

async function main() {
  auditLocalFiles();
  await auditDatabase();
  process.exit(0);
}

main();
