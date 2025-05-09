import { Comment } from "@/types";

export const addStorageComment = (
  bookingId: string,
  comment: Comment,
): void => {
  // For now, we'll just update the local state
  // In a real implementation, this would save to database
};

export const updateStorageCommentStatus = (
  bookingId: string,
  commentId: string,
  status: "draft" | "published",
): void => {
  // For now, we'll just update the local state
  // In a real implementation, this would save to database
};
