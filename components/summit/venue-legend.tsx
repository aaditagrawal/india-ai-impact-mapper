import { classNames } from "@/app/ui.stylex";
import type { AppView } from "@/lib/types";

export function VenueLegend({ view = "sessions" }: { view?: AppView }) {
  const label = view === "exhibitors" ? "Exhibitors" : "Sessions";

  return (
    <div className={classNames.venueLegend122}>
      <div className={classNames.venueLegend123}>
        <span className={classNames.venueLegend124}>{label}</span>
        <div className={classNames.venueLegend125}>
          <span className={classNames.exhibitorCard47}>Low</span>
          <div className={classNames.venueLegend126} />
          <span className={classNames.exhibitorCard47}>High</span>
        </div>
      </div>
      {view === "sessions" && (
        <div className={classNames.venueLegend123}>
          <span className={classNames.venueLegend127}>
            <span className={classNames.venueLegend128} />
            <span className={classNames.venueLegend129} />
          </span>
          <span className={classNames.exhibitorCard47}>Live</span>
        </div>
      )}
      <span className={classNames.venueLegend130}>
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className={classNames.summitHeader119}
          aria-hidden="true"
        >
          <path d="M3 2l10 6-10 6V2z" />
        </svg>
        Click {view === "exhibitors" ? "hall" : "zone"} to filter
      </span>
    </div>
  );
}
