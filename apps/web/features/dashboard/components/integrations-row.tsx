"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { integrations } from "../constants/crm-data";

export function IntegrationsRow() {
  const router = useRouter();

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-foreground">Integrations</h2>
        <button
          type="button"
          onClick={() => router.push("/connectors")}
          aria-label="View all integrations"
          className="text-[10px] text-primary transition hover:text-primary/80"
        >
          View all
        </button>
      </header>

      <ul className="mt-2.5 flex flex-wrap items-center gap-2.5">
        {integrations.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              onClick={() => router.push(`/connectors?connector=${app.id}`)}
              title={app.name}
              aria-label={app.name}
              className="orion-glass-control grid h-9 w-9 place-items-center rounded-lg transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-foreground/[0.09]"
            >
              <Image
                src={app.logo}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] object-contain"
              />
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => router.push("/connectors?action=add")}
            aria-label="Add integration"
            className="grid h-9 w-9 place-items-center rounded-lg border border-dashed border-border bg-transparent text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </section>
  );
}
