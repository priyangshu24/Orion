"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useAppStore } from "@/store/app-store";
import { mainNavItems, secondaryNavItems } from "@/shared/constants/navigation";
import {
  FileText,
  Hash,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const quickActions = [
  { label: "Create new task", icon: FileText, action: "/tasks" },
  { label: "Ask Nova", icon: Sparkles, action: "/ai" },
  { label: "Go to calendar", icon: Hash, action: "/calendar" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key.toLowerCase() === "k" || e.code === "KeyK") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const state = useAppStore.getState();
        state.setCommandPaletteOpen(!state.commandPaletteOpen);
      }
    };
    window.addEventListener("keydown", down, { capture: true });
    return () => window.removeEventListener("keydown", down, { capture: true });
  }, []);

  if (!commandPaletteOpen) return null;

  const navigate = (href: string) => {
    router.push(href);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-surface-overlay backdrop-blur-sm"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="relative mx-auto mt-[20vh] max-w-lg">
        <Command className="overflow-hidden rounded-xl border border-border bg-card shadow-floating">
          <Command.Input
            placeholder="Type a command or search..."
            className="h-12 w-full border-b border-border bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Quick Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {quickActions.map((action) => (
                <Command.Item
                  key={action.label}
                  onSelect={() => navigate(action.action)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors aria-selected:bg-primary/10 aria-selected:text-primary"
                >
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{action.label}</span>
                  <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Navigation"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {[...mainNavItems, ...secondaryNavItems].map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors aria-selected:bg-primary/10 aria-selected:text-primary"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <p className="text-[10px] text-muted-foreground">
              Arrow keys to navigate - Enter to select - Escape to close
            </p>
          </div>
        </Command>
      </div>
    </div>
  );
}
