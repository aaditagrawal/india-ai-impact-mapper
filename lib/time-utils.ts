import type { Session, SessionStatus, TimeSlot } from "./types"

// IST offset: UTC+5:30
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export function parseSessionDateTime(date: string, time: string | null): Date | null {
  if (!date || !time) return null
  // date: "2026-02-17", time: "09:00:00.000"
  // Construct as UTC then offset for IST
  const [hours, minutes] = time.split(":")
  const iso = `${date}T${hours}:${minutes}:00.000Z`
  // This creates a UTC date — subtract IST offset so that when interpreted
  // as IST the wall-clock time matches
  return new Date(new Date(iso).getTime() - IST_OFFSET_MS)
}

export function getSessionStatus(session: Session, now: Date): SessionStatus {
  const start = parseSessionDateTime(session.date, session.startTime)
  const end = parseSessionDateTime(session.date, session.endTime)

  if (!start) return "upcoming"
  if (!end) {
    // No end time — treat as 1-hour session
    const impliedEnd = new Date(start.getTime() + 60 * 60 * 1000)
    if (now >= impliedEnd) return "past"
    if (now >= start) return "live"
    return "upcoming"
  }

  if (now >= end) return "past"
  if (now >= start && now < end) return "live"
  return "upcoming"
}

export function getTimeSlot(session: Session): TimeSlot {
  if (!session.startTime) return "morning"
  const hour = parseInt(session.startTime.split(":")[0], 10)
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}

export function formatTimeRange(session: Session): string {
  const start = session.formattedStartTime ?? "TBD"
  const end = session.formattedEndTime ?? "TBD"
  return `${start} — ${end}`
}

export function getTimeGroupKey(session: Session): string {
  return session.formattedStartTime ?? "TBD"
}
