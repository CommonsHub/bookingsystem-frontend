
# Translation Guide

This project uses i18next for internationalization and is set up to work with Weblate for translation management.

## Structure

- Translations are organized by language code (e.g., `en`, `fr`, `nl`) in separate folders
- Each folder contains JSON files for different namespaces (e.g., `common.json`)
- The default namespace is `common`

## Adding a New Language

1. Create a new folder with the language code
2. Copy the JSON files from the English (`en`) folder
3. Translate the values, keeping the keys unchanged

## Working with Weblate

This project is structured to be compatible with Weblate:
- JSON files are used for translations
- Simple key-value structure for easy parsing
- Organized by language and namespace

## Translation Variables

Some strings contain variables that should not be translated. These are enclosed in double curly braces, e.g., `{{name}}`.

Example:
```json
"greeting": "Hello, {{name}}!"
```

When translating to French:
```json
"greeting": "Bonjour, {{name}} !"
```

## Adding New Translations

When adding new strings to the application:
1. Add them to the English (`en/common.json`) file first
2. Use a structured approach with namespaces (e.g., `app.title`, `auth.login`)
3. Then add the translations to other language files
