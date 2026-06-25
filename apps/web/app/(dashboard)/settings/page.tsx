"use client";

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
import { useState } from "react";

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

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-glass-hover hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-9 space-y-6">
          {activeTab === "profile" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                      <p className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        First name
                      </label>
                      <Input defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Last name
                      </label>
                      <Input defaultValue="Kim" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Email
                    </label>
                    <Input defaultValue="alex@orion.dev" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Role
                    </label>
                    <div className="flex items-center gap-2">
                      <Input defaultValue="Product Engineer" disabled />
                      <Badge>Admin</Badge>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Choose your preferred color scheme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                          selectedTheme === theme.id
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-border hover:border-primary/30"
                        )}
                      >
                        <theme.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accent Color</CardTitle>
                  <CardDescription>
                    Personalize your interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {accentColors.map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => setSelectedAccent(accent.id)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                          selectedAccent === accent.id &&
                            "ring-2 ring-offset-2 ring-offset-background"
                        )}
                        style={{
                          backgroundColor: accent.color,
                          ringColor: accent.color,
                        }}
                      >
                        {selectedAccent === accent.id && (
                          <Check className="h-4 w-4 text-white" />
                        )}
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
                <CardDescription>
                  Choose what you want to be notified about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{setting.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 transition-colors",
                        setting.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full bg-white transition-transform",
                          setting.enabled && "translate-x-5"
                        )}
                      />
                    </div>
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
        </div>
      </div>
    </div>
  );
}
