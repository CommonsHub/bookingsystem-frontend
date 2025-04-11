
import { Room, Booking } from "../types";

export const rooms: Room[] = [
  { 
    id: "room-001", 
    name: "Conference Room A", 
    capacity: 12, 
    location: "1st Floor, East Wing" 
  },
  { 
    id: "room-002", 
    name: "Meeting Room B", 
    capacity: 8, 
    location: "2nd Floor, West Wing" 
  },
  { 
    id: "room-003", 
    name: "Boardroom", 
    capacity: 20, 
    location: "3rd Floor, Executive Suite" 
  },
  { 
    id: "room-004", 
    name: "Brainstorm Room", 
    capacity: 6, 
    location: "1st Floor, Innovation Hub" 
  },
  { 
    id: "room-005", 
    name: "Training Room", 
    capacity: 30, 
    location: "4th Floor, Learning Center" 
  }
];

export const generateMockBookings = (): Booking[] => {
  // This will be empty initially - bookings are created by users
  return [];
};
