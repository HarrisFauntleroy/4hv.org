import { ColorScheme } from "@mantine/core";
import { type Role } from "@prisma/client";
import { getCookie } from "cookies-next";
import { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import NextApp, {
  type AppProps,
  type AppContext as NextJsAppContext,
} from "next/app";
import { ReactElement, ReactNode } from "react";
import SEO from "../../next-seo.config";
import { DefaultLayout } from "../components/Layout";
import { AppContext } from "../components/Providers";
import { trpc } from "../utils/trpc";
import Auth from "./auth";

function MyApp(properties: AppPropsWithLayout) {
  const { Component, pageProps } = properties;
  // initI18n();

  const getLayout =
    Component.getLayout ??
    ((page: ReactElement) =>
      Component.auth ? (
        <DefaultLayout>
          <Auth roles={Component.roles}>{page}</Auth>
        </DefaultLayout>
      ) : (
        <DefaultLayout>{page}</DefaultLayout>
      ));

  return (
    <SessionProvider session={pageProps.session}>
      <DefaultSeo {...SEO} />
      <AppContext>{getLayout(<Component {...pageProps} />)}</AppContext>
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext: NextJsAppContext) => {
  const appProperties = await NextApp.getInitialProps(appContext);
  return {
    ...appProperties,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "light",
  };
};

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: () => ReactNode;
  auth?: boolean;
  roles?: Role[];
};

export type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout;
  colorScheme: ColorScheme;
};

export default trpc.withTRPC(MyApp);
