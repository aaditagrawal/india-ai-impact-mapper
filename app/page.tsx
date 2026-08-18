import { SummitApp } from "@/components/summit/summit-app";
import summitData from "@/data/india_ai_impact_summit_2026_sessions.json";
import exhibitorsData from "@/data/exhibitors.json";

export default function Page() {
  return <SummitApp data={summitData} exhibitors={exhibitorsData} />;
}
