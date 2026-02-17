"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Session } from "@/lib/types"

const DATES = [
  { value: "", label: "All" },
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

  return (
    <Tabs value={activeDate} onValueChange={onDateChange}>
      <TabsList className="w-full overflow-x-auto sm:w-auto">
        {DATES.map((d) => (
          <TabsTrigger key={d.value} value={d.value} className="gap-1.5 text-xs">
            {d.label}
            <span className="tabular-nums text-muted-foreground">
              {countByDate(d.value)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
