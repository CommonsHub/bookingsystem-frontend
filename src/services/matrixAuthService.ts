
import { saveUser, getUser } from '@/lib/storage';
import { loginOrRegisterWithEmail, getUserProfile } from './matrixService';
import { User } from '@/types';

// Sign in with email
export const signInWithMatrix = async (email: string): Promise<User | null> => {
  try {
    // Try to login or register with Matrix
    const matrixAuth = await loginOrRegisterWithEmail(email);
    
    if (!matrixAuth) {
      return null;
    }
    
    // Get profile info if available
    const profile = await getUserProfile(matrixAuth.userId);
    
    // Create or update user
    const user: User = {
      email,
      verified: true, // Matrix login verifies the user
      matrixUserId: matrixAuth.userId,
      matrixAccessToken: matrixAuth.accessToken
    };
    
    // Save user to local storage
    saveUser(email, true);
    
    // Update Matrix user ID and token
    const savedUser = getUser();
    if (savedUser) {
      savedUser.matrixUserId = matrixAuth.userId;
      savedUser.matrixAccessToken = matrixAuth.accessToken;
      localStorage.setItem('room-time-scribe-user', JSON.stringify(savedUser));
    }
    
    return user;
  } catch (error) {
    console.error("Matrix sign-in error:", error);
    return null;
  }
};

// Check if user is already signed in
export const getMatrixUser = (): { userId: string; accessToken: string } | null => {
  const user = getUser();
  if (user?.matrixUserId && user?.matrixAccessToken) {
    return {
      userId: user.matrixUserId,
      accessToken: user.matrixAccessToken
    };
  }
  return null;
};
