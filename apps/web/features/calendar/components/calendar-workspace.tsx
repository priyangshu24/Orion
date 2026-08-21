"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  CalendarOff,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { CompanyBrand } from "@/shared/components/company-brand";
import {
  calendarWeek,
  eventKindMeta,
  initialCalendarEvents,
  teamInviteGroups,
} from "../constants/events";
import type {
  CalendarEventDraft,
  CalendarEventKind,
  CalendarView,
  OrionCalendarEvent,
} from "../types";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 8);
const EVENT_START_TIMES = Array.from({ length: 48 }, (_, index) => index * 0.5);
const PX_PER_HOUR = 72;
/** Opaque base under every event card — see the boxShadow note in TimeGrid. */
const CARD_BASE = "#0a1120";
/** Chrome accent for this workspace: aligns calendar controls with Orion teal. */
const ACCENT = "#19d7c0";
const kinds = Object.keys(eventKindMeta) as CalendarEventKind[];
const teamNames = Object.keys(teamInviteGroups) as Array<keyof typeof teamInviteGroups>;

function matchingTeam(value: string) {
  const normalized = value.trim().toLocaleLowerCase();
  return teamNames.find((team) => team.toLocaleLowerCase() === normalized);
}

function timeLabel(hour: number) {
  const whole = Math.floor(hour);
  const minutes = hour % 1 ? "30" : "00";
  const display = whole % 12 || 12;
  return `${display}:${minutes} ${whole >= 12 ? "PM" : "AM"}`;
}

/** Ruler form: "8 AM", "12 PM". The ":00" is noise on a column of whole hours. */
function hourLabel(hour: number) {
  const display = hour > 12 ? hour - 12 : hour;
  return `${display} ${hour >= 12 ? "PM" : "AM"}`;
}

const noopSubscribe = () => () => {};

/**
 * Today's date in the workspace timezone: -1 on the server and during
 * hydration, the real date immediately after. Reading the clock during render
 * would make the server and client markup disagree, and setting it from an
 * effect triggers a cascading render; an explicit server snapshot is the one
 * form that does neither.
 */
function useTodayDate() {
  return useSyncExternalStore(
    noopSubscribe,
    () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      ).getDate(),
    () => -1,
  );
}

/**
 * "8:30 – 9:30 AM" for a range inside one meridiem, "11:00 AM – 12:00 PM" when
 * it straddles noon. Repeating AM on both ends of the common case is noise.
 */
function timeRange(startHour: number, duration: number) {
  const end = startHour + duration;
  const part = (hour: number) => {
    const whole = Math.floor(hour);
    const display = whole > 12 ? whole - 12 : whole;
    return `${display}:${hour % 1 ? "30" : "00"}`;
  };
  const meridiem = (hour: number) => (Math.floor(hour) >= 12 ? "PM" : "AM");
  return meridiem(startHour) === meridiem(end)
    ? `${part(startHour)} – ${part(end)} ${meridiem(end)}`
    : `${part(startHour)} ${meridiem(startHour)} – ${part(end)} ${meridiem(end)}`;
}

/** Compact form for month cells, where a full "9:00 AM" will not fit. */
function compactTime(hour: number) {
  const whole = Math.floor(hour);
  const display = whole > 12 ? whole - 12 : whole;
  const suffix = whole >= 12 ? "pm" : "am";
  return hour % 1 ? `${display}:30${suffix}` : `${display}${suffix}`;
}

/** 0.5 -> "30m", 1 -> "1h", 1.5 -> "1.5h". */
function durationLabel(duration: number) {
  if (duration < 1) return `${Math.round(duration * 60)}m`;
  return `${duration}h`;
}

/** "Tomorrow, May 30" style heading used to group the upcoming list by day. */
function dayHeading(
  label: string,
  date: number,
  month: string,
  offsetFromToday: number,
) {
  const weekday: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  const name =
    offsetFromToday === 0
      ? "Today"
      : offsetFromToday === 1
        ? "Tomorrow"
        : (weekday[label] ?? label);
  return `${name}, ${month} ${date}`;
}

function EventDialog({
  event,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  event?: OrionCalendarEvent;
  initial?: Partial<CalendarEventDraft>;
  onClose: () => void;
  onSave: (draft: CalendarEventDraft) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<CalendarEventDraft>({
    title: event?.title ?? "",
    account: event?.account ?? "",
    dayIndex: event?.dayIndex ?? initial?.dayIndex ?? 3,
    startHour: event?.startHour ?? initial?.startHour ?? 10,
    duration: event?.duration ?? 1,
    kind: event?.kind ?? initial?.kind ?? "meeting",
    attendees: event?.attendees ?? 2,
    invitees: event?.invitees ?? [],
    location: event?.location ?? "Google Meet",
    notes: event?.notes ?? "",
  });
  const [inviteeInput, setInviteeInput] = useState("");
  const [kindOpen, setKindOpen] = useState(false);
  const field =
    "orion-glass-control mt-1.5 h-10 w-full rounded-lg px-3 text-sm text-foreground outline-none";
  const addInvitees = (values: string[], source?: string) => {
    const members = values.map((value) => value.trim().toLocaleLowerCase()).filter(Boolean);
    if (!members.length) return;
    setDraft((current) => {
      const invitees = [...new Set([...current.invitees, ...members])];
      return { ...current, invitees, attendees: invitees.length };
    });
    if (source) toast.success(`${source} invited`);
  };
  const addInviteeInput = () => {
    const input = inviteeInput.trim();
    if (!input) return;
    const team = matchingTeam(input);
    if (team) addInvitees([...teamInviteGroups[team]], `${team} (${teamInviteGroups[team].length} members)`);
    else {
      const emails = input.split(/[\s,;]+/).filter((value) => /^\S+@\S+\.\S+$/.test(value));
      if (!emails.length) return toast.error("Enter a valid email or select a team");
      addInvitees(emails);
    }
    setInviteeInput("");
  };
  const removeInvitee = (email: string) => setDraft((current) => {
    const invitees = current.invitees.filter((invitee) => invitee !== email);
    return { ...current, invitees, attendees: invitees.length };
  });
  const accountTeam = matchingTeam(draft.account);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return toast.error("Event title is required");
    const teamInvitees = accountTeam ? [...teamInviteGroups[accountTeam]] : [];
    const invitees = [...new Set([...draft.invitees, ...teamInvitees])];
    onSave({
      ...draft,
      title: draft.title.trim(),
      account: draft.account.trim() || "Internal",
      invitees,
      attendees: invitees.length || draft.attendees,
      notes: draft.notes.trim() || "No notes added.",
    });
  }
  return (
    <div
      className="fixed inset-0 z-50 grid items-start justify-items-center px-4 pb-4 pt-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-dialog-title"
    >
      <button
        type="button"
        aria-label="Close event dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <form
        onSubmit={submit}
        className="orion-event-dialog neon-panel relative z-10 w-full max-w-xl rounded-2xl p-4 shadow-floating"
      >
        <header className="flex justify-between">
          <div>
            <h2
              id="event-dialog-title"
              className="text-base font-semibold text-foreground"
            >
              {event ? "Edit event" : "Create event"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Schedule the right people with clear context.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[10px] text-muted-foreground">
            Event title
            <input
              autoFocus
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              className={field}
            />
          </label>
          <label className="text-[10px] text-muted-foreground">
            Account or team
            <input
              value={draft.account}
              onChange={(e) =>
                setDraft((d) => ({ ...d, account: e.target.value }))
              }
              onBlur={() => {
                const team = matchingTeam(draft.account);
                if (team) addInvitees([...teamInviteGroups[team]], `${team} (${teamInviteGroups[team].length} members)`);
              }}
              className={field}
            />
          </label>
          <label className="text-[10px] text-muted-foreground">
            Day
            <select
              value={draft.dayIndex}
              onChange={(e) =>
                setDraft((d) => ({ ...d, dayIndex: Number(e.target.value) }))
              }
              className={field}
            >
              {calendarWeek.map((day, index) => (
                <option key={day.label} value={index}>
                  {day.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[10px] text-muted-foreground">
            Start time
            <select
              value={draft.startHour}
              onChange={(e) =>
                setDraft((d) => ({ ...d, startHour: Number(e.target.value) }))
              }
              className={field}
            >
              {EVENT_START_TIMES.map((hour) => (
                  <option key={hour} value={hour}>
                    {timeLabel(hour)}
                  </option>
                ))}
            </select>
          </label>
          <label className="text-[10px] text-muted-foreground">
            Duration
            <select
              value={draft.duration}
              onChange={(e) =>
                setDraft((d) => ({ ...d, duration: Number(e.target.value) }))
              }
              className={field}
            >
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={1.5}>1.5 hours</option>
              <option value={2}>2 hours</option>
            </select>
          </label>
          <div className="relative text-[10px] text-muted-foreground">
            <span>Event type</span>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={kindOpen}
              onClick={() => setKindOpen((open) => !open)}
              className="orion-glass-control mt-1.5 flex h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-foreground outline-none"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eventKindMeta[draft.kind].color }} />
                {eventKindMeta[draft.kind].label}
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", kindOpen && "rotate-180")} />
            </button>
            {kindOpen ? (
              <div role="listbox" aria-label="Event type" className="neon-panel absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl p-1.5 shadow-floating">
                {kinds.map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    role="option"
                    aria-selected={draft.kind === kind}
                    onClick={() => { setDraft((current) => ({ ...current, kind })); setKindOpen(false); }}
                    className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-foreground transition hover:bg-primary/10", draft.kind === kind && "bg-primary/12 text-primary")}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: eventKindMeta[kind].color }} />
                    {eventKindMeta[kind].label}
                    {draft.kind === kind ? <Check className="ml-auto h-3.5 w-3.5" /> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <label htmlFor="event-invitees">Invite members</label>
              <span>{draft.invitees.length} invited</span>
            </div>
            <div className="orion-glass-control mt-1.5 rounded-lg p-2">
              <div className="flex flex-wrap gap-1.5">
                {draft.invitees.map((email) => (
                  <span key={email} className="inline-flex items-center gap-1 rounded-md bg-primary/12 px-2 py-1 text-[10px] text-primary">
                    {email}
                    <button type="button" aria-label={`Remove ${email}`} onClick={() => removeInvitee(email)} className="text-primary/80 hover:text-primary"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <input
                  id="event-invitees"
                  value={inviteeInput}
                  onChange={(e) => setInviteeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addInviteeInput(); } }}
                  onBlur={addInviteeInput}
                  placeholder="Add email or team name"
                  className="min-w-44 flex-1 bg-transparent px-1 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {teamNames.map((team) => (
                <button key={team} type="button" onClick={() => addInvitees([...teamInviteGroups[team]], `${team} (${teamInviteGroups[team].length} members)`)} className="rounded-full border border-border px-2 py-1 text-[9px] text-muted-foreground transition hover:border-primary/50 hover:text-primary">
                  {team} · {teamInviteGroups[team].length}
                </button>
              ))}
            </div>
          </div>
          <label className="text-[10px] text-muted-foreground">
            Location
            <input
              value={draft.location}
              onChange={(e) =>
                setDraft((d) => ({ ...d, location: e.target.value }))
              }
              className={field}
            />
          </label>
          <label className="text-[10px] text-muted-foreground sm:col-span-2">
            Notes
            <textarea
              value={draft.notes}
              onChange={(e) =>
                setDraft((d) => ({ ...d, notes: e.target.value }))
              }
              className="orion-glass-control mt-1.5 min-h-16 w-full resize-none rounded-lg p-2.5 text-sm text-foreground outline-none"
            />
          </label>
        </div>
        <footer className="mt-4 flex items-center justify-between">
          <div>
            {event && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 text-xs text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete event
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-xs text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="orion-add-widget rounded-lg px-4 py-2 text-xs font-semibold"
            >
              {event ? "Save changes" : "Create event"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function TimeGrid({
  days,
  events,
  selectedDay,
  onSelectDay,
  onEvent,
  onCreate,
}: {
  days: { label: string; date: number; month: string }[];
  events: OrionCalendarEvent[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onEvent: (event: OrionCalendarEvent) => void;
  onCreate: (day: number, hour: number) => void;
}) {
  // The clock starts null and is filled in after mount. Seeding it with
  // `new Date()` renders one time on the server and a later one on the client,
  // which React reports as a hydration mismatch on every page load.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = window.setInterval(tick, 30_000);
    return () => window.clearInterval(interval);
  }, []);
  const indiaNow = now
    ? new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    : null;
  const todayDate = indiaNow ? indiaNow.getDate() : -1;
  const actualHour = indiaNow
    ? indiaNow.getHours() + indiaNow.getMinutes() / 60
    : 10;
  // The seeded workspace is a working-hours preview. Outside that window, keep
  // the live indicator in the timeline at its representative business hour.
  const currentHour =
    actualHour >= HOURS[0] && actualHour < HOURS.at(-1)! + 1 ? actualHour : 10;
  const currentTimeTop = Math.min(
    HOURS.length * PX_PER_HOUR - 2,
    Math.max(2, (currentHour - HOURS[0]) * PX_PER_HOUR),
  );
  const showCurrentTime =
    indiaNow !== null && days.some((day) => day.date === todayDate);
  const currentTimeLabel = indiaNow
    ? indiaNow.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
  const gridHeight = HOURS.length * PX_PER_HOUR;

  return (
    <div className="h-full overflow-auto">
      <div className="min-w-[880px]">
        <div
          className="sticky top-0 z-30 grid grid-cols-[68px_repeat(var(--days),1fr)] border-b bg-popover/95 orion-grid-line backdrop-blur-sm"
          style={{ "--days": days.length } as CSSProperties}
        >
          <div className="grid place-items-center px-2 py-3 text-[10px] font-medium text-muted-foreground">
            GMT+5:30
          </div>
          {days.map((day, index) => {
            const isToday = day.date === todayDate;
            return (
              <button
                key={day.label}
                type="button"
                onClick={() => onSelectDay(index)}
                className="border-l orion-grid-line py-2.5 text-center transition hover:bg-foreground/[0.03]"
              >
                <span
                  className={cn(
                    "block text-[11px] font-medium",
                    isToday ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {day.label}
                </span>
                {/* Today collapses to a circled number; the rest spell the
                    date out, so a column is readable without the header row. */}
                <span className="mt-1 grid h-8 place-items-center">
                  {isToday ? (
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-[15px] font-semibold leading-none text-primary-foreground shadow-[0_0_18px_rgba(46,230,197,0.35)]">
                      {day.date}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[13px] font-semibold leading-none",
                        index === selectedDay
                          ? "bg-foreground/[0.08] text-foreground"
                          : "text-foreground",
                      )}
                    >
                      {day.month} {day.date}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div
          className="relative grid grid-cols-[68px_repeat(var(--days),1fr)]"
          style={{ "--days": days.length } as CSSProperties}
        >
          {/* Hour ruler. Labels sit ON the line they name, which is why they are
              nudged up by half a line-height rather than centred in the row. */}
          <div
            className="relative border-r orion-grid-line"
            style={{ height: gridHeight }}
          >
            {HOURS.map((hour) => (
              <span
                key={hour}
                className="absolute right-3 text-[11px] font-medium text-muted-foreground"
                style={{ top: (hour - HOURS[0]) * PX_PER_HOUR - 7 }}
              >
                {hourLabel(hour)}
              </span>
            ))}
          </div>

          {days.map((_, visibleIndex) => {
            const actualDay = days.length === 1 ? selectedDay : visibleIndex;
            const dayEvents = events.filter(
              (event) => event.dayIndex === actualDay,
            );
            return (
              <div
                key={visibleIndex}
                className="relative border-r orion-grid-line last:border-r-0"
                style={{
                  height: gridHeight,
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${PX_PER_HOUR - 1}px, var(--color-grid-line) ${PX_PER_HOUR}px)`,
                }}
                onDoubleClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const hour = Math.min(
                    19,
                    Math.max(
                      8,
                      Math.round(
                        (HOURS[0] + (e.clientY - rect.top) / PX_PER_HOUR) * 2,
                      ) / 2,
                    ),
                  );
                  onCreate(actualDay, hour);
                }}
              >
                {dayEvents.length === 0 ? (
                  <span className="pointer-events-none absolute inset-x-0 top-1/3 flex flex-col items-center gap-2 text-muted-foreground/60">
                    <CalendarOff className="h-5 w-5" />
                    <span className="text-[11px]">No events</span>
                  </span>
                ) : null}

                {dayEvents.map((event) => {
                  const meta = eventKindMeta[event.kind];
                  // Every card carries the full set — title, range, account,
                  // attendees — so the floor is the height that fits all of it
                  // rather than a height that drops rows as events get shorter.
                  const height = Math.max(66, event.duration * PX_PER_HOUR - 4);
                  const faces = Math.min(2, event.attendees);
                  const overflow = event.attendees - faces;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEvent(event)}
                      className="absolute left-1 right-1 z-10 overflow-hidden rounded-lg border border-white/[0.07] pl-2.5 pr-2 py-1.5 text-left text-foreground transition hover:z-20 hover:border-white/20"
                      style={{
                        top: (event.startHour - HOURS[0]) * PX_PER_HOUR + 2,
                        height,
                        // Opaque base. Without it the now-line shows through the
                        // card and reads as a strike-through on the title.
                        backgroundColor: CARD_BASE,
                        boxShadow: `inset 0 0 0 999px ${meta.color}12`,
                      }}
                    >
                      {/* Two lines rather than an ellipsis: a truncated title is
                          the one thing on this card you cannot guess. */}
                      <span className="line-clamp-2 text-[12px] font-semibold leading-[15px]">
                        {event.title}
                      </span>
                      <span
                        className="block truncate text-[11px] font-medium leading-[15px]"
                        style={{ color: meta.color }}
                      >
                        {timeRange(event.startHour, event.duration)}
                      </span>
                      {/* Account and attendees share a row, which is what buys
                          the title its second line inside the same height. */}
                      <span className="mt-0.5 flex items-center gap-1">
                        <CompanyBrand
                          company={event.account}
                          className="min-w-0 flex-1 gap-1.5 text-[11px] leading-[16px] text-muted-foreground"
                          iconClassName="h-4 w-4 rounded-[3px]"
                        />
                        <span className="flex shrink-0 items-center">
                          {Array.from({ length: faces }, (_, face) => (
                            <span
                              key={face}
                              className="grid h-[15px] w-[15px] place-items-center rounded-full ring-2"
                              style={{
                                background: `linear-gradient(135deg, ${meta.color}, ${meta.color}88)`,
                                marginLeft: face === 0 ? 0 : -6,
                                // Ring in the card's own base so the circles
                                // read as a stack rather than one blurred blob.
                                ["--tw-ring-color" as string]: CARD_BASE,
                              }}
                            >
                              <User className="h-2.5 w-2.5 text-black/70" />
                            </span>
                          ))}
                          {overflow > 0 ? (
                            <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                              +{overflow}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Now-line last in source order but z-0, so it draws across the
              columns without painting over the event cards (z-10). */}
          {showCurrentTime ? (
            <div
              aria-label={`Current time: ${currentTimeLabel}`}
              className="pointer-events-none absolute left-[68px] right-0 z-0 border-t-2 border-red-500/80"
              style={{ top: currentTimeTop }}
            >
              <span className="absolute -left-1 -top-[5px] h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.8)]" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MiniMonth({
  days,
  selectedDay,
  todayDate,
  onSelect,
}: {
  days: { label: string; date: number }[];
  selectedDay: number;
  todayDate: number;
  onSelect: (index: number) => void;
}) {
  const blanks = Array.from({ length: 6 });
  return (
    <section className="orion-panel p-3">
      <header className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-foreground">August 2026</h3>
        <div className="flex gap-1.5">
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </header>
      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span key={day} className="pb-1 text-[10px] text-muted-foreground">
            {day}
          </span>
        ))}
        {blanks.map((_, index) => (
          <span key={`b-${index}`} />
        ))}
        {Array.from({ length: 31 }, (_, index) => index + 1).map((date) => {
          const weekIndex = days.findIndex((day) => day.date === date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                if (weekIndex >= 0) onSelect(weekIndex);
              }}
              className={cn(
                "mx-auto grid h-7 w-7 place-items-center rounded-full text-[11px] transition hover:bg-foreground/[0.06]",
                date === todayDate
                  ? "bg-primary font-semibold text-primary-foreground"
                  : weekIndex === selectedDay
                    ? "bg-foreground/[0.10] text-foreground"
                    : "text-foreground",
              )}
            >
              {date}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function CalendarWorkspace() {
  const [events, setEvents] = useState(initialCalendarEvents);
  const [view, setView] = useState<CalendarView>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(3);
  const [dialogEvent, setDialogEvent] = useState<
    OrionCalendarEvent | null | undefined
  >(undefined);
  const [draftSlot, setDraftSlot] = useState<{
    day: number;
    hour: number;
    kind?: CalendarEventKind;
  } | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleKinds, setVisibleKinds] = useState<Set<CalendarEventKind>>(
    () => new Set(kinds),
  );
  const [connected, setConnected] = useState({ google: true, outlook: true });
  const weekStart = useMemo(() => {
    const date = new Date(Date.UTC(2026, 7, 17 + weekOffset * 7));
    return date;
  }, [weekOffset]);
  const weekDays = useMemo(
    () =>
      calendarWeek.map((day, index) => {
        const date = new Date(weekStart);
        date.setUTCDate(weekStart.getUTCDate() + index);
        return {
          label: day.label,
          date: date.getUTCDate(),
          month: date.toLocaleDateString("en-US", {
            month: "short",
            timeZone: "UTC",
          }),
        };
      }),
    [weekStart],
  );
  const weekEnd = useMemo(
    () => new Date(Date.UTC(2026, 7, 23 + weekOffset * 7)),
    [weekOffset],
  );
  const filteredEvents = useMemo(
    () => events.filter((event) => visibleKinds.has(event.kind)),
    [events, visibleKinds],
  );
  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  // Which column is actually today, or -1 when the user has paged to another
  // week. The grid and the upcoming list both key off this, so they agree.
  const todayDate = useTodayDate();
  const todayIndex = useMemo(
    () => weekDays.findIndex((day) => day.date === todayDate),
    [weekDays, todayDate],
  );
  /**
   * Upcoming = the next six events from today onward, grouped under a day
   * heading. Paging to a week with nothing left falls back to the whole week
   * so the panel is never an empty box.
   */
  // The header reads as whatever the active view actually shows: one day, the
  // week span, or the month. A week range over a month grid is just wrong.
  const rangeLabel = useMemo(() => {
    if (view === "month")
      return weekStart.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    if (view === "day") {
      const day = new Date(weekStart);
      day.setUTCDate(weekStart.getUTCDate() + selectedDay);
      return day.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    }
    return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })} – ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`;
  }, [view, weekStart, weekEnd, selectedDay]);
  // August 2026 opens on a Saturday. Rather than leaving the six leading slots
  // blank — which renders as a dead band across the top of the grid — they
  // carry the tail of July, and the five trailing slots carry the start of
  // September, the way a real month view does.
  const monthCells = useMemo(() => {
    const cells: { date: number; inMonth: boolean }[] = [];
    for (let date = 26; date <= 31; date += 1)
      cells.push({ date, inMonth: false });
    for (let date = 1; date <= 31; date += 1)
      cells.push({ date, inMonth: true });
    for (let date = 1; cells.length < 42; date += 1)
      cells.push({ date, inMonth: false });
    return cells;
  }, []);
  const upcomingGroups = useMemo(() => {
    const sorted = [...filteredEvents].sort(
      (a, b) => a.dayIndex - b.dayIndex || a.startHour - b.startHour,
    );
    const from = todayIndex < 0 ? 0 : todayIndex;
    const ahead = sorted.filter((event) => event.dayIndex >= from);
    const groups = new Map<number, OrionCalendarEvent[]>();
    for (const event of (ahead.length ? ahead : sorted).slice(0, 6)) {
      const bucket = groups.get(event.dayIndex);
      if (bucket) bucket.push(event);
      else groups.set(event.dayIndex, [event]);
    }
    return [...groups.entries()];
  }, [filteredEvents, todayIndex]);
  const editingDraft =
    dialogEvent === null && draftSlot
      ? {
          dayIndex: draftSlot.day,
          startHour: draftSlot.hour,
          kind: draftSlot.kind,
        }
      : null;
  function saveEvent(draft: CalendarEventDraft) {
    if (dialogEvent)
      setEvents((current) =>
        current.map((event) =>
          event.id === dialogEvent.id ? { ...event, ...draft } : event,
        ),
      );
    else
      setEvents((current) => [
        ...current,
        { ...draft, id: `event-${Date.now()}` },
      ]);
    toast.success(dialogEvent ? "Event updated" : "Event created");
    setDialogEvent(undefined);
    setDraftSlot(null);
  }
  function createAt(day = selectedDay, hour = 10, kind?: CalendarEventKind) {
    setDraftSlot({ day, hour, kind });
    setDialogEvent(null);
  }
  function deleteEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
    setDialogEvent(undefined);
    toast.success("Event deleted");
  }
  function toggleKind(kind: CalendarEventKind) {
    setVisibleKinds((current) => {
      const next = new Set(current);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Manage your schedule, meetings, and important activities.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
              className="orion-glass-control flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] text-foreground"
            >
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              Filters
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform",
                  filterOpen && "rotate-180",
                )}
              />
            </button>
            {filterOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close filters"
                  onClick={() => setFilterOpen(false)}
                  className="fixed inset-0 z-30 cursor-default"
                />
                <div className="neon-panel absolute right-0 top-11 z-40 w-48 rounded-xl p-1.5">
                  {kinds.map((kind) => {
                    const active = visibleKinds.has(kind);
                    return (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => toggleKind(kind)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] text-foreground transition hover:bg-foreground/[0.06]"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: eventKindMeta[kind].color }}
                        />
                        <span className="flex-1">
                          {eventKindMeta[kind].label}
                        </span>
                        {active ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() =>
              createAt(todayIndex >= 0 ? todayIndex : selectedDay, 10, "task")
            }
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[12px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: ACCENT,
            }}
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
        <main className="flex min-h-0 min-w-0 flex-col">
          <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="orion-glass-control h-8 rounded-lg px-3 text-[12px] text-foreground"
            >
              Today
            </button>
            <button
              type="button"
              aria-label="Previous period"
              onClick={() => setWeekOffset((value) => value - 1)}
              className="orion-glass-control grid h-8 w-8 place-items-center rounded-lg"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next period"
              onClick={() => setWeekOffset((value) => value + 1)}
              className="orion-glass-control grid h-8 w-8 place-items-center rounded-lg"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            {/* The chevron is not decoration: the label zooms out to the month
                grid, which is where you pick a different date. */}
            <button
              type="button"
              onClick={() => setView("month")}
              className="mr-auto flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-semibold text-foreground transition hover:bg-foreground/[0.06]"
            >
              {rangeLabel}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* View switcher. One segmented control rather than four separate
                buttons, so the active view reads as a position, not a colour. */}
            <div
              role="tablist"
              aria-label="Calendar view"
              className="orion-glass-control flex h-8 items-center gap-0.5 rounded-lg p-0.5"
            >
              {(["day", "week", "month", "agenda"] as CalendarView[]).map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={view === option}
                    onClick={() => setView(option)}
                    className={cn(
                      "h-7 rounded-md px-3 text-[12px] font-medium capitalize transition",
                      view === option
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    style={
                      view === option
                        ? { backgroundColor: ACCENT }
                        : undefined
                    }
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          </div>
          <section className="orion-panel flex min-h-0 flex-1 flex-col overflow-hidden">
            {view === "week" ? (
              <TimeGrid
                days={weekDays}
                events={filteredEvents}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onEvent={(event) => setDialogEvent(event)}
                onCreate={createAt}
              />
            ) : null}
            {view === "day" ? (
              <TimeGrid
                days={[weekDays[selectedDay]]}
                events={filteredEvents}
                selectedDay={selectedDay}
                onSelectDay={() => {}}
                onEvent={(event) => setDialogEvent(event)}
                onCreate={createAt}
              />
            ) : null}
            {view === "month" ? (
              <div className="grid h-full grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))] border-l border-t orion-grid-line">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="border-b border-r orion-grid-line p-2 text-center text-[11px] font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ),
                )}
                {monthCells.map(({ date, inMonth }, index) => {
                  // Only the loaded week carries events, so the month grid
                  // links through to whichever days that week covers rather
                  // than a hardcoded 17..23.
                  const weekIndex = inMonth
                    ? weekDays.findIndex((day) => day.date === date)
                    : -1;
                  const dayEvents =
                    weekIndex >= 0
                      ? filteredEvents
                          .filter((event) => event.dayIndex === weekIndex)
                          .sort((a, b) => a.startHour - b.startHour)
                      : [];
                  // Three chips is what fits at 112px; the rest roll up into a
                  // "+N more" that opens the day.
                  const shown = dayEvents.slice(0, 3);
                  const openDay = () => {
                    if (weekIndex >= 0) {
                      setSelectedDay(weekIndex);
                      setView("day");
                    }
                  };
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex min-h-0 flex-col gap-0.5 overflow-hidden border-b border-r orion-grid-line p-1.5",
                        !inMonth && "bg-foreground/[0.02]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={openDay}
                        aria-label={`August ${date}`}
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center self-start rounded-full text-[12px] transition hover:bg-foreground/[0.08]",
                          !inMonth && "text-muted-foreground/50",
                          inMonth &&
                            date === todayDate &&
                            "bg-primary font-semibold text-primary-foreground hover:bg-primary",
                        )}
                      >
                        {date}
                      </button>
                      {shown.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setDialogEvent(event)}
                          className="flex w-full items-center gap-1.5 rounded px-1 py-[3px] text-left transition hover:bg-foreground/[0.07]"
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor: eventKindMeta[event.kind].color,
                            }}
                          />
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {compactTime(event.startHour)}
                          </span>
                          <span className="truncate text-[11px] text-foreground">
                            {event.title}
                          </span>
                        </button>
                      ))}
                      {dayEvents.length > shown.length ? (
                        <button
                          type="button"
                          onClick={openDay}
                          className="px-1 text-left text-[10px] text-primary transition hover:text-primary/80"
                        >
                          +{dayEvents.length - shown.length} more
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
            {view === "agenda" ? (
              <div className="h-full divide-y divide-border overflow-y-auto">
                {filteredEvents
                  .toSorted(
                    (a, b) =>
                      a.dayIndex - b.dayIndex || a.startHour - b.startHour,
                  )
                  .map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setDialogEvent(event)}
                      className="flex w-full items-center gap-4 p-4 text-left hover:bg-foreground/[0.025]"
                    >
                      <span className="w-16 text-[11px] text-muted-foreground">
                        {weekDays[event.dayIndex].label}{" "}
                        {weekDays[event.dayIndex].date}
                      </span>
                      <span
                        className="h-9 w-1 rounded-full"
                        style={{
                          backgroundColor: eventKindMeta[event.kind].color,
                        }}
                      />
                      <span className="flex-1">
                        <span className="block text-[13px] font-medium text-foreground">
                          {event.title}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <CompanyBrand
                            company={event.account}
                            className="gap-1.5"
                            iconClassName="h-4 w-4 rounded-[3px]"
                          />
                          · {event.location}
                        </span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {timeLabel(event.startHour)} · {durationLabel(event.duration)}
                      </span>
                    </button>
                  ))}
              </div>
            ) : null}
          </section>
          <div className="mt-3 flex shrink-0 flex-wrap gap-3">
            {kinds.map((kind) => (
              <span
                key={kind}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: eventKindMeta[kind].color }}
                />
                {eventKindMeta[kind].label}
              </span>
            ))}
          </div>
        </main>
        <aside className="min-h-0 space-y-3 overflow-y-auto">
          <MiniMonth
            days={weekDays}
            selectedDay={selectedDay}
            todayDate={todayDate}
            onSelect={(day) => {
              setSelectedDay(day);
              setView("day");
            }}
          />
          <section className="orion-panel p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground">
                Upcoming Events
              </h3>
              <button
                type="button"
                onClick={() => setView("agenda")}
                className="text-[11px] text-primary transition hover:text-primary/80"
              >
                View all
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {upcomingGroups.map(([dayIndex, dayEvents]) => (
                <div key={dayIndex}>
                  <p className="text-[11px] text-muted-foreground">
                    {dayHeading(
                      weekDays[dayIndex].label,
                      weekDays[dayIndex].date,
                      monthLabel,
                      todayIndex < 0 ? -1 : dayIndex - todayIndex,
                    )}
                  </p>
                  <div className="mt-1.5 space-y-0.5">
                    {dayEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setDialogEvent(event)}
                        className="flex w-full items-start gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-foreground/[0.05]"
                      >
                        <span
                          className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor: eventKindMeta[event.kind].color,
                          }}
                        />
                        <span className="w-[52px] shrink-0 text-[11px] text-muted-foreground">
                          {timeLabel(event.startHour)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] text-foreground">
                            {event.title}
                          </span>
                          <CompanyBrand
                            company={event.account}
                            className="gap-1.5 text-[11px] text-muted-foreground"
                            iconClassName="h-4 w-4 rounded-[3px]"
                          />
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {durationLabel(event.duration)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="orion-panel p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground">
                Your Schedule
              </h3>
              <button
                type="button"
                onClick={() => toast.info("Schedule report opened")}
                className="text-[11px] text-primary transition hover:text-primary/80"
              >
                View full report
              </button>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div
                className="grid h-24 w-24 place-items-center rounded-full p-2"
                style={{
                  background:
                    "conic-gradient(#10d6ad 0 44%, #38bdf8 44% 72%, #9b7cff 72% 89%, #f59e0b 89% 100%)",
                }}
              >
                <div className="grid h-full w-full place-items-center rounded-full bg-[#0a1120] text-center">
                  <span>
                    <strong className="block text-xl font-semibold text-foreground">
                      {events.length}
                    </strong>
                    <span className="text-[10px] text-muted-foreground">
                      Events
                    </span>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  ["Meetings", "44%", "#10d6ad"],
                  ["Calls", "28%", "#38bdf8"],
                  ["Tasks", "17%", "#9b7cff"],
                  ["Reviews", "11%", "#f59e0b"],
                ].map(([label, value, color]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="w-16 text-muted-foreground">{label}</span>
                    <span className="text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="orion-panel p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground">
                Connected Calendars
              </h3>
              <button
                type="button"
                onClick={() => toast.info("Calendar connections opened")}
                className="text-[11px] text-primary transition hover:text-primary/80"
              >
                Manage
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["google", "Google Calendar", "alex.morgan@orion.co"],
                ["outlook", "Microsoft Outlook", "alex.morgan@orion.co"],
              ].map(([id, label, email]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setConnected((current) => ({
                      ...current,
                      [id]: !current[id as keyof typeof current],
                    }))
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition hover:bg-foreground/[0.05]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] p-1.5">
                    <Image src={`/integrations/${id}.svg`} alt={`${label} logo`} width={20} height={20} className="h-full w-full object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] text-foreground">
                      {label}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {email}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-1 text-[10px]",
                      connected[id as keyof typeof connected]
                        ? "bg-success/10 text-success"
                        : "bg-foreground/5 text-muted-foreground",
                    )}
                  >
                    {connected[id as keyof typeof connected]
                      ? "Synced"
                      : "Paused"}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => toast.info("Choose a calendar provider")}
              className="mt-3 flex w-full items-center justify-center gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground transition hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Calendar
            </button>
          </section>
        </aside>
      </div>
      {dialogEvent !== undefined ? (
        <EventDialog
          event={dialogEvent ?? undefined}
          initial={editingDraft ?? undefined}
          onClose={() => {
            setDialogEvent(undefined);
            setDraftSlot(null);
          }}
          onSave={saveEvent}
          onDelete={dialogEvent ? () => deleteEvent(dialogEvent.id) : undefined}
          key={`${dialogEvent?.id ?? "new"}-${editingDraft?.dayIndex ?? ""}-${editingDraft?.startHour ?? ""}`}
        />
      ) : null}
    </div>
  );
}
