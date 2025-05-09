export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
  matrixUserId?: string; // Matrix user ID (@username:server.org)
  matrixAccessToken?: string; // Matrix access token for authentication
}

export interface Booking {
  id: string;
  title: string;
  description: string;
  room: Room;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  createdBy: User;
  comments: Comment[];
  approvedBy?: User;
  approvedAt?: string;
  matrixRoomId?: string; // ID of the associated Matrix room
}

export interface Comment {
  id: string;
  bookingId: string;
  content: string;
  createdAt: string;
  createdBy: User;
  status: CommentStatus;
}

export interface Profile {
  id: string;
  full_name: string | null;
  address: string | null;
  vat_number: string | null;
  has_business: boolean | null;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = "draft" | "pending" | "approved" | "rejected";
export type CommentStatus = "draft" | "published";
