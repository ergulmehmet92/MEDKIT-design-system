import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactRoutes } from "./ContactRoutes";

const meta = { title: "Organisms/ContactRoutes", component: ContactRoutes } satisfies Meta<typeof ContactRoutes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    routes: [
      { label: "Talk about a role", href: "#role" },
      { label: "Start a project", href: "#project" },
      { label: "Invite me to speak", href: "#speak" },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    routes: [
      { label: "Invite me to speak at your conference about design engineering", href: "#speak" },
      { label: "Internationalisation", href: "#long-word" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};
