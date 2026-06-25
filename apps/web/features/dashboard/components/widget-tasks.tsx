"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { mockTasks } from "../constants/mock-data";
import { CheckCircle2, Circle, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  cancelled: Circle,
};

const priorityColors = {
  low: "text-muted-foreground",
  medium: "text-info",
  high: "text-warning",
  urgent: "text-destructive",
};

export function WidgetTasks() {
  const activeTasks = mockTasks.filter((t) => t.status !== "done").slice(0, 4);

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Today&apos;s Tasks</CardTitle>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-2">
        {activeTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          return (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-glass-hover cursor-pointer"
            >
              <StatusIcon
                className={cn("h-4 w-4 shrink-0", priorityColors[task.priority])}
              />
              <span className="flex-1 truncate text-sm">{task.title}</span>
              {task.tags[0] && (
                <Badge variant="secondary" className="text-[10px]">
                  {task.tags[0]}
                </Badge>
              )}
            </div>
          );
        })}
        <p className="pt-1 text-xs text-muted-foreground">
          {mockTasks.filter((t) => t.status === "done").length} of{" "}
          {mockTasks.length} completed
        </p>
      </CardContent>
    </Card>
  );
}
