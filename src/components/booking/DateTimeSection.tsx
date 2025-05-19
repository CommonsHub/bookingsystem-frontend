
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Control } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { formSchema } from "./BookingFormSchema";
import { parse } from "chronos-js";
import { toast } from "@/components/ui/toast-utils";

type FormData = z.infer<typeof formSchema>;

interface DateTimeSectionProps {
  control: Control<FormData>;
}

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  
  // Effect to handle start date natural language parsing
  const handleStartDateParse = (text: string, onChange: (value: any) => void) => {
    try {
      if (!text) return;
      
      const parsedDate = parse(text);
      
      if (parsedDate && parsedDate.isValid()) {
        const date = parsedDate.toDate();
        
        // Update the form with the parsed date
        onChange({
          date: date,
          startTime: format(date, "HH:mm")
        });
        
        toast.success(`Start time set to ${format(date, "PPP 'at' h:mm a")}`);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      toast.error("Couldn't understand that date format. Try something like 'tomorrow at 3pm'");
    }
  };
  
  // Effect to handle end date natural language parsing
  const handleEndDateParse = (text: string, startDate: Date | undefined, onChange: (value: string) => void) => {
    try {
      if (!text || !startDate) return;
      
      const parsedDate = parse(text, { referenceDate: startDate });
      
      if (parsedDate && parsedDate.isValid()) {
        const date = parsedDate.toDate();
        
        // Ensure end date is after start date
        if (date < startDate) {
          toast.error("End time must be after start time");
          return;
        }
        
        // If it's the same day, just extract the time
        onChange(format(date, "HH:mm"));
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
                  onBlur={() => handleStartDateParse(startDateText, (value) => {
                    if (value.date) field.onChange(value.date);
                    if (value.startTime) {
                      const startTimeField = control._formValues.startTime;
                      control._formState.dirtyFields.startTime = true;
                      control._fields.startTime?._f.onChange(value.startTime);
                    }
                  })}
                  className="flex-1"
                />
              </div>
            </FormControl>
            {field.value && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(field.value, "PPP")}
                {control._formValues.startTime && ` at ${control._formValues.startTime}`}
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
                    const date = control._formValues.date;
                    if (date) {
                      handleEndDateParse(endDateText, date, field.onChange);
                    } else {
                      toast.error("Please set a start date first");
                    }
                  }}
                  className="flex-1"
                />
              </div>
            </FormControl>
            {field.value && control._formValues.date && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(control._formValues.date, "PPP")} at {field.value}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
