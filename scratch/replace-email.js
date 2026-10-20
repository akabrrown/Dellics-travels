const fs = require('fs');
const path = require('path');

const targetStr = 'help@dellicstravels.com';
const replaceStr = 'help@dellicstravels.com';

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(targetStr)) {
      content = content.split(targetStr).join(replaceStr);
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  } catch (err) {
    // Ignore errors for binary files or unreadable files
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', 'dist', 'build', '.gemini'].includes(file)) {
        walkDir(fullPath);
      }
    } else {
      replaceInFile(fullPath);
    }
  }
}

walkDir(__dirname);
