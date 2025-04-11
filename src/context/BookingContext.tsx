
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Booking, Comment, User } from '@/types';
import { 
  getBookings, 
  saveBooking, 
  getUser, 
  addComment, 
  saveToken,
  verifyUser,
  updateCommentStatus,
  approveBooking
} from '@/lib/storage';
import { generateId, generateVerificationToken, sendVerificationEmail } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

interface BookingContextType {
  bookings: Booking[];
  user: User | null;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'>) => Promise<string>;
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
    // Load bookings and user from localStorage on component mount
    setBookings(getBookings());
    setUser(getUser());
  }, []);

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'>
  ): Promise<string> => {
    const currentUser = getUser() || { email: bookingData.createdBy.email, verified: false };
    const token = generateVerificationToken();
    const id = generateId('booking-');
    
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date().toISOString(),
      status: 'draft',
      comments: [],
      createdBy: currentUser
    };
    
    saveBooking(newBooking);
    saveToken(id, token, 'booking');
    setBookings(getBookings());
    
    // Send verification email
    await sendVerificationEmail(
      bookingData.createdBy.email, 
      'booking', 
      id, 
      token
    );
    
    return id;
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
    
    // Send verification email
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
      booking.status = 'pending';
      saveBooking(booking);
      
      // Verify user email
      verifyUser(booking.createdBy.email);
      setUser(getUser());
      
      // Update state
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
      // Update comment status
      updateCommentStatus(bookingId, commentId, 'published');
      
      // Verify user email
      verifyUser(comment.createdBy.email);
      setUser(getUser());
      
      // Update state
      setBookings(getBookings());
      return true;
    }
    
    return false;
  };

  const approveBookingRequest = (id: string): void => {
    if (!user) {
      toast.error("You must be logged in to approve bookings");
      return;
    }
    
    approveBooking(id, user);
    setBookings(getBookings());
    
    toast.success("Booking request approved successfully!");
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
