// Will load the .env file to Deno.env
import 'jsr:@std/dotenv/load'
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { assertEquals } from "jsr:@std/assert";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
}

Deno.test("invoke booking-notification for booking approval", async () => {
  const client: SupabaseClient = createClient(supabaseUrl, supabaseKey, options)
  const payload = {
    record: {
      id: 2,
      title: "Approved Booking",
      description: "A booking that has been approved",
      room_id: 102,
      room_name: "Approved Room",
      room_capacity: 20,
      start_time: "2024-06-02T10:00:00Z",
      end_time: "2024-06-02T12:00:00Z",
      status: "approved",
      created_by_email: "approver@example.com",
      created_by_name: "Approver User",
      created_at: "2024-06-02T09:00:00Z",
      approved_by_email: "admin@example.com",
      approved_at: "2024-06-02T09:30:00Z"
    },
    type: "confirmed_booking"
  };

  const { data, error } = await client.functions.invoke('bookingnotifications', {
    headers: {
      'x-supabase-webhook-source': Deno.env.get('TRIGGER_AUTH') ?? ''
    },
    body: payload,
  })
  if (error) {
    throw new Error('Invalid response: ' + error.message + "(" + error.context.status + ": " + error.context.statusText + ")")
  }
  assertEquals(data.success, true)
  assertEquals(data.message, "Notification email sent")
}); 