"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/store/app-store";
import { mainNavItems, secondaryNavItems, type NavItem } from "@/shared/constants/navigation";
import { OrionLogo } from "@/shared/components/layout/orion-logo";
import { ArrowRight, Building2, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  // Match nested routes too, so /intelligence/[id] keeps its parent highlighted.
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200",
        isActive
          ? "orion-nav-active"
          : "text-sidebar-foreground hover:bg-foreground/[0.06] hover:text-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && (
        <>
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, sidebarCollapsed, toggleSidebarCollapse, setSidebarOpen } =
    useAppStore();

  const [toolsOpen, setToolsOpen] = useState(() =>
    secondaryNavItems.some(
      (i) => pathname === i.href || pathname.startsWith(`${i.href}/`)
    )
  );

  const close = () => setSidebarOpen(false);

  return (
    <>
      <aside
        className={cn(
          "orion-dashboard-sidebar relative z-40 flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-2xl transition-[width,transform] duration-300 ease-out",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 lg:translate-x-0",
          sidebarCollapsed ? "w-[76px]" : "w-[228px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
        )}
      >
        <div
          className={cn(
            "flex h-[56px] shrink-0 items-center px-4",
            sidebarCollapsed && "justify-center px-0"
          )}
        >
          <OrionLogo showWordmark={!sidebarCollapsed} />
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          <ul className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} collapsed={sidebarCollapsed} onNavigate={close} />
              </li>
            ))}
          </ul>

          <div className="my-3 h-px bg-sidebar-border" />

          {/* Workspace tooling is collapsed by default so the ten primary CRM
              destinations fit without scrolling on a 900px-tall window. It
              auto-opens when one of its routes is active. */}
          {sidebarCollapsed ? (
            <ul className="flex flex-col gap-1">
              {secondaryNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} collapsed onNavigate={close} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setToolsOpen((v) => !v)}
                aria-expanded={toolsOpen}
                className="flex w-full items-center gap-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 transition hover:text-foreground"
              >
                Workspace
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 transition-transform duration-200",
                    !toolsOpen && "-rotate-90"
                  )}
                />
              </button>
              {toolsOpen && (
                <ul className="mt-1 flex flex-col gap-1">
                  {secondaryNavItems.map((item) => (
                    <li key={item.href}>
                      <NavLink item={item} collapsed={false} onNavigate={close} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </nav>

        {/* Upgrade card — hidden when collapsed, there is no legible short form. */}
        {!sidebarCollapsed && (
          <div className="shrink-0 px-3 pb-2">
            <div className="rounded-xl border border-warning/20 bg-gradient-to-b from-warning/[0.10] to-transparent p-3">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-warning" />
                Upgrade Plan
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Unlock premium features and grow your business.
              </p>
              <button
                type="button"
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-[12px] font-semibold text-primary-foreground shadow-[0_6px_18px_rgba(46,230,197,0.24)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Upgrade Now
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="shrink-0 px-3 pb-3">
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl border border-border bg-foreground/[0.04] p-2 text-left transition hover:bg-foreground/[0.08]",
              sidebarCollapsed && "justify-center p-2"
            )}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </span>
            {!sidebarCollapsed && (
              <>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block text-[10px] text-muted-foreground">Workspace</span>
                  <span className="block truncate text-[12px] font-medium text-foreground">
                    Orion Solutions
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </>
            )}
          </button>

          <div className="mt-2 flex items-center justify-between gap-2">
            {!sidebarCollapsed && (
              <p className="truncate pl-1 text-[10px] text-muted-foreground/70">
                © 2026 Orion CRM
              </p>
            )}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.08] hover:text-foreground max-lg:hidden",
                sidebarCollapsed && "mx-auto"
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={close}
        />
      )}
    </>
  );
}
