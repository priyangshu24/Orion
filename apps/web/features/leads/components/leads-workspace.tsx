"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Columns3,
  EllipsisVertical,
  Filter,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { CompanyBrand } from "@/shared/components/company-brand";
import { cn, formatDate, getInitials } from "@/shared/lib/utils";
import { mockLeads } from "../constants/mock-leads";
import type {
  Lead,
  LeadColumn,
  LeadDraft,
  LeadSortKey,
  LeadSource,
  LeadStatus,
} from "../types";

const PAGE_SIZE = 8;

const statusMeta: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "border-primary/25 bg-primary/10 text-primary" },
  contacted: { label: "Contacted", className: "border-info/25 bg-info/10 text-info" },
  qualified: { label: "Qualified", className: "border-warning/25 bg-warning/10 text-warning" },
  converted: { label: "Converted", className: "border-[#9b7cff]/25 bg-[#9b7cff]/10 text-[#b9a7ff]" },
  lost: { label: "Lost", className: "border-destructive/25 bg-destructive/10 text-destructive" },
};

const statusTabs: Array<{ id: LeadStatus | "all"; label: string }> = [
  { id: "all", label: "All Leads" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "qualified", label: "Qualified" },
  { id: "converted", label: "Converted" },
  { id: "lost", label: "Lost" },
];

const sources: LeadSource[] = ["Website", "LinkedIn", "Referral", "Cold Call", "Event"];

const columnLabels: Record<LeadColumn, string> = {
  company: "Company",
  status: "Status",
  score: "Lead Score",
  source: "Source",
  owner: "Owner",
  createdAt: "Created At",
};

const stats: Array<{
  id: LeadStatus | "all";
  label: string;
  value: string;
  delta: string;
  icon: typeof CircleUserRound;
  tone: string;
  spark: number[];
}> = [
  { id: "all", label: "Total Leads", value: "1,293", delta: "8.2%", icon: CircleUserRound, tone: "text-primary border-primary/25 bg-primary/10", spark: [3, 5, 4, 8, 6, 11, 8, 13] },
  { id: "new", label: "New Leads", value: "210", delta: "12.4%", icon: UserPlus, tone: "text-success border-success/25 bg-success/10", spark: [2, 3, 2, 5, 7, 5, 9, 12] },
  { id: "contacted", label: "Contacted", value: "620", delta: "5.6%", icon: Phone, tone: "text-info border-info/25 bg-info/10", spark: [4, 6, 3, 8, 5, 10, 6, 11] },
  { id: "qualified", label: "Qualified", value: "162", delta: "7.3%", icon: SlidersHorizontal, tone: "text-warning border-warning/25 bg-warning/10", spark: [2, 4, 3, 7, 5, 10, 7, 12] },
  { id: "converted", label: "Converted", value: "89", delta: "3.4%", icon: CheckCircle2, tone: "text-[#b9a7ff] border-[#9b7cff]/25 bg-[#9b7cff]/10", spark: [2, 3, 2, 5, 4, 8, 5, 10] },
];

const defaultColumns: Record<LeadColumn, boolean> = {
  company: true,
  status: true,
  score: true,
  source: true,
  owner: true,
  createdAt: true,
};

function scoreMeta(score: number) {
  if (score >= 75) return { label: "High", className: "bg-success/10 text-success" };
  if (score >= 45) return { label: "Medium", className: "bg-warning/10 text-warning" };
  return { label: "Low", className: "bg-destructive/10 text-destructive" };
}

function MiniSparkline({ values, className }: { values: number[]; className: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 76;
      const y = 28 - ((value - min) / Math.max(max - min, 1)) * 24;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 76 32" className={cn("h-8 w-[76px]", className)} aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortButton({
  label,
  column,
  sort,
  onSort,
}: {
  label: string;
  column: LeadSortKey;
  sort: { key: LeadSortKey; direction: "asc" | "desc" };
  onSort: (column: LeadSortKey) => void;
}) {
  const Icon = sort.key === column ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : null;
  return (
    <button type="button" onClick={() => onSort(column)} className="flex items-center gap-1 text-left transition hover:text-foreground">
      {label}
      {Icon ? <Icon className="h-3 w-3 text-primary" /> : null}
    </button>
  );
}

function LeadDialog({ lead, onClose, onSave }: { lead: Lead | null; onClose: () => void; onSave: (draft: LeadDraft) => void }) {
  const [draft, setDraft] = useState<LeadDraft>(() => ({
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    company: lead?.company ?? "",
    status: lead?.status ?? "new",
    score: lead?.score ?? 50,
    source: lead?.source ?? "Website",
  }));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.company.trim()) {
      toast.error("Name and company are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim(), company: draft.company.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="lead-dialog-title">
      <button type="button" aria-label="Close lead dialog" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="neon-panel relative z-10 w-full max-w-xl rounded-2xl p-5 shadow-floating">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="lead-dialog-title" className="text-base font-semibold text-foreground">{lead ? "Edit lead" : "Add new lead"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Keep contact and qualification details accurate for your sales team.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-[11px] font-medium text-muted-foreground">Full name
            <input autoFocus value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" placeholder="Jane Smith" />
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">Work email
            <input type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" placeholder="jane@company.com" />
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">Company
            <input value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" placeholder="Apple" />
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">Source
            <select value={draft.source} onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value as LeadSource }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50">
              {sources.map((source) => <option key={source} value={source}>{source}</option>)}
            </select>
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">Status
            <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as LeadStatus }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50">
              {Object.entries(statusMeta).map(([id, meta]) => <option key={id} value={id}>{meta.label}</option>)}
            </select>
          </label>
          <label className="text-[11px] font-medium text-muted-foreground">Lead score: {draft.score}
            <input type="range" min="0" max="100" value={draft.score} onChange={(event) => setDraft((current) => ({ ...current, score: Number(event.target.value) }))} className="mt-3 w-full accent-primary" />
          </label>
        </div>

        <footer className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground transition hover:bg-foreground/[0.05] hover:text-foreground">Cancel</button>
          <button type="submit" className="orion-add-widget rounded-lg px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110">{lead ? "Save changes" : "Create lead"}</button>
        </footer>
      </form>
    </div>
  );
}

function LeadDetails({ lead, onClose, onEdit }: { lead: Lead; onClose: () => void; onEdit: () => void }) {
  const score = scoreMeta(lead.score);
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close lead details" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="neon-panel absolute bottom-3 right-3 top-3 flex w-[400px] max-w-[calc(100vw-24px)] flex-col rounded-2xl p-5 shadow-floating" aria-label={`${lead.name} details`}>
        <header className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Lead profile</span>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"><X className="h-4 w-4" /></button>
        </header>
        <div className="mt-6 flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-1 ring-primary/30"><AvatarFallback>{getInitials(lead.name)}</AvatarFallback></Avatar>
          <div className="min-w-0"><h2 className="truncate text-lg font-semibold text-foreground">{lead.name}</h2><p className="truncate text-xs text-muted-foreground">{lead.email}</p></div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          {[
            ["Company", lead.company], ["Status", statusMeta[lead.status].label], ["Lead score", `${lead.score} · ${score.label}`],
            ["Source", lead.source], ["Owner", lead.owner], ["Created", formatDate(lead.createdAt)],
          ].map(([label, value]) => <div key={label} className="orion-glass-control rounded-xl p-3"><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-medium text-foreground">{value}</dd></div>)}
        </dl>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <button type="button" onClick={() => toast.success(`Email draft opened for ${lead.name}`)} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground transition hover:bg-foreground/[0.06]">Send email</button>
          <button type="button" onClick={onEdit} className="orion-add-widget rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground">Edit lead</button>
        </div>
      </aside>
    </div>
  );
}

export function LeadsWorkspace() {
  const [leads, setLeads] = useState(mockLeads);
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [minimumScore, setMinimumScore] = useState(0);
  const [columns, setColumns] = useState(defaultColumns);
  const [sort, setSort] = useState<{ key: LeadSortKey; direction: "asc" | "desc" }>({ key: "createdAt", direction: "desc" });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [filterOpen, setFilterOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null | undefined>(undefined);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return leads
      .filter((lead) => activeStatus === "all" || lead.status === activeStatus)
      .filter((lead) => source === "all" || lead.source === source)
      .filter((lead) => lead.score >= minimumScore)
      .filter((lead) => !normalizedQuery || [lead.name, lead.email, lead.company, lead.owner].some((value) => value.toLowerCase().includes(normalizedQuery)))
      .toSorted((a, b) => {
        const left = sort.key === "name" ? a.name : a[sort.key];
        const right = sort.key === "name" ? b.name : b[sort.key];
        const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
        return sort.direction === "asc" ? result : -result;
      });
  }, [activeStatus, leads, minimumScore, query, sort, source]);

  const pageCount = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageLeads = filteredLeads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allPageSelected = pageLeads.length > 0 && pageLeads.every((lead) => selectedIds.has(lead.id));
  const activeFilterCount = Number(source !== "all") + Number(minimumScore > 0);

  function changeStatus(status: LeadStatus | "all") {
    setActiveStatus(status);
    setPage(1);
    setSelectedIds(new Set());
  }

  function toggleSort(key: LeadSortKey) {
    setSort((current) => current.key === key ? { key, direction: current.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" });
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function togglePageSelection() {
    setSelectedIds((current) => {
      const next = new Set(current);
      pageLeads.forEach((lead) => allPageSelected ? next.delete(lead.id) : next.add(lead.id));
      return next;
    });
  }

  function saveLead(draft: LeadDraft) {
    if (editingLead) {
      setLeads((current) => current.map((lead) => lead.id === editingLead.id ? { ...lead, ...draft } : lead));
      toast.success("Lead updated");
    } else {
      setLeads((current) => [{ ...draft, id: `lead-${Date.now()}`, owner: "Alex Morgan", createdAt: new Date().toISOString().slice(0, 10) }, ...current]);
      toast.success("Lead created");
    }
    setEditingLead(undefined);
    setPage(1);
  }

  function deleteLeads(ids: Set<string>) {
    setLeads((current) => current.filter((lead) => !ids.has(lead.id)));
    setSelectedIds(new Set());
    setRowMenuId(null);
    toast.success(`${ids.size} lead${ids.size === 1 ? "" : "s"} deleted`);
  }

  function qualifySelected() {
    setLeads((current) => current.map((lead) => selectedIds.has(lead.id) ? { ...lead, status: "qualified" as const } : lead));
    toast.success(`${selectedIds.size} lead${selectedIds.size === 1 ? "" : "s"} marked qualified`);
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-xl font-semibold tracking-tight text-foreground">Leads</h1><p className="mt-0.5 text-[11px] text-muted-foreground">Capture, qualify, and convert your sales pipeline.</p></div>
        <button type="button" onClick={() => setEditingLead(null)} className="orion-add-widget flex items-center gap-2 rounded-lg px-3.5 py-2 text-[11px] font-semibold text-primary-foreground transition hover:brightness-110"><Plus className="h-4 w-4" />Add Lead</button>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5" aria-label="Lead metrics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <button key={stat.id} type="button" onClick={() => changeStatus(stat.id)} aria-pressed={activeStatus === stat.id} className={cn("orion-panel orion-panel-hover p-3 text-left transition last:col-span-2 md:last:col-span-1", activeStatus === stat.id && "border-primary/35")}>
            <div className="flex items-start justify-between"><div><p className="text-[10px] text-muted-foreground">{stat.label}</p><p className="mt-1.5 text-[21px] font-semibold text-foreground">{stat.value}</p></div><span className={cn("grid h-8 w-8 place-items-center rounded-full border", stat.tone)}><Icon className="h-4 w-4" /></span></div>
            <div className="mt-1 flex items-end justify-between gap-2"><p className="text-[9px] text-muted-foreground"><span className="text-success">↑ {stat.delta}</span> vs last month</p><MiniSparkline values={stat.spark} className={stat.tone.split(" ")[0]} /></div>
          </button>;
        })}
      </section>

      <section className="orion-panel overflow-visible">
        <div className="flex flex-col border-b border-border lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 gap-6 overflow-x-auto px-4">
            {statusTabs.map((tab) => <button key={tab.id} type="button" onClick={() => changeStatus(tab.id)} className={cn("relative shrink-0 py-3 text-[11px] text-muted-foreground transition hover:text-foreground", activeStatus === tab.id && "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary")}>{tab.label}</button>)}
          </div>
          <div className="flex flex-wrap items-center gap-2 px-4 py-2">
            <div className="relative">
              <button type="button" onClick={() => { setFilterOpen((open) => !open); setColumnsOpen(false); }} aria-expanded={filterOpen} className="orion-glass-control flex h-8 items-center gap-2 rounded-lg px-3 text-[10px] text-foreground"><Filter className="h-3.5 w-3.5" />Filter{activeFilterCount ? <span className="rounded-full bg-primary px-1.5 text-[9px] text-primary-foreground">{activeFilterCount}</span> : null}</button>
              {filterOpen ? <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-popover/95 p-3 shadow-floating backdrop-blur-xl">
                <label className="text-[10px] font-medium text-muted-foreground">Source<select value={source} onChange={(event) => { setSource(event.target.value as LeadSource | "all"); setPage(1); }} className="orion-glass-control mt-1.5 h-9 w-full rounded-lg px-2 text-xs text-foreground"><option value="all">All sources</option>{sources.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label className="mt-3 block text-[10px] font-medium text-muted-foreground">Minimum score: {minimumScore}<input type="range" min="0" max="100" step="5" value={minimumScore} onChange={(event) => { setMinimumScore(Number(event.target.value)); setPage(1); }} className="mt-2 w-full accent-primary" /></label>
                <button type="button" onClick={() => { setSource("all"); setMinimumScore(0); setPage(1); }} className="mt-3 text-[10px] font-medium text-primary">Reset filters</button>
              </div> : null}
            </div>
            <div className="relative">
              <button type="button" onClick={() => { setColumnsOpen((open) => !open); setFilterOpen(false); }} aria-expanded={columnsOpen} className="orion-glass-control flex h-8 items-center gap-2 rounded-lg px-3 text-[10px] text-foreground"><Columns3 className="h-3.5 w-3.5" />Columns</button>
              {columnsOpen ? <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-border bg-popover/95 p-2 shadow-floating backdrop-blur-xl">{(Object.keys(columnLabels) as LeadColumn[]).map((column) => <label key={column} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"><input type="checkbox" checked={columns[column]} onChange={() => setColumns((current) => ({ ...current, [column]: !current[column] }))} className="accent-primary" />{columnLabels[column]}</label>)}</div> : null}
            </div>
            <label className="orion-glass-control flex h-8 min-w-48 flex-1 items-center gap-2 rounded-lg px-3 lg:w-52 lg:flex-none"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search leads..." className="min-w-0 flex-1 bg-transparent text-[10px] text-foreground outline-none placeholder:text-muted-foreground" /></label>
          </div>
        </div>

        {selectedIds.size > 0 ? <div className="flex flex-wrap items-center gap-2 border-b border-primary/15 bg-primary/[0.04] px-4 py-2"><span className="mr-auto text-[10px] font-medium text-primary">{selectedIds.size} selected</span><button type="button" onClick={qualifySelected} className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-[10px] text-primary">Mark qualified</button><button type="button" onClick={() => deleteLeads(selectedIds)} className="flex items-center gap-1 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-1.5 text-[10px] text-destructive"><Trash2 className="h-3 w-3" />Delete</button></div> : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead><tr className="border-b border-border bg-foreground/[0.025] text-[10px] text-muted-foreground">
              <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all visible leads" checked={allPageSelected} onChange={togglePageSelection} className="accent-primary" /></th>
              <th className="min-w-52 py-3 pr-4"><SortButton label="Lead" column="name" sort={sort} onSort={toggleSort} /></th>
              {columns.company ? <th className="min-w-40 py-3 pr-4"><SortButton label="Company" column="company" sort={sort} onSort={toggleSort} /></th> : null}
              {columns.status ? <th className="min-w-28 py-3 pr-4"><SortButton label="Status" column="status" sort={sort} onSort={toggleSort} /></th> : null}
              {columns.score ? <th className="min-w-28 py-3 pr-4"><SortButton label="Lead Score" column="score" sort={sort} onSort={toggleSort} /></th> : null}
              {columns.source ? <th className="min-w-24 py-3 pr-4"><SortButton label="Source" column="source" sort={sort} onSort={toggleSort} /></th> : null}
              {columns.owner ? <th className="min-w-24 py-3 pr-4">Owner</th> : null}
              {columns.createdAt ? <th className="min-w-28 py-3 pr-4"><SortButton label="Created At" column="createdAt" sort={sort} onSort={toggleSort} /></th> : null}
              <th className="w-16 px-4 py-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{pageLeads.map((lead) => { const score = scoreMeta(lead.score); return <tr key={lead.id} className={cn("border-b border-border/70 text-[11px] transition hover:bg-foreground/[0.025]", selectedIds.has(lead.id) && "bg-primary/[0.035]")}>
              <td className="px-4 py-2.5"><input type="checkbox" aria-label={`Select ${lead.name}`} checked={selectedIds.has(lead.id)} onChange={() => toggleSelected(lead.id)} className="accent-primary" /></td>
              <td className="py-2.5 pr-4"><button type="button" onClick={() => setDetailLead(lead)} className="flex items-center gap-2.5 text-left"><Avatar className="h-7 w-7 ring-1 ring-border"><AvatarFallback className="text-[9px]">{getInitials(lead.name)}</AvatarFallback></Avatar><span className="min-w-0"><span className="block truncate font-medium text-foreground">{lead.name}</span><span className="block truncate text-[9px] text-muted-foreground">{lead.email}</span></span></button></td>
              {columns.company ? <td className="py-2.5 pr-4 text-foreground"><CompanyBrand company={lead.company} /></td> : null}
              {columns.status ? <td className="py-2.5 pr-4"><span className={cn("rounded border px-2 py-1 text-[9px]", statusMeta[lead.status].className)}>{statusMeta[lead.status].label}</span></td> : null}
              {columns.score ? <td className="py-2.5 pr-4"><span className="flex items-center gap-2 text-foreground"><span className="w-5 text-right">{lead.score}</span><span className={cn("rounded px-1.5 py-1 text-[9px]", score.className)}>{score.label}</span></span></td> : null}
              {columns.source ? <td className="py-2.5 pr-4 text-muted-foreground">{lead.source}</td> : null}
              {columns.owner ? <td className="py-2.5 pr-4"><Avatar className="h-6 w-6 ring-1 ring-border" title={lead.owner}><AvatarFallback className="text-[8px]">{getInitials(lead.owner)}</AvatarFallback></Avatar></td> : null}
              {columns.createdAt ? <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(lead.createdAt)}</td> : null}
              <td className="relative px-4 py-2.5 text-right"><button type="button" aria-label={`Actions for ${lead.name}`} onClick={() => setRowMenuId((current) => current === lead.id ? null : lead.id)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground"><EllipsisVertical className="h-4 w-4" /></button>{rowMenuId === lead.id ? <div className="absolute right-9 top-7 z-30 w-36 rounded-lg border border-border bg-popover/95 p-1 text-left shadow-floating backdrop-blur-xl"><button type="button" onClick={() => { setDetailLead(lead); setRowMenuId(null); }} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-foreground hover:bg-foreground/[0.06]">View profile</button><button type="button" onClick={() => { setEditingLead(lead); setRowMenuId(null); }} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-foreground hover:bg-foreground/[0.06]">Edit lead</button><button type="button" onClick={() => deleteLeads(new Set([lead.id]))} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-destructive hover:bg-destructive/10">Delete</button></div> : null}</td>
            </tr>; })}</tbody>
          </table>
          {pageLeads.length === 0 ? <div className="grid min-h-52 place-items-center p-8 text-center"><div><Search className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium text-foreground">No leads found</p><p className="mt-1 text-xs text-muted-foreground">Try adjusting your search or filters.</p></div></div> : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[10px] text-muted-foreground">
          <p>Showing {filteredLeads.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {Math.min(currentPage * PAGE_SIZE, filteredLeads.length)} of {filteredLeads.length} leads</p>
          <div className="flex items-center gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="grid h-7 w-7 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === currentPage ? "page" : undefined} className={cn("h-7 min-w-7 rounded-lg border px-2", number === currentPage ? "border-primary/35 bg-primary/10 text-primary" : "border-transparent hover:border-border hover:text-foreground")}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="grid h-7 w-7 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5" /></button></div>
        </footer>
      </section>

      {editingLead !== undefined ? <LeadDialog lead={editingLead} onClose={() => setEditingLead(undefined)} onSave={saveLead} /> : null}
      {detailLead ? <LeadDetails lead={detailLead} onClose={() => setDetailLead(null)} onEdit={() => { setEditingLead(detailLead); setDetailLead(null); }} /> : null}
    </div>
  );
}
