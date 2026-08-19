import Image from "next/image";
import { cn } from "@/shared/lib/utils";

type OrionLogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
};

/**
 * Brand lockup.
 *
 * Uses the real artwork rather than a redrawn SVG so the sidebar, the auth
 * screen and the README banner all render the same mark. `orion-logo-full.png`
 * already contains the wordmark and the "ASK MORE FROM CRM." strapline, so the
 * expanded state is a single image; the collapsed rail falls back to the
 * standalone symbol.
 */
export function OrionLogo({
  className,
  markClassName,
  showWordmark = true,
}: OrionLogoProps) {
  if (!showWordmark) {
    return (
      <div
        className={cn(
          "relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-primary/25 bg-[#070d1a]",
          markClassName
        )}
      >
        <Image
          src="/orion-symbol.png"
          alt="Orion"
          width={40}
          height={40}
          priority
          className="h-9 w-9 object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 items-center", className)}>
      <Image
        src="/orion-logo-full.png"
        alt="Orion — Ask more from CRM."
        width={330}
        height={110}
        priority
        className="h-[38px] w-auto max-w-full object-contain"
      />
    </div>
  );
}
