
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

interface BookingInfoSectionProps {
  control: Control<FormData>;
}

export const BookingInfoSection = ({ control }: BookingInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Brief description of your meeting"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide details about the purpose of the booking"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="organizer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Organizer</FormLabel>
            <FormControl>
              <Input
                placeholder="Name of the person or organization running the event"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="estimatedAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimated Number of Attendees</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Expected number of participants"
                {...field}
                value={field.value === undefined ? "" : field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
};
