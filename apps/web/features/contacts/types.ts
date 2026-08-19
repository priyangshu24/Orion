export type ContactStatus = "customer" | "prospect" | "partner";

export interface ContactRecord {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  companyId: string;
  owner: string;
  status: ContactStatus;
  tags: string[];
  lastContacted: string;
  createdAt: string;
  notes: string[];
}

export interface CompanyRecord {
  id: string;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  website: string;
  phone: string;
  headquarters: string;
  owner: string;
  status: ContactStatus;
  tags: string[];
  score: number;
  deals: number;
  dealValue: number;
  createdAt: string;
  notes: string[];
}

export interface ContactDraft {
  name: string;
  title: string;
  email: string;
  phone: string;
  companyId: string;
  owner: string;
  status: ContactStatus;
}

export interface CompanyDraft {
  name: string;
  industry: string;
  size: string;
  website: string;
  phone: string;
  headquarters: string;
  owner: string;
  status: ContactStatus;
}

export type RelationshipView = "contacts" | "companies";
