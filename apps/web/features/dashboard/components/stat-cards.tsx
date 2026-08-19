"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { closeArea, smoothLine, toPoints } from "@/shared/lib/chart-path";
import { statCards, type StatCard } from "../constants/crm-data";

const W = 150;
const H = 40;

function Sparkline({ values, tone }: { values: number[]; tone: string }) {
  // useId keeps gradient ids unique per instance — duplicate ids would make
  // every card render the first card's gradient.
  const gid = useId().replace(/:/g, "");
  const points = toPoints(values, W, H, 3);
  const line = smoothLine(points);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-8 w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.28" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={closeArea(line, points, H)} fill={`url(#fill-${gid})`} />
      <path
        d={line}
        fill="none"
        stroke={tone}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Card({ card }: { card: StatCard }) {
  const Icon = card.icon;
  const Arrow = card.trend === "up" ? ArrowUp : ArrowDown;
  const tone = card.id === "conversion" || card.id === "deals" ? "#efb34f" : "#2ee6c5";

  return (
    <article className="orion-panel orion-panel-hover relative overflow-hidden p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-1.5 text-[22px] font-semibold leading-none tracking-tight text-foreground">
            {card.value}
          </p>
        </div>
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-foreground/[0.025]"
          style={{
            color: tone,
            borderColor: `${tone}40`,
            boxShadow: `0 0 18px ${tone}1f, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1 text-[10px]">
        <Arrow
          className={cn(
            "h-3.5 w-3.5",
            card.trend === "up" ? "text-success" : "text-destructive"
          )}
        />
        <span className={card.trend === "up" ? "text-success" : "text-destructive"}>
          {card.delta}
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>

      {/* Sparkline is decorative — the numeric delta above carries the meaning. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-70">
        <Sparkline values={card.spark} tone={tone} />
      </div>
    </article>
  );
}

export function StatCards() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </section>
  );
}
