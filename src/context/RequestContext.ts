import { createContext, useContext } from "react";
import { Request, User } from "@/types";

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

export const RequestContext = createContext<RequestContextType>({
  requests: [],
  getRequestById: () => undefined,
  createRequest: async () => "",
  updateRequest: async () => {},
  cancelRequest: () => {},
  completeRequest: () => {},
  user: null,
  canUserCancelRequest: () => false,
  canUserCompleteRequest: () => false,
  loading: false,
});

export const useRequest = () => useContext(RequestContext); 