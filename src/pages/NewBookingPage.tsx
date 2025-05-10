
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Music, Mic, Users, Theatre } from "lucide-react";
import { useState } from "react";
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
});

type FormData = z.infer<typeof formSchema>;

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const defaultEmail = user?.email || "";

  // Enhanced room data with setup options
  const enhancedRooms = rooms.map(room => {
    if (room.name === "Angel Room") {
      return {
        ...room,
        description: "Perfect for small meetings",
        capacity: 12,
        setupOptions: []
      };
    } else if (room.name === "Satoshi Room") {
      return {
        ...room,
        description: "Medium-sized conference room",
        capacity: 17,
        setupOptions: []
      };
    } else if (room.name === "Ostrom Conference Room") {
      return {
        ...room,
        description: "Large conference space",
        capacity: 120,
        setupOptions: [
          { type: "Workshop", minCapacity: 17, maxCapacity: 50, icon: "music" },
          { type: "Theatre", minCapacity: 50, maxCapacity: 80, icon: "theatre" },
          { type: "Networking", minCapacity: 80, maxCapacity: 120, icon: "mic" }
        ]
      };
    }
    return room;
  });

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
    },
  });

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
        createdBy: { email: data.email, name: data.name, verified: false },
        selectedSetup: data.setupOption,
        requiresAdditionalSpace: data.requiresAdditionalSpace
      });

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
                                      {room.name === "Angel Room" && (
                                        <span>&gt;12 people: {room.name}</span>
                                      )}
                                      {room.name === "Satoshi Room" && (
                                        <span>10-17 people: {room.name}</span>
                                      )}
                                      {room.name === "Ostrom Conference Room" && (
                                        <span>17-120: {room.name}</span>
                                      )}
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

                  {selectedRoom?.name === "Ostrom Conference Room" && (
                    <div className="mt-4 pl-7">
                      <h4 className="text-muted-foreground mb-2">Possible setup Ostrom:</h4>
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
                                <FormItem className="flex items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="workshop" />
                                  </FormControl>
                                  <div className="flex items-center">
                                    <Music className="h-4 w-4 text-amber-600 mr-2" />
                                    <span>17-50 in dynamic workshop set up or circle</span>
                                  </div>
                                </FormItem>
                                
                                <FormItem className="flex items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="theatre" />
                                  </FormControl>
                                  <div className="flex items-center">
                                    <Theatre className="h-4 w-4 text-amber-600 mr-2" />
                                    <span>50-80 theatre set up</span>
                                  </div>
                                </FormItem>
                                
                                <FormItem className="flex items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="networking" />
                                  </FormControl>
                                  <div className="flex items-center">
                                    <Mic className="h-4 w-4 text-amber-600 mr-2" />
                                    <span>80-120 standing, networking</span>
                                  </div>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
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
                </div>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
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
