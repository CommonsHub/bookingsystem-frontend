
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

// Event support options
export const eventSupportOptions = [
  { id: "logistics", name: "Interested in full logistic support during the day (AV and tech support | help with setup)" },
  { id: "facilitation", name: "Interested in facilitation support and conference design" },
];

interface EventSupportSectionProps {
  control: Control<FormData>;
}

export const EventSupportSection = ({ control }: EventSupportSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">We have several professional event organisers and facilitators/conference designers available for an optimal experience</h3>
        <p className="text-sm text-muted-foreground">
          If you are interested in additional support, you can add this here.
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
                            {option.name}
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
    </div>
  );
};
