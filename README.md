
# Translation Tool

This is a simple command-line tool that translates text into multiple languages by reading from JSON files, updating them with translations using the `@vitalets/google-translate-api` package.

## Requirements

- **Node.js version 20 or higher** is required. You can check your Node.js version with the following command:

  ```bash
  node --version
  ```

  If you don't have Node.js installed or need to upgrade it, you can download the latest version from [Node.js official website](https://nodejs.org/).

- **Translation API Rate Limiting**: Please be aware that the translation API may impose rate limits. If you make too many requests in a short period of time, your IP may be temporarily blocked. In such cases, it is advisable to introduce longer delays between requests or retry after some time.

## Installation

Install the package from NPM:

```bash
npm install -g translation-tool-json
```

This will install the package globally, allowing you to use it from anywhere on your system.

## Usage

1. Run the tool using the following command:

   ```bash
   translate-tool-json
   ```

2. You will be prompted to enter the following information:
   - **Path to the translation folder**: The folder containing JSON files for each language (e.g., `./translations`).
   - **Key quote**: The key representing the text to be translated (e.g., `"good_morning"`).
   - **Value quote**: The English text to be translated (e.g., `"Good morning"`).

3. The script will translate the given text into multiple languages based on the JSON filenames (e.g., `en.json`, `de.json`, `es.json`) and update each file with the new translations.

## Example

```
Path to translation folder? (e.g., ./translations) ./translations
Key quote? (first part of the line before the ":") good_morning
Value quote? (second part of the line after the ":") Good morning
```

The script will process all the JSON files in the `./translations` folder and update each file with the translation of `"Good morning"` into the respective language.

## Supported Languages

The following languages are supported based on the JSON filenames:

- `cn` → Chinese (Simplified)
- `gr` → Greek
- `en` → English
- `de` → German
- `es` → Spanish
- `fr` → French
- `it` → Italian
- `ko` → Korean
- `nl` → Dutch
- `pl` → Polish
- `pt` → Portuguese
- `ro` → Romanian
- `ru` → Russian
- `sr` → Serbian
- `tr` → Turkish

## Known Issues

- **Rate Limiting**: If too many translation requests are made in a short period of time, the translation service may temporarily block your IP. This will result in failed translations and errors such as `Error: Network error`. You can avoid this by introducing longer delays between requests or trying again after a while.
- **Language Mapping**: Only languages listed above are supported. If a JSON file with an unsupported language code is detected, the script will skip that file.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
