"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { mockTasks } from "@/features/tasks/constants/mock-data";
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/lib/utils";

const statusConfig = {
  todo: { icon: Circle, label: "To Do", color: "text-muted-foreground" },
  in_progress: { icon: Clock, label: "In Progress", color: "text-info" },
  done: { icon: CheckCircle2, label: "Done", color: "text-success" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "text-destructive" },
};

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "warning" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
};

type StatusFilter = "all" | "todo" | "in_progress" | "done";

export default function TasksPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filteredTasks = mockTasks.filter((task) => {
    if (filter !== "all" && task.status !== filter) return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const counts = {
    all: mockTasks.length,
    todo: mockTasks.filter((t) => t.status === "todo").length,
    in_progress: mockTasks.filter((t) => t.status === "in_progress").length,
    done: mockTasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your work
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border border-border p-0.5">
          {(["all", "todo", "in_progress", "done"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                filter === status
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status === "all"
                ? "All"
                : status === "in_progress"
                ? "In Progress"
                : status === "todo"
                ? "To Do"
                : "Done"}{" "}
              <span className="ml-1 text-[10px]">{counts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => {
              const status = statusConfig[task.status];
              const priority = priorityConfig[task.priority];
              const StatusIcon = status.icon;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-glass-hover cursor-pointer"
                >
                  <StatusIcon
                    className={cn("h-4 w-4 shrink-0", status.color)}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        task.status === "done" &&
                          "line-through text-muted-foreground"
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
                  <div className="flex items-center gap-2 shrink-0">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                    <Badge variant={priority.variant} className="text-[10px]">
                      {priority.label}
                    </Badge>
                    {task.dueDate && (
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
