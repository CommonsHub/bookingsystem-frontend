
export interface Room {
  id: string;
  name: string;
  capacity: string;
  location: string;
  description?: string;
  setupOptions?: RoomSetupOption[];
}

export interface RoomSetupOption {
  type: string;
  minCapacity: number;
  maxCapacity: number;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  verified: boolean;
  profileId?: string;
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
  selectedSetup?: string;
  requiresAdditionalSpace?: boolean;
  additionalComments?: string;
  isPublicEvent?: boolean;
  cancelledAt?: string;
  cancelledBy?: User;
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

export type BookingStatus = "draft" | "pending" | "approved" | "rejected" | "cancelled";
export type CommentStatus = "draft" | "published";

export interface CateringOption {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

export interface EventSupportOption {
  id: string;
  name: string;
  description: string;
}

export interface MembershipStatus {
  id: string;
  name: string;
}
