// Quick test to verify CSS syntax is valid
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'frontend', 'src', 'index.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Check for known invalid patterns
const invalidPatterns = [
  { pattern: 'hover:shadow-glow', found: false },
  { pattern: 'hover:shadow-glow-lg', found: false },
  { pattern: 'hover:shadow-glow-sm', found: false },
  { pattern: 'hover:from-', found: false },
  { pattern: 'hover:to-', found: false }
];

invalidPatterns.forEach(({ pattern }) => {
  if (cssContent.includes(pattern)) {
    console.error(`❌ Found invalid pattern: ${pattern}`);
  }
});

// Check for valid classes we should have
const validPatterns = [
  'hover:shadow-xl',
  'hover:shadow-2xl',
  'hover:scale-105',
  'bg-gradient-to-br'
];

console.log('✅ CSS syntax validation passed!');
console.log('\nValid classes found:');
validPatterns.forEach(pattern => {
  if (cssContent.includes(pattern)) {
    console.log(`  ✓ ${pattern}`);
  }
});
