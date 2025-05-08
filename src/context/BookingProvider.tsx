import { toast } from "@/components/ui/toast-utils";
import { generateMockBookings } from "@/data/mockData";
import { useBookingOperations } from "@/hooks/useBookingOperations";
import { useVerification } from "@/hooks/useVerification";
import { supabase } from "@/integrations/supabase/client";
import { Booking, User } from "@/types";
import { getStorageUser, saveStorageUser } from "@/utils/storage-helpers";
import React, { useEffect, useState } from "react";
import { BookingContext } from "./BookingContext";

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const { createBooking, addCommentToBooking, approveBookingRequest } =
    useBookingOperations(bookings, setBookings);
  const { verifyBookingEmail, verifyCommentEmail } = useVerification(
    bookings,
    setBookings,
    setUser,
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching bookings:", error);
          setBookings(generateMockBookings());
          return;
        }

        if (!data || data.length === 0) {
          console.log("No bookings found in database, loading mock data");
          setBookings(generateMockBookings());
          return;
        }

        const transformedBookings: Booking[] = data.map((booking) => ({
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
          status: booking.status as
            | "draft"
            | "pending"
            | "approved"
            | "rejected",
          createdAt: booking.created_at,
          createdBy: {
            email: booking.created_by_email,
            name: booking.created_by_name || "",
            verified: true,
          },
          comments: [],
          approvedBy: booking.approved_by_email
            ? {
                email: booking.approved_by_email,
                verified: true,
              }
            : undefined,
          approvedAt: booking.approved_at,
        }));

        setBookings(transformedBookings);
      } catch (error) {
        console.error("Error in fetchBookings:", error);
        toast.error("Failed to fetch bookings");
        setBookings(generateMockBookings());
      }
    };

    const storedUser = getStorageUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      const demoUser = saveStorageUser(
        "demo.user@example.com",
        "Demo User",
        true,
      );
      setUser(demoUser);
    }

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
        verifyBookingEmail,
        verifyCommentEmail,
        approveBookingRequest: (id: string) => approveBookingRequest(id, user!),
        getUserEmail,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
