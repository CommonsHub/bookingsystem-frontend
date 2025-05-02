
import { useState } from 'react';
import { Booking, Comment, User } from '@/types';
import { generateId, generateVerificationToken, sendVerificationEmail } from '@/lib/utils';
import { toast } from '@/components/ui/toast-utils';
import { supabase } from '@/integrations/supabase/client';
import { saveStorageToken, verifyStorageUser } from '@/utils/storage-helpers';
import { v4 as uuidv4 } from 'uuid';

export const useBookingOperations = (
  bookings: Booking[], 
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
) => {
  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'comments' | 'createdBy'> & { createdBy: User }
  ): Promise<string> => {
    const token = generateVerificationToken();

    // generate uuid v4
    const id = uuidv4();
    
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
    const currentUser = { email, verified: false };
    const token = generateVerificationToken();
    
    const comment: Comment = {
      id: commentId,
      bookingId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      status: 'draft'
    };
    
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, comments: [...booking.comments, comment] }
          : booking
      )
    );
    
    saveStorageToken(commentId, token, 'comment');
    
    await sendVerificationEmail(
      email, 
      'comment', 
      commentId, 
      token
    );
    
    return commentId;
  };

  const approveBookingRequest = async (id: string, user: User): Promise<void> => {
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

  return {
    createBooking,
    addCommentToBooking,
    approveBookingRequest,
  };
};
