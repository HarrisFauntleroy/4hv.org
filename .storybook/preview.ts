import type { Preview } from "@storybook/react";
import { ThemeWrapper } from "../src/stories/decorators";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [ThemeWrapper],
};

export default preview;
