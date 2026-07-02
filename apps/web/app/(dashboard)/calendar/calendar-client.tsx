"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Plus, ChevronLeft, ChevronRight, Users, CalendarDays, RotateCcw } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type LocalEvent = {
  id: string;
  title: string;
  time: string;
  duration: string;
  color: string;
  day: number;
  attendees: number;
};

const initialEvents: LocalEvent[] = [
  { id: "1", title: "Team Standup", time: "9:00 AM", duration: "30 min", color: "#6366f1", day: 1, attendees: 4 },
  { id: "2", title: "Design Review", time: "11:00 AM", duration: "1 hr", color: "#8b5cf6", day: 1, attendees: 3 },
  { id: "3", title: "Sprint Planning", time: "2:00 PM", duration: "1.5 hr", color: "#22c55e", day: 2, attendees: 8 },
  { id: "4", title: "1:1 with Sarah", time: "10:00 AM", duration: "30 min", color: "#f59e0b", day: 3, attendees: 2 },
  { id: "5", title: "Product Demo", time: "3:00 PM", duration: "1 hr", color: "#ef4444", day: 4, attendees: 12 },
  { id: "6", title: "Retrospective", time: "4:00 PM", duration: "1 hr", color: "#3b82f6", day: 5, attendees: 6 },
];

const baseWeek = [
  { label: "Mon", day: 22 },
  { label: "Tue", day: 23 },
  { label: "Wed", day: 24 },
  { label: "Thu", day: 25 },
  { label: "Fri", day: 26 },
  { label: "Sat", day: 27 },
  { label: "Sun", day: 28 },
];

const colors = ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export function CalendarClient() {
  const [events, setEvents] = useState(initialEvents);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(initialEvents[0]?.id ?? null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDay, setDraftDay] = useState(4);

  const weekDays = useMemo(
    () => baseWeek.map((day) => ({ ...day, day: day.day + weekOffset * 7 })),
    [weekOffset]
  );

  const selectedEvent = events.find((event) => event.id === selectedId) ?? events[0];

  function createEvent() {
    const event: LocalEvent = {
      id: `local-${Date.now()}`,
      title: draftTitle.trim() || "New Orion meeting",
      time: "2:30 PM",
      duration: "45 min",
      color: colors[events.length % colors.length],
      day: draftDay,
      attendees: 3,
    };
    setEvents((current) => [event, ...current]);
    setDraftTitle("");
    setSelectedId(event.id);
  }

  function resetCalendar() {
    setEvents(initialEvents);
    setWeekOffset(0);
    setDraftTitle("");
    setDraftDay(4);
    setSelectedId(initialEvents[0]?.id ?? null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Calendar</h2>
          <p className="text-sm text-muted-foreground">June 2026 - interactive mock scheduling</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekOffset((value) => value - 1)}
              className="rounded-l-lg p-2 text-muted-foreground hover:bg-glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium">Week {weekOffset + 1}</span>
            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekOffset((value) => value + 1)}
              className="rounded-r-lg p-2 text-muted-foreground hover:bg-glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={resetCalendar}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Input
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") createEvent();
            }}
            placeholder="Meeting title..."
          />
          <select
            value={draftDay}
            onChange={(event) => setDraftDay(Number(event.target.value))}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {baseWeek.map((day, index) => (
              <option key={day.label} value={index}>{day.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={createEvent}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="h-4 w-4" />
            New Event
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
        {weekDays.map((day, i) => {
          const dayEvents = events.filter((event) => event.day === i);
          return (
            <div key={day.label} className="space-y-2">
              <div className="text-center">
                <p className="text-[10px] font-medium uppercase text-muted-foreground">{day.label}</p>
                <p className={cn("mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold", i === 4 ? "bg-primary text-primary-foreground" : "text-foreground")}>
                  {day.day}
                </p>
              </div>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedId(event.id)}
                    className={cn(
                      "w-full rounded-xl border border-border bg-card p-2.5 text-left transition-all hover:border-primary/30 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedEvent?.id === event.id && "border-primary/50 shadow-glow"
                    )}
                  >
                    <div className="mb-1.5 h-1 w-8 rounded-full" style={{ backgroundColor: event.color }} />
                    <p className="text-xs font-medium leading-tight">{event.title}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{event.time} - {event.duration}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {event.attendees}
                    </div>
                  </button>
                ))}
                {dayEvents.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">No events</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedId(event.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time} - {event.duration}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                  <Users className="h-3 w-3" />
                  {event.attendees}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardContent className="p-5">
            {selectedEvent ? (
              <div className="space-y-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{selectedEvent.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedEvent.time} - {selectedEvent.duration}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedEvent.attendees} attendees. In Phase 2 this can create Google Calendar or Google Meet events through the connector layer.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select an event.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
