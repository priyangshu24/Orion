"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, FileSearch, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { mockSearchHits } from "../constants/data";
import type { SearchHit } from "../types";
import { docTypeMeta, pill } from "./meta";

const suggestions = [
  "termination notice period",
  "liability cap",
  "payment terms",
  "retention schedule",
];

function scoreHit(hit: SearchHit, terms: string[]): number {
  const haystack = `${hit.documentName} ${hit.sectionPath} ${hit.snippet}`.toLowerCase();
  const matches = terms.filter((t) => haystack.includes(t)).length;
  if (matches === 0) return 0;
  return hit.score * (0.6 + 0.4 * (matches / terms.length));
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        pattern.test(part) ? (
          <mark key={i} className="rounded bg-violet-500/25 px-0.5 text-violet-200">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [results, setResults] = useState<SearchHit[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [latency, setLatency] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function run(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSearching(true);
    const queryTerms = trimmed.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    timer.current = setTimeout(() => {
      const ranked = mockSearchHits
        .map((h) => ({ ...h, score: scoreHit(h, queryTerms) }))
        .filter((h) => h.score > 0)
        .sort((a, b) => b.score - a.score);
      setTerms(queryTerms);
      setResults(ranked);
      setLatency(180 + Math.round(Math.random() * 240));
      setSearching(false);
    }, 450);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Query bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across every document — hybrid dense + keyword retrieval..."
          className="h-12 w-full rounded-full border border-foreground/10 bg-foreground/[0.05] pl-11 pr-28 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/40"
        />
        <button
          type="submit"
          disabled={searching}
          className="absolute right-1.5 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-glow px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          Search
        </button>
      </form>

      {/* Suggestions / meta */}
      {results === null ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => run(s)}
              className={cn(pill, "bg-foreground/[0.05] text-muted-foreground ring-foreground/10 transition-colors hover:text-foreground")}
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {results.length} passages · hybrid retrieval + rerank · {latency} ms
        </p>
      )}

      {/* Results */}
      {results === null ? (
        <div className="neon-panel flex h-56 flex-col items-center justify-center rounded-3xl text-center">
          <FileSearch className="h-9 w-9 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Enterprise semantic search</p>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Every indexed document is chunked and embedded. Results come back as exact passages
            with page-level citations.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="neon-panel flex h-44 flex-col items-center justify-center rounded-3xl text-center">
          <Search className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">No matching passages</p>
          <p className="text-xs text-muted-foreground">Try broader terms — e.g. “renewal” or “payment”.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {results.map((hit) => {
            const type = docTypeMeta[hit.docType];
            return (
              <div
                key={hit.id}
                className="neon-panel group flex flex-col gap-2.5 rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", type.cls)}>
                      <type.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{hit.documentName}</p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        p.{hit.page} · {hit.sectionPath}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{ width: `${Math.round(hit.score * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {hit.score.toFixed(2)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-foreground/85">
                  <Highlight text={hit.snippet} terms={terms} />
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
