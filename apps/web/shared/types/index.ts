export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  status: "todo" | "in_progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: User;
  dueDate?: string;
  tags: string[];
  subtasks?: Subtask[];
  saved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  from: { name: string; email: string; avatar?: string };
  to: string;
  subject: string;
  preview: string;
  body: string;
  read: boolean;
  starred: boolean;
  date: string;
  labels: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  color?: string;
  attendees?: { name: string; avatar?: string }[];
  location?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  size: "sm" | "md" | "lg";
}
