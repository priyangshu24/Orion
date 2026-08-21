"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { dashboardTasks } from "../constants/crm-data";

export function TasksPanel() {
  // Local state only — completion is UI-optimistic until the Phase 2 API lands.
  const [tasks, setTasks] = useState(dashboardTasks);
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!composerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setComposerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [composerOpen]);

  const toggle = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    if (task) toast.success(task.done ? "Task reopened" : "Task completed");
  };

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      toast.error("Enter a task title");
      return;
    }

    const due = dueDate
      ? new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "No due date";

    setTasks((current) => [
      { id: `task-${Date.now()}`, title: cleanTitle, due, done: false },
      ...current,
    ]);
    setTitle("");
    setDueDate("");
    setComposerOpen(false);
    toast.success("Task created");
  }

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Tasks</h2>
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-primary/25 bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary transition hover:bg-primary/16"
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </button>
      </header>

      <ul className="mt-2 flex flex-col">
        {tasks.map((task) => (
          <li key={task.id}>
            <button
              type="button"
              onClick={() => toggle(task.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-left transition hover:bg-foreground/[0.04]"
              aria-pressed={task.done}
            >
              <span
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded border transition",
                  task.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/45 bg-transparent"
                )}
              >
                {task.done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[11px] transition",
                  task.done
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.title}
              </span>
              <span className="shrink-0 text-[9px] text-muted-foreground">
                {task.due}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {composerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="new-task-title">
          <button
            type="button"
            aria-label="Close new task dialog"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setComposerOpen(false)}
          />
          <form onSubmit={createTask} className="neon-panel relative z-10 w-full max-w-md rounded-2xl p-5 shadow-floating">
            <header className="flex items-center justify-between gap-4">
              <h2 id="new-task-title" className="text-base font-semibold text-foreground">Create task</h2>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <label className="mt-4 block text-[11px] font-medium text-muted-foreground" htmlFor="dashboard-task-title">Task title</label>
            <input
              id="dashboard-task-title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Follow up with Apple"
              className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />

            <label className="mt-4 block text-[11px] font-medium text-muted-foreground" htmlFor="dashboard-task-due">Due date</label>
            <input
              id="dashboard-task-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50"
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition hover:bg-foreground/[0.05] hover:text-foreground"
              >
                Cancel
              </button>
              <button type="submit" className="orion-add-widget rounded-lg px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110">
                Create task
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
