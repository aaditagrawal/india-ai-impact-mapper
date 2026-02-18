"use client"

import { memo } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { VenueZone, AppView } from "@/lib/types"
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
  view?: AppView
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
  countLabel?: string
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
  countLabel = "session",
}: ZoneRectProps) {
  const fill = getDensityColor(data.count, maxCount)
  const displayLabel = label ?? ZONE_LABELS[zone]
  const emphasized = isActive || isHovered
  const isEmpty = data.count === 0
  const cornerRadius = rx ?? 2

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g
          className="cursor-pointer"
          onClick={() => onZoneClick(zone)}
          onMouseEnter={() => onZoneHover(zone)}
          onMouseLeave={() => onZoneHover(null)}
          style={{
            transition: "opacity 200ms cubic-bezier(0.4,0,0.2,1)",
          }}
          opacity={emphasized ? 1 : undefined}
        >
          {/* Soft glow ring on active/hovered */}
          {emphasized && (
            <rect
              x={x - 2}
              y={y - 2}
              width={width + 4}
              height={height + 4}
              rx={cornerRadius + 2}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1}
              opacity={isActive ? 0.35 : 0.2}
              className="zone-transition"
            />
          )}
          {/* Main zone rect */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={cornerRadius}
            fill={isEmpty ? "url(#empty-zone-pattern)" : fill}
            stroke={emphasized ? "var(--primary)" : "var(--border)"}
            strokeWidth={isActive ? 2 : isHovered ? 1.5 : 0.5}
            className="zone-transition"
          />
          {/* Active state: inner highlight at top edge */}
          {isActive && (
            <rect
              x={x + 1}
              y={y + 1}
              width={width - 2}
              height={Math.min(height * 0.35, 14)}
              rx={Math.max(cornerRadius - 1, 1)}
              fill="white"
              opacity={0.12}
              style={{ pointerEvents: "none" }}
            />
          )}
          {data.hasLive && (
            <>
              <circle
                cx={x + width - 6}
                cy={y + 6}
                r={4.5}
                fill="var(--destructive)"
                opacity={0.2}
                className="animate-pulse"
              />
              <circle
                cx={x + width - 6}
                cy={y + 6}
                r={2.5}
                fill="var(--destructive)"
                className="animate-pulse"
              />
            </>
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
                {data.count} {data.count === 1 ? countLabel : `${countLabel}s`}
              </text>
            </>
          )}
        </g>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        <p className="font-medium">{ZONE_LABELS[zone]}</p>
        <p className="text-muted-foreground">
          {data.count} {data.count === 1 ? countLabel : `${countLabel}s`}
          {data.hasLive ? " · live now" : ""}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function Gate({ x, y, label, accent }: { x: number; y: number; label: string; accent?: boolean }) {
  const gateColor = accent ? "var(--primary)" : "var(--chart-2)"
  const gateOpacity = accent ? 0.65 : 0.5
  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Gate base */}
      <rect x={x} y={y + 3} width={14} height={7} rx={1} fill={gateColor} opacity={gateOpacity} />
      {/* Arch top */}
      <path
        d={`M${x},${y + 4} Q${x + 7},${y - 2} ${x + 14},${y + 4}`}
        fill={gateColor}
        opacity={gateOpacity * 0.7}
      />
      {/* Arch outline */}
      <path
        d={`M${x},${y + 4} Q${x + 7},${y - 2} ${x + 14},${y + 4}`}
        fill="none"
        stroke={gateColor}
        strokeWidth={0.5}
        opacity={gateOpacity}
      />
      {/* Door opening lines */}
      <line x1={x + 5} y1={y + 4} x2={x + 5} y2={y + 10} stroke="var(--card)" strokeWidth={0.5} opacity={0.6} />
      <line x1={x + 9} y1={y + 4} x2={x + 9} y2={y + 10} stroke="var(--card)" strokeWidth={0.5} opacity={0.6} />
      <text
        x={x + 7}
        y={y + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground text-[3px] font-bold"
        opacity={0.7}
      >
        G
      </text>
      <text
        x={x + 18}
        y={y + 7}
        dominantBaseline="middle"
        className={`text-[5px] ${accent ? "fill-foreground font-semibold" : "fill-muted-foreground"}`}
        opacity={accent ? 0.7 : 0.5}
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
  const r = rx ?? 2
  const cornerSize = 6
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={r}
        fill="var(--muted)"
        stroke="var(--border)"
        strokeWidth={0.5}
        opacity={0.4}
        strokeDasharray="3 2"
      />
      {/* Subtle crosshatch pattern inside */}
      {r < 10 && (
        <g opacity={0.06} clipPath={`inset(0 round ${r}px)`}>
          {Array.from({ length: Math.ceil((width + height) / 12) }, (_, i) => (
            <line
              key={i}
              x1={x + i * 12}
              y1={y}
              x2={x + i * 12 - height}
              y2={y + height}
              stroke="var(--foreground)"
              strokeWidth={0.5}
            />
          ))}
        </g>
      )}
      {/* Corner accents — small L-brackets at each corner */}
      {r < 10 && (
        <>
          {/* Top-left */}
          <path d={`M${x},${y + cornerSize} L${x},${y} L${x + cornerSize},${y}`} fill="none" stroke="var(--border)" strokeWidth={0.8} opacity={0.35} />
          {/* Top-right */}
          <path d={`M${x + width - cornerSize},${y} L${x + width},${y} L${x + width},${y + cornerSize}`} fill="none" stroke="var(--border)" strokeWidth={0.8} opacity={0.35} />
          {/* Bottom-left */}
          <path d={`M${x},${y + height - cornerSize} L${x},${y + height} L${x + cornerSize},${y + height}`} fill="none" stroke="var(--border)" strokeWidth={0.8} opacity={0.35} />
          {/* Bottom-right */}
          <path d={`M${x + width - cornerSize},${y + height} L${x + width},${y + height} L${x + width},${y + height - cornerSize}`} fill="none" stroke="var(--border)" strokeWidth={0.8} opacity={0.35} />
        </>
      )}
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground text-[7px] font-medium"
        opacity={0.5}
      >
        {label}
      </text>
    </g>
  )
}

function SectionLabel({
  x,
  y,
  children,
  sub,
  lineWidth = 40,
}: {
  x: number
  y: number
  children: string
  sub?: string
  lineWidth?: number
}) {
  // Approximate half-width of text for line placement
  const textHalfW = children.length * 3.2
  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Decorative lines flanking the label */}
      <line
        x1={x - textHalfW - 6}
        y1={y - 2}
        x2={x - textHalfW - 6 - lineWidth}
        y2={y - 2}
        stroke="var(--border)"
        strokeWidth={0.8}
        opacity={0.5}
      />
      <line
        x1={x + textHalfW + 6}
        y1={y - 2}
        x2={x + textHalfW + 6 + lineWidth}
        y2={y - 2}
        stroke="var(--border)"
        strokeWidth={0.8}
        opacity={0.5}
      />
      {/* Small diamond accents at line ends */}
      <circle
        cx={x - textHalfW - 6 - lineWidth}
        cy={y - 2}
        r={1.2}
        fill="var(--border)"
        opacity={0.5}
      />
      <circle
        cx={x + textHalfW + 6 + lineWidth}
        cy={y - 2}
        r={1.2}
        fill="var(--border)"
        opacity={0.5}
      />
      <text
        x={x}
        y={y}
        className="fill-foreground text-[8px] font-bold tracking-widest"
        textAnchor="middle"
      >
        {children}
      </text>
      {sub && (
        <text
          x={x}
          y={y + 11}
          className="fill-muted-foreground text-[5.5px]"
          textAnchor="middle"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

export const VenueMapSvg = memo(function VenueMapSvg({
  zoneData,
  activeZone,
  hoveredZone,
  onZoneClick,
  onZoneHover,
  maxCount,
  view = "sessions",
}: VenueMapSvgProps) {
  const isExhibitorView = view === "exhibitors"
  const itemLabel = isExhibitorView ? "exhibitor" : "session"

  const z = (zone: VenueZone) => ({
    zone,
    data: zoneData[zone] ?? { count: 0, hasLive: false },
    isActive: activeZone === zone,
    isHovered: hoveredZone === zone,
    maxCount,
    onZoneClick,
    onZoneHover,
    countLabel: itemLabel,
  })

  // BM building
  const bm = { x: 22, y: 80, w: 370, h: 405 }
  // Internal zone start
  const zi = { x: 40, y: 112 }
  const gap = 5
  const rowH = 42
  const mrW = 51
  const mrH = 34

  // Expo area
  const ex = { x: 500 }

  const svgHeight = isExhibitorView ? 660 : 660

  return (
    <svg
      viewBox={`0 0 920 ${svgHeight}`}
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Diagonal stripe pattern for empty zones (count === 0) */}
        <pattern id="empty-zone-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--muted)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--border)" strokeWidth="0.75" opacity="0.25" />
        </pattern>
      </defs>

      {/* ═══ BHARAT MANDAPAM ═══ */}
      {/* Building footprint */}
      <rect
        x={bm.x}
        y={bm.y}
        width={bm.w}
        height={bm.h}
        rx={12}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1}
      />
      {/* Subtle inner border for architectural depth */}
      <rect
        x={bm.x + 3}
        y={bm.y + 3}
        width={bm.w - 6}
        height={bm.h - 6}
        rx={10}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.3}
        opacity={0.25}
      />
      {/* Dome arch — double-line architectural effect */}
      <path
        d={`M${bm.x + 80},${bm.y} Q${bm.x + bm.w / 2},${bm.y - 30} ${bm.x + bm.w - 80},${bm.y}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={1}
        opacity={0.5}
      />
      <path
        d={`M${bm.x + 85},${bm.y} Q${bm.x + bm.w / 2},${bm.y - 24} ${bm.x + bm.w - 85},${bm.y}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.5}
        opacity={0.35}
      />
      {/* Dome endpoint circles */}
      <circle cx={bm.x + 80} cy={bm.y} r={2} fill="var(--border)" opacity={0.4} />
      <circle cx={bm.x + bm.w - 80} cy={bm.y} r={2} fill="var(--border)" opacity={0.4} />
      {/* Dome apex accent */}
      <circle cx={bm.x + bm.w / 2} cy={bm.y - 30} r={1.5} fill="var(--primary)" opacity={0.3} />
      <SectionLabel x={bm.x + bm.w / 2} y={bm.y - 6}>
        BHARAT MANDAPAM
      </SectionLabel>

      {/* Level labels */}
      <text x={zi.x - 14} y={zi.y + rowH / 2} className="fill-muted-foreground text-[5.5px] font-bold" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: "none" }}>
        L3
      </text>
      <text x={zi.x - 14} y={zi.y + rowH + gap + rowH / 2} className="fill-muted-foreground text-[5.5px] font-bold" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: "none" }}>
        L2
      </text>
      <text x={zi.x - 14} y={zi.y + (rowH + gap) * 2 + mrH + 4} className="fill-muted-foreground text-[5.5px] font-bold" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: "none" }}>
        L1
      </text>

      {/* Level 3 zones */}
      <ZoneRect x={zi.x} y={zi.y} width={107} height={rowH} {...z("plenary-hall-a")} />
      <ZoneRect x={zi.x + 107 + gap} y={zi.y} width={107} height={rowH} {...z("l3-plenary")} />
      <ZoneRect x={zi.x + 214 + gap * 2} y={zi.y} width={113} height={rowH} {...z("amphitheatre")} />

      {/* Level 2 zones */}
      <ZoneRect x={zi.x} y={zi.y + rowH + gap} width={107} height={rowH} {...z("l2-audi-1")} />
      <ZoneRect x={zi.x + 107 + gap} y={zi.y + rowH + gap} width={107} height={rowH} {...z("l2-audi-2")} />
      <ZoneRect x={zi.x + 214 + gap * 2} y={zi.y + rowH + gap} width={113} height={rowH} {...z("l2-summit-room")} />

      {/* Level 1 ─── Meeting Rooms */}
      <text x={zi.x} y={zi.y + (rowH + gap) * 2 + 2} className="fill-muted-foreground text-[5px]" style={{ pointerEvents: "none" }}>
        Meeting Rooms
      </text>

      {/* MR row 1: 6-10, 14 */}
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
          y={zi.y + (rowH + gap) * 2 + 10}
          width={mrW}
          height={mrH}
          label={label}
          compact
          {...z(zone)}
        />
      ))}

      {/* MR row 2: 15-19 */}
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
          y={zi.y + (rowH + gap) * 2 + 10 + mrH + gap}
          width={mrW}
          height={mrH}
          label={label}
          compact
          {...z(zone)}
        />
      ))}

      {/* West Wing */}
      <ZoneRect
        x={zi.x}
        y={zi.y + (rowH + gap) * 2 + 10 + (mrH + gap) * 2 + 8}
        width={170}
        height={38}
        label="West Wing (4A/4B/6)"
        {...z("west-wing")}
      />

      {/* ═══ PLENARY HALL B ═══ */}
      <ZoneRect
        x={410}
        y={195}
        width={58}
        height={108}
        label="Plenary B"
        {...z("plenary-hall-b")}
      />

      {/* ═══ WALKWAY BM to Expo ═══ */}
      {/* Wide path background */}
      <line x1={bm.x + bm.w - 20} y1={250} x2={410} y2={250} stroke="var(--border)" strokeWidth={10} strokeLinecap="round" opacity={0.12} />
      <line x1={468} y1={250} x2={ex.x} y2={200} stroke="var(--border)" strokeWidth={10} strokeLinecap="round" opacity={0.12} />
      {/* Path edge lines for walkway feel */}
      <line x1={bm.x + bm.w - 20} y1={245} x2={410} y2={245} stroke="var(--muted-foreground)" strokeWidth={0.4} opacity={0.2} />
      <line x1={bm.x + bm.w - 20} y1={255} x2={410} y2={255} stroke="var(--muted-foreground)" strokeWidth={0.4} opacity={0.2} />
      {/* Dashed center line */}
      <line x1={bm.x + bm.w - 20} y1={250} x2={410} y2={250} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="4 3" opacity={0.4} />
      <line x1={468} y1={250} x2={ex.x} y2={200} stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="4 3" opacity={0.4} />
      {/* Directional chevrons along horizontal segment */}
      {[0, 1, 2, 3].map((i) => {
        const cx = bm.x + bm.w - 10 + i * 22
        return (
          <path
            key={`chev-${i}`}
            d={`M${cx},${247} L${cx + 3},${250} L${cx},${253}`}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={0.6}
            opacity={0.25}
          />
        )
      })}
      {/* Walking figure icon */}
      <g style={{ pointerEvents: "none" }} opacity={0.35} transform="translate(420,240)">
        {/* Head */}
        <circle cx={0} cy={0} r={1.8} fill="var(--muted-foreground)" />
        {/* Body */}
        <line x1={0} y1={2} x2={0} y2={7} stroke="var(--muted-foreground)" strokeWidth={0.8} />
        {/* Arms */}
        <line x1={-2.5} y1={3.5} x2={2.5} y2={5} stroke="var(--muted-foreground)" strokeWidth={0.7} />
        {/* Left leg */}
        <line x1={0} y1={7} x2={-2} y2={11} stroke="var(--muted-foreground)" strokeWidth={0.7} />
        {/* Right leg */}
        <line x1={0} y1={7} x2={2.5} y2={10.5} stroke="var(--muted-foreground)" strokeWidth={0.7} />
      </g>
      {/* Walkway label */}
      <text x={440} y={236} className="fill-muted-foreground text-[4.5px]" textAnchor="middle" style={{ pointerEvents: "none" }} opacity={0.5}>
        Walkway
      </text>

      {/* ═══ EXPO HALLS ═══ */}
      <SectionLabel x={690} y={30}>
        EXPO AREA
      </SectionLabel>

      {/* Hall 6 */}
      {isExhibitorView ? (
        <ZoneRect x={ex.x} y={42} width={385} height={88} label="Hall 6" {...z("expo-hall-6")} />
      ) : (
        <DecoBuilding x={ex.x} y={42} width={385} height={88} label="Hall 6" />
      )}

      {/* Hall 5 (interactive) */}
      <ZoneRect
        x={ex.x}
        y={148}
        width={200}
        height={100}
        label="Hall 5"
        {...z("expo-hall-5")}
      />

      {/* Hall 4 (interactive) */}
      <ZoneRect
        x={ex.x + 200 + gap + 8}
        y={148}
        width={173}
        height={100}
        label="Hall 4"
        {...z("expo-hall-4")}
      />

      {/* Hall 3 (interactive) */}
      <ZoneRect
        x={ex.x + 200 + gap + 8}
        y={265}
        width={173}
        height={80}
        label="Hall 3"
        {...z("expo-hall-3")}
      />

      {/* Hall 2 */}
      {isExhibitorView ? (
        <ZoneRect x={ex.x} y={265} width={200} height={95} label="Hall 2" {...z("expo-hall-2")} />
      ) : (
        <DecoBuilding x={ex.x} y={265} width={200} height={95} label="Hall 2" />
      )}

      {/* Hall 1 */}
      {isExhibitorView ? (
        <ZoneRect x={ex.x + 30} y={385} width={325} height={140} label="Hall 1" rx={50} {...z("expo-hall-1")} />
      ) : (
        <DecoBuilding x={ex.x + 30} y={385} width={325} height={140} label="Hall 1" rx={50} />
      )}

      {/* Food Court markers */}
      {[
        { x: 435, y: 160 },
        { x: 480, y: 310 },
        { x: ex.x + 200 + 2, y: 260 },
      ].map((fc, i) => (
        <g key={i} style={{ pointerEvents: "none" }}>
          {/* Plate circle */}
          <circle cx={fc.x + 8} cy={fc.y + 7} r={8} fill="var(--chart-2)" opacity={0.2} />
          <circle cx={fc.x + 8} cy={fc.y + 7} r={8} fill="none" stroke="var(--chart-2)" strokeWidth={0.5} opacity={0.35} />
          {/* Fork icon (left) */}
          <line x1={fc.x + 4} y1={fc.y + 3} x2={fc.x + 4} y2={fc.y + 11} stroke="var(--foreground)" strokeWidth={0.5} opacity={0.4} />
          <line x1={fc.x + 3} y1={fc.y + 3} x2={fc.x + 3} y2={fc.y + 5.5} stroke="var(--foreground)" strokeWidth={0.4} opacity={0.35} />
          <line x1={fc.x + 5} y1={fc.y + 3} x2={fc.x + 5} y2={fc.y + 5.5} stroke="var(--foreground)" strokeWidth={0.4} opacity={0.35} />
          {/* Knife icon (right) */}
          <line x1={fc.x + 12} y1={fc.y + 3} x2={fc.x + 12} y2={fc.y + 11} stroke="var(--foreground)" strokeWidth={0.5} opacity={0.4} />
          <ellipse cx={fc.x + 12} cy={fc.y + 4.5} rx={1} ry={2} fill="none" stroke="var(--foreground)" strokeWidth={0.4} opacity={0.35} />
          <text x={fc.x + 8} y={fc.y + 7.5} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[3.5px] font-bold" opacity={0.45}>
            FC
          </text>
        </g>
      ))}

      {/* Halls 7, 8, 14 — only in exhibitor view */}
      {isExhibitorView && (
        <>
          <SectionLabel x={690} y={555}>
            ADDITIONAL HALLS
          </SectionLabel>
          <ZoneRect x={ex.x} y={568} width={120} height={60} label="Hall 7" {...z("expo-hall-7")} />
          <ZoneRect x={ex.x + 120 + gap} y={568} width={120} height={60} label="Hall 8" {...z("expo-hall-8")} />
          <ZoneRect x={ex.x + 240 + gap * 2} y={568} width={140} height={60} label="Hall 14" {...z("expo-hall-14")} />
        </>
      )}

      {/* ═══ GATES ═══ */}
      <Gate x={5} y={275} label="Gate 10" accent />
      <Gate x={95} y={bm.y + bm.h + 10} label="Gate 8" />
      <Gate x={230} y={bm.y + bm.h + 10} label="Gate 7" />
      <Gate x={400} y={bm.y + bm.h + 30} label="Gate 6" />
      <Gate x={ex.x + 10} y={540} label="Gate 5C" />
      <Gate x={ex.x + 385 - 10} y={435} label="Gate 5A" />
      <Gate x={ex.x + 385 - 10} y={265} label="Gate 4" />
      <Gate x={ex.x + 385 - 10} y={120} label="Gate 3" />
      <Gate x={ex.x + 340} y={28} label="Gate 1 & 2" accent />

      {/* ═══ SUSHMA SWARAJ BHAWAN (off-site) ═══ */}
      <rect
        x={22}
        y={555}
        width={370}
        height={95}
        rx={6}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={0.8}
        strokeDasharray="5 3"
        opacity={0.8}
      />
      {/* Inner border for architectural depth */}
      <rect
        x={25}
        y={558}
        width={364}
        height={89}
        rx={4}
        fill="none"
        stroke="var(--border)"
        strokeWidth={0.3}
        opacity={0.2}
      />
      {/* Corner bracket accents */}
      <path d="M22,565 L22,555 L32,555" fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.4} />
      <path d="M382,555 L392,555 L392,565" fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.4} />
      <path d="M22,640 L22,650 L32,650" fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.4} />
      <path d="M382,650 L392,650 L392,640" fill="none" stroke="var(--border)" strokeWidth={1} opacity={0.4} />
      <SectionLabel x={207} y={570} sub="Off-site venue">
        SUSHMA SWARAJ BHAWAN
      </SectionLabel>

      <ZoneRect x={32} y={586} width={110} height={50} {...z("ssb-chanakya")} />
      <ZoneRect x={32 + 110 + gap} y={586} width={110} height={50} {...z("ssb-nalanda")} />
      <ZoneRect x={32 + 220 + gap * 2} y={586} width={130} height={50} {...z("ssb-shakuntalam")} />
    </svg>
  )
})
