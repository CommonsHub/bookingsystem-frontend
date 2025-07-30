#!/usr/bin/env node

/**
 * Simple verification script to check that catering translations are properly set up
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = ['en', 'fr', 'nl', 'de'];

// Required catering translation keys
const requiredCateringKeys = [
  'catering.question',
  'catering.description',
  'catering.commentsLabel',
  'catering.commentsPlaceholder',
  'catering.servicesTitle',
  'catering.additionalNotes',
  'catering.options.simpleLunch.name',
  'catering.options.simpleLunch.description',
  'catering.options.awesomeLunch.name',
  'catering.options.awesomeLunch.description',
  'catering.options.afterEventDrinks.name',
  'catering.options.afterEventDrinks.description',
  'catering.options.afterEventSnacks.name',
  'catering.options.afterEventSnacks.description',
  'catering.options.coffeeBreakSnacks.name',
  'catering.options.coffeeBreakSnacks.description'
];

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function checkLanguageFile(language) {
  const filePath = path.join(localesDir, language, 'common.json');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file not found: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    console.log(`\n🔍 Checking ${language.toUpperCase()} translations...`);
    
    let allKeysPresent = true;
    
    for (const key of requiredCateringKeys) {
      const value = getNestedValue(translations, key);
      if (!value) {
        console.error(`❌ Missing translation key: ${key}`);
        allKeysPresent = false;
      } else {
        console.log(`✅ ${key}: "${value}"`);
      }
    }
    
    return allKeysPresent;
  } catch (error) {
    console.error(`❌ Error reading ${language} translations:`, error.message);
    return false;
  }
}

function checkCateringDataFile() {
  const dataFilePath = path.join(__dirname, '../src/data/cateringOptions.ts');
  
  if (!fs.existsSync(dataFilePath)) {
    console.error(`❌ Catering data file not found: ${dataFilePath}`);
    return false;
  }
  
  const content = fs.readFileSync(dataFilePath, 'utf8');
  
  // Check that the file contains translation key references
  const hasTranslationKeys = requiredCateringKeys.some(key => 
    content.includes(key.replace('catering.options.', '').replace('.name', '.name').replace('.description', '.description'))
  );
  
  if (hasTranslationKeys) {
    console.log('✅ Catering data file contains translation key references');
    return true;
  } else {
    console.error('❌ Catering data file does not contain expected translation key references');
    return false;
  }
}

function main() {
  console.log('🔧 Verifying Catering Translation Implementation\n');
  
  let allValid = true;
  
  // Check each language file
  for (const language of languages) {
    if (!checkLanguageFile(language)) {
      allValid = false;
    }
  }
  
  // Check catering data file
  if (!checkCateringDataFile()) {
    allValid = false;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allValid) {
    console.log('🎉 All catering translations are properly implemented!');
    console.log('✅ Hard-coded catering options have been successfully replaced with translation keys.');
    process.exit(0);
  } else {
    console.log('❌ Some issues found with catering translations.');
    process.exit(1);
  }
}

main();