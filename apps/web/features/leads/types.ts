export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export type LeadSource = "Website" | "LinkedIn" | "Referral" | "Cold Call" | "Event";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  score: number;
  source: LeadSource;
  owner: string;
  createdAt: string;
}

export type LeadSortKey = "name" | "company" | "status" | "score" | "source" | "createdAt";

export type LeadColumn = "company" | "status" | "score" | "source" | "owner" | "createdAt";

export interface LeadDraft {
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  score: number;
  source: LeadSource;
}
