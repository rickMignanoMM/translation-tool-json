#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const readlineSync = require('readline-sync');
const translate = require('@vitalets/google-translate-api');

// Function to extract the base language code from a filename (e.g., 'en_EN.json' -> 'en')
function extractBaseLanguageCode(filename) {
    const match = filename.match(/^([a-z]{2})[_-]?.*/i);
    return match ? match[1] : null; // Return the first capture group (base language code)
}

// Function to alphabetically sort the keys in an object
function sortObjectAlphabetically(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    sortedKeys.forEach(key => {
        sortedObj[key] = obj[key];
    });
    return sortedObj;
}

// Function to handle translations
async function runTranslation() {
    const folderPath = readlineSync.question('Path to translation folder? (e.g., ./translations) ');
    const keyQuote = readlineSync.question('Key quote? (first part of the line before the ":") ');
    const valueQuote = readlineSync.question('Value quote? (second part of the line after the ":") ');

    const quoteToTranslate = {
        [keyQuote]: valueQuote
    };

    // Read all files in the folder
    const files = await fs.readdir(folderPath);

    // Filter JSON files
    const jsonFiles = files.filter(file => path.extname(file) === '.json');

    // Iterate through each JSON file
    for (const file of jsonFiles) {
        const filePath = path.join(folderPath, file);
        
        // Extract the base language code (e.g., 'en' from 'en_EN.json')
        const baseLanguageCode = extractBaseLanguageCode(path.basename(file, '.json'));

        if (!baseLanguageCode) {
            console.error(`Skipping file ${file}: Invalid language code`);
            continue; // Skip files without a valid language code
        }

        try {
            // Translate the provided quote
            const translation = await translate(quoteToTranslate[keyQuote], { to: baseLanguageCode });

            // Read the current JSON content
            let content = await fs.readJson(filePath);

            // Add or update the translation in the JSON object
            content[keyQuote] = translation.text;

            // Sort the keys alphabetically
            content = sortObjectAlphabetically(content);

            // Write the sorted content back to the file
            await fs.writeJson(filePath, content, { spaces: 2 });

            console.log(`Successfully updated ${file} with translation for "${keyQuote}" in ${baseLanguageCode}.`);
        } catch (err) {
            console.error(`Error translating for file ${file}: ${err.message}`);
        }
    }
}

runTranslation();
