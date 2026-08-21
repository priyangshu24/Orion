import type { CalendarEventKind, OrionCalendarEvent } from "../types";

export const eventKindMeta: Record<CalendarEventKind, { label: string; color: string; className: string }> = {
  meeting: { label: "Meeting", color: "#38bdf8", className: "border-sky-500/25 bg-sky-500/15 text-sky-100" },
  call: { label: "Call", color: "#10d6ad", className: "border-emerald-500/25 bg-emerald-500/15 text-emerald-100" },
  task: { label: "Task", color: "#9b7cff", className: "border-violet-500/25 bg-violet-500/15 text-violet-100" },
  review: { label: "Review", color: "#f59e0b", className: "border-amber-500/25 bg-amber-500/15 text-amber-100" },
  other: { label: "Other", color: "#64748b", className: "border-slate-500/25 bg-slate-500/15 text-slate-100" },
};

export const calendarWeek = [
  { label: "Mon", date: 17 }, { label: "Tue", date: 18 }, { label: "Wed", date: 19 },
  { label: "Thu", date: 20 }, { label: "Fri", date: 21 }, { label: "Sat", date: 22 }, { label: "Sun", date: 23 },
];

export const teamInviteGroups = {
  "Orion Solutions": ["alex.morgan@orion.co", "emma.wilson@orion.co", "david.kim@orion.co", "sophia.lee@orion.co"],
  "Revenue Team": ["alex.morgan@orion.co", "sophia.lee@orion.co", "nina.patel@orion.co", "james.chen@orion.co"],
  "Growth Team": ["emma.wilson@orion.co", "maria.garcia@orion.co", "liam.brown@orion.co"],
  "Executive Team": ["alex.morgan@orion.co", "emma.wilson@orion.co", "david.kim@orion.co"],
  "Internal Team": ["alex.morgan@orion.co", "emma.wilson@orion.co", "david.kim@orion.co", "sophia.lee@orion.co"],
} as const;

export const initialCalendarEvents: OrionCalendarEvent[] = [
  { id: "ev-1", title: "Team Standup", account: "Orion Solutions", dayIndex: 0, startHour: 9, duration: .5, kind: "call", attendees: 6, location: "Google Meet", notes: "Daily revenue and delivery alignment." },
  { id: "ev-2", title: "Client Call", account: "Apple", dayIndex: 0, startHour: 11, duration: 1, kind: "task", attendees: 4, location: "Zoom", notes: "Review proposal feedback and commercial next steps." },
  { id: "ev-3", title: "Demo Presentation", account: "Google", dayIndex: 0, startHour: 14, duration: 1, kind: "call", attendees: 8, location: "Google Meet", notes: "Enterprise workflow demonstration." },
  { id: "ev-4", title: "Follow-up Call", account: "Amazon", dayIndex: 0, startHour: 16, duration: .5, kind: "meeting", attendees: 3, location: "Phone", notes: "Confirm executive review participants." },
  { id: "ev-5", title: "Discovery Call", account: "NVIDIA", dayIndex: 1, startHour: 10, duration: 1, kind: "call", attendees: 5, location: "Teams", notes: "Document integration and reporting requirements." },
  { id: "ev-6", title: "Product Review", account: "Internal Team", dayIndex: 1, startHour: 13, duration: 1, kind: "review", attendees: 7, location: "Orion HQ", notes: "Review Q3 product readiness." },
  { id: "ev-7", title: "Partnership Call", account: "Tesla", dayIndex: 1, startHour: 15.5, duration: 1, kind: "task", attendees: 4, location: "Zoom", notes: "Align on partnership operating model." },
  { id: "ev-8", title: "Proposal Discussion", account: "Pfizer", dayIndex: 2, startHour: 9.5, duration: 1, kind: "task", attendees: 4, location: "Google Meet", notes: "Walk through revised proposal." },
  { id: "ev-9", title: "Sales Sync", account: "Revenue Team", dayIndex: 2, startHour: 12, duration: 1, kind: "meeting", attendees: 9, location: "Orion HQ", notes: "Weekly pipeline and forecast review." },
  { id: "ev-10", title: "Demo Walkthrough", account: "Microsoft", dayIndex: 2, startHour: 16, duration: 1, kind: "call", attendees: 6, location: "Teams", notes: "Implementation workflow walkthrough." },
  { id: "ev-11", title: "Strategy Meeting", account: "Orion Solutions", dayIndex: 3, startHour: 8.5, duration: 1, kind: "review", attendees: 5, location: "Boardroom", notes: "Finalize H2 account strategy." },
  { id: "ev-12", title: "Client Call", account: "Adobe", dayIndex: 3, startHour: 11, duration: 1, kind: "meeting", attendees: 4, location: "Google Meet", notes: "Discuss procurement process." },
  { id: "ev-13", title: "Contract Review", account: "Salesforce", dayIndex: 3, startHour: 14, duration: 1, kind: "task", attendees: 3, location: "Teams", notes: "Resolve commercial redlines." },
  { id: "ev-14", title: "Marketing Sync", account: "Growth Team", dayIndex: 4, startHour: 9, duration: 1, kind: "call", attendees: 6, location: "Orion HQ", notes: "Q3 campaign planning." },
  { id: "ev-15", title: "Lunch with Partner", account: "Cisco", dayIndex: 4, startHour: 13, duration: 1, kind: "review", attendees: 2, location: "The Atrium", notes: "Partnership relationship review." },
  { id: "ev-16", title: "Quarterly Review", account: "Executive Team", dayIndex: 4, startHour: 15, duration: 1.5, kind: "meeting", attendees: 10, location: "Boardroom", notes: "Quarterly operating review." },
];
