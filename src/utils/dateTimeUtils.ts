
import * as Chrono from "chrono-node";
import { format } from "date-fns";

// Generate time options in 30-minute intervals
export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const time = `${formattedHour}:${formattedMinute}`;
      options.push({
        value: time,
        label: format(new Date().setHours(hour, minute), "h:mm a"),
      });
    }
  }
  return options;
};

// Helper to combine date and time
export const combineDateAndTime = (date: Date | undefined, timeString: string): Date | undefined => {
  if (!date || !(date instanceof Date)) return undefined;

  const newDate = new Date(date);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Validate hours and minutes
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return undefined;
  }
  
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  
  return newDate;
};

// Get time string from date (HH:MM format)
export const getTimeString = (date: Date | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "09:00"; // Default to 9 AM
  }
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// Get the appropriate chrono parser for the given language
const getChronoParser = (language: string) => {
  switch (language) {
    case 'de':
      return Chrono.de;
    case 'fr':
      return Chrono.fr;
    case 'nl':
      return Chrono.nl;
    case 'en':
    default:
      return Chrono.en;
  }
};

// Parse natural language date inputs with language support
export const parseNaturalLanguageDate = (
  text: string, 
  referenceDate: Date = new Date(),
  language: string = 'en'
): Date | undefined => {
  try {
    if (!text) return undefined;

    const parser = getChronoParser(language);
    const parseResult = parser.parse(text, {
      instant: referenceDate,
      timezone: "CET"
    }, {
      forwardDate: true,
    });

    if (parseResult && parseResult.length > 0) {
      return parseResult[0].date();
    }
    
    return undefined;
  } catch (error) {
    console.error("Error parsing date:", error);
    return undefined;
  }
};
