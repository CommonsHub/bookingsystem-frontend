export interface ICSEvent {
  summary: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  uid: string;
  isAllDay?: boolean;
  startTzid?: string;
  endTzid?: string;
} 