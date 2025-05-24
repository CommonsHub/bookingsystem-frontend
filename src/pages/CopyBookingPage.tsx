
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FormData } from "@/components/booking/BookingFormSchema";
import { BookingForm } from "@/components/booking/BookingForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/rooms";
import { useBookingFormOperations } from "@/hooks/useBookingFormOperations";
import { createDefaultFormValues, transformBookingToFormData } from "@/utils/formDefaults";

const CopyBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, loading: bookingsLoading } = useBooking();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { handleCreateBooking } = useBookingFormOperations();

  const defaultEmail = user?.email || "";
  const enhancedRooms = rooms;
  const booking = bookings.find((b) => b.id === bookingId);

  const [defaultValues, setDefaultValues] = useState<FormData>(
    createDefaultFormValues(defaultEmail)
  );

  useEffect(() => {
    if (!bookingId) {
      toast.error(t('messages.bookingIdMissing'));
      navigate("/");
      return;
    }

    if (bookingsLoading) {
      return; // Wait for bookings to load
    }

    if (!booking) {
      toast.error(t('messages.bookingNotFound'));
      navigate("/");
      return;
    }

    // Only allow copying cancelled bookings
    if (booking.status !== "cancelled") {
      toast.error("Only cancelled bookings can be copied");
      navigate("/");
      return;
    }

    try {
      const formData = transformBookingToFormData(booking);
      // Override email with current user's email
      formData.email = defaultEmail;
      setDefaultValues(formData);
    } catch (error) {
      console.error("Error loading booking data:", error);
      toast.error("Error loading booking data");
    } finally {
      setLoading(false);
    }
  }, [bookingId, booking, bookingsLoading, navigate, t, defaultEmail]);

  const handleSubmit = async (data: FormData, clearDraft: () => Promise<void>) => {
    await handleCreateBooking(data, enhancedRooms, clearDraft);
  };

  const handleCancel = () => {
    if (booking) {
      navigate(`/bookings/${booking.id}`);
    } else {
      navigate("/");
    }
  };

  if (bookingsLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          <div className="border rounded-lg p-6 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="flex gap-3 pt-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <p>{t('messages.bookingNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <BookingForm
      isEdit={false}
      rooms={enhancedRooms}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CopyBookingPage;
