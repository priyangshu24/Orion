"use client";

import { pipelineStages } from "../constants/crm-data";

export function SalesPipeline() {
  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Sales Pipeline</h2>
        <button
          type="button"
          className="text-[10px] text-primary transition hover:text-primary/80"
        >
          View pipeline
        </button>
      </header>

      <ul className="mt-2.5 flex flex-col gap-1">
        {pipelineStages.map((stage) => (
          <li key={stage.id} className="flex items-center">
            <div
              className="flex items-center justify-between rounded-md px-3 py-1.5 transition-[width] duration-500 ease-out"
              style={{
                width: `${stage.width}%`,
                background: `linear-gradient(90deg, ${stage.from}, ${stage.to})`,
              }}
            >
              <span className="truncate text-[10px] font-medium text-white/95 drop-shadow-sm">
                {stage.label}
              </span>
              <span className="ml-4 shrink-0 text-[10px] font-semibold text-white drop-shadow-sm">
                {stage.count.toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
