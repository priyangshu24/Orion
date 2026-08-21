"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  EllipsisVertical,
  Filter,
  Info,
  LayoutList,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { CompanyBrand } from "@/shared/components/company-brand";
import { cn, formatDate, getInitials } from "@/shared/lib/utils";
import { dashboardStageMap, dealStageMeta, dealStageOrder, mockDeals } from "../constants/mock-deals";
import type { Deal, DealDraft, DealSortKey, DealStage } from "../types";

const owners = ["Alex Morgan", "Priya Shah"] as const;
const pageSizeOptions = [5, 8, 10];

function formatCurrency(value: number, compact = false) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 72},${27 - ((value - min) / Math.max(max - min, 1)) * 23}`).join(" ");
  return <svg viewBox="0 0 72 30" className="h-7 w-[72px]" aria-hidden="true"><polyline points={points} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SortButton({ label, column, sort, onSort }: { label: string; column: DealSortKey; sort: { key: DealSortKey; direction: "asc" | "desc" }; onSort: (key: DealSortKey) => void }) {
  const Icon = sort.key === column ? (sort.direction === "asc" ? ArrowUp : ArrowDown) : null;
  return <button type="button" onClick={() => onSort(column)} className="flex items-center gap-1 transition hover:text-foreground">{label}{Icon ? <Icon className="h-3 w-3 text-primary" /> : null}</button>;
}

function DealDialog({ deal, onClose, onSave }: { deal: Deal | null; onClose: () => void; onSave: (draft: DealDraft) => void }) {
  const [draft, setDraft] = useState<DealDraft>(() => ({
    name: deal?.name ?? "",
    description: deal?.description ?? "",
    company: deal?.company ?? "",
    stage: deal?.stage ?? "lead",
    value: deal?.value ?? 5000,
    closeDate: deal?.closeDate ?? new Date().toISOString().slice(0, 10),
    owner: deal?.owner ?? "Alex Morgan",
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
      toast.error("Deal name and company are required");
      return;
    }
    if (draft.value <= 0) {
      toast.error("Deal value must be greater than zero");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), company: draft.company.trim(), description: draft.description.trim() || "New opportunity" });
  }

  return <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="deal-dialog-title">
    <button type="button" aria-label="Close deal dialog" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <form onSubmit={submit} className="neon-panel relative z-10 w-full max-w-2xl rounded-2xl p-5 shadow-floating">
      <header className="flex items-start justify-between gap-4"><div><h2 id="deal-dialog-title" className="text-base font-semibold text-foreground">{deal ? "Edit deal" : "Create new deal"}</h2><p className="mt-1 text-xs text-muted-foreground">Capture the commercial details your team needs to forecast accurately.</p></div><button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"><X className="h-4 w-4" /></button></header>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-[11px] font-medium text-muted-foreground">Deal name<input autoFocus value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Enterprise expansion" className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" /></label>
        <label className="text-[11px] font-medium text-muted-foreground">Company<input value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} placeholder="Apple" className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" /></label>
        <label className="text-[11px] font-medium text-muted-foreground sm:col-span-2">Description<input value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="What is included in this opportunity?" className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none focus:border-primary/50" /></label>
        <label className="text-[11px] font-medium text-muted-foreground">Stage<select value={draft.stage} onChange={(event) => setDraft((current) => ({ ...current, stage: event.target.value as DealStage }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none">{dealStageOrder.map((stage) => <option key={stage} value={stage}>{dealStageMeta[stage].label}</option>)}</select></label>
        <label className="text-[11px] font-medium text-muted-foreground">Deal value<input type="number" min="100" step="100" value={draft.value} onChange={(event) => setDraft((current) => ({ ...current, value: Number(event.target.value) }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none" /></label>
        <label className="text-[11px] font-medium text-muted-foreground">Expected close date<input type="date" value={draft.closeDate} onChange={(event) => setDraft((current) => ({ ...current, closeDate: event.target.value }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none" /></label>
        <label className="text-[11px] font-medium text-muted-foreground">Owner<select value={draft.owner} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} className="orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
      </div>
      <footer className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground">Cancel</button><button type="submit" className="orion-add-widget rounded-lg px-4 py-2 text-xs font-semibold text-primary-foreground">{deal ? "Save changes" : "Create deal"}</button></footer>
    </form>
  </div>;
}

function DealDetails({ deal, onClose, onEdit, onWon }: { deal: Deal; onClose: () => void; onEdit: () => void; onWon: () => void }) {
  const stage = dealStageMeta[deal.stage];
  return <div className="fixed inset-0 z-50"><button type="button" aria-label="Close deal details" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} /><aside className="neon-panel absolute bottom-3 right-3 top-3 flex w-[420px] max-w-[calc(100vw-24px)] flex-col rounded-2xl p-5 shadow-floating" aria-label={`${deal.name} details`}>
    <header className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Deal overview</span><button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"><X className="h-4 w-4" /></button></header>
    <div className="mt-6"><span className={cn("rounded border px-2 py-1 text-[10px]", stage.className)}>{stage.label}</span><h2 className="mt-3 text-xl font-semibold text-foreground">{deal.name}</h2><p className="mt-1 text-xs text-muted-foreground">{deal.description}</p><p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{formatCurrency(deal.value)}</p></div>
    <dl className="mt-6 grid grid-cols-2 gap-3">{[["Company", deal.company], ["Close date", formatDate(deal.closeDate)], ["Owner", deal.owner], ["Probability", `${Math.round(stage.probability * 100)}%`], ["Weighted value", formatCurrency(deal.value * stage.probability)], ["Last activity", deal.lastActivity]].map(([label, value]) => <div key={label} className="orion-glass-control rounded-xl p-3"><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-1 text-xs font-medium text-foreground">{value}</dd></div>)}</dl>
    <div className="mt-auto grid grid-cols-2 gap-2 pt-6"><button type="button" onClick={onEdit} className="rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-foreground/[0.06]">Edit deal</button><button type="button" disabled={deal.stage === "closed-won"} onClick={onWon} className="orion-add-widget rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">Mark won</button></div>
  </aside></div>;
}

export function DealsWorkspace() {
  const searchParams = useSearchParams();
  const initialStage = dashboardStageMap[searchParams.get("stage") ?? ""] ?? "all";
  const [deals, setDeals] = useState(mockDeals);
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [stageFilter, setStageFilter] = useState<DealStage | "all">(initialStage);
  const [ownerFilter, setOwnerFilter] = useState<string | "all">("all");
  const [minimumValue, setMinimumValue] = useState(0);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: DealSortKey; direction: "asc" | "desc" }>({ key: "closeDate", direction: "asc" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [filterOpen, setFilterOpen] = useState(false);
  const [rowMenuId, setRowMenuId] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null | undefined>(undefined);
  const [detailDeal, setDetailDeal] = useState<Deal | null>(() => mockDeals.find((deal) => deal.id === searchParams.get("deal")) ?? null);

  const pipelineValue = useMemo(() => deals.reduce((sum, deal) => sum + deal.value, 0), [deals]);
  const weightedValue = useMemo(() => deals.reduce((sum, deal) => sum + deal.value * dealStageMeta[deal.stage].probability, 0), [deals]);
  const wonCount = deals.filter((deal) => deal.stage === "closed-won").length;
  const metrics = [
    { id: "pipeline", label: "Total Pipeline", value: formatCurrency(pipelineValue), delta: "18.6%", icon: CircleDollarSign, color: "#2ee6c5", spark: [2, 4, 3, 6, 5, 9, 7, 12] },
    { id: "deals", label: "Total Deals", value: String(deals.length), delta: "8.2%", icon: BarChart3, color: "#38bdf8", spark: [3, 2, 5, 4, 7, 6, 9, 11] },
    { id: "weighted", label: "Weighted Value", value: formatCurrency(weightedValue), delta: "14.6%", icon: TrendingUp, color: "#9b7cff", spark: [2, 3, 5, 4, 7, 6, 10, 12] },
    { id: "average", label: "Avg. Deal Size", value: formatCurrency(pipelineValue / Math.max(deals.length, 1)), delta: "6.5%", icon: CircleDollarSign, color: "#f59e0b", spark: [3, 4, 3, 6, 5, 8, 7, 11] },
    { id: "win", label: "Win Rate", value: `${((wonCount / Math.max(deals.length, 1)) * 100).toFixed(1)}%`, delta: "5.4%", icon: Trophy, color: "#22c55e", spark: [2, 4, 3, 5, 7, 6, 9, 12] },
    { id: "cycle", label: "Avg. Sales Cycle", value: "28", delta: "Avg. days", icon: Clock3, color: "#94a3b8", spark: [6, 5, 7, 5, 6, 4, 5, 3] },
  ];

  const stageSummaries = dealStageOrder.map((stage) => ({
    stage,
    count: deals.filter((deal) => deal.stage === stage).length,
    value: deals.filter((deal) => deal.stage === stage).reduce((sum, deal) => sum + deal.value, 0),
  }));

  const filteredDeals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return deals
      .filter((deal) => stageFilter === "all" || deal.stage === stageFilter)
      .filter((deal) => ownerFilter === "all" || deal.owner === ownerFilter)
      .filter((deal) => deal.value >= minimumValue)
      .filter((deal) => !normalized || [deal.name, deal.company, deal.description, deal.owner].some((value) => value.toLowerCase().includes(normalized)))
      .toSorted((a, b) => {
        const left = sort.key === "name" ? a.name : a[sort.key];
        const right = sort.key === "name" ? b.name : b[sort.key];
        const result = typeof left === "number" && typeof right === "number" ? left - right : String(left).localeCompare(String(right));
        return sort.direction === "asc" ? result : -result;
      });
  }, [deals, minimumValue, ownerFilter, query, sort, stageFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredDeals.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageDeals = filteredDeals.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allPageSelected = pageDeals.length > 0 && pageDeals.every((deal) => selectedIds.has(deal.id));
  const activeFilterCount = Number(stageFilter !== "all") + Number(ownerFilter !== "all") + Number(minimumValue > 0);

  function setStage(stage: DealStage | "all") { setStageFilter(stage); setPage(1); setSelectedIds(new Set()); }
  function toggleSort(key: DealSortKey) { setSort((current) => current.key === key ? { key, direction: current.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" }); }
  function toggleSelected(id: string) { setSelectedIds((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function togglePageSelection() { setSelectedIds((current) => { const next = new Set(current); pageDeals.forEach((deal) => allPageSelected ? next.delete(deal.id) : next.add(deal.id)); return next; }); }

  function saveDeal(draft: DealDraft) {
    if (editingDeal) {
      setDeals((current) => current.map((deal) => deal.id === editingDeal.id ? { ...deal, ...draft, lastActivity: "Deal updated · just now" } : deal));
      toast.success("Deal updated");
    } else {
      setDeals((current) => [{ ...draft, id: `deal-${Date.now()}`, lastActivity: "Deal created · just now" }, ...current]);
      toast.success("Deal created");
    }
    setEditingDeal(undefined);
    setPage(1);
  }

  function deleteDeals(ids: Set<string>) { setDeals((current) => current.filter((deal) => !ids.has(deal.id))); setSelectedIds(new Set()); setRowMenuId(null); toast.success(`${ids.size} deal${ids.size === 1 ? "" : "s"} deleted`); }
  function changeStage(ids: Set<string>, stage: DealStage) { setDeals((current) => current.map((deal) => ids.has(deal.id) ? { ...deal, stage, lastActivity: `Moved to ${dealStageMeta[stage].label} · just now` } : deal)); setSelectedIds(new Set()); toast.success(`${ids.size} deal${ids.size === 1 ? "" : "s"} moved to ${dealStageMeta[stage].label}`); }
  function moveNext(deal: Deal) { const index = dealStageOrder.indexOf(deal.stage); const next = dealStageOrder[Math.min(index + 1, dealStageOrder.length - 1)]; changeStage(new Set([deal.id]), next); setRowMenuId(null); }

  return <div className="space-y-3">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight text-foreground">Deals</h1><Info className="h-3.5 w-3.5 text-muted-foreground" /></div><p className="mt-0.5 text-[11px] text-muted-foreground">Track and manage your deals across every stage of the sales pipeline.</p></div><div className="flex items-center gap-2"><div className="orion-glass-control flex rounded-lg p-0.5"><button type="button" onClick={() => setView("pipeline")} aria-pressed={view === "pipeline"} className={cn("flex h-7 items-center gap-1.5 rounded-md px-3 text-[10px] text-muted-foreground", view === "pipeline" && "bg-primary/12 text-primary")}><BarChart3 className="h-3.5 w-3.5" />Pipeline</button><button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={cn("flex h-7 items-center gap-1.5 rounded-md px-3 text-[10px] text-muted-foreground", view === "list" && "bg-primary/12 text-primary")}><LayoutList className="h-3.5 w-3.5" />List</button></div><div className="relative"><button type="button" onClick={() => setFilterOpen((open) => !open)} aria-expanded={filterOpen} className="orion-glass-control flex h-8 items-center gap-2 rounded-lg px-3 text-[10px] text-foreground"><Filter className="h-3.5 w-3.5" />Filters{activeFilterCount ? <span className="rounded-full bg-primary px-1.5 text-[9px] text-primary-foreground">{activeFilterCount}</span> : null}</button>{filterOpen ? <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-border bg-popover/95 p-3 shadow-floating backdrop-blur-xl"><label className="text-[10px] font-medium text-muted-foreground">Search<input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Deal, company, owner..." className="orion-glass-control mt-1.5 h-9 w-full rounded-lg px-3 text-xs text-foreground outline-none" /></label><label className="mt-3 block text-[10px] font-medium text-muted-foreground">Stage<select value={stageFilter} onChange={(event) => setStage(event.target.value as DealStage | "all")} className="orion-glass-control mt-1.5 h-9 w-full rounded-lg px-2 text-xs text-foreground"><option value="all">All stages</option>{dealStageOrder.map((stage) => <option key={stage} value={stage}>{dealStageMeta[stage].label}</option>)}</select></label><label className="mt-3 block text-[10px] font-medium text-muted-foreground">Owner<select value={ownerFilter} onChange={(event) => { setOwnerFilter(event.target.value); setPage(1); }} className="orion-glass-control mt-1.5 h-9 w-full rounded-lg px-2 text-xs text-foreground"><option value="all">All owners</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></label><label className="mt-3 block text-[10px] font-medium text-muted-foreground">Minimum value: {formatCurrency(minimumValue)}<input type="range" min="0" max="25000" step="1000" value={minimumValue} onChange={(event) => { setMinimumValue(Number(event.target.value)); setPage(1); }} className="mt-2 w-full accent-primary" /></label><button type="button" onClick={() => { setStageFilter("all"); setOwnerFilter("all"); setMinimumValue(0); setQuery(""); setPage(1); }} className="mt-3 text-[10px] font-medium text-primary">Reset filters</button></div> : null}</div><button type="button" onClick={() => setEditingDeal(null)} className="orion-add-widget flex h-8 items-center gap-2 rounded-lg px-3.5 text-[10px] font-semibold text-primary-foreground"><Plus className="h-3.5 w-3.5" />New Deal</button></div></header>

    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Deal metrics">{metrics.map((metric) => { const Icon = metric.icon; return <article key={metric.id} className="orion-panel p-3"><div className="flex items-start justify-between"><div><p className="text-[10px] text-muted-foreground">{metric.label}</p><p className="mt-1.5 text-[19px] font-semibold text-foreground">{metric.value}</p></div><span className="grid h-7 w-7 place-items-center rounded-full border border-border" style={{ color: metric.color, backgroundColor: `${metric.color}12` }}><Icon className="h-3.5 w-3.5" /></span></div><div className="mt-1 flex items-end justify-between gap-1"><p className={cn("text-[9px]", metric.id === "cycle" ? "text-muted-foreground" : "text-success")}>{metric.id === "cycle" ? metric.delta : `↑ ${metric.delta}`}<span className="text-muted-foreground">{metric.id === "cycle" ? "" : " vs last month"}</span></p><MiniSparkline values={metric.spark} color={metric.color} /></div></article>; })}</section>

    <section className="orion-panel overflow-visible">
      {view === "pipeline" ? <div className="grid grid-cols-2 border-b border-border md:grid-cols-3 xl:grid-cols-5">{stageSummaries.map((summary) => { const meta = dealStageMeta[summary.stage]; return <button key={summary.stage} type="button" onClick={() => setStage(stageFilter === summary.stage ? "all" : summary.stage)} aria-pressed={stageFilter === summary.stage} className={cn("relative border-r border-border px-4 py-3 text-left last:border-r-0 hover:bg-foreground/[0.025]", stageFilter === summary.stage && "bg-foreground/[0.035]")}><span className="flex items-center gap-2 text-[10px] font-medium text-foreground"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />{meta.label}</span><div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground"><span>{summary.count} deals</span><span>{formatCurrency(summary.value, true)}</span></div><span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full opacity-70" style={{ backgroundColor: meta.color }} /></button>; })}</div> : <div className="flex items-center gap-2 border-b border-border px-4 py-3"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search deals, companies, or owners..." className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground" /></div>}

      {selectedIds.size ? <div className="flex flex-wrap items-center gap-2 border-b border-primary/15 bg-primary/[0.04] px-4 py-2"><span className="mr-auto text-[10px] font-medium text-primary">{selectedIds.size} selected</span><select aria-label="Move selected deals" defaultValue="" onChange={(event) => { if (event.target.value) changeStage(selectedIds, event.target.value as DealStage); event.target.value = ""; }} className="rounded-lg border border-primary/25 bg-primary/10 px-2 py-1.5 text-[10px] text-primary"><option value="" disabled>Move to stage</option>{dealStageOrder.map((stage) => <option key={stage} value={stage}>{dealStageMeta[stage].label}</option>)}</select><button type="button" onClick={() => deleteDeals(selectedIds)} className="flex items-center gap-1 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-1.5 text-[10px] text-destructive"><Trash2 className="h-3 w-3" />Delete</button></div> : null}

      <div className="overflow-x-auto"><table className="w-full min-w-[980px] border-collapse text-left"><thead><tr className="border-b border-border bg-foreground/[0.025] text-[10px] text-muted-foreground"><th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all visible deals" checked={allPageSelected} onChange={togglePageSelection} className="accent-primary" /></th><th className="min-w-52 py-3 pr-4"><SortButton label="Deal Name" column="name" sort={sort} onSort={toggleSort} /></th><th className="min-w-40 py-3 pr-4"><SortButton label="Company" column="company" sort={sort} onSort={toggleSort} /></th><th className="min-w-28 py-3 pr-4"><SortButton label="Stage" column="stage" sort={sort} onSort={toggleSort} /></th><th className="min-w-24 py-3 pr-4"><SortButton label="Deal Value" column="value" sort={sort} onSort={toggleSort} /></th><th className="min-w-28 py-3 pr-4"><SortButton label="Close Date" column="closeDate" sort={sort} onSort={toggleSort} /></th><th className="min-w-24 py-3 pr-4"><SortButton label="Owner" column="owner" sort={sort} onSort={toggleSort} /></th><th className="min-w-44 py-3 pr-4">Last Activity</th><th className="w-16 px-4 py-3 text-right">Actions</th></tr></thead><tbody>{pageDeals.map((deal) => { const stage = dealStageMeta[deal.stage]; return <tr key={deal.id} className={cn("border-b border-border/70 text-[11px] transition hover:bg-foreground/[0.025]", selectedIds.has(deal.id) && "bg-primary/[0.035]")}><td className="px-4 py-2.5"><input type="checkbox" aria-label={`Select ${deal.name}`} checked={selectedIds.has(deal.id)} onChange={() => toggleSelected(deal.id)} className="accent-primary" /></td><td className="py-2.5 pr-4"><button type="button" onClick={() => setDetailDeal(deal)} className="text-left"><span className="block font-medium text-foreground">{deal.name}</span><span className="block text-[9px] text-muted-foreground">{deal.description}</span></button></td><td className="py-2.5 pr-4"><CompanyBrand company={deal.company} className="text-foreground" /></td><td className="py-2.5 pr-4"><span className={cn("rounded border px-2 py-1 text-[9px]", stage.className)}>{stage.label}</span></td><td className="py-2.5 pr-4 font-medium text-foreground">{formatCurrency(deal.value)}</td><td className="py-2.5 pr-4 text-muted-foreground">{formatDate(deal.closeDate)}</td><td className="py-2.5 pr-4"><Avatar className="h-6 w-6 ring-1 ring-border" title={deal.owner}><AvatarFallback className="text-[8px]">{getInitials(deal.owner)}</AvatarFallback></Avatar></td><td className="py-2.5 pr-4 text-[9px] text-muted-foreground">{deal.lastActivity}</td><td className="relative px-4 py-2.5 text-right"><button type="button" aria-label={`Actions for ${deal.name}`} onClick={() => setRowMenuId((current) => current === deal.id ? null : deal.id)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-foreground/[0.07] hover:text-foreground"><EllipsisVertical className="h-4 w-4" /></button>{rowMenuId === deal.id ? <div className="absolute right-9 top-7 z-30 w-40 rounded-lg border border-border bg-popover/95 p-1 text-left shadow-floating backdrop-blur-xl"><button type="button" onClick={() => { setDetailDeal(deal); setRowMenuId(null); }} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-foreground hover:bg-foreground/[0.06]">View details</button><button type="button" onClick={() => { setEditingDeal(deal); setRowMenuId(null); }} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-foreground hover:bg-foreground/[0.06]">Edit deal</button><button type="button" disabled={deal.stage === "closed-won"} onClick={() => moveNext(deal)} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-foreground hover:bg-foreground/[0.06] disabled:opacity-40">Move to next stage</button><button type="button" onClick={() => deleteDeals(new Set([deal.id]))} className="block w-full rounded-md px-2.5 py-2 text-[10px] text-destructive hover:bg-destructive/10">Delete</button></div> : null}</td></tr>; })}</tbody></table>{pageDeals.length === 0 ? <div className="grid min-h-52 place-items-center p-8 text-center"><div><Search className="mx-auto h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium text-foreground">No deals found</p><p className="mt-1 text-xs text-muted-foreground">Adjust your filters or create a new opportunity.</p></div></div> : null}</div>

      <footer className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[10px] text-muted-foreground"><p>Showing {filteredDeals.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredDeals.length)} of {filteredDeals.length} deals</p><div className="flex items-center gap-1"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="grid h-7 w-7 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === currentPage ? "page" : undefined} className={cn("h-7 min-w-7 rounded-lg border px-2", number === currentPage ? "border-primary/35 bg-primary/10 text-primary" : "border-transparent hover:border-border hover:text-foreground")}>{number}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="grid h-7 w-7 place-items-center rounded-lg border border-border disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5" /></button><label className="ml-2 flex items-center gap-2">Rows per page<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-border bg-transparent px-2 py-1 text-foreground">{pageSizeOptions.map((size) => <option key={size}>{size}</option>)}</select></label></div></footer>
    </section>

    {editingDeal !== undefined ? <DealDialog deal={editingDeal} onClose={() => setEditingDeal(undefined)} onSave={saveDeal} /> : null}
    {detailDeal ? <DealDetails deal={detailDeal} onClose={() => setDetailDeal(null)} onEdit={() => { setEditingDeal(detailDeal); setDetailDeal(null); }} onWon={() => { changeStage(new Set([detailDeal.id]), "closed-won"); setDetailDeal((current) => current ? { ...current, stage: "closed-won" } : null); }} /> : null}
  </div>;
}
