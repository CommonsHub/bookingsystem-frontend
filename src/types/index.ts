export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface User {
  email: string;
  name?: string;
  verified: boolean;
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
}

export interface Comment {
  id: string;
  bookingId: string;
  content: string;
  createdAt: string;
  createdBy: User;
  status: CommentStatus;
}

export type BookingStatus = "draft" | "pending" | "approved" | "rejected";
export type CommentStatus = "draft" | "published";
