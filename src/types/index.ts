
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

export type UserRole = 'admin' | 'moderator' | 'support' | 'user';

export interface User {
  id: string;
  email: string;
  name?: string;
  profileId?: string;
  roles?: UserRole[];
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
  organizer?: string;
  estimatedAttendees?: number;
  // New URL fields
  lumaEventUrl?: string;
  calendarUrl?: string;
  publicUri?: string;
  // New room notes field
  roomNotes?: string;
  // Add language field
  language?: string;
  // Add catering and event support fields
  cateringOptions?: string[];
  cateringComments?: string;
  eventSupportOptions?: string[];
  membershipStatus?: string;
  // Add price and currency fields
  price?: number;
  currency?: string;
}

export interface Comment {
  id: string;
  bookingId: string;
  content: string;
  createdAt: string;
  createdBy: User;
  status: CommentStatus;
}

export interface RequestComment {
  id: string;
  requestId: string;
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

export type BookingStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "paid";
export type CommentStatus = "draft" | "published";

export type RequestStatus = "draft" | "pending" | "in_progress" | "completed" | "cancelled";

export interface Request {
  id: string;
  title: string;
  description: string;
  requestType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: RequestStatus;
  createdAt: string;
  createdBy: User;
  email: string;
  name: string;
  phone?: string;
  organization?: string;
  expectedCompletionDate?: string;
  additionalDetails?: string;
  attachments?: string[];
  language?: string;
  completedAt?: string;
  completedBy?: User;
  cancelledAt?: string;
  cancelledBy?: User;
  comments: RequestComment[];
}

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

// This type represents the database fields for the bookings table
export interface BookingDatabaseFields {
  id: string;
  title: string;
  description?: string;
  room_id: string;
  room_name: string;
  room_capacity: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  created_by_email: string;
  created_by_name?: string;
  approved_by_email?: string;
  approved_at?: string;
  additional_comments?: string;
  is_public_event?: boolean;
  cancelled_at?: string;
  cancelled_by_email?: string;
  organizer?: string;
  estimated_attendees?: number;
  // New URL fields
  luma_event_url?: string;
  calendar_url?: string;
  public_uri?: string;
  // Add language field
  language?: string;
  // Add price and currency fields
  price?: number;
  currency?: string;
  // Add the new database fields
  catering_options?: string[];
  catering_comments?: string;
  event_support_options?: string[];
  membership_status?: string;
}
