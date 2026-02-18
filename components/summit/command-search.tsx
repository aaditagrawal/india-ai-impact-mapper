"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  MagnifyingGlass,
  Clock,
  MapPin,
  Broadcast,
  User,
  ArrowElbowDownLeft,
  Hash,
  Tag,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import type { Session, SessionStatus, Exhibitor, AppView } from "@/lib/types"
import { getSessionStatus, formatTimeRange } from "@/lib/time-utils"
import { cn } from "@/lib/utils"

type SearchResult =
  | { type: "session"; session: Session }
  | { type: "exhibitor"; exhibitor: Exhibitor }

interface CommandSearchProps {
  sessions: Session[]
  exhibitors: Exhibitor[]
  now: Date
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSession: (session: Session) => void
  onSelectExhibitor: (exhibitor: Exhibitor) => void
  view: AppView
}

function scoreMatch(session: Session, query: string): number {
  const q = query.toLowerCase()
  const title = session.title.toLowerCase()

  if (title === q) return 100
  if (title.startsWith(q)) return 90
  const words = title.split(/\s+/)
  if (words.some((w) => w.startsWith(q))) return 80
  if (title.includes(q)) return 70
  if (session.speakers.some((s) => s.name.toLowerCase().includes(q))) return 60
  if (session.tags.some((t) => t.toLowerCase().includes(q))) return 50
  if (session.description.toLowerCase().includes(q)) return 30

  return 0
}

function scoreExhibitorMatch(exhibitor: Exhibitor, query: string): number {
  const q = query.toLowerCase()
  const name = exhibitor.exhibitor.toLowerCase()

  if (name === q) return 100
  if (name.startsWith(q)) return 90
  const words = name.split(/\s+/)
  if (words.some((w) => w.startsWith(q))) return 80
  if (name.includes(q)) return 70
  if (exhibitor.tag.toLowerCase().includes(q)) return 50
  if (exhibitor.booth_number.toLowerCase().includes(q)) return 40

  return 0
}

export function CommandSearch({
  sessions,
  exhibitors,
  now,
  open,
  onOpenChange,
  onSelectSession,
  onSelectExhibitor,
  view,
}: CommandSearchProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevOpen, setPrevOpen] = useState(false)
  const [prevResultsLen, setPrevResultsLen] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (view === "exhibitors") {
      if (!query.trim()) {
        const items: SearchResult[] = exhibitors
          .slice(0, 12)
          .map((e) => ({ type: "exhibitor" as const, exhibitor: e }))
        return { items, isDefault: true }
      }
      const scored = exhibitors
        .map((e) => ({ exhibitor: e, score: scoreExhibitorMatch(e, query.trim()) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20)
      return {
        items: scored.map((r): SearchResult => ({ type: "exhibitor", exhibitor: r.exhibitor })),
        isDefault: false,
      }
    }

    if (!query.trim()) {
      const live = sessions
        .filter((s) => getSessionStatus(s, now) === "live")
        .slice(0, 6)
      const upcoming = sessions
        .filter((s) => getSessionStatus(s, now) === "upcoming")
        .slice(0, 12 - live.length)
      const items: SearchResult[] = [...live, ...upcoming].map((s) => ({ type: "session" as const, session: s }))
      return { items, isDefault: true }
    }

    const scored = sessions
      .map((s) => ({ session: s, score: scoreMatch(s, query.trim()) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    return {
      items: scored.map((r): SearchResult => ({ type: "session", session: r.session })),
      isDefault: false,
    }
  }, [sessions, exhibitors, query, now, view])

  // Reset state when opening (during render, not in effect)
  if (open && !prevOpen) {
    setQuery("")
    setActiveIndex(0)
  }
  if (open !== prevOpen) {
    setPrevOpen(open)
  }

  // Reset active index when results change (during render)
  if (results.items.length !== prevResultsLen) {
    setPrevResultsLen(results.items.length)
    setActiveIndex(0)
  }

  // Focus input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return
    const active = listRef.current.querySelector("[data-active='true']")
    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (result.type === "session") {
        onSelectSession(result.session)
      } else {
        onSelectExhibitor(result.exhibitor)
      }
      onOpenChange(false)
    },
    [onSelectSession, onSelectExhibitor, onOpenChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((i) => Math.min(i + 1, results.items.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((i) => Math.max(i - 1, 0))
          break
        case "Enter": {
          e.preventDefault()
          const item = results.items[activeIndex]
          if (item) handleSelect(item)
          break
        }
        case "Escape":
          e.preventDefault()
          onOpenChange(false)
          break
      }
    },
    [results.items, activeIndex, handleSelect, onOpenChange]
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

      {/* Dialog */}
      <div
        className="absolute left-1/2 top-[min(20%,8rem)] w-full max-w-lg -translate-x-1/2 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-lg border bg-background shadow-2xl ring-1 ring-foreground/5">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3">
            <MagnifyingGlass className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={view === "exhibitors" ? "Search exhibitors..." : "Search sessions, speakers, topics..."}
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/60"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[min(60vh,24rem)] overflow-y-auto p-1.5">
            {results.items.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No {view === "exhibitors" ? "exhibitors" : "sessions"} found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              <>
                {results.isDefault && (
                  <div className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                    {view === "exhibitors"
                      ? "Exhibitors"
                      : sessions.some((s) => getSessionStatus(s, now) === "live")
                        ? "Live & Upcoming"
                        : "Upcoming Sessions"}
                  </div>
                )}
                {results.items.map((item, i) => {
                  if (item.type === "exhibitor") {
                    return (
                      <CommandExhibitorItem
                        key={item.exhibitor.sno}
                        exhibitor={item.exhibitor}
                        isActive={i === activeIndex}
                        onSelect={() => handleSelect(item)}
                        onHover={() => setActiveIndex(i)}
                      />
                    )
                  }
                  const status = getSessionStatus(item.session, now)
                  return (
                    <CommandSearchItem
                      key={item.session.id}
                      session={item.session}
                      status={status}
                      isActive={i === activeIndex}
                      onSelect={() => handleSelect(item)}
                      onHover={() => setActiveIndex(i)}
                    />
                  )
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t px-3 py-2 text-[10px] text-muted-foreground/60">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border px-1 py-0.5 font-mono text-[9px]">
                  <ArrowElbowDownLeft className="inline size-2.5" />
                </kbd>
                open
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border px-1 py-0.5 font-mono text-[9px]">&uarr;&darr;</kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border px-1 py-0.5 font-mono text-[9px]">esc</kbd>
                close
              </span>
            </div>
            <span className="tabular-nums sm:ml-auto">{results.items.length} results</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CommandSearchItem({
  session,
  status,
  isActive,
  onSelect,
  onHover,
}: {
  session: Session
  status: SessionStatus
  isActive: boolean
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <button
      data-active={isActive}
      className={cn(
        "flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span className="line-clamp-1 font-serif text-sm leading-snug">
            {session.title}
          </span>
          {status === "live" && (
            <Badge variant="destructive" className="shrink-0 gap-0.5 text-[9px]">
              <Broadcast className="size-2.5 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {session.formattedDate} &middot; {formatTimeRange(session)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            <span className="truncate">{session.auditorium}</span>
          </span>
          {session.speakers.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {session.speakers
                .slice(0, 2)
                .map((s) => s.name.split(",")[0])
                .join(", ")}
              {session.speakers.length > 2 && ` +${session.speakers.length - 2}`}
            </span>
          )}
        </div>
      </div>

      {isActive && (
        <ArrowElbowDownLeft className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
}

function CommandExhibitorItem({
  exhibitor,
  isActive,
  onSelect,
  onHover,
}: {
  exhibitor: Exhibitor
  isActive: boolean
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <button
      data-active={isActive}
      className={cn(
        "flex w-full items-start gap-3 rounded-md px-2.5 py-2 text-left transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
    >
      <div className="min-w-0 flex-1">
        <span className="line-clamp-1 font-serif text-sm leading-snug">
          {exhibitor.exhibitor}
        </span>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          {exhibitor.booth_number && (
            <span className="inline-flex items-center gap-1">
              <Hash className="size-3" />
              Booth {exhibitor.booth_number}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {exhibitor.hall_number ? `Hall ${exhibitor.hall_number}` : "Unassigned"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Tag className="size-3" />
            {exhibitor.tag}
          </span>
        </div>
      </div>

      {isActive && (
        <ArrowElbowDownLeft className="mt-1 size-3.5 shrink-0 text-muted-foreground" />
      )}
    </button>
  )
}
