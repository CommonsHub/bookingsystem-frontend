import { EventTemplate, type UnsignedEvent } from "nostr-tools";

export interface CalendarDateBasedTemplateEvent extends EventTemplate {
  kind: 31922;
  tags: Array<
    | ["a", string] // community reference
    | ["d", string] // random identifier
    | ["title", string] // title of calendar event
    | ["start", string] // YYYY-MM-DD
    | ["end", string] // YYYY-MM-DD
    | ["location", string] // location
    | ["g", string] // geohash
    // | ['p', string, string, string] // participants with relay URL and role
    // | ['p', string, string] // participants with role only
  >;
}

export interface CalendarTimeBasedTemplateEvent extends EventTemplate {
  kind: 31923;
  tags: Array<
    | ["a", string] // community reference
    | ["d", string] // random identifier
    | ["title", string] // title of calendar event
    | ["image", string] // image URL for the event
    | ["start", string] // unix timestamp in seconds
    | ["end", string] // unix timestamp in seconds
    | ["start_tzid", string] // timezone ID for start time
    | ["end_tzid", string] // timezone ID for end time
    | ["location", string] // location
    | ["g", string] // geohash
    | ["t", string] // tags (repeated)
    | ["r", string] // references (repeated)
    // | ['p', string, string, string] // participants with relay URL and role
    // | ['p', string, string] // participants with role only
  >;
}

export function validateCalendarDateBasedTemplateEvent(
  event: EventTemplate
): event is CalendarDateBasedTemplateEvent {
  if (event.kind !== 31922) return false;

  // Find start and end tags
  const startTag = event.tags.find((tag) => tag[0] === "start");
  const endTag = event.tags.find((tag) => tag[0] === "end");

  // Check if start and end tags exist and match YYYY-MM-DD format
  if (!startTag?.[1] || !endTag?.[1]) return false;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(startTag[1]) && dateRegex.test(endTag[1]);
}
