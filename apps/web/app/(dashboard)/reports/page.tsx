import { BarChart3 } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports"
      icon={BarChart3}
      phase="Phase 6 · Enterprise"
      description="Build, schedule and share reports across pipeline, revenue and team performance."
    />
  );
}
