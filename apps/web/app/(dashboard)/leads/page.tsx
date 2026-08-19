import { Target } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function LeadsPage() {
  return (
    <ModulePlaceholder
      title="Leads"
      icon={Target}
      phase="Phase 3 · CRM Core"
      description="Capture, score and route inbound leads, with source attribution and conversion tracking."
    />
  );
}
