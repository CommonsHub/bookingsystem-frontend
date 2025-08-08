import { EmailTemplate, englishTemplate } from "./templates/english.ts";
import { frenchTemplate } from "./templates/french.ts";
import { dutchTemplate } from "./templates/dutch.ts";

// Language code mapping
export type SupportedLanguage = "en" | "fr" | "nl";

// Language detection function
export function detectLanguage(
  languageCode: string | null | undefined
): SupportedLanguage {
  if (!languageCode) {
    return "en"; // Default to English if no language specified
  }

  // Normalize the language code to lowercase
  const normalizedCode = languageCode.toLowerCase().trim();

  // Handle different language code formats
  if (normalizedCode.startsWith("fr")) {
    return "fr";
  } else if (
    normalizedCode.startsWith("nl") ||
    normalizedCode.startsWith("du")
  ) {
    return "nl";
  } else {
    return "en"; // Default to English for any other language
  }
}

// Get email template based on language
export function getEmailTemplate(language: SupportedLanguage): EmailTemplate {
  switch (language) {
    case "fr":
      return frenchTemplate;
    case "nl":
      return dutchTemplate;
    case "en":
    default:
      return englishTemplate;
  }
}

// Convenience function to get template directly from language code
export function getTemplateFromLanguageCode(
  languageCode: string | null | undefined
): EmailTemplate {
  const detectedLanguage = detectLanguage(languageCode);
  return getEmailTemplate(detectedLanguage);
}
