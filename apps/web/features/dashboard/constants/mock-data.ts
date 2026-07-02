import type { Task, Email, CalendarEvent } from "@/shared/types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review design system tokens",
    description: "Verify all color and spacing tokens match Figma",
    status: "in_progress",
    priority: "high",
    tags: ["design", "urgent"],
    dueDate: "2026-06-27T09:00:00.000Z",
    createdAt: "2026-06-24T09:00:00.000Z",
    updatedAt: "2026-06-26T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Implement command palette shortcuts",
    status: "todo",
    priority: "medium",
    tags: ["feature"],
    dueDate: "2026-06-28T09:00:00.000Z",
    createdAt: "2026-06-25T09:00:00.000Z",
    updatedAt: "2026-06-26T09:00:00.000Z",
  },
  {
    id: "3",
    title: "Write API documentation",
    status: "todo",
    priority: "low",
    tags: ["docs"],
    createdAt: "2026-06-23T09:00:00.000Z",
    updatedAt: "2026-06-26T09:00:00.000Z",
  },
  {
    id: "4",
    title: "Fix sidebar animation jank",
    status: "done",
    priority: "high",
    tags: ["bug", "ui"],
    createdAt: "2026-06-22T09:00:00.000Z",
    updatedAt: "2026-06-26T08:00:00.000Z",
  },
  {
    id: "5",
    title: "Set up CI/CD pipeline",
    status: "in_progress",
    priority: "urgent",
    tags: ["devops"],
    dueDate: "2026-06-26T21:00:00.000Z",
    createdAt: "2026-06-25T09:00:00.000Z",
    updatedAt: "2026-06-26T09:00:00.000Z",
  },
];

export const mockEmails: Email[] = [
  {
    id: "1",
    from: { name: "Sarah Chen", email: "sarah@orion.dev" },
    to: "alex@orion.dev",
    subject: "Q4 Product Roadmap — Final Review",
    preview: "Hey Alex, I've attached the final version of the Q4 roadmap...",
    body: "",
    read: false,
    starred: true,
    date: "2026-06-26T08:30:00.000Z",
    labels: ["important"],
  },
  {
    id: "2",
    from: { name: "Mike Johnson", email: "mike@orion.dev" },
    to: "alex@orion.dev",
    subject: "Re: Design System Updates",
    preview: "Looks great! I have a few suggestions for the color tokens...",
    body: "",
    read: false,
    starred: false,
    date: "2026-06-26T08:00:00.000Z",
    labels: ["design"],
  },
  {
    id: "3",
    from: { name: "GitHub", email: "noreply@github.com" },
    to: "alex@orion.dev",
    subject: "[orion-os] PR #142 merged",
    preview: "Pull request #142 has been merged into main",
    body: "",
    read: true,
    starred: false,
    date: "2026-06-26T07:00:00.000Z",
    labels: ["github"],
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: "2026-06-26T09:00:00.000Z",
    end: "2026-06-26T09:30:00.000Z",
    color: "#6366f1",
    attendees: [{ name: "Sarah" }, { name: "Mike" }, { name: "Alex" }],
  },
  {
    id: "2",
    title: "Design Review",
    start: "2026-06-26T11:00:00.000Z",
    end: "2026-06-26T12:00:00.000Z",
    color: "#8b5cf6",
    attendees: [{ name: "Alex" }, { name: "Lisa" }],
  },
  {
    id: "3",
    title: "Sprint Planning",
    description: "Plan next sprint items",
    start: "2026-06-27T09:00:00.000Z",
    end: "2026-06-27T10:00:00.000Z",
    color: "#22c55e",
  },
];

export const productivityScore = 87;

export const aiSuggestions = [
  "You have 3 overdue tasks — prioritize the CI/CD pipeline setup",
  "Block 2 hours for deep work this afternoon — your calendar is clear",
  "Consider delegating the API docs to the team",
];

export const quickActions = [
  { label: "New Task", shortcut: "T" },
  { label: "New Email", shortcut: "E" },
  { label: "New Meeting", shortcut: "M" },
  { label: "Ask Nova", shortcut: "A" },
];
