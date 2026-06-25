"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { mockEmails } from "../constants/mock-data";
import { ArrowUpRight, Star } from "lucide-react";
import { formatRelativeTime, getInitials } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

export function WidgetEmails() {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Recent Emails</CardTitle>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardHeader>
      <CardContent className="space-y-1">
        {mockEmails.map((email) => (
          <div
            key={email.id}
            className={cn(
              "flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-glass-hover cursor-pointer",
              !email.read && "bg-primary/5"
            )}
          >
            <Avatar className="mt-0.5 h-7 w-7">
              <AvatarFallback className="text-[10px]">
                {getInitials(email.from.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium">
                  {email.from.name}
                </p>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatRelativeTime(email.date)}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {email.subject}
              </p>
            </div>
            {email.starred && (
              <Star className="mt-1 h-3 w-3 shrink-0 fill-warning text-warning" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
