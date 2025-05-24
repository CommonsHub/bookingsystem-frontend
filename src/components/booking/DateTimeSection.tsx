import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { toast } from "@/components/ui/toast-utils";
import * as Chrono from "chrono-node";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = z.infer<typeof formSchema>;

interface DateTimeSectionProps {
  control: Control<FormData>;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      const time = `${formattedHour}:${formattedMinute}`;
      options.push({
        value: time,
        label: format(
          new Date().setHours(hour, minute),
          "h:mm a"
        ),
      });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const { setValue, getValues, watch } = useFormContext<FormData>();
  const now = new Date();
  
  // Watch for date changes
  const startDate = watch("startDate");
  const endDate = watch("endDate");

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
        const date = parseResult[0].date();

        // Update the form values using setValue from react-hook-form
        setValue("startDate", date);

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
        instant: startDate, // Use start date as reference
        timezone: "CET"
      }, {
        forwardDate: true,
      });

      if (parseResult && parseResult.length > 0) {
        const date = parseResult[0].date();

        // Ensure end date is after start date
        if (date < startDate) {
          toast.error("End time must be after start time");
          return;
        }

        // Set the end date
        setValue("endDate", date);
        toast.success(`End time set to ${format(date, "h:mm a")}`);
      }
    } catch (error) {
      console.error("Error parsing end date:", error);
      toast.error("Couldn't understand that time format. Try something like '2 hours later' or '5pm'");
    }
  };

  // Helper to combine date and time
  const combineDateAndTime = (date: Date | undefined, timeString: string): Date | undefined => {
    if (!date) return undefined;

    const newDate = new Date(date);
    const [hours, minutes] = timeString.split(':').map(Number);
    
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    
    return newDate;
  };

  // Get time string from date (HH:MM format)
  const getTimeString = (date: Date | undefined): string => {
    if (!date) return "09:00"; // Default to 9 AM
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date & Time</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Date picker */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal flex justify-between items-center",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          // Preserve the time when changing the date
                          const currentDate = field.value || now;
                          date.setHours(
                            currentDate.getHours(),
                            currentDate.getMinutes()
                          );
                          field.onChange(date);
                        }
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time selector */}
              <FormControl>
                <Select
                  value={getTimeString(field.value)}
                  onValueChange={(time) => {
                    const newDate = combineDateAndTime(
                      field.value || new Date(),
                      time
                    );
                    if (newDate) {
                      field.onChange(newDate);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            {/* Keep natural language input as an alternative */}
            <FormControl>
              <div className="flex gap-2 items-center mt-2">
                <Input
                  placeholder="Or type naturally: tomorrow at 2pm, next Monday at 10am"
                  value={startDateText}
                  onChange={(e) => setStartDateText(e.target.value)}
                  onBlur={() => handleStartDateParse(startDateText)}
                  className="flex-1"
                />
              </div>
            </FormControl>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Date picker */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal flex justify-between items-center",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={!startDate}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date && startDate) {
                          // Ensure selected date is not before start date
                          if (date < startDate) {
                            date = new Date(startDate);
                          }
                          
                          // Preserve the time when changing the date
                          const currentDate = field.value || startDate;
                          date.setHours(
                            currentDate.getHours(),
                            currentDate.getMinutes()
                          );
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) => 
                        startDate ? date < new Date(startDate.setHours(0, 0, 0, 0)) : false
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time selector */}
              <FormControl>
                <Select
                  value={getTimeString(field.value)}
                  onValueChange={(time) => {
                    const newDate = combineDateAndTime(
                      field.value || startDate,
                      time
                    );
                    if (newDate) {
                      field.onChange(newDate);
                    }
                  }}
                  disabled={!startDate}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>

            {/* Keep natural language input as an alternative */}
            <FormControl>
              <div className="flex gap-2 items-center mt-2">
                <Input
                  placeholder="Or type naturally: 4pm, 2 hours later, 5:30pm"
                  value={endDateText}
                  onChange={(e) => setEndDateText(e.target.value)}
                  onBlur={() => {
                    const startDate = getValues("startDate");
                    if (startDate) {
                      handleEndDateParse(endDateText, startDate);
                    } else {
                      toast.error("Please set a start date first");
                    }
                  }}
                  className="flex-1"
                  disabled={!startDate}
                />
              </div>
            </FormControl>
            {field.value && (
              <p className="text-sm text-muted-foreground mt-1">
                {format(field.value, "PPP 'at' h:mm a")}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
