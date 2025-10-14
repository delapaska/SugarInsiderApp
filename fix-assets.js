#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing asset paths in React Native components...');

// Files to process
const filesToProcess = [
  'ProScreen.tsx',
  'SettingsScreen.tsx',
  'PersonalDataScreen.tsx',
  'ProductDetailScreen.tsx',
  'ProfileScreen.tsx',
  'SearchScreen.tsx',
  'DiaryScreen.tsx',
  'OnboardingScreen.tsx',
  'StatisticsScreen.tsx'
];

// Pattern to fix paths
const patterns = [
  { from: /require\(['"`]\.\/Pro\//g, to: "require('./assets/Pro/" },
  { from: /require\(['"`]\.\/Profile\//g, to: "require('./assets/Profile/" },
  { from: /require\(['"`]\.\/Settings\//g, to: "require('./assets/Settings/" },
  { from: /require\(['"`]\.\/Search\//g, to: "require('./assets/Search/" },
  { from: /require\(['"`]\.\/Diary\//g, to: "require('./assets/Diary/" },
  { from: /require\(['"`]\.\/Onboarding\//g, to: "require('./assets/Onboarding/" }
];

let totalChanges = 0;

filesToProcess.forEach(fileName => {
  if (fs.existsSync(fileName)) {
    let content = fs.readFileSync(fileName, 'utf8');
    let changes = 0;

    patterns.forEach(pattern => {
      const matches = content.match(pattern.from);
      if (matches) {
        content = content.replace(pattern.from, pattern.to);
        changes += matches.length;
      }
    });

    if (changes > 0) {
      fs.writeFileSync(fileName, content, 'utf8');
      console.log(`✅ Fixed ${fileName}: ${changes} changes`);
      totalChanges += changes;
    } else {
      console.log(`✅ ${fileName}: no changes needed`);
    }
  } else {
    console.log(`⚠️ ${fileName}: file not found`);
  }
});

console.log(`\n🎉 Total changes made: ${totalChanges}`);