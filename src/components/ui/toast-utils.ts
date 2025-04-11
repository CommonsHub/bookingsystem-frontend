
import { toast as sonnerToast } from "sonner";

// Create a wrapper with the same API plus convenient methods
export const toast = {
  // Pass through the base toast function
  ...sonnerToast,
  
  // Add convenience methods
  success: (message: string) => {
    return sonnerToast.success(message, {
      className: "bg-green-50 border-green-200 text-green-800"
    });
  },
  
  error: (message: string) => {
    return sonnerToast.error(message, {
      className: "bg-red-50 border-red-200 text-red-800"
    });
  }
};
