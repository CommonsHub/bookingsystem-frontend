
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormData, formSchema } from "@/components/booking/BookingFormSchema";
import { BookingForm } from "@/components/booking/BookingForm";
import { useAuth } from "@/context/AuthContext";
import { rooms } from "@/data/rooms";
import { useBookingFormOperations } from "@/hooks/useBookingFormOperations";
import { createDefaultFormValues } from "@/utils/formDefaults";

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { handleCreateBooking } = useBookingFormOperations();

  const defaultEmail = user?.email || "";
  const enhancedRooms = rooms;

  const defaultValues = createDefaultFormValues(defaultEmail, {
    roomId: selectedRoomId || "",
  });

  const onSubmit = async (data: FormData, clearDraft: () => Promise<void>) => {
    await handleCreateBooking(data, enhancedRooms, clearDraft);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <BookingForm
      isEdit={false}
      rooms={enhancedRooms}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  );
};

export default NewBookingPage;
