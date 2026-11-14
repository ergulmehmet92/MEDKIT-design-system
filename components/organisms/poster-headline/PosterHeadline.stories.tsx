import type { Meta, StoryObj } from "@storybook/react-vite";
import { PosterHeadline } from "./PosterHeadline";

const meta = {
  title: "Organisms/PosterHeadline",
  component: PosterHeadline,
  decorators: [(Story) => <div style={{ maxInlineSize: 720 }}><Story /></div>],
  args: {
    byline: ["Mehmet Ergul", "[Thesis]", "The system that produces it"],
    children: (
      <>
        not
        <br />
        the
        <br />
        artifact
      </>
    ),
  },
} satisfies Meta<typeof PosterHeadline>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The Poster board: type cut through to the Blaze light, with a honey quarter circle. */
export const Poster: Story = {};

export const NoShape: Story = { args: { shape: "none" } };

/** Wide, for a section break. */
export const Wide: Story = { args: { ratio: "16 / 9", children: "Back to the core", byline: ["Chapter 3"], form: "dune" } };
