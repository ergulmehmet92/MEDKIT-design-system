import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge";
import { Avatar } from "./Avatar";

// An abstract sample portrait, so no real photo ships with the kit.
const portrait =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><radialGradient id="g" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#f1d79a"/><stop offset=".45" stop-color="#5b8a5f"/><stop offset="1" stop-color="#16271d"/></radialGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="40" r="16" fill="#0f1b14" opacity=".55"/><path d="M16 96c4-22 18-32 32-32s28 10 32 32z" fill="#0f1b14" opacity=".55"/></svg>`,
  );

const meta = { title: "Atoms/Avatar", component: Avatar, args: { name: "Mehmet Ergul" } } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", gap: "var(--mk-gap-md)", alignItems: "center", flexWrap: "wrap" } as const;

/** Board: image, initials, and a silhouette with no name, at three sizes. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--mk-gap-lg)" }}>
      {(["lg", "md", "sm"] as const).map((size) => (
        <div key={size} style={row}>
          <Avatar name="Sample portrait" src={portrait} size={size} />
          <Avatar name="Mehmet Ergul" size={size} />
          <Avatar name="Mehmet Ergul" src="missing.png" size={size} />
          <Avatar size={size} />
        </div>
      ))}
    </div>
  ),
};

/** Beside a written name the avatar is decorative, and a version badge sits with the name. */
export const WithName: Story = {
  render: () => (
    <div style={row}>
      <Avatar name="Mehmet Ergul" src={portrait} decorative />
      <div>
        <div style={{ fontSize: "var(--mk-font-size-lead)" }}>Mehmet Ergul</div>
        <div style={{ display: "flex", gap: "var(--mk-gap-sm)", alignItems: "center", color: "var(--mk-color-text-muted)" }}>
          Studio <Badge tone="version">v2.0.0</Badge>
        </div>
      </div>
    </div>
  ),
};

/** Badge tones: neutral, accent and version. Badges never report status. */
export const Badges: Story = {
  render: () => (
    <div style={row}>
      <Badge>Draft</Badge>
      <Badge>Sample</Badge>
      <Badge tone="accent">New</Badge>
      <Badge tone="version">v2.0.0</Badge>
    </div>
  ),
};
