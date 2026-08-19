import { Building2 } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function CompaniesPage() {
  return (
    <ModulePlaceholder
      title="Companies"
      icon={Building2}
      phase="Phase 3 · CRM Core"
      description="Account records linking contacts, deals and documents into a single organisational view."
    />
  );
}
