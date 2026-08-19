"use client";

import { recentActivity } from "../constants/crm-data";

const TONES: Record<string, string> = {
  teal: "border-primary/25 bg-primary/10 text-primary",
  green: "border-success/25 bg-success/10 text-success",
  gold: "border-warning/25 bg-warning/10 text-warning",
  pink: "border-[#f472b6]/25 bg-[#f472b6]/10 text-[#f472b6]",
  blue: "border-info/25 bg-info/10 text-info",
};

export function ActivityFeed() {
  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Recent Activity</h2>
        <button
          type="button"
          className="text-[10px] text-primary transition hover:text-primary/80"
        >
          View all
        </button>
      </header>

      <ul className="mt-2 flex flex-col">
        {recentActivity.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg px-1 py-1.5 transition hover:bg-foreground/[0.04]"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${TONES[item.tone]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {/* basis-0 so the title yields before the timestamp compresses. */}
              <p className="min-w-0 flex-1 basis-0 truncate text-[11px] text-foreground">
                {item.title}
              </p>
              <span className="shrink-0 whitespace-nowrap text-[9px] text-muted-foreground">
                {item.time}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
