"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  Keyboard,
  Moon,
  Sun,
  Monitor,
  Check,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "language", label: "Language", icon: Globe },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
];

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
];

const accentColors = [
  { id: "indigo", color: "#6366f1" },
  { id: "violet", color: "#8b5cf6" },
  { id: "blue", color: "#3b82f6" },
  { id: "cyan", color: "#06b6d4" },
  { id: "green", color: "#22c55e" },
  { id: "orange", color: "#f59e0b" },
  { id: "rose", color: "#f43f5e" },
];

const notificationSettings = [
  { label: "Email notifications", description: "Receive email updates", enabled: true },
  { label: "Push notifications", description: "Browser push alerts", enabled: true },
  { label: "Task reminders", description: "Get notified before deadlines", enabled: true },
  { label: "Weekly digest", description: "Summary of your week", enabled: false },
  { label: "Marketing emails", description: "Product updates and tips", enabled: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedAccent, setSelectedAccent] = useState("indigo");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <LayoutGroup id="settings-tabs">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-1 lg:col-span-3 lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] lg:w-full",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="settings-active-tab"
                      className="pointer-events-none absolute inset-0 rounded-xl bg-primary/10 shadow-glow"
                      transition={{ type: "spring", stiffness: 460, damping: 36 }}
                    />
                  )}
                  <tab.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 lg:col-span-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                {activeTab === "profile" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">AK</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">Change Avatar</Button>
                          <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG or GIF. Max 2MB.
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">First name</label>
                          <Input defaultValue="Alex" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Last name</label>
                          <Input defaultValue="Kim" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <Input defaultValue="alex@orion.dev" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Role</label>
                        <div className="flex items-center gap-2">
                          <Input defaultValue="Product Engineer" disabled />
                          <Badge>Admin</Badge>
                        </div>
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "appearance" && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Theme</CardTitle>
                        <CardDescription>Choose your preferred color scheme</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {themes.map((theme) => (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => setSelectedTheme(theme.id)}
                              className={cn(
                                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                selectedTheme === theme.id
                                  ? "border-primary bg-primary/5 shadow-glow"
                                  : "border-border hover:border-primary/30"
                              )}
                            >
                              <theme.icon className="h-5 w-5" />
                              <span className="text-sm font-medium">{theme.label}</span>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Accent Color</CardTitle>
                        <CardDescription>Personalize your interface</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {accentColors.map((accent) => (
                            <button
                              key={accent.id}
                              type="button"
                              aria-label={`Use ${accent.id} accent color`}
                              onClick={() => setSelectedAccent(accent.id)}
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                selectedAccent === accent.id && "ring-2 ring-offset-2 ring-offset-background"
                              )}
                              style={{
                                backgroundColor: accent.color,
                                boxShadow: selectedAccent === accent.id
                                  ? `0 0 0 2px var(--color-background), 0 0 0 4px ${accent.color}`
                                  : undefined,
                              }}
                            >
                              {selectedAccent === accent.id && <Check className="h-4 w-4 text-white" />}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === "notifications" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Choose what you want to be notified about</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {notificationSettings.map((setting) => (
                        <div
                          key={setting.label}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div>
                            <p className="text-sm font-medium">{setting.label}</p>
                            <p className="text-xs text-muted-foreground">{setting.description}</p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Toggle ${setting.label}`}
                            className={cn(
                              "flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                              setting.enabled ? "bg-primary" : "bg-muted"
                            )}
                          >
                            <span
                              className={cn(
                                "h-5 w-5 rounded-full bg-white transition-transform",
                                setting.enabled && "translate-x-5"
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {activeTab !== "profile" &&
                  activeTab !== "appearance" &&
                  activeTab !== "notifications" && (
                    <Card>
                      <CardContent className="flex h-48 flex-col items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                          This section will be available in Phase 2.
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}
