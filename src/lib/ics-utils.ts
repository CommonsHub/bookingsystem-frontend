import { type ICSEvent } from './ics-types';

/**
 * Parse ICS content and extract calendar events
 * @param icsContent - The raw ICS file content
 * @returns Array of parsed ICSEvent objects
 */
export function parseICS(icsContent: string): ICSEvent[] {
  const events: ICSEvent[] = [];

  // Unfold lines: join lines that start with space or tab to the previous line
  const unfoldedContent = icsContent.replace(/([\r\n]+)[ \t]/g, '');
  const lines = unfoldedContent.split('\n');
  let currentEvent: Partial<ICSEvent> = {};
  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT') {
      inEvent = false;
      if (currentEvent.summary && currentEvent.start && currentEvent.end) {
        events.push(currentEvent as ICSEvent); // Cast to ICSEvent
      }
    } else if (inEvent && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':');
      
      switch (key) {
        case 'SUMMARY':
          currentEvent.summary = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value.replace(/\\n/g, '\n').replace(/\\,/g, ',');
          break;
        case 'DTSTART':
          { const startResult = parseICSDateTime(value);
          currentEvent.start = startResult.value;
          currentEvent.isAllDay = startResult.isAllDay;
          currentEvent.startTzid = startResult.tzid;
          break; }
        case 'DTEND':
          { const endResult = parseICSDateTime(value);
          currentEvent.end = endResult.value;
          currentEvent.endTzid = endResult.tzid;
          break; }
        case 'LOCATION':
          currentEvent.location = value;
          break;
        case 'UID':
          currentEvent.uid = value;
          break;
      }
    }
  }

  return events;
}

interface ICSDateTimeResult {
  value: string;
  isAllDay: boolean;
  tzid?: string;
}

/**
 * Parse ICS date-time format and determine if it's all-day or time-based
 * @param dateTimeString - ICS date-time string
 * @returns Object with parsed value, all-day flag, and timezone info
 */
export function parseICSDateTime(dateTimeString: string): ICSDateTimeResult {
  // Check for timezone parameter
  const tzidMatch = dateTimeString.match(/TZID=([^:]+):(.+)/);
  let tzid: string | undefined;
  let dateTime: string;

  if (tzidMatch) {
    tzid = tzidMatch[1];
    dateTime = tzidMatch[2];
  } else {
    dateTime = dateTimeString;
  }

  // Check if it's a date-only format (all-day event)
  if (!dateTime.includes('T')) {
    // Date-only format: 20231201
    const date = dateTime.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    return {
      value: date,
      isAllDay: true,
      tzid
    };
  } else {
    // Date-time format: 20231201T120000Z or 20231201T120000
    const timestamp = parseICSDateTimeToTimestamp(dateTime, tzid);
    return {
      value: timestamp.toString(),
      isAllDay: false,
      tzid
    };
  }
}

/**
 * Convert ICS date-time string to Unix timestamp
 * @param dateTimeString - ICS date-time string (e.g., "20231201T120000Z" or "20231201T120000")
 * @param tzid - Optional timezone identifier
 * @returns Unix timestamp in seconds
 */
export function parseICSDateTimeToTimestamp(dateTimeString: string, tzid?: string): number {
  // Remove Z suffix if present (UTC)
  const cleanDateTime = dateTimeString.replace('Z', '');
  
  // Parse the date-time components
  const match = cleanDateTime.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!match) {
    throw new Error(`Invalid ICS date-time format: ${dateTimeString}`);
  }

  const [, year, month, day, hour, minute, second] = match;
  
  // Create Date object (handles timezone conversion)
  const date = new Date(
    parseInt(year),
    parseInt(month) - 1, // Month is 0-indexed
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );

  // If original string had Z, it was UTC
  if (dateTimeString.endsWith('Z')) {
    return Math.floor(date.getTime() / 1000);
  }

  // For now, treat as local time if no timezone specified
  // In a production app, you might want to use a library like moment-timezone
  // to handle timezone conversions properly
  return Math.floor(date.getTime() / 1000);
}

/**
 * Parse ICS date format and convert to YYYY-MM-DD format (for backward compatibility)
 * @param dateString - ICS date string (e.g., "20231201")
 * @returns Date string in YYYY-MM-DD format
 */
export function parseICSDate(dateString: string): string {
  // Handle different iCal date formats
  if (dateString.includes('T')) {
    // Date-time format: 20231201T120000Z or 20231201T120000
    const date = dateString.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3');
    return date;
  } else {
    // Date-only format: 20231201
    const date = dateString.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    return date;
  }
}

/**
 * Fetch and parse ICS events from a URL
 * @param icsUrl - URL to fetch ICS content from
 * @returns Promise resolving to array of ICSEvent objects
 */
export async function fetchAndParseICSEvents(icsUrl: string): Promise<ICSEvent[]> {
  if (!icsUrl) {
    console.log('No ICS URL provided, skipping ICS fetch');
    return [];
  }

  try {
    console.log('Fetching ICS from:', icsUrl);
    const response = await fetch(icsUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ICS: ${response.status} ${response.statusText}`);
    }

    const icsContent = await response.text();
    const events = parseICS(icsContent);
    
    console.log(`Parsed ${events.length} events from ICS`);
    return events;
  } catch (error) {
    console.error('Error fetching ICS:', error);
    return [];
  }
} 

export interface AugmentedICSEvent extends ICSEvent {
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
}

/**
 * Extract the first URL from a string
 */
function extractFirstUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);
  return match ? match[1] : null;
}

/**
 * Extract the first <img> src from HTML body
 */
function extractFirstImageUrl(html: string): { url?: string } {
  // Match the first <img ... src="..." ...> in the body
  const imgMatch = html.match(/<img[^>]+src=["']([^"'>]+)["'][^>]*>/i);
  if (!imgMatch) return {};
  let url = imgMatch[1];
  // Remove ,width=... and ,height=... from any comma-separated segment in the path
  url = url.replace(/,width=\d+/g, '').replace(/,height=\d+/g, '');
  // Remove width= and height= query parameters from the URL (if any)
  try {
    const urlObj = new URL(url, 'https://dummy.base/'); // base for relative URLs
    urlObj.searchParams.delete('width');
    urlObj.searchParams.delete('height');
    url = urlObj.pathname + urlObj.search + urlObj.hash;
    if (/^https?:\/\//.test(imgMatch[1])) {
      url = urlObj.origin + url;
    }
  } catch (e) {
    // If URL parsing fails, just use the original
  }
  return { url };
}

const CORS_PROXY = 'https://corsproxy.io/?';

function withCorsProxy(url: string) {
  if (!url) return url;
  if ((url.startsWith('http://') || url.startsWith('https://')) && !url.startsWith(CORS_PROXY)) {
    return CORS_PROXY + encodeURIComponent(url);
  }
  return url;
}

/**
 * Map ICSEvents to AugmentedICSEvents with Luma image info if available
 */
export async function augmentICSEventsWithLumaImage(events: ICSEvent[]): Promise<AugmentedICSEvent[]> {
  return Promise.all(events.map(async (event) => {
    let image;
    const url = extractFirstUrl(event.description);
    if (url && url.includes('lu.ma')) {
      try {
        const resp = await fetch(withCorsProxy(url));
        if (resp.ok) {
          const html = await resp.text();
          const img = extractFirstImageUrl(html);
          if (img.url) {
            console.log('Found image:', img.url);
            image = { url: img.url };
          }
        }
      } catch (e) {
        // Ignore fetch errors for now
      }
    }
    return { ...event, image };
  }));
} 

/**
 * Fetch, parse, and augment ICS events from a URL
 * @param icsUrl - URL to fetch ICS content from
 * @returns Promise resolving to array of AugmentedICSEvent objects
 */
export async function fetchAndAugmentICSEvents(icsUrl: string): Promise<AugmentedICSEvent[]> {
  const events = await fetchAndParseICSEvents(icsUrl);
  return augmentICSEventsWithLumaImage(events);
}