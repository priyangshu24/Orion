"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

const mockEvents = [
  {
    id: "1",
    title: "Team Standup",
    time: "9:00 AM",
    duration: "30 min",
    color: "#6366f1",
    day: 1,
    attendees: 4,
  },
  {
    id: "2",
    title: "Design Review",
    time: "11:00 AM",
    duration: "1 hr",
    color: "#8b5cf6",
    day: 1,
    attendees: 3,
  },
  {
    id: "3",
    title: "Sprint Planning",
    time: "2:00 PM",
    duration: "1.5 hr",
    color: "#22c55e",
    day: 2,
    attendees: 8,
  },
  {
    id: "4",
    title: "1:1 with Sarah",
    time: "10:00 AM",
    duration: "30 min",
    color: "#f59e0b",
    day: 3,
    attendees: 2,
  },
  {
    id: "5",
    title: "Product Demo",
    time: "3:00 PM",
    duration: "1 hr",
    color: "#ef4444",
    day: 4,
    attendees: 12,
  },
  {
    id: "6",
    title: "Retrospective",
    time: "4:00 PM",
    duration: "1 hr",
    color: "#3b82f6",
    day: 5,
    attendees: 6,
  },
];

export default function CalendarPage() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Calendar</h2>
          <p className="text-sm text-muted-foreground">
            {format(weekStart, "MMMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border">
            <Button variant="ghost" size="icon-sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">This Week</span>
            <Button variant="ghost" size="icon-sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Week view */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, today);
          const dayEvents = mockEvents.filter((e) => e.day === i);
          return (
            <div key={i} className="space-y-2">
              <div className="text-center">
                <p className="text-[10px] font-medium uppercase text-muted-foreground">
                  {format(day, "EEE")}
                </p>
                <p
                  className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {format(day, "d")}
                </p>
              </div>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="cursor-pointer border-none p-0 transition-all hover:shadow-card-hover"
                  >
                    <CardContent className="p-2.5">
                      <div
                        className="mb-1.5 h-1 w-8 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                      <p className="text-xs font-medium leading-tight">
                        {event.title}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {event.time} · {event.duration}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {event.attendees}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {dayEvents.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-[10px] text-muted-foreground">
                      No events
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockEvents.slice(0, 4).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-glass-hover cursor-pointer"
            >
              <div
                className="h-8 w-1 rounded-full shrink-0"
                style={{ backgroundColor: event.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {event.time} · {event.duration}
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                <Users className="mr-1 h-3 w-3" />
                {event.attendees}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
