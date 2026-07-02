"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Check, Flame, Heart, Plus, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const habits = [
  { id: "deep-work", name: "Deep work", streak: 14, complete: true, color: "bg-primary" },
  { id: "inbox-zero", name: "Inbox zero", streak: 8, complete: true, color: "bg-info" },
  { id: "daily-review", name: "Daily review", streak: 21, complete: false, color: "bg-success" },
  { id: "stretch", name: "Stretch break", streak: 5, complete: false, color: "bg-warning" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitsPage() {
  const [completed, setCompleted] = useState(() => new Set(habits.filter((habit) => habit.complete).map((habit) => habit.id)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Habits</h2>
          <p className="text-sm text-muted-foreground">
            Track repeatable routines that compound into better workdays.
          </p>
        </div>
        <Button><Plus className="h-4 w-4" /> New Habit</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <CardDescription>Click once to mark a habit complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {habits.map((habit) => {
              const isDone = completed.has(habit.id);
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => {
                    setCompleted((current) => {
                      const next = new Set(current);
                      if (next.has(habit.id)) next.delete(habit.id);
                      else next.add(habit.id);
                      return next;
                    });
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-glass p-4 text-left transition-all hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-white", habit.color)}>
                    {isDone ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{habit.name}</span>
                    <span className="text-xs text-muted-foreground">{habit.streak} day streak</span>
                  </span>
                  <Badge variant={isDone ? "default" : "secondary"}>{isDone ? "Done" : "Open"}</Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Consistency</CardTitle>
            <CardDescription>Mock weekly completion heatmap.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={day} className="space-y-2 text-center">
                  <p className="text-[10px] text-muted-foreground">{day}</p>
                  <div className={cn("h-12 rounded-xl border border-border/60", index < 5 ? "bg-primary/30" : "bg-muted/50")} />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-primary">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-semibold">21 day best streak</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Orion will add smart habit nudges in Phase 2.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            AI suggestion: schedule Daily review after your final meeting to improve consistency.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
