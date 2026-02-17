"use client"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Session } from "@/lib/types"

const DATES = [
  { value: "", label: "All" },
  { value: "2026-02-16", label: "Feb 16" },
  { value: "2026-02-17", label: "Feb 17" },
  { value: "2026-02-18", label: "Feb 18" },
  { value: "2026-02-19", label: "Feb 19" },
  { value: "2026-02-20", label: "Feb 20" },
]

interface DateTabsProps {
  sessions: Session[]
  activeDate: string
  onDateChange: (date: string) => void
}

export function DateTabs({ sessions, activeDate, onDateChange }: DateTabsProps) {
  const countByDate = (date: string) =>
    date ? sessions.filter((s) => s.date === date).length : sessions.length

  const activeLabel = DATES.find((d) => d.value === activeDate)?.label ?? "All"

  return (
    <>
      {/* Mobile: dropdown */}
      <div className="sm:hidden">
        <Select
          value={activeDate || "all"}
          onValueChange={(v) => onDateChange(v === "all" ? "" : v)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            {DATES.map((d) => (
              <SelectItem key={d.value || "all"} value={d.value || "all"}>
                {d.label} ({countByDate(d.value)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: tab buttons */}
      <div className="hidden gap-1.5 sm:flex" role="tablist">
        {DATES.map((d) => {
          const isActive = activeDate === d.value
          return (
            <button
              key={d.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onDateChange(d.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {d.label}
              <span className={cn("tabular-nums", isActive ? "text-background/60" : "text-muted-foreground/60")}>
                {countByDate(d.value)}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
