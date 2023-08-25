import NextHead from "next/head";
import { PropsWithChildren } from "react";

interface HeadProps extends PropsWithChildren {
  title?: string;
}

export default function Head({ title }: HeadProps) {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
  );
}
