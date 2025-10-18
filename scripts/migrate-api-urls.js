#!/usr/bin/env node

/**
 * Migration Script: Replace localhost URLs with API Helper
 * This script automatically updates all files to use the centralized API helper
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Files that have already been updated
const excludeFiles = [
  'config.js',
  'axiosConfig.js',
  'apiHelper.js',
  'TopPicks.js',
  'Courses.js'
];

// Mapping of localhost patterns to API helper equivalents
const replacements = [
  {
    // Basic API calls
    pattern: /'http:\/\/localhost:3000\/api\/([^']+)'/g,
    replacement: (match, endpoint) => `getApiUrl('${endpoint}')`
  },
  {
    pattern: /"http:\/\/localhost:3000\/api\/([^"]+)"/g,
    replacement: (match, endpoint) => `getApiUrl('${endpoint}')`
  },
  {
    pattern: /`http:\/\/localhost:3000\/api\/([^`]+)`/g,
    replacement: (match, endpoint) => `getApiUrl(\`${endpoint}\`)`
  },
  {
    // Backend URL for images
    pattern: /'http:\/\/localhost:3000([^']+)'/g,
    replacement: (match, path) => `getBackendUrl('${path}')`
  },
  {
    pattern: /"http:\/\/localhost:3000([^"]+)"/g,
    replacement: (match, path) => `getBackendUrl('${path}')`
  },
  {
    pattern: /`http:\/\/localhost:3000([^`]+)`/g,
    replacement: (match, path) => `getBackendUrl(\`${path}\`)`
  }
];

// Image handling patterns
const imagePatterns = [
  {
    pattern: /image\.startsWith\('http'\) \? image : `http:\/\/localhost:3000\$\{image\}`/g,
    replacement: 'getImageUrl(image)'
  },
  {
    pattern: /course\.image\.startsWith\('http'\) \? course\.image : `http:\/\/localhost:3000\$\{course\.image\}`/g,
    replacement: 'getImageUrl(course.image)'
  }
];

function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(filePath);
  
  if (!['.js', '.jsx', '.ts', '.tsx'].includes(ext)) return false;
  if (excludeFiles.includes(fileName)) return false;
  
  return true;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let needsImport = false;

  // Check if file contains localhost URLs
  if (content.includes('http://localhost:3000')) {
    console.log(`Processing: ${filePath}`);

    // Apply replacements
    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        needsImport = true;
      }
    });

    // Apply image pattern replacements
    imagePatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        needsImport = true;
      }
    });

    // Add import if needed and not already present
    if (needsImport && !content.includes("from '../utils/apiHelper'")) {
      // Find the last import statement
      const importRegex = /import .+ from ['"][^'"]+['"];?\n/g;
      const imports = content.match(importRegex);
      
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        
        // Calculate relative path to apiHelper
        const fileDir = path.dirname(filePath);
        const utilsPath = path.join(srcDir, 'utils', 'apiHelper.js');
        let relativePath = path.relative(fileDir, utilsPath).replace(/\\/g, '/');
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath;
        }
        relativePath = relativePath.replace('.js', '');

        const newImport = `import { getApiUrl, getBackendUrl, getImageUrl, API_ENDPOINTS } from '${relativePath}';\n`;
        
        content = content.slice(0, lastImportIndex + lastImport.length) + 
                  newImport + 
                  content.slice(lastImportIndex + lastImport.length);
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
      return true;
    }
  }

  return false;
}

function walkDirectory(dir) {
  let filesProcessed = 0;

  function walk(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walk(filePath);
      } else if (shouldProcessFile(filePath)) {
        if (processFile(filePath)) {
          filesProcessed++;
        }
      }
    });
  }

  walk(dir);
  return filesProcessed;
}

console.log('🚀 Starting migration...\n');
const filesUpdated = walkDirectory(srcDir);
console.log(`\n✅ Migration complete! Updated ${filesUpdated} files.`);
console.log('\n⚠️  Note: Please review the changes and test your application.');
console.log('Some complex patterns may need manual adjustment.\n');
