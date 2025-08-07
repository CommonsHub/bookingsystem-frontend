import { supabase } from "@/integrations/supabase/client";

// Edge function URL
const EDGE_FUNCTION_URL = 'https://sokfvqtgpbeybjifaywh.supabase.co/functions/v1/bookingnotifications';

// Type definitions for edge function payloads
interface EdgeFunctionPayload {
  record: Record<string, unknown>;
  type: string;
}

// Function to call the edge function using Supabase's built-in function invocation
export async function callEdgeFunction(payload: EdgeFunctionPayload): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Use Supabase's built-in function invocation which handles authentication
    const { data, error } = await supabase.functions.invoke('bookingnotifications', {
      body: payload,
    });

    if (error) {
      console.error('Edge function error:', error);
      return { success: false, error: error.message || 'Failed to call edge function' };
    }

    return { success: true, message: data?.message || 'Success' };
  } catch (error) {
    console.error('Error calling edge function:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Helper function to create booking payload
export function createBookingPayload(booking: Record<string, unknown>, type: 'new_booking' | 'confirmed_booking'): EdgeFunctionPayload {
  return {
    record: {
      id: booking.id,
      title: booking.title,
      description: booking.description,
      room_id: booking.room_id,
      room_name: booking.room_name,
      room_capacity: booking.room_capacity,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: booking.status,
      created_by_email: booking.created_by_email,
      created_by_name: booking.created_by_name,
      created_at: booking.created_at,
      approved_by_email: booking.approved_by_email,
      approved_at: booking.approved_at,
      additional_comments: booking.additional_comments,
      is_public_event: booking.is_public_event,
      cancelled_at: booking.cancelled_at,
      cancelled_by_email: booking.cancelled_by_email,
      organizer: booking.organizer,
      estimated_attendees: booking.estimated_attendees,
      luma_event_url: booking.luma_event_url,
      calendar_url: booking.calendar_url,
      public_uri: booking.public_uri,
      language: booking.language,
      price: booking.price,
      currency: booking.currency,
      catering_options: booking.catering_options,
      catering_comments: booking.catering_comments,
      event_support_options: booking.event_support_options,
      membership_status: booking.membership_status
    },
    type
  };
}

// Helper function to create request payload
export function createRequestPayload(request: Record<string, unknown>, type: 'new_request'): EdgeFunctionPayload {
  return {
    record: {
      id: request.id,
      title: request.title,
      description: request.description,
      request_type: request.request_type,
      priority: request.priority,
      status: request.status,
      created_by_email: request.created_by_email,
      created_by_name: request.created_by_name,
      created_at: request.created_at,
      email: request.email,
      name: request.name,
      phone: request.phone,
      organization: request.organization,
      expected_completion_date: request.expected_completion_date,
      additional_details: request.additional_details,
      attachments: request.attachments,
      language: request.language,
      completed_at: request.completed_at,
      completed_by_email: request.completed_by_email,
      cancelled_at: request.cancelled_at,
      cancelled_by_email: request.cancelled_by_email
    },
    type
  };
}

// Helper function to create request comment payload
export function createRequestCommentPayload(comment: Record<string, unknown>, type: 'new_request_comment'): EdgeFunctionPayload {
  return {
    record: {
      comment_id: comment.id,
      request_id: comment.request_id,
      content: comment.content,
      created_at: comment.created_at,
      created_by_email: comment.created_by_email,
      created_by_name: comment.created_by_name,
      status: comment.status
    },
    type
  };
} 