import { authOptions } from "../../pages/api/auth/[...nextauth]";

import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

/**
 * Wrapper for getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (context: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await getServerSession(context.req, context.res, authOptions);
};
