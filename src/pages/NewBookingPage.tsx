import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useBooking } from '@/context/BookingContext';
import { rooms } from '@/data/mockData';
import { Room, User } from '@/types';
import { toast } from '@/components/ui/toast-utils';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  roomId: z.string({ required_error: 'Please select a room' }),
  date: z.date({ required_error: 'Please select a date' }),
  startTime: z.string({ required_error: 'Please select a start time' }),
  endTime: z.string({ required_error: 'Please select an end time' })
    .refine(time => time !== '', { message: 'Please select an end time' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Please enter your name' }),
});

type FormData = z.infer<typeof formSchema>;

const NewBookingPage = () => {
  const navigate = useNavigate();
  const { createBooking, getUserEmail } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  
  const defaultEmail = getUserEmail() || '';
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      roomId: '',
      startTime: '',
      endTime: '',
      email: defaultEmail,
      name: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Find the selected room
      const selectedRoom = rooms.find(room => room.id === data.roomId) as Room;
      
      // Create start and end time Date objects
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);
      
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
        createdBy: { email: data.email, name: data.name, verified: false }
      });

      toast.success("Booking request submitted! Please check your email to verify.");
      navigate(`/bookings/${bookingId}`);
    } catch (error) {
      toast.error("There was an error creating your booking request.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Booking Request</h1>
        <p className="text-muted-foreground mt-1">
          Fill out the form below to request a room booking
        </p>
      </div>
      
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
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your meeting"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the purpose of the booking"
                  rows={4}
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Select Room</Label>
                <Select
                  onValueChange={(value) => form.setValue('roomId', value)}
                  defaultValue={form.getValues('roomId')}
                >
                  <SelectTrigger id="roomId">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} ({room.capacity} people)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.roomId && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.roomId.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.getValues('date') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.getValues('date') ? (
                        format(form.getValues('date'), "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.getValues('date')}
                      onSelect={(date) => {
                        if (date) {
                          form.setValue('date', date);
                          // Force re-render to update the button text
                          form.trigger('date');
                        }
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="flex">
                    <Clock className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="startTime"
                      type="time"
                      {...form.register('startTime')}
                    />
                  </div>
                  {form.formState.errors.startTime && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex">
                    <Clock className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="endTime"
                      type="time"
                      {...form.register('endTime')}
                    />
                  </div>
                  {form.formState.errors.endTime && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation link will be sent to this email to verify your booking request.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewBookingPage;
