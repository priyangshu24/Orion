export type DealStage = "lead" | "qualification" | "proposal" | "negotiation" | "closed-won";

export interface Deal {
  id: string;
  name: string;
  description: string;
  company: string;
  stage: DealStage;
  value: number;
  closeDate: string;
  owner: string;
  lastActivity: string;
}

export interface DealDraft {
  name: string;
  description: string;
  company: string;
  stage: DealStage;
  value: number;
  closeDate: string;
  owner: string;
}

export type DealSortKey = "name" | "company" | "stage" | "value" | "closeDate" | "owner";
