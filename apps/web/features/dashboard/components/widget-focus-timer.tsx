"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export function WidgetFocusTimer() {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeDasharray={`${44 * 2 * Math.PI * 0.75} ${44 * 2 * Math.PI}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="text-2xl font-bold tracking-tight">25:00</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <Play className="h-3.5 w-3.5" />
            Start
          </Button>
          <Button variant="outline" size="sm">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
