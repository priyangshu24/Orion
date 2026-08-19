import {
  BarChart3,
  Bell,
  Blocks,
  BrainCircuit,
  Calendar,
  CheckSquare,
  Contact,
  Heart,
  LayoutDashboard,
  Mail,
  Settings,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

/** Primary CRM destinations — the sidebar's main group. */
export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Target },
  { label: "Deals", href: "/deals", icon: BarChart3 },
  { label: "Contacts & Companies", href: "/contacts", icon: Contact },
  { label: "Tasks", href: "/tasks", icon: CheckSquare, badge: "12" },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Automations", href: "/automations", icon: Workflow },
  { label: "AI Assistant", href: "/ai", icon: Sparkles },
];

/** Workspace tooling — secondary group, keeps every route reachable. */
export const secondaryNavItems: NavItem[] = [
  { label: "Intelligence", href: "/intelligence", icon: BrainCircuit },
  { label: "Emails", href: "/emails", icon: Mail, badge: "3" },
  { label: "Connectors", href: "/connectors", icon: Blocks },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Habits", href: "/habits", icon: Heart },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
