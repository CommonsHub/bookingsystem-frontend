
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FormData } from "@/components/booking/BookingFormSchema";
import { BookingForm } from "@/components/booking/BookingForm";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/rooms";
import { useDraftBooking } from "@/hooks/useDraftBooking";
import { Room } from "@/types";

const EditBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, updateBooking } = useBooking();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { loadDraft } = useDraftBooking(bookingId);

  const defaultEmail = user?.email || "";
  const enhancedRooms = rooms;

  // Find the booking to edit
  const booking = bookings.find((b) => b.id === bookingId);

  const [defaultValues, setDefaultValues] = useState<FormData>({
    title: "",
    description: "",
    roomId: "",
    setupOption: "",
    requiresAdditionalSpace: false,
    startDate: undefined,
    endDate: undefined,
    email: defaultEmail,
    name: "",
    cateringOptions: [],
    cateringComments: "",
    eventSupportOptions: [],
    membershipStatus: "",
    additionalComments: "",
    isPublicEvent: false,
  });

  useEffect(() => {
    if (!bookingId) {
      toast.error(t('messages.bookingIdMissing'));
      navigate("/");
      return;
    }

    if (!booking) {
      toast.error(t('messages.bookingNotFound'));
      navigate("/");
      return;
    }

    // Load existing booking data or draft
    const loadBookingData = async () => {
      try {
        // First try to load any saved draft
        const draftData = await loadDraft();
        
        if (draftData) {
          // Use draft data if available
          setDefaultValues(draftData);
        } else {
          // Use existing booking data
          const formData: FormData = {
            title: booking.title,
            description: booking.description,
            roomId: booking.room.id,
            setupOption: booking.selectedSetup || "",
            requiresAdditionalSpace: booking.requiresAdditionalSpace || false,
            startDate: new Date(booking.startTime),
            endDate: new Date(booking.endTime),
            email: booking.createdBy.email,
            name: booking.createdBy.name,
            cateringOptions: [],
            cateringComments: "",
            eventSupportOptions: [],
            membershipStatus: "",
            additionalComments: booking.additionalComments || "",
            isPublicEvent: booking.isPublicEvent || false,
            organizer: booking.organizer,
            estimatedAttendees: booking.estimatedAttendees,
          };

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
  }, [bookingId, booking, loadDraft, navigate, t]);

  const handleSubmit = async (data: FormData) => {
    if (!booking) return;

    try {
      // Find the selected room
      const selectedRoom = enhancedRooms.find(
        (room) => room.id === data.roomId,
      ) as Room;

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Update booking with correct type structure
      await updateBooking(booking.id, {
        title: data.title,
        description: data.description,
        room: selectedRoom,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        selectedSetup: data.setupOption,
        requiresAdditionalSpace: data.requiresAdditionalSpace,
        additionalComments: data.additionalComments,
        isPublicEvent: data.isPublicEvent,
        organizer: data.organizer,
        estimatedAttendees: data.estimatedAttendees
      });

      toast.success(t('messages.bookingUpdated'));
      navigate(`/bookings/${booking.id}`);
    } catch (error) {
      toast.error(t('messages.bookingUpdateError'));
      console.error(error);
      throw error;
    }
  };

  const handleCancel = () => {
    if (booking) {
      navigate(`/bookings/${booking.id}`);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <p>{t('messages.loadingBooking')}</p>
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
