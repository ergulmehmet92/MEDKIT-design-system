import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepRelay } from "./StepRelay";

const steps = [
  { title: "What is the problem?", description: "Name it in the user's words before anyone draws a screen." },
  { title: "Why does it exist?", description: "Follow it back to the decision, the data or the habit that made it." },
  { title: "How can I communicate it to a user?", description: "Find the smallest true sentence, then the picture that says it." },
  { title: "What is the optimal experience?", description: "Design for the path most people take, then for the edges." },
];

const meta = { title: "Molecules/StepRelay", component: StepRelay, args: { steps: steps.map(({ title }) => ({ title })) } } satisfies Meta<typeof StepRelay>;
export default meta;
type Story = StoryObj<typeof meta>;

/** The landing page's "Back to the core": a honey baton passed along the steps. */
export const Horizontal: Story = {};

/** Board: scroll the page and the marker rides 40% down the viewport; bring the pointer near the ruler and it snaps. */
export const Vertical: Story = {
  args: { orientation: "vertical", steps },
  decorators: [(Story) => <div style={{ maxInlineSize: 520, paddingBlock: "40vh 60vh" }}><Story /></div>],
};
