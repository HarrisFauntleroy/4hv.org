import { Stack } from "@mantine/core";
import { Card } from "src/components/Card";

const Home = () => {
  const news = [1];

  return (
    <Stack spacing="10px">
      {news.map(() => {
        return (
          <Card title="News" key="only-one">
            News
          </Card>
        );
      })}
    </Stack>
  );
};

export default Home;
