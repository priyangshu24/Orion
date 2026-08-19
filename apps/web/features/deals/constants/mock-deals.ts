import type { Deal, DealStage } from "../types";

export const dealStageOrder: DealStage[] = ["lead", "qualification", "proposal", "negotiation", "closed-won"];

export const dealStageMeta: Record<DealStage, { label: string; probability: number; color: string; className: string }> = {
  lead: { label: "Lead", probability: 0.1, color: "#2b8cff", className: "border-info/25 bg-info/10 text-info" },
  qualification: { label: "Qualification", probability: 0.3, color: "#f4a51c", className: "border-warning/25 bg-warning/10 text-warning" },
  proposal: { label: "Proposal", probability: 0.55, color: "#9b6cff", className: "border-[#9b6cff]/25 bg-[#9b6cff]/10 text-[#bca4ff]" },
  negotiation: { label: "Negotiation", probability: 0.75, color: "#ff8a1f", className: "border-[#ff8a1f]/25 bg-[#ff8a1f]/10 text-[#ffad5c]" },
  "closed-won": { label: "Closed Won", probability: 1, color: "#22c55e", className: "border-success/25 bg-success/10 text-success" },
};

export const dashboardStageMap: Record<string, DealStage> = {
  p1: "lead",
  p2: "qualification",
  p3: "proposal",
  p4: "negotiation",
  p5: "closed-won",
};

export const mockDeals: Deal[] = [
  { id: "d1", name: "Acme Enterprise Plan", description: "Enterprise CRM rollout", company: "Acme Corporation", stage: "qualification", value: 12500, closeDate: "2026-08-30", owner: "Alex Morgan", lastActivity: "Call with John Carter · 45m ago" },
  { id: "d2", name: "Globex Annual Subscription", description: "Annual platform subscription", company: "Globex Inc.", stage: "negotiation", value: 8750, closeDate: "2026-09-10", owner: "Priya Shah", lastActivity: "Pricing discussed · 2h ago" },
  { id: "d3", name: "Initech Workflow Suite", description: "Automation and reporting suite", company: "Initech", stage: "proposal", value: 6200, closeDate: "2026-09-05", owner: "Alex Morgan", lastActivity: "Proposal shared · 3h ago" },
  { id: "d4", name: "Umbrella Security Upgrade", description: "Security and compliance package", company: "Umbrella Corp.", stage: "closed-won", value: 5400, closeDate: "2026-08-18", owner: "Priya Shah", lastActivity: "Contract signed · 1d ago" },
  { id: "d5", name: "Stark Consulting Services", description: "Technical consulting engagement", company: "Stark Industries", stage: "proposal", value: 4900, closeDate: "2026-09-12", owner: "Priya Shah", lastActivity: "Demo completed · 1d ago" },
  { id: "d6", name: "BrightWave Solutions", description: "New customer acquisition", company: "BrightWave Solutions", stage: "lead", value: 8500, closeDate: "2026-08-25", owner: "Alex Morgan", lastActivity: "Email sent · 1h ago" },
  { id: "d7", name: "TechNova Implementation", description: "Implementation and onboarding", company: "TechNova Solutions", stage: "closed-won", value: 8500, closeDate: "2026-08-18", owner: "Priya Shah", lastActivity: "Deal won · 2d ago" },
  { id: "d8", name: "Soylent Product Line", description: "New product division", company: "Soylent Corp.", stage: "qualification", value: 6000, closeDate: "2026-09-15", owner: "Alex Morgan", lastActivity: "Initial discovery · 2d ago" },
  { id: "d9", name: "Wayne Pro Upgrade", description: "Upgrade to enterprise plan", company: "Wayne Enterprises", stage: "proposal", value: 15000, closeDate: "2026-09-05", owner: "Priya Shah", lastActivity: "Proposal shared · 3d ago" },
  { id: "d10", name: "Hooli Data Platform", description: "Unified analytics platform", company: "Hooli", stage: "lead", value: 22000, closeDate: "2026-09-22", owner: "Alex Morgan", lastActivity: "Lead captured · 3d ago" },
  { id: "d11", name: "Massive Dynamic Research", description: "Research collaboration", company: "Massive Dynamic", stage: "negotiation", value: 18000, closeDate: "2026-09-18", owner: "Priya Shah", lastActivity: "Legal review · 4d ago" },
  { id: "d12", name: "Wonka Distribution", description: "Distribution workflow modernization", company: "Wonka Industries", stage: "qualification", value: 11200, closeDate: "2026-09-28", owner: "Alex Morgan", lastActivity: "Discovery complete · 4d ago" },
  { id: "d13", name: "Tyrell Intelligence Cloud", description: "AI infrastructure subscription", company: "Tyrell Corp.", stage: "negotiation", value: 26000, closeDate: "2026-10-02", owner: "Priya Shah", lastActivity: "Security review · 5d ago" },
  { id: "d14", name: "Vandelay Export CRM", description: "Global sales workspace", company: "Vandelay Industries", stage: "lead", value: 7400, closeDate: "2026-09-30", owner: "Alex Morgan", lastActivity: "Intro scheduled · 5d ago" },
  { id: "d15", name: "Cyberdyne Automation", description: "Automation platform expansion", company: "Cyberdyne Systems", stage: "closed-won", value: 19800, closeDate: "2026-08-12", owner: "Priya Shah", lastActivity: "Onboarding started · 6d ago" },
  { id: "d16", name: "Oscorp Renewal", description: "Enterprise contract renewal", company: "Oscorp", stage: "proposal", value: 9800, closeDate: "2026-10-05", owner: "Alex Morgan", lastActivity: "Terms delivered · 6d ago" },
];
