
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

// Local storage helper functions
const getStorageUser = (): User | null => {
  const data = localStorage.getItem('room-time-scribe-user');
  if (!data) return null;
  return JSON.parse(data) as User;
};

const saveStorageUser = (email: string, name: string = '', verified: boolean = false): User => {
  const user: User = { email, name, verified };
  localStorage.setItem('room-time-scribe-user', JSON.stringify(user));
  return user;
};

const verifyStorageUser = (email: string): void => {
  const user = getStorageUser();
  if (user && user.email === email) {
    saveStorageUser(email, user.name || '', true);
  }
};

const saveStorageToken = (id: string, token: string, type: 'booking' | 'comment'): void => {
  const existingTokensStr = localStorage.getItem('room-time-scribe-tokens') || '{}';
  const existingTokens = JSON.parse(existingTokensStr);
  
  existingTokens[`${type}-${id}`] = token;
  localStorage.setItem('room-time-scribe-tokens', JSON.stringify(existingTokens));
};

const addStorageComment = (bookingId: string, comment: Comment): void => {
  // For now, we'll just update the local state
  // In a real implementation, this would save to database
};

const updateStorageCommentStatus = (bookingId: string, commentId: string, status: 'draft' | 'published'): void => {
  // For now, we'll just update the local state
  // In a real implementation, this would save to database
};

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
          status: booking.status as "draft" | "pending" | "approved" | "rejected", // Fix type casting
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

    // Set user from localStorage if available
    const storedUser = getStorageUser();
    if (storedUser) {
      setUser(storedUser);
    }

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

      // Save token for verification
      saveStorageToken(id, token, 'booking');

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
    const currentUser = getStorageUser() || { email, verified: false };
    const token = generateVerificationToken();
    
    const comment: Comment = {
      id: commentId,
      bookingId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      status: 'draft'
    };
    
    addStorageComment(bookingId, comment);
    saveStorageToken(commentId, token, 'comment');
    
    // Update local state
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, comments: [...booking.comments, comment] }
          : booking
      )
    );
    
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
      // Update booking status
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === id ? { ...b, status: 'pending' as const } : b
        )
      );
      
      // Also update in Supabase
      supabase
        .from('bookings')
        .update({ status: 'pending' })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Error updating booking status:', error);
        });
      
      // Verify user
      verifyStorageUser(booking.createdBy.email);
      setUser(getStorageUser());
      
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
      updateStorageCommentStatus(bookingId, commentId, 'published');
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === bookingId 
            ? {
                ...b,
                comments: b.comments.map(c => 
                  c.id === commentId 
                    ? { ...c, status: 'published' as const }
                    : c
                )
              }
            : b
        )
      );
      
      verifyStorageUser(comment.createdBy.email);
      setUser(getStorageUser());
      
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
