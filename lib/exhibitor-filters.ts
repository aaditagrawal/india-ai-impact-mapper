import type { Exhibitor, ExhibitorFilterState } from "./types"

export function filterExhibitors(
  exhibitors: Exhibitor[],
  filters: ExhibitorFilterState
): Exhibitor[] {
  return exhibitors.filter((ex) => {
    if (filters.hall) {
      const hall = ex.hall_number && ex.hall_number !== "NA" ? ex.hall_number : "Unassigned"
      if (hall !== filters.hall) return false
    }

    if (filters.tag && ex.tag !== filters.tag) {
      return false
    }

    if (filters.query) {
      const q = filters.query.toLowerCase()
      if (!ex.exhibitor.toLowerCase().includes(q)) return false
    }

    return true
  })
}

export const DEFAULT_EXHIBITOR_FILTERS: ExhibitorFilterState = {
  query: "",
  tag: "",
  hall: "",
}
