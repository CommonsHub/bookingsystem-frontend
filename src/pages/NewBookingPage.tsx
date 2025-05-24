
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import {
  Form,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/rooms";
import { useDraftBooking } from "@/hooks/useDraftBooking";
import { Room } from "@/types";

const NewBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { saveDraft, loadDraft, clearDraft, isLoading } = useDraftBooking();
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);
  const shouldAutoSave = useRef<boolean>(true);

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

  // Load saved draft on initial render
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const draftData = await loadDraft();
        if (draftData && !draftLoaded) {
          form.reset(draftData);
          if (draftData.roomId) {
            setSelectedRoomId(draftData.roomId);
          }
          setDraftLoaded(true);
          toast.success("Draft booking loaded");
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    fetchDraft();
  }, [form, loadDraft, draftLoaded]);

  // Auto-save form values when they change
  useEffect(() => {
    // Watch for form changes
    const subscription = form.watch((formValues) => {
      // Don't auto-save if we just cleared the draft
      if (!shouldAutoSave.current) {
        return;
      }

      // Debounce the auto-save to prevent too many saves
      if (autoSaveTimerId) {
        clearTimeout(autoSaveTimerId);
      }

      // Only save if there are actual values
      if (formValues.title || formValues.description || formValues.roomId) {
        const timerId = setTimeout(() => {
          // Add timestamp to detect which version is newer
          const dataToSave = {
            ...formValues,
            updatedAt: new Date().toISOString(),
            selectedRoom: enhancedRooms.find(r => r.id === formValues.roomId)
          };
          saveDraft(dataToSave);
        }, 2000); // Save after 2 seconds of inactivity

        setAutoSaveTimerId(timerId);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form, saveDraft]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Find the selected room
      const selectedRoom = enhancedRooms.find(
        (room) => room.id === data.roomId,
      ) as Room;

      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Create booking with correct type structure
      const bookingId = await createBooking({
        title: data.title,
        description: data.description,
        room: selectedRoom,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        createdBy: {
          id: user?.id || crypto.randomUUID(),
          email: data.email,
          name: data.name,
          verified: false
        },
        selectedSetup: data.setupOption,
        requiresAdditionalSpace: data.requiresAdditionalSpace,
        additionalComments: data.additionalComments,
        isPublicEvent: data.isPublicEvent,
        // Add new fields
        organizer: data.organizer,
        estimatedAttendees: data.estimatedAttendees
      });

      // Clear the draft data after successful submission
      await clearDraft();

      // Updated message to remove reference to email verification
      toast.success(
        "Booking request submitted! It will be viewed by an administrator."
      );
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error("There was an error creating your booking request.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearDraft = async () => {
    // Prevent auto-saving during form reset
    shouldAutoSave.current = false;

    // Clear the draft data
    await clearDraft();

    // Reset form to default values
    form.reset({
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
      isPublicEvent: false,
      membershipStatus: "",
      additionalComments: "",
    });

    // Reset UI state
    setSelectedRoomId(null);
    setDraftLoaded(false);

    // Allow auto-saving again after a short delay (to prevent immediate re-save of empty form)
    setTimeout(() => {
      shouldAutoSave.current = true;
    }, 500);

    toast.success("Draft cleared");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('bookings.newTitle')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('bookings.newDescription')}
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
                  onClick={() => navigate("/")}
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
              <Button type="submit" disabled={submitting}>
                {submitting ? t('buttons.submitting') : t('buttons.submit')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewBookingPage;
