
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { useRequest } from "@/context/RequestProvider";

export const useLogoutDraftHandler = () => {
  const { user } = useAuth();
  const { clearBookings } = useBooking();
  const { clearRequests } = useRequest();

  const clearUserDrafts = () => {
    if (!user?.email) {
      // Clear anonymous user data
      clearAnonymousUserData();
      return;
    }

    // Clear user-specific booking draft keys
    const userDraftKey = `booking-draft-${user.email}`;
    localStorage.removeItem(userDraftKey);

    // Clear edit drafts for this user
    const allKeys = Object.keys(localStorage);
    const editDraftKeys = allKeys.filter(key => 
      key.startsWith(`booking-edit-draft-${user.email}-`)
    );
    
    editDraftKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear request drafts for this user (if they exist in the future)
    const requestDraftKeys = allKeys.filter(key => 
      key.startsWith(`request-draft-${user.email}`)
    );
    
    requestDraftKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear request edit drafts for this user (if they exist in the future)
    const requestEditDraftKeys = allKeys.filter(key => 
      key.startsWith(`request-edit-draft-${user.email}-`)
    );
    
    requestEditDraftKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log("User drafts cleared on logout");
  };

  const clearAnonymousUserData = () => {
    // Clear anonymous booking draft key
    localStorage.removeItem("anonymous-booking-draft-key");
    
    // Clear any anonymous booking drafts
    const allKeys = Object.keys(localStorage);
    const anonymousBookingDraftKeys = allKeys.filter(key => 
      key.startsWith("booking-draft-anonymous-")
    );
    
    anonymousBookingDraftKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear any anonymous request drafts (if they exist in the future)
    const anonymousRequestDraftKeys = allKeys.filter(key => 
      key.startsWith("request-draft-anonymous-")
    );
    
    anonymousRequestDraftKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log("Anonymous user drafts cleared on logout");
  };

  const clearAllData = () => {
    // Clear localStorage drafts
    clearUserDrafts();
    
    // Clear provider data
    clearBookings();
    clearRequests();
    
    console.log("All data cleared on logout");
  };

  const hasUserDrafts = (): boolean => {
    if (!user?.email) {
      return hasAnonymousUserDrafts();
    }

    // Check for booking drafts
    const userDraftKey = `booking-draft-${user.email}`;
    if (localStorage.getItem(userDraftKey)) return true;

    // Check for edit drafts
    const allKeys = Object.keys(localStorage);
    const editDraftKeys = allKeys.filter(key => 
      key.startsWith(`booking-edit-draft-${user.email}-`)
    );
    
    if (editDraftKeys.length > 0) return true;

    // Check for request drafts (if they exist in the future)
    const requestDraftKeys = allKeys.filter(key => 
      key.startsWith(`request-draft-${user.email}`)
    );
    
    if (requestDraftKeys.length > 0) return true;

    // Check for request edit drafts (if they exist in the future)
    const requestEditDraftKeys = allKeys.filter(key => 
      key.startsWith(`request-edit-draft-${user.email}-`)
    );
    
    if (requestEditDraftKeys.length > 0) return true;

    return false;
  };

  const hasAnonymousUserDrafts = (): boolean => {
    // Check for anonymous booking draft key
    if (localStorage.getItem("anonymous-booking-draft-key")) return true;

    // Check for anonymous booking drafts
    const allKeys = Object.keys(localStorage);
    const anonymousBookingDraftKeys = allKeys.filter(key => 
      key.startsWith("booking-draft-anonymous-")
    );
    
    if (anonymousBookingDraftKeys.length > 0) return true;

    // Check for anonymous request drafts (if they exist in the future)
    const anonymousRequestDraftKeys = allKeys.filter(key => 
      key.startsWith("request-draft-anonymous-")
    );
    
    if (anonymousRequestDraftKeys.length > 0) return true;

    return false;
  };

  return {
    clearUserDrafts,
    hasUserDrafts,
    clearAnonymousUserData,
    hasAnonymousUserDrafts,
    clearAllData,
  };
};
