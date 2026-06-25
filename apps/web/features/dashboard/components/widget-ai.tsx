"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { aiSuggestions } from "../constants/mock-data";
import { Sparkles, Lightbulb } from "lucide-react";

export function WidgetAI() {
  return (
    <Card className="group border-primary/20 hover:shadow-glow transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle>AI Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {aiSuggestions.map((suggestion, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg bg-primary/5 p-3 text-sm transition-colors hover:bg-primary/10 cursor-pointer"
          >
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs leading-relaxed">{suggestion}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
