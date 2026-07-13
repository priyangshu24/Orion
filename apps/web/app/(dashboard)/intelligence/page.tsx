import { IntelligenceHub, type IntelligenceTab } from "@/features/intelligence";

export const metadata = {
  title: "Intelligence Hub — OrionOS",
};

const validTabs = new Set<IntelligenceTab>(["documents", "search", "ask"]);

export default async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; seed?: string }>;
}) {
  const { tab, seed } = await searchParams;
  const initialTab = validTabs.has(tab as IntelligenceTab) ? (tab as IntelligenceTab) : "documents";
  return <IntelligenceHub initialTab={initialTab} askSeed={seed} />;
}
