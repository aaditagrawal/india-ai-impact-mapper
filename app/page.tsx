import { SummitApp } from "@/components/summit/summit-app"
import summitData from "@/data/india_ai_impact_summit_2026_sessions.json"
import type { SummitData } from "@/lib/types"

export default function Page() {
  return <SummitApp data={summitData as SummitData} />
}
