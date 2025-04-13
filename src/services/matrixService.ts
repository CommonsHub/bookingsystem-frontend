
import * as sdk from "matrix-js-sdk";
import { Booking } from "@/types";

// Matrix connection details
const MATRIX_SERVER_URL = "https://matrix.org"; // Replace with your Matrix server URL
const ADMIN_USER_ID = "mushroom@commonshub.brussels";

// Matrix client instance
let matrixClient: sdk.MatrixClient | null = null;

// Initialize Matrix client
export const initMatrixClient = (userId: string, accessToken: string) => {
  if (matrixClient) {
    return matrixClient;
  }
  
  matrixClient = sdk.createClient({
    baseUrl: MATRIX_SERVER_URL,
    userId,
    accessToken,
  });
  
  return matrixClient;
};

// Login with username and password (for regular users)
export const loginWithPassword = async (
  username: string,
  password: string
): Promise<{ userId: string; accessToken: string } | null> => {
  try {
    const tempClient = sdk.createClient({ baseUrl: MATRIX_SERVER_URL });
    const response = await tempClient.login("m.login.password", {
      user: username,
      password: password,
    });
    
    // Initialize client with the received credentials
    initMatrixClient(response.user_id, response.access_token);
    
    return {
      userId: response.user_id,
      accessToken: response.access_token,
    };
  } catch (error) {
    console.error("Matrix login error:", error);
    return null;
  }
};

// Login or register with email
export const loginOrRegisterWithEmail = async (
  email: string
): Promise<{ userId: string; accessToken: string } | null> => {
  try {
    // First try to login with email as username
    try {
      return await loginWithPassword(email, email); // Simple password strategy
    } catch (error) {
      console.log("Login failed, attempting registration");
    }
    
    // If login fails, register the user
    const tempClient = sdk.createClient({ baseUrl: MATRIX_SERVER_URL });
    const username = email.split('@')[0]; // Use part before @ as username
    
    const response = await tempClient.register(
      username,
      email, // Using email as password for simplicity
      undefined, // No device ID
      { type: "m.login.dummy" } // Use dummy auth for testing
    );
    
    initMatrixClient(response.user_id, response.access_token);
    
    return {
      userId: response.user_id, 
      accessToken: response.access_token,
    };
  } catch (error) {
    console.error("Matrix registration error:", error);
    return null;
  }
};

// Create a Matrix room for a booking
export const createMatrixRoom = async (
  booking: Booking,
  userIds: string[] = []
): Promise<string | null> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return null;
  }
  
  try {
    // Create room with booking information
    const response = await matrixClient.createRoom({
      visibility: "private" as sdk.Visibility,
      name: `Booking: ${booking.title}`,
      topic: booking.description,
      invite: [ADMIN_USER_ID, ...userIds],
      initial_state: [
        {
          type: "m.room.guest_access",
          state_key: "",
          content: { guest_access: "forbidden" }
        },
        {
          type: "com.room.booking.status",
          state_key: "",
          content: { 
            status: booking.status,
            bookingId: booking.id,
            room: booking.room.name,
            startTime: booking.startTime,
            endTime: booking.endTime,
            createdBy: booking.createdBy.email
          }
        },
        {
          type: "m.room.power_levels",
          state_key: "",
          content: {
            users: {
              [ADMIN_USER_ID]: 100, // Admin has highest power level
            },
            events: {
              "com.room.booking.status": 100 // Only users with power level 100 can modify status
            },
            state_default: 100, // Only admins can change state events
            users_default: 0,
            events_default: 0
          }
        }
      ]
    });

    return response.room_id;
  } catch (error) {
    console.error("Error creating Matrix room:", error);
    return null;
  }
};

// Update the booking status in the Matrix room
export const updateBookingStatus = async (
  roomId: string,
  status: string
): Promise<boolean> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return false;
  }
  
  try {
    const currentState = await matrixClient.getStateEvent(
      roomId,
      "com.room.booking.status" as any,
      ""
    );
    
    await matrixClient.sendStateEvent(
      roomId,
      "com.room.booking.status" as any,
      {
        ...currentState,
        status
      },
      ""
    );
    
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

// Invite a user to a Matrix room
export const inviteUserToRoom = async (
  roomId: string,
  userId: string
): Promise<boolean> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return false;
  }
  
  try {
    await matrixClient.invite(roomId, userId);
    return true;
  } catch (error) {
    console.error("Error inviting user to room:", error);
    return false;
  }
};

// Send a message to a Matrix room
export const sendMessageToRoom = async (
  roomId: string,
  message: string
): Promise<boolean> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return false;
  }
  
  try {
    await matrixClient.sendTextMessage(roomId, message);
    return true;
  } catch (error) {
    console.error("Error sending message to room:", error);
    return false;
  }
};

// Get messages from a room
export const getMessagesFromRoom = async (
  roomId: string,
  limit: number = 50
): Promise<any[]> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return [];
  }
  
  try {
    // Start syncing if not already
    if (!matrixClient.getSyncState()) {
      await matrixClient.startClient({ initialSyncLimit: 10 });
    }
    
    const room = matrixClient.getRoom(roomId);
    if (!room) {
      console.error("Room not found");
      return [];
    }
    
    // Get timeline events
    const timelineEvents = room.getLiveTimeline().getEvents();
    
    // Filter for message events
    return timelineEvents
      .filter(event => event.getType() === "m.room.message")
      .slice(-limit)
      .map(event => ({
        id: event.getId(),
        sender: event.getSender(),
        content: event.getContent(),
        timestamp: event.getDate()?.getTime()
      }));
  } catch (error) {
    console.error("Error getting messages from room:", error);
    return [];
  }
};

// Check if a user is an admin of a room
export const isUserAdmin = (roomId: string, userId: string): boolean => {
  if (!matrixClient) {
    return false;
  }
  
  const room = matrixClient.getRoom(roomId);
  if (!room) {
    return false;
  }
  
  const powerLevels = room.currentState.getStateEvents("m.room.power_levels", "");
  if (!powerLevels) {
    return false;
  }
  
  const content = powerLevels.getContent();
  return content.users && content.users[userId] === 100;
};

// Get user profile information
export const getUserProfile = async (userId: string): Promise<{ displayName: string; avatarUrl: string } | null> => {
  if (!matrixClient) {
    console.error("Matrix client not initialized");
    return null;
  }
  
  try {
    const profile = await matrixClient.getProfileInfo(userId);
    return {
      displayName: profile.displayname || userId,
      avatarUrl: profile.avatar_url || ""
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};
