"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { mockEvents } from "../constants/mock-data";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

export function WidgetCalendar() {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Upcoming Meetings</CardTitle>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-3">
        {mockEvents.slice(0, 3).map((event) => (
          <div
            key={event.id}
            className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-glass-hover cursor-pointer"
          >
            <div
              className="mt-0.5 h-8 w-1 rounded-full shrink-0"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.start), "h:mm a")} –{" "}
                {format(new Date(event.end), "h:mm a")}
              </p>
              {event.attendees && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{event.attendees.length} attendees</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
