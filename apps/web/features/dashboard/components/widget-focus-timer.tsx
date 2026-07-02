"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";

const FOCUS_SECONDS = 25 * 60;

export function WidgetFocusTimer() {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const progress = useMemo(() => remaining / FOCUS_SECONDS, [remaining]);
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  function reset() {
    setRunning(false);
    setRemaining(FOCUS_SECONDS);
  }

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-muted)" strokeWidth="4" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeDasharray={`${44 * 2 * Math.PI * progress} ${44 * 2 * Math.PI}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="text-2xl font-bold tracking-tight">{minutes}:{seconds}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setRunning((value) => !value)} disabled={remaining === 0}>
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}