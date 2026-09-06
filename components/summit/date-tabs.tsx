"use client";

import { classNames } from "@/app/ui.stylex";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Session } from "@/lib/types";

const DATES = [
  { value: "", label: "All" },
  { value: "2026-02-16", label: "Feb 16" },
  { value: "2026-02-17", label: "Feb 17" },
  { value: "2026-02-18", label: "Feb 18" },
  { value: "2026-02-19", label: "Feb 19" },
  { value: "2026-02-20", label: "Feb 20" },
];

interface DateTabsProps {
  sessions: Session[];
  activeDate: string;
  onDateChange: (date: string) => void;
}

export function DateTabs({ sessions, activeDate, onDateChange }: DateTabsProps) {
  const countByDate = (date: string) =>
    date ? sessions.filter((s) => s.date === date).length : sessions.length;

  return (
    <>
      {/* Mobile: dropdown */}
      <div className={classNames.dateTabs32}>
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
      <div className={classNames.dateTabs33} role="tablist">
        {DATES.map((d) => {
          const isActive = activeDate === d.value;
          return (
            <button
              key={d.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onDateChange(d.value)}
              className={cn(
                classNames.dateTabs34,
                isActive ? classNames.dateTabs35 : classNames.dateTabs36,
              )}
            >
              {d.label}
              <span
                className={cn(
                  classNames.dateTabs37,
                  isActive ? classNames.dateTabs38 : classNames.dateTabs39,
                )}
              >
                {countByDate(d.value)}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
