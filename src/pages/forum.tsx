import { Flex, Stack } from "@mantine/core";
import { Card } from "src/components/Card";
import { Forum, ForumWithSubforums } from "src/components/Forum";
import { Information } from "src/components/Information";
import Head from "../components/Head";
import { Loading } from "../components/Loading";
import { trpc } from "../utils/trpc";

const allForums = "forum.all";

const Forums = () => {
  const { data, status } = trpc.useQuery([allForums]);

  if (status === "loading") return <Loading />;

  return (
    <Card title="Forums">
      <Head />
      <Flex direction="column">
        <Stack spacing="8px" h="100%">
          {(data as ForumWithSubforums[])?.map((forum) => (
            <Forum key={forum.id} {...forum} />
          ))}
        </Stack>
      </Flex>
      <Information />
    </Card>
  );
};

export default Forums;
