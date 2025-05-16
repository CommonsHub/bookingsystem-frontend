import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Mic, Music, Theater, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast-utils";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { rooms } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Room } from "@/types";
import { useDraftBooking } from "@/hooks/useDraftBooking";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  roomId: z.string({ required_error: "Please select a room" }),
  setupOption: z.string().optional(),
  requiresAdditionalSpace: z.boolean().default(false),
  date: z.date({ required_error: "Please select a date" }),
  startTime: z.string({ required_error: "Please select a start time" }),
  endTime: z
    .string({ required_error: "Please select an end time" })
    .refine((time) => time !== "", { message: "Please select an end time" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Please enter your name" }),
  // New fields
  cateringOptions: z.array(z.string()).optional(),
  cateringComments: z.string().optional(),
  eventSupportOptions: z.array(z.string()).optional(),
  membershipStatus: z.string().optional(),
  additionalComments: z.string().optional(),
  // Add the public event field
  isPublicEvent: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

// Catering options data
const cateringOptions = [
  { id: "simple-lunch", name: "Simple lunch: sandwiches", price: 7, description: "€7/per person", emoji: "🥪" },
  { id: "awesome-lunch", name: "Awesome lunch: salads/sandwiches from organic caterer", price: 25, description: "€25 (<25) or €22", emoji: "🥗" },
  { id: "after-event-drinks", name: "After event drinks (wine and juice)", price: 8, description: "€8/person", emoji: "🍷" },
  { id: "after-event-snacks", name: "After event snacks", price: 4, description: "€4/person", emoji: "🍿" },
  { id: "coffee-break-snacks", name: "Snacks during coffee break (fruit|nuts|sweets)", price: 4, description: "€4/pp half day | €6/pp full day", emoji: "🍊" },
];

// Event support options
const eventSupportOptions = [
  { id: "logistics", name: "Interested in full logistic support during the day (AV and tech support | help with setup)" },
  { id: "facilitation", name: "Interested in facilitation support and conference design" },
];

// Membership options
const membershipOptions = [
  { id: "yes", name: "Yes" },
  { id: "no", name: "No" },
  { id: "interested", name: "Interested in becoming member (we will contact you)" },
];

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { saveDraft, loadDraft, clearDraft, isLoading } = useDraftBooking();
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimerId, setAutoSaveTimerId] = useState<NodeJS.Timeout | null>(null);
  const shouldAutoSave = useRef<boolean>(true);

  const defaultEmail = user?.email || "";

  const enhancedRooms = rooms;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      roomId: "",
      setupOption: "",
      requiresAdditionalSpace: false,
      startTime: "",
      endTime: "",
      email: defaultEmail,
      name: "",
      cateringOptions: [],
      cateringComments: "",
      eventSupportOptions: [],
      membershipStatus: "",
      additionalComments: "",
      isPublicEvent: false, // Initialize the public event field
    },
  });

  // Load saved draft on initial render
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const draftData = await loadDraft();
        if (draftData && !draftLoaded) {
          form.reset(draftData);
          if (draftData.roomId) {
            setSelectedRoomId(draftData.roomId);
          }
          setDraftLoaded(true);
          toast.success("Draft booking loaded");
        }
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    };

    fetchDraft();
  }, [form, loadDraft, draftLoaded]);

  // Auto-save form values when they change
  useEffect(() => {
    // Watch for form changes
    const subscription = form.watch((formValues) => {
      // Don't auto-save if we just cleared the draft
      if (!shouldAutoSave.current) {
        return;
      }
      
      // Debounce the auto-save to prevent too many saves
      if (autoSaveTimerId) {
        clearTimeout(autoSaveTimerId);
      }

      // Only save if there are actual values
      if (formValues.title || formValues.description || formValues.roomId) {
        const timerId = setTimeout(() => {
          // Add timestamp to detect which version is newer
          const dataToSave = {
            ...formValues,
            updatedAt: new Date().toISOString(),
            selectedRoom: enhancedRooms.find(r => r.id === formValues.roomId)
          };
          saveDraft(dataToSave);
        }, 2000); // Save after 2 seconds of inactivity

        setAutoSaveTimerId(timerId);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form, saveDraft]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Find the selected room
      const selectedRoom = enhancedRooms.find(
        (room) => room.id === data.roomId,
      ) as Room;

      // Create start and end time Date objects
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startDate = new Date(data.date);
      startDate.setHours(startHour, startMinute);

      const endDate = new Date(data.date);
      endDate.setHours(endHour, endMinute);

      // Create booking with correct type structure
      const bookingId = await createBooking({
        title: data.title,
        description: data.description,
        room: selectedRoom,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        createdBy: {
          id: user?.id || crypto.randomUUID(),
          email: data.email,
          name: data.name,
          verified: false
        },
        selectedSetup: data.setupOption,
        requiresAdditionalSpace: data.requiresAdditionalSpace,
        additionalComments: data.additionalComments,
        isPublicEvent: data.isPublicEvent
      });

      // Clear the draft data after successful submission
      await clearDraft();

      toast.success(
        "Booking request submitted! Please check your email to verify.",
      );
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error("There was an error creating your booking request.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearDraft = async () => {
    // Prevent auto-saving during form reset
    shouldAutoSave.current = false;
    
    // Clear the draft data
    await clearDraft();
    
    // Reset form to default values
    form.reset({
      title: "",
      description: "",
      roomId: "",
      setupOption: "",
      requiresAdditionalSpace: false,
      date: undefined,
      startTime: "",
      endTime: "",
      email: defaultEmail,
      name: "",
      cateringOptions: [],
      cateringComments: "",
      eventSupportOptions: [],
      membershipStatus: "",
      additionalComments: "",
      isPublicEvent: false,
    });
    
    // Reset UI state
    setSelectedRoomId(null);
    setDraftLoaded(false);
    
    // Allow auto-saving again after a short delay (to prevent immediate re-save of empty form)
    setTimeout(() => {
      shouldAutoSave.current = true;
    }, 500);
    
    toast.success("Draft cleared");
  };

  const watchedRoomId = form.watch("roomId");
  const selectedRoom = enhancedRooms.find(room => room.id === watchedRoomId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          New Booking Request
        </h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to request a room booking
          {isLoading && " (Saving draft...)"}
          {!isLoading && draftLoaded && " (Draft loaded)"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Room Booking Details</CardTitle>
              <CardDescription>
                Enter the details of your booking request
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of your meeting"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about the purpose of the booking"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <div className="flex">
                          <Clock className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <div className="flex">
                          <Clock className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Which space would you like to book?</h3>

                  <FormField
                    control={form.control}
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
                              {enhancedRooms.map((room) => (
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
                      control={form.control}
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
                        control={form.control}
                        name="setupOption"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-1"
                              >
                                {selectedRoom.setupOptions.map((option) => {
                                  return <FormItem className="flex items-start space-x-3 space-y-0">
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
                                })
                                }
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

              <Separator />

              {/* Catering Options Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Do you need catering?</h3>
                  <p className="text-sm text-muted-foreground">
                    Coffee, tea and water are included in the price. For lunch catering we work with local suppliers (Tasty Break for simple sandwiches, Apus et Les Cocottes Volantes for organic awesome food).
                  </p>

                  <FormField
                    control={form.control}
                    name="cateringOptions"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          {cateringOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
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
                                      <span>{option.name}</span>
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
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
                  control={form.control}
                  name="cateringComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any extra comments for the catering or other requests?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any special dietary requirements or other requests here"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Event Support Options Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">We have several professional event organisers and facilitators/conference designers available for an optimal experience</h3>
                  <p className="text-sm text-muted-foreground">
                    If you are interested in additional support, you can add this here.
                  </p>

                  <FormField
                    control={form.control}
                    name="eventSupportOptions"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          {eventSupportOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
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

              <Separator />

              {/* Membership Status Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Are you a member of the Commons Hub?</h3>
                  <p className="text-sm text-muted-foreground">
                    Members get 30% discount on all rental prices. Membership starts from €10/month or €100/year.
                  </p>

                  <FormField
                    control={form.control}
                    name="membershipStatus"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-1"
                          >
                            {membershipOptions.map((option) => (
                              <FormItem
                                key={option.id}
                                className="flex items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={option.id} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Comments Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
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

                {/* Public Event Checkbox */}
                <FormField
                  control={form.control}
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

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation link will be sent to this email to verify your
                booking request.
              </p>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearDraft}
                >
                  Clear Draft
                </Button>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NewBookingPage;
