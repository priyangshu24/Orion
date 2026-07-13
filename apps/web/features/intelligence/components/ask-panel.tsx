"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, FileText, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { cannedAnswers, fallbackAnswer } from "../constants/data";
import type { IntelChatMessage } from "../types";
import { pill } from "./meta";

const starters = [
  "What renewals are coming up?",
  "What's our liability exposure with Acme?",
  "Which invoices are due this month?",
  "Summarize our data retention rules",
];

function pickAnswer(question: string) {
  const q = question.toLowerCase();
  return (
    cannedAnswers.find((a) => a.keywords.some((k) => q.includes(k))) ??
    fallbackAnswer
  );
}

export function AskPanel({ seed }: { seed?: string }) {
  const [messages, setMessages] = useState<IntelChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seenSeed = useRef<string | null>(null);

  useEffect(() => () => { if (interval.current) clearInterval(interval.current); }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setInput("");
    setBusy(true);

    const userMsg: IntelChatMessage = { id: `m-${Date.now()}-u`, role: "user", content: trimmed };
    const assistantId = `m-${Date.now()}-a`;
    setMessages((m) => [
      ...m,
      userMsg,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    const { answer, citations } = pickAnswer(trimmed);
    const words = answer.split(" ");
    let i = 0;

    interval.current = setInterval(() => {
      i += 3;
      const done = i >= words.length;
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: words.slice(0, i).join(" "),
                streaming: !done,
                citations: done ? citations : undefined,
              }
            : msg
        )
      );
      if (done) {
        if (interval.current) clearInterval(interval.current);
        setBusy(false);
      }
    }, 45);
  }

  useEffect(() => {
    if (seed && seed !== seenSeed.current) {
      seenSeed.current = seed;
      send(seed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div className="neon-panel flex h-[560px] flex-col overflow-hidden rounded-3xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-foreground/10 px-5 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-glow">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">Ask your documents</p>
          <p className="text-[11px] text-muted-foreground">
            Answers grounded in indexed content, with page-level citations
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Ask a question and Nova retrieves the most relevant passages from your knowledge
              base before answering — every claim linked back to its source.
            </p>
            <div className="flex max-w-md flex-wrap justify-center gap-2">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className={cn(pill, "bg-foreground/[0.05] text-muted-foreground ring-foreground/10 transition-colors hover:text-foreground")}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm text-white shadow-glow">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col gap-2.5">
                  <div className="max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md bg-foreground/[0.05] px-4 py-3 text-sm leading-relaxed ring-1 ring-foreground/10">
                    {msg.content}
                    {msg.streaming && (
                      <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-violet-400 align-middle" />
                    )}
                  </div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-col gap-1.5 pl-1">
                      {msg.citations.map((c) => (
                        <div
                          key={c.index}
                          className="flex items-start gap-2 rounded-xl bg-foreground/[0.03] px-3 py-2 ring-1 ring-foreground/10"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-mono text-[9px] font-bold text-violet-300">
                            {c.index}
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 truncate text-[11px] font-medium">
                              <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                              {c.documentName}
                              <span className="font-mono text-[10px] text-muted-foreground">p.{c.page}</span>
                            </p>
                            <p className="truncate text-[10px] italic text-muted-foreground">
                              “{c.quote}”
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-foreground/10 px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about contracts, invoices, policies..."
          className="h-10 flex-1 rounded-full border border-foreground/10 bg-foreground/[0.05] px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-500/40"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-glow transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
