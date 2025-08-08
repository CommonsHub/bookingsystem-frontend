import { google } from "googleapis";

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  location?: string;
  attendees?: string[]; // Array of email addresses
}

export class GoogleCalendarServiceOAuth {
  private calendar: any;
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      Deno.env.get("GOOGLE_CLIENT_ID"),
      Deno.env.get("GOOGLE_CLIENT_SECRET"),
      Deno.env.get("GOOGLE_REDIRECT_URI")
    );

    // Set credentials if you have a refresh token
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    if (refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
    }

    this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client });
  }

  // Generate authorization URL (call this once to get the authorization code)
  getAuthUrl(): string {
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
  }

  // Exchange authorization code for tokens (call this once after user authorizes)
  async getTokens(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Same methods as the service account version...
  async createEvent(calendarId: string, event: CalendarEvent): Promise<any> {
    // ... implementation same as above
  }
}
