
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;

interface BookingInfoSectionProps {
  control: Control<FormData>;
}

export const BookingInfoSection = ({ control }: BookingInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.basicInfo.title')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.basicInfo.titlePlaceholder')}
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
            <FormLabel>{t('form.basicInfo.description')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('form.basicInfo.descriptionPlaceholder')}
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
            <FormLabel>{t('form.basicInfo.organizer')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.basicInfo.organizerPlaceholder')}
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
            <FormLabel>{t('form.basicInfo.estimatedAttendees')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t('form.basicInfo.attendeesPlaceholder')}
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
