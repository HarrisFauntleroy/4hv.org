import { Role } from "@prisma/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import type { AppType } from "next/dist/shared/lib/utils";
import type { FC, ReactElement, ReactNode } from "react";
import superjson from "superjson";
import SEO from "../../next-seo.config";
import { DefaultLayout as Layout } from "../components/Layout";
import { AppContext } from "../components/Providers";
import Auth from "../pages/auth";
import type { AppRouter } from "../server/routers/_app";
import type { SSRContext } from "../utils/trpc";

export interface DefaultPage extends FC {
  getLayout?: (page: ReactElement) => ReactNode;
  auth: boolean;
  roles: Role[];
}

type AppPropsWithLayout = AppProps & {
  Component: DefaultPage;
  session?: Session;
};

const MyApp = (({ Component, pageProps, session }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ??
    ((page) =>
      Component.auth ? (
        <Layout>
          <Auth roles={Component.roles}>{page}</Auth>
        </Layout>
      ) : (
        <Layout>{page}</Layout>
      ));

  return (
    <SessionProvider session={session}>
      <DefaultSeo {...SEO} />
      <AppContext>{getLayout(<Component {...pageProps} />)}</AppContext>
    </SessionProvider>
  );
}) as AppType;

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  // Reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // Assume localhost
  return `http://localhost:${process.env.APP_PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // Adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (options) =>
            process.env.NODE_ENV === "development" ||
            (options.direction === "down" && options.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  /**
   * Set headers or status code when doing SSR
   */
  responseMeta(options) {
    const ctx = options.ctx as SSRContext;

    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status,
      };
    }

    const error = options.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500,
      };
    }

    // For app caching with SSR see https://trpc.io/docs/caching
    return {};
  },
})(MyApp);
