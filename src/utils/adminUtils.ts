import { User } from "@/types";

/**
 * Check if a user has admin privileges using the RBAC system
 * Falls back to email domain check for backward compatibility
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;

  // Check if user has admin role using RBAC system
  if (user.roles?.includes('admin')) return true;

  return false;
};

/**
 * Check if a user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.roles?.includes(role as any) || false;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return user.roles?.some(role => roles.includes(role)) || false;
}; 