import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "components/Card",
  component: Card,
  parameters: {
    design: {
      type: "link",
      label: "4hv",
      url: "https://4hv.org/",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    title: "Example title",
  },
  render: (args) => {
    return (
      <Card {...args}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed ipsum
        arcu. Donec mattis est in nisl efficitur, molestie congue quam eleifend.
        Sed dignissim urna urna, eleifend aliquet augue sodales eget.
        Pellentesque quis tincidunt elit. Quisque ut nibh nisi. Morbi pharetra,
        justo at hendrerit fringilla, enim risus scelerisque arcu, sit amet
        pharetra metus est vitae diam. Integer erat velit, facilisis finibus
        euismod eget, consequat vitae elit. Pellentesque malesuada ligula lacus,
        sed sollicitudin eros fermentum eu. Pellentesque porta pulvinar luctus.
        Suspendisse nec leo ligula. Suspendisse eget dolor diam.
      </Card>
    );
  },
};
