"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  ShieldAlert,
  Sparkles,
  Download,
  CircleAlert,
  Tags,
  Layers,
  Braces,
  FileSearch,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useIntelligenceStore } from "../store/intelligence-store";
import type { DocChunk } from "../types";
import {
  docTypeMeta,
  entityTypeLabel,
  formatBytes,
  pill,
  pipelineStages,
  RiskBadge,
  stageProgress,
  statusMeta,
} from "./meta";

function ChunkCard({ parent, children: kids }: { parent: DocChunk; children: DocChunk[] }) {
  return (
    <div className="neon-panel flex flex-col gap-3 rounded-2xl p-4">
      {/* Parent chunk */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn(pill, "shrink-0 bg-violet-500/10 text-violet-300 ring-violet-500/25")}>
            Parent
          </span>
          <p className="truncate font-mono text-[11px] text-muted-foreground">
            p.{parent.page} · {parent.sectionPath}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
          {parent.tokenCount} tok
        </span>
      </div>
      <p className="whitespace-pre-line text-xs leading-relaxed text-foreground/85">
        {parent.text}
      </p>

      {/* Child chunks */}
      {kids.length > 0 && (
        <div className="flex flex-col gap-2.5 border-l-2 border-foreground/10 pl-3.5">
          {kids.map((c) => (
            <div key={c.id} className="flex flex-col gap-1.5 rounded-xl bg-foreground/[0.03] p-3 ring-1 ring-foreground/10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn(pill, "shrink-0 bg-emerald-500/10 text-emerald-300 ring-emerald-500/25")}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Embedded
                  </span>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    p.{c.page} · {c.sectionPath}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {c.tokenCount} tok
                </span>
              </div>
              <p className="whitespace-pre-line text-xs leading-relaxed text-foreground/80">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const doc = useIntelligenceStore((s) => s.documents.find((d) => d.id === id));
  const chunks = useIntelligenceStore((s) => s.chunks[id]) ?? [];

  if (!doc) {
    return (
      <div className="neon-panel flex h-64 flex-col items-center justify-center gap-3 rounded-3xl text-center">
        <CircleAlert className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium">Document not found</p>
        <Link href="/intelligence" className="text-xs text-primary hover:underline">
          Back to Intelligence Hub
        </Link>
      </div>
    );
  }

  const type = docTypeMeta[doc.docType];
  const status = statusMeta[doc.status];
  const progress = stageProgress(doc.status);
  const blocked = doc.status === "failed" || doc.status === "quarantined";

  const parents = chunks.filter((c) => c.level === "parent");
  const childrenOf = (pid: string) => chunks.filter((c) => c.parentId === pid);
  const orphans = chunks.filter((c) => c.level === "child" && !c.parentId);
  const totalTokens = chunks.reduce((s, c) => s + c.tokenCount, 0);
  const embeddedCount = chunks.filter((c) => c.embedded).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Back + header */}
      <Link
        href="/intelligence"
        className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Intelligence Hub
      </Link>

      <div className="neon-panel flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", type.cls)}>
            <type.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold tracking-tight">{doc.name}</h2>
            <p className="text-xs text-muted-foreground">
              {type.label} · {doc.pages} pages · {formatBytes(doc.sizeBytes)} · {doc.uploadedBy} · {doc.uploadedAt}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={cn(pill, status.cls)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", status.dot, status.pulse && "animate-pulse")} />
                {status.label}
              </span>
              <RiskBadge score={doc.riskScore} />
              <span className={cn(pill, "bg-foreground/[0.06] text-muted-foreground ring-foreground/15")}>
                {doc.language.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            disabled={doc.status !== "indexed"}
            onClick={() =>
              router.push(
                `/intelligence?tab=ask&seed=${encodeURIComponent(`Summarize the key risks and deadlines in "${doc.name}"`)}`
              )
            }
            className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 text-xs font-semibold text-white shadow-glow transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask about this doc
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.05] px-3.5 text-xs font-medium transition-colors hover:bg-foreground/10"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main column */}
        <div className="flex flex-col gap-4">
          {blocked && doc.error && (
            <div className="flex gap-2.5 rounded-2xl bg-rose-500/10 p-4 ring-1 ring-rose-500/25">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
              <p className="text-xs leading-relaxed text-rose-200">{doc.error}</p>
            </div>
          )}

          {doc.summary && (
            <div className="neon-panel rounded-2xl p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AI summary
              </p>
              <p className="text-sm leading-relaxed text-foreground/90">{doc.summary}</p>
            </div>
          )}

          {/* Extracted chunks */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extracted content
              </p>
              {chunks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className={cn(pill, "bg-violet-500/10 text-violet-300 ring-violet-500/25")}>
                    <Layers className="h-3 w-3" />
                    {parents.length} parents
                  </span>
                  <span className={cn(pill, "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25")}>
                    <Braces className="h-3 w-3" />
                    {embeddedCount} embedded
                  </span>
                  <span className={cn(pill, "bg-foreground/[0.06] text-muted-foreground ring-foreground/15")}>
                    {totalTokens.toLocaleString()} tokens
                  </span>
                </div>
              )}
            </div>

            {chunks.length === 0 ? (
              <div className="neon-panel flex h-44 flex-col items-center justify-center rounded-3xl text-center">
                <FileSearch className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium">
                  {blocked ? "No content extracted" : "Extraction in progress"}
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  {blocked
                    ? "This document was stopped by the security pipeline before parsing."
                    : "Chunks appear here once the pipeline reaches the chunking stage."}
                </p>
              </div>
            ) : (
              <>
                {parents.map((p) => (
                  <ChunkCard key={p.id} parent={p}>
                    {childrenOf(p.id)}
                  </ChunkCard>
                ))}
                {orphans.map((c) => (
                  <ChunkCard key={c.id} parent={c}>
                    {[]}
                  </ChunkCard>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Sidebar — scrolls naturally with the page so cards never clip or drift */}
        <div className="flex flex-col gap-4 xl:self-start">
          <div className="neon-panel rounded-2xl p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ingestion pipeline
            </p>
            <ol className="flex flex-col">
              {pipelineStages.map((stage, i) => {
                const done = i < progress || doc.status === "indexed";
                const failedHere = blocked && i === progress;
                const active = !blocked && i === progress && doc.status !== "indexed";
                const last = i === pipelineStages.length - 1;
                return (
                  <li key={stage.key} className="relative flex gap-3 pb-4 last:pb-0">
                    {!last && (
                      <span
                        className={cn(
                          "absolute left-[13px] top-7 h-[calc(100%-20px)] w-px",
                          done ? "bg-emerald-500/40" : "bg-foreground/10"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1",
                        done && "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
                        active && "bg-violet-500/15 text-violet-300 ring-violet-500/30",
                        failedHere && "bg-rose-500/15 text-rose-300 ring-rose-500/30",
                        !done && !active && !failedHere &&
                          "bg-foreground/[0.05] text-muted-foreground/50 ring-foreground/10"
                      )}
                    >
                      <stage.icon className={cn("h-3.5 w-3.5", active && "animate-pulse")} />
                    </span>
                    <span
                      className={cn(
                        "pt-1 text-xs font-medium",
                        done || active || failedHere ? "text-foreground" : "text-muted-foreground/60"
                      )}
                    >
                      {stage.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {doc.deadlines && doc.deadlines.length > 0 && (
            <div className="neon-panel rounded-2xl p-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Detected deadlines
              </p>
              <ul className="flex flex-col gap-2">
                {doc.deadlines.map((d) => (
                  <li
                    key={d.label}
                    className="flex items-center justify-between gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2 ring-1 ring-foreground/10"
                  >
                    <span className="flex items-center gap-2 text-xs">
                      <CalendarClock className="h-3.5 w-3.5 text-amber-300" />
                      {d.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">{d.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {doc.entities.length > 0 && (
            <div className="neon-panel rounded-2xl p-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extracted entities
              </p>
              <ul className="flex flex-col gap-1.5">
                {doc.entities.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-foreground/90">{e.value}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{entityTypeLabel[e.type]}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        {Math.round(e.confidence * 100)}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {doc.piiFlags && doc.piiFlags.length > 0 && (
            <div className="flex gap-2.5 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/25">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <div className="text-xs leading-relaxed text-amber-200">
                <p className="font-medium">PII detected</p>
                <p className="text-amber-200/80">
                  {doc.piiFlags.map((f) => `${f.count}× ${f.type.toLowerCase()}`).join(" · ")} — masked in AI
                  context per org policy.
                </p>
              </div>
            </div>
          )}

          {doc.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Tags className="h-3.5 w-3.5 text-muted-foreground" />
              {doc.tags.map((t) => (
                <span key={t} className={cn(pill, "bg-foreground/[0.06] text-muted-foreground ring-foreground/15")}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
