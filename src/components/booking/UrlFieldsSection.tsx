
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;

interface UrlFieldsSectionProps {
  control: Control<FormData>;
}

export const UrlFieldsSection = ({ control }: UrlFieldsSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="lumaEventUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.urls.lumaEventUrl')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.urls.lumaEventUrlPlaceholder')}
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
        name="calendarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.urls.calendarUrl')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.urls.calendarUrlPlaceholder')}
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
        name="publicUri"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.urls.publicUri')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('form.urls.publicUriPlaceholder')}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
