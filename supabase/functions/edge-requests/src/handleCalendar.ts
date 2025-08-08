import { finalizeEvent, SimplePool, verifyEvent } from "nostr-tools";
import { CalendarTimeBasedTemplateEvent } from "./lib/nip-52.ts";
import { getCommunityATag } from "./lib/nip-72.ts";
import { GoogleCalendarService, CalendarEvent } from "./lib/google-calendar.ts";
import { hexToBytes } from "npm:nostr-tools/utils";


enum BookingEventType {
  NEW_BOOKING = "new_booking",
  CONFIRMED_BOOKING = "confirmed_booking",
  NEW_REQUEST = "new_request",
  NEW_REQUEST_COMMENT = "new_request_comment",
}

export const handleCalendarEntry = async (record: any, type: BookingEventType) => {
  const pool = new SimplePool();
  const relays = ["wss://relay.chorus.community"];
  const secretKey = Deno.env.get("NOSTR_SECRET_KEY");
  const community_id = Deno.env.get("NOSTR_COMMUNITY_ID");
  const community_identifier = Deno.env.get("NOSTR_COMMUNITY_IDENTIFIER");
  const googleCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
  if (!secretKey) {
    return { success: false, error: "NOSTR_SECRET_KEY environment variable is not set" };
  }

  if (!community_id) {
    return { success: false, error: "NOSTR_COMMUNITY_ID environment variable is not set" };
  }

  if (!community_identifier) {
    return { success: false, error: "NOSTR_COMMUNITY_IDENTIFIER environment variable is not set" };
  }

  // Initialize Google Calendar service
  const googleCalendar = new GoogleCalendarService();

  if (type === BookingEventType.NEW_BOOKING) {
    // Create a Google Calendar entry
    try {
      const calendarEvent: CalendarEvent = {
        title: record.title,
        description:
          record.description ||
          `New booking at Commons Hub Brussels - ${record.room_name}`,
        startTime: new Date(record.start_time).toISOString(),
        endTime: new Date(record.end_time).toISOString(),
        location: `Commons Hub Brussels - ${record.room_name}`,
        attendees: [record.created_by_email, "mushroom@gmail.com"],
      };

      const createdEvent = await googleCalendar.createEvent(
        googleCalendarId,
        calendarEvent
      );
      console.log("Google Calendar event created:", createdEvent.htmlLink);

      // Optionally store the Google Calendar event ID in your database
      // for future updates/deletions
      record.google_calendar_event_id = createdEvent.id;
    } catch (error) {
      console.error("Failed to create Google Calendar event:", error);
      // Don't fail the entire process if calendar creation fails
    }
  } else if (type === BookingEventType.CONFIRMED_BOOKING) {
    // Create Nostr calendar entry
    const calendarEvent: CalendarTimeBasedTemplateEvent = {
      kind: 31923,
      tags: [
        ["a", getCommunityATag(community_id, community_identifier)],
        ["d", Math.random().toString(36).substring(7)], // Random identifier
        ["title", record.title],
        ["start", dateToTimestamp(record.start_time)],
        ["end", dateToTimestamp(record.end_time)],
        ["location", "Commons Hub Brussels"],
        ["location", record.room_name],
      ],
      content: record.description || "",
      created_at: Math.floor(Date.now() / 1000),
    };
    const sk = hexToBytes(secretKey);
    const event = finalizeEvent(calendarEvent, sk);

    const isGood = verifyEvent(event);
    console.log("event", event);
    if (isGood) {
      await Promise.all(pool.publish(relays, event));
    }
  } else if (type === BookingEventType.NEW_REQUEST || type === BookingEventType.NEW_REQUEST_COMMENT) {
    // For requests and request comments, we don't create calendar entries
    // They are handled by email notifications only
    console.log(`Request event of type ${type} received - no calendar entry needed`);
  }

  return { success: true };
};

function dateToTimestamp(dateString: string): string {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000).toString();
}
