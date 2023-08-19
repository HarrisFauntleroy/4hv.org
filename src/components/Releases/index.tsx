import { Avatar, Text, Timeline, Title } from "@mantine/core";
import { Endpoints } from "@octokit/types";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";

const Markdown = dynamic(
  () =>
    import("@harrisfauntleroy/design-system").then(({ Markdown }) => Markdown),
  { ssr: false }
);

type Props = { repo: string };

type ListRepositoryReleasesResponse =
  Endpoints["GET /repos/{owner}/{repo}/releases"]["response"];

export type ReleaseData = ListRepositoryReleasesResponse["data"];

export function Releases({ repo }: Props) {
  const [data, setData] = useState<ReleaseData>();

  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}/releases`, {
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        return console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [repo]);

  return (
    <Timeline active={1} bulletSize={24} lineWidth={2}>
      {data?.slice(0, 3).map((release) => (
        <Timeline.Item
          key={release.id}
          bullet={<Avatar src={release.author.avatar_url} radius="xl" />}
          title={
            <Text>
              Alchemical Finance
              {" - "}
              {release.tag_name}
            </Text>
          }
        >
          <Markdown colorScheme="light" source={String(release.body)} />
          <Text
            color="dimmed"
            size="sm"
            variant="link"
            component="span"
            inherit
          >
            {format(new Date(release.published_at || ""), "MMM dd, yyyy")}
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export function Changelog({ repo }: Props) {
  return (
    <Fragment>
      <Title order={1} mb="16px">
        News
      </Title>
      <Releases repo={repo} />
    </Fragment>
  );
}
