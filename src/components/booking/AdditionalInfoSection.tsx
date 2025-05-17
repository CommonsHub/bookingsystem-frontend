
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./BookingFormSchema";

type FormData = z.infer<typeof formSchema>;

interface AdditionalInfoSectionProps {
  control: Control<FormData>;
}

export const AdditionalInfoSection = ({ control }: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="additionalComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any additional information you want to share</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Please share any other information that might be relevant for your booking"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <div>
              <FormLabel>
                Public event (we will publish through our channels as well)
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Check this box if you want your event to be promoted on our public channels.
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
