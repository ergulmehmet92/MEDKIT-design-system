import type { Meta, StoryObj } from "@storybook/react-vite";
import { Metric } from "../../molecules/metric";
import { MetricRow } from "./MetricRow";

const meta = { title: "Organisms/MetricRow", component: MetricRow, subcomponents: { Metric } } satisfies Meta<typeof MetricRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const One: Story = { args: { children: <Metric value="12" label="weeks to production" /> } };
export const Two: Story = {
  args: {
    children: (
      <>
        <Metric value="12" label="weeks to production" />
        <Metric value="4,000+" label="customers at the keynote" />
      </>
    ),
  },
};
export const Four: Story = {
  args: {
    children: (
      <>
        <Metric value="12" label="weeks to production" />
        <Metric value="4,000+" label="customers at the keynote" />
        <Metric value="3" label="products" />
        <Metric value="1" label="designer" />
      </>
    ),
  },
};
export const LongValues: Story = {
  args: {
    children: (
      <>
        <Metric value="1,000,000,000+" label="a value much longer than the column it sits in, with a label that wraps too" />
        <Metric value="12" label="weeks" />
      </>
    ),
  },
};
