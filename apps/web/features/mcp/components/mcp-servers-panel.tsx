"use client";

import { useMemo, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { mcpServers } from "../constants/servers";
import type { McpServer, McpTransport } from "../types";
import {
  Search,
  Plus,
  Terminal,
  Globe,
  Radio,
  Wrench,
  Database,
  MessageSquareText,
  Unplug,
  Settings2,
  ShieldCheck,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { brandLogoMap } from "./brand-logos";

const pill = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1";

const transportMeta: Record<
  McpTransport,
  { label: string; icon: LucideIcon; cls: string }
> = {
  http: { label: "Streamable HTTP", icon: Globe, cls: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25" },
  stdio: { label: "stdio", icon: Terminal, cls: "bg-sky-500/15 text-sky-300 ring-sky-500/25" },
  sse: { label: "SSE (legacy)", icon: Radio, cls: "bg-amber-500/15 text-amber-300 ring-amber-500/25" },
};

const authMeta = {
  oauth: { label: "OAuth", icon: ShieldCheck, cls: "text-violet-300" },
  bearer: { label: "Bearer", icon: KeyRound, cls: "text-sky-300" },
  none: { label: "No auth", icon: ShieldCheck, cls: "text-muted-foreground" },
} as const;

const transportFilters = [
  { key: "all", label: "All" },
  { key: "http", label: "HTTP" },
  { key: "stdio", label: "stdio" },
  { key: "sse", label: "SSE" },
] as const;

/* Full-color official logos (gilbarbara/logos via jsDelivr), with the inline
   SVGs kept as a fallback so a card still renders if the CDN is blocked. */
const MCP_CDN = "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/";
// Only the marks whose inline versions didn't read as the real logo — the rest
// keep their (good) inline SVGs below.
const mcpLogoSlug: Record<string, string> = {
  postgres: "postgresql",
  sentry: "sentry-icon",
};

const whiteTile =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] ring-1 ring-black/5";

function McpLogo({
  id,
  name,
  fallbackIcon: Fallback,
}: {
  id: string;
  name: string;
  fallbackIcon: LucideIcon;
}) {
  const slug = mcpLogoSlug[id];
  const Inline = brandLogoMap[id];
  const [errored, setErrored] = useState(false);

  // Real full-color logo from the CDN.
  if (slug && !errored) {
    return (
      <div className={whiteTile}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${MCP_CDN}${slug}.svg`}
          alt={`${name} logo`}
          width={24}
          height={24}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  // Inline SVG fallback (covers custom Filesystem / Memory icons too).
  if (Inline) {
    return (
      <div className={whiteTile}>
        <Inline />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.06] ring-1 ring-foreground/10">
      <Fallback className="h-5 w-5 text-primary" />
    </div>
  );
}

let customCounter = 0;

export function McpServersPanel() {
  const [servers, setServers] = useState<McpServer[]>(mcpServers);
  const [search, setSearch] = useState("");
  const [transport, setTransport] = useState<string>("all");

  const filtered = useMemo(
    () =>
      servers.filter((s) => {
        if (transport !== "all" && s.transport !== transport) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.endpoint.toLowerCase().includes(q)
        );
      }),
    [servers, search, transport]
  );

  const connected = servers.filter((s) => s.status === "connected");
  const totalTools = connected.reduce((sum, s) => sum + s.tools, 0);
  const totalResources = connected.reduce((sum, s) => sum + s.resources, 0);
  const totalPrompts = connected.reduce((sum, s) => sum + s.prompts, 0);

  function toggle(id: string) {
    setServers((current) =>
      current.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "connected" ? "available" : "connected" }
          : s
      )
    );
  }

  function addServer() {
    customCounter += 1;
    const server: McpServer = {
      id: `custom-${Date.now()}`,
      name: `Custom server ${customCounter}`,
      description: "A custom MCP server added locally. Configure its endpoint and auth.",
      transport: "http",
      status: "available",
      auth: "bearer",
      endpoint: "https://your-mcp-server.example/mcp",
      tools: 0,
      resources: 0,
      prompts: 0,
    };
    setServers((current) => [server, ...current]);
  }

  const stats = [
    { label: "Servers connected", value: connected.length, icon: Globe },
    { label: "Tools", value: totalTools, icon: Wrench },
    { label: "Resources", value: totalResources, icon: Database },
    { label: "Prompts", value: totalPrompts, icon: MessageSquareText },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Capability totals */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="neon-panel flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <s.icon className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-2xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search MCP servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-full border-foreground/10 bg-foreground/[0.05] pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {transportFilters.map((f) => {
            const active = transport === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setTransport(f.key)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 transition-colors",
                  active
                    ? "bg-primary text-primary-foreground ring-primary/40"
                    : "bg-foreground/[0.05] text-muted-foreground ring-foreground/10 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addServer}
          className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white shadow-glow transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add MCP server
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="neon-panel flex h-56 flex-col items-center justify-center rounded-3xl text-center">
          <Search className="h-9 w-9 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No MCP servers found</p>
          <p className="text-xs text-muted-foreground">Try another search or transport.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const t = transportMeta[s.transport];
            const TransportIcon = t.icon;
            const auth = authMeta[s.auth];
            const isConnected = s.status === "connected";

            return (
              <div
                key={s.id}
                className="neon-panel group flex flex-col gap-4 rounded-3xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <McpLogo id={s.id} name={s.name} fallbackIcon={TransportIcon} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <span className={cn("mt-1 inline-flex items-center gap-1 text-[11px]", auth.cls)}>
                        <auth.icon className="h-3 w-3" />
                        {auth.label}
                      </span>
                    </div>
                  </div>
                  <span className={cn(pill, t.cls)}>
                    <TransportIcon className="h-3 w-3" />
                    {t.label}
                  </span>
                </div>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {s.description}
                </p>

                {/* Capability counts */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Tools", value: s.tools, icon: Wrench },
                    { label: "Resources", value: s.resources, icon: Database },
                    { label: "Prompts", value: s.prompts, icon: MessageSquareText },
                  ].map((cap) => (
                    <div
                      key={cap.label}
                      className="flex flex-col items-center rounded-xl bg-foreground/[0.05] py-2 ring-1 ring-foreground/10"
                    >
                      <cap.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="mt-1 text-sm font-bold">{cap.value}</span>
                      <span className="text-[10px] text-muted-foreground">{cap.label}</span>
                    </div>
                  ))}
                </div>

                {/* Endpoint */}
                <p className="truncate rounded-lg bg-black/20 px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground ring-1 ring-foreground/10">
                  {s.endpoint}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[11px]",
                      isConnected ? "text-emerald-300" : "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isConnected ? "bg-emerald-400" : "bg-zinc-500"
                      )}
                    />
                    {isConnected ? "Connected" : "Not connected"}
                  </span>

                  {isConnected ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.05] px-3 text-xs font-medium transition-colors hover:bg-foreground/10"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Configure
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(s.id)}
                        aria-label={`Disconnect ${s.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-foreground/10 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                      >
                        <Unplug className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggle(s.id)}
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
    </div>
  );
}
