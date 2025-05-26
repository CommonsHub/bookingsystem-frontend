
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { eventSupportOptions } from "@/data/supportOptions";
import { useTranslation } from "react-i18next";

type FormData = z.infer<typeof formSchema>;
interface EventSupportSectionProps {
  control: Control<FormData>;
}

export const EventSupportSection = ({ control }: EventSupportSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('form.eventSupport.professionalTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('form.eventSupport.professionalDescription')}
        </p>

        <FormField
          control={control}
          name="eventSupportOptions"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                {eventSupportOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={control}
                    name="eventSupportOptions"
                    render={({ field }) => (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), option.id]
                                : (field.value || []).filter(
                                  (value) => value !== option.id
                                );
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {t(option.nameKey)}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4">
        <FormField
          control={control}
          name="isPublicEvent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('form.eventSupport.publicEventLabel')}
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t('form.eventSupport.publicEventDescription')}
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
