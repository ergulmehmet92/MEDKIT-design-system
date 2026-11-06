import { heatSteps } from "./scale";
import type { HeatPalette, HeatScale } from "./scale";

/** The key for a heatmap: its steps in order, named at the ends and, when diverging, at the centre. */
export function HeatKey({ scale, palette = "polarity", lo, hi, centre, empty }: { scale: HeatScale; palette?: HeatPalette; lo: string; hi: string; centre?: string; empty?: string }) {
  const steps = heatSteps(scale, palette);
  return (
    <ul className="mk-chart-legend mk-heat-key">
      {empty ? (
        <li>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <rect className="mk-heat-cell" data-empty="" x="1" y="1" width="12" height="12" rx="2" />
          </svg>
          {empty}
        </li>
      ) : null}
      <li>
        {lo}
        <svg width={steps.length * 14} height="14" viewBox={`0 0 ${steps.length * 14} 14`} aria-hidden="true">
          {steps.map((c, k) => (
            <rect key={k} x={k * 14 + 1} y="1" width="12" height="12" rx="2" style={{ fill: c }} />
          ))}
        </svg>
        {hi}
        {centre !== undefined ? <span className="mk-heat-centre">, centred on {centre}</span> : null}
      </li>
    </ul>
  );
}
