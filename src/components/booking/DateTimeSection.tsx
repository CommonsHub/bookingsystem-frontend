
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { toast } from "@/components/ui/toast-utils";
import * as Chrono from "chrono-node";

type FormData = z.infer<typeof formSchema>;

interface DateTimeSectionProps {
  control: Control<FormData>;
}

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const { setValue, getValues } = useFormContext<FormData>();
  const now = new Date();

  // Function to handle start date natural language parsing
  const handleStartDateParse = (text: string) => {
    try {
      if (!text) return;

      const parseResult = Chrono.parse(text, {
        instant: now,
        timezone: "CET"
      }, {
        forwardDate: true,
      });

      if (parseResult && parseResult.length > 0) {
        const date = parseResult[0].date()

        // Update the form values using setValue from react-hook-form
        setValue("date", date);
        setValue("startTime", format(date, "HH:mm"));

        toast.success(`Start time set to ${format(date, "PPP 'at' h:mm a")}`);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      toast.error("Couldn't understand that date format. Try something like 'tomorrow at 3pm'");
    }
  };

  // Function to handle end date natural language parsing
  const handleEndDateParse = (text: string, startDate: Date | undefined) => {
    try {
      if (!text || !startDate) return;

      const parseResult = Chrono.parse(text, {
        instant: now,
        timezone: "CET"
      }, {
        forwardDate: true,
      });

      if (parseResult && parseResult.length > 0) {
        const date = parseResult[0].date()

        // Ensure end date is after start date
        if (date < startDate) {
          toast.error("End time must be after start time");
          return;
        }

        // If it's the same day, just extract the time
        setValue("endTime", format(date, "HH:mm"));
        toast.success(`End time set to ${format(date, "h:mm a")}`);
      }
    } catch (error) {
      console.error("Error parsing end date:", error);
      toast.error("Couldn't understand that time format. Try something like '2 hours later' or '5pm'");
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date & Time</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="e.g., tomorrow at 2pm, next Monday at 10am"
                  value={startDateText}
                  onChange={(e) => setStartDateText(e.target.value)}
                  onBlur={() => handleStartDateParse(startDateText)}
                  className="flex-1"
                />
              </div>
            </FormControl>
            {field.value && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(field.value, "PPP")}
                {getValues("startTime") && ` at ${getValues("startTime")}`}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <div className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="e.g., 4pm, 2 hours later, 5:30pm"
                  value={endDateText}
                  onChange={(e) => setEndDateText(e.target.value)}
                  onBlur={() => {
                    const date = getValues("date");
                    if (date) {
                      handleEndDateParse(endDateText, date);
                    } else {
                      toast.error("Please set a start date first");
                    }
                  }}
                  className="flex-1"
                />
              </div>
            </FormControl>
            {field.value && getValues("date") && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(getValues("date"), "PPP")} at {field.value}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
