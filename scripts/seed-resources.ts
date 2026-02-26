/**
 * Seed Resources Script
 * 
 * Usage: npx ts-node scripts/seed-resources.ts <path-to-json>
 * Example: npx ts-node scripts/seed-resources.ts scripts/data/cbse/mathematics/class-10.json
 * 
 * This script:
 * 1. Reads a JSON config file defining curriculum content
 * 2. Deletes existing resources for that board/subject/grade
 * 3. Creates clean, well-structured Firestore documents
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin with Application Default Credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'pertutoclasses',
  });
}

const db = admin.firestore();
const TENANT_ID = 'pertuto-default';
const RESOURCES_PATH = `tenants/${TENANT_ID}/resources`;

interface SyllabusEntry {
  title: string;
  sortOrder: number;
  tags: string[];
  content: string;
  overview?: string;
  weightage?: string;
  unit?: string;
  keyTopics?: string[];
  formulas?: { name: string; formula: string }[];
  ncertUrl?: string;
  examTips?: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

interface PastPaperEntry {
  title: string;
  year: string;
  session: string;
  sortOrder: number;
  content: string;
  fileUrl?: string;
  fileName?: string;
  paperCode?: string;
  totalMarks?: number;
  duration?: string;
  sections?: { name: string; type: string; marksPerQ: number; count: number }[];
  topicsCovered?: string[];
  markingSchemeUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

interface ContentConfig {
  board: string;
  subject: string;
  grade: string;
  vertical: 'k12' | 'higher-ed' | 'professional';
  curriculum: string;
  syllabus: SyllabusEntry[];
  pastPapers: PastPaperEntry[];
}

async function deleteExistingResources(board: string, subject: string, grade: string) {
  console.log(`🗑  Deleting existing resources for ${board} ${subject} Grade ${grade}...`);
  
  const ref = db.collection(RESOURCES_PATH);
  
  // Only delete exact matches for this specific subject to prevent wiping out other subjects like Mathematics
  const queries = [
    ref.where('board', '==', board).where('subject', '==', subject).where('grade', '==', grade),
    ref.where('curriculum', '==', board).where('subject', '==', subject).where('grade', '==', grade),
  ];

  const deletedIds = new Set<string>();
  
  for (const q of queries) {
    const snapshot = await q.get();
    if (!snapshot.empty) {
      // Firestore batch limit is 500 — chunk if needed
      const chunks: admin.firestore.DocumentReference[][] = [];
      let currentChunk: admin.firestore.DocumentReference[] = [];
      
      for (const docSnap of snapshot.docs) {
        if (deletedIds.has(docSnap.id)) continue; // Skip already-deleted
        deletedIds.add(docSnap.id);
        currentChunk.push(docSnap.ref);
        if (currentChunk.length === 500) {
          chunks.push(currentChunk);
          currentChunk = [];
        }
      }
      if (currentChunk.length > 0) chunks.push(currentChunk);
      
      for (const chunk of chunks) {
        const batch = db.batch();
        chunk.forEach(docRef => batch.delete(docRef));
        await batch.commit();
      }
    }
  }
  
  console.log(`   Deleted ${deletedIds.size} documents.`);
  return deletedIds.size;
}

async function seedSyllabus(config: ContentConfig) {
  console.log(`📝 Seeding ${config.syllabus.length} syllabus entries...`);
  const ref = db.collection(RESOURCES_PATH);
  const now = admin.firestore.Timestamp.now();

  for (const entry of config.syllabus) {
    const docData: Record<string, any> = {
      tenantId: TENANT_ID,
      vertical: config.vertical,
      type: 'syllabus',
      board: config.board,
      curriculum: config.curriculum,
      subject: config.subject,
      grade: config.grade,
      title: entry.title,
      content: entry.content || '',
      tags: entry.tags,
      sortOrder: entry.sortOrder,
      published: true,
      isFeatured: entry.sortOrder <= 3,
      seoTitle: entry.seoTitle || `${entry.title} - ${config.board} Class ${config.grade} ${config.subject}`,
      seoDescription: entry.seoDescription || `Complete guide to ${entry.title} for ${config.board} Class ${config.grade} ${config.subject}. Key topics, formulas, and exam tips.`,
      keywords: entry.keywords || entry.tags,
      createdAt: now,
      updatedAt: now,
    };
    // Pass through new structured fields
    if (entry.overview) docData.overview = entry.overview;
    if (entry.weightage) docData.weightage = entry.weightage;
    if (entry.unit) docData.unit = entry.unit;
    if (entry.keyTopics) docData.keyTopics = entry.keyTopics;
    if (entry.formulas) docData.formulas = entry.formulas;
    if (entry.ncertUrl) docData.ncertUrl = entry.ncertUrl;
    if (entry.examTips) docData.examTips = entry.examTips;
    await ref.add(docData);
    console.log(`   ✓ ${entry.title}`);
  }
}

async function seedPastPapers(config: ContentConfig) {
  console.log(`📄 Seeding ${config.pastPapers.length} past paper entries...`);
  const ref = db.collection(RESOURCES_PATH);
  const now = admin.firestore.Timestamp.now();

  for (const entry of config.pastPapers) {
    const docData: Record<string, any> = {
      tenantId: TENANT_ID,
      vertical: config.vertical,
      type: 'past-paper',
      board: config.board,
      curriculum: config.curriculum,
      subject: config.subject,
      grade: config.grade,
      title: entry.title,
      content: entry.content,
      year: entry.year,
      session: entry.session,
      tags: [`past-paper`, `${config.board.toLowerCase()}-${config.grade}`, entry.year],
      sortOrder: entry.sortOrder,
      published: true,
      seoTitle: entry.seoTitle || `${entry.title} | ${config.board} Class ${config.grade}`,
      seoDescription: entry.seoDescription || `Download ${entry.title} with marking scheme. Practice with official ${config.board} board exam papers.`,
      keywords: entry.keywords || [`${config.board} past paper`, `class ${config.grade} maths`, entry.year],
      createdAt: now,
      updatedAt: now,
    };
    if (entry.fileUrl) docData.fileUrl = entry.fileUrl;
    if (entry.fileName) docData.fileName = entry.fileName;
    if (entry.paperCode) docData.paperCode = entry.paperCode;
    if (entry.totalMarks) docData.totalMarks = entry.totalMarks;
    if (entry.duration) docData.duration = entry.duration;
    if (entry.sections) docData.sections = entry.sections;
    if (entry.topicsCovered) docData.topicsCovered = entry.topicsCovered;
    if (entry.markingSchemeUrl) docData.markingSchemeUrl = entry.markingSchemeUrl;
    
    await ref.add(docData);
    console.log(`   ✓ ${entry.title}`);
  }
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Usage: npx ts-node scripts/seed-resources.ts <path-to-json>');
    process.exit(1);
  }

  const resolvedPath = path.resolve(jsonPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const config: ContentConfig = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
  console.log(`\n🚀 Seeding ${config.board} ${config.subject} Grade ${config.grade}`);
  console.log(`   Vertical: ${config.vertical}`);
  console.log(`   Syllabus entries: ${config.syllabus.length}`);
  console.log(`   Past papers: ${config.pastPapers.length}\n`);

  // Step 1: Delete existing
  await deleteExistingResources(config.board, config.subject, config.grade);

  // Step 2: Seed syllabus
  if (config.syllabus.length > 0) {
    await seedSyllabus(config);
  } else if (config.pastPapers.length === 0) {
    console.log(`📌 Injecting placeholder resource to make subject visible...`);
    config.syllabus.push({
      title: 'Course Overview',
      sortOrder: 1,
      tags: ['placeholder'],
      content: 'We are currently curating premium content for this subject. Check back soon for detailed syllabus breakdowns and past papers.',
      overview: 'Currently under development.',
      keyTopics: ['Content Coming Soon']
    });
    await seedSyllabus(config);
  }

  // Step 3: Seed past papers
  if (config.pastPapers.length > 0) {
    await seedPastPapers(config);
  }

  console.log(`\n✅ Done! Seeded ${config.syllabus.length + config.pastPapers.length} resources.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
