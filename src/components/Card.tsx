import { Card as MantineCard } from "@mantine/core";
import { PropsWithChildren } from "react";

export function Card<T>({ children }: PropsWithChildren<T>) {
  return (
    <MantineCard shadow="lg" withBorder style={{ background: "red" }}>
      {children}
    </MantineCard>
  );
}
