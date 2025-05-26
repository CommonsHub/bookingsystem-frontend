
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { toast } from "@/components/ui/toast-utils";
import { DateTimePicker } from "./DateTimePicker";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;

interface DateTimeSectionProps {
  control: Control<FormData>;
}

export const DateTimeSection = ({ control }: DateTimeSectionProps) => {
  const { t } = useTranslation();
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
            <FormLabel>{t('form.dateTime.startDate')}</FormLabel>
            <DateTimePicker 
              label={t('form.dateTime.startDate')}
              value={field.value}
              onChange={field.onChange}
              placeholder={t('form.dateTime.pickDate')}
              naturalLanguagePlaceholder={t('form.dateTime.naturalLanguagePlaceholder')}
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
            <FormLabel>{t('form.dateTime.endDate')}</FormLabel>
            <DateTimePicker 
              label={t('form.dateTime.endDate')}
              value={field.value}
              onChange={field.onChange}
              referenceDate={startDate}
              minDate={startDate}
              disabled={!startDate}
              placeholder={t('form.dateTime.pickEndDate')}
              description={field.value ? format(field.value, "PPP 'at' h:mm a") : undefined}
              naturalLanguagePlaceholder={t('form.dateTime.endNaturalLanguagePlaceholder')}
              onBlur={() => {
                if (!endDate || !startDate) return;
                
                // Validate that end date is after start date
                if (endDate <= startDate) {
                  toast.error(t('form.dateTime.endTimeError'));
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
