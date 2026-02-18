import type { AppView } from "@/lib/types"

export function VenueLegend({ view = "sessions" }: { view?: AppView }) {
  const label = view === "exhibitors" ? "Exhibitors" : "Sessions"

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px]">Low</span>
          <div
            className="h-2 w-16 rounded-sm"
            style={{
              background:
                "linear-gradient(to right, var(--chart-1), var(--chart-2), var(--chart-3), var(--chart-4), var(--chart-5))",
            }}
          />
          <span className="text-[10px]">High</span>
        </div>
      </div>
      {view === "sessions" && (
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2.5 items-center justify-center">
            <span
              className="absolute size-full rounded-full bg-destructive/60"
              style={{ animation: "pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            />
            <span className="relative size-2 rounded-full bg-destructive" />
          </span>
          <span className="text-[10px]">Live</span>
        </div>
      )}
      <span className="hidden items-center gap-0.5 text-[10px] text-muted-foreground/40 sm:inline-flex">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-2.5"
          aria-hidden="true"
        >
          <path d="M3 2l10 6-10 6V2z" />
        </svg>
        Click {view === "exhibitors" ? "hall" : "zone"} to filter
      </span>
    </div>
  )
}
