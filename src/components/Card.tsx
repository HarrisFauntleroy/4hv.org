import { Box, Flex, Image, Card as MantineCard, Text } from "@mantine/core";
import { CSSProperties, PropsWithChildren } from "react";

const cardHeaderStyle: CSSProperties = {
  height: "18px",
  fontSize: "10px",
  fontFamily: "verdana, tahoma, arial, sans-serif",
  color: "#FFF",
  background: "linear-gradient(#c7d3e6 10%, #869ac0 40%, #8d9fc2 50%)",
  borderBottom: "1px solid black",
};

const cardContentStyle: CSSProperties = {
  padding: "4px 5px 5px 4px",
  // boxShadow: "0 0 8px #000",
  flex: "1",
};

interface GridHeaderProps extends PropsWithChildren {
  title: string;
}

const GridHeader = ({ title, children }: GridHeaderProps) => (
  <Flex style={cardHeaderStyle}>
    <Flex
      bg="linear-gradient(#6c7e9e 50%, #5b6c8e 50%)"
      gap="4px"
      align="center"
      h="100%"
      pr="24px"
      style={{ borderRadius: "0 11px 3px 0" }}
    >
      <Image
        alt="Blue circle"
        width="16"
        height="16"
        src="/images/bullet2.gif"
      />
      <Text>{title}</Text>
    </Flex>
    {children}
  </Flex>
);

const GridContent = ({ children }: PropsWithChildren) => (
  <Box style={cardContentStyle}>{children}</Box>
);

export function Card<T>({ children }: PropsWithChildren<T>) {
  return (
    <MantineCard
      withBorder
      style={{
        fontFamily: "verdana, tahoma, arial, helvetica, sans-serif",
        fontSize: "10px",
        background: "#DAE7F3",
        color: "#000",
        borderRadius: "4px",
        boxShadow:
          "#505559 0px 0px 1px 2px, #5a5e62 0px 4px 6px -1px, #8b8d90 0px 1px 0px inset",
      }}
      p={0}
    >
      <GridHeader title="Members Birthdays:" />
      <GridContent> {children}</GridContent>
    </MantineCard>
  );
}

// 4HV element background #DAE7F3
