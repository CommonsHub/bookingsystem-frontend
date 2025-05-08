import { User, Comment } from "@/types";

export const getStorageUser = (): User | null => {
  const data = localStorage.getItem("room-time-scribe-user");
  if (!data) return null;
  return JSON.parse(data) as User;
};

export const saveStorageUser = (
  email: string,
  name: string = "",
  verified: boolean = false,
): User => {
  const user: User = { email, name, verified };
  localStorage.setItem("room-time-scribe-user", JSON.stringify(user));
  return user;
};

export const verifyStorageUser = (email: string): void => {
  const user = getStorageUser();
  if (user && user.email === email) {
    saveStorageUser(email, user.name || "", true);
  }
};

export const saveStorageToken = (
  id: string,
  token: string,
  type: "booking" | "comment",
): void => {
  const existingTokensStr =
    localStorage.getItem("room-time-scribe-tokens") || "{}";
  const existingTokens = JSON.parse(existingTokensStr);

  existingTokens[`${type}-${id}`] = token;
  localStorage.setItem(
    "room-time-scribe-tokens",
    JSON.stringify(existingTokens),
  );
};

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
