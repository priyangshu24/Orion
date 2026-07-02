"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";

/* Full-color official brand logos (gilbarbara/logos via jsDelivr). */
const CDN = "https://cdn.jsdelivr.net/gh/gilbarbara/logos/logos/";

const logoSlug: Record<string, string> = {
  slack: "slack-icon",
  jira: "jira",
  github: "github-icon",
  "google-calendar": "google-calendar",
  "google-meet": "google-meet",
  gmail: "google-gmail",
  notion: "notion-icon",
  hubspot: "hubspot",
  "google-drive": "google-drive",
  linear: "linear-icon",
  salesforce: "salesforce",
  "microsoft-teams": "microsoft-teams",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

interface BrandLogoProps {
  id: string;
  name: string;
  gradient?: string;
  /** Tile sizing/rounding classes, e.g. "h-10 w-10 rounded-xl". */
  className?: string;
  imgSize?: number;
}

export function BrandLogo({ id, name, gradient, className, imgSize = 24 }: BrandLogoProps) {
  const slug = logoSlug[id];
  const [errored, setErrored] = useState(false);
  const base = cn("flex shrink-0 items-center justify-center overflow-hidden", className);

  if (slug && !errored) {
    return (
      <div className={cn(base, "bg-white shadow-[0_6px_18px_rgba(0,0,0,0.18)] ring-1 ring-black/5")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${CDN}${slug}.svg`}
          alt={`${name} logo`}
          width={imgSize}
          height={imgSize}
          loading="lazy"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn(base, "bg-gradient-to-br text-sm font-bold text-white ring-1 ring-white/15", gradient)}>
      {initials(name)}
    </div>
  );
}
