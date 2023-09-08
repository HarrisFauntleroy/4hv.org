import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../../createRouter";
import { prisma } from "../../prisma";

const defaultThreadSelect = Prisma.validator<Prisma.ThreadSelect>()({
  id: true,
  title: true,
  content: true,
  comments: {
    include: {
      comments: true,
      user: true,
    },
  },
  status: true,
  createdAt: true,
  updatedAt: true,
  archived: true,
  deleted: true,
  userId: true,
  user: true,
  subforum: {
    select: {
      title: true,
      id: true,
    },
  },
  subforumId: true,
});

export const threadRouter = createRouter()
  // create
  .mutation("create", {
    input: z.object({
      userId: z.string(),
      title: z.string(),
      content: z.string(),
      subforumId: z.string(),
    }),
    async resolve({ input }) {
      return prisma.thread.create({
        data: input,
        // Don't really need to include, just invalidate the queries, ehh idk
        // select: defaultThreadSelect,
      });
    },
  })
  .query("all", {
    async resolve() {
      return prisma.thread.findMany({
        where: {
          deleted: {
            equals: false,
          },
        },
        select: defaultThreadSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const thread = await prisma.thread.findUnique({
        where: {
          id,
        },
        select: defaultThreadSelect,
      });
      if (!thread) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No thread with id '${id}'`,
        });
      }
      return thread;
    },
  })
  .query("byUser", {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ input }) {
      const { userId } = input;
      const thread = await prisma.thread.findMany({
        where: {
          userId,
          deleted: {
            equals: false,
          },
        },
        select: defaultThreadSelect,
      });
      if (!thread) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No thread with userId '${userId}'`,
        });
      }
      return thread;
    },
  })
  // update
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
      return prisma.thread.update({
        where: { id },
        data,
        select: defaultThreadSelect,
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
      await prisma.thread.update({
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
      await prisma.thread.update({
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
      await prisma.thread.update({
        where: { id },
        data: { archived: true },
      });
      return {
        id,
      };
    },
  });
