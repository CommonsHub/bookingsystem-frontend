
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;

interface AdditionalInfoSectionProps {
  control: Control<FormData>;
}

export const AdditionalInfoSection = ({ control }: AdditionalInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="additionalComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.additionalInfo.label')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('form.additionalInfo.placeholder')}
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
