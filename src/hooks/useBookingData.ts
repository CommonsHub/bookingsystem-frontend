
import { useState, useEffect } from "react";
import {
  Booking,
  BookingDatabaseFields,
  BookingStatus,
  Comment,
  User,
} from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useBookingData = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: bookingsData, error } = await supabase
          .from("bookings")
          .select("*")
          .order("start_time", { ascending: true });

        if (error) {
          console.error("Error fetching bookings:", error);
          return;
        }

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*");

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
          return;
        }

        // Transform bookings data from snake_case to camelCase
        const transformedBookings: Booking[] = (
          bookingsData as BookingDatabaseFields[]
        ).map((booking) => {
          // Group comments by booking ID
          const bookingComments = commentsData
            ? commentsData
                .filter((comment) => comment.booking_id === booking.id)
                .map((comment) => ({
                  id: comment.id,
                  bookingId: comment.booking_id,
                  content: comment.content,
                  createdAt: comment.created_at,
                  createdBy: {
                    id: crypto.randomUUID(),
                    email: comment.created_by_email,
                    name: comment.created_by_name || undefined,
                  },
                  status: comment.status as "draft" | "published",
                }))
            : [];

          return {
            id: booking.id,
            title: booking.title,
            description: booking.description || "",
            room: {
              id: booking.room_id,
              name: booking.room_name,
              capacity: booking.room_capacity || "0",
              location: "Commons Hub", // Default location
            },
            startTime: booking.start_time,
            endTime: booking.end_time,
            status: booking.status as BookingStatus,
            createdAt: booking.created_at,
            createdBy: {
              id: crypto.randomUUID(),
              email: booking.created_by_email,
              name: booking.created_by_name,
            },
            comments: bookingComments,
            approvedBy: booking.approved_by_email
              ? {
                  id: crypto.randomUUID(),
                  email: booking.approved_by_email,
                }
              : undefined,
            approvedAt: booking.approved_at,
            additionalComments: booking.additional_comments,
            isPublicEvent: booking.is_public_event,
            cancelledAt: booking.cancelled_at,
            cancelledBy: booking.cancelled_by_email
              ? {
                  id: crypto.randomUUID(),
                  email: booking.cancelled_by_email,
                }
              : undefined,
            // Adding new fields
            organizer: booking.organizer,
            estimatedAttendees: booking.estimated_attendees,
            lumaEventUrl: booking.luma_event_url,
            calendarUrl: booking.calendar_url,
            publicUri: booking.public_uri,
            language: booking.language || "en",
            price: booking.price ? Number(booking.price) : undefined,
            currency: booking.currency || "EUR",
            // Map the new database fields properly
            cateringOptions: booking.catering_options || [],
            cateringComments: booking.catering_comments,
            eventSupportOptions: booking.event_support_options || [],
            membershipStatus: booking.membership_status,
          };
        });

        setBookings(transformedBookings);
      } catch (error) {
        console.error("Error in useBookingData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, setBookings, loading };
};
