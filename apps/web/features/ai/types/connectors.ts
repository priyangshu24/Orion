export type ConnectorCategory =
  | "communication"
  | "project-management"
  | "code"
  | "calendar"
  | "documents"
  | "crm"
  | "storage";

export type ConnectorStatus = "connected" | "available" | "needs_attention";

export interface AIConnector {
  id: string;
  name: string;
  description: string;
  category: ConnectorCategory;
  status: ConnectorStatus;
  syncState: "live" | "scheduled" | "paused";
  lastSynced: string;
  objects: string[];
  permissions: string[];
  automations: string[];
  gradient: string;
}