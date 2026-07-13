"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  UploadCloud,
  FileStack,
  Layers,
  Braces,
  TriangleAlert,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import type { DocumentStatus } from "../types";
import { useIntelligenceStore } from "../store/intelligence-store";
import { ingestFile } from "../services/ingest";
import { docTypeMeta, formatBytes, pill, RiskBadge, statusMeta } from "./meta";

const statusFilters = [
  { key: "all", label: "All" },
  { key: "indexed", label: "Indexed" },
  { key: "in-flight", label: "In pipeline" },
  { key: "attention", label: "Needs attention" },
] as const;

type StatusFilter = (typeof statusFilters)[number]["key"];

function matchesFilter(status: DocumentStatus, filter: StatusFilter) {
  switch (filter) {
    case "all":
      return true;
    case "indexed":
      return status === "indexed";
    case "in-flight":
      return status === "uploaded" || status === "scanning" || status === "processing";
    case "attention":
      return status === "failed" || status === "quarantined";
  }
}

export function DocumentsPanel() {
  const documents = useIntelligenceStore((s) => s.documents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [dragging, setDragging] = useState(false);

  const filtered = useMemo(
    () =>
      documents.filter((d) => {
        if (!matchesFilter(d.status, filter)) return false;
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          d.name.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q)) ||
          d.docType.includes(q)
        );
      }),
    [documents, search, filter]
  );

  const indexed = documents.filter((d) => d.status === "indexed");
  const stats = [
    { label: "Documents indexed", value: indexed.length, icon: FileStack },
    { label: "Pages processed", value: indexed.reduce((s, d) => s + d.pages, 0), icon: Layers },
    { label: "Entities extracted", value: documents.reduce((s, d) => s + d.entities.length, 0), icon: Braces },
    {
      label: "Needs attention",
      value: documents.filter((d) => d.status === "failed" || d.status === "quarantined").length,
      icon: TriangleAlert,
    },
  ];

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files).slice(0, 3)) {
      ingestFile(file);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
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

      {/* Dropzone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed py-7 transition-colors",
          dragging
            ? "border-violet-400/60 bg-violet-500/10"
            : "border-foreground/15 bg-foreground/[0.03] hover:border-foreground/25 hover:bg-foreground/[0.05]"
        )}
      >
        <input
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.docx,.xlsx,.csv,.txt,.md,.eml,.png,.jpg"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow">
          <UploadCloud className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium">
          Drop documents here or <span className="text-primary">browse</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          PDF, DOCX, XLSX, CSV, TXT, EML, images — scanned, chunked, and indexed automatically
        </p>
      </label>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-full border-foreground/10 bg-foreground/[0.05] pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
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
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="neon-panel flex h-44 flex-col items-center justify-center rounded-3xl text-center">
            <Search className="h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No documents found</p>
            <p className="text-xs text-muted-foreground">Adjust the filter or upload a document.</p>
          </div>
        ) : (
          filtered.map((d) => {
            const type = docTypeMeta[d.docType];
            const status = statusMeta[d.status];
            return (
              <Link
                key={d.id}
                href={`/intelligence/${d.id}`}
                className="neon-panel group flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left transition-all hover:-translate-y-0.5"
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", type.cls)}>
                  <type.icon className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {type.label} · {d.pages} pages · {formatBytes(d.sizeBytes)} · {d.uploadedAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RiskBadge score={d.riskScore} />
                  <span className={cn(pill, status.cls)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot, status.pulse && "animate-pulse")} />
                    {status.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
