
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Theater, Mic, Users } from "lucide-react";
import { Control } from "react-hook-form";
import { z } from "zod";
import { Room } from "@/types";
import { useState } from "react";
import { formSchema } from "./BookingFormSchema";

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
  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Which space would you like to book?</h3>

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
                  defaultValue={field.value}
                  className="space-y-1"
                >
                  <div className="space-y-4">
                    <div className="text-muted-foreground">Capacity:</div>
                    {rooms.map((room) => (
                      <FormItem
                        key={room.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={room.id} />
                        </FormControl>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-red-500 mr-2" />
                            <span>{room.capacity} people: {room.name}</span>
                          </div>
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

        <div className="mt-4 pl-7">
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
                    We need all of it + additional space
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    We can offer additional space on the first floor if needed.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        {selectedRoom?.setupOptions?.length > 0 && (
          <div className="mt-4 pl-7">
            <h4 className="text-muted-foreground mb-2">Possible setup:</h4>
            <FormField
              control={control}
              name="setupOption"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-1"
                    >
                      {selectedRoom.setupOptions.map((option) => (
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
    </div>
  );
};
