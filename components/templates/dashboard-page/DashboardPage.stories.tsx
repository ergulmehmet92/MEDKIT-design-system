import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { CountUp } from "../../atoms/count-up";
import { signed } from "../../molecules/chart-frame/layout";
import { Gauge, GaugeSection } from "../../molecules/gauge";
import { clocks, cycleBands, tripwires } from "../../molecules/gauge/cycle.sample";
import { StatusPill } from "../../molecules/status-pill";
import { Tabs } from "../../molecules/tabs";
import { TrackBar } from "../../molecules/track-bar";
import { DataTable, type DataTableColumn } from "../../organisms/data-table";
import { positions, type Position } from "../../organisms/data-table/positions.sample";
import { LineChart } from "../../organisms/line-chart";
import { predictorYear } from "../../organisms/line-chart/predictor.sample";
import { Panel } from "../../organisms/panel";
import { DashboardPage } from "./DashboardPage";

const year = predictorYear();
const pct = (v: number) => `${v.toFixed(1)}%`;
const columns: DataTableColumn<Position>[] = [
  { id: "ticker", header: "Ticker" },
  { id: "theme", header: "Theme", muted: true },
  { id: "weight", header: "Weight", numeric: true, format: pct },
  {
    id: "range",
    header: "Against range",
    numeric: true,
    value: (r) => Math.max(r.weight - r.range[1], r.range[0] - r.weight, 0),
    cell: (r) => <TrackBar label={`${r.ticker} against its range`} value={r.weight} max={10} target={r.target} range={r.range} size="compact" format={pct} />,
  },
  { id: "today", header: "Today", numeric: true, direction: true, format: (v) => `${signed(v, 1)}%` },
];

const tile = (label: string, value: React.ReactNode, note: React.ReactNode) => (
  <Panel kind={label} footer={note}>
    <p style={{ margin: 0, fontSize: "var(--mk-font-size-subheading)", letterSpacing: "-0.02em" }}>{value}</p>
  </Panel>
);

type State = { rows: Position[]; loading?: boolean; chart: boolean; title?: string };

const dashboard = ({ rows, loading, chart, title = "Predictor" }: State) => (
  <DashboardPage
    title={title}
    meta="Fri 6 Nov 2026 · 07:15"
    actions={
      <>
        <StatusPill status="stale">Prices are 3 hours old</StatusPill>
        <Button>Record a call</Button>
      </>
    }
    tiles={
      <>
        {tile("Cycle state", <>3 <small style={{ fontSize: "var(--mk-font-size-body)" }}>of 4</small></>, "Late, overdue")}
        {tile("Portfolio, indexed", <CountUp value={122.9} />, "−8.2% from the October peak")}
        {tile("Invested", "64%", <TrackBar label="Invested against its range" value={64} max={100} range={[60, 70]} target={65} size="compact" />)}
        {tile("Hit rate", "58%", "−4 pts on last quarter")}
      </>
    }
    aside={
      <Panel kind="Cycle gauge" title="Late in the cycle, and overdue." titleAs="h2">
        <Gauge label="Cycle state" value={2.93} min={1} bands={cycleBands} reading="Reading 2.93 of 4">
          <GaugeSection title="Why: three clocks" aside="lateness, weighted" titleAs="h3">
            {clocks.map((c) => (
              <TrackBar key={c.name} label={c.name} value={c.lateness} max={100} readout={`${c.lateness}% late`} note={c.note} />
            ))}
          </GaugeSection>
          <GaugeSection title="Tripwires" aside="any one lit forces state 4" titleAs="h3">
            {tripwires.map((t) => (
              <TrackBar key={t.name} label={t.name} value={t.value} max={t.limit} limit={t.limit} format={t.format} note="Clear" />
            ))}
          </GaugeSection>
        </Gauge>
      </Panel>
    }
  >
    <Panel>
      {chart ? (
        <LineChart
          title="The portfolio sits below its peak, and the range ahead is wide."
          titleAs="h2"
          label="Portfolio and S&P 500, indexed to 100"
          x={year.days}
          series={[
            { id: "port", name: "Portfolio", values: year.port },
            { id: "bench", name: "S&P 500", values: year.bench, context: true },
          ]}
          forecast={year.forecast}
          today={year.today}
        />
      ) : (
        <LineChart titleAs="h2" title="No prices yet." label="Portfolio and S&P 500, indexed to 100" x={[]} series={[]} emptyText="Prices arrive after the first daily run." />
      )}
    </Panel>
    <Panel kind="Positions" title={rows.length ? "NVDA is over its range; LRCX is under." : "No positions yet."} titleAs="h2" footer="Sample data">
      <Tabs
        label="Position views"
        tabs={[
          { id: "all", label: "All", panel: <DataTable label="Positions by weight" columns={columns} rows={rows} rowKey={(r) => r.ticker} loading={loading} defaultSort={{ column: "weight", direction: "descending" }} maxRows={8} empty="Record a call to add your first position." /> },
          { id: "out", label: "Out of range", panel: <DataTable label="Positions out of range" columns={columns} rows={rows.filter((r) => r.weight > r.range[1] || r.weight < r.range[0])} rowKey={(r) => r.ticker} loading={loading} empty="Every position is inside its range." /> },
        ]}
      />
    </Panel>
  </DashboardPage>
);

const meta = { title: "Templates/DashboardPage", component: DashboardPage, parameters: { layout: "fullscreen", bare: true }, args: { title: "Predictor", children: null } } satisfies Meta<typeof DashboardPage>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Data board 3, assembled from the kit in analytical density. */
export const Real: Story = { render: () => dashboard({ rows: positions, chart: true }) };

/** The first morning: no prices, no positions. */
export const Empty: Story = { render: () => dashboard({ rows: [], chart: false }) };

/** While the daily run is still loading positions. */
export const Loading: Story = { render: () => dashboard({ rows: [], loading: true, chart: true }) };

/** A long page name and many positions. */
export const LongContent: Story = {
  render: () =>
    dashboard({
      title: "Predictor, with the very long name that someone typed into the settings and kept on typing",
      rows: [...positions, ...positions.map((p) => ({ ...p, ticker: `${p.ticker}.L` }))],
      chart: true,
    }),
};
