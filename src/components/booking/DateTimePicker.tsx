
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormControl } from "../ui/form";
import { toast } from "../ui/toast-utils";
import { combineDateAndTime, generateTimeOptions, getTimeString, parseNaturalLanguageDate } from "@/utils/dateTimeUtils";
import { useTranslation } from "react-i18next";

interface DateTimePickerProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  referenceDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
  naturalLanguagePlaceholder?: string;
}

const timeOptions = generateTimeOptions();

export function DateTimePicker({
  label,
  value,
  onChange,
  onBlur,
  referenceDate,
  minDate,
  disabled = false,
  placeholder = "Pick a date",
  description,
  naturalLanguagePlaceholder = "Type naturally"
}: DateTimePickerProps) {
  const [naturalInputText, setNaturalInputText] = useState("");
  const { t, i18n } = useTranslation();

  const handleNaturalLanguageInput = () => {
    try {
      if (!naturalInputText) return;
      
      const parsedDate = parseNaturalLanguageDate(naturalInputText, referenceDate, i18n.language);
      
      if (parsedDate) {
        if (minDate && parsedDate < minDate) {
          toast.error(`Selected time must be after ${format(minDate, "PPP 'at' h:mm a")}`);
          return;
        }
        
        onChange(parsedDate);
        toast.success(`Time set to ${format(parsedDate, "PPP 'at' h:mm a")}`);
      } else {
        toast.error("Couldn't understand that date format");
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      toast.error("Couldn't understand that date format");
    }
  };

  return (
    <div className="space-y-2">
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
                    !value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  {value ? format(value, "PPP") : <span>{placeholder}</span>}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => {
                  if (date) {
                    // Preserve the time when changing the date
                    const currentDate = value || new Date();
                    date.setHours(
                      currentDate.getHours(),
                      currentDate.getMinutes()
                    );
                    
                    // Ensure selected date is not before min date
                    if (minDate && date < minDate) {
                      date = new Date(minDate);
                    }
                    
                    onChange(date);
                  }
                }}
                disabled={minDate ? (date) => date < new Date(minDate.setHours(0, 0, 0, 0)) : undefined}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time selector */}
        <FormControl>
          <Select
            value={getTimeString(value)}
            onValueChange={(time) => {
              const newDate = combineDateAndTime(value || new Date(), time);
              if (newDate) {
                if (minDate && newDate < minDate) {
                  toast.error(`Selected time must be after ${format(minDate, "h:mm a")}`);
                  return;
                }
                onChange(newDate);
              }
            }}
            disabled={disabled}
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

      {/* Natural language input */}
      <FormControl>
        <div className="flex gap-2 items-center mt-2">
          <Input
            placeholder={naturalLanguagePlaceholder}
            value={naturalInputText}
            onChange={(e) => setNaturalInputText(e.target.value)}
            onBlur={() => {
              handleNaturalLanguageInput();
              if (onBlur) onBlur();
            }}
            className="flex-1"
            disabled={disabled}
          />
        </div>
      </FormControl>
      
      {description && value && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
