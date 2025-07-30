import React, { createContext, useContext } from "react";
import { Request, User } from "@/types";
import { useAuth } from "./AuthContext";
import { useRequestOperations } from "@/hooks/useRequestOperations";

interface RequestProviderProps {
  children: React.ReactNode;
}

interface RequestContextType {
  requests: Request[];
  getRequestById: (id: string) => Request | undefined;
  createRequest: (requestData: Partial<Request>) => Promise<string>;
  updateRequest: (id: string, requestData: Partial<Request>) => Promise<void>;
  cancelRequest: (id: string) => void;
  completeRequest: (id: string) => void;
  user: User | null;
  canUserCancelRequest: (request: Request, user: User | null) => boolean;
  canUserCompleteRequest: (request: Request, user: User | null) => boolean;
  loading: boolean;
}

const RequestContext = createContext<RequestContextType | null>(null);

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { 
    requests, 
    setRequests, 
    loading, 
    getRequestById, 
    createRequest, 
    updateRequest, 
    cancelRequest: cancelRequestWithUser, 
    completeRequest: completeRequestWithUser 
  } = useRequestOperations();

  // Wrapper functions to match the context interface
  const cancelRequest = (id: string): void => {
    cancelRequestWithUser(id, user);
  };

  const completeRequest = (id: string): void => {
    completeRequestWithUser(id, user);
  };

  const canUserCancelRequest = (request: Request, currentUser: User | null): boolean => {
    if (!currentUser) return false;
    return request.createdBy.email === currentUser.email && request.status === "pending";
  };

  const canUserCompleteRequest = (request: Request, currentUser: User | null): boolean => {
    if (!currentUser) return false;
    // For now, allow the creator to complete their own requests
    // In a real app, this might be restricted to admins
    return request.createdBy.email === currentUser.email && request.status === "in_progress";
  };

  const value = {
    requests,
    getRequestById,
    createRequest,
    updateRequest,
    cancelRequest,
    completeRequest,
    user,
    canUserCancelRequest,
    canUserCompleteRequest,
    loading,
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequest must be used within a RequestProvider");
  }
  return context;
}; 