import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { BarChart3, TrendingUp, Clock, Target, Zap } from "lucide-react";

const metrics = [
  { label: "Focus hours", value: "31.5h", delta: "+12%", icon: Clock },
  { label: "Tasks completed", value: "84", delta: "+18%", icon: Target },
  { label: "AI assists", value: "126", delta: "+24%", icon: Zap },
  { label: "Productivity", value: "87%", delta: "+6%", icon: TrendingUp },
];

const weekly = [52, 64, 58, 76, 91, 83, 87];
const drivers = [
  "Deep work blocks protected across 4 weekdays",
  "Email triage time down 22% from last week",
  "AI suggestions accepted for 18 task updates",
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Understand focus, execution, and team momentum with mock insights.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <metric.icon className="h-4 w-4 text-primary" />
                <Badge variant="secondary" className="text-[10px] text-success">{metric.delta}</Badge>
              </div>
              <p className="mt-5 text-2xl font-bold tracking-tight">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Weekly productivity trend</CardTitle>
            <CardDescription>Mock score by day, designed for Phase 2 chart integration.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-3 rounded-2xl border border-border/60 bg-glass p-4">
              {weekly.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary/60 to-primary shadow-glow transition-all hover:from-primary hover:to-violet-400"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Key drivers</CardTitle>
            <CardDescription>What moved the score this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {drivers.map((driver, index) => (
              <div key={driver} className="flex gap-3 rounded-xl border border-border/60 bg-glass p-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{driver}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
