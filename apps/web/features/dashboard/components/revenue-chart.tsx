"use client";

import { useId, useMemo, useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { closeArea, smoothLine, toPoints } from "@/shared/lib/chart-path";
import { revenueSeries } from "../constants/crm-data";

const W = 720;
const H = 200;
const Y_TICKS = [30000, 20000, 10000, 0];
const ranges = [
  { id: "7d", label: "Last 7 Days" },
  { id: "month", label: "This Month" },
] as const;
type RevenueRange = (typeof ranges)[number]["id"];

export function RevenueChart() {
  const gid = useId().replace(/:/g, "");
  const [range, setRange] = useState<RevenueRange>("month");
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleSeries = useMemo(
    () => (range === "7d" ? revenueSeries.slice(-7) : revenueSeries),
    [range]
  );
  const [active, setActive] = useState<number | null>(visibleSeries.length - 1);

  const { points, line, area } = useMemo(() => {
    const values = visibleSeries.map((d) => d.value);
    // Anchor the scale to 0 so bar heights read proportionally, and to the top
    // tick so the series never collides with the gridline labels.
    const scaled = [...values, 0, 30000];
    const all = toPoints(scaled, W, H, 6);
    const pts = all.slice(0, values.length);
    const l = smoothLine(pts);
    return { points: pts, line: l, area: closeArea(l, pts, H) };
  }, [visibleSeries]);

  const activePoint = active === null ? null : points[active];
  const activeDatum = active === null ? null : visibleSeries[active];
  const rangeLabel = ranges.find((item) => item.id === range)?.label ?? "This Month";
  const labelIndices = Array.from(
    new Set([0, Math.round((visibleSeries.length - 1) / 2), visibleSeries.length - 1])
  );

  function selectRange(nextRange: RevenueRange) {
    const nextLength = nextRange === "7d" ? 7 : revenueSeries.length;
    setRange(nextRange);
    setActive(nextLength - 1);
    setMenuOpen(false);
  }

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Revenue Overview</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="orion-glass-control flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] text-muted-foreground transition hover:bg-foreground/[0.08] hover:text-foreground"
          >
            {rangeLabel}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen ? (
            <div role="menu" className="absolute right-0 top-full z-20 mt-1.5 min-w-32 rounded-lg border border-border bg-popover/95 p-1 shadow-floating backdrop-blur-xl">
              {ranges.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={range === item.id}
                  onClick={() => selectRange(item.id)}
                  className="block w-full rounded-md px-2.5 py-1.5 text-left text-[10px] text-muted-foreground transition hover:bg-primary/10 hover:text-foreground aria-checked:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <p className="mt-2 text-[21px] font-semibold leading-none tracking-tight text-foreground">
        $24,890.50
      </p>
      <p className="mt-1.5 flex items-center gap-1 text-[10px]">
        <ArrowUp className="h-3.5 w-3.5 text-success" />
        <span className="text-success">12.5%</span>
        <span className="text-muted-foreground">{range === "7d" ? "vs prior 7 days" : "vs last month"}</span>
      </p>

      <div className="relative mt-2.5 flex-1">
        {/* Y axis labels sit outside the SVG so they stay crisp at any width. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 flex-col justify-between py-[6px] text-[10px] text-muted-foreground">
          {Y_TICKS.map((t) => (
            <span key={t}>{t === 0 ? "$0" : `$${t / 1000}K`}</span>
          ))}
        </div>

        <div className="relative ml-10">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="h-[118px] w-full"
            role="img"
            aria-label="Revenue over the last 20 days, trending up 12.5 percent"
            onMouseLeave={() => setActive(visibleSeries.length - 1)}
          >
            <defs>
              <linearGradient id={`rev-${gid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2ee6c5" stopOpacity="0.34" />
                <stop offset="65%" stopColor="#2ee6c5" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#2ee6c5" stopOpacity="0" />
              </linearGradient>
            </defs>

            {Y_TICKS.map((t) => {
              const y = 6 + (H - 12) * (1 - t / 30000);
              return (
                <line
                  key={t}
                  x1="0"
                  x2={W}
                  y1={y}
                  y2={y}
                  stroke="rgba(126,162,238,0.11)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            <path d={area} fill={`url(#rev-${gid})`} />
            <path
              d={line}
              fill="none"
              stroke="#2ee6c5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {activePoint && (
              <>
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1="0"
                  y2={H}
                  stroke="rgba(46,230,197,0.34)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="4.5"
                  fill="#2ee6c5"
                  stroke="#0a1020"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}

            {/* Invisible hit targets — one column per sample. */}
            {points.map((p, i) => (
              <rect
                key={i}
                x={i === 0 ? 0 : p.x - W / (points.length - 1) / 2}
                y="0"
                width={W / (points.length - 1)}
                height={H}
                fill="transparent"
                onMouseEnter={() => setActive(i)}
              />
            ))}
          </svg>

          {activeDatum && activePoint && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-primary/25 bg-popover/95 px-2.5 py-1.5 text-center shadow-lg backdrop-blur"
              style={{
                left: `${(activePoint.x / W) * 100}%`,
                top: `${(activePoint.y / H) * 118 - 8}px`,
              }}
            >
              <p className="text-[10px] leading-tight text-muted-foreground">
                {activeDatum.label}
              </p>
              <p className="text-[12px] font-semibold leading-tight text-foreground">
                ${activeDatum.value.toLocaleString()}
              </p>
            </div>
          )}

          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            {labelIndices.map((i) => (
              <span key={i}>{visibleSeries[i].label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
