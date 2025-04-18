import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import AddComment from '@/components/AddComment';
import { 
  formatDateTime, 
  formatDate, 
  formatTime, 
  getRelativeTime,
  generateId
} from '@/lib/utils';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  MailCheck,
  ChevronLeft,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast-utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUser } from '@/lib/storage';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getBookingById, addCommentToBooking, approveBookingRequest, user } = useBooking();
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  
  if (!id) return <div>Booking ID is missing</div>;
  
  const booking = getBookingById(id);
  if (!booking) return <div>Booking not found</div>;
  
  const canApproveBooking = booking.status === 'pending' && user?.verified;
  
  const visibleComments = booking.comments.filter(comment => {
    if (comment.status === 'published') return true;
    return user && user.email === comment.createdBy.email;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSubmitComment = async (commentData: { content: string; name: string; email: string }) => {
    if (!commentData.content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await addCommentToBooking(id, commentData.content, commentData.email);
      toast.success("Comment submitted! Please check your email to verify.");
    } catch (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveBooking = () => {
    approveBookingRequest(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="gap-1"
        >
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
            Back to bookings
          </Link>
        </Button>
      </div>
      
      <div className="booking-item-grid">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={`${statusColor(booking.status)} text-md px-3 py-1`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
            
            {booking.status === 'draft' && (
              <Badge variant="outline" className="text-muted-foreground">
                Awaiting verification
              </Badge>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{booking.title}</h1>
            <p className="text-muted-foreground mt-1">
              Requested by {booking.createdBy.email} • {getRelativeTime(booking.createdAt)}
            </p>
          </div>

          {booking.status === 'draft' && (
            <Alert>
              <MailCheck className="h-4 w-4" />
              <AlertTitle>Verification needed</AlertTitle>
              <AlertDescription>
                This booking request is waiting for email verification. Please check your email.
              </AlertDescription>
            </Alert>
          )}
          
          {booking.status === 'approved' && booking.approvedBy && booking.approvedAt && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Booking Approved</AlertTitle>
              <AlertDescription>
                Approved by {booking.approvedBy.email} on {formatDate(booking.approvedAt)}
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">
                  {booking.description}
                </p>
              </div>

              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Date</h4>
                    <p className="text-muted-foreground">
                      {formatDate(booking.startTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Time</h4>
                    <p className="text-muted-foreground">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Room</h4>
                    <p className="text-muted-foreground">
                      {booking.room.name} ({booking.room.location})
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Capacity</h4>
                    <p className="text-muted-foreground">
                      {booking.room.capacity} people
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Comments</h2>
              <span className="text-muted-foreground text-sm">
                {visibleComments.length} comment{visibleComments.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {visibleComments.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground">No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleComments.map(comment => (
                  <Card key={comment.id} className={comment.status === 'draft' ? 'border-dashed' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">
                          {comment.createdBy.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getRelativeTime(comment.createdAt)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{comment.content}</p>
                    </CardContent>
                    {comment.status === 'draft' && (
                      <CardFooter className="bg-muted/20 pt-2 pb-2 text-sm text-muted-foreground italic">
                        Awaiting email verification - only visible to you
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
            
            <AddComment 
              onSubmit={handleSubmitComment}
              isSubmitting={submitting}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canApproveBooking ? (
                <Button 
                  onClick={handleApproveBooking} 
                  className="w-full gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Booking
                </Button>
              ) : (
                <Button 
                  disabled 
                  className="w-full gap-2"
                  title={
                    booking.status !== 'pending' 
                      ? "This booking is not pending approval" 
                      : "You need to verify your email to approve bookings"
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Booking
                </Button>
              )}
              
              {booking.status === 'approved' && (
                <div className="text-center text-sm text-muted-foreground">
                  This booking has already been approved
                </div>
              )}
              
              {booking.status === 'draft' && (
                <div className="text-center text-sm text-muted-foreground">
                  Booking must be verified before it can be approved
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Location</h3>
                <p className="text-muted-foreground">
                  {booking.room.location}
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Capacity</h3>
                <p className="text-muted-foreground">
                  {booking.room.capacity} people
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Amenities</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>Projector</li>
                  <li>Whiteboards</li>
                  <li>Video conferencing</li>
                  <li>Coffee station</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
