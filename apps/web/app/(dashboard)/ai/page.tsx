"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  AlertCircle,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Code,
  Database,
  FileText,
  Filter,
  Github,
  Layers,
  Link2,
  Mail,
  MessageSquare,
  Plug,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  SquareKanban,
  User,
  Users,
  Video,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  aiConnectors,
  connectorCategories,
  connectorInsights,
  connectorPlaybooks,
  type AIConnector,
  type ConnectorCategory,
} from "@/features/ai";
import { cn } from "@/shared/lib/utils";
import { BrandLogo } from "@/shared/components/ui/brand-logo";

const suggestions = [
  { label: "Brief me across Slack, Jira, GitHub, and Calendar", icon: FileText },
  { label: "Find blockers and create follow-up actions", icon: Workflow },
  { label: "Draft meeting notes and assign owners", icon: Video },
  { label: "Generate release notes from merged PRs", icon: Github },
];

const initialConversation = [
  {
    role: "assistant" as const,
    content:
      "I can now reason across connected tools: Slack, Jira, GitHub, Google Calendar, Gmail, Meet, Docs, CRM, and more. Connectors are mocked in Phase 1, but the product surface is ready for OAuth and backend sync in Phase 2.",
  },
  {
    role: "user" as const,
    content: "What changed since yesterday across my workspace?",
  },
  {
    role: "assistant" as const,
    content:
      "Here is your cross-app brief:\n\n1. Slack: 6 mentions, 2 decisions, and 1 blocker from #product.\n2. Jira: Sprint risk is medium because ORI-142 is blocked.\n3. GitHub: 4 PRs merged, 1 review waiting on you.\n4. Calendar: 90 minutes of focus time is open at 2:30 PM.\n\nRecommended action: create a Jira follow-up from the Slack blocker and reserve focus time for the CI/CD task.",
  },
];

const connectorIconMap: Record<string, LucideIcon> = {
  slack: MessageSquare,
  jira: SquareKanban,
  github: Github,
  "google-calendar": CalendarDays,
  "google-meet": Video,
  gmail: Mail,
  notion: FileText,
  salesforce: Database,
  hubspot: Users,
  "google-drive": Layers,
  linear: Circle,
  "microsoft-teams": MessageSquare,
};

const categoryIconMap: Record<ConnectorCategory, LucideIcon> = {
  communication: MessageSquare,
  "project-management": SquareKanban,
  code: Github,
  calendar: CalendarDays,
  documents: FileText,
  crm: Database,
  storage: Layers,
};

const statusLabel = {
  connected: "Connected",
  available: "Available",
  needs_attention: "Needs attention",
};

const statusClass = {
  connected: "border-success/20 bg-success/10 text-success",
  available: "border-border bg-secondary text-secondary-foreground",
  needs_attention: "border-warning/20 bg-warning/10 text-warning",
};

export default function AIPage() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState(initialConversation);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ConnectorCategory | "all">("all");
  const [connectorStates, setConnectorStates] = useState(() =>
    Object.fromEntries(aiConnectors.map((connector) => [connector.id, connector.status]))
  );
  const [selectedConnectorId, setSelectedConnectorId] = useState("slack");

  const connectors = useMemo(
    () =>
      aiConnectors.map((connector) => ({
        ...connector,
        status: connectorStates[connector.id] ?? connector.status,
      })),
    [connectorStates]
  );

  const filteredConnectors = connectors.filter((connector) => {
    const matchesCategory = activeCategory === "all" || connector.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      connector.name.toLowerCase().includes(query) ||
      connector.description.toLowerCase().includes(query) ||
      connector.objects.some((object) => object.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const connectedCount = connectors.filter((connector) => connector.status === "connected").length;
  const attentionCount = connectors.filter((connector) => connector.status === "needs_attention").length;
  const selectedConnector = connectors.find((connector) => connector.id === selectedConnectorId) ?? connectors[0];

  function toggleConnector(connector: AIConnector) {
    setConnectorStates((current) => ({
      ...current,
      [connector.id]: current[connector.id] === "connected" ? "available" : "connected",
    }));
    setSelectedConnectorId(connector.id);
  }

  function applyPrompt(prompt: string) {
    setInput(prompt);
  }

  function sendMessage() {
    const prompt = input.trim();
    if (!prompt) return;

    setConversation((current) => [
      ...current,
      { role: "user" as const, content: prompt },
      {
        role: "assistant" as const,
        content:
          "Mock response: I checked the connected workspace graph and found relevant context across Slack, Jira, GitHub, Calendar, and CRM. In Phase 2 this will call the backend connector router with source provenance and action confirmations.",
      },
    ]);
    setInput("");
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 shadow-glow">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Nova</h2>
            <p className="text-sm text-muted-foreground">
              Your Orion intelligence — connected across tools, meetings, code, tasks, and CRM.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Plug className="h-3 w-3" />
            {connectedCount} connected
          </Badge>
          <Badge variant={attentionCount ? "warning" : "success"} className="gap-1.5">
            <AlertCircle className="h-3 w-3" />
            {attentionCount} needs attention
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3.5 w-3.5" />
            Sync workspace
          </Button>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-12">
        <div className="space-y-6 2xl:col-span-7">
          <Card className="connector-orbit overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
            <CardContent className="p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Orion connector graph
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Ask one question. Orion searches every connected system.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Phase 1 includes mocked connector state, permissions, sync health, and Nova workflows. Phase 2 can replace these cards with OAuth, webhooks, and backend sync jobs.
                  </p>
                </div>
                <div className="relative flex min-h-[280px] w-full flex-col gap-3 overflow-hidden rounded-[28px] border border-white/10 bg-background/50 p-4 shadow-inner shadow-white/5 lg:w-80">
                  <div className="relative flex-1">
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-primary/10 shadow-glow" />
                    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-background/85 ring-1 ring-white/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="float-soft absolute left-0 top-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.1] px-2.5 py-1.5 text-xs font-medium">
                      <MessageSquare className="h-3.5 w-3.5 text-primary" /> Slack
                    </div>
                    <div className="float-soft-delay absolute right-0 top-2 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.1] px-2.5 py-1.5 text-xs font-medium">
                      <Github className="h-3.5 w-3.5 text-primary" /> GitHub
                    </div>
                    <div className="float-soft absolute bottom-0 left-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.1] px-2.5 py-1.5 text-xs font-medium">
                      <SquareKanban className="h-3.5 w-3.5 text-primary" /> Jira
                    </div>
                    <div className="float-soft-delay absolute bottom-0 right-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.1] px-2.5 py-1.5 text-xs font-medium">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" /> Calendar
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-background/70 p-2.5 backdrop-blur-xl">
                    <div className="text-center">
                      <p className="text-lg font-bold">{connectedCount}</p>
                      <p className="text-[10px] text-muted-foreground">Live</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">38</p>
                      <p className="text-[10px] text-muted-foreground">Objects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">12</p>
                      <p className="text-[10px] text-muted-foreground">Flows</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex min-h-[540px] flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Chat with Nova</CardTitle>
                <CardDescription>Mocked responses use connected workspace context.</CardDescription>
              </div>
              <Button variant="outline" size="sm">New Chat</Button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
                {conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
                  >
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-[10px]",
                          msg.role === "assistant" && "bg-primary/10 text-primary"
                        )}
                      >
                        {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-muted/50 text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {msg.content.split("\n").map((line, j) => (
                        <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-3 grid gap-2 md:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      type="button"
                      onClick={() => applyPrompt(suggestion.label)}
                      className="flex items-center gap-2 rounded-xl border border-border/70 bg-glass px-3 py-2 text-left text-xs text-muted-foreground transition-all hover:border-primary/30 hover:bg-glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <suggestion.icon className="h-3.5 w-3.5 text-primary" />
                      {suggestion.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ask across Slack, Jira, GitHub, Calendar, Meet, CRM..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") sendMessage();
                    }}
                    className="flex-1"
                  />
                  <Button size="icon" disabled={!input.trim()} aria-label="Send prompt" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                  Phase 1 mock mode. No external data is sent or synced yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 2xl:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Connector catalog</CardTitle>
              <CardDescription>A dedicated liquid-glass section for Slack, Jira, GitHub, meetings, calendars, docs, CRM, and storage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search connectors..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="shrink-0">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {connectorCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      activeCategory === category.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-glass-hover hover:text-foreground"
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
                {filteredConnectors.map((connector) => {
                  const isSelected = selectedConnector.id === connector.id;
                  const isConnected = connector.status === "connected";

                  return (
                    <div
                      key={connector.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedConnectorId(connector.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedConnectorId(connector.id);
                        }
                      }}
                      className={cn(
                        "group cursor-pointer rounded-[24px] border bg-white/[0.035] p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.07] hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isSelected ? "border-primary/50 shadow-glow" : "border-border/70"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <BrandLogo
                          id={connector.id}
                          name={connector.name}
                          gradient={connector.gradient}
                          className="h-10 w-10 rounded-xl"
                          imgSize={20}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold">{connector.name}</p>
                            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", statusClass[connector.status])}>
                              {statusLabel[connector.status]}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {connector.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {connector.objects.slice(0, 3).map((object) => (
                              <Badge key={object} variant="secondary" className="text-[10px]">
                                {object}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {connector.lastSynced}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant={isConnected ? "outline" : "default"}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleConnector(connector);
                          }}
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Selected connector</CardTitle>
            <CardDescription>Permissions and sync behavior for Phase 2.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo
                id={selectedConnector.id}
                name={selectedConnector.name}
                gradient={selectedConnector.gradient}
                className="h-11 w-11 rounded-2xl"
              />
              <div>
                <p className="text-sm font-semibold">{selectedConnector.name}</p>
                <p className="text-xs text-muted-foreground">Sync: {selectedConnector.syncState}</p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedConnector.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2 rounded-xl border border-border/60 bg-glass p-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {permission}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Nova playbooks</CardTitle>
            <CardDescription>Multi-connector workflows ready for backend automation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectorPlaybooks.map((playbook) => (
              <div key={playbook.title} className="rounded-2xl border border-border/60 bg-glass p-3">
                <div className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{playbook.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{playbook.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {playbook.connectors.map((connector) => (
                    <Badge key={connector} variant="secondary" className="text-[10px]">
                      {connector}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Context routing</CardTitle>
            <CardDescription>How Orion decides where to look before answering.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectorInsights.map((insight) => (
              <div key={insight} className="flex gap-3 rounded-2xl border border-border/60 bg-glass p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-xs leading-relaxed text-muted-foreground">{insight}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Link2 className="h-4 w-4" />
              View integration architecture
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}