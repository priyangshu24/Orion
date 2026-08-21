"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/shared/lib/utils";

/**
 * Company brand marks.
 *
 * Logos are real SVGs committed under `public/logos`, not fetched at runtime.
 * An earlier version called `/api/brand-logo` (Brandfetch) on every render:
 * that key now returns 403, so every tile fell back to a letter, and even with
 * a working key it cost a third-party round trip per company and broke offline.
 * Local files render instantly and cannot fail.
 *
 * `logo: null` means no usable mark exists for that brand in any open logo set
 * (Simple Icons dropped most large trademarks; gilbarbara and vectorlogo.zone
 * do not carry these three). Those render as a letter tile in the brand colour,
 * which is still recognisably that company rather than a grey blank.
 */
type Brand = {
  name: string;
  /** File under public/logos, or null when no official mark is available. */
  logo: string | null;
  /** Brand colour, used by the letter tile and as the logo tile's backdrop. */
  color: string;
  fallback: string;
};

const brands: Record<string, Brand> = {
  Apple: { name: "Apple", logo: "apple", color: "#000000", fallback: "A" },
  Google: { name: "Google", logo: "google", color: "#4285F4", fallback: "G" },
  Microsoft: { name: "Microsoft", logo: "microsoft", color: "#F25022", fallback: "M" },
  Amazon: { name: "Amazon", logo: "amazon", color: "#FF9900", fallback: "a" },
  NVIDIA: { name: "NVIDIA", logo: "nvidia", color: "#76B900", fallback: "N" },
  Tesla: { name: "Tesla", logo: "tesla", color: "#CC0000", fallback: "T" },
  Adobe: { name: "Adobe", logo: "adobe", color: "#FF0000", fallback: "A" },
  Salesforce: { name: "Salesforce", logo: "salesforce", color: "#00A1E0", fallback: "S" },
  Cisco: { name: "Cisco", logo: "cisco", color: "#1BA0D7", fallback: "C" },
  Zoom: { name: "Zoom", logo: "zoom", color: "#0B5CFF", fallback: "Z" },
  Intel: { name: "Intel", logo: "intel", color: "#0071C5", fallback: "I" },
  IBM: { name: "IBM", logo: "ibm", color: "#0F62FE", fallback: "I" },
  Netflix: { name: "Netflix", logo: "netflix", color: "#E50914", fallback: "N" },
  Samsung: { name: "Samsung", logo: "samsung", color: "#1428A0", fallback: "S" },
  Dell: { name: "Dell", logo: "dell", color: "#007DB8", fallback: "D" },
  Visa: { name: "Visa", logo: "visa", color: "#1A1F71", fallback: "V" },
  Oracle: { name: "Oracle", logo: "oracle", color: "#C74634", fallback: "O" },
  Pfizer: { name: "Pfizer", logo: null, color: "#0093D0", fallback: "P" },
  Moderna: { name: "Moderna", logo: null, color: "#E1261C", fallback: "M" },
  Flipkart: { name: "Flipkart", logo: null, color: "#2874F0", fallback: "F" },
};

const normalizedBrands = new Map(
  Object.entries(brands).map(([company, brand]) => [
    company.replace(/[^a-z0-9]/gi, "").toLowerCase(),
    brand,
  ]),
);

export function companyLogoStorageKey(company: string) {
  return `orion-company-logo:${company.trim().replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
}

function subscribeToCompanyLogos(onStoreChange: () => void) {
  window.addEventListener("orion-company-logo-updated", onStoreChange);
  return () => window.removeEventListener("orion-company-logo-updated", onStoreChange);
}

function brandFor(company: string) {
  const normalized = company.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return (
    normalizedBrands.get(normalized) ??
    normalizedBrands.get(
      normalized.replace(/(incorporated|inc|corporation|corp|limited|ltd|llc|company|co)$/, ""),
    )
  );
}

export function companyDisplayName(company: string) {
  return brandFor(company)?.name ?? company;
}

export function CompanyBrand({
  company,
  className,
  iconClassName,
  showName = true,
}: {
  company: string;
  /**
   * Accepted and ignored. Logos used to be looked up by domain through
   * /api/brand-logo; they are local files now, so the domain buys nothing.
   * Kept in the signature so existing call sites keep compiling.
   */
  domain?: string;
  className?: string;
  iconClassName?: string;
  showName?: boolean;
}) {
  const brand = brandFor(company);
  const name = brand?.name ?? company;
  // A logo the user pinned themselves always wins over the bundled one.
  const customLogoUrl = useSyncExternalStore(
    subscribeToCompanyLogos,
    () => localStorage.getItem(companyLogoStorageKey(company)),
    () => null,
  );
  const src = customLogoUrl ?? (brand?.logo ? `/logos/${brand.logo}.svg` : null);

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md",
          src ? "bg-white p-1" : "",
          iconClassName,
        )}
        style={src ? undefined : { backgroundColor: brand?.color ?? "#334155" }}
        aria-hidden="true"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="h-full w-full object-contain"
            onError={() => {
              if (!customLogoUrl) return;
              localStorage.removeItem(companyLogoStorageKey(company));
              window.dispatchEvent(new Event("orion-company-logo-updated"));
            }}
          />
        ) : (
          <span className="text-[12px] font-bold text-white">
            {brand?.fallback ?? name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
      {showName ? <span className="truncate">{name}</span> : null}
    </span>
  );
}
