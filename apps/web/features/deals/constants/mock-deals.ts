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
  { id: "d1", name: "Apple Enterprise Plan", description: "Enterprise CRM rollout", company: "Apple", stage: "qualification", value: 12500, closeDate: "2026-08-30", owner: "Alex Morgan", lastActivity: "Call with John Carter · 45m ago" },
  { id: "d2", name: "Google Annual Subscription", description: "Annual platform subscription", company: "Google", stage: "negotiation", value: 8750, closeDate: "2026-09-10", owner: "Priya Shah", lastActivity: "Pricing discussed · 2h ago" },
  { id: "d3", name: "Microsoft Workflow Suite", description: "Automation and reporting suite", company: "Microsoft", stage: "proposal", value: 6200, closeDate: "2026-09-05", owner: "Alex Morgan", lastActivity: "Proposal shared · 3h ago" },
  { id: "d4", name: "Pfizer Security Upgrade", description: "Security and compliance package", company: "Pfizer", stage: "closed-won", value: 5400, closeDate: "2026-08-18", owner: "Priya Shah", lastActivity: "Contract signed · 1d ago" },
  { id: "d5", name: "Tesla Consulting Services", description: "Technical consulting engagement", company: "Tesla", stage: "proposal", value: 4900, closeDate: "2026-09-12", owner: "Priya Shah", lastActivity: "Demo completed · 1d ago" },
  { id: "d6", name: "Zoom", description: "New customer acquisition", company: "Zoom", stage: "lead", value: 8500, closeDate: "2026-08-25", owner: "Alex Morgan", lastActivity: "Email sent · 1h ago" },
  { id: "d7", name: "Oracle Implementation", description: "Implementation and onboarding", company: "Oracle", stage: "closed-won", value: 8500, closeDate: "2026-08-18", owner: "Priya Shah", lastActivity: "Deal won · 2d ago" },
  { id: "d8", name: "Intel Product Line", description: "New product division", company: "Intel", stage: "qualification", value: 6000, closeDate: "2026-09-15", owner: "Alex Morgan", lastActivity: "Initial discovery · 2d ago" },
  { id: "d9", name: "Amazon Pro Upgrade", description: "Upgrade to enterprise plan", company: "Amazon", stage: "proposal", value: 15000, closeDate: "2026-09-05", owner: "Priya Shah", lastActivity: "Proposal shared · 3d ago" },
  { id: "d10", name: "IBM Data Platform", description: "Unified analytics platform", company: "IBM", stage: "lead", value: 22000, closeDate: "2026-09-22", owner: "Alex Morgan", lastActivity: "Lead captured · 3d ago" },
  { id: "d11", name: "Adobe Research", description: "Research collaboration", company: "Adobe", stage: "negotiation", value: 18000, closeDate: "2026-09-18", owner: "Priya Shah", lastActivity: "Legal review · 4d ago" },
  { id: "d12", name: "Netflix Distribution", description: "Distribution workflow modernization", company: "Netflix", stage: "qualification", value: 11200, closeDate: "2026-09-28", owner: "Alex Morgan", lastActivity: "Discovery complete · 4d ago" },
  { id: "d13", name: "Samsung Intelligence Cloud", description: "AI infrastructure subscription", company: "Samsung", stage: "negotiation", value: 26000, closeDate: "2026-10-02", owner: "Priya Shah", lastActivity: "Security review · 5d ago" },
  { id: "d14", name: "Dell Export CRM", description: "Global sales workspace", company: "Dell", stage: "lead", value: 7400, closeDate: "2026-09-30", owner: "Alex Morgan", lastActivity: "Intro scheduled · 5d ago" },
  { id: "d15", name: "NVIDIA Automation", description: "Automation platform expansion", company: "NVIDIA", stage: "closed-won", value: 19800, closeDate: "2026-08-12", owner: "Priya Shah", lastActivity: "Onboarding started · 6d ago" },
  { id: "d16", name: "Moderna Renewal", description: "Enterprise contract renewal", company: "Moderna", stage: "proposal", value: 9800, closeDate: "2026-10-05", owner: "Alex Morgan", lastActivity: "Terms delivered · 6d ago" },
];
