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

// Demo users with more variety
const demoUsers: User[] = [
  { email: "john.doe@example.com", verified: true },
  { email: "sarah.smith@example.com", verified: true },
  { email: "tech.lead@example.com", verified: true },
  { email: "product.manager@example.com", verified: true },
  { email: "dev.team@example.com", verified: true },
  { email: "marketing@example.com", verified: true }
];

// Create sample comments with more variety
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
    },
    {
      content: "I'll bring the presentation materials.",
      createdBy: demoUsers[4]
    },
    {
      content: "Can we also discuss the Q3 roadmap?",
      createdBy: demoUsers[5]
    }
  ];
  
  return commentTemplates.slice(0, Math.floor(Math.random() * 4) + 1).map((template, index) => ({
    id: `comment-${bookingId}-${index}`,
    bookingId,
    content: template.content,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    createdBy: template.createdBy,
    status: 'published'
  }));
};

// Generate dates including past dates
const today = new Date();
const getDate = (daysFromNow: number, hoursStart: number = 9) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hoursStart, 0, 0, 0);
  return date.toISOString();
};

export const generateMockBookings = (): Booking[] => {
  const mockBookings: Booking[] = [
    // Past completed bookings
    {
      id: "booking-001",
      title: "Q1 Planning Session",
      description: "Review of Q1 achievements and setting Q2 goals",
      room: rooms[2],
      startTime: getDate(-5, 10),
      endTime: getDate(-5, 12),
      status: 'approved',
      createdAt: getDate(-7),
      createdBy: demoUsers[0],
      comments: createSampleComments("booking-001"),
      approvedBy: demoUsers[3],
      approvedAt: getDate(-6)
    },
    {
      id: "booking-002",
      title: "Team Retrospective",
      description: "Monthly team retrospective and feedback session",
      room: rooms[3],
      startTime: getDate(-2, 14),
      endTime: getDate(-2, 16),
      status: 'approved',
      createdAt: getDate(-4),
      createdBy: demoUsers[1],
      comments: createSampleComments("booking-002"),
      approvedBy: demoUsers[2],
      approvedAt: getDate(-3)
    },
    // Current/upcoming approved bookings
    {
      id: "booking-003",
      title: "Client Workshop",
      description: "Workshop with key client stakeholders",
      room: rooms[0],
      startTime: getDate(1, 9),
      endTime: getDate(1, 17),
      status: 'approved',
      createdAt: getDate(-3),
      createdBy: demoUsers[2],
      comments: createSampleComments("booking-003"),
      approvedBy: demoUsers[3],
      approvedAt: getDate(-1)
    },
    // Pending bookings
    {
      id: "booking-004",
      title: "Product Demo",
      description: "New feature demonstration to stakeholders",
      room: rooms[1],
      startTime: getDate(3, 13),
      endTime: getDate(3, 15),
      status: 'pending',
      createdAt: getDate(-1),
      createdBy: demoUsers[4],
      comments: createSampleComments("booking-004")
    },
    {
      id: "booking-005",
      title: "Architecture Review",
      description: "Review of system architecture and planned improvements",
      room: rooms[4],
      startTime: getDate(4, 10),
      endTime: getDate(4, 12),
      status: 'pending',
      createdAt: getDate(-1),
      createdBy: demoUsers[2],
      comments: createSampleComments("booking-005")
    },
    // Draft bookings
    {
      id: "booking-006",
      title: "Team Building Event",
      description: "Offsite team building activities",
      room: rooms[4],
      startTime: getDate(7, 9),
      endTime: getDate(7, 17),
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: demoUsers[1],
      comments: []
    },
    // Rejected booking
    {
      id: "booking-007",
      title: "Department Social",
      description: "Monthly department social gathering",
      room: rooms[2],
      startTime: getDate(5, 16),
      endTime: getDate(5, 18),
      status: 'rejected',
      createdAt: getDate(-2),
      createdBy: demoUsers[5],
      comments: createSampleComments("booking-007"),
      approvedBy: demoUsers[3],
      approvedAt: getDate(-1)
    }
  ];
  
  return mockBookings;
};
