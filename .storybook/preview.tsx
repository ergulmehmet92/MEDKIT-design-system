import type { Preview } from "@storybook/react-vite";
import { LightSource } from "../components/atoms/button";
import "../dist/tokens/tokens.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        items: [
          { value: "forest", title: "Forest" },
          { value: "paper", title: "Paper" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "forest" },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    options: { storySort: { order: ["Atoms", "Molecules", "Organisms"] } },
  },
  decorators: [
    (Story, { globals, parameters }) => (
      <div
        data-theme={parameters.pinTheme === false ? undefined : globals.theme}
        style={{ minHeight: "100vh", padding: "var(--mk-inset-lg)" }}
      >
        <LightSource />
        <Story />
      </div>
    ),
  ],
};

export default preview;
