import type { VenueZone } from "./types"

const AUDITORIUM_MAP: Record<string, VenueZone> = {
  "plenary hall - a": "plenary-hall-a",
  "plenary hall - b": "plenary-hall-b",
  "plenary hall b": "plenary-hall-b",
  "l3 plenary hall": "l3-plenary",
  "l2 audi 1": "l2-audi-1",
  "l2 audi 2": "l2-audi-2",
  "l2 audi ii": "l2-audi-2",
  "l2 summit room": "l2-summit-room",
  "amphitheatre": "amphitheatre",
  "amphitheater": "amphitheatre",
  "chanakya auditorium": "ssb-chanakya",
  "nalanda banquet": "ssb-nalanda",
  "shakuntalam banquet": "ssb-shakuntalam",
}

const VALID_L1_ROOMS = [6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19]

function extractL1RoomNumber(cleaned: string): number | null {
  let match: RegExpMatchArray | null

  match = cleaned.match(/l1 meeting room (?:no\.\s*)?(\d+)/)
  if (match) return parseInt(match[1], 10)

  match = cleaned.match(/l1 mr (\d+)/)
  if (match) return parseInt(match[1], 10)

  match = cleaned.match(/meeting room (\d+),?\s*level 1/)
  if (match) return parseInt(match[1], 10)

  match = cleaned.match(/room number (\d+)/)
  if (match) return parseInt(match[1], 10)

  return null
}

export function normalizeAuditorium(raw: string): VenueZone | null {
  const cleaned = raw.replace(/\s+/g, " ").trim().toLowerCase()

  if (!cleaned || cleaned === "#n/a") return null

  const direct = AUDITORIUM_MAP[cleaned]
  if (direct) return direct

  // L1 Meeting Room variants → individual zones
  const roomNum = extractL1RoomNumber(cleaned)
  if (roomNum && VALID_L1_ROOMS.includes(roomNum)) {
    return `l1-mr-${roomNum}` as VenueZone
  }

  if (cleaned.startsWith("west wing")) return "west-wing"

  if (cleaned.startsWith("hall no.")) {
    if (cleaned.includes("3")) return "expo-hall-3"
    if (cleaned.includes("4")) return "expo-hall-4"
    if (cleaned.includes("5")) return "expo-hall-5"
  }

  return null
}

export const ZONE_LABELS: Record<VenueZone, string> = {
  "plenary-hall-a": "Plenary Hall A",
  "plenary-hall-b": "Plenary Hall B",
  "l3-plenary": "L3 Plenary Hall",
  "l2-audi-1": "L2 Audi 1",
  "l2-audi-2": "L2 Audi 2",
  "l2-summit-room": "L2 Summit Room",
  "l1-mr-6": "MR 6",
  "l1-mr-7": "MR 7",
  "l1-mr-8": "MR 8",
  "l1-mr-9": "MR 9",
  "l1-mr-10": "MR 10",
  "l1-mr-14": "MR 14",
  "l1-mr-15": "MR 15",
  "l1-mr-16": "MR 16",
  "l1-mr-17": "MR 17",
  "l1-mr-18": "MR 18",
  "l1-mr-19": "MR 19",
  "west-wing": "West Wing",
  "amphitheatre": "Amphitheatre",
  "expo-hall-1": "Hall 1",
  "expo-hall-2": "Hall 2",
  "expo-hall-3": "Expo Hall 3",
  "expo-hall-4": "Expo Hall 4",
  "expo-hall-5": "Expo Hall 5",
  "expo-hall-6": "Hall 6",
  "expo-hall-7": "Hall 7",
  "expo-hall-8": "Hall 8",
  "expo-hall-14": "Hall 14",
  "ssb-chanakya": "Chanakya Auditorium",
  "ssb-nalanda": "Nalanda Banquet",
  "ssb-shakuntalam": "Shakuntalam Banquet",
}

export const ZONE_VENUE: Record<VenueZone, string> = {
  "plenary-hall-a": "Bharat Mandapam",
  "plenary-hall-b": "Bharat Mandapam",
  "l3-plenary": "Bharat Mandapam",
  "l2-audi-1": "Bharat Mandapam",
  "l2-audi-2": "Bharat Mandapam",
  "l2-summit-room": "Bharat Mandapam",
  "l1-mr-6": "Bharat Mandapam · L1",
  "l1-mr-7": "Bharat Mandapam · L1",
  "l1-mr-8": "Bharat Mandapam · L1",
  "l1-mr-9": "Bharat Mandapam · L1",
  "l1-mr-10": "Bharat Mandapam · L1",
  "l1-mr-14": "Bharat Mandapam · L1",
  "l1-mr-15": "Bharat Mandapam · L1",
  "l1-mr-16": "Bharat Mandapam · L1",
  "l1-mr-17": "Bharat Mandapam · L1",
  "l1-mr-18": "Bharat Mandapam · L1",
  "l1-mr-19": "Bharat Mandapam · L1",
  "west-wing": "Bharat Mandapam",
  "amphitheatre": "Bharat Mandapam",
  "expo-hall-1": "Bharat Mandapam · Expo",
  "expo-hall-2": "Bharat Mandapam · Expo",
  "expo-hall-3": "Bharat Mandapam · Expo",
  "expo-hall-4": "Bharat Mandapam · Expo",
  "expo-hall-5": "Bharat Mandapam · Expo",
  "expo-hall-6": "Bharat Mandapam · Expo",
  "expo-hall-7": "Bharat Mandapam · Expo",
  "expo-hall-8": "Bharat Mandapam · Expo",
  "expo-hall-14": "Bharat Mandapam · Expo",
  "ssb-chanakya": "Sushma Swaraj Bhawan",
  "ssb-nalanda": "Sushma Swaraj Bhawan",
  "ssb-shakuntalam": "Sushma Swaraj Bhawan",
}

export const ALL_ZONES: VenueZone[] = [
  "plenary-hall-a",
  "plenary-hall-b",
  "l3-plenary",
  "l2-audi-1",
  "l2-audi-2",
  "l2-summit-room",
  "l1-mr-6",
  "l1-mr-7",
  "l1-mr-8",
  "l1-mr-9",
  "l1-mr-10",
  "l1-mr-14",
  "l1-mr-15",
  "l1-mr-16",
  "l1-mr-17",
  "l1-mr-18",
  "l1-mr-19",
  "west-wing",
  "amphitheatre",
  "expo-hall-1",
  "expo-hall-2",
  "expo-hall-3",
  "expo-hall-4",
  "expo-hall-5",
  "expo-hall-6",
  "expo-hall-7",
  "expo-hall-8",
  "expo-hall-14",
  "ssb-chanakya",
  "ssb-nalanda",
  "ssb-shakuntalam",
]

export const EXPO_HALL_ZONES: VenueZone[] = [
  "expo-hall-1",
  "expo-hall-2",
  "expo-hall-3",
  "expo-hall-4",
  "expo-hall-5",
  "expo-hall-6",
  "expo-hall-7",
  "expo-hall-8",
  "expo-hall-14",
]

export function hallNumberToZone(hall: string): VenueZone | null {
  if (!hall || hall === "NA") return null
  const zone = `expo-hall-${hall}` as VenueZone
  return EXPO_HALL_ZONES.includes(zone) ? zone : null
}

export function zoneToHallNumber(zone: VenueZone): string | null {
  const match = zone.match(/^expo-hall-(\d+)$/)
  return match ? match[1] : null
}
