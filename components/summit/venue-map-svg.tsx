"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { VenueZone } from "@/lib/types"
import { ZONE_LABELS } from "@/lib/auditorium-map"

interface ZoneData {
  count: number
  hasLive: boolean
}

interface VenueMapSvgProps {
  zoneData: Record<VenueZone, ZoneData>
  activeZone: VenueZone | ""
  hoveredZone: VenueZone | null
  onZoneClick: (zone: VenueZone) => void
  onZoneHover: (zone: VenueZone | null) => void
  maxCount: number
}

function getDensityColor(count: number, max: number): string {
  if (max === 0 || count === 0) return "var(--muted)"
  const ratio = count / max
  if (ratio > 0.8) return "var(--chart-5)"
  if (ratio > 0.6) return "var(--chart-4)"
  if (ratio > 0.4) return "var(--chart-3)"
  if (ratio > 0.2) return "var(--chart-2)"
  return "var(--chart-1)"
}

interface ZoneRectProps {
  zone: VenueZone
  x: number
  y: number
  width: number
  height: number
  data: ZoneData
  isActive: boolean
  isHovered: boolean
  maxCount: number
  onZoneClick: (zone: VenueZone) => void
  onZoneHover: (zone: VenueZone | null) => void
  label?: string
  compact?: boolean
  rx?: number
}

function ZoneRect({
  zone,
  x,
  y,
  width,
  height,
  data,
  isActive,
  isHovered,
  maxCount,
  onZoneClick,
  onZoneHover,
  label,
  compact,
  rx,
}: ZoneRectProps) {
  const fill = getDensityColor(data.count, maxCount)
  const displayLabel = label ?? ZONE_LABELS[zone]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g
          className="cursor-pointer"
          onClick={() => onZoneClick(zone)}
          onMouseEnter={() => onZoneHover(zone)}
          onMouseLeave={() => onZoneHover(null)}
        >
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={rx}
            fill={fill}
            stroke={
              isActive || isHovered ? "var(--primary)" : "var(--border)"
            }
            strokeWidth={isActive ? 2.5 : isHovered ? 2 : 0.5}
          />
          {data.hasLive && (
            <circle
              cx={x + width - 6}
              cy={y + 6}
              r={3}
              fill="var(--destructive)"
              className="animate-pulse"
            />
          )}
          {compact ? (
            <>
              <text
                x={x + width / 2}
                y={y + height / 2 - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[6.5px] font-semibold"
                style={{ pointerEvents: "none" }}
              >
                {displayLabel}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[5.5px]"
                style={{ pointerEvents: "none" }}
              >
                {data.count}
              </text>
            </>
          ) : (
            <>
              <text
                x={x + width / 2}
                y={y + height / 2 - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-[7px] font-medium"
                style={{ pointerEvents: "none" }}
              >
                {displayLabel.length > 18
                  ? displayLabel.slice(0, 18) + "..."
                  : displayLabel}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 7}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[6px]"
                style={{ pointerEvents: "none" }}
              >
                {data.count} {data.count === 1 ? "event" : "events"}
              </text>
            </>
          )}
        </g>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{ZONE_LABELS[zone]}</p>
        <p>
          {data.count} sessions{data.hasLive ? " (live now)" : ""}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function Gate({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect x={x} y={y} width={14} height={10} rx={1} fill="var(--chart-2)" opacity={0.7} />
      <text
        x={x + 7}
        y={y + 7}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground text-[3.5px] font-bold"
      >
        G
      </text>
      <text
        x={x + 18}
        y={y + 7}
        dominantBaseline="middle"
        className="fill-muted-foreground text-[5px]"
      >
        {label}
      </text>
    </g>
  )
}

function DecoBuilding({
  x,
  y,
  width,
  height,
  label,
  rx,
}: {
  x: number
  y: number
  width: number
  height: number
  label: string
  rx?: number
}) {
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        fill="var(--muted)"
        stroke="var(--border)"
        strokeWidth={0.5}
        opacity={0.6}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground text-[7px] font-medium"
        opacity={0.7}
      >
        {label}
      </text>
    </g>
  )
}

export function VenueMapSvg({
  zoneData,
  activeZone,
  hoveredZone,
  onZoneClick,
  onZoneHover,
  maxCount,
}: VenueMapSvgProps) {
  const z = (zone: VenueZone) => ({
    zone,
    data: zoneData[zone] ?? { count: 0, hasLive: false },
    isActive: activeZone === zone,
    isHovered: hoveredZone === zone,
    maxCount,
    onZoneClick,
    onZoneHover,
  })

  // BM building
  const bm = { x: 22, y: 80, w: 370, h: 405 }
  // Internal zone start
  const zi = { x: 40, y: 108 }
  const gap = 4
  const rowH = 42
  const mrW = 51
  const mrH = 32

  // Expo area
  const ex = { x: 500 }

  return (
    <svg
      viewBox="0 0 920 660"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ═══ BHARAT MANDAPAM (dome building) ═══ */}
      {/* Building footprint — rounded to suggest dome shape */}
      <rect
        x={bm.x}
        y={bm.y}
        width={bm.w}
        height={bm.h}
        rx={55}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      {/* Dome arch */}
      <path
        d={`M${bm.x + 80},${bm.y} Q${bm.x + bm.w / 2},${bm.y - 35} ${bm.x + bm.w - 80},${bm.y}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text
        x={bm.x + bm.w / 2}
        y={bm.y - 8}
        textAnchor="middle"
        className="fill-foreground text-[8px] font-bold tracking-widest"
      >
        BHARAT MANDAPAM
      </text>

      {/* Level 3 ─── */}
      <text x={zi.x - 12} y={zi.y + 8} className="fill-muted-foreground text-[5px] font-bold" style={{ writingMode: "vertical-rl" as never, pointerEvents: "none" }}>
        L3
      </text>
      <ZoneRect x={zi.x} y={zi.y} width={107} height={rowH} {...z("plenary-hall-a")} />
      <ZoneRect x={zi.x + 107 + gap} y={zi.y} width={107} height={rowH} {...z("l3-plenary")} />
      <ZoneRect x={zi.x + 214 + gap * 2} y={zi.y} width={113} height={rowH} {...z("amphitheatre")} />

      {/* Level 2 ─── */}
      <text x={zi.x - 12} y={zi.y + rowH + gap + 8} className="fill-muted-foreground text-[5px] font-bold" style={{ writingMode: "vertical-rl" as never, pointerEvents: "none" }}>
        L2
      </text>
      <ZoneRect x={zi.x} y={zi.y + rowH + gap} width={107} height={rowH} {...z("l2-audi-1")} />
      <ZoneRect x={zi.x + 107 + gap} y={zi.y + rowH + gap} width={107} height={rowH} {...z("l2-audi-2")} />
      <ZoneRect x={zi.x + 214 + gap * 2} y={zi.y + rowH + gap} width={113} height={rowH} {...z("l2-summit-room")} />

      {/* Level 1 ─── Meeting Rooms */}
      <text x={zi.x - 12} y={zi.y + (rowH + gap) * 2 + 10} className="fill-muted-foreground text-[5px] font-bold" style={{ writingMode: "vertical-rl" as never, pointerEvents: "none" }}>
        L1
      </text>
      <text x={zi.x} y={zi.y + (rowH + gap) * 2 + 2} className="fill-muted-foreground text-[5px]" style={{ pointerEvents: "none" }}>
        Meeting Rooms
      </text>

      {/* MR row 1: 6–10, 14 */}
      {(
        [
          ["l1-mr-6", "MR 6", 0],
          ["l1-mr-7", "MR 7", 1],
          ["l1-mr-8", "MR 8", 2],
          ["l1-mr-9", "MR 9", 3],
          ["l1-mr-10", "MR 10", 4],
          ["l1-mr-14", "MR 14", 5],
        ] as const
      ).map(([zone, label, i]) => (
        <ZoneRect
          key={zone}
          x={zi.x + i * (mrW + gap)}
          y={zi.y + (rowH + gap) * 2 + 8}
          width={mrW}
          height={mrH}
          label={label}
          compact
          {...z(zone)}
        />
      ))}

      {/* MR row 2: 15–19 */}
      {(
        [
          ["l1-mr-15", "MR 15", 0],
          ["l1-mr-16", "MR 16", 1],
          ["l1-mr-17", "MR 17", 2],
          ["l1-mr-18", "MR 18", 3],
          ["l1-mr-19", "MR 19", 4],
        ] as const
      ).map(([zone, label, i]) => (
        <ZoneRect
          key={zone}
          x={zi.x + i * (mrW + gap)}
          y={zi.y + (rowH + gap) * 2 + 8 + mrH + gap}
          width={mrW}
          height={mrH}
          label={label}
          compact
          {...z(zone)}
        />
      ))}

      {/* West Wing — bottom of BM */}
      <ZoneRect
        x={zi.x}
        y={zi.y + (rowH + gap) * 2 + 8 + (mrH + gap) * 2 + 8}
        width={170}
        height={38}
        label="West Wing (4A/4B/6)"
        {...z("west-wing")}
      />

      {/* ═══ PLENARY HALL B (separate building) ═══ */}
      <ZoneRect
        x={410}
        y={195}
        width={58}
        height={108}
        label="Plenary B"
        {...z("plenary-hall-b")}
      />

      {/* ═══ WALKWAY BM → Expo ═══ */}
      <line
        x1={bm.x + bm.w - 20}
        y1={250}
        x2={410}
        y2={250}
        stroke="var(--border)"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.2}
      />
      <line
        x1={468}
        y1={250}
        x2={ex.x}
        y2={200}
        stroke="var(--border)"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.2}
      />
      {/* path dashes */}
      <line
        x1={bm.x + bm.w - 20}
        y1={250}
        x2={410}
        y2={250}
        stroke="var(--muted-foreground)"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
      <line
        x1={468}
        y1={250}
        x2={ex.x}
        y2={200}
        stroke="var(--muted-foreground)"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />

      {/* ═══ EXPO HALLS ═══ */}
      <text
        x={690}
        y={32}
        textAnchor="middle"
        className="fill-foreground text-[8px] font-bold tracking-widest"
        style={{ pointerEvents: "none" }}
      >
        EXPO AREA
      </text>

      {/* Hall 6 — top, large (decorative, no sessions) */}
      <DecoBuilding x={ex.x} y={42} width={385} height={88} label="Hall 6" />

      {/* Hall 5 — mid-left, large (interactive) */}
      <ZoneRect
        x={ex.x}
        y={148}
        width={200}
        height={100}
        label="Hall 5"
        {...z("expo-hall-5")}
      />

      {/* Hall 4 — mid-right (interactive) */}
      <ZoneRect
        x={ex.x + 200 + gap + 8}
        y={148}
        width={173}
        height={100}
        label="Hall 4"
        {...z("expo-hall-4")}
      />

      {/* Hall 3 — below Hall 4 (interactive) */}
      <ZoneRect
        x={ex.x + 200 + gap + 8}
        y={265}
        width={173}
        height={80}
        label="Hall 3"
        {...z("expo-hall-3")}
      />

      {/* Hall 2 — below Hall 5 (decorative) */}
      <DecoBuilding x={ex.x} y={265} width={200} height={95} label="Hall 2" />

      {/* Hall 1 — bottom, large oval (decorative) */}
      <DecoBuilding x={ex.x + 30} y={385} width={325} height={140} label="Hall 1" rx={50} />

      {/* Food Court markers */}
      {[
        { x: 435, y: 160 },
        { x: 480, y: 310 },
        { x: ex.x + 200 + 2, y: 260 },
      ].map((fc, i) => (
        <g key={i} style={{ pointerEvents: "none" }}>
          <rect x={fc.x} y={fc.y} width={16} height={11} rx={2} fill="var(--chart-2)" opacity={0.5} />
          <text x={fc.x + 8} y={fc.y + 7.5} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[4px] font-bold" opacity={0.6}>
            FC
          </text>
        </g>
      ))}

      {/* ═══ GATES ═══ */}
      <Gate x={5} y={275} label="Gate 10" />
      <Gate x={95} y={bm.y + bm.h + 10} label="Gate 8" />
      <Gate x={230} y={bm.y + bm.h + 10} label="Gate 7" />
      <Gate x={400} y={bm.y + bm.h + 30} label="Gate 6" />
      <Gate x={ex.x + 10} y={540} label="Gate 5C" />
      <Gate x={ex.x + 385 - 10} y={435} label="Gate 5A" />
      <Gate x={ex.x + 385 - 10} y={265} label="Gate 4" />
      <Gate x={ex.x + 385 - 10} y={120} label="Gate 3" />
      <Gate x={ex.x + 340} y={28} label="Gate 1 & 2" />

      {/* ═══ SUSHMA SWARAJ BHAWAN (off-site) ═══ */}
      <rect
        x={22}
        y={555}
        width={370}
        height={95}
        rx={6}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={207}
        y={570}
        textAnchor="middle"
        className="fill-foreground text-[7px] font-bold tracking-wider"
        style={{ pointerEvents: "none" }}
      >
        SUSHMA SWARAJ BHAWAN
      </text>
      <text
        x={370}
        y={570}
        className="fill-muted-foreground text-[5px]"
        style={{ pointerEvents: "none" }}
      >
        (off-site)
      </text>

      <ZoneRect x={32} y={580} width={110} height={52} {...z("ssb-chanakya")} />
      <ZoneRect x={32 + 110 + gap} y={580} width={110} height={52} {...z("ssb-nalanda")} />
      <ZoneRect x={32 + 220 + gap * 2} y={580} width={130} height={52} {...z("ssb-shakuntalam")} />
    </svg>
  )
}
