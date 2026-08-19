"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { dashboardTasks } from "../constants/crm-data";

export function TasksPanel() {
  // Local state only — completion is UI-optimistic until the Phase 2 API lands.
  const [tasks, setTasks] = useState(dashboardTasks);

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Tasks</h2>
        <button
          type="button"
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
    </section>
  );
}
