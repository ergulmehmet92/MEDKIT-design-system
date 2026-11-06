import type { Meta, StoryObj } from "@storybook/react-vite";
import { Treemap } from "./Treemap";

const meta = { title: "Organisms/Treemap", component: Treemap } satisfies Meta<typeof Treemap>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Board 2: holdings by theme, AI compute in the accent. */
export const Holdings: Story = {
  args: {
    title: "Two positions make up a sixth of everything.",
    label: "Holdings by theme, sized by weight, in percent",
    format: (v) => `${v}%`,
    groups: [
      { id: "ai", name: "AI compute", highlight: true, children: [{ id: "nvda", name: "NVDA", value: 9.8 }, { id: "tsm", name: "TSM", value: 7.1 }, { id: "avgo", name: "AVGO", value: 2.3 }] },
      { id: "power", name: "Power", children: [{ id: "vst", name: "VST", value: 5.6 }, { id: "ceg", name: "CEG", value: 5.2 }, { id: "nee", name: "NEE", value: 2.1 }] },
      { id: "grid", name: "Grid", children: [{ id: "etn", name: "ETN", value: 4.4 }, { id: "gev", name: "GEV", value: 3.1 }, { id: "pwr", name: "PWR", value: 1.9 }] },
      { id: "chips", name: "Chip equipment", children: [{ id: "asml", name: "ASML", value: 3.9 }, { id: "lrcx", name: "LRCX", value: 1.2 }] },
      { id: "cloud", name: "Cloud", children: [{ id: "msft", name: "MSFT", value: 3.6 }, { id: "eqix", name: "EQIX", value: 1.1 }] },
      { id: "nuclear", name: "Nuclear", children: [{ id: "ccj", name: "CCJ", value: 2.4 }, { id: "smr", name: "SMR", value: 1.4 }] },
    ],
  },
};

export const Empty: Story = { args: { title: "No holdings", label: "Holdings", groups: [] } };
