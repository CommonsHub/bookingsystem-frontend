
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdditionalInfoSection } from "@/components/booking/AdditionalInfoSection";
import { FormData, formSchema } from "@/components/booking/BookingFormSchema";
import { BookingInfoSection } from "@/components/booking/BookingInfoSection";
import { CateringSection } from "@/components/booking/CateringSection";
import { ContactInfoSection } from "@/components/booking/ContactInfoSection";
import { DateTimeSection } from "@/components/booking/DateTimeSection";
import { EventSupportSection } from "@/components/booking/EventSupportSection";
import { MembershipSection } from "@/components/booking/MembershipSection";
import { RoomSelectionSection } from "@/components/booking/RoomSelectionSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
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
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  // Use draft booking hook for edit mode
  const { saveDraft, loadDraft, clearDraft, resetClearedFlag, isLoading, isDraftCleared } = useDraftBooking(bookingId);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);

  const defaultEmail = user?.email || "";

  const enhancedRooms = rooms;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      roomId: selectedRoomId || "",
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
    },
  });

  // Find the booking to edit
  const booking = bookings.find((b) => b.id === bookingId);

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
        
        if (draftData && !draftLoaded) {
          // Use draft data if available
          form.reset(draftData);
          if (draftData.roomId) {
            setSelectedRoomId(draftData.roomId);
          }
          setDraftLoaded(true);
          toast.success(t('messages.draftLoaded'));
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

          form.reset(formData);
          setSelectedRoomId(booking.room.id);
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
        toast.error("Error loading booking data");
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [bookingId, booking, form, loadDraft, draftLoaded, navigate, t]);

  // Auto-save form values when they change
  useEffect(() => {
    // Don't auto-save if draft was cleared or still loading
    if (isDraftCleared || loading) return;

    // Watch for form changes
    const subscription = form.watch((formValues) => {
      // Debounce the auto-save to prevent too many saves
      if (autoSaveTimerId) {
        clearTimeout(autoSaveTimerId);
      }

      // Only save if there are actual values and draft wasn't cleared
      if ((formValues.title || formValues.description || formValues.roomId) && !isDraftCleared) {
        const timerId = setTimeout(() => {
          const dataToSave = {
            ...formValues,
            selectedRoom: enhancedRooms.find(r => r.id === formValues.roomId)
          };
          saveDraft(dataToSave);
        }, 2000); // Save after 2 seconds of inactivity

        setAutoSaveTimerId(timerId);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form, saveDraft, isDraftCleared, autoSaveTimerId, enhancedRooms, loading]);

  const onSubmit = async (data: FormData) => {
    if (!booking) return;

    setSubmitting(true);
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

      // Clear the draft data after successful submission
      await clearDraft();

      toast.success(t('messages.bookingUpdated'));
      navigate(`/bookings/${booking.id}`);
    } catch (error) {
      toast.error(t('messages.bookingUpdateError'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearDraft = async () => {
    if (!booking) return;

    // Clear the draft data
    await clearDraft();

    // Reset form to original booking data
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

    form.reset(formData);
    setSelectedRoomId(booking.room.id);
    setDraftLoaded(false);

    toast.success(t('messages.draftCleared'));
  };

  const handleStartNewDraft = () => {
    resetClearedFlag();
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('bookings.editTitle')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('bookings.editDescription')}
          {isLoading && ` (${t('messages.savingDraft')})`}
          {!isLoading && draftLoaded && ` (${t('messages.draftLoaded')})`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{t('bookings.roomBookingDetails')}</CardTitle>
              <CardDescription>
                {t('bookings.enterDetails')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <BookingInfoSection control={form.control} />

              <Separator />

              <DateTimeSection control={form.control} />

              <Separator />

              <RoomSelectionSection
                control={form.control}
                rooms={enhancedRooms}
                selectedRoomId={selectedRoomId}
                setSelectedRoomId={setSelectedRoomId}
              />

              <Separator />

              <CateringSection control={form.control} />

              <Separator />

              <EventSupportSection control={form.control} />

              <Separator />

              <ContactInfoSection control={form.control} />
              <MembershipSection control={form.control} />

              <Separator />
              <AdditionalInfoSection control={form.control} />

            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                >
                  {t('buttons.cancel')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearDraft}
                >
                  {t('buttons.clearDraft')}
                </Button>
              </div>
              <Button type="submit" disabled={submitting} onClick={handleStartNewDraft}>
                {submitting ? t('buttons.updating') : t('buttons.update')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditBookingPage;
