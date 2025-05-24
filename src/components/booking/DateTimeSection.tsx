
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { toast } from "@/components/ui/toast-utils";
import { DateTimePicker } from "./DateTimePicker";
import { format } from "date-fns";

type FormData = z.infer<typeof formSchema>;

interface DateTimeSectionProps {
  control: Control<FormData>;
}

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const { getValues, watch } = useFormContext<FormData>();
  
  // Watch for date changes
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date & Time</FormLabel>
            <DateTimePicker 
              label="Start Date & Time"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              naturalLanguagePlaceholder="Or type naturally: tomorrow at 2pm, next Monday at 10am"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date & Time</FormLabel>
            <DateTimePicker 
              label="End Date & Time"
              value={field.value}
              onChange={field.onChange}
              referenceDate={startDate}
              minDate={startDate}
              disabled={!startDate}
              placeholder="Pick end date"
              description={field.value ? format(field.value, "PPP 'at' h:mm a") : undefined}
              naturalLanguagePlaceholder="Or type naturally: 4pm, 2 hours later, 5:30pm"
              onBlur={() => {
                if (!endDate || !startDate) return;
                
                // Validate that end date is after start date
                if (endDate <= startDate) {
                  toast.error("End time must be after start time");
                }
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
