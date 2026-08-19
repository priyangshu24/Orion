"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bot, SendHorizontal } from "lucide-react";
import { aiSuggestions } from "../constants/crm-data";

export function AiAskPanel() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = value.trim();
    if (!prompt) {
      toast.error("Enter a question for Orion AI");
      return;
    }
    router.push(`/ai?prompt=${encodeURIComponent(prompt)}`);
    setValue("");
  }

  return (
    <section className="orion-panel flex flex-col p-3">
      <header className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
          <Bot className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-[13px] font-semibold text-foreground">AI Assistant</h2>
      </header>

      <p className="mt-2.5 text-[13px] font-medium text-foreground">
        How can I help you today?
      </p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">
        Ask anything about your data, leads, deals...
      </p>

      <form onSubmit={handleSubmit} className="mt-2">
        <div className="orion-glass-control flex items-center gap-2 rounded-lg px-3 py-2 transition focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_rgba(46,230,197,0.10)]">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask Orion AI..."
            aria-label="Ask Orion AI"
            className="min-w-0 flex-1 bg-transparent text-[10px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!value.trim()}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-primary transition hover:bg-primary/12 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {aiSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setValue(s)}
            className="rounded-md border border-border bg-foreground/[0.04] px-2 py-1 text-[9px] text-muted-foreground transition hover:border-primary/30 hover:bg-primary/8 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
}
