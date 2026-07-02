import { cn } from "@/shared/lib/utils";

type OrionLogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
};

export function OrionLogo({ className, markClassName, showWordmark = true }: OrionLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border border-primary/30 bg-background shadow-glow",
          "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.42),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.28),transparent_34%)]",
          markClassName
        )}
      >
        <svg
          aria-hidden="true"
          className="relative z-10 h-7 w-7 drop-shadow-[0_0_14px_rgba(99,102,241,0.75)]"
          viewBox="0 0 64 64"
          fill="none"
        >
          <path
            d="M32 10L37.8 25.4L54 31.9L37.8 38.6L32 54L26.2 38.6L10 31.9L26.2 25.4L32 10Z"
            fill="url(#orion-logo-gradient)"
          />
          <circle cx="32" cy="32" r="8" fill="#fafafa" fillOpacity="0.92" />
          <defs>
            <linearGradient id="orion-logo-gradient" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="0.55" stopColor="#6366f1" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showWordmark && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-tight text-foreground">OrionOS</p>
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-primary/80">Ask more</p>
        </div>
      )}
    </div>
  );
}