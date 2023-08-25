import { Flex, Image, Card as MantineCard, Text } from "@mantine/core";
import { PropsWithChildren } from "react";

type CardProps<T> = PropsWithChildren<T> & {
  title: string;
};

export function Card<T>({ title, children }: CardProps<T>) {
  return (
    <MantineCard
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
      <Flex
        style={{
          height: "18px",
          fontSize: "10px",
          fontFamily: "verdana, tahoma, arial, sans-serif",
          color: "#FFF",
          background: "linear-gradient(#c7d3e6 10%, #869ac0 40%, #8d9fc2 50%)",
          borderBottom: "1px solid black",
        }}
      >
        <Flex
          bg="linear-gradient(#6c7e9e 50%, #5b6c8e 50%)"
          gap="4px"
          align="center"
          h="100%"
          p="0 24px 0 4px"
          style={{ borderRadius: "0 11px 3px 0" }}
        >
          <Image
            alt="Blue circle"
            src="/images/bullet.png"
            height={10}
            width={10}
          />
          <Text>{title}</Text>
        </Flex>
      </Flex>
      <div style={{ padding: "4px 5px 5px 4px" }}> {children}</div>
    </MantineCard>
  );
}

// 4HV element background #DAE7F3
