"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Plus,
  Search,
  Star,
  Archive,
  Trash2,
  Mail,
  MailOpen,
  Inbox,
  Send,
  FileText,
} from "lucide-react";
import { cn, getInitials, formatRelativeTime } from "@/shared/lib/utils";

const mockEmails = [
  {
    id: "1",
    from: { name: "Sarah Chen", email: "sarah@orion.dev" },
    subject: "Q4 Product Roadmap — Final Review",
    preview:
      "Hey Alex, I've attached the final version of the Q4 roadmap. Can you review the timeline for the AI features section?",
    read: false,
    starred: true,
    date: new Date(Date.now() - 1800000).toISOString(),
    labels: ["important"],
  },
  {
    id: "2",
    from: { name: "Mike Johnson", email: "mike@orion.dev" },
    subject: "Re: Design System Updates",
    preview:
      "Looks great! I have a few suggestions for the color tokens. Let's discuss in our next sync.",
    read: false,
    starred: false,
    date: new Date(Date.now() - 3600000).toISOString(),
    labels: ["design"],
  },
  {
    id: "3",
    from: { name: "GitHub", email: "noreply@github.com" },
    subject: "[orion-os] PR #142 merged successfully",
    preview:
      "Pull request #142 'feat: add command palette' has been merged into main by alex-kim.",
    read: true,
    starred: false,
    date: new Date(Date.now() - 7200000).toISOString(),
    labels: ["github"],
  },
  {
    id: "4",
    from: { name: "Lisa Park", email: "lisa@orion.dev" },
    subject: "Client Presentation — Thursday",
    preview:
      "Hi team, I've prepared the slide deck for Thursday's client presentation. Please review slides 8-12.",
    read: true,
    starred: true,
    date: new Date(Date.now() - 14400000).toISOString(),
    labels: ["meeting"],
  },
  {
    id: "5",
    from: { name: "Vercel", email: "notifications@vercel.com" },
    subject: "Deployment successful — orion-os",
    preview:
      "Your deployment to production was successful. Preview: https://orion-os.vercel.app",
    read: true,
    starred: false,
    date: new Date(Date.now() - 28800000).toISOString(),
    labels: ["deploy"],
  },
  {
    id: "6",
    from: { name: "David Lee", email: "david@orion.dev" },
    subject: "Backend API Spec Review",
    preview:
      "I've updated the API spec for the task endpoints. Please take a look when you get a chance.",
    read: true,
    starred: false,
    date: new Date(Date.now() - 43200000).toISOString(),
    labels: ["backend"],
  },
];

const folders = [
  { label: "Inbox", icon: Inbox, count: 2 },
  { label: "Sent", icon: Send, count: 0 },
  { label: "Drafts", icon: FileText, count: 1 },
  { label: "Archive", icon: Archive, count: 0 },
];

export default function EmailsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedEmail = mockEmails.find((e) => e.id === selectedId);

  const filteredEmails = mockEmails.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.from.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Emails</h2>
          <p className="text-sm text-muted-foreground">
            {mockEmails.filter((e) => !e.read).length} unread messages
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Compose
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="col-span-2 space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.label}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass-hover hover:text-foreground"
            >
              <folder.icon className="h-4 w-4" />
              <span>{folder.label}</span>
              {folder.count > 0 && (
                <span className="ml-auto text-[10px] font-semibold text-primary">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Email list */}
        <div className="col-span-4">
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {filteredEmails.map((email) => (
                <button
                  key={email.id}
                  onClick={() => setSelectedId(email.id)}
                  className={cn(
                    "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-glass-hover",
                    selectedId === email.id && "bg-primary/5",
                    !email.read && "bg-primary/5"
                  )}
                >
                  <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(email.from.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          "truncate text-sm",
                          !email.read ? "font-semibold" : "font-medium"
                        )}
                      >
                        {email.from.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatRelativeTime(email.date)}
                      </span>
                    </div>
                    <p className="truncate text-xs font-medium">
                      {email.subject}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {email.preview}
                    </p>
                  </div>
                  {email.starred && (
                    <Star className="mt-1 h-3 w-3 shrink-0 fill-warning text-warning" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Email detail */}
        <div className="col-span-6">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[9px]">
                            {getInitials(selectedEmail.from.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {selectedEmail.from.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedEmail.from.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {selectedEmail.preview}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      This is mock email content. In Phase 2, this will be
                      populated with real data from the backend API.
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <MailOpen className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Select an email to read
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
