
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
import { UrlFieldsSection } from "@/components/booking/UrlFieldsSection";
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
  const { id } = useParams<{ id: string }>();
  const { getBookingById, updateBooking, user } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user: authUser } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize draft functionality for editing
  const { saveDraft, loadDraft, clearDraft, isLoading: isDraftLoading, isDraftCleared } = useDraftBooking(id);

  // Get the booking data
  const booking = id ? getBookingById(id) : undefined;

  // Setup form with zodResolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      roomId: "",
      setupOption: "",
      requiresAdditionalSpace: false,
      startDate: undefined,
      endDate: undefined,
      email: authUser?.email || "",
      name: authUser?.name || "",
      cateringOptions: [],
      cateringComments: "",
      eventSupportOptions: [],
      membershipStatus: "",
      additionalComments: "",
      isPublicEvent: false,
      lumaEventUrl: "",
      calendarUrl: "",
      publicUri: "",
      roomNotes: "",
    },
  });

  // Load booking data into form
  useEffect(() => {
    if (booking) {
      // Find the room in our rooms data
      const selectedRoom = rooms.find(room => room.id === booking.room.id);
      
      if (selectedRoom) {
        setSelectedRoomId(selectedRoom.id);
      }
      
      // Convert string dates to Date objects
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      
      const bookingFormData = {
        title: booking.title,
        description: booking.description,
        roomId: booking.room.id,
        setupOption: booking.selectedSetup || "",
        requiresAdditionalSpace: booking.requiresAdditionalSpace || false,
        startDate: startDate,
        endDate: endDate,
        email: booking.createdBy.email,
        name: booking.createdBy.name || "",
        additionalComments: booking.additionalComments || "",
        isPublicEvent: booking.isPublicEvent || false,
        organizer: booking.organizer || "",
        estimatedAttendees: booking.estimatedAttendees,
        // We're not handling these fields as they might not be stored
        cateringOptions: [],
        cateringComments: "",
        eventSupportOptions: [],
        membershipStatus: "",
        // New URL fields
        lumaEventUrl: booking.lumaEventUrl || "",
        calendarUrl: booking.calendarUrl || "",
        publicUri: booking.publicUri || "",
        // New room notes field
        roomNotes: booking.roomNotes || "",
      };

      // Check if there's a draft with more recent changes
      loadDraft().then(draftData => {
        if (draftData && draftData.updatedAt) {
          const draftTime = new Date(draftData.updatedAt);
          const bookingTime = new Date(booking.updatedAt || booking.createdAt);
          
          // If draft is newer, use draft data and notify user
          if (draftTime > bookingTime) {
            form.reset(draftData);
            if (draftData.roomId) {
              setSelectedRoomId(draftData.roomId);
            }
            toast.success(t('messages.draftLoaded'));
          } else {
            // Use original booking data
            form.reset(bookingFormData);
          }
        } else {
          // No draft, use original booking data
          form.reset(bookingFormData);
        }
        setLoading(false);
      });
    }
  }, [booking, form, loadDraft, t]);

  // Auto-save form changes as draft
  useEffect(() => {
    if (loading || isDraftCleared) return;

    const subscription = form.watch((formValues) => {
      // Debounce the auto-save
      if (autoSaveTimerId) {
        clearTimeout(autoSaveTimerId);
      }

      // Only save if there are actual values and form is not loading
      if (!loading && (formValues.title || formValues.description)) {
        const timerId = setTimeout(() => {
          const dataToSave = {
            ...formValues,
            updatedAt: new Date().toISOString(),
          };
          saveDraft(dataToSave);
        }, 2000); // Save after 2 seconds of inactivity

        setAutoSaveTimerId(timerId);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, saveDraft, loading, isDraftCleared, autoSaveTimerId]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      // Find the selected room
      const selectedRoom = rooms.find(
        (room) => room.id === data.roomId,
      ) as Room;

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Update booking
      await updateBooking(id, {
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
        estimatedAttendees: data.estimatedAttendees,
        lumaEventUrl: data.lumaEventUrl,
        calendarUrl: data.calendarUrl, 
        publicUri: data.publicUri,
        roomNotes: data.roomNotes,
      });

      // Clear draft after successful update
      await clearDraft();

      toast.success(t('messages.bookingUpdated'));
      navigate(`/bookings/${id}`);
    } catch (error) {
      toast.error(t('messages.bookingUpdateError'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>{t('messages.loadingBooking')}</div>;
  }

  if (!booking) {
    return <div>{t('messages.bookingNotFound')}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('bookings.edit')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('bookings.editDescription')}
          {isDraftLoading && ` (${t('messages.savingDraft')})`}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{t('bookings.editTitle')}</CardTitle>
              <CardDescription>
                {t('bookings.editDescription')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <BookingInfoSection control={form.control} />

              <Separator />

              <DateTimeSection control={form.control} />

              <Separator />

              <RoomSelectionSection
                control={form.control}
                rooms={rooms}
                selectedRoomId={selectedRoomId}
                setSelectedRoomId={setSelectedRoomId}
              />

              <Separator />

              <UrlFieldsSection control={form.control} />

              <Separator />

              <ContactInfoSection control={form.control} />

              <Separator />

              <AdditionalInfoSection control={form.control} />
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/bookings/${id}`)}
              >
                {t('buttons.cancel')}
              </Button>
              <Button type="submit" disabled={submitting}>
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
