import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../../createRouter";
import { prisma } from "../../prisma";

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  reactions: true,
  createdAt: true,
  updatedAt: true,
  archived: true,
  deleted: true,
  userId: true,
  user: true,
  comments: true,
  parent: true,
  parentId: true,
  thread: false,
  threadId: true,
});

export const commentRouter = createRouter()
  .mutation("create", {
    input: z.object({
      userId: z.string(),
      content: z.string(),
      threadId: z.string(),
    }),
    async resolve({ input }) {
      return prisma.comment.create({
        data: input,
        // include: defaultCommentSelect,
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

      return prisma.comment.findMany({
        where: {
          deleted: {
            equals: false,
          },
        },
        include: defaultCommentSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
        include: defaultCommentSelect,
      });
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No comment with id '${id}'`,
        });
      }
      return comment;
    },
  })
  .query("byUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const { userId } = input;
      const comment = await prisma.comment.findMany({
        where: {
          userId,
          deleted: {
            equals: false,
          },
        },
        include: defaultCommentSelect,
      });
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No comment with userId '${userId}'`,
        });
      }
      return comment;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      userId: z.string(),
      data: z.object({
        content: z.string(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      return prisma.comment.update({
        where: { id },
        data,
        include: defaultCommentSelect,
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
      await prisma.comment.update({
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
      await prisma.comment.update({
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
      await prisma.comment.update({
        where: { id },
        data: { archived: true },
      });
      return {
        id,
      };
    },
  });
