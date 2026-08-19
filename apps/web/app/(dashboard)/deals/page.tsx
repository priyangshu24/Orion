import { BarChart3 } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function DealsPage() {
  return (
    <ModulePlaceholder
      title="Deals"
      icon={BarChart3}
      phase="Phase 3 · CRM Core"
      description="Pipeline management with stages, forecasting and win/loss analysis across your book of business."
    />
  );
}
