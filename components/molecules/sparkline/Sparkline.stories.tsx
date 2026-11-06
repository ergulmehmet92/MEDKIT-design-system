import type { Meta, StoryObj } from "@storybook/react-vite";
import { predictorYear } from "../../organisms/line-chart/predictor.sample";
import { Sparkline } from "./Sparkline";

const year = predictorYear();
const quarter = year.port.slice(year.today - 63, year.today + 1);

const meta = { title: "Molecules/Sparkline", component: Sparkline, args: { label: "Portfolio, last 3 months", values: quarter } } satisfies Meta<typeof Sparkline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Context: Story = {};
export const Story_: Story = { name: "Story", args: { tone: "story", area: true } };
export const Wide: Story = { args: { width: 240, height: 40, area: true } };
export const AgainstAStart: Story = { args: { label: "Portfolio, indexed to 100", values: year.port.slice(0, year.today + 1), reference: 100 } };
export const Gaps: Story = { args: { values: quarter.map((v, i) => (i % 11 < 2 ? null : v)) } };
export const CrossesZero: Story = { args: { label: "Excess return", values: quarter.map((_, i) => 3 * Math.sin(i / 8)) } };
export const OneValue: Story = { args: { values: [42] } };
export const Empty: Story = { args: { values: [null, null] } };
