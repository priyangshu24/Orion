"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  Sparkles,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface DockItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
}

const dockItems: DockItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/emails", icon: Mail, label: "Emails", badge: "3" },
  { href: "/ai", icon: Sparkles, label: "Nova" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
];

export function BottomDock() {
  const pathname = usePathname();

  return (
    <nav className="floating-liquid-nav pointer-events-auto fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 shadow-floating">
      {dockItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={cn(
              "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 active:scale-95",
              isActive
                ? "neon-active text-white"
                : "text-indigo-200/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.badge && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-glow">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}