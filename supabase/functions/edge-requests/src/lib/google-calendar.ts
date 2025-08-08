import { google } from "npm:googleapis";

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  location?: string;
  attendees?: string[]; // Array of email addresses
}

export class GoogleCalendarService {
  private calendar: any;
  private auth: any;

  constructor() {
    // Initialize Google Auth with service account or OAuth2
    this.auth = new google.auth.GoogleAuth({
      // Option 1: Service Account (recommended for server-side)
      keyFile: Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY_FILE"), // Path to service account JSON
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    // Option 2: Using service account key directly from environment
    // const serviceAccountKey = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY") || "{}");
    // this.auth = new google.auth.GoogleAuth({
    //   credentials: serviceAccountKey,
    //   scopes: ["https://www.googleapis.com/auth/calendar"],
    // });

    this.calendar = google.calendar({ version: "v3", auth: this.auth });
  }

  async createEvent(calendarId: string, event: CalendarEvent): Promise<any> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: calendarId,
        requestBody: {
          summary: event.title,
          description: event.description,
          start: {
            dateTime: event.startTime,
            timeZone: "Europe/Brussels", // Adjust timezone as needed
          },
          end: {
            dateTime: event.endTime,
            timeZone: "Europe/Brussels",
          },
          location: event.location,
          attendees: event.attendees?.map((email) => ({ email })) || [],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 24 hours before
              { method: "popup", minutes: 10 }, // 10 minutes before
            ],
          },
        },
      });

      console.log("Calendar event created:", response.data.htmlLink);
      return response.data;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<any> {
    try {
      const response = await this.calendar.events.patch({
        calendarId: calendarId,
        eventId: eventId,
        requestBody: {
          summary: event.title,
          description: event.description,
          start: event.startTime
            ? {
                dateTime: event.startTime,
                timeZone: "Europe/Brussels",
              }
            : undefined,
          end: event.endTime
            ? {
                dateTime: event.endTime,
                timeZone: "Europe/Brussels",
              }
            : undefined,
          location: event.location,
          attendees: event.attendees?.map((email) => ({ email })) || [],
        },
      });

      console.log("Calendar event updated:", response.data.htmlLink);
      return response.data;
    } catch (error) {
      console.error("Error updating calendar event:", error);
      throw error;
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
      });

      console.log("Calendar event deleted");
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      throw error;
    }
  }

  async getEvent(calendarId: string, eventId: string): Promise<any> {
    try {
      const response = await this.calendar.events.get({
        calendarId: calendarId,
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      console.error("Error getting calendar event:", error);
      throw error;
    }
  }
}
