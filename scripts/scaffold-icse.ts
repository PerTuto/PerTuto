import fs from 'fs';
import path from 'path';

const BASE_DIR = path.join(__dirname, 'data', 'icse');

const SUBJECT_MAPPINGS: Record<string, string[]> = {
  // Primary (K-5)
  'mathematics': ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  'english': ['k', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  'hindi': ['1', '2', '3', '4', '5', '6', '7', '8'],
  'environmental-studies': ['k', '1', '2', '3', '4', '5'],
  
  // Middle & Secondary (Early Bifurcation)
  'physics': ['6', '7', '8', '9', '10', '11', '12'],
  'chemistry': ['6', '7', '8', '9', '10', '11', '12'],
  'biology': ['6', '7', '8', '9', '10', '11', '12'],
  
  'history-and-civics': ['6', '7', '8', '9', '10'],
  'geography': ['6', '7', '8', '9', '10', '11', '12'],
  
  'computer-studies': ['6', '7', '8'],
  'computer-applications': ['9', '10'],
  'commercial-applications': ['9', '10'],
  'economic-applications': ['9', '10'],

  // Senior Secondary - ISC Sciences
  'computer-science': ['11', '12'],

  // Senior Secondary - ISC Commerce
  'accounts': ['11', '12'],
  'commerce': ['11', '12'],
  'economics': ['11', '12'],
  'business-studies': ['11', '12'],

  // Senior Secondary - ISC Humanities
  'history': ['11', '12'],
  'political-science': ['11', '12'],
  'psychology': ['11', '12'],
  'sociology': ['11', '12'],
};

function formatSubjectName(slug: string): string {
  if (slug === 'history-and-civics') return 'History and Civics';
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
  console.log('🚀 Starting ICSE/ISC Scaffolding...');
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
        board: "icse",
        subject: readableSubject,
        grade: grade,
        vertical: getVertical(grade),
        curriculum: "icse",
        syllabus: [], // Empty array triggers "Course Overview" placeholder seeding
        pastPapers: []
      };

      fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf-8');
      filesCreated++;
    }
  }

  console.log(`✅ ICSE Scaffolding complete!`);
  console.log(`   Directories created: ${directoriesCreated}`);
  console.log(`   Placeholder files created: ${filesCreated}`);
  console.log(`   Existing files preserved: ${filesSkipped}`);
}

run();
