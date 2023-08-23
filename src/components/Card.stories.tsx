import { Card } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Card> = {
  title: "components/Card",
  component: Card,
  parameters: {
    assets: ["./assets/4hv.org_.png"],
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {},
  parameters: {},
  render: () => {
    return <Card>Jello</Card>;
  },
};
