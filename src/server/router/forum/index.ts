import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import logger from "../../../utils/logger";
import { InferQueryOutput } from "../../../utils/trpc";
import { createRouter } from "../../createRouter";
import { prisma } from "../../prisma";

const defaultForumSelect = Prisma.validator<Prisma.ForumSelect>()({
  id: true,
  title: true,
  subforums: {
    include: {
      threads: {
        include: {
          comments: {
            include: {
              comments: true,
            },
          },
        },
      },
    },
  },
  createdAt: true,
  updatedAt: true,
  archived: true,
  deleted: true,
  userId: true,
  user: true,
});

export type ForumWithRelations = InferQueryOutput<"forum.all">;

export const forumRouter = createRouter()
  // create
  .mutation("add", {
    input: z.object({
      userId: z.string(),
      title: z.string(),
    }),
    async resolve({ input }) {
      return prisma.forum.create({
        data: input,
        select: defaultForumSelect,
      });
    },
  })
  // read
  .query("all", {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.forum.findMany({
        where: {
          deleted: {
            equals: false,
          },
        },
        include: {
          user: true,
          subforums: {
            include: {
              user: true,
              threads: {
                include: {
                  user: true,
                  comments: {
                    include: {
                      user: true,
                      comments: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const forum = await prisma.forum.findUnique({
        where: {
          id,
        },
        select: defaultForumSelect,
      });
      if (!forum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No forum with id '${id}'`,
        });
      }
      return forum;
    },
  })
  .query("byUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const { userId } = input;
      const forum = await prisma.forum.findMany({
        where: {
          userId,
          deleted: {
            equals: false,
          },
        },
        include: {
          subforums: {
            include: {
              threads: {
                include: {
                  comments: {
                    include: {
                      comments: true,
                    },
                  },
                },
              },
            },
          },
          user: true,
        },
      });
      if (!forum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No forum with userId '${userId}'`,
        });
      }
      logger.info(forum);
      return forum;
    },
  })
  // update
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      userId: z.string(),
      data: z.object({
        title: z.string(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      return prisma.forum.update({
        where: { id },
        data,
        select: defaultForumSelect,
      });
    },
  })
  // delete
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.forum.update({
        where: { id },
        data: { deleted: true },
      });
      return {
        id,
      };
    },
  })
  // unarchive
  .mutation("unarchive", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.forum.update({
        where: { id },
        data: { archived: false },
      });
      return {
        id,
      };
    },
  })
  // archive
  .mutation("archive", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.forum.update({
        where: { id },
        data: { archived: true },
      });
      return {
        id,
      };
    },
  });
