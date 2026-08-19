import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

/**
 * Stand-in for CRM modules whose UI arrives in Phase 3.
 *
 * These routes exist so every sidebar destination resolves — a nav item that
 * 404s is worse than one that states its status plainly.
 */
export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  phase,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
}) {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="orion-panel max-w-md p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>

        <span className="mt-4 inline-block rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-[11px] font-medium text-warning">
          {phase}
        </span>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.05] px-4 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-foreground/[0.09]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
