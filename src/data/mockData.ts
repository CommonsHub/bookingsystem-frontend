
import { Room, Booking, User, Comment } from "../types";

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

// Demo users
const demoUsers: User[] = [
  { email: "john.doe@example.com", verified: true },
  { email: "sarah.smith@example.com", verified: true },
  { email: "tech.lead@example.com", verified: true },
  { email: "product.manager@example.com", verified: true }
];

// Create sample comments
const createSampleComments = (bookingId: string): Comment[] => {
  const commentTemplates = [
    {
      content: "Can we make sure the projector is set up for this meeting?",
      createdBy: demoUsers[0]
    },
    {
      content: "I've invited the marketing team to join as well.",
      createdBy: demoUsers[1]
    },
    {
      content: "We might need to extend this meeting by 30 minutes.",
      createdBy: demoUsers[2]
    },
    {
      content: "Please prepare the whiteboard markers.",
      createdBy: demoUsers[3]
    }
  ];
  
  return commentTemplates.slice(0, Math.floor(Math.random() * 3) + 1).map((template, index) => ({
    id: `comment-${bookingId}-${index}`,
    bookingId,
    content: template.content,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(), // Random time in the last 3 days
    createdBy: template.createdBy,
    status: 'published'
  }));
};

// Generate today's date and upcoming dates
const today = new Date();
const getDate = (daysFromNow: number, hoursStart: number = 9) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hoursStart, 0, 0, 0);
  return date.toISOString();
};

export const generateMockBookings = (): Booking[] => {
  const mockBookings: Booking[] = [
    {
      id: "booking-001",
      title: "Quarterly Planning Session",
      description: "Discuss Q2 goals and roadmap priorities with department heads",
      room: rooms[2], // Boardroom
      startTime: getDate(1, 10), // Tomorrow, 10 AM
      endTime: getDate(1, 12), // Tomorrow, 12 PM
      status: 'approved',
      createdAt: getDate(-2), // 2 days ago
      createdBy: demoUsers[0],
      comments: createSampleComments("booking-001"),
      approvedBy: demoUsers[3],
      approvedAt: getDate(-1) // Yesterday
    },
    {
      id: "booking-002",
      title: "Product Demo",
      description: "Showcase new features to the client",
      room: rooms[0], // Conference Room A
      startTime: getDate(2, 14), // Day after tomorrow, 2 PM
      endTime: getDate(2, 15), // Day after tomorrow, 3 PM
      status: 'pending',
      createdAt: getDate(-1), // Yesterday
      createdBy: demoUsers[1],
      comments: createSampleComments("booking-002")
    },
    {
      id: "booking-003",
      title: "Team Building Workshop",
      description: "Fun activities to improve team collaboration",
      room: rooms[4], // Training Room
      startTime: getDate(5, 13), // 5 days from now, 1 PM
      endTime: getDate(5, 17), // 5 days from now, 5 PM
      status: 'approved',
      createdAt: getDate(-4), // 4 days ago
      createdBy: demoUsers[2],
      comments: createSampleComments("booking-003"),
      approvedBy: demoUsers[3],
      approvedAt: getDate(-2) // 2 days ago
    },
    {
      id: "booking-004",
      title: "Code Review Session",
      description: "Review the latest pull requests and discuss architecture changes",
      room: rooms[3], // Brainstorm Room
      startTime: getDate(3, 11), // 3 days from now, 11 AM
      endTime: getDate(3, 12), // 3 days from now, 12 PM
      status: 'pending',
      createdAt: getDate(-1, 14), // Yesterday, 2 PM
      createdBy: demoUsers[2],
      comments: []
    },
    {
      id: "booking-005",
      title: "Client Onboarding",
      description: "Initial meeting with new enterprise client",
      room: rooms[1], // Meeting Room B
      startTime: getDate(4, 9), // 4 days from now, 9 AM
      endTime: getDate(4, 10), // 4 days from now, 10 AM
      status: 'draft',
      createdAt: new Date().toISOString(), // Just now
      createdBy: demoUsers[0],
      comments: []
    }
  ];
  
  return mockBookings;
};
