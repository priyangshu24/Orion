import {
  FileText,
  Receipt,
  ShieldCheck,
  BarChart3,
  Table2,
  Mail,
  File,
  UploadCloud,
  ScanLine,
  FileSearch,
  Scissors,
  Braces,
  DatabaseZap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type {
  DocType,
  DocumentStatus,
  EntityType,
  PipelineStageKey,
} from "../types";

export const pill =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1";

export const statusMeta: Record<
  DocumentStatus,
  { label: string; dot: string; cls: string; pulse?: boolean }
> = {
  uploaded: { label: "Uploaded", dot: "bg-zinc-400", cls: "bg-foreground/[0.06] text-muted-foreground ring-foreground/15" },
  scanning: { label: "Scanning", dot: "bg-sky-400", cls: "bg-sky-500/10 text-sky-300 ring-sky-500/25", pulse: true },
  processing: { label: "Processing", dot: "bg-violet-400", cls: "bg-violet-500/10 text-violet-300 ring-violet-500/25", pulse: true },
  indexed: { label: "Indexed", dot: "bg-emerald-400", cls: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25" },
  failed: { label: "Failed", dot: "bg-rose-400", cls: "bg-rose-500/10 text-rose-300 ring-rose-500/25" },
  quarantined: { label: "Quarantined", dot: "bg-amber-400", cls: "bg-amber-500/10 text-amber-300 ring-amber-500/25" },
};

export const docTypeMeta: Record<
  DocType,
  { label: string; icon: LucideIcon; cls: string }
> = {
  contract: { label: "Contract", icon: FileText, cls: "text-violet-300 bg-violet-500/15" },
  invoice: { label: "Invoice", icon: Receipt, cls: "text-emerald-300 bg-emerald-500/15" },
  policy: { label: "Policy", icon: ShieldCheck, cls: "text-sky-300 bg-sky-500/15" },
  report: { label: "Report", icon: BarChart3, cls: "text-amber-300 bg-amber-500/15" },
  spreadsheet: { label: "Spreadsheet", icon: Table2, cls: "text-teal-300 bg-teal-500/15" },
  email: { label: "Email", icon: Mail, cls: "text-pink-300 bg-pink-500/15" },
  other: { label: "Other", icon: File, cls: "text-muted-foreground bg-foreground/10" },
};

export const entityTypeLabel: Record<EntityType, string> = {
  person: "Person",
  org: "Organization",
  date: "Date",
  amount: "Amount",
  obligation: "Obligation",
};

export const pipelineStages: { key: PipelineStageKey; label: string; icon: LucideIcon }[] = [
  { key: "upload", label: "Upload", icon: UploadCloud },
  { key: "scan", label: "Security scan", icon: ScanLine },
  { key: "extract", label: "Extraction", icon: FileSearch },
  { key: "chunk", label: "Chunking", icon: Scissors },
  { key: "embed", label: "Embedding", icon: Braces },
  { key: "index", label: "Indexed", icon: DatabaseZap },
];

/** Highest pipeline stage index reached for a given document status. */
export function stageProgress(status: DocumentStatus): number {
  switch (status) {
    case "uploaded":
      return 0;
    case "scanning":
      return 1;
    case "quarantined":
      return 1;
    case "processing":
      return 3;
    case "failed":
      return 2;
    case "indexed":
      return 5;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function RiskBadge({ score }: { score?: number }) {
  if (score === undefined) return null;
  const tone =
    score >= 60
      ? "bg-rose-500/10 text-rose-300 ring-rose-500/25"
      : score >= 35
        ? "bg-amber-500/10 text-amber-300 ring-amber-500/25"
        : "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25";
  return <span className={cn(pill, tone)}>Risk {score}</span>;
}
