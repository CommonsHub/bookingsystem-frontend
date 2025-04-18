import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Comment, User } from '@/types';
import { generateId, generateVerificationToken, sendVerificationEmail } from '@/lib/utils';
import { toast } from '@/components/ui/toast-utils';
import { supabase } from '@/integrations/supabase/client';

interface BookingContextType {
  bookings: Booking[];
  user: User | null;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'> & { createdBy: User }) => Promise<string>;
  addCommentToBooking: (bookingId: string, content: string, email: string) => Promise<string>;
  getBookingById: (id: string) => Booking | undefined;
  verifyBookingEmail: (id: string, token: string) => boolean;
  verifyCommentEmail: (bookingId: string, commentId: string, token: string) => boolean;
  approveBookingRequest: (id: string) => void;
  getUserEmail: () => string | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }

        const transformedBookings: Booking[] = data.map(booking => ({
          id: booking.id,
          title: booking.title,
          description: booking.description || '',
          room: {
            id: booking.room_id,
            name: booking.room_name,
            capacity: booking.room_capacity,
            location: 'Main Building'
          },
          startTime: booking.start_time,
          endTime: booking.end_time,
          status: booking.status,
          createdAt: booking.created_at,
          createdBy: {
            email: booking.created_by_email,
            name: booking.created_by_name || '',
            verified: true
          },
          comments: [],
          approvedBy: booking.approved_by_email ? {
            email: booking.approved_by_email,
            verified: true
          } : undefined,
          approvedAt: booking.approved_at
        }));

        setBookings(transformedBookings);
      } catch (error) {
        console.error('Error in fetchBookings:', error);
        toast.error('Failed to fetch bookings');
      }
    };

    fetchBookings();
  }, []);

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'> & { createdBy: User }
  ): Promise<string> => {
    const token = generateVerificationToken();
    const id = generateId('booking-');
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          id,
          title: bookingData.title,
          description: bookingData.description,
          room_id: bookingData.room.id,
          room_name: bookingData.room.name,
          room_capacity: bookingData.room.capacity,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          status: 'draft',
          created_by_email: bookingData.createdBy.email,
          created_by_name: bookingData.createdBy.name
        });

      if (error) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking');
        throw error;
      }

      await sendVerificationEmail(
        bookingData.createdBy.email,
        'booking',
        id,
        token
      );

      const { data: newBookings } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (newBookings) {
        setBookings(prevBookings => {
          const transformedNewBooking = {
            ...bookingData,
            id,
            createdAt: new Date().toISOString(),
            status: 'draft' as const,
            comments: [],
            createdBy: bookingData.createdBy
          };
          return [transformedNewBooking, ...prevBookings];
        });
      }

      return id;
    } catch (error) {
      console.error('Error in createBooking:', error);
      toast.error('Failed to create booking');
      throw error;
    }
  };

  const addCommentToBooking = async (
    bookingId: string, 
    content: string, 
    email: string
  ): Promise<string> => {
    const commentId = generateId('comment-');
    const currentUser = getUser() || { email, verified: false };
    const token = generateVerificationToken();
    
    const comment: Comment = {
      id: commentId,
      bookingId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      status: 'draft'
    };
    
    addComment(bookingId, comment);
    saveToken(commentId, token, 'comment');
    setBookings(getBookings());
    
    await sendVerificationEmail(
      email, 
      'comment', 
      commentId, 
      token
    );
    
    return commentId;
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find(booking => booking.id === id);
  };

  const verifyBookingEmail = (id: string, token: string): boolean => {
    const booking = getBookingById(id);
    if (!booking) return false;
    
    const tokensString = localStorage.getItem('room-time-scribe-tokens') || '{}';
    const tokens = JSON.parse(tokensString);
    
    if (tokens[`booking-${id}`] === token) {
      booking.status = 'pending';
      saveBooking(booking);
      
      verifyUser(booking.createdBy.email);
      setUser(getUser());
      
      setBookings(getBookings());
      return true;
    }
    
    return false;
  };

  const verifyCommentEmail = (bookingId: string, commentId: string, token: string): boolean => {
    const booking = getBookingById(bookingId);
    if (!booking) return false;
    
    const comment = booking.comments.find(c => c.id === commentId);
    if (!comment) return false;
    
    const tokensString = localStorage.getItem('room-time-scribe-tokens') || '{}';
    const tokens = JSON.parse(tokensString);
    
    if (tokens[`comment-${commentId}`] === token) {
      updateCommentStatus(bookingId, commentId, 'published');
      
      verifyUser(comment.createdBy.email);
      setUser(getUser());
      
      setBookings(getBookings());
      return true;
    }
    
    return false;
  };

  const approveBookingRequest = async (id: string): Promise<void> => {
    if (!user) {
      toast.error("You must be logged in to approve bookings");
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'approved',
          approved_by_email: user.email,
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error approving booking:', error);
        toast.error('Failed to approve booking');
        return;
      }

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === id
            ? {
                ...booking,
                status: 'approved',
                approvedBy: user,
                approvedAt: new Date().toISOString()
              }
            : booking
        )
      );

      toast.success("Booking request approved successfully!");
    } catch (error) {
      console.error('Error in approveBookingRequest:', error);
      toast.error('Failed to approve booking');
    }
  };

  const getUserEmail = (): string | null => {
    return user?.email || null;
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        user,
        createBooking,
        addCommentToBooking,
        getBookingById,
        verifyBookingEmail,
        verifyCommentEmail,
        approveBookingRequest,
        getUserEmail
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
