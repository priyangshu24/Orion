"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Sparkles, Send, Bot, User, Zap, Code, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const suggestions = [
  { label: "Summarize my tasks", icon: FileText },
  { label: "Generate a report", icon: BarChart3 },
  { label: "Write a code snippet", icon: Code },
  { label: "Plan my day", icon: Zap },
];

const mockConversation = [
  {
    role: "assistant" as const,
    content:
      "Hello Alex! I'm your OrionOS AI assistant. I can help you manage tasks, draft emails, analyze your productivity, and much more. What would you like to do?",
  },
  {
    role: "user" as const,
    content: "What are my most urgent tasks today?",
  },
  {
    role: "assistant" as const,
    content:
      "You have 2 urgent items today:\n\n1. **Set up CI/CD pipeline** — Due in 12 hours, currently in progress. This is tagged as devops and marked urgent.\n\n2. **Review design system tokens** — Due tomorrow, also in progress. Tagged as design and urgent.\n\nI'd recommend prioritizing the CI/CD pipeline since it has the tighter deadline. Would you like me to block time on your calendar for focused work on it?",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shadow-glow">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Powered by OrionOS Intelligence
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Chat */}
        <div className="col-span-8">
          <Card className="flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockConversation.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-[10px]",
                        msg.role === "assistant" && "bg-primary/10 text-primary"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <Bot className="h-3.5 w-3.5" />
                      ) : (
                        "AK"
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "assistant"
                        ? "bg-muted/50 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {msg.content.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                OrionOS AI can make mistakes. Verify important information.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Quick Prompts
              </p>
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-sm transition-all hover:bg-glass-hover hover:border-primary/30 hover:shadow-glow cursor-pointer"
                >
                  <s.icon className="h-4 w-4 text-primary" />
                  <span>{s.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Capabilities
              </p>
              {[
                "Task management & scheduling",
                "Email drafting & summarization",
                "Code generation & review",
                "Data analysis & reports",
                "Meeting notes & action items",
              ].map((cap) => (
                <div
                  key={cap}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {cap}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
