
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'PPP');
}

export function formatTime(dateString: string): string {
  return format(new Date(dateString), 'p');
}

export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), 'PPP p');
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return format(date, 'PPP');
}

// Mock email sending - in a real app, this would call a backend API
export function sendVerificationEmail(
  email: string, 
  type: 'booking' | 'comment', 
  id: string, 
  token: string
): Promise<boolean> {
  console.log(`Sending verification email to ${email} for ${type} ${id}`);
  console.log(`Verification link: ${window.location.origin}/verify/${type}/${id}/${token}`);
  
  // In a real app, this would send an actual email
  // For demo purposes, we'll just return a success after a delay
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 1000);
  });
}
