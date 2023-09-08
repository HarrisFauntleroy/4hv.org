import { publicProcedure, router } from "../trpc/trpc";
import { commentRouter } from "./comment";
import { forumRouter } from "./forum";
import { noteRouter } from "./note";
import { subForumRouter } from "./subForum";
import { threadRouter } from "./thread";
import { userRouter } from "./user";

// This is the root router that contains all other routers
export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  comment: commentRouter,
  forum: forumRouter,
  note: noteRouter,
  subForum: subForumRouter,
  thread: threadRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
