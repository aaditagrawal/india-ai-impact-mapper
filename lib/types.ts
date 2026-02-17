export type SessionStatus = "past" | "live" | "upcoming"

export type VenueZone =
  | "plenary-hall-a"
  | "plenary-hall-b"
  | "l3-plenary"
  | "l2-audi-1"
  | "l2-audi-2"
  | "l2-summit-room"
  | "l1-mr-6"
  | "l1-mr-7"
  | "l1-mr-8"
  | "l1-mr-9"
  | "l1-mr-10"
  | "l1-mr-14"
  | "l1-mr-15"
  | "l1-mr-16"
  | "l1-mr-17"
  | "l1-mr-18"
  | "l1-mr-19"
  | "west-wing"
  | "amphitheatre"
  | "expo-hall-3"
  | "expo-hall-4"
  | "expo-hall-5"
  | "ssb-chanakya"
  | "ssb-nalanda"
  | "ssb-shakuntalam"

export interface Speaker {
  id: number
  name: string
  title: string
  bio: string
}

export interface KnowledgePartner {
  id: number
  name: string
  image: string | null
}

export interface Session {
  id: number
  title: string
  description: string
  date: string
  formattedDate: string
  startTime: string | null
  formattedStartTime: string | null
  endTime: string | null
  formattedEndTime: string | null
  venue: string
  auditorium: string
  speakers: Speaker[]
  knowledgePartners: KnowledgePartner[]
  tags: string[]
  watchLiveUrl: string
}

export interface SummitData {
  event: string
  location: string
  dates: string
  sourceUrl: string
  scrapedAt: string
  totalSessions: number
  sessionsByDate: Record<string, number>
  sessions: Session[]
}

export interface FilterState {
  query: string
  date: string
  venue: string
  zone: VenueZone | ""
  tag: string
  timeSlot: string
  showPast: boolean
}

export type TimeSlot = "morning" | "afternoon" | "evening"
