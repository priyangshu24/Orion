"use client";

import { useState } from "react";
import { FileStack, Search, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AskPanel } from "./ask-panel";
import { DocumentsPanel } from "./documents-panel";
import { SearchPanel } from "./search-panel";

const tabs = [
  { key: "documents", label: "Documents", icon: FileStack },
  { key: "search", label: "Search", icon: Search },
  { key: "ask", label: "Ask AI", icon: Sparkles },
] as const;

export type IntelligenceTab = (typeof tabs)[number]["key"];

interface IntelligenceHubProps {
  initialTab?: IntelligenceTab;
  askSeed?: string;
}

export function IntelligenceHub({ initialTab = "documents", askSeed }: IntelligenceHubProps) {
  const [view, setView] = useState<IntelligenceTab>(initialTab);

  return (
    <div className="flex flex-col gap-5">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Intelligence Hub</h2>
        <p className="text-sm text-muted-foreground">
          Upload enterprise documents and let Orion scan, understand, and answer questions
          about them — with page-level citations.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex w-full gap-1 rounded-full border border-foreground/10 bg-foreground/[0.04] p-1 sm:w-auto sm:self-start">
        {tabs.map((tab) => {
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

      {view === "documents" && <DocumentsPanel />}
      {view === "search" && <SearchPanel />}
      {view === "ask" && <AskPanel seed={askSeed} />}
    </div>
  );
}
