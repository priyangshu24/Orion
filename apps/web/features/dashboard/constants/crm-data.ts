import {
  Briefcase,
  DollarSign,
  Megaphone,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

/* Mock data for the CRM dashboard. Phase 2 replaces this file with typed
   clients under features/dashboard/services/ — the shapes below are written to
   match the eventual API responses so the swap stays mechanical. */

export interface StatCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: LucideIcon;
  /** Normalised 0-1 sparkline samples, oldest first. */
  spark: number[];
}

export const statCards: StatCard[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$24,890",
    delta: "12.5%",
    trend: "up",
    icon: DollarSign,
    spark: [0.30, 0.42, 0.35, 0.52, 0.46, 0.63, 0.58, 0.74, 0.69, 0.88, 0.82, 1.0],
  },
  {
    id: "leads",
    label: "New Leads",
    value: "1,293",
    delta: "8.2%",
    trend: "up",
    icon: UserPlus,
    spark: [0.42, 0.36, 0.50, 0.44, 0.58, 0.52, 0.66, 0.60, 0.76, 0.70, 0.86, 0.94],
  },
  {
    id: "conversion",
    label: "Conversion Rate",
    value: "24.6%",
    delta: "5.1%",
    trend: "up",
    icon: TrendingUp,
    spark: [0.50, 0.44, 0.56, 0.48, 0.62, 0.55, 0.68, 0.61, 0.74, 0.67, 0.82, 0.90],
  },
  {
    id: "deals",
    label: "Active Deals",
    value: "89",
    delta: "3.4%",
    trend: "up",
    icon: Briefcase,
    spark: [0.38, 0.48, 0.41, 0.55, 0.49, 0.60, 0.54, 0.68, 0.62, 0.78, 0.72, 0.86],
  },
];

/** Revenue series — one sample per day, labelled every 5th point. */
export const revenueSeries = [
  { label: "May 1", value: 13200 },
  { label: "May 2", value: 14100 },
  { label: "May 3", value: 13600 },
  { label: "May 4", value: 14900 },
  { label: "May 5", value: 15400 },
  { label: "May 6", value: 14600 },
  { label: "May 7", value: 13900 },
  { label: "May 8", value: 14400 },
  { label: "May 9", value: 15900 },
  { label: "May 10", value: 17200 },
  { label: "May 11", value: 16600 },
  { label: "May 12", value: 15800 },
  { label: "May 13", value: 16900 },
  { label: "May 14", value: 18400 },
  { label: "May 15", value: 19100 },
  { label: "May 16", value: 18600 },
  { label: "May 17", value: 19800 },
  { label: "May 18", value: 21400 },
  { label: "May 19", value: 23100 },
  { label: "May 20", value: 24890 },
];

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  title: string;
  time: string;
  tone: "teal" | "green" | "gold" | "pink" | "blue";
}

export const recentActivity: ActivityItem[] = [
  { id: "a1", icon: UserPlus, title: "New lead: Acme Corp", time: "2m ago", tone: "teal" },
  { id: "a2", icon: DollarSign, title: "Deal closed: $5,400", time: "15m ago", tone: "green" },
  { id: "a3", icon: Briefcase, title: "New task assigned", time: "1h ago", tone: "gold" },
  { id: "a4", icon: Megaphone, title: "Campaign launched", time: "3h ago", tone: "pink" },
  { id: "a5", icon: Users, title: "Report generated", time: "5h ago", tone: "blue" },
];

export type DealStage = "Negotiation" | "Proposal" | "Qualification";

export interface Deal {
  id: string;
  company: string;
  amount: string;
  stage: DealStage;
}

export const topDeals: Deal[] = [
  { id: "d1", company: "Acme Corporation", amount: "$12,500", stage: "Negotiation" },
  { id: "d2", company: "Globex Inc.", amount: "$8,750", stage: "Proposal" },
  { id: "d3", company: "Initech", amount: "$6,200", stage: "Qualification" },
  { id: "d4", company: "Umbrella Corp.", amount: "$5,400", stage: "Negotiation" },
  { id: "d5", company: "Stark Industries", amount: "$4,900", stage: "Proposal" },
];

export interface DashboardTask {
  id: string;
  title: string;
  due: string;
  done: boolean;
}

export const dashboardTasks: DashboardTask[] = [
  { id: "t1", title: "Follow up with Acme Corp", due: "Today", done: false },
  { id: "t2", title: "Prepare proposal for Globex", due: "Tomorrow", done: false },
  { id: "t3", title: "Team meeting", due: "May 22", done: false },
  { id: "t4", title: "Review campaign results", due: "May 23", done: false },
  { id: "t5", title: "Quarterly report", due: "May 25", done: false },
];

export interface PipelineStage {
  id: string;
  label: string;
  count: number;
  /** Bar width as a percentage of the widest stage. */
  width: number;
  from: string;
  to: string;
}

export const pipelineStages: PipelineStage[] = [
  { id: "p1", label: "Lead", count: 1240, width: 100, from: "#2b7fd4", to: "#3ba4e8" },
  { id: "p2", label: "Qualified", count: 820, width: 90, from: "#1f9ec4", to: "#2fc7c2" },
  { id: "p3", label: "Proposal", count: 320, width: 80, from: "#8f9d3c", to: "#c9c04a" },
  { id: "p4", label: "Negotiation", count: 120, width: 70, from: "#d08a2c", to: "#e8a93c" },
  { id: "p5", label: "Closed Won", count: 89, width: 60, from: "#1f9d55", to: "#35c46e" },
];

export const aiSuggestions = [
  "Show me leads by source",
  "What's my forecast?",
  "Top performing campaigns",
];

export interface Integration {
  id: string;
  name: string;
  /** Local brand artwork keeps the dashboard independent of remote CDNs. */
  logo: string;
}

export const integrations: Integration[] = [
  { id: "i1", name: "Google", logo: "/integrations/google.svg" },
  { id: "i2", name: "Slack", logo: "/integrations/slack.svg" },
  { id: "i3", name: "Outlook", logo: "/integrations/outlook.svg" },
  { id: "i4", name: "Mailchimp", logo: "/integrations/mailchimp.svg" },
  { id: "i5", name: "HubSpot", logo: "/integrations/hubspot.svg" },
  { id: "i6", name: "Skype", logo: "/integrations/skype.svg" },
  { id: "i7", name: "Zoom", logo: "/integrations/zoom.svg" },
];
