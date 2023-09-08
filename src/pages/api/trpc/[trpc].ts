import { createNextApiHandler } from "@trpc/server/adapters/next";
import { config } from "dotenv";
import { appRouter } from "../../../server/router/_app";
import { createContext } from "../../../server/trpc/context";

config();

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
