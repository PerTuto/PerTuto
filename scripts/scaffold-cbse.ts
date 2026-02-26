import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(__dirname, 'data', 'cbse');

const SUBJECT_MAPPINGS: Record<string, string[]> = {
  // Core / General
  'mathematics': ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  'english': ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  'hindi': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  'environmental-studies': ['k', '1', '2', '3', '4', '5'],
  
  // Middle & Secondary
  'science': ['6', '7', '8', '9', '10'],
  'social-science': ['6', '7', '8', '9', '10'],
  'information-technology': ['9', '10'],

  // Senior Secondary - Sciences
  'physics': ['11', '12'],
  'chemistry': ['11', '12'],
  'biology': ['11', '12'],
  'computer-science': ['11', '12'],

  // Senior Secondary - Commerce
  'accountancy': ['11', '12'],
  'business-studies': ['11', '12'],
  'economics': ['11', '12'],

  // Senior Secondary - Humanities
  'history': ['11', '12'],
  'geography': ['11', '12'],
  'political-science': ['11', '12'],
  'psychology': ['11', '12'],
  'sociology': ['11', '12'],
};

function formatSubjectName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getVertical(grade: string): string {
  if (grade === '11' || grade === '12') return 'higher-ed';
  return 'k12';
}

function run() {
  console.log('🚀 Starting CBSE Scaffolding...');
  let directoriesCreated = 0;
  let filesCreated = 0;
  let filesSkipped = 0;

  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }

  for (const [subjectSlug, grades] of Object.entries(SUBJECT_MAPPINGS)) {
    const subjectDir = path.join(BASE_DIR, subjectSlug);
    
    if (!fs.existsSync(subjectDir)) {
      fs.mkdirSync(subjectDir, { recursive: true });
      directoriesCreated++;
    }

    const readableSubject = formatSubjectName(subjectSlug);

    for (const grade of grades) {
      const filePath = path.join(subjectDir, `class-${grade}.json`);
      
      // Don't overwrite existing populated files
      if (fs.existsSync(filePath)) {
        filesSkipped++;
        continue;
      }

      const template = {
        board: "CBSE",
        subject: readableSubject,
        grade: grade,
        vertical: getVertical(grade),
        curriculum: "CBSE",
        syllabus: [],
        pastPapers: []
      };

      fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8');
      filesCreated++;
    }
  }

  console.log(`✅ Scaffolding complete!`);
  console.log(`   Directories created: ${directoriesCreated}`);
  console.log(`   Placeholder files created: ${filesCreated}`);
  console.log(`   Existing files preserved: ${filesSkipped}`);
}

run();
