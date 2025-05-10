
import { toast } from "@/components/ui/toast-utils";
import { generateMockBookings } from "@/data/mockData";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingStatus, User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { BookingContext } from "./BookingContext";
import { useAuth } from "./AuthContext";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  const { createBooking, addCommentToBooking, approveBookingRequest } =
    useBookingOperations(bookings, setBookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (bookingsError) {
          console.error("Error fetching bookings:", bookingsError);
          setBookings(generateMockBookings());
          return;
        }

        if (!bookingsData || bookingsData.length === 0) {
          console.log("No bookings found in database, loading mock data");
          setBookings(generateMockBookings());
          return;
        }

        // Fetch comments for all bookings
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*");

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        }

        // Group comments by booking_id
        const commentsByBookingId: Record<string, any[]> = {};
        if (commentsData) {
          commentsData.forEach(comment => {
            if (!commentsByBookingId[comment.booking_id]) {
              commentsByBookingId[comment.booking_id] = [];
            }
            commentsByBookingId[comment.booking_id].push(comment);
          });
        }

        const transformedBookings: Booking[] = bookingsData.map((booking) => {
          // Transform comments for this booking
          const bookingComments = commentsByBookingId[booking.id] || [];
          const transformedComments = bookingComments.map(comment => ({
            id: comment.id,
            bookingId: comment.booking_id,
            content: comment.content,
            createdAt: comment.created_at,
            createdBy: {
              id: uuidv4(), // Generate a temporary ID for the user
              email: comment.created_by_email,
              name: comment.created_by_name || "",
              verified: true,
            },
            status: comment.status,
          }));

          return {
            id: booking.id,
            title: booking.title,
            description: booking.description || "",
            room: {
              id: booking.room_id,
              name: booking.room_name,
              capacity: booking.room_capacity,
              location: "Main Building",
            },
            startTime: booking.start_time,
            endTime: booking.end_time,
            status: booking.status as BookingStatus,
            createdAt: booking.created_at,
            createdBy: {
              id: uuidv4(), // Generate a temporary ID for the user
              email: booking.created_by_email,
              name: booking.created_by_name || "",
              verified: true,
            },
            comments: transformedComments,
            approvedBy: booking.approved_by_email
              ? {
                  id: uuidv4(), // Generate a temporary ID for the approver
                  email: booking.approved_by_email,
                  verified: true,
                }
              : undefined,
            approvedAt: booking.approved_at,
          };
        });

        setBookings(transformedBookings);
      } catch (error) {
        console.error("Error in fetchBookings:", error);
        toast.error("Failed to fetch bookings");
        setBookings(generateMockBookings());
      }
    };

    fetchBookings();
  }, []);

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((booking) => booking.id === id);
  };

  const getUserEmail = (): string | null => {
    return user?.email || null;
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        user,
        createBooking,
        addCommentToBooking,
        getBookingById,
        approveBookingRequest: (id: string) => approveBookingRequest(id, user!),
        getUserEmail,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
