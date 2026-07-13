import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  Sparkles,
  Settings,
  BarChart3,
  Heart,
  Bell,
  Blocks,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tasks", href: "/tasks", icon: CheckSquare, badge: "12" },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Emails", href: "/emails", icon: Mail, badge: "3" },
  { label: "Nova", href: "/ai", icon: Sparkles },
  { label: "Intelligence", href: "/intelligence", icon: BrainCircuit },
  { label: "Connectors", href: "/connectors", icon: Blocks },
];

export const secondaryNavItems: NavItem[] = [
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Habits", href: "/habits", icon: Heart },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
