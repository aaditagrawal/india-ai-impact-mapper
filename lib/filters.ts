import type { FilterState, Session } from "./types"
import { normalizeAuditorium } from "./auditorium-map"
import { getSessionStatus, getTimeSlot } from "./time-utils"

export function filterSessions(
  sessions: Session[],
  filters: FilterState,
  now: Date
): Session[] {
  return sessions.filter((session) => {
    // Hide past events unless toggled on
    if (!filters.showPast && getSessionStatus(session, now) === "past") {
      return false
    }

    // Date filter
    if (filters.date && session.date !== filters.date) {
      return false
    }

    // Venue filter
    if (filters.venue && session.venue !== filters.venue) {
      return false
    }

    // Zone filter
    if (filters.zone) {
      const zone = normalizeAuditorium(session.auditorium)
      if (zone !== filters.zone) return false
    }

    // Tag filter
    if (filters.tag && !session.tags.includes(filters.tag)) {
      return false
    }

    // Time slot filter
    if (filters.timeSlot) {
      if (getTimeSlot(session) !== filters.timeSlot) return false
    }

    // Search query — match against title, speakers, description
    if (filters.query) {
      const q = filters.query.toLowerCase()
      const inTitle = session.title.toLowerCase().includes(q)
      const inDesc = session.description.toLowerCase().includes(q)
      const inSpeakers = session.speakers.some((s) =>
        s.name.toLowerCase().includes(q)
      )
      if (!inTitle && !inDesc && !inSpeakers) return false
    }

    return true
  })
}

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  date: "",
  venue: "",
  zone: "",
  tag: "",
  timeSlot: "",
  showPast: false,
}
