import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_FILTERS } from "./filters.ts";
import { parseFiltersFromURL, filtersToSearchString } from "./filter-url.ts";

test("hidden past sessions and the exhibitor view survive filter serialization", () => {
  const filters = { ...DEFAULT_FILTERS, showPast: false, query: "AI & science" };
  const search = filtersToSearchString(filters, "?view=exhibitors&custom=value&q=old");
  assert.deepEqual(parseFiltersFromURL(search), filters);
  const params = new URLSearchParams(search);
  assert.equal(params.get("view"), "exhibitors");
  assert.equal(params.get("custom"), "value");
  assert.equal(params.get("past"), "0");
});
