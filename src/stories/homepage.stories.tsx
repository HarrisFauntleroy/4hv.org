import type { Meta, StoryObj } from "@storybook/react";
import Index from "../pages/index";

const meta: Meta<typeof Index> = {
  title: "section/changelog",
  component: Index,
  parameters: {
    assets: ["./assets/4hv.org_.png"],
  },
};

export default meta;
type Story = StoryObj<typeof Index>;

export const Primary: Story = {};
