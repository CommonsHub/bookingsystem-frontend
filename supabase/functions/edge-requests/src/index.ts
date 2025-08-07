import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Setup type definitions for built-in Supabase Runtime APIs
import { handleCalendarEntry } from "./handleCalendar.ts";
import { sendEmail } from "./sendEmail.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

export async function handler(req: Request) {
  try {
    // Handle direct function calls from frontend
    // The Supabase client handles authentication automatically
    const payload = await req.json();
    console.log(payload);
    const { record, type } = payload;

    // Create Supabase client for database operations
    const supabaseUrl = (globalThis as any).Deno?.env?.get("SUPABASE_URL");
    const supabaseServiceKey = (globalThis as any).Deno?.env?.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing Supabase configuration",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle database operations based on type
    let dbResult;
    if (type === 'new_booking') {
      dbResult = await supabase.from('bookings').insert(record);
    } else if (type === 'new_request') {
      dbResult = await supabase.from('requests').insert(record);
    } else if (type === 'new_request_comment') {
      dbResult = await supabase.from('request_comments').insert(record);
    } else if (type === 'confirmed_booking') {
      // Update existing booking with approval data
      const { id, ...updateData } = record;
      dbResult = await supabase.from('bookings').update(updateData).eq('id', id);
    } else {
      // For other types, we don't perform database operations
      dbResult = { error: null };
    }

    if (dbResult.error) {
      console.error("Database operation error:", dbResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to perform database operation",
          details: dbResult.error,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    // Send email notifications
    const emailDisabled = (globalThis as any).Deno?.env?.get("EMAIL_DISABLED") === "true";
    if (!emailDisabled) {
      const result = await sendEmail(record, type);
      if (result.error) {
        return result.error;
      }
    } else {
      console.log("Email disabled, skipping email");
    }

    // Handle calendar entries
    const resultCalendar = await handleCalendarEntry(
      record,
      type
    );
    if (resultCalendar && 'error' in resultCalendar && resultCalendar.error) {
      return resultCalendar.error;
    }

    // Log a success message
    console.log(
      `Database operation completed, email sent, and calendar entry handled for ${type}`
    );
    return new Response(
      JSON.stringify({
        success: true,
        message: "Operation completed and notification sent",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    // Log the error
    if (error instanceof Error) {
      console.error("Error processing request:", error.message);
      console.error("Stack trace:", error.stack);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message,
          stack: error.stack,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    } else {
      console.error("Error processing request:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: String(error),
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 400,
        }
      );
    }
  }
}

// @ts-ignore
(globalThis as any).Deno?.serve?.length === 1 ? (globalThis as any).Deno.serve(handler) : (globalThis as any).Deno.serve({ port: 8000 }, handler);
