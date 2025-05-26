
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FormData, formSchema } from "@/components/booking/BookingFormSchema";
import { BookingForm } from "@/components/booking/BookingForm";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/rooms";
import { useBookingFormOperations } from "@/hooks/useBookingFormOperations";
import { createDefaultFormValues, transformBookingToFormData } from "@/utils/formDefaults";

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBookingById } = useBooking();
  const [searchParams] = useSearchParams();
  const copyFromId = searchParams.get('copy');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<FormData | null>(null);
  const { handleCreateBooking } = useBookingFormOperations();

  const defaultEmail = user?.email || "";
  const enhancedRooms = rooms;

  useEffect(() => {
    if (copyFromId) {
      // Copy from an existing booking
      const sourceBooking = getBookingById(copyFromId);
      if (sourceBooking) {
        const formData = transformBookingToFormData(sourceBooking);
        // Reset the email and name to current user
        formData.email = defaultEmail;
        formData.name = user?.name || "";
        setDefaultValues(formData);
        setSelectedRoomId(formData.roomId);
      } else {
        // If booking not found, use defaults
        setDefaultValues(createDefaultFormValues(defaultEmail));
      }
    } else {
      // Regular new booking
      setDefaultValues(createDefaultFormValues(defaultEmail, {
        roomId: selectedRoomId || "",
      }));
    }
  }, [copyFromId, getBookingById, defaultEmail, user?.name, selectedRoomId]);

  const onSubmit = async (data: FormData, clearDraft: () => Promise<void>) => {
    await handleCreateBooking(data, enhancedRooms, clearDraft);
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!defaultValues) {
    return <div>Loading...</div>;
  }

  return (
    <BookingForm
      isEdit={false}
      rooms={enhancedRooms}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
      skipDraftLoading={!!copyFromId}
    />
  );
};

export default NewBookingPage;
