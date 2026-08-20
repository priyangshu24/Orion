export type WorkspaceTaskStatus = "overdue" | "in_progress" | "todo" | "completed";
export type WorkspaceTaskPriority = "low" | "medium" | "high";

export interface WorkspaceSubtask {
  id: string;
  title: string;
  done: boolean;
  owner: string;
}

export interface WorkspaceActivity {
  id: string;
  label: string;
  date: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  summary: string;
  status: WorkspaceTaskStatus;
  priority: WorkspaceTaskPriority;
  assignee: string;
  dueDate: string;
  dueTime: string;
  relatedTo?: string;
  taskType: string;
  reminder: string;
  description: string;
  tags: string[];
  subtasks: WorkspaceSubtask[];
  activity: WorkspaceActivity[];
  files: WorkspaceFile[];
  pinned?: boolean;
}

export interface WorkspaceTaskDraft {
  title: string;
  summary: string;
  status: WorkspaceTaskStatus;
  priority: WorkspaceTaskPriority;
  assignee: string;
  dueDate: string;
  relatedTo?: string;
  description: string;
}
