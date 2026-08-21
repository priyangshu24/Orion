export type CalendarView = "day" | "week" | "month" | "agenda";
export type CalendarEventKind = "meeting" | "call" | "task" | "review" | "other";

export interface OrionCalendarEvent {
  id: string;
  title: string;
  account: string;
  dayIndex: number;
  startHour: number;
  duration: number;
  kind: CalendarEventKind;
  attendees: number;
  invitees?: string[];
  location: string;
  notes: string;
}

export interface CalendarEventDraft {
  title: string;
  account: string;
  dayIndex: number;
  startHour: number;
  duration: number;
  kind: CalendarEventKind;
  attendees: number;
  invitees: string[];
  location: string;
  notes: string;
}
