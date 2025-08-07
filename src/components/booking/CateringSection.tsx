
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";
import { cateringOptionsData } from "@/data/cateringOptions";

type FormData = z.infer<typeof formSchema>;

interface CateringSectionProps {
  control: Control<FormData>;
}

export const CateringSection = ({ control }: CateringSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('catering.question')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('catering.description')}
        </p>

        <FormField
          control={control}
          name="cateringOptions"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                {cateringOptionsData.map((option) => (
                  <FormField
                    key={option.id}
                    control={control}
                    name="cateringOptions"
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
                          <FormLabel className="flex items-center">
                            <span className="mr-2">{option.emoji}</span>
                            <span>{t(option.nameKey)}</span>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            {t(option.descriptionKey)}
                          </p>
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

      <FormField
        control={control}
        name="cateringComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('catering.commentsLabel')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('catering.commentsPlaceholder')}
                rows={2}
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
