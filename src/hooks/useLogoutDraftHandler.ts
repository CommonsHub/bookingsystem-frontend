
import { useAuth } from "@/context/AuthContext";

export const useLogoutDraftHandler = () => {
  const { user } = useAuth();

  const clearUserDrafts = () => {
    if (!user?.email) return;

    // Clear user-specific draft keys
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

    console.log("User drafts cleared on logout");
  };

  const hasUserDrafts = (): boolean => {
    if (!user?.email) return false;

    const userDraftKey = `booking-draft-${user.email}`;
    if (localStorage.getItem(userDraftKey)) return true;

    // Check for edit drafts
    const allKeys = Object.keys(localStorage);
    const editDraftKeys = allKeys.filter(key => 
      key.startsWith(`booking-edit-draft-${user.email}-`)
    );
    
    return editDraftKeys.length > 0;
  };

  return {
    clearUserDrafts,
    hasUserDrafts,
  };
};
