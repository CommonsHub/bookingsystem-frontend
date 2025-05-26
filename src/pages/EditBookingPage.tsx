
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
import { useDraftBooking } from "@/hooks/useDraftBooking";
import { useBookingFormOperations } from "@/hooks/useBookingFormOperations";
import { createDefaultFormValues, transformBookingToFormData } from "@/utils/formDefaults";

const EditBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, loading: bookingsLoading } = useBooking();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { loadDraft } = useDraftBooking(bookingId);
  const { handleUpdateBooking } = useBookingFormOperations();

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

    const loadBookingData = async () => {
      try {
        const draftData = await loadDraft();
        
        if (draftData) {
          setDefaultValues(draftData);
        } else {
          const formData = transformBookingToFormData(booking);
          setDefaultValues(formData);
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
        toast.error("Error loading booking data");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId, booking, bookingsLoading, loadDraft, navigate, t]);

  const handleSubmit = async (data: FormData) => {
    if (!booking) return;
    await handleUpdateBooking(booking.id, data, enhancedRooms);
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
      isEdit={true}
      bookingId={bookingId}
      rooms={enhancedRooms}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditBookingPage;
