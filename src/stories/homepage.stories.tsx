import type { Meta, StoryObj } from "@storybook/react";
import Home from "../pages/index";

const meta: Meta<typeof Home> = {
  title: "pages/Home",
  component: Home,
  decorators: [],
  parameters: {
    assets: ["./assets/4hv.org_.png"],
    nextjs: {
      router: {
        basePath: "/",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Home>;

export const Default: Story = {};
