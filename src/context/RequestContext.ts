import { createContext, useContext } from "react";
import { Request, User } from "@/types";

interface RequestContextType {
  requests: Request[];
  getRequestById: (id: string) => Request | undefined;
  createRequest: (requestData: Partial<Request>) => Promise<string>;
  updateRequest: (id: string, requestData: Partial<Request>) => Promise<void>;
  cancelRequest: (id: string) => void;
  completeRequest: (id: string) => void;
  addCommentToRequest: (requestId: string, content: string, email: string, name: string) => Promise<string>;
  clearRequests: () => void;
  user: User | null;
  canUserCancelRequest: (request: Request, user: User | null) => boolean;
  canUserCompleteRequest: (request: Request, user: User | null) => boolean;
  canUserMarkAsCompleted: (request: Request, user: User | null) => boolean;
  loading: boolean;
}

export const RequestContext = createContext<RequestContextType>({
  requests: [],
  getRequestById: () => undefined,
  createRequest: async () => "",
  updateRequest: async () => {},
  cancelRequest: () => {},
  completeRequest: () => {},
  addCommentToRequest: async () => "",
  clearRequests: () => {},
  user: null,
  canUserCancelRequest: () => false,
  canUserCompleteRequest: () => false,
  canUserMarkAsCompleted: () => false,
  loading: false,
});

export const useRequest = () => useContext(RequestContext); 