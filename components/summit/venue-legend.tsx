export function VenueLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">Sessions</span>
        <div className="flex items-center gap-0.5">
          <span className="text-[10px]">Low</span>
          {[
            "var(--chart-1)",
            "var(--chart-2)",
            "var(--chart-3)",
            "var(--chart-4)",
            "var(--chart-5)",
          ].map((color, i) => (
            <div
              key={i}
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-[10px]">High</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="size-2 rounded-full bg-destructive animate-pulse" />
        <span className="text-[10px]">Live</span>
      </div>
      <span className="hidden text-[10px] text-muted-foreground/40 sm:inline">Click zone to filter</span>
    </div>
  )
}
