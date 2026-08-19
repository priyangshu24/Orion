import { Workflow } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function AutomationsPage() {
  return (
    <ModulePlaceholder
      title="Automations"
      icon={Workflow}
      phase="Phase 6 · Enterprise"
      description="Event-driven workflow rules — trigger tasks, notifications and webhooks from CRM activity."
    />
  );
}
