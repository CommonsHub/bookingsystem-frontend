import { Room } from "@/types";

export const rooms: Room[] = [
  {
    id: "room-001",
    name: "Elinor Ostrom room ",
    capacity: "17-100",
    location: "2st Floor",
    description: "Large conference space",
    setupOptions: [
      {
        type: "Workshop",
        minCapacity: 17,
        maxCapacity: 50,
        icon: "music",
        description: "in dynamic workshop set up or circle",
      },
      {
        type: "Theater",
        minCapacity: 50,
        maxCapacity: 80,
        icon: "theater",
        description: "theater setup",
      },
      {
        type: "Networking",
        minCapacity: 80,
        maxCapacity: 120,
        icon: "mic",
        description: "standing, networking",
      },
    ],
  },
  {
    id: "room-002",
    name: "Satoshi room",
    capacity: "10-17",
    location: "2nd Floor",
    description: "Medium-sized conference room",
    setupOptions: [],
  },
  {
    id: "room-003",
    name: "Angel Room",
    capacity: "12",
    location: "2nd Floor",
    description: "Perfect for small meetings",
    setupOptions: [],
  },
  {
    id: "room-004",
    name: "Mush Room",
    capacity: "10",
    location: "1st Floor",
  },
  {
    id: "room-005",
    name: "Somatic Studio",
    capacity: "2-4",
    location: "1th Floor",
  },
];
