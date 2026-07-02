"use client";

import { useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { aiConnectors, connectorCategories } from "@/features/ai";
import type { AIConnector, ConnectorStatus } from "@/features/ai";
import {
  Search,
  Plus,
  RefreshCw,
  Settings2,
  Unplug,
  Zap,
  CircleAlert,
  Radio,
  LayoutGrid,
  Server,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { McpServersPanel } from "@/features/mcp/components/mcp-servers-panel";

/* Full-color official brand logos (gilbarbara/logos via jsDelivr). */
const CDN = "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/";

const logoSlug: Record<string, string> = {
  jira: "jira",
  github: "github-icon",
  "google-calendar": "google-calendar",
  "google-meet": "google-meet",
  gmail: "google-gmail",
  notion: "notion-icon",
  hubspot: "hubspot",
  "google-drive": "google-drive",
  linear: "linear-icon",
  salesforce: "salesforce",
  "microsoft-teams": "microsoft-teams",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const tile =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-[0_6px_18px_rgba(0,0,0,0.18)]";

/* Slack dropped its mark from icon CDNs — inline the official 4-color logo */
function SlackLogo() {
  return (
    <svg viewBox="0 0 122.8 122.8" width="24" height="24" aria-hidden="true">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  );
}

function ConnectorLogo({ id, name, gradient }: { id: string; name: string; gradient: string }) {
  const slug = logoSlug[id];
  const [errored, setErrored] = useState(false);

  if (id === "slack") {
    return (
      <div className={cn(tile, "bg-white ring-1 ring-black/5")}>
        <SlackLogo />
      </div>
    );
  }

  if (slug && !errored) {
    return (
      <div className={cn(tile, "bg-white ring-1 ring-black/5")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${CDN}${slug}.svg`}
          alt={`${name} logo`}
          width={26}
          height={26}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn(tile, "bg-gradient-to-br text-sm font-bold text-white ring-1 ring-white/15", gradient)}>
      {initials(name)}
    </div>
  );
}

const statusMeta: Record<
  ConnectorStatus,
  { label: string; dot: string; cls: string }
> = {
  connected: {
    label: "Connected",
    dot: "bg-emerald-400",
    cls: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25",
  },
  available: {
    label: "Available",
    dot: "bg-zinc-400",
    cls: "bg-white/5 text-muted-foreground ring-white/15",
  },
  needs_attention: {
    label: "Needs attention",
    dot: "bg-amber-400",
    cls: "bg-amber-500/10 text-amber-300 ring-amber-500/25",
  },
};

const syncMeta = {
  live: { label: "Live sync", icon: Radio, cls: "text-emerald-300" },
  scheduled: { label: "Scheduled", icon: RefreshCw, cls: "text-sky-300" },
  paused: { label: "Paused", icon: Zap, cls: "text-muted-foreground" },
} as const;

const pill = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1";

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<AIConnector[]>(aiConnectors);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"apps" | "mcp">("apps");

  const filtered = useMemo(
    () =>
      connectors.filter((c) => {
        if (category !== "all" && c.category !== category) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.objects.some((o) => o.toLowerCase().includes(q))
        );
      }),
    [connectors, category, search]
  );

  const counts = {
    connected: connectors.filter((c) => c.status === "connected").length,
    available: connectors.filter((c) => c.status === "available").length,
    needs_attention: connectors.filter((c) => c.status === "needs_attention").length,
  };

  function setStatus(id: string, status: ConnectorStatus) {
    setConnectors((current) =>
      current.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              syncState: status === "connected" ? "live" : "paused",
              lastSynced: status === "connected" ? "Just now" : "Not connected",
            }
          : c
      )
    );
  }

  const stats = [
    { label: "Connected", value: counts.connected, dot: "bg-emerald-400" },
    { label: "Available", value: counts.available, dot: "bg-zinc-400" },
    { label: "Needs attention", value: counts.needs_attention, dot: "bg-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Connectors</h2>
        <p className="text-sm text-muted-foreground">
          Connect your apps and MCP servers so Nova can read, summarize, and act across your whole workspace.
        </p>
      </div>

      {/* View toggle: Apps vs MCP servers */}
      <div className="flex w-full gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] p-1 sm:w-auto sm:self-start">
        {([
          { key: "apps", label: "Apps", icon: LayoutGrid },
          { key: "mcp", label: "MCP Servers", icon: Server },
        ] as const).map((tab) => {
          const active = view === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none",
                active ? "neon-active text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "mcp" ? (
        <McpServersPanel />
      ) : (
        <>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="neon-panel flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", s.dot)} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-2xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search connectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-full border-foreground/10 bg-foreground/[0.05] pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {connectorCategories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 transition-colors",
                  active
                    ? "bg-primary text-primary-foreground ring-primary/40"
                    : "bg-foreground/[0.05] text-muted-foreground ring-foreground/10 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="neon-panel flex h-56 flex-col items-center justify-center rounded-3xl text-center">
          <Search className="h-9 w-9 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No connectors found</p>
          <p className="text-xs text-muted-foreground">Try another search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const status = statusMeta[c.status];
            const sync = syncMeta[c.syncState];
            const SyncIcon = sync.icon;
            return (
              <div
                key={c.id}
                className="neon-panel group flex flex-col gap-4 rounded-3xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <ConnectorLogo id={c.id} name={c.name} gradient={c.gradient} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">
                        {c.category.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <span className={cn(pill, status.cls)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {c.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {c.objects.slice(0, 4).map((obj) => (
                    <span
                      key={obj}
                      className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-foreground/10"
                    >
                      {obj}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className={cn("flex items-center gap-1.5 text-[11px]", sync.cls)}>
                    <SyncIcon className="h-3.5 w-3.5" />
                    {c.lastSynced}
                  </span>

                  {c.status === "connected" ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.05] px-3 text-xs font-medium transition-colors hover:bg-foreground/10"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(c.id, "available")}
                        aria-label={`Disconnect ${c.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      >
                        <Unplug className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : c.status === "needs_attention" ? (
                    <button
                      type="button"
                      onClick={() => setStatus(c.id, "connected")}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-amber-500/90 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-amber-500"
                    >
                      <CircleAlert className="h-3.5 w-3.5" />
                      Reconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStatus(c.id, "connected")}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 text-xs font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
