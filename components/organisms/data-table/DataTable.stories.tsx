import type { Meta, StoryObj } from "@storybook/react-vite";
import { LivingLight } from "../../atoms/living-light";
import { signed } from "../../molecules/chart-frame/layout";
import { Panel } from "../panel";
import { DataTable, type DataTableColumn } from "./DataTable";
import { closes, positions, type Close, type Position } from "./positions.sample";

const pct = (v: number) => `${v.toFixed(1)}%`;
const positionColumns: DataTableColumn<Position>[] = [
  { id: "ticker", header: "Ticker" },
  { id: "theme", header: "Theme", muted: true },
  { id: "weight", header: "Weight", numeric: true, format: pct },
  { id: "today", header: "Today", numeric: true, direction: true, format: (v) => `${signed(v, 1)}%` },
  { id: "year", header: "1 year", numeric: true, direction: true, format: (v) => `${signed(v, 0)}%` },
];

const meta = {
  title: "Organisms/DataTable",
  component: DataTable<Position>,
  decorators: [
    (Story, { globals }) => (
      <div style={{ position: "relative", isolation: "isolate", padding: "var(--mk-inset-lg)" }}>
        <LivingLight theme={globals.theme === "paper" ? "paper" : "forest"} />
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Positions by weight",
    columns: positionColumns,
    rows: positions,
    rowKey: (r: Position) => r.ticker,
    defaultSort: { column: "weight", direction: "descending" },
  },
  render: (args) => (
    <Panel kind="Positions" title="NVDA is over its range; LRCX is under." footer="Sample data">
      <DataTable {...args} />
    </Panel>
  ),
} satisfies Meta<typeof DataTable<Position>>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 3: sixteen positions, sorted by weight. Switch density to analytical for 36px rows. */
export const Positions: Story = {};

/** Rows hold their height while they load, and the header doesn't sort yet. */
export const Loading: Story = { args: { loading: true, loadingRows: 8 } };

/** The header stays, so the empty table still says what it will hold. */
export const Empty: Story = { args: { rows: [], empty: "Nothing has closed yet. A call lands here when you sell a position." } };

/** At 320px the table scrolls sideways, the ticker column stays put, and the edge fades while there is more. */
export const Narrow: Story = {
  render: (args) => (
    <div style={{ inlineSize: 320 }}>
      <Panel kind="Positions" title="At 320px">
        <DataTable {...args} />
      </Panel>
    </div>
  ),
};

const closeColumns: DataTableColumn<Close>[] = [
  { id: "date", header: "Date" },
  { id: "close", header: "Close", numeric: true },
  { id: "change", header: "Change", numeric: true, direction: true, format: (v) => `${signed(v, 2)}%` },
  { id: "volume", header: "Volume", numeric: true, format: (v) => `${v}M` },
];

/** A thousand rows in one scroll, sorted in one pass. */
export const ThousandRows: StoryObj<typeof DataTable<Close>> = {
  render: () => (
    <Panel kind="Daily closes" title="A thousand rows, one scroll" footer="Sample data">
      <DataTable label="Daily closes" columns={closeColumns} rows={closes(1000)} rowKey={(r) => r.date.toISOString()} defaultSort={{ column: "date", direction: "descending" }} maxRows={8} />
    </Panel>
  ),
};
