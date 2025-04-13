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
import { toast } from '@/components/ui/toast-utils';
import { createMatrixRoom, initMatrixClient, loginOrRegisterWithEmail } from '@/services/matrixService';

interface BookingContextType {
  bookings: Booking[];
  user: User | null;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'> & { createdBy: User }) => Promise<string>;
  addCommentToBooking: (bookingId: string, content: string, email: string) => Promise<string>;
  getBookingById: (id: string) => Booking | undefined;
  verifyBookingEmail: (id: string, token: string) => Promise<boolean>;
  verifyCommentEmail: (bookingId: string, commentId: string, token: string) => boolean;
  approveBookingRequest: (id: string) => Promise<void>;
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
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'> & { createdBy: User }
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

  const verifyBookingEmail = async (id: string, token: string): Promise<boolean> => {
    const booking = getBookingById(id);
    if (!booking) return false;
    
    const tokensString = localStorage.getItem('room-time-scribe-tokens') || '{}';
    const tokens = JSON.parse(tokensString);
    
    if (tokens[`booking-${id}`] === token) {
      try {
        // Update booking status
        booking.status = 'pending';
        
        // Verify user email
        verifyUser(booking.createdBy.email);
        setUser(getUser());
        
        // Create Matrix room for the booking
        const currentUser = getUser();
        if (currentUser) {
          // Login or register user with Matrix
          const matrixAuth = await loginOrRegisterWithEmail(currentUser.email);
          
          if (matrixAuth) {
            // Initialize Matrix client
            initMatrixClient(matrixAuth.userId, matrixAuth.accessToken);
            
            // Create Matrix room
            const roomId = await createMatrixRoom(booking, [matrixAuth.userId]);
            
            if (roomId) {
              // Store Matrix room ID in booking
              booking.matrixRoomId = roomId;
              
              // Update Matrix credentials in user
              currentUser.matrixUserId = matrixAuth.userId;
              currentUser.matrixAccessToken = matrixAuth.accessToken;
              localStorage.setItem('room-time-scribe-user', JSON.stringify(currentUser));
              setUser(currentUser);
            }
          }
        }
        
        // Save booking with updated information
        saveBooking(booking);
        
        // Update state
        setBookings(getBookings());
        return true;
      } catch (error) {
        console.error("Error creating Matrix room:", error);
        return true; // Still return true to verify the booking even if Matrix room creation fails
      }
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

  const approveBookingRequest = async (id: string): Promise<void> => {
    if (!user) {
      toast.error("You must be logged in to approve bookings");
      return;
    }
    
    // Get the booking
    const booking = getBookingById(id);
    if (!booking) {
      toast.error("Booking not found");
      return;
    }
    
    // Approve the booking in local storage
    approveBooking(id, user);
    
    // Update the Matrix room status if it exists
    if (booking.matrixRoomId && user.matrixUserId && user.matrixAccessToken) {
      try {
        // Initialize Matrix client
        initMatrixClient(user.matrixUserId, user.matrixAccessToken);
        
        // Update room status
        const { updateBookingStatus } = await import('@/services/matrixService');
        await updateBookingStatus(booking.matrixRoomId, 'approved');
        
        toast.success("Booking approved and Matrix room updated");
      } catch (error) {
        console.error("Failed to update Matrix room status:", error);
        toast.error("Booking approved but failed to update Matrix room");
      }
    } else {
      toast.success("Booking request approved successfully!");
    }
    
    // Update local state
    setBookings(getBookings());
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
