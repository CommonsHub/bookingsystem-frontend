import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Music, Theater, Mic, Users } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";
import { Room } from "@/types";
import { formSchema } from "./BookingFormSchema";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

type FormData = z.infer<typeof formSchema>;

interface RoomSelectionSectionProps {
  control: Control<FormData>;
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
}

export const RoomSelectionSection = ({
  control,
  rooms,
  selectedRoomId,
  setSelectedRoomId
}: RoomSelectionSectionProps) => {
  const { t } = useTranslation();
  
  // Watch the form field value to keep it in sync with selectedRoomId
  const formRoomId = useWatch({
    control,
    name: "roomId"
  });

  // Sync selectedRoomId with form field value
  useEffect(() => {
    if (formRoomId !== selectedRoomId) {
      setSelectedRoomId(formRoomId || null);
    }
  }, [formRoomId, selectedRoomId, setSelectedRoomId]);

  const selectedRoom = rooms.find(room => room.id === formRoomId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t('form.roomSelection.whichSpace')}</h3>

        <FormField
          control={control}
          name="roomId"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedRoomId(value);
                  }}
                  value={field.value || ""}
                  className="space-y-1"
                >
                  <div className="space-y-4">
                    <div className="text-muted-foreground">{t('form.roomSelection.capacity')}:</div>
                    {rooms.map((room) => (
                      <FormItem
                        key={room.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={room.id} />
                        </FormControl>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-red-500 mr-2" />
                            <span>{room.capacity} {t('booking.people')}: {room.name}</span>
                          </div>
                          
                          {/* Show setup options only for the currently selected room */}
                          {field.value === room.id && room.setupOptions?.length > 0 && (
                            <div className="mt-4 pl-2">
                              <h4 className="text-muted-foreground mb-2">{t('form.roomSelection.possibleSetup')}:</h4>
                              <FormField
                                control={control}
                                name="setupOption"
                                render={({ field: setupField }) => (
                                  <FormItem className="space-y-3">
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={setupField.onChange}
                                        value={setupField.value || ""}
                                        className="space-y-1"
                                      >
                                        {room.setupOptions.map((option) => (
                                          <FormItem key={option.type} className="flex items-start space-x-3 space-y-0">
                                            <FormControl>
                                              <RadioGroupItem value={option.type} />
                                            </FormControl>
                                            <div className="flex items-center">
                                              {option.icon === "music" ?
                                                <Music className="h-4 w-4 text-amber-600 mr-2" />
                                                : option.icon === "theater" ?
                                                  <Theater className="h-4 w-4 text-amber-600 mr-2" />
                                                  : option.icon === "mic" ?
                                                    <Mic className="h-4 w-4 text-amber-600 mr-2" />
                                                    : <Users className="h-4 w-4 text-amber-600 mr-2" />
                                              }
                                              <span>{option.minCapacity}-{option.maxCapacity}, {option.description}</span>
                                            </div>
                                          </FormItem>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}
                        </div>
                      </FormItem>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Free-form field for room notes */}
        <FormField
          control={control}
          name="roomNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.roomSelection.additionalNotes')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.roomSelection.additionalNotesPlaceholder')}
                  rows={3}
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
          name="requiresAdditionalSpace"
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
                  {t('form.roomSelection.additionalSpaceLabel')}
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t('form.roomSelection.additionalSpaceDescription')}
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
