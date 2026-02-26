import fs from 'fs';
import path from 'path';

const dir = path.join(__dirname, 'data', 'cbse', 'mathematics');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.json')) continue;
  
  const filePath = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let modified = false;
  if (data.syllabus && Array.isArray(data.syllabus)) {
    for (const item of data.syllabus) {
      if (item.title && item.title.startsWith('Chapter ')) {
        const parts = item.title.split(': ');
        if (parts.length > 1) {
          item.title = parts[1]; // Keep everything after the colon
          modified = true;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Fixed titles in ${file}`);
  }
}
