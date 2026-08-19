"use client";

import { Sparkles } from "lucide-react";

export function AiInsights() {
  return (
    <section className="orion-panel relative overflow-hidden p-3">
      {/* Warm bloom in the corner — the gold half of the brand palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(239,179,79,0.35), transparent 70%)" }}
      />

      <div className="relative flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[0_0_22px_rgba(46,230,197,0.20)]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-foreground">
            Orion AI Insights
          </h2>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            Your conversion rate is{" "}
            <span className="font-medium text-success">up 5.1%</span> this month.
          </p>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Keep up the great work!
          </p>
        </div>
      </div>
    </section>
  );
}
