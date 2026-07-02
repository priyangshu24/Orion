"use client";

import { useMemo, useState } from "react";
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
  Reply,
  RotateCcw,
} from "lucide-react";
import { cn, getInitials, formatRelativeTime } from "@/shared/lib/utils";

type Folder = "Inbox" | "Sent" | "Drafts" | "Archive" | "Trash";

type LocalEmail = {
  id: string;
  from: { name: string; email: string };
  subject: string;
  preview: string;
  read: boolean;
  starred: boolean;
  date: string;
  labels: string[];
  folder: Folder;
};

const initialEmails: LocalEmail[] = [
  {
    id: "1",
    from: { name: "Sarah Chen", email: "sarah@orion.dev" },
    subject: "Q4 Product Roadmap - Final Review",
    preview: "Hey Alex, I've attached the final version of the Q4 roadmap. Can you review the timeline for the AI features section?",
    read: false,
    starred: true,
    date: "2026-06-26T08:30:00.000Z",
    labels: ["important"],
    folder: "Inbox",
  },
  {
    id: "2",
    from: { name: "Mike Johnson", email: "mike@orion.dev" },
    subject: "Re: Design System Updates",
    preview: "Looks great! I have a few suggestions for the color tokens. Let's discuss in our next sync.",
    read: false,
    starred: false,
    date: "2026-06-26T08:00:00.000Z",
    labels: ["design"],
    folder: "Inbox",
  },
  {
    id: "3",
    from: { name: "GitHub", email: "noreply@github.com" },
    subject: "[orion-os] PR #142 merged successfully",
    preview: "Pull request #142 'feat: add command palette' has been merged into main by alex-kim.",
    read: true,
    starred: false,
    date: "2026-06-26T07:00:00.000Z",
    labels: ["github"],
    folder: "Inbox",
  },
  {
    id: "4",
    from: { name: "Lisa Park", email: "lisa@orion.dev" },
    subject: "Client Presentation - Thursday",
    preview: "Hi team, I've prepared the slide deck for Thursday's client presentation. Please review slides 8-12.",
    read: true,
    starred: true,
    date: "2026-06-26T05:00:00.000Z",
    labels: ["meeting"],
    folder: "Archive",
  },
  {
    id: "5",
    from: { name: "Vercel", email: "notifications@vercel.com" },
    subject: "Deployment successful - orion-os",
    preview: "Your deployment to production was successful. Preview: https://orion-os.vercel.app",
    read: true,
    starred: false,
    date: "2026-06-26T01:00:00.000Z",
    labels: ["deploy"],
    folder: "Inbox",
  },
  {
    id: "6",
    from: { name: "Alex Kim", email: "alex@orion.dev" },
    subject: "Draft: Backend API Spec Review",
    preview: "I've updated the API spec for the task endpoints. Please take a look when you get a chance.",
    read: true,
    starred: false,
    date: "2026-06-25T21:00:00.000Z",
    labels: ["backend"],
    folder: "Drafts",
  },
];

const folderIcons = {
  Inbox,
  Sent: Send,
  Drafts: FileText,
  Archive,
  Trash: Trash2,
};

const folders: Folder[] = ["Inbox", "Sent", "Drafts", "Archive", "Trash"];

export default function EmailsPage() {
  const [emails, setEmails] = useState<LocalEmail[]>(initialEmails);
  const [selectedId, setSelectedId] = useState<string | null>(initialEmails[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState<Folder>("Inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const filteredEmails = useMemo(
    () =>
      emails.filter((email) => {
        if (email.folder !== activeFolder) return false;
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return (
          email.subject.toLowerCase().includes(query) ||
          email.from.name.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query) ||
          email.labels.some((label) => label.toLowerCase().includes(query))
        );
      }),
    [activeFolder, emails, searchQuery]
  );

  const selectedEmail = emails.find((email) => email.id === selectedId) ?? filteredEmails[0];
  const unreadCount = emails.filter((email) => email.folder === "Inbox" && !email.read).length;

  function selectEmail(email: LocalEmail) {
    setSelectedId(email.id);
    setEmails((current) =>
      current.map((item) => (item.id === email.id ? { ...item, read: true } : item))
    );
  }

  function toggleStar(emailId: string) {
    setEmails((current) =>
      current.map((email) =>
        email.id === emailId ? { ...email, starred: !email.starred } : email
      )
    );
  }

  function moveEmail(emailId: string, folder: Folder) {
    setEmails((current) =>
      current.map((email) => (email.id === emailId ? { ...email, folder } : email))
    );
    setSelectedId(null);
  }

  function sendDraft() {
    const subject = composeSubject.trim() || "Untitled Orion message";
    const body = composeBody.trim() || "Drafted locally in Phase 1 mock mode.";
    const email: LocalEmail = {
      id: `local-${Date.now()}`,
      from: { name: "Alex Kim", email: "alex@orion.dev" },
      subject,
      preview: body,
      read: true,
      starred: false,
      date: "2026-06-26T09:00:00.000Z",
      labels: ["sent"],
      folder: "Sent",
    };
    setEmails((current) => [email, ...current]);
    setComposeOpen(false);
    setComposeSubject("");
    setComposeBody("");
    setActiveFolder("Sent");
    setSelectedId(email.id);
  }

  function startReply() {
    if (!selectedEmail) return;
    setComposeOpen(true);
    setComposeSubject(`Re: ${selectedEmail.subject.replace(/^Re: /, "")}`);
    setComposeBody(`Thanks ${selectedEmail.from.name.split(" ")[0]},\n\n`);
  }

  function resetEmails() {
    setEmails(initialEmails);
    setSelectedId(initialEmails[0]?.id ?? null);
    setSearchQuery("");
    setActiveFolder("Inbox");
    setComposeOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Emails</h2>
          <p className="text-sm text-muted-foreground">{unreadCount} unread messages</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setComposeOpen(true)}>
            <Plus className="h-4 w-4" />
            Compose
          </Button>
          <Button variant="outline" onClick={resetEmails}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {composeOpen && (
        <Card className="border-primary/30 shadow-glow">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Compose message</p>
              <Button variant="ghost" size="sm" onClick={() => setComposeOpen(false)}>Close</Button>
            </div>
            <Input placeholder="Subject" value={composeSubject} onChange={(event) => setComposeSubject(event.target.value)} />
            <Input placeholder="Message body" value={composeBody} onChange={(event) => setComposeBody(event.target.value)} />
            <Button onClick={sendDraft}>
              <Send className="h-4 w-4" />
              Send mock email
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-1 xl:col-span-2">
          {folders.map((folder) => {
            const Icon = folderIcons[folder];
            const count = emails.filter((email) => email.folder === folder).length;
            return (
              <button
                key={folder}
                type="button"
                onClick={() => {
                  setActiveFolder(folder);
                  setSelectedId(null);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeFolder === folder
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-glass-hover hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{folder}</span>
                {count > 0 && <span className="ml-auto text-[10px] font-semibold">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="xl:col-span-4">
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {filteredEmails.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <MailOpen className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No emails in {activeFolder}</p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => selectEmail(email)}
                    className={cn(
                      "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedEmail?.id === email.id && "bg-primary/5",
                      !email.read && "bg-primary/5"
                    )}
                  >
                    <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px]">{getInitials(email.from.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("truncate text-sm", !email.read ? "font-semibold" : "font-medium")}>{email.from.name}</p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{formatRelativeTime(email.date)}</span>
                      </div>
                      <p className="truncate text-xs font-medium">{email.subject}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{email.preview}</p>
                    </div>
                    {email.starred && <Star className="mt-1 h-3 w-3 shrink-0 fill-warning text-warning" />}
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-6">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[9px]">{getInitials(selectedEmail.from.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{selectedEmail.from.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedEmail.from.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Star email" onClick={() => toggleStar(selectedEmail.id)}>
                        <Star className={cn("h-4 w-4", selectedEmail.starred && "fill-warning text-warning")} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Archive email" onClick={() => moveEmail(selectedEmail.id, "Archive")}>
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Delete email" onClick={() => moveEmail(selectedEmail.id, "Trash")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.labels.map((label) => <Badge key={label} variant="secondary">{label}</Badge>)}
                    <Badge>{selectedEmail.folder}</Badge>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedEmail.preview}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      This is mock email content. Actions update local state only until Phase 2 backend integration.
                    </p>
                  </div>
                  <div className="flex gap-2 border-t border-border pt-4">
                    <Button variant="outline" size="sm" onClick={startReply}>
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => moveEmail(selectedEmail.id, "Sent")}>
                      <Send className="h-4 w-4" />
                      Mark sent
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <Mail className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">Select an email to read</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}