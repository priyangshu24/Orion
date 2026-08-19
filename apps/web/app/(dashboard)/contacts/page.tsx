import { Contact } from "lucide-react";
import { ModulePlaceholder } from "@/shared/components/layout/module-placeholder";

export default function ContactsPage() {
  return (
    <ModulePlaceholder
      title="Contacts"
      icon={Contact}
      phase="Phase 3 · CRM Core"
      description="Every person you do business with, with activity timelines and custom fields."
    />
  );
}
