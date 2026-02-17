export function VenueLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
      <span className="font-medium">Density:</span>
      <div className="flex items-center gap-1">
        <span>Low</span>
        {[
          "var(--chart-1)",
          "var(--chart-2)",
          "var(--chart-3)",
          "var(--chart-4)",
          "var(--chart-5)",
        ].map((color, i) => (
          <div
            key={i}
            className="size-3 border border-border"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>High</span>
      </div>
      <span className="hidden text-muted-foreground/60 sm:inline">Click a zone to filter</span>
    </div>
  )
}
