#!/usr/bin/env node

// Import necessary modules
const fs = require('fs-extra');  // fs-extra for working with file system (extends Node.js 'fs')
const path = require('path');  // path for handling and transforming file paths
const translate = require('@vitalets/google-translate-api');  // Importing the translate function from google-translate-api
const readlineSync = require('readline-sync');  // For prompting user input in the command-line

// Language code mappings (maps JSON filenames to valid language codes for translation)
const languageCodeMappings = {
    "cn": "zh",  // Chinese (Simplified)
    "gr": "el",  // Greek
    "en": "en",  // English
    "de": "de",  // German
    "es": "es",  // Spanish
    "fr": "fr",  // French
    "it": "it",  // Italian
    "ko": "ko",  // Korean
    "nl": "nl",  // Dutch
    "pl": "pl",  // Polish
    "pt": "pt",  // Portuguese
    "ro": "ro",  // Romanian
    "ru": "ru",  // Russian
    "sr": "sr",  // Serbian
    "tr": "tr"   // Turkish
};

// A helper function to introduce delay between translation requests (to avoid hitting API limits)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// The main function that prompts the user for input and translates the text
async function runTranslation() {
    // Prompt the user for the folder path of translation files (e.g., './translations')
    const folderPath = readlineSync.question('Path to translation folder? (e.g., ./translations) ');

    // Prompt the user for the translation key (part before the colon in the JSON file)
    const keyQuote = readlineSync.question('Key quote? (first part of the line before the ":") ');

    // Prompt the user for the English text to translate (part after the colon in the JSON file)
    const valueQuote = readlineSync.question('Value quote? (second part of the line after the ":") ');

    // Create an object that stores the key and value provided by the user
    const quoteToTranslate = {
        [keyQuote]: valueQuote  // e.g., { "good_morning": "Good morning" }
    };

    // A function that translates the text and writes the translated data into the corresponding JSON files
    async function translateAndWrite() {
        try {
            // Read all the files in the specified folder (this reads filenames in the directory)
            const files = await fs.readdir(folderPath);

            // Filter out only JSON files (so that it processes only files with a .json extension)
            const jsonFiles = files.filter(file => path.extname(file) === '.json');

            // Iterate through each JSON file
            for (const file of jsonFiles) {
                // Construct the full file path (e.g., './translations/en.json')
                const filePath = path.join(folderPath, file);

                // Extract the language code from the filename (e.g., 'en' from 'en.json')
                let languageCode = path.basename(file, '.json');

                // Map the language code from the file name to the correct translation language code
                if (languageCodeMappings[languageCode]) {
                    languageCode = languageCodeMappings[languageCode];  // Use the mapped language code
                } else {
                    // If the language code is not supported, skip the file
                    console.error(`Skipping file ${file}: Unsupported language code '${languageCode}'`);
                    continue;  // Continue to the next file
                }

                // Read the content of the current JSON file
                let content;
                try {
                    content = await fs.readJson(filePath);  // Read and parse the JSON file into a JavaScript object
                } catch (err) {
                    // If there is an error reading the file, log it and skip to the next file
                    console.error(`Error reading JSON for file ${file}: ${err.message}`);
                    continue;
                }

                try {
                    // Delay to avoid rate-limiting when making API calls
                    await delay(500);

                    // Translate the provided key-value pair using the target language
                    console.log('quoteToTranslate[keyQuote]', quoteToTranslate[keyQuote])
                    const translation = await translate(quoteToTranslate[keyQuote], { to: languageCode });

                    // Add or update the translated phrase in the JSON object
                    content[keyQuote] = translation.text;

                    // Sort the keys alphabetically to maintain order in the JSON file
                    const sortedKeys = Object.keys(content).sort();
                    const sortedContent = {};

                    // Create a new sorted object with keys in alphabetical order
                    for (const key of sortedKeys) {
                        sortedContent[key] = content[key];
                    }

                    // Write the updated (sorted) content back to the JSON file
                    await fs.writeJson(filePath, sortedContent, { spaces: 2 });

                    // Log success message for each updated file
                    console.log(`Successfully updated ${file} with translation for "${keyQuote}" in ${languageCode}.`);
                } catch (err) {
                    // If there is an error with the translation, log the error and move on
                    console.error(`Error translating for file ${file}: ${err.message}`);
                }
            }
        } catch (err) {
            // If there is an error reading the folder, log the error
            console.error(`Error reading the folder: ${err.message}`);
        }
    }

    // Call the translateAndWrite function to start the translation process
    translateAndWrite();
}

// Run the main function and handle any unexpected errors
runTranslation().catch(err => console.error('Error:', err));
