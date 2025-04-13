
export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface User {
  email: string;
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
  status: 'draft' | 'pending' | 'approved' | 'rejected';
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
  status: 'draft' | 'published';
}
