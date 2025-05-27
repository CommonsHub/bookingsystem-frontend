
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;

interface ContactInfoSectionProps {
  control: Control<FormData>;
  isReadOnly?: boolean;
}

export const ContactInfoSection = ({ control, isReadOnly = false }: ContactInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.contact.name')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.contact.namePlaceholder')}
                  {...field}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-gray-100" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.contact.email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.contact.emailPlaceholder')}
                  {...field}
                  readOnly={isReadOnly}
                  className={isReadOnly ? "bg-gray-100" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {t('form.contact.confirmationNote')}
      </p>
    </div>
  );
};
