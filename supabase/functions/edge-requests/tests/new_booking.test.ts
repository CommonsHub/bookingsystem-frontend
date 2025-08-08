// Test for handling new booking
// @ts-ignore: Deno runtime import
// import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { handler } from "../index.ts";
import { assertEquals } from "jsr:@std/assert";

// Will load the .env file to Deno.env
import 'jsr:@std/dotenv/load'
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
}

Deno.test("invoke booking-notification for new booking", async () => {
  const client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options)
  const payload = {
    record: {
      id: 1,
      title: "Test Booking",
      description: "A test booking event",
      room_id: 101,
      room_name: "Test Room",
      room_capacity: 10,
      start_time: "2024-06-01T10:00:00Z",
      end_time: "2024-06-01T12:00:00Z",
      status: "pending",
      created_by_email: "test@example.com",
      created_by_name: "Test User",
      created_at: "2024-06-01T09:00:00Z",
      approved_by_email: null,
      approved_at: null,
      additional_comments: null,
      is_public_event: false,
      cancelled_at: null,
      cancelled_by_email: null,
      organizer: "Test Org",
      estimated_attendees: 5,
      luma_event_url: null,
      calendar_url: null,
      public_uri: null,
      language: "en",
      price: null,
      currency: null,
      catering_options: null,
      catering_comments: null,
      event_support_options: null,
      membership_status: null
    },
    type: "new_booking"
  };
  console.log('payload', payload)
  const triggerAuth = Deno.env.get('TRIGGER_AUTH') ?? ''
  console.log('triggerAuth', triggerAuth)
  const { data, error } = await client.functions.invoke('bookingnotifications', {
    body: payload,
    headers: {
      'x-supabase-webhook-source': triggerAuth
    }
  })
  console.log('data', data)
  console.log('error', error)
  if (error) {
    throw new Error('Invalid response: ' + error.message + "(" + error.context.status + ": " + error.context.statusText + ")")
  }
  assertEquals(data.success, true)
  assertEquals(data.message, "Notification email sent")
}); 