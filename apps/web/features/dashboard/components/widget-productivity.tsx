"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { productivityScore } from "../constants/mock-data";
import { TrendingUp } from "lucide-react";

export function WidgetProductivity() {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Productivity Score</CardTitle>
        <div className="flex items-center gap-1 text-xs text-success">
          <TrendingUp className="h-3 w-3" />
          +12%
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold tracking-tight gradient-text">
            {productivityScore}
          </span>
          <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <Progress value={productivityScore} />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Tasks Done", value: "18" },
            { label: "Focus Hours", value: "6.5h" },
            { label: "Streak", value: "7 days" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-muted/50 p-2 text-center"
            >
              <p className="text-sm font-semibold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
