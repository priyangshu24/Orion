"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { CircularProgress } from "@/shared/components/ui/circular-progress";
import { mockTasks } from "@/features/tasks/constants/mock-data";
import type { Task } from "@/shared/types";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  ArrowUp,
  CalendarDays,
  User as UserIcon,
  ListChecks,
  Tag as TagIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const statusConfig = {
  todo: { icon: Circle, label: "To Do", color: "text-muted-foreground", ring: "" },
  in_progress: {
    icon: Clock,
    label: "In Progress",
    color: "text-primary",
    ring: "bg-primary/15 text-primary ring-1 ring-primary/30",
  },
  done: { icon: CheckCircle2, label: "Done", color: "text-success", ring: "" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-destructive", ring: "" },
} as const;

const priorityConfig = {
  low: { label: "Low", cls: "bg-teal-500/15 text-teal-300 ring-teal-500/25", arrow: false },
  medium: { label: "Medium", cls: "bg-blue-500/15 text-blue-300 ring-blue-500/25", arrow: false },
  high: { label: "High", cls: "bg-amber-500/15 text-amber-300 ring-amber-500/25", arrow: true },
  urgent: { label: "Urgent", cls: "bg-rose-500/15 text-rose-300 ring-rose-500/25", arrow: false },
} as const;

const tagStyles: Record<string, string> = {
  design: "bg-violet-500/15 text-violet-300 ring-violet-500/25",
  urgent: "bg-rose-500/15 text-rose-300 ring-rose-500/25",
  feature: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/25",
  docs: "bg-sky-500/15 text-sky-300 ring-sky-500/25",
  bug: "bg-rose-500/15 text-rose-300 ring-rose-500/25",
  ui: "bg-cyan-500/15 text-cyan-300 ring-cyan-500/25",
  devops: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-500/25",
  refactor: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  settings: "bg-teal-500/15 text-teal-300 ring-teal-500/25",
  performance: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  security: "bg-red-500/15 text-red-300 ring-red-500/25",
  analytics: "bg-blue-500/15 text-blue-300 ring-blue-500/25",
  growth: "bg-green-500/15 text-green-300 ring-green-500/25",
};

function tagClass(tag: string) {
  return tagStyles[tag] ?? "bg-zinc-500/15 text-zinc-300 ring-zinc-500/25";
}

const pill = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1";

const tabs = [
  { key: "all", label: "All Tasks", icon: ListChecks },
  { key: "in_progress", label: "In Progress", icon: Clock },
  { key: "done", label: "Done", icon: CheckCircle2 },
  { key: "todo", label: "Backlog", icon: Circle },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const nextStatus: Record<Task["status"], Task["status"]> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
  cancelled: "todo",
};

function formatLong(date?: string) {
  if (!date) return "â€”";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(mockTasks[0]?.id ?? null);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (tab !== "all" && task.status !== tab) return false;
        const query = search.trim().toLowerCase();
        if (!query) return true;
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some((t) => t.toLowerCase().includes(query))
        );
      }),
    [tab, search, tasks]
  );

  const selectedTask =
    tasks.find((task) => task.id === selectedId) ?? filteredTasks[0] ?? null;

  const counts = {
    all: tasks.length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  const completed = tasks.filter((t) => t.status === "done").length;
  const completionPct = Math.round((completed / tasks.length) * 100);

  function createTask() {
    const task: Task = {
      id: `local-${Date.now()}`,
      title: "New Orion task",
      description: "Created locally in Phase 1 mock mode.",
      status: "todo",
      priority: "medium",
      tags: ["local"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((current) => [task, ...current]);
    setTab("all");
    setSelectedId(task.id);
  }

  function setStatus(taskId: string, status: Task["status"]) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  }

  function cycleStatus(taskId: string, current: Task["status"]) {
    setStatus(taskId, nextStatus[current]);
  }

  function toggleSaved(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, saved: !task.saved } : task
      )
    );
  }

  function toggleSubtask(taskId: string, subId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks?.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
          : task
      )
    );
  }

  function deleteTask(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
    if (selectedId === taskId) setSelectedId(null);
  }

  function resetTasks() {
    setTasks(mockTasks);
    setSearch("");
    setTab("all");
    setSelectedId(mockTasks[0]?.id ?? null);
  }

  const subDone = selectedTask?.subtasks?.filter((s) => s.done).length ?? 0;
  const subTotal = selectedTask?.subtasks?.length ?? 0;
  const subPct = subTotal ? Math.round((subDone / subTotal) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 xl:grid-cols-12">
        {/* List panel */}
        <Card className="neon-panel flex min-h-0 flex-col rounded-[18px] xl:col-span-8">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 px-3 pt-3">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 pb-3 pt-1 text-sm font-medium transition-colors",
                    active
                      ? "border-b-2 border-primary text-foreground"
                      : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px]",
                      active ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>

          <CardContent className="flex-1 overflow-y-auto p-2">
            {filteredTasks.length === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <Search className="h-9 w-9 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium">No tasks found</p>
                <p className="text-xs text-muted-foreground">
                  Try another search or create a new task.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredTasks.map((task) => {
                  const status = statusConfig[task.status];
                  const StatusIcon = status.icon;
                  const priority = priorityConfig[task.priority];
                  const isSelected = selectedTask?.id === task.id;
                  const isDone = task.status === "done";

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedId(task.id)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 transition-all",
                        isSelected
                          ? "neon-active"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                      )}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleStatus(task.id, task.status);
                        }}
                        aria-label="Cycle status"
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
                          status.ring
                        )}
                      >
                        <StatusIcon className={cn("h-5 w-5", status.color)} />
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            isDone && "text-muted-foreground line-through"
                          )}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="hidden shrink-0 items-center gap-2 md:flex">
                        {task.tags.slice(0, 1).map((tag) => (
                          <span key={tag} className={cn(pill, tagClass(tag))}>
                            {tag}
                          </span>
                        ))}
                        <span className={cn(pill, priority.cls)}>
                          {priority.arrow && <ArrowUp className="h-3 w-3" />}
                          {priority.label}
                        </span>
                        {task.dueDate && (
                          <span className="w-[68px] text-right text-[11px] text-muted-foreground">
                            {formatLong(task.dueDate)}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaved(task.id);
                        }}
                        aria-label={task.saved ? "Remove bookmark" : "Bookmark task"}
                        className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Bookmark
                          className={cn(
                            "h-4 w-4",
                            task.saved && "fill-success text-success"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3">
            <span className="shrink-0 text-xs text-muted-foreground">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <div className="flex flex-1 items-center justify-end gap-3">
              <span className="shrink-0 text-xs text-muted-foreground">
                Completed <span className="font-semibold text-foreground">{completed}</span>
              </span>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs font-semibold">
                {completionPct}%
              </span>
            </div>
          </div>
        </Card>

        {/* Detail panel */}
        <Card className="neon-panel rounded-[18px] xl:col-span-4">
          {selectedTask ? (
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                <TagIcon className="h-3.5 w-3.5" />
                {selectedTask.tags[0] ?? "Task"}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold leading-snug">{selectedTask.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={cn(pill, statusConfig[selectedTask.status].ring || "bg-white/5 text-muted-foreground ring-white/10")}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusConfig[selectedTask.status].label}
                </span>
                <span className={cn(pill, priorityConfig[selectedTask.priority].cls)}>
                  {priorityConfig[selectedTask.priority].arrow && <ArrowUp className="h-3 w-3" />}
                  {priorityConfig[selectedTask.priority].label}
                </span>
                {selectedTask.tags.map((tag) => (
                  <span key={tag} className={cn(pill, tagClass(tag))}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> Due date
                  </p>
                  <p className="mt-1.5 text-sm font-medium">{formatLong(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <UserIcon className="h-3.5 w-3.5" /> Assignee
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    {selectedTask.assignee ? (
                      <>
                        <Avatar className="h-6 w-6 ring-1 ring-white/10">
                          <AvatarFallback className="text-[10px]">
                            {selectedTask.assignee.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{selectedTask.assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedTask.notes && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {selectedTask.notes}
                  </p>
                </div>
              )}

              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <ListChecks className="h-3.5 w-3.5" /> Subtasks
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {selectedTask.subtasks.map((sub) => (
                          <li key={sub.id}>
                            <button
                              type="button"
                              onClick={() => toggleSubtask(selectedTask.id, sub.id)}
                              className="flex w-full items-center gap-2 text-left text-sm"
                            >
                              {sub.done ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span
                                className={cn(
                                  "truncate",
                                  sub.done && "text-muted-foreground line-through"
                                )}
                              >
                                {sub.title}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <CircularProgress value={subPct} size={64} />
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setStatus(selectedTask.id, "done")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-glow transition-all hover:opacity-90 active:scale-[0.99]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Move to Done
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(selectedTask.id, "cancelled")}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-foreground transition-colors hover:bg-white/[0.07] active:scale-[0.99]"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Task
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(selectedTask.id)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-destructive/90 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive active:scale-[0.99]"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Task
                </button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex h-72 flex-col items-center justify-center p-5 text-center">
              <Circle className="h-9 w-9 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Select a task to see details.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
