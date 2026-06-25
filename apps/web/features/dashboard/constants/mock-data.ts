import type { Task, Email, CalendarEvent } from "@/shared/types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review design system tokens",
    description: "Verify all color and spacing tokens match Figma",
    status: "in_progress",
    priority: "high",
    tags: ["design", "urgent"],
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Implement command palette shortcuts",
    status: "todo",
    priority: "medium",
    tags: ["feature"],
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write API documentation",
    status: "todo",
    priority: "low",
    tags: ["docs"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Fix sidebar animation jank",
    status: "done",
    priority: "high",
    tags: ["bug", "ui"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "5",
    title: "Set up CI/CD pipeline",
    status: "in_progress",
    priority: "urgent",
    tags: ["devops"],
    dueDate: new Date(Date.now() + 43200000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
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
    date: new Date(Date.now() - 1800000).toISOString(),
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
    date: new Date(Date.now() - 3600000).toISOString(),
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
    date: new Date(Date.now() - 7200000).toISOString(),
    labels: ["github"],
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 1800000).toISOString(),
    color: "#6366f1",
    attendees: [{ name: "Sarah" }, { name: "Mike" }, { name: "Alex" }],
  },
  {
    id: "2",
    title: "Design Review",
    start: new Date(Date.now() + 7200000).toISOString(),
    end: new Date(Date.now() + 10800000).toISOString(),
    color: "#8b5cf6",
    attendees: [{ name: "Alex" }, { name: "Lisa" }],
  },
  {
    id: "3",
    title: "Sprint Planning",
    description: "Plan next sprint items",
    start: new Date(Date.now() + 86400000).toISOString(),
    end: new Date(Date.now() + 90000000).toISOString(),
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
  { label: "Ask AI", shortcut: "A" },
];
