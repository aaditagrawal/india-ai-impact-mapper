import type { FilterState } from "./types";
import { DEFAULT_FILTERS } from "./filters";
import { parseVenueZone } from "./auditorium-map";

export function parseFiltersFromURL(search: string): FilterState {
  const params = new URLSearchParams(search);
  return {
    query: params.get("q") ?? DEFAULT_FILTERS.query,
    date: params.get("date") ?? DEFAULT_FILTERS.date,
    venue: params.get("venue") ?? DEFAULT_FILTERS.venue,
    zone: parseVenueZone(params.get("zone")) ?? DEFAULT_FILTERS.zone,
    tag: params.get("tag") ?? DEFAULT_FILTERS.tag,
    timeSlot: params.get("time") ?? DEFAULT_FILTERS.timeSlot,
    showPast: params.get("past") !== "0",
  };
}

export function filtersToSearchString(filters: FilterState, currentSearch: string): string {
  const params = new URLSearchParams(currentSearch);
  for (const key of ["q", "date", "venue", "zone", "tag", "time", "past"]) params.delete(key);
  if (filters.query) params.set("q", filters.query);
  if (filters.date) params.set("date", filters.date);
  if (filters.venue) params.set("venue", filters.venue);
  if (filters.zone) params.set("zone", filters.zone);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.timeSlot) params.set("time", filters.timeSlot);
  params.set("past", filters.showPast ? "1" : "0");
  const str = params.toString();
  return str ? `?${str}` : "";
}
