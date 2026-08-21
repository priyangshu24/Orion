"use client";

import { useRouter } from "next/navigation";
import { CompanyBrand } from "@/shared/components/company-brand";
import { topDeals, type DealStage } from "../constants/crm-data";

const STAGE_STYLES: Record<DealStage, string> = {
  Negotiation: "border-success/30 bg-success/12 text-success",
  Proposal: "border-info/30 bg-info/12 text-info",
  Qualification: "border-warning/30 bg-warning/12 text-warning",
};

export function TopDeals() {
  const router = useRouter();

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Top Deals</h2>
        <button
          type="button"
          onClick={() => router.push("/deals")}
          aria-label="View all deals"
          className="text-[10px] text-primary transition hover:text-primary/80"
        >
          View all
        </button>
      </header>

      <ul className="mt-2 flex flex-col">
        {topDeals.map((deal) => (
          <li key={deal.id}>
            <button
              type="button"
              onClick={() => router.push(`/deals?deal=${deal.id}`)}
              className="flex w-full items-center gap-1.5 rounded-lg px-1 py-1.5 text-left transition hover:bg-foreground/[0.04]"
              aria-label={`Open ${deal.company} deal`}
            >
            {/* basis-0 lets the name shrink below its content width before the
                amount or stage badge are allowed to compress. */}
            <CompanyBrand
              company={deal.company}
              className="min-w-0 flex-1 basis-0 gap-2 text-[11px] text-foreground"
              iconClassName="h-5 w-5 rounded"
            />
            <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-foreground">
              {deal.amount}
            </span>
            <span
              className={`shrink-0 whitespace-nowrap rounded border px-1.5 py-0.5 text-[9px] font-medium leading-[1.35] ${STAGE_STYLES[deal.stage]}`}
            >
              {deal.stage}
            </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
