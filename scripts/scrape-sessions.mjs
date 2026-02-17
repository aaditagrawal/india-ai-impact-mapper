/**
 * Scrapes session data from the India AI Impact Summit 2026 website.
 * Uses Next.js server actions to fetch session data.
 */

const BASE_URL = "https://impact.indiaai.gov.in/sessions"
const GET_ALL_SESSIONS_ACTION = "7ff6cbc8a6b585bb0fe7d20cbea5495f6d846327a8"
const GET_FILTER_OPTIONS_ACTION = "004e64170b9b3d4f4188ce1d259531183dacc71a59"

async function callServerAction(actionId, args) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Next-Action": actionId,
      Accept: "text/x-component",
    },
    body: JSON.stringify(args),
  })
  return res.text()
}

/**
 * Parse the RSC streaming response to extract JSON data.
 * The format has lines like:
 *   0:{"a":"$@1",...}    -> metadata
 *   2:T43e,<text>        -> text chunk (hex length)
 *   1:[{...}]            -> the actual data (JSON array)
 *
 * Text references use $2, $3 etc which refer to text chunks.
 * We need to resolve these references.
 */
function parseRscResponse(text) {
  // RSC streaming format: "1:" marks the main data payload.
  // It may appear inline (not at start of line) after text chunks.
  // Find "1:[" which starts the session array.
  const marker = text.indexOf("1:[")
  if (marker !== -1) {
    const jsonStr = text.slice(marker + 2)
    try {
      return JSON.parse(jsonStr)
    } catch {
      // partial parse
    }
  }

  // Fallback: find "1:{" for object responses
  const objMarker = text.indexOf("1:{")
  if (objMarker !== -1) {
    const jsonStr = text.slice(objMarker + 2)
    try {
      return JSON.parse(jsonStr)
    } catch {
      // noop
    }
  }

  return null
}

function transformSession(raw) {
  return {
    id: raw.id,
    title: (raw.title || "").trim(),
    description: (raw.description || "").trim(),
    date: raw.date,
    formattedDate: raw.formattedDate,
    startTime: raw.startTime || null,
    formattedStartTime: raw.formattedStartTime || null,
    endTime: raw.endTime || null,
    formattedEndTime: raw.formattedEndTime || null,
    venue: raw.venue || "",
    auditorium: raw.auditorium || "",
    speakers: (raw.speakers || []).map((s) => ({
      id: s.id,
      name: s.heading || s.name || "",
      title: s.title || "",
      bio: s.body || s.bio || "",
    })),
    knowledgePartners: (raw.knowledgePartners || []).map((kp) => ({
      id: kp.id,
      name: kp.title || kp.name || "",
      image: kp.image || null,
    })),
    tags: (raw.buttons?.tagButtons || raw.tags || []).map((t) =>
      typeof t === "string" ? t : t.name || ""
    ).filter(Boolean),
    watchLiveUrl:
      raw.buttons?.watchLiveButton?.[0]?.url || raw.watchLiveUrl || "",
  }
}

async function main() {
  // Fetch all sessions at once (no date filter = all dates)
  console.error("Fetching all sessions...")
  const raw = await callServerAction(GET_ALL_SESSIONS_ACTION, [
    { dates: [], times: [], venues: [], sessionTypes: [] },
  ])

  const sessions = parseRscResponse(raw)
  if (!Array.isArray(sessions)) {
    console.error("Failed to parse sessions from response")
    process.exit(1)
  }

  console.error(`Parsed ${sessions.length} raw sessions`)

  // De-duplicate and transform
  const seenIds = new Set()
  const allSessions = []
  for (const s of sessions) {
    if (s.id && !seenIds.has(s.id)) {
      seenIds.add(s.id)
      allSessions.push(transformSession(s))
    }
  }

  // Sort by date, then start time
  allSessions.sort((a, b) => {
    const dateCmp = (a.date || "").localeCompare(b.date || "")
    if (dateCmp !== 0) return dateCmp
    return (a.startTime || "").localeCompare(b.startTime || "")
  })

  // Count by date
  const sessionsByDate = {}
  for (const s of allSessions) {
    sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + 1
  }

  const dates = Object.keys(sessionsByDate).sort()
  const output = {
    event: "India AI Impact Summit 2026",
    location: "Bharat Mandapam, Pragati Maidan, New Delhi",
    dates: "February 16-20, 2026",
    sourceUrl: `https://impact.indiaai.gov.in/sessions?date=${dates.join(",")}`,
    scrapedAt: new Date().toISOString(),
    totalSessions: allSessions.length,
    sessionsByDate,
    sessions: allSessions,
  }

  console.log(JSON.stringify(output, null, 2))
  console.error(`\nDone! ${allSessions.length} sessions across ${dates.length} dates`)
  console.error("By date:", sessionsByDate)
}

main().catch((e) => {
  console.error("Error:", e)
  process.exit(1)
})
