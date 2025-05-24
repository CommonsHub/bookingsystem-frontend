
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

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
import { Room } from "@/types";

const EditBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBookingById, updateBooking, user } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user: authUser } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      // Reset form with booking data
      form.reset({
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
      });
      
      setLoading(false);
    }
  }, [booking, form]);

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
        publicUri: data.publicUri
      });

      toast.success("Booking updated successfully!");
      navigate(`/bookings/${id}`);
    } catch (error) {
      toast.error("Failed to update booking");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading booking details...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Booking
        </h1>
        <p className="text-muted-foreground mt-1">
          Update the booking request details
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Booking Details</CardTitle>
              <CardDescription>
                Update the details of your booking request
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
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Booking"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditBookingPage;
