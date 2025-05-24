
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

interface UrlFieldsSectionProps {
  control: Control<FormData>;
}

export const UrlFieldsSection = ({ control }: UrlFieldsSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="lumaEventUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Luma Event URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://lu.ma/your-event"
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
            <FormLabel>Calendar URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://calendar.google.com/event..."
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
            <FormLabel>Public URI</FormLabel>
            <FormControl>
              <Input
                placeholder="your-event-slug"
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
