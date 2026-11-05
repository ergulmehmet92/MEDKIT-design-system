import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitch } from "../../molecules/theme-switch";
import { Header } from "./Header";

const links = ["Work", "Systems", "Experiments", "Writing", "Log"].map((label) => (
  <a key={label} href={`#${label.toLowerCase()}`}>
    {label}
  </a>
));

const meta = {
  title: "Organisms/Header",
  component: Header,
  args: { brand: <a href="#home">Mehmet Ergul</a>, actions: <ThemeSwitch />, children: links },
  parameters: { pinTheme: false },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const atWidth = (width: string): Story["decorators"] => [
  (Story) => (
    <div style={{ maxWidth: width }}>
      <Story />
    </div>
  ),
];

export const Default: Story = {};

export const Narrow: Story = { decorators: atWidth("20rem") };

export const Medium: Story = { decorators: atWidth("48rem") };

export const NoActions: Story = { args: { actions: undefined } };

export const BrandOnly: Story = { args: { actions: undefined, children: undefined } };

export const ManyLinks: Story = {
  args: {
    children: ["Work", "Systems", "Experiments", "Writing", "Log", "About", "Talks", "Contact"].map((label) => (
      <a key={label} href={`#${label.toLowerCase()}`}>
        {label}
      </a>
    )),
  },
};

export const LongBrand: Story = {
  args: { brand: <a href="#home">A much longer name that has to wrap at narrow widths</a> },
  decorators: atWidth("20rem"),
};
